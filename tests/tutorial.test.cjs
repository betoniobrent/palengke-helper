const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
test('tutorial supports replay, bounds, finish and explicit navigation without changing user data',()=>{
 const nodes={appTutorial:{open:false,showModal(){this.open=true},close(){this.open=false}},tutorialTips:{replaceChildren(){},appendChild(){} }};let navigation=null;
 const c={document:{getElementById:id=>nodes[id]||(nodes[id]={scrollIntoView(){},setAttribute(){}}),createElement:()=>({})},switchTab:tab=>navigation=tab};vm.createContext(c);vm.runInContext(fs.readFileSync('tutorial.js','utf8'),c);
 c.openTutorial();assert.equal(nodes.appTutorial.open,true);assert.equal(nodes.tutorialBack.disabled,true);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
 c.advanceTutorial(-1);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
 for(let i=0;i<6;i++)c.advanceTutorial(1);assert.equal(nodes.tutorialNext.textContent,'Finish');assert.equal(navigation,null);
 c.advanceTutorial(1);assert.equal(nodes.appTutorial.open,false);
 c.openTutorial(4);assert.equal(nodes.tutorialTitle.textContent,'4. Build your grocery list');c.openTutorialSection();assert.equal(navigation,'grocery');assert.equal(nodes.appTutorial.open,false);
 c.openTutorial(99);assert.equal(nodes.tutorialProgress.textContent,'Step 1 of 7');
});

test('Tagalog translates all steps, preserves position and remembers the tutorial preference',()=>{
 const nodes={appTutorial:{open:false,showModal(){this.open=true},close(){this.open=false}},tutorialTips:{replaceChildren(){this.items=[]},appendChild(item){this.items.push(item.textContent)}}};let saved=null,tab=null;
 const c={localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},document:{getElementById:id=>nodes[id]||(nodes[id]={setAttribute(){},scrollIntoView(){}}),createElement:()=>({})},switchTab:value=>tab=value};vm.createContext(c);vm.runInContext(fs.readFileSync('tutorial.js','utf8'),c);
 c.openTutorial(4);c.setTutorialLanguage('tl');assert.equal(nodes.tutorialProgress.textContent,'Hakbang 5 sa 7');assert.equal(nodes.tutorialTitle.textContent,'4. Gumawa ng listahan ng bibilhin');assert.equal(nodes.tutorialNext.textContent,'Susunod');assert.equal(nodes.tutorialBack.textContent,'Bumalik');assert.equal(nodes.appTutorial.lang,'fil');assert.equal(saved,'tl');
 c.openTutorialSection();assert.equal(tab,'grocery');c.openTutorial();assert.equal(nodes.tutorialProgress.textContent,'Hakbang 1 sa 7');
 for(let i=0;i<7;i++){assert.ok(nodes.tutorialTips.items.length>=2);assert.ok(nodes.tutorialText.textContent);if(i<6)c.advanceTutorial(1)}
 assert.equal(nodes.tutorialNext.textContent,'Tapos');c.setTutorialLanguage('en');assert.equal(nodes.tutorialNext.textContent,'Finish');assert.equal(nodes.tutorialProgress.textContent,'Step 7 of 7');assert.equal(saved,'en');
});

test('every tab has a complete bilingual guide with independent navigation and replay',()=>{
 const nodes={appTutorial:{open:false,showModal(){this.open=true},close(){this.open=false}},tutorialTips:{replaceChildren(){this.items=[]},appendChild(item){this.items.push(item.textContent)}}};let tab=null;
 const c={document:{getElementById:id=>nodes[id]||(nodes[id]={setAttribute(){},scrollIntoView(){}}),createElement:()=>({})},switchTab:value=>tab=value};vm.createContext(c);vm.runInContext(fs.readFileSync('tutorial-tabs.js','utf8')+'\n'+fs.readFileSync('tutorial.js','utf8'),c);
 const html=fs.readFileSync('index.html','utf8');
 for(const topic of ['home','budget','meal','prices','grocery','suggestions']){
  assert.ok(html.includes("openTabTutorial('"+topic+"')"));
  for(const language of ['en','tl']){
   c.openTabTutorial(topic);c.setTutorialLanguage(language);const steps=c.currentTutorialSteps();assert.ok(steps.length>=3);
   for(let i=0;i<steps.length;i++){assert.ok(steps[i].title);assert.ok(steps[i].text);assert.ok(steps[i].tips.length>=2);assert.equal(steps[i].section,topic);if(i<steps.length-1)c.advanceTutorial(1)}
   assert.equal(nodes.tutorialNext.textContent,language==='tl'?'Tapos':'Finish');c.openTutorialSection();assert.equal(tab,topic);
  }
 }
 c.openTutorial();assert.equal(c.currentTutorialSteps().length,7);
});
