const fs = require('node:fs');
const { createHash } = require('node:crypto');
const pipeline = require('../admin/price-pipeline.js');
const dti = require('../admin/dti-pipeline.js');
const SOURCES = {
    DA: 'https://www.da.gov.ph/price-monitoring/',
    DTI: 'https://www.dti.gov.ph/dti-consumer-space/dti-latest-srps-basic-necessities-prime-commodities'
};
const HOSTS = new Set(['www.da.gov.ph', 'www.dti.gov.ph', 'dtiwebfiles.s3.ap-southeast-1.amazonaws.com', 'dtiwebfiles.s3-ap-southeast-1.amazonaws.com']);
function assertOfficial(url) {
    const u = new URL(url);
    if (u.protocol !== 'https:' || !HOSTS.has(u.hostname) || u.username || u.password || u.port) throw new Error('Untrusted source URL');
}
async function download(url, redirects = 0) {
    assertOfficial(url);
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(60000), headers: { 'User-Agent': 'PalengkeHelper/1.0 government price import' } });
    if ([301,302,303,307,308].includes(response.status)) {
        if (redirects >= 4) throw new Error('Too many redirects');
        return download(new URL(response.headers.get('location'),url).href, redirects+1);
    }
    if (!response.ok) throw new Error(`Government source HTTP ${response.status}`);
    const chunks=[]; let size=0;
    for await (const chunk of response.body) {
        size+=chunk.length;
        if (size>20*1024*1024) throw new Error('Government file exceeds 20 MB');
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}
function discover(html, agency) {
    const urls=[];
    for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
        const url = new URL(match[1].replace(/&amp;/g,'&'),SOURCES[agency]).href;
        if (!/\.pdf(?:\?|$)/i.test(url)) continue;
        if (agency==='DA' && !/Weekly-Average-Prices-/i.test(url)) continue;
        if (agency==='DTI' && !/BNPC.*SRP|SRP.*BNPC/i.test(url)) continue;
        assertOfficial(url);
        if (!urls.includes(url)) urls.push(url);
    }
    if (!urls.length) throw new Error(`No ${agency} bulletin links found; source layout may have changed`);
    // Official listings place current bulletins first. Parse several candidates and use their printed dates.
    return urls.slice(0,3);
}
async function parsePdf(buffer, agency) {
    if (buffer.subarray(0,5).toString() !== '%PDF-') throw new Error('Source did not return a PDF');
    const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
    const doc = await pdfjs.getDocument({data:new Uint8Array(buffer),isEvalSupported:false,disableFontFace:true}).promise;
    try {
        if (!doc.numPages || doc.numPages>10) throw new Error('Unsupported report length');
        const pages=[],texts=[];
        for(let n=1;n<=doc.numPages;n++) {
            const page=await doc.getPage(n), {items}=await page.getTextContent();
            texts.push(pipeline.linesFromPdfItems(items).join('\n'));
            if(agency==='DTI') pages.push({items,boxes:dti.boxesFromOperators(await page.getOperatorList(),pdfjs.OPS)});
        }
        const text=texts.join('\n');
        if (agency==='DTI' ? !/BASIC NECESSITIES AND PRIME COMMODITIES[\s\S]*SUGGESTED RETAIL PRICES/i.test(text) : !/Bantay Presyo[\s\S]*Weekly Average Retail Price/i.test(text)) throw new Error('Unexpected government report type');
        const date=pipeline.extractReportDate(text);
        const region=agency==='DTI'?'Nationwide':pipeline.extractReportRegion(text);
        if (!date || date>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Manila'})) throw new Error('Missing, ambiguous or future effective date');
        let rows=agency==='DTI'?dti.parse(pages):pipeline.parse(text);
        if(agency==='DA') {
            if (!pipeline.extractReportPeriod(text) || region!=='NCR') throw new Error('Unsupported DA reporting period or region');
            const expected=text.split('\n').filter(line=>/\s(?:\d[\d,]*\.\d{2}|[-–])$/.test(line.trim())).length;
            if(expected!==rows.length) throw new Error('Incomplete DA extraction');
        }
        rows=pipeline.validate(rows,date,region,agency);
        if(rows.length<(agency==='DA'?50:100) || rows.length>1000) throw new Error('Unexpected row count');
        return {date,rows,hash:createHash('sha256').update(buffer).digest('hex')};
    } finally { await doc.destroy(); }
}
async function run(agency, {dryRun=false, localFile, documentUrl}={}) {
    if (!SOURCES[agency]) throw new Error('Choose DA or DTI');
    const candidates=localFile?[documentUrl]:discover((await download(SOURCES[agency])).toString('utf8'),agency);
    const reports=[];
    for(const url of candidates) {
        if(url) assertOfficial(url);
        const report=await parsePdf(localFile?fs.readFileSync(localFile):await download(url),agency);
        reports.push({...report,url});
    }
    reports.sort((a,b)=>b.date.localeCompare(a.date));
    const report=reports[0];
    console.log(`${agency}: ${report.date}, ${report.rows.length} validated rows, SHA256 ${report.hash}`);
    if(dryRun) return report;
    const token=process.env.GOVERNMENT_IMPORT_TOKEN;
    if(!token || !report.url) throw new Error('Import credential and official PDF URL required');
    const config=fs.readFileSync(require.resolve('../supabase.js'),'utf8');
    const base=config.match(/const SUPABASE_URL = '([^']+)'/)[1];
    const key=config.match(/const SUPABASE_PUBLIC_KEY = '([^']+)'/)[1];
    const response=await fetch(`${base}/rest/v1/rpc/publish_government_prices`, {
        method:'POST',signal:AbortSignal.timeout(60000),headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
        body:JSON.stringify({import_token:token,agency,document_url:report.url,document_hash:report.hash,rows:report.rows})
    });
    const result=await response.json();
    if(!response.ok) throw new Error(result.message || `Publish HTTP ${response.status}`);
    console.log(result?`Published ${result} ${agency} prices.`:`${agency}: already imported or older than current prices; no change.`);
    return report;
}
module.exports={parsePdf,discover,assertOfficial,run};
if(require.main===module) {
    const args=process.argv.slice(2);
    run(args[0],{dryRun:args.includes('--dry-run'),localFile:args.includes('--file')?args[args.indexOf('--file')+1]:null,documentUrl:args.includes('--url')?args[args.indexOf('--url')+1]:null}).catch(error=>{console.error(error.message);process.exitCode=1;});
}
