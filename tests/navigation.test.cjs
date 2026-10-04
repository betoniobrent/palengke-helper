const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
test('rapid tab changes cancel earlier motion and reduced motion skips animation',()=>{
 const html=fs.readFileSync('navigation.js','utf8');const start=html.indexOf('let activeTabTransition = null;');const end=html.indexOf('function toggleAccountMenu',start);let animations=0,canceled=0,reduced=false;
 const views=['home','budget','prices'].map((id,i)=>({id:'view-'+id,hidden:i!==0,classList:{add(){views.find(v=>v.classList===this).hidden=true},remove(){views.find(v=>v.classList===this).hidden=false}},animate(){animations++;return {cancel(){canceled++}}}}));
 const context={document:{getElementById:id=>views.find(v=>v.id===id)||null,querySelector:()=>views.find(v=>!v.hidden),querySelectorAll:selector=>selector==='.tab-content'?views:[]},window:{matchMedia:()=>({matches:reduced})}};
 vm.createContext(context);vm.runInContext(html.slice(start,end),context);
 context.switchTab('budget');context.switchTab('prices');assert.equal(animations,2);assert.equal(canceled,1);assert.equal(views.filter(v=>!v.hidden).length,1);assert.equal(views.find(v=>!v.hidden).id,'view-prices');
 context.switchTab('prices');assert.equal(animations,2);reduced=true;context.switchTab('home');assert.equal(animations,2);assert.equal(views.find(v=>!v.hidden).id,'view-home');context.switchTab('invalid');assert.equal(views.find(v=>!v.hidden).id,'view-home');
});
