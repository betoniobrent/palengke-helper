'use strict';
const printButton = document.getElementById('printButton');
printButton.addEventListener('click', () => window.print());
document.getElementById('closeButton').addEventListener('click', () => window.close());
(async () => {
try {
    let copy;
    if (location.hash.startsWith('#copy=')) {
        const encoded = location.hash.slice(6);
        if (encoded.length > 60000) throw new Error('This shared link is too large.');
        const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
        const stream = new Blob([Uint8Array.from(binary, c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream('gzip'));
        const reader = stream.getReader();
        const chunks = []; let size = 0;
        while (true) {
            const {value, done} = await reader.read(); if (done) break;
            size += value.length;
            if (size > 1000000) { await reader.cancel(); throw new Error('This shared copy is too large.'); }
            chunks.push(value);
        }
        copy = JSON.parse(await new Blob(chunks).text());
    } else copy = JSON.parse(sessionStorage.getItem('palengke_print_copy') || 'null');
    if (!copy || typeof copy.text !== 'string') throw new Error('No output selected. Return to the app and choose Print / PDF on your plan or list.');
    document.getElementById('copyTitle').textContent = copy.title;
    document.title = 'Palengke Helper+ — ' + copy.title;
    const lines = copy.text.split('\n');
    document.getElementById('copyDate').textContent = lines[2] || '';
    const content = document.getElementById('copyContent');
    for (const line of lines.slice(4)) {
        const row = document.createElement('p');
        row.textContent = line || '\u00a0';
        if (/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Income|Expenses)$/.test(line)) row.className = 'section-title';
        if (/^(Total |Remaining:|Priced subtotal:)/.test(line)) row.className = 'total';
        content.appendChild(row);
    }
} catch (error) {
    document.getElementById('copyContent').textContent = error.message;
    printButton.disabled = true;
}

})();
