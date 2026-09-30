const {test}=require('node:test');
const assert=require('node:assert/strict');
const cost=require('../meal-costing');
function row(item_name,unit,price,extra={}) {return {item_name,unit,price_avg:price,source_agency:'DA',source_date:'2026-09-27',region:'NCR',...extra};}
function recipe(ingredients) {return {name:'Test meal',servings:2,ingredients};}
test('mass conversion, serving scale and rounded line totals are deterministic',()=>{
 const q=cost.quote(recipe(['400 g Chicken','200 g Rice']),[row('Whole Chicken, Local Fully Dressed','kg',200),row('Regular Milled 20-40% bran streak (Local)','kg',50)],4);
 assert.equal(q.subtotal,180);assert.equal(q.complete,true);assert.equal(q.lines[0].cost,160);
});
test('DTI package price converts ml and separates consumption from whole-package purchase',()=>{
 const q=cost.quote(recipe(['60 ml Soy Sauce']),[row('SOY SAUCE – DOY PACK / REFILL PACK — Silver Swan Doy Pack','200ml',12,{source_agency:'DTI'})]);
 assert.equal(q.subtotal,3.60);assert.equal(q.purchaseSubtotal,12);assert.equal(q.complete,true);
});
test('partial packages round up only purchase cost',()=>{
 const q=cost.quote(recipe(['300 ml Soy Sauce']),[row('SOY SAUCE – DOY PACK / REFILL PACK — Silver Swan Doy Pack','200ml',12,{source_agency:'DTI'})]);
 assert.equal(q.subtotal,18);assert.equal(q.purchaseSubtotal,24);
});
test('unknown weights, density, cooked ingredients and fallback prices cannot become verified totals',()=>{
 const q=cost.quote(recipe(['4 cloves Garlic','1 cup Rice','200 g Cooked Rice','1 Onion','1 kg Chicken']),[row('Garlic, Native/Local','kg',100),row('Regular Milled 20-40% bran streak (Local)','kg',50),row('Red Onion, Local','kg',100),row('Whole Chicken, Local Fully Dressed','kg',100,{source_agency:undefined})]);
 assert.equal(q.complete,false);assert.equal(q.subtotal,0);assert.equal(q.lines.filter(x=>x.missing).length,5);
 assert.match(cost.format(q),/incomplete subtotal/);assert.match(cost.format(q,true),/Hindi ito buong gastos/);
});
test('subsidized rice, chicken feet and boneless cuts never silently substitute',()=>{
 const rows=[row('P20 Benteng Bigas Meron Na','kg',20),row('Chicken Feet','kg',100),row('Whole Chicken, Local Fully Dressed','kg',200)];
 const q=cost.quote(recipe(['300 g Rice','400 g Chicken Thighs Boneless']),rows);
 assert.equal(q.subtotal,0);assert.equal(q.complete,false);
});
test('ambiguous regions and missing prices stay missing',()=>{
 const rows=[row('Whole Chicken, Local Fully Dressed','kg',200),row('Whole Chicken, Local Fully Dressed','kg',220,{region:'Region IV-A'}),row('Garlic, Native/Local','kg',null)];
 const q=cost.quote(recipe(['1 kg Chicken','50 g Garlic']),rows);
 assert.equal(q.lines[0].missing,'ambiguous_product');assert.equal(q.lines[1].missing,'no_verified_price');
});
test('fractions use declared liquid measures and do not infer density',()=>{
 const q=cost.quote(recipe(['1/2 cup Soy Sauce']),[row('SOY SAUCE – DOY PACK / REFILL PACK — Silver Swan Doy Pack','200ml',12,{source_agency:'DTI'})]);
 assert.equal(q.subtotal,7.20);assert.match(cost.format(q),/1 cup = 240 ml/);
 assert.equal(cost.ingredient('1 1/2 kg Chicken').quantity,1500);
});

test('groceries pool package needs before rounding without discounting unit price',()=>{
 const r=recipe(['60 ml Soy Sauce','300 g Chicken']);
 const rows=[row('SOY SAUCE – DOY PACK / REFILL PACK — Silver Swan Doy Pack','200ml',12,{source_agency:'DTI'}),row('Whole Chicken, Local Fully Dressed','kg',200)];
 const g=cost.groceries([r,r],rows,2);
 assert.equal(g[0].quantity,1);assert.equal(g[0].price,12);assert.equal(g[0].requiredUnits,0.6);
 assert.equal(g[1].quantity,0.6);assert.equal(g[1].price,200);
 assert.equal(cost.groceries([r,r],rows,4)[0].quantity,2);
});
test('groceries keep unknown prices and measures explicit and exclude household water',()=>{
 const g=cost.groceries([recipe(['50 g Green Papaya','Bay Leaves','1 l Water'])],[row('Papaya Solo, Ripe','kg',50)],4);
 assert.equal(g.length,2);assert.equal(g[0].price,null);assert.equal(g[0].quantity,100);assert.equal(g[0].unit,'g');
 assert.equal(g[1].unit,'recipe portion');assert.equal(g[1].priceMissing,true);
 assert.match(cost.format(cost.quote(recipe(['1 l Water']),[])),/household water, excluded/);
});
test('counted groceries round once across meals and liter bottles retain their selling unit',()=>{
 const g=cost.groceries([recipe(['3 pc Eggs','15 ml Cooking Oil']),recipe(['3 pc Eggs','15 ml Cooking Oil'])],[row('Chicken Egg (White, Medium)','pc',8),row('Cooking Oil (Palm) 1 Liter/bottle','1 L bottle',100)],1);
 assert.equal(g[0].quantity,3);assert.equal(g[0].price,8);assert.equal(g[1].quantity,1);assert.equal(g[1].price,100);
});
test('all twelve measured recipes have parseable quantities and disclosure',()=>{
 const fs=require('node:fs'),vm=require('node:vm');const c={};vm.createContext(c);
 vm.runInContext(fs.readFileSync(require.resolve('../data/recipes.js'),'utf8')+';globalThis.recipes=RECIPE_DATABASE;',c);
 const measured=c.recipes.filter(r=>r.quantityNote);assert.equal(measured.length,12);
 for(const r of measured) for(const i of r.ingredients) assert.ok(cost.ingredient(i),r.name+': '+i);
});
