const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pipeline = require('../admin/price-pipeline.js');

test('reads report dates from PDF text in common written and unambiguous numeric formats', () => {
    for (const text of ['September 26, 2026', 'SEPT. 26 2026', '26 September 2026', 'As of September\n26, 2026', '2026-09-26', '09/26/2026', '26/09/2026']) {
        assert.equal(pipeline.extractReportDate(text), '2026-09-26', text);
    }
    assert.equal(pipeline.extractReportDate('September 26, 2026\nPage 2\nSeptember 26, 2026'), '2026-09-26');
});

test('missing, conflicting, invalid and ambiguous report dates require manual entry', () => {
    for (const text of ['No date', 'February 30, 2026', '2026-02-30', '09/10/2026', 'September 25, 2026\nSeptember 26, 2026']) {
        assert.equal(pipeline.extractReportDate(text), null, text);
    }
    assert.equal(pipeline.parse('26 September 2026\nFISH PRODUCTS\nTilapia 150.00')[0].item_name, 'Tilapia');
});

test('DA draft handles categories, uppercase commodities, commas, ranges, eggs and unavailable rows', () => {
    const rows = pipeline.parse(`DAILY PRICE INDEX
National Capital Region
September 26, 2026
LOCAL COMMERCIAL RICE
Well-Milled Rice 48.62
BEEF MEAT PRODUCTS
BEEF BRISKET 1,250.00
FISH PRODUCTS
Tilapia 120.00 - 150.00
Bangus n/a
POULTRY PRODUCTS
Chicken Egg (Medium) 7.91
LOWLAND VEGETABLES
Native Pechay 91.41
Page 1 of 1`);
    assert.equal(rows.length, 6);
    assert.equal(rows[1].price_max, 1250);
    assert.equal(rows[1].category, 'meat');
    assert.equal(rows[2].price_min, 120);
    assert.equal(rows[2].price_max, 150);
    assert.equal(rows[3].price_min, null);
    assert.equal(rows[4].unit, 'pc');
    assert.equal(rows[5].category, 'vegetables');
    assert.equal(pipeline.validate(rows, '2026-09-26', 'NCR').length, 6);
});

const row = { item_name: 'Tilapia', category: 'fish', unit: 'kg', price_min: 120, price_max: 150 };
test('invalid dates, missing region, empty batches, duplicates and bad ranges block publishing', () => {
    for (const rows of [[], [row, row], [{ ...row, price_min: -1 }], [{ ...row, price_min: 200 }], [{ ...row, price_max: NaN }], [{ ...row, price_min: null }]]) {
        assert.throws(() => pipeline.validate(rows, '2026-09-26', 'NCR'));
    }
    assert.throws(() => pipeline.validate([row], '2026-02-30', 'NCR'));
    assert.throws(() => pipeline.validate([row], '2026-09-26', ''));
});

function controller({ reviewed = true, fail = false } = {}) {
    const elements = new Map();
    const calls = [];
    const el = id => {
        if (!elements.has(id)) elements.set(id, { value: '', checked: false, classList: { add() {}, remove() {} }, addEventListener() {} });
        return elements.get(id);
    };
    el('priceDate').value = '2026-09-26';
    el('priceRegion').value = 'NCR';
    el('reviewConfirmed').checked = reviewed;
    const context = { PricePipeline: pipeline, console: { error() {} }, document: { getElementById: el },
        supabaseClient: { auth: { getSession: async () => ({ data: { session: { user: { app_metadata: { role: 'member' } } } } }) },
            rpc: async (name, args) => { calls.push({ name, args }); return fail ? { error: new Error('Publish failed') } : { data: args.rows.length }; } } };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(require.resolve('../admin/admin.js'), 'utf8'), context);
    vm.runInContext(`currentSession = {}; parsedRows = ${JSON.stringify([row])};`, context);
    return { context, el, calls };
}

test('review is mandatory and approved rows reach the atomic RPC with report metadata', async () => {
    const blocked = controller({ reviewed: false });
    await blocked.context.publishPrices();
    assert.equal(blocked.calls.length, 0);
    const allowed = controller();
    await allowed.context.publishPrices();
    assert.equal(allowed.calls[0].name, 'publish_market_prices');
    assert.equal(allowed.calls[0].args.rows[0].region, 'NCR');
    assert.match(allowed.el('publishStatus').textContent, /Published 1/);
});

test('RPC failures show an error and allow retry', async () => {
    const { context, el } = controller({ fail: true });
    await context.publishPrices();
    assert.match(el('publishStatus').textContent, /Error publishing/);
    assert.equal(el('publishBtn').disabled, false);
});

test('PDF upload fills its date and clears the prior date when the next PDF has none', async () => {
    const { context, el } = controller();
    let lines = ['September 26, 2026'];
    context.document.querySelectorAll = () => [];
    el('progressBar').style = {};
    context.pdfjsLib = {
        GlobalWorkerOptions: {},
        getDocument: () => ({ promise: Promise.resolve({ numPages: 1, getPage: async () => ({
            getTextContent: async () => ({ items: lines.map((str, i) => ({ str, transform: [1, 0, 0, 1, 0, 500 - i * 15] })) })
        }) }) })
    };
    const event = { target: { files: [{ name: 'report.pdf', arrayBuffer: async () => new ArrayBuffer(0) }] } };
    await context.handlePdfUpload(event);
    assert.equal(el('priceDate').value, '2026-09-26');
    lines = ['DAILY PRICE INDEX'];
    await context.handlePdfUpload(event);
    assert.equal(el('priceDate').value, '');
    assert.match(el('dateDetectionStatus').textContent, /No single clear report date/);
});
