// Palengke Helper+ Admin - Market Prices Management
// The shared Supabase client (supabaseClient) is loaded from ../supabase.js.
let parsedRows = [];
let currentSession = null;

// Replace with the URL of your deployed Cloudflare Worker (workers/da-proxy.js)
const DA_PROXY_URL = 'https://YOUR_DA_PROXY_WORKER.workers.dev';

// ================== AUTH ==================

document.getElementById('adminLoginBtn').addEventListener('click', loginAdmin);
document.getElementById('logoutBtn').addEventListener('click', logoutAdmin);

document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginAdmin();
});

async function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errorEl = document.getElementById('loginError');

    // Clear any leftover session so signInWithPassword returns a fresh JWT
    await supabaseClient.auth.signOut({ scope: 'local' }).catch(() => {});

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
        return;
    }

    // Verify admin role in user metadata
    const role = data.user?.app_metadata?.role;
    if (role !== 'admin') {
        errorEl.textContent = 'This account does not have admin privileges.';
        errorEl.classList.remove('hidden');
        await supabaseClient.auth.signOut();
        return;
    }

    // Ensure the profiles row is marked admin so RLS can authorize writes
    const { error: profileError } = await supabaseClient
        .from('profiles')
        .upsert({
            id: data.user.id,
            role: 'admin',
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
    if (profileError) console.error('Profile upsert error:', profileError);

    currentSession = data.session;
    showDashboard();
}

async function logoutAdmin() {
    await supabaseClient.auth.signOut();
    currentSession = null;
    showLogin();
}

function showDashboard() {
    document.getElementById('loginPanel').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    // Default date to today
    document.getElementById('priceDate').valueAsDate = new Date();
    loadUsers();
}

function showLogin() {
    document.getElementById('loginPanel').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
}

// ================== PDF UPLOAD & PARSE ==================

document.getElementById('pdfInput').addEventListener('change', handlePdfUpload);

async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('uploadProgress');
    const statusEl = document.getElementById('uploadStatus');

    progressContainer.classList.remove('hidden');
    progressBar.style.width = '20%';
    statusEl.textContent = 'Reading PDF...';

    try {
        const arrayBuffer = await file.arrayBuffer();
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        progressBar.style.width = '50%';
        statusEl.textContent = `Extracting text from ${pdf.numPages} pages...`;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // pdf.js returns individual text fragments. Reassemble them into
            // horizontal lines by grouping on the Y coordinate, so trailing
            // prices and wrapped item names parse correctly.
            const textItems = textContent.items
                .filter(item => typeof item.str === 'string')
                .map(item => ({
                    str: item.str,
                    x: item.transform[4],
                    y: Math.round(item.transform[5])
                }));

            const linesByY = new Map();
            textItems.forEach(item => {
                if (!linesByY.has(item.y)) linesByY.set(item.y, []);
                linesByY.get(item.y).push(item);
            });

            const sortedYs = Array.from(linesByY.keys()).sort((a, b) => b - a);
            const pageLines = sortedYs.map(y => {
                const lineItems = linesByY.get(y).sort((a, b) => a.x - b.x);
                return lineItems.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
            }).filter(line => line);

            fullText += pageLines.join('\n') + '\n';
        }

        progressBar.style.width = '80%';
        statusEl.textContent = 'Parsing prices...';

        parsedRows = parseBantayPresyoText(fullText);
        renderParsedTable();

        progressBar.style.width = '100%';
        statusEl.textContent = `Parsed ${parsedRows.length} items. Review and publish when ready.`;
        document.getElementById('publishBtn').disabled = parsedRows.length === 0;
    } catch (err) {
        console.error(err);
        statusEl.textContent = 'Error parsing PDF. Try a different file or add rows manually.';
        statusEl.classList.add('text-red-500');
    }
}

