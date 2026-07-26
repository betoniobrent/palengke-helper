// Cloudflare Worker proxy for DA Bantay Presyo website
// Fetches public market prices and returns clean JSON for Palengke Helper+

const DA_BASE = 'http://www.bantaypresyo.da.gov.ph/';

const COMMODITY_CATEGORIES = {
  '1': 'rice',
  '2': 'other food',
  '3': 'vegetables',
  '4': 'fish',
  '5': 'fruits',
  '6': 'vegetables',
  '7': 'vegetables',
  '8': 'meat',
  '9': 'spices',
  '10': 'other food'
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    }
  });
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseUnit(spec) {
  if (!spec) return '';

  // e.g. "8-10PCS/KG" -> "KG", "750GM-1KG/HEAD" -> "HEAD"
  if (spec.includes('/')) {
    const last = spec.split('/').pop().trim();
    if (last) return last.toLowerCase();
  }

  const lower = spec.toLowerCase();
  const units = ['bunch hd', 'bunch', 'head', 'kg', 'gm', 'g', 'pc', 'tray', 'liter', 'btl', 'can', 'pack', 'sack', 'bundle', 'doz', 'dz'];
  for (const unit of units) {
    const idx = lower.lastIndexOf(unit);
    if (idx !== -1) {
      return spec.substring(idx, idx + unit.length).toLowerCase();
    }
  }

  return spec.trim();
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const region = url.searchParams.get('region') || '040000000';
  const commodity = url.searchParams.get('commodity') || '6';
  const marketQuery = (url.searchParams.get('market') || '').trim().toUpperCase();

  if (!COMMODITY_CATEGORIES[commodity]) {
    return jsonResponse({ error: 'Invalid commodity code' }, 400);
  }

  try {
    // 1. Get the displayed date for this region/commodity
    let sourceDate = new Date().toISOString().split('T')[0];
    try {
      const dateRes = await fetch(DA_BASE + 'tbl_price_get_date_rice.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `region=${encodeURIComponent(region)}&commodity=${encodeURIComponent(commodity)}`
      });
      const dateText = stripTags(await dateRes.text()).trim();
      if (dateText) {
        const d = new Date(dateText);
        if (!isNaN(d.getTime())) sourceDate = d.toISOString().split('T')[0];
      }
    } catch (e) {
      // ignore date fetch errors, fall back to today
    }

    // 2. Fetch the market header for this region/commodity
    const headerRes = await fetch(DA_BASE + 'tbl_price_get_comm_header.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `region=${encodeURIComponent(region)}&commodity=${encodeURIComponent(commodity)}`
    });
    const headerHtml = await headerRes.text();

    const marketMatches = [...headerHtml.matchAll(/<td[^>]*class=["'][^"']*text-wrap[^"']*["'][^>]*>(.*?)<\/td>/gis)];
    const markets = marketMatches.map(m => stripTags(m[1]).trim());

    if (markets.length === 0) {
      return jsonResponse({ error: 'No markets found in DA header', rawSnippet: headerHtml.slice(0, 500) }, 500);
    }

    // 3. Pick the requested market (default to the first one)
    let marketIndex = 0;
    let selectedMarket = markets[0];
    if (marketQuery) {
      const idx = markets.findIndex(m => m.toUpperCase().includes(marketQuery));
      if (idx !== -1) {
        marketIndex = idx;
        selectedMarket = markets[idx];
      } else {
        return jsonResponse({ error: 'Market not found', requested: marketQuery, availableMarkets: markets }, 400);
      }
    }

    // 4. Fetch the price rows
    const priceRes = await fetch(DA_BASE + 'tbl_price_get_comm_price.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `region=${encodeURIComponent(region)}&commodity=${encodeURIComponent(commodity)}&count=${encodeURIComponent(markets.length)}`
    });
    const priceHtml = await priceRes.text();

    const rows = [];
    const rowMatches = [...priceHtml.matchAll(/<tr[^>]*>(.*?)<\/tr>/gis)];
    for (const rowMatch of rowMatches) {
      const cells = [...rowMatch[1].matchAll(/<td[^>]*>(.*?)<\/td>/gis)].map(m => stripTags(m[1]).trim());
      if (cells.length < 2 + marketIndex + 1) continue;

      const itemName = cells[0].trim();
      const spec = cells[1].trim();
      const priceText = cells[2 + marketIndex].trim();

      if (!itemName || !priceText || priceText.toUpperCase() === 'N/A') continue;
      const price = parseFloat(priceText);
      if (isNaN(price) || price <= 0) continue;

      rows.push({
        item_name: itemName,
        category: COMMODITY_CATEGORIES[commodity],
        unit: parseUnit(spec),
        price_min: price,
        price_max: price,
        notes: spec,
        source_date: sourceDate
      });
    }

    return jsonResponse({
      date: sourceDate,
      market: selectedMarket,
      markets,
      count: rows.length,
      rows
    });
  } catch (err) {
    return jsonResponse({ error: err.message || 'Unknown error', stack: err.stack }, 500);
  }
}
