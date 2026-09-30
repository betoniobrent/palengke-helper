/* Strict, deterministic costing for AI quotes. No fallback prices or guessed weights. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.MealCosting = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const normalize = text => String(text).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    const choices = {
        chicken: /^whole chicken\b/, rice: /^regular milled.*local/,
        eggs: /^chicken egg white medium\b/, egg: /^chicken egg white medium\b/,
        pork: /^pork picnic shoulder.*local/, beef: /^beef brisket.*local/,
        'soy sauce': /^soy sauce.*silver swan doy pack/,
        vinegar: /^vinegar.*silver swan sukang puti doy pack/,
        garlic: /^garlic native local/, onion: /^red onion local/,
        tomato: /^tomato\b/, tomatoes: /^tomato\b/,
        potato: /^white potato local/, carrots: /^carrots local/,
        carrot: /^carrots local/, kamote: /^sweet potato\b/,
        'sweet potato': /^sweet potato\b/, tilapia: /^tilapia\b/,
        bangus: /^bangus medium\b/, eggplant: /^eggplant\b/,
        talong: /^eggplant\b/, sayote: /^chayote\b/,
        squash: /^squash\b/, kalabasa: /^squash\b/,
        ginger: /^ginger local/, munggo: /^mungbean\b/, monggo: /^mungbean\b/,
        'mung beans': /^mungbean\b/, cabbage: /^cabbage rare ball/
    };
    const measures = {kg:['mass',1000],g:['mass',1],gram:['mass',1],grams:['mass',1],
        ml:['volume',1],l:['volume',1000],liter:['volume',1000],liters:['volume',1000],
        pc:['count',1],pcs:['count',1],piece:['count',1],pieces:['count',1]};
    const liquids = new Set(['soy sauce','vinegar','fish sauce','oil','milk','coconut milk']);
    function amount(text) {
        const bits = text.trim().split(/\s+/);
        return bits.reduce((sum, part) => { const [a,b] = part.split('/').map(Number); return sum + (b === undefined ? a : a/b); },0);
    }
    function ingredient(text) {
        const match = String(text).match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s+(.+)$/);
        if (!match) return null;
        const quantity = amount(match[1]);
        let rest = match[2].trim();
        let unit = 'pc';
        const unitMatch = rest.match(/^(kg|grams?|g|ml|liters?|l|pcs?|pieces?|cups?|tbsps?|tsps?|cloves?|heads?|bunches?|bundles?|cans?|packs?)\s+(.+)$/i);
        if (unitMatch) {unit = unitMatch[1].toLowerCase(); rest = unitMatch[2];}
        const name = normalize(rest);
        let measure = measures[unit];
        if (/^(cup|tbsp|tsp)s?$/.test(unit) && liquids.has(name)) {
            measure = ['volume', unit.startsWith('cup') ? 240 : unit.startsWith('tbsp') ? 15 : 5];
        }
        if (!measure || !Number.isFinite(quantity) || quantity <= 0) return null;
        return {name, quantity:quantity * measure[1], dimension:measure[0], volumeConvention:/^(cup|tbsp|tsp)/.test(unit)};
    }
    function sellingUnit(unit) {
        const match = String(unit).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)?\s*(kg|g|ml|l|pc|pcs|piece|pieces)$/);
        if (!match) return null;
        const measure = measures[match[2]];
        return {dimension:measure[0], quantity:Number(match[1] || 1) * measure[1], packaged:!!match[1]};
    }
    function quote(recipe, rows, servings = recipe.servings) {
        const scale = Number(servings) / Number(recipe.servings);
        if (!Number.isFinite(scale) || scale <= 0) throw new Error('Invalid serving count');
        const lines = (recipe.ingredients || []).map(text => {
            const display = String(text).replace(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/, value => String(Math.round(amount(value) * scale * 1000) / 1000));
            const parsed = ingredient(text);
            if (!parsed) return {ingredient:display, missing:'quantity_or_unit'};
            const candidates = rows.filter(row => {
                if (!['DA','DTI'].includes(row.source_agency) || !/^\d{4}-\d{2}-\d{2}$/.test(row.source_date || '')) return false;
                const name = normalize(row.item_name || row.name);
                if (/benteng|bente|subsid|\bp20\b|feed grade/.test(name)) return false;
                return name === parsed.name || choices[parsed.name]?.test(name);
            });
            // Never silently choose between regions or product variants.
            if (candidates.length !== 1) return {ingredient:display, missing:candidates.length ? 'ambiguous_product' : 'no_verified_price'};
            const row = candidates[0];
            const unit = sellingUnit(row.unit);
            if (!unit || unit.dimension !== parsed.dimension) return {ingredient:display, missing:'incompatible_unit'};
            const value = row.price_avg ?? (row.price_min === row.price_max ? row.price_min : null);
            if (value === null || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) return {ingredient:display, missing:'no_verified_price'};
            const units = parsed.quantity * scale / unit.quantity;
            const cents = Math.round(Number(value) * units * 100);
            return {ingredient:display, product:row.item_name || row.name, price:Number(value), unit:row.unit,
                agency:row.source_agency, date:row.source_date, region:row.region || 'unspecified',
                cost:cents / 100, purchaseCost:Math.round(Number(value) * (unit.packaged ? Math.ceil(units - 1e-10) : units) * 100) / 100,
                volumeConvention:parsed.volumeConvention};
        });
        const priced = lines.filter(line => !line.missing);
        const subtotal = priced.reduce((sum,line)=>sum+Math.round(line.cost*100),0)/100;
        return {name:recipe.name,servings:Number(servings),baseServings:recipe.servings,lines,subtotal,
            purchaseSubtotal:priced.reduce((sum,line)=>sum+Math.round(line.purchaseCost*100),0)/100,
            complete:lines.length > 0 && priced.length === lines.length};
    }
    function format(quote, filipino = false) {
        const money = n => '₱' + n.toFixed(2);
        const reasons = filipino ? {quantity_or_unit:'kailangan ang eksaktong dami o sukat',ambiguous_product:'kailangan pumili ng produkto o rehiyon',no_verified_price:'walang beripikadong presyo',incompatible_unit:'kailangan ang timbang o tamang sukat'} :
            {quantity_or_unit:'exact quantity or measure needed',ambiguous_product:'choose a product or region',no_verified_price:'no verified price',incompatible_unit:'weight or compatible measure needed'};
        const out = [filipino ? `Kuwenta para sa ${quote.name} sa app (${quote.servings} tao):` : `App recipe calculation: ${quote.name} (${quote.servings} servings):`,
            filipino ? 'Naka-scale ang sangkap at gastos sa bilang ng kakain.' : 'Ingredient amounts and costs are scaled to the serving count.'];
        for (const line of quote.lines) {
            out.push(line.missing ? `• ${line.ingredient}: ${reasons[line.missing]}.` :
                `• ${line.ingredient}: ${money(line.cost)} (${line.product}, ${money(line.price)}/${line.unit}; ${line.agency === 'DTI' ? 'DTI SRP' : 'DA'}, ${line.date}, ${line.region}).`);
        }
        out.push(quote.complete ? `${filipino ? 'Kabuuang halaga ng sangkap' : 'Ingredient total'}: ${money(quote.subtotal)}.` :
            `${filipino ? 'Subtotal lang ng may presyo' : 'Priced ingredients only — incomplete subtotal'}: ${money(quote.subtotal)}. ${filipino ? 'Hindi ito buong gastos o garantiyang pasok sa budget.' : 'This is not the full cost or a guarantee it fits your budget.'}`);
        if (quote.purchaseSubtotal !== quote.subtotal) out.push(`${filipino ? 'Subtotal kung bibili ng buong pakete' : 'Subtotal when buying whole packages'}: ${money(quote.purchaseSubtotal)} (${filipino ? 'hindi kasama ang walang presyo' : 'excludes missing prices'}).`);
        if (quote.lines.some(line=>line.volumeConvention)) out.push(filipino ? 'Sukat para sa likido: 1 cup = 240 ml; 1 tbsp = 15 ml; 1 tsp = 5 ml.' : 'Liquid measures: 1 cup = 240 ml; 1 tbsp = 15 ml; 1 tsp = 5 ml.');
        out.push(filipino ? 'Presyo sa ulat lang ito, hindi live na presyo sa tindahan. Hindi kasama ang gas at mga dagdag na wala sa listahan, gaya ng kanin.' : 'Report-based references, not live shop prices. Excludes cooking fuel and extras not listed, such as rice.');
        return out.join('\n');
    }
    return {ingredient,sellingUnit,quote,format};
});
