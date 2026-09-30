const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');const vm=require('vm');
const source=fs.readFileSync('app.js','utf8');
function load(context,names){vm.createContext(context);for(const name of names){const start=source.indexOf('function '+name+'(');assert.ok(start>=0);const tail=source.slice(start);const end=tail.slice(1).search(/^function |^async function /m);vm.runInContext(tail.slice(0,end+1),context);}return context;}
const chicken={name:'Chicken Adobo',servings:4,estimatedCost:320,ingredients:['1 kg Chicken','6 cloves Garlic']};
function setup(){const input={value:'4'};const context=load({document:{getElementById:()=>input},plannerPriceFeed:null,plannerPriceCache:new WeakMap(),MealCosting:require('../meal-costing'),ALL_PRICE_ITEMS:[{item_name:'Whole Chicken, Local Fully Dressed',unit:'kg',price_avg:200,source_agency:'DA',source_date:'2026-09-27'}]},['getPlannerPax','getPlannerRecipePricing','calculateRecipeCostFromMarket','plannerPriceLabel']);return {context,input};}
test('planner scales incomplete recipe allowance and verified subtotal separately for 1/2/4/6/8 pax',()=>{
 const {context}=setup();for(const pax of [1,2,4,6,8]){const p=context.getPlannerRecipePricing(chicken,pax);assert.equal(p.amount,80*pax);assert.equal(p.quote.subtotal,50*pax);assert.equal(p.estimated,true);assert.match(context.plannerPriceLabel(chicken,pax),/Planning estimate/);}
});
test('fully priced recipe uses verified costs instead of old base allowance',()=>{
 const {context}=setup();const recipe={...chicken,ingredients:['1 kg Chicken']};assert.equal(context.calculateRecipeCostFromMarket(recipe,2),100);assert.equal(context.getPlannerRecipePricing(recipe,2).estimated,false);
});
test('planner never budgets below known ingredient subtotal',()=>{
 const {context}=setup();const p=context.getPlannerRecipePricing({...chicken,estimatedCost:20},4);assert.equal(p.amount,200);assert.equal(p.estimated,true);
});
test('pax change refreshes views without replacing selected meals; invalid pax is ignored',()=>{
 const input={value:'4'},plan={Monday:{Lunch:chicken}};let metrics=0,summary=0,details=0;
 const c=load({document:{getElementById:id=>id==='plannerPax'?input:{classList:{contains:()=>false,add(){}}}},currentMealPlan:plan,selectedMealSlot:null,plannerDetailsRecipe:chicken,calculatePlanMetrics(){metrics++},renderPlannerSummaryFromCurrentPlan(){summary++},showRecipeDetails(){details++}},['setPlannerPax','refreshPlannerPax']);
 c.setPlannerPax(8);assert.equal(input.value,8);assert.equal(plan.Monday.Lunch,chicken);assert.equal(metrics,1);assert.equal(summary,1);assert.equal(details,1);
 for(const n of [0,-1,2.5,101])c.setPlannerPax(n);assert.equal(input.value,8);assert.equal(summary,1);
});
