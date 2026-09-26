const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
function loadFunctions(context, names) {
    vm.createContext(context);
    for (const name of names) {
        const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
        assert.ok(start >= 0, `Missing function ${name}`);
        const tail = source.slice(start);
        const end = tail.slice(1).search(/^(?:async )?function /m);
        vm.runInContext(end < 0 ? tail : tail.slice(0, end + 1), context);
    }
    return context;
}

function storage(initial = {}) {
    const values = { ...initial };
    return {
        getItem: key => values[key] ?? null,
        setItem: (key, value) => { values[key] = value; }
    };
}

function groceryContext() {
    const cards = [];
    const search = { value: 'fish' };
    const cart = { appendChild: card => cards.push(card) };
    Object.defineProperty(cart, 'innerHTML', { set: () => { cards.length = 0; } });
    let summary;
    const context = loadFunctions({
        localStorage: storage({ groceryItems: JSON.stringify([
            { name: 'Rice', price: 50, quantity: 1, unit: 'kg' },
            { name: 'Fish', price: 100, quantity: 1, unit: 'kg' }
        ]) }),
        document: {
            getElementById: id => id === 'groceryCartItems' ? cart : search,
            createElement: () => ({})
        },
        updateCartSummary: items => { summary = items; },
        saveGroceryListToSupabase: () => {},
        showNotification: () => {}
    }, ['getGroceryData', 'setGroceryData', 'getItemUnitPrice', 'renderGroceryItems',
        'searchItems', 'deleteItem', 'toggleGroceryItemCheck', 'updateGroceryQuantity', 'setGroceryQuantity']);
    context.searchItems();
    return { context, cards, search, summary: () => summary };
}

test('filtered delete removes the displayed item and keeps full-list totals', () => {
    const { context, cards, summary } = groceryContext();
    assert.equal(cards.length, 1);
    assert.equal(summary().length, 2);
    const index = Number(cards[0].innerHTML.match(/deleteItem\((\d+)\)/)[1]);
    context.deleteItem(index);
    assert.equal(context.getGroceryData()[0].name, 'Rice');
    assert.equal(context.getGroceryData().length, 1);
    assert.equal(cards.length, 0);
});

test('filtered checkbox and both quantity controls target the displayed item', () => {
    const { context, cards } = groceryContext();
    for (const fn of ['toggleGroceryItemCheck', 'updateGroceryQuantity', 'setGroceryQuantity']) {
        const index = Number(cards[0].innerHTML.match(new RegExp(`${fn}\\((\\d+)`))[1]);
        context[fn](index, fn === 'setGroceryQuantity' ? '2.5' : 1);
    }
    const items = context.getGroceryData();
    assert.equal(items[0].quantity, 1);
    assert.equal(items[0].checked, undefined);
    assert.equal(items[1].quantity, 2.5);
    assert.equal(items[1].checked, true);
});

function mealContext({ member = true, error = null, rows = [{ id: 'remote-1' }] } = {}) {
    const calls = [];
    const notices = [];
    const query = {
        delete: () => { calls.push('delete'); return query; },
        eq: (key, value) => { calls.push([key, value]); return query; },
        select: async () => ({ data: rows, error })
    };
    const context = loadFunctions({
        localStorage: storage({
            palengke_session: JSON.stringify(member ? { role: 'member', supabaseUserId: 'user-1' } : { role: 'guest' }),
            palengke_saved_meal_plans: JSON.stringify([{ id: 'remote-1' }, { id: 'meal_plan_1' }])
        }),
        supabaseClient: { from: table => { assert.equal(table, 'user_meal_plans'); return query; } },
        confirm: () => true,
        console: { error: () => {} },
        renderSavedMealPlans: async () => {},
        showNotification: (message, type) => notices.push(type)
    }, ['setMealPlans', 'deleteMealPlan']);
    return { context, calls, notices, backup: () => JSON.parse(context.localStorage.getItem('palengke_saved_meal_plans')) };
}

test('member deletion removes the remote row and its local backup', async () => {
    const { context, calls, notices, backup } = mealContext();
    await context.deleteMealPlan('remote-1');
    assert.deepEqual(calls, ['delete', ['id', 'remote-1'], ['user_id', 'user-1']]);
    assert.deepEqual(backup(), [{ id: 'meal_plan_1' }]);
    assert.deepEqual(notices, ['success']);
});

test('failed or unauthorized remote deletion preserves the backup and reports failure', async () => {
    for (const options of [{ error: new Error('Offline') }, { rows: [] }]) {
        const { context, notices, backup } = mealContext(options);
        await context.deleteMealPlan('remote-1');
        assert.equal(backup().length, 2);
        assert.deepEqual(notices, ['error']);
    }
});

test('guest and member fallback plans delete locally without a database request', async () => {
    for (const member of [false, true]) {
        const { context, calls, notices, backup } = mealContext({ member });
        await context.deleteMealPlan('meal_plan_1');
        assert.deepEqual(calls, []);
        assert.deepEqual(backup(), [{ id: 'remote-1' }]);
        assert.deepEqual(notices, ['success']);
    }
});
