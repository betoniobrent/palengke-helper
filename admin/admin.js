// Palengke Helper+ Admin - Market Prices Management
// IMPORTANT: Replace with your Supabase credentials before deploying.
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let parsedRows = [];
let currentSession = null;

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
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
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

// Generic parser for DA Bantay Presyo-like text
// Customize regex patterns below to match your PDF layout.
function parseBantayPresyoText(text) {
    const rows = [];
    const lines = text.split('\n');

    const categories = [
        { key: 'rice', names: ['rice', 'bigas', 'nfa rice', 'well-milled rice', 'regular-milled rice'] },
        { key: 'meat', names: ['meat', 'beef', 'pork', 'chicken', 'pork liempo', 'beef brisket', 'whole chicken'] },
        { key: 'fish', names: ['fish', 'bangus', 'tilapia', 'galunggong', 'tuna', 'maya-maya', 'salmon'] },
        { key: 'vegetables', names: ['vegetables', 'gulay', 'ampalaya', 'talong', 'okra', 'sitaw', 'kangkong', 'sayote', 'carrots'] },
        { key: 'fruits', names: ['fruits', 'prutas', 'banana', 'mango', 'apple', 'pineapple', 'papaya', 'kalamansi'] },
        { key: 'spices', names: ['spices', 'condiments', 'bawang', 'sibuyas', 'paminta', 'vinegar', 'soy sauce', 'patis'] },
        { key: 'household', names: ['household', 'lpg', 'kerosene', 'charcoal', 'bath soap', 'detergent'] }
    ];

    const unitRegex = /(kg|kilo|kilogram|pc|piece|pieces|tray|litro|liter|can|bottle|pack|sack|g)/i;
    const priceRegex = /(?:Php?|₱|\$)?\s*(\d+(?:\.\d{1,2})?)\s*(?:-|\s+to\s+)\s*(?:Php?|₱|\$)?\s*(\d+(?:\.\d{1,2})?)/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.length < 5) continue;

        const priceMatch = line.match(priceRegex);
        if (!priceMatch) continue;

        const min = parseFloat(priceMatch[1]);
        const max = parseFloat(priceMatch[2]);
        if (isNaN(min) || isNaN(max)) continue;

        let itemName = line.substring(0, priceMatch.index).trim();
        itemName = itemName.replace(/\s+/g, ' ').replace(/[,;]$/, '');
        if (!itemName) continue;

        const lower = itemName.toLowerCase();
        const unitMatch = lower.match(unitRegex);
        let unit = unitMatch ? unitMatch[1].toLowerCase() : 'kg';
        if (unit === 'kilo' || unit === 'kilogram') unit = 'kg';
        if (unit === 'piece' || unit === 'pieces') unit = 'pc';
        if (unit === 'liter') unit = 'litro';

        let category = 'other food';
        for (const cat of categories) {
            if (cat.names.some(n => lower.includes(n))) {
                category = cat.key;
                break;
            }
        }

        rows.push({
            id: crypto.randomUUID(),
            item_name: itemName,
            category: category,
            unit: unit,
            price_min: min,
            price_max: max,
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
        // Insert new rows as drafts (published = false)
        const newRows = validRows.map(r => ({
            source_date: date,
            item_name: r.item_name.trim(),
            category: r.category,
            unit: r.unit,
            price_min: r.price_min,
            price_max: r.price_max,
            notes: r.notes,
            published: false,
            created_by: currentSession.user.id
        }));

        const { data: inserted, error: insertError } = await supabaseClient
            .from('market_prices')
            .insert(newRows)
            .select('id');

        if (insertError) throw insertError;

        // Unpublish all previously published prices, then publish the new batch
        const { error: unpublishError } = await supabaseClient
            .from('market_prices')
            .update({ published: false })
            .eq('published', true);

        if (unpublishError) throw unpublishError;

        const newIds = inserted.map(i => i.id);
        const { error: publishError } = await supabaseClient
            .from('market_prices')
            .update({ published: true, published_at: new Date().toISOString() })
            .in('id', newIds);

        if (publishError) throw publishError;

        statusEl.textContent = `Success! Published ${newRows.length} prices for ${date}.`;
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
