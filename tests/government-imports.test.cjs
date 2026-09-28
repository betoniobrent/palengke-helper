const {test}=require('node:test');
const assert=require('node:assert/strict');
const dti=require('../admin/dti-pipeline.js');
const pipeline=require('../admin/price-pipeline.js');
const layout=require('./fixtures/dti-may-2026-layout.json');
const {discover,assertOfficial}=require('../scripts/import-government-prices.cjs');
test('DTI reads all 167 SKUs including wrapped names and preserves regional and package distinctions',()=>{
    const rows=dti.parse([layout]);
    assert.equal(rows.length,167);
    assert.equal(pipeline.validate(rows,'2026-05-11','Nationwide','DTI').length,167);
    assert.equal(rows[0].price_min,21.5);
    assert.equal(rows.at(-1).unit,'D');
    assert.match(rows.at(-1).item_name,/Blister Pack of 2$/);
    assert.ok(rows.some(r=>r.region==='Luzon'));
    assert.ok(rows.some(r=>r.region==='Visayas / Mindanao'));
    assert.equal(rows.filter(r=>r.item_name.includes('Manila Wax Sperma White') && r.unit==='#16')[0].price_min,59.41);
    assert.ok(rows.filter(r=>/SOAP|CANDLES|BATTERIES/.test(r.item_name)).every(r=>r.category==='household'));
});
test('DTI fails closed for missing table geometry or unmatched numeric cells',()=>{
    assert.throws(()=>dti.parse([{...layout,boxes:[]}]),/Incomplete/);
    assert.throws(()=>dti.parse([{...layout,items:layout.items.filter(i=>i.str!=='SRP')}]),/Unsupported/);
    assert.throws(()=>dti.parse([{...layout,items:[...layout.items,{str:'99.99',x:260,y:50,width:20,height:8}]}]),/Incomplete/);
});
test('weekly dates support month and year boundaries',()=>{
    assert.equal(pipeline.extractReportDate('For the period of August 31-September 6, 2026'),'2026-09-06');
    assert.equal(pipeline.extractReportDate('December 29, 2025 - January 3, 2026'),'2026-01-03');
    assert.equal(pipeline.extractReportDate('effective 11 May 2026'),'2026-05-11');
});
test('discovery accepts only official PDF hosts and correct bulletin types',()=>{
    assert.equal(discover('<a href="/wp-content/uploads/2026/Weekly-Average-Prices-September-21-27-2026.pdf">week</a>','DA').length,1);
    assert.equal(discover('<a href="https://dtiwebfiles.s3.ap-southeast-1.amazonaws.com/e-Presyo/BNPC+SRP+2026.pdf">DTI</a>','DTI').length,1);
    assert.throws(()=>discover('<a href="https://evil.example/BNPC-SRP.pdf">fake</a>','DTI'),/Untrusted/);
    assert.throws(()=>assertOfficial('https://www.dti.gov.ph.evil.example/report.pdf'));
    assert.throws(()=>discover('<h1>Unavailable</h1>','DA'),/No DA bulletin/);
});
