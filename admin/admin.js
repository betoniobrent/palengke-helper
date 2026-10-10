// Palengke Helper+ Admin - Market Prices Management
// The shared Supabase client (supabaseClient) is loaded from ../supabase.js.
let parsedRows = [];
let currentSession = null;
let uploadSequence = 0;
let reportAgency = 'DA';
let reportHash = null;

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
    const password = document.getElementById('adminPassword').value;
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
    auditRequest++;
    document.getElementById('auditTableBody').innerHTML = '';
    await supabaseClient.auth.signOut();
    currentSession = null;
    showLogin();
}

function showDashboard() {
    document.getElementById('loginPanel').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    // Default date to today
    // The administrator must enter the date printed on the report.
    loadUsers();
    loadAuditLogs();
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
    const uploadId = ++uploadSequence;
    reportAgency = 'DA';
    reportHash = null;
    document.getElementById('priceDate').value = '';
    document.getElementById('priceRegion').value = '';
    document.getElementById('dateDetectionStatus').textContent = 'Reading the report date…';
    document.getElementById('reviewConfirmed').checked = false;
    parsedRows = [];
    renderParsedTable();

    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('uploadProgress');
    const statusEl = document.getElementById('uploadStatus');

    progressContainer.classList.remove('hidden');
    progressBar.style.width = '20%';
    statusEl.textContent = 'Reading PDF...';

    try {
        const arrayBuffer = await file.arrayBuffer();
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', arrayBuffer))).map(b => b.toString(16).padStart(2, '0')).join('');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, isEvalSupported: false }).promise;

        progressBar.style.width = '50%';
        statusEl.textContent = `Extracting text from ${pdf.numPages} pages...`;

        let fullText = '';
        const pages = [];
        let detectedAgency = 'DA';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageLines = PricePipeline.linesFromPdfItems(textContent.items);
            if (i === 1 && /SUGGESTED RETAIL PRICES/i.test(pageLines.join(' '))) detectedAgency = 'DTI';
            if (detectedAgency === 'DTI') pages.push({ items: textContent.items, boxes: DtiPipeline.boxesFromOperators(await page.getOperatorList(), pdfjsLib.OPS) });
            fullText += pageLines.join('\n') + '\n';
        }

        progressBar.style.width = '80%';
        statusEl.textContent = 'Parsing prices...';

        if (uploadId !== uploadSequence) return;
        reportAgency = detectedAgency;
        reportHash = hash;
        const reportDate = PricePipeline.extractReportDate(fullText);
        const period = PricePipeline.extractReportPeriod(fullText);
        document.getElementById('priceRegion').value = reportAgency === 'DTI' ? 'Nationwide' : PricePipeline.extractReportRegion(fullText);
        document.getElementById('priceDate').value = reportDate || '';
        document.getElementById('dateDetectionStatus').textContent = period
            ? `Weekly report: ${period.label}. Using week ending ${period.end}. Check the date and region below.`
            : reportDate
            ? `Report date detected: ${reportDate}. You can correct it below.`
            : 'No single clear report date found. Enter the date printed on the PDF.';
        parsedRows = reportAgency === 'DTI' ? DtiPipeline.parse(pages) : parseBantayPresyoText(fullText);
        document.getElementById('reportAgencyStatus').textContent = reportAgency === 'DTI' ? 'DTI suggested retail prices. Regional exceptions are kept per product.' : 'DA market prices.';
        document.getElementById('sourceFile').textContent = file.name;
        renderParsedTable();

        progressBar.style.width = '100%';
        statusEl.textContent = `Extracted ${parsedRows.length} items. Compare every row, unit, and price with the PDF before publishing.`;
        document.getElementById('publishBtn').disabled = parsedRows.length === 0;
    } catch (err) {
        if (uploadId !== uploadSequence) return;
        console.error(err);
        document.getElementById('dateDetectionStatus').textContent = 'Could not read the report date. Enter it manually or upload another PDF.';
        statusEl.textContent = 'Error parsing PDF. Try a different file or add rows manually.';
        statusEl.classList.add('text-red-500');
    }
}

// Parser for the DA Bantay Presyo Daily Price Index PDF layout.
// Detects section headers, reads each commodity line with a trailing single price,
// and skips header/footer lines, page numbers, and n/a entries.
function parseBantayPresyoText(text) { return PricePipeline.parse(text); }

// ================== MANUAL REVIEW TABLE ==================