// Parser for the DA Bantay Presyo Daily Price Index PDF layout.
// Detects section headers, reads each commodity line with a trailing single price,
// and skips header/footer lines, page numbers, and n/a entries.
function parseBantayPresyoText(text) {
    const rows = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    const skipPatterns = [
        /^Page \d+ of \d+/i,
        /^Department of Agriculture/i,
        /^DAILY PRICE INDEX/i,
        /^National Capital Region/i,
        /^Prevailing Retail Price of Agri-fishery Commodities/i,
        /^COMMODITY SPECIFICATION/i,
        /^PREVAILING\b/i,
        /^RETAIL PRICE PER/i,
        /^UNIT\b/i,
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b.*\b20\d{2}\b/i
    ];

    const categoryMap = {
        'IMPORTED COMMERCIAL RICE': 'rice',
        'LOCAL COMMERCIAL RICE': 'rice',
        'NFA RICE': 'rice',
        'CORN PRODUCTS': 'other food',
        'LEGUMES': 'other food',
        'FISH PRODUCTS': 'fish',
        'BEEF MEAT PRODUCTS': 'meat',
        'PORK MEAT PRODUCTS': 'meat',
        'POULTRY MEAT PRODUCTS': 'meat',
        'OTHER LIVESTOCK MEAT PRODUCTS': 'meat',
        'VEGETABLES': 'vegetables',
        'FRUITS': 'fruits',
        'SPICES': 'spices',
        'CONDIMENTS': 'spices',
        'HOUSEHOLD': 'household'
    };

    const unitRegex = /\b(kg|kilo|kilogram|pc|piece|pieces|tray|litro|liter|bottle|can|pack|sack)\b/i;
    const trailingPriceRegex = /(\d+(?:\.\d{1,2})?)\s*$/;

    function shouldSkip(line) {
        return skipPatterns.some(p => p.test(line));
    }

    function isHeaderFragment(line) {
        const letters = line.replace(/[^A-Za-z\s]/g, '').trim();
        return letters.length > 2 && letters === letters.toUpperCase();
    }

    function normalizeHeader(line) {
        return line.replace(/[^A-Za-z\s]/g, ' ').toUpperCase().replace(/\s+/g, ' ').trim();
    }

    function extractUnit(line) {
        const m = line.match(unitRegex);
        if (!m) return 'kg';
        let u = m[1].toLowerCase();
        if (u === 'kilo' || u === 'kilogram') u = 'kg';
        if (u === 'piece' || u === 'pieces') u = 'pc';
        if (u === 'liter') u = 'litro';
        return u;
    }

    let currentCategory = 'other food';
    let pendingHeader = '';
    let pendingName = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Skip obvious headers/footers immediately
        if (shouldSkip(line)) {
            pendingHeader = '';
            continue;
        }

        // Accumulate and map uppercase section headers (handles multi-line headers)
        if (isHeaderFragment(line)) {
            pendingHeader = (pendingHeader + ' ' + line).trim();
            continue;
        }

        if (pendingHeader) {
            const headerKey = normalizeHeader(pendingHeader);
            if (categoryMap[headerKey]) {
                currentCategory = categoryMap[headerKey];
            }
            pendingHeader = '';
        }

        // Skip n/a-only lines while consuming a pending name fragment
        if (/\bn\/a\b$/i.test(line)) {
            pendingName = '';
            continue;
        }

        const priceMatch = line.match(trailingPriceRegex);
        if (!priceMatch) {
            // This is likely a continuation of an item name (e.g., wrapped line)
            pendingName = (pendingName + ' ' + line).trim();
            continue;
        }

        const price = parseFloat(priceMatch[1]);
        if (isNaN(price)) {
            pendingName = '';
            continue;
        }

        const itemPart = line.substring(0, priceMatch.index).trim();
        const itemName = (pendingName + ' ' + itemPart).trim().replace(/\s+/g, ' ').replace(/[,;]$/, '');
        pendingName = '';

        if (!itemName || itemName.length < 2) continue;

        // Ignore leftover page/date fragments that slipped through
        if (/^Page \d+\b/i.test(itemName) || /^\(.*\d{4}\)/.test(itemName)) continue;

        rows.push({
            id: crypto.randomUUID(),
            item_name: itemName,
            category: currentCategory,
            unit: extractUnit(itemName),
            price_min: price,
            price_max: price,
            notes: ''
        });
    }

    return rows;
}

// ================== MANUAL REVIEW TABLE ==================

