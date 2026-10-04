const test=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const source=fs.readFileSync('app.js','utf8');
test('budget periods select matching income and expense defaults without changing saved entries',()=>{
 const nodes={budgetFrequency:{value:'kinsenas'},budgetPeriod:{replaceChildren(...options){this.options=options;}},budgetPeriodLabel:{},incSpec:{},expSpec:{}};
 let filter;const ctx=vm.createContext({document:{getElementById:id=>nodes[id],createElement:()=>({})},applySpecificationFilter:p=>filter=p});
 for(const name of ['setBudgetFrequency','selectBudgetPeriod']) vm.runInContext(source.slice(source.indexOf('function '+name+'('),source.indexOf('\nfunction ',source.indexOf('function '+name+'(')+1)),ctx);
 ctx.setBudgetFrequency();assert.equal(filter,'1st Cut (1st-15th)');assert.equal(nodes.budgetPeriod.options.length,2);
 ctx.selectBudgetPeriod('2nd Cut (16th-End)');assert.equal(nodes.incSpec.value,filter);assert.equal(nodes.expSpec.value,filter);
 nodes.budgetFrequency.value='weekly';ctx.setBudgetFrequency();assert.equal(nodes.budgetPeriod.options.length,4);assert.match(nodes.budgetPeriod.options[3].textContent,/22–end/);
 nodes.budgetFrequency.value='monthly';ctx.setBudgetFrequency();assert.equal(filter,'Monthly');assert.equal(nodes.budgetPeriod.hidden,true);
 nodes.budgetFrequency.value='all';ctx.setBudgetFrequency();assert.equal(filter,'all');assert.equal(nodes.incSpec.value,'Monthly');
});
