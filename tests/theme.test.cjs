const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
test('theme follows system until selected, persists, and tolerates unavailable storage',()=>{
 for(const blocked of [false,true]) {
  const listeners={},attrs={};let saved=null,systemChange;
  const button={setAttribute(k,v){attrs[k]=v},addEventListener(k,fn){listeners[k]=fn}};
  const root={dataset:{},style:{}};
  const system={matches:true,addEventListener(k,fn){systemChange=fn}};
  const c={window:{matchMedia:()=>system},document:{documentElement:root,querySelectorAll:()=>[button],querySelector:()=>null,addEventListener(k,fn){listeners[k]=fn}},localStorage:{getItem(){if(blocked)throw Error();return null},setItem(k,v){if(blocked)throw Error();saved=v}}};
  vm.runInNewContext(fs.readFileSync('theme.js','utf8'),c);
  listeners.DOMContentLoaded();assert.equal(root.dataset.theme,'dark');assert.equal(attrs['aria-pressed'],'true');
  listeners.click();assert.equal(root.dataset.theme,'light');assert.equal(button.textContent,'☾ Dark mode');
  systemChange();assert.equal(root.dataset.theme,'light');if(!blocked)assert.equal(saved,'light');
 }
});
