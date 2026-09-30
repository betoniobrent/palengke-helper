const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
test('tutorial supports replay, bounds, finish and explicit navigation without changing user data',()=>{
 const nodes={appTutorial:{open:false,showModal(){this.open=true},close(){this.open=false}},tutorialTips:{replaceChildren(){},appendChild(){} }};let navigation=null;
 const c={document:{getElementById:id=>nodes[id]||(nodes[id]={scrollIntoView(){}}),createElement:()=>({})},switchTab:tab=>navigation=tab};vm.createContext(c);vm.runInContext(fs.readFileSync('tutorial.js','utf8'),c);
 c.openTutorial();assert.equal(nodes.appTutorial.open,true);assert.equal(nodes.tutorialBack.disabled,true);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
 c.advanceTutorial(-1);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
 for(let i=0;i<6;i++)c.advanceTutorial(1);assert.equal(nodes.tutorialNext.textContent,'Finish');assert.equal(navigation,null);
 c.advanceTutorial(1);assert.equal(nodes.appTutorial.open,false);
 c.openTutorial(4);assert.equal(nodes.tutorialTitle.textContent,'4. Build your grocery list');c.openTutorialSection();assert.equal(navigation,'grocery');assert.equal(nodes.appTutorial.open,false);
 c.openTutorial(99);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
});
