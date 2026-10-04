const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('bootstrap.js','utf8');
function setup({session=null,hash='',search='',fail=false}={}) {
  const scripts=[],events=[],listeners={},status={textContent:''};let replay=0;
  const context={Set,Promise,Event:class{constructor(type){this.type=type}},
    localStorage:{getItem:()=>session},location:{hash,search},
    window:{dispatchEvent:e=>events.push('window:'+e.type)},
    document:{getElementById:()=>status,createElement:tag=>({tag,remove(){},setAttribute(){}}),
      head:{appendChild(node){if(node.tag!=='script')return;scripts.push(node.src);queueMicrotask(()=>{if(fail){fail=false;node.onerror()}else node.onload()})}},
      addEventListener:(type,fn)=>listeners[type]=fn,dispatchEvent:e=>events.push(e.type)}};
  vm.runInNewContext(source,context);
  const click=async(theme=false)=>listeners.click({target:{closest:()=>({hasAttribute:()=>theme,click(){replay++}})},preventDefault(){},stopImmediatePropagation(){}});
  return {scripts,events,status,click,replay:()=>replay};
}
test('welcome and theme interaction do not download workspace scripts; first app action loads once',async()=>{
  const app=setup();assert.equal(app.scripts.length,0);
  await app.click(true);assert.equal(app.scripts.length,0);
  await Promise.all([app.click(),app.click()]);
  assert.equal(app.scripts.length,10);assert.equal(new Set(app.scripts).size,10);
  assert.equal(app.replay(),1);assert.deepEqual(app.events,['palengke:ready','window:palengke:ready']);
});
test('returning sessions and OAuth or recovery callbacks start loading automatically',async()=>{
  for(const options of [{session:'saved'},{hash:'#access_token=test'},{hash:'#type=recovery'},{search:'?code=test'}]){
    const app=setup(options);await new Promise(resolve=>setImmediate(resolve));assert.equal(app.scripts.length,10);
  }
});
test('failed startup gives a retry path without replaying the requested action early',async()=>{
  const app=setup({fail:true});await app.click();assert.equal(app.replay(),0);assert.match(app.status.textContent,/retry/);
  await app.click();assert.equal(app.replay(),1);assert.equal(app.events.length,2);
});
