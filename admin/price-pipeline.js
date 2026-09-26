(function (root) {
    const categories = ['rice', 'meat', 'fish', 'vegetables', 'fruits', 'spices', 'other food', 'household'];
    function categoryFor(header) {
        if (/RICE/.test(header)) return 'rice';
        if (/MEAT|POULTRY/.test(header)) return 'meat';
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
        let pending = '';
        const amount = '(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d{1,2})?';
        const pricePattern = new RegExp('(?:₱\\s*)?(' + amount + ')(?:\\s*[-–]\\s*(?:₱\\s*)?(' + amount + '))?\\s*$');
        for (const raw of text.split('\n')) {
            const line = raw.trim().replace(/\s+/g, ' ');
            if (!line) continue;
            if (/^(page\s+\d|department of agriculture|daily price|national capital|region\b|prevailing|commodity\b|specification\b|retail price|unit\b|source:)/i.test(line) || /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b.*20\d{2}/i.test(line)) { pending = ''; continue; }
            if (line === line.toUpperCase() && !/\d/.test(line) && /RICE|PRODUCTS|VEGETABLES|FRUITS|SPICES|CONDIMENTS|LEGUMES|HOUSEHOLD|COMMODITIES/.test(line)) {
                category = categoryFor(line); pending = ''; continue;
            }
            const unavailable = /(?:\bn\/?a|\s[-–])\s*$/i.exec(line);
            const match = unavailable || pricePattern.exec(line);
            if (!match) { pending = (pending + ' ' + line).trim(); continue; }
            const name = (pending + ' ' + line.slice(0, match.index)).trim();
            pending = '';
            if (name.length < 2) continue;
            const unitMatch = name.match(/\b(kg|kilogram|kilo|pc|pcs|piece|pieces|tray|liter|litro|bottle|bundle|pack|can)\b/i);
            let unit = unitMatch ? unitMatch[1].toLowerCase() : (/\beggs?\b/i.test(name) ? 'pc' : 'kg');
            if (/^(pcs|piece|pieces)$/.test(unit)) unit = 'pc';
            if (/^(kilo|kilogram)$/.test(unit)) unit = 'kg';
            const min = unavailable ? null : Number(match[1].replace(/,/g, ''));
            const max = unavailable ? null : Number((match[2] || match[1]).replace(/,/g, ''));
            rows.push({ item_name: name, category, unit, price_min: min, price_max: max, notes: unavailable ? 'Not available in source report' : '' });
        }
        return rows;
    }
    function validate(rows, date, region) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Enter the date printed on the DA report.');
        if (typeof region !== 'string' || !region.trim()) throw new Error('Enter the region printed on the DA report.');
        if (!Array.isArray(rows) || !rows.length) throw new Error('Add or upload at least one price row.');
        const seen = new Set();
        return rows.map((row, index) => {
            const fail = message => { throw new Error(`Row ${index + 1}: ${message}`); };
            if (!row.item_name?.trim() || !row.unit?.trim()) fail('name and unit are required.');
            if (!categories.includes(row.category)) fail('select a valid category.');
            for (const field of ['price_min', 'price_max']) {
                if (row[field] !== null && (typeof row[field] !== 'number' || !Number.isFinite(row[field]) || row[field] <= 0)) fail('prices must be positive numbers or blank for unavailable.');
            }
            if ((row.price_min === null) !== (row.price_max === null)) fail('enter both prices, or leave both blank.');
            if (row.price_min > row.price_max) fail('minimum price cannot exceed maximum price.');
            const key = [row.item_name.trim().toLowerCase(), row.category, row.unit.trim().toLowerCase()].join('|');
            if (seen.has(key)) fail('duplicate commodity; combine or remove the duplicate.');
            seen.add(key);
            return { ...row, item_name: row.item_name.trim(), unit: row.unit.trim(), source_date: date, region: region.trim() };
        });
    }
    const api = { parse, validate, categories };
    if (typeof module !== 'undefined') module.exports = api;
    root.PricePipeline = api;
})(typeof window !== 'undefined' ? window : globalThis);
