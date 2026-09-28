(function (root) {
    const categories = ['rice', 'meat', 'fish', 'vegetables', 'fruits', 'spices', 'other food', 'household'];
    function reportHeader(text) {
        return String(text).split(/\bCOMMODITY\s+SPECIFICATION\b|Markets Covered:|Source:|\bNote:/i)[0];
    }
    function extractReportPeriod(text) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const names = '(' + months.join('|') + ')';
        const pattern = new RegExp('\\b' + names + '\\s+(\\d{1,2})(?:,?\\s+(20\\d{2}))?\\s*[-–—]\\s*(?:' + names + '\\s+)?(\\d{1,2}),?\\s+(20\\d{2})\\b', 'i');
        const match = reportHeader(text).match(pattern);
        if (!match) return null;
        const monthNumber = name => months.findIndex(m => m.toLowerCase() === name.toLowerCase()) + 1;
        const iso = (year, month, day) => `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const start = iso(match[3] || match[6], monthNumber(match[1]), match[2]);
        const end = iso(match[6], monthNumber(match[4] || match[1]), match[5]);
        if (start > end || Date.parse(end)-Date.parse(start)>7*86400000 || ![start,end].every(d => Number.isFinite(Date.parse(d)) && new Date(d).toISOString().slice(0,10) === d)) return null;
        const label = match[4] || match[3] ? match[0] : `${match[1]} ${Number(match[2])}–${Number(match[5])}, ${match[6]}`;
        return { start, end, label };
    }

    function extractReportRegion(text) {
        const header = reportHeader(text);
        if (/\bNCR\b|National Capital Region/i.test(header)) return 'NCR';
        const match = header.match(/\bRegion\s+([IVX]+(?:-[AB])?|\d+(?:-[AB])?)(?:\s*\(([^)]+)\))?/i);
        return match ? match[0] : '';
    }
    function linesFromPdfItems(items) {
        const lines = [];
        const positioned = items.filter(item => item.str?.trim()).map(item => ({
            str: item.str, x: item.x ?? item.transform[4], y: item.y ?? item.transform[5]
        })).sort((a,b) => b.y - a.y || a.x - b.x);
        for (const item of positioned) {
            let line = lines[lines.length - 1];
            // Price baselines in DA PDFs can differ by a fraction of a point.
            if (!line || Math.abs(line.y - item.y) > 2) { line = { y: item.y, items: [] }; lines.push(line); }
            line.items.push(item);
        }
        return lines.map(line => line.items.sort((a,b) => a.x-b.x).map(item => item.str).join(' ').replace(/\s+/g,' ').trim());
    }
    function extractReportDate(text) {
        const period = extractReportPeriod(text);
        if (period) return period.end;
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)\\.?';
        const dates = new Set();
        const add = (year, monthNumber, day) => {
            const date = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const parsed = new Date(date);
            if (Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date) dates.add(date);
        };
        const normalized = reportHeader(text).replace(/\s+/g, ' ');
        for (const match of normalized.matchAll(new RegExp('\\b' + month + '\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s*,?\\s*(20\\d{2})\\b', 'gi'))) {
            add(match[3], months.indexOf(match[1].slice(0, 3).toLowerCase()) + 1, Number(match[2]));
        }
        for (const match of normalized.matchAll(new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+' + month + '\\s*,?\\s*(20\\d{2})\\b', 'gi'))) {
            add(match[3], months.indexOf(match[2].slice(0, 3).toLowerCase()) + 1, Number(match[1]));
        }
        for (const match of normalized.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) add(match[1], Number(match[2]), Number(match[3]));
        // Accept numeric dates only when the day/month order is unambiguous.
        for (const match of normalized.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/g)) {
            const first = Number(match[1]), second = Number(match[2]);
            if (first > 12) add(match[3], second, first);
            else if (second > 12 || first === second) add(match[3], first, second);
            else return null;
        }
        return dates.size === 1 ? [...dates][0] : null;
    }
    function categoryFor(header) {
        if (/RICE/.test(header)) return 'rice';
        if (/MEAT|POULTRY|BEEF|PORK/.test(header)) return 'meat';
        if (/FISH/.test(header)) return 'fish';
        if (/VEGETABLE/.test(header)) return 'vegetables';
        if (/FRUIT/.test(header)) return 'fruits';
        if (/SPICE|CONDIMENT/.test(header)) return 'spices';
        if (/HOUSEHOLD/.test(header)) return 'household';
        return 'other food';
    }
    function parse(text) {
        const rows = [];
        let category = 'other food';
        let section = '';
        const period = extractReportPeriod(text);
        let pending = '';
        const amount = '(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d{1,2})?';
        const pricePattern = new RegExp('(?:₱\\s*)?(' + amount + ')(?:\\s*[-–]\\s*(?:₱\\s*)?(' + amount + '))?\\s*$');
        for (const raw of text.split('\n')) {
            const line = raw.trim().replace(/\s+/g, ' ');
            if (!line) continue;
            if (/^(Markets Covered:|Source:|Note:)/i.test(line)) break;
            if (extractReportDate(line)) { pending = ''; continue; }
            if (/^(page\s+\d|department of agriculture|bantay presyo|weekly average|daily price|national capital|region\b|prevailing|commodity\b|specification\b|retail price|unit\b|source:)/i.test(line) || /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b.*20\d{2}/i.test(line)) { pending = ''; continue; }
            if (line === line.toUpperCase() && !/\d/.test(line) && /RICE|PRODUCTS|VEGETABLES|FRUITS|SPICES|CONDIMENTS|LEGUMES|HOUSEHOLD|COMMODITIES/.test(line)) {
                category = categoryFor(line); section = line; pending = ''; continue;
            }
            const unavailable = /(?:\bn\/?a|\s[-–])\s*$/i.exec(line);
            const match = unavailable || pricePattern.exec(line);
            if (!match) { pending = (pending + ' ' + line).trim(); continue; }
            let name = (pending + ' ' + line.slice(0, match.index)).trim();
            pending = '';
            if (name.length < 2) continue;
            const unitMatch = name.match(/\s(kg|kilogram|kilo|pc|pcs|piece|pieces|tray|liter|litro|bottle|bundle|pack|can|ml|L)\s*$/i);
            let unit = unitMatch ? unitMatch[1].toLowerCase() : (/\beggs?\b/i.test(name) ? 'pc' : 'kg');
            if (unitMatch) name = name.slice(0, unitMatch.index).trim();
            const bottle = name.match(/\b(\d+)\s*(ml|liter)\/bottle\b/i);
            if (bottle && /^(ml|l)$/.test(unit)) unit = `${bottle[1]} ${bottle[2].toLowerCase() === 'liter' ? 'L' : 'ml'} bottle`;
            if (section === 'IMPORTED COMMERCIAL RICE') name += ' (Imported)';
            if (section === 'LOCAL COMMERCIAL RICE') name += ' (Local)';
            if (/^(pcs|piece|pieces)$/.test(unit)) unit = 'pc';
            if (/^(kilo|kilogram)$/.test(unit)) unit = 'kg';
            const min = unavailable ? null : Number(match[1].replace(/,/g, ''));
            const max = unavailable ? null : Number((match[2] || match[1]).replace(/,/g, ''));
            rows.push({ item_name: name, category, unit, price_min: min, price_max: max, notes: [period ? `Weekly average: ${period.label}` : '', unavailable ? 'Not available in source report' : ''].filter(Boolean).join('; ') });
        }
        return rows;
    }
    function validate(rows, date, region, agency = 'DA') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Enter the date printed on the government report.');
        if (typeof region !== 'string' || !region.trim()) throw new Error('Enter the region printed on the government report.');
        if (!Array.isArray(rows) || !rows.length) throw new Error('Add or upload at least one price row.');
        const seen = new Map();
        return rows.map((row, index) => {
            const fail = message => { throw new Error(`Row ${index + 1}: ${message}`); };
            if (!row.item_name?.trim() || !row.unit?.trim()) fail('name and unit are required.');
            if (!categories.includes(row.category)) fail('select a valid category.');
            for (const field of ['price_min', 'price_max']) {
                if (row[field] !== null && (typeof row[field] !== 'number' || !Number.isFinite(row[field]) || row[field] <= 0)) fail('prices must be positive numbers or blank for unavailable.');
            }
            if ((row.price_min === null) !== (row.price_max === null)) fail('enter both prices, or leave both blank.');
            if (row.price_min > row.price_max) fail('minimum price cannot exceed maximum price.');
            const key = [row.item_name.trim().toLowerCase(), row.category, row.unit.trim().toLowerCase(), agency === 'DTI' ? (row.region || region).trim().toLowerCase() : region.trim().toLowerCase()].join('|');
            if (seen.has(key)) fail(`"${row.item_name.trim()}" duplicates row ${seen.get(key)} (${row.category}, ${row.unit}). Keep distinct varieties in their names; remove a row only if it is truly repeated.`);
            seen.set(key, index + 1);
            return { ...row, item_name: row.item_name.trim(), unit: row.unit.trim(), source_date: date, region: agency === 'DTI' ? (row.region || region).trim() : region.trim() };
        });
    }
    const api = { parse, validate, categories, extractReportDate, extractReportPeriod, extractReportRegion, linesFromPdfItems };
    if (typeof module !== 'undefined') module.exports = api;
    root.PricePipeline = api;
})(typeof window !== 'undefined' ? window : globalThis);