function renderParsedTable() {
    document.getElementById('reviewConfirmed').checked = false;
    document.getElementById('publishBtn').textContent = 'Publish Market Prices';
    const tbody = document.getElementById('parsedDataTable');
    tbody.innerHTML = '';

    if (parsedRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400">Upload a PDF to see parsed data, or add rows manually.</td></tr>`;
        document.getElementById('publishBtn').disabled = true;
        return;
    }

    parsedRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-3">${index + 1}</td>
            <td class="p-3"><input type="text" data-idx="${index}" data-field="item_name" value="${escapeHtml(row.item_name)}" class="w-full border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3">
                <select data-idx="${index}" data-field="category" class="w-full border border-gray-200 rounded px-2 py-1 text-sm">
                    ${['rice','meat','fish','vegetables','fruits','spices','other food','household'].map(c => `<option value="${c}" ${row.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </td>
            <td class="p-3"><input type="text" data-idx="${index}" data-field="unit" value="${escapeHtml(row.unit)}" class="w-20 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="number" data-idx="${index}" data-field="price_min" value="${row.price_min ?? ''}" step="0.01" min="0.01" class="w-24 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="number" data-idx="${index}" data-field="price_max" value="${row.price_max ?? ''}" step="0.01" min="0.01" class="w-24 border border-gray-200 rounded px-2 py-1 text-sm"></td>
            <td class="p-3"><input type="text" data-idx="${index}" data-field="notes" value="${escapeHtml(row.notes || '')}" class="w-full border border-gray-200 rounded px-2 py-1 text-sm">${row.region ? `<small>${escapeHtml(row.region)}</small>` : ''}</td>
            <td class="p-3"><button data-idx="${index}" class="delete-row text-red-500 hover:text-red-700 text-sm">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    attachTableListeners();
    document.getElementById('publishBtn').disabled = false;
}

function attachTableListeners() {
    document.querySelectorAll('#parsedDataTable input, #parsedDataTable select').forEach(el => {
        el.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            const field = e.target.dataset.field;
            let value = e.target.value;
            if (field === 'price_min' || field === 'price_max') value = value.trim() === '' ? null : Number(value);
            parsedRows[idx][field] = value;
            document.getElementById('reviewConfirmed').checked = false;
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
for (const id of ['priceDate', 'priceRegion']) {
    document.getElementById(id).addEventListener('input', () => {
        document.getElementById('reviewConfirmed').checked = false;
        document.getElementById('publishBtn').disabled = parsedRows.length === 0;
        document.getElementById('publishBtn').textContent = 'Publish Market Prices';
    });
}

async function publishPrices() {
    const statusEl = document.getElementById('publishStatus');
    const date = document.getElementById('priceDate').value;
    const region = document.getElementById('priceRegion').value;
    const publishBtn = document.getElementById('publishBtn');

    if (!currentSession) {
        statusEl.textContent = 'You must be logged in as admin to publish.';
        statusEl.className = 'text-sm mt-3 text-red-500';
        statusEl.classList.remove('hidden');
        return;
    }

    let newRows;
    try {
        newRows = PricePipeline.validate(parsedRows, date, region, reportAgency);
        if (!document.getElementById('reviewConfirmed').checked) throw new Error('Confirm you reviewed the rows against the source PDF. Editing a row, date, or region resets this confirmation.');
    } catch (err) {
        statusEl.textContent = 'Please review: ' + err.message;
        statusEl.className = 'text-sm mt-3 text-red-500';
        statusEl.classList.remove('hidden');
        return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing...';

    try {
        // The RPC checks trusted account metadata again on the server.
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError || !sessionData.session) throw new Error('Admin session expired. Please log in again.');

        const { data: count, error: publishError } = await supabaseClient
            .rpc('publish_market_prices', { rows: newRows, agency: reportAgency, document_hash: reportHash });

        if (publishError) throw publishError;

        statusEl.textContent = `Success! Published ${count} prices for ${date}.`;
        statusEl.className = 'text-sm mt-3 text-emerald-600';
        statusEl.classList.remove('hidden');
        publishBtn.textContent = 'Published';
        loadAuditLogs();
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
    return String(text ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

// Check existing session on load
supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session && data.session.user?.app_metadata?.role === 'admin') {
        currentSession = data.session;
        showDashboard();
    }
});

let auditPage = 0;
let auditRequest = 0;
async function loadAuditLogs() {
    const request = ++auditRequest;
    const status = document.getElementById('auditStatus');
    const body = document.getElementById('auditTableBody');
    if (!status || !currentSession) return;
    status.textContent = 'Loading audit records…';
    document.getElementById('auditPrev').disabled = true;
    document.getElementById('auditNext').disabled = true;
    try {
        let query = supabaseClient.from('admin_audit_logs').select('id,occurred_at,actor_id,action,details').order('occurred_at',{ascending:false}).order('id',{ascending:false});
        const action = document.getElementById('auditAction').value;
        if (action) query = query.eq('action',action);
        const {data,error} = await query.range(auditPage*25,auditPage*25+25);
        if (request !== auditRequest || !currentSession) return;
        if (error) throw error;
        const rows = data || [];
        body.innerHTML = rows.slice(0,25).map(row => `<tr class="border-t"><td class="p-3">${escapeHtml(new Date(row.occurred_at).toLocaleString('en-PH',{timeZone:'Asia/Manila'}))}</td><td class="p-3 font-mono text-xs">${escapeHtml(row.actor_id || 'System / database')}</td><td class="p-3">${escapeHtml(row.action.replaceAll('_',' '))}</td><td class="p-3">${escapeHtml(Object.entries(row.details || {}).map(([key,value]) => key.replaceAll('_',' ') + ': ' + value).join(' · '))}</td></tr>`).join('');
        status.textContent = rows.length ? 'Page ' + (auditPage+1) : 'No audit records yet.';
        document.getElementById('auditPrev').disabled = auditPage === 0;
        document.getElementById('auditNext').disabled = rows.length <= 25;
    } catch (error) {
        if (request !== auditRequest) return;
        body.innerHTML = '';
        status.textContent = 'Audit log unavailable. The database migration must be applied and your account must have admin access. ' + error.message;
    }
}
document.getElementById('refreshAuditBtn')?.addEventListener('click',()=>{auditPage=0;loadAuditLogs();});
document.getElementById('auditAction')?.addEventListener('change',()=>{auditPage=0;loadAuditLogs();});
document.getElementById('auditPrev')?.addEventListener('click',()=>{auditPage=Math.max(0,auditPage-1);loadAuditLogs();});
document.getElementById('auditNext')?.addEventListener('click',()=>{auditPage++;loadAuditLogs();});