function renderParsedTable() {
    const tbody = document.getElementById('parsedDataTable');
    tbody.innerHTML = '';

    if (parsedRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400">Upload a PDF to see parsed data, or add rows manually.</td></tr>`;
        document.getElementById('publishBtn').disabled = true;
        return;
    }

    parsedRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-3"><input type="text" data-idx="${index}" data-field="item_name" value="${escapeHtml(row.item_name)}" class="w-full border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3">
                <select data-idx="${index}" data-field="category" class="w-full border border-gray-200 rounded px-2 py-1 text-sm">
                    ${['rice','meat','fish','vegetables','fruits','spices','other food','household'].map(c => `<option value="${c}" ${row.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </td>
            <td class="p-3"><input type="text" data-idx="${index}" data-field="unit" value="${escapeHtml(row.unit)}" class="w-20 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="number" data-idx="${index}" data-field="price_min" value="${row.price_min}" class="w-24 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="number" data-idx="${index}" data-field="price_max" value="${row.price_max}" class="w-24 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="text" data-idx="${index}" data-field="notes" value="${escapeHtml(row.notes || '')}" class="w-full border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><button data-idx="${index}" class="delete-row text-red-500 hover:text-red-700 text-sm">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    attachTableListeners();
    document.getElementById('publishBtn').disabled = false;
}

function attachTableListeners() {
    document.querySelectorAll('#parsedDataTable input, #parsedDataTable select').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const field = e.target.dataset.field;
            let value = e.target.value;
            if (field === 'price_min' || field === 'price_max') value = parseFloat(value) || 0;
            parsedRows[idx][field] = value;
        });
    });

    document.querySelectorAll('.delete-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            parsedRows.splice(idx, 1);
            renderParsedTable();
        });
    });
}

document.getElementById('addManualRowBtn').addEventListener('click', () => {
    parsedRows.push({
        id: crypto.randomUUID(),
        item_name: '',
        category: 'vegetables',
        unit: 'kg',
        price_min: 0,
        price_max: 0,
        notes: ''
    });
    renderParsedTable();
});

document.getElementById('daFetchBtn').addEventListener('click', fetchDAPrices);

async function fetchDAPrices() {
    const statusEl = document.getElementById('daFetchStatus');
    const commodity = document.getElementById('daCommodity').value;
    const market = document.getElementById('daMarket').value;
    const region = document.getElementById('daRegion').value.trim();

    if (DA_PROXY_URL.includes('YOUR_DA_PROXY')) {
        statusEl.textContent = 'Set DA_PROXY_URL in admin.js to your deployed Cloudflare Worker URL first.';
        statusEl.className = 'text-sm mt-2 text-red-500';
        statusEl.classList.remove('hidden');
        return;
    }

    statusEl.textContent = 'Fetching prices from DA Bantay Presyo...';
    statusEl.className = 'text-sm mt-2 text-emerald-600';
    statusEl.classList.remove('hidden');

    try {
        const url = `${DA_PROXY_URL}?region=${encodeURIComponent(region)}&commodity=${encodeURIComponent(commodity)}&market=${encodeURIComponent(market)}`;
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        if (!data.rows || data.rows.length === 0) throw new Error('No prices returned for this market/commodity');

        const date = data.date || new Date().toISOString().split('T')[0];
        document.getElementById('priceDate').value = date;

        data.rows.forEach(r => {
            parsedRows.push({
                id: crypto.randomUUID(),
                item_name: r.item_name,
                category: r.category,
                unit: r.unit,
                price_min: r.price_min,
                price_max: r.price_max,
                notes: r.notes
            });
        });

        renderParsedTable();
        statusEl.textContent = `Loaded ${data.rows.length} prices from ${data.market} (${data.date}).`;
        statusEl.className = 'text-sm mt-2 text-emerald-600';
    } catch (err) {
        console.error(err);
        statusEl.textContent = 'Error fetching DA prices: ' + err.message;
        statusEl.className = 'text-sm mt-2 text-red-500';
    }
}

// ================== PUBLISH ==================

document.getElementById('publishBtn').addEventListener('click', publishPrices);

async function publishPrices() {
    const statusEl = document.getElementById('publishStatus');
    const date = document.getElementById('priceDate').value || new Date().toISOString().split('T')[0];
    const publishBtn = document.getElementById('publishBtn');

    if (!currentSession) {
        statusEl.textContent = 'You must be logged in as admin to publish.';
        statusEl.className = 'text-sm mt-3 text-red-500';
        statusEl.classList.remove('hidden');
        return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing...';

    const validRows = parsedRows.filter(r => r.item_name.trim() && r.price_min > 0 && r.price_max > 0);
    if (validRows.length === 0) {
        statusEl.textContent = 'No valid rows to publish.';
        statusEl.className = 'text-sm mt-3 text-red-500';
        statusEl.classList.remove('hidden');
        publishBtn.disabled = false;
        publishBtn.textContent = 'Publish Market Prices';
        return;
    }

    try {
        // Refresh the session so the admin JWT is current before the admin-only RPC
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError || !sessionData.session) throw new Error('Admin session expired. Please log in again.');

        const newRows = validRows.map(r => ({
            source_date: date,
            item_name: r.item_name.trim(),
            category: r.category,
            unit: r.unit,
            price_min: r.price_min,
            price_max: r.price_max,
            notes: r.notes
        }));

        const { data: count, error: publishError } = await supabaseClient
            .rpc('publish_market_prices', { rows: newRows });

        if (publishError) throw publishError;

        statusEl.textContent = `Success! Published ${count} prices for ${date}.`;
        statusEl.className = 'text-sm mt-3 text-emerald-600';
        statusEl.classList.remove('hidden');
        publishBtn.textContent = 'Published';
    } catch (err) {
        console.error(err);
        statusEl.textContent = 'Error publishing: ' + err.message;
        statusEl.className = 'text-sm mt-3 text-red-500';
        statusEl.classList.remove('hidden');
        publishBtn.disabled = false;
        publishBtn.textContent = 'Publish Market Prices';
    }
}

async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">Loading users...</td></tr>';
    try {
        const { data, error } = await supabaseClient.from('profiles').select('id, role, created_at');
        if (error) throw error;
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">No users found.</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        data.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-3 font-mono text-xs text-gray-600">${escapeHtml(u.id ? u.id.slice(0, 12) + '...' : '')}</td>
                <td class="p-3 capitalize">${escapeHtml(u.role || 'user')}</td>
                <td class="p-3 text-gray-500 text-xs">${u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-500">Could not load users: ' + escapeHtml(err.message) + '</td></tr>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Check existing session on load
supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session && data.session.user?.app_metadata?.role === 'admin') {
        currentSession = data.session;
        showDashboard();
    }
});
