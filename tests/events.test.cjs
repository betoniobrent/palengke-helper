const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('delegated actions preserve data as values and reject unknown executable strings',()=>{
  const listeners={},calls=[];
  const context={document:{addEventListener:(type,fn)=>listeners[type]=fn},
    selectMarketItem:(...args)=>calls.push(args),deleteItem:i=>calls.push(i),
    purgeMonthlyBudgetFolder:id=>calls.push(id)};
  vm.createContext(context);vm.runInContext(fs.readFileSync('events.js','utf8'),context);
  function trigger(type,key,dataset,disabled=false){
    let stopped=false;
    const el={dataset,disabled,getAttribute:()=>key};
    listeners[type]({target:{closest:()=>el},stopPropagation(){stopped=true}});
    return stopped;
  }
  const name="Milk'); deleteItem(0); //";
  trigger('click','select-market',{name,price:'42',category:'food',unit:'pack'});
  assert.deepEqual(calls,[[name,42,'food','pack']]);
  trigger('click','deleteItem(0)',{});trigger('click','__proto__',{});
  trigger('click','delete-grocery',{index:'3'},true);
  assert.equal(calls.length,1);
  trigger('click','delete-grocery',{index:'3'});assert.equal(calls[1],3);
  assert.equal(trigger('click','delete-budget',{id:'month-1'}),true);
  assert.equal(calls[2],'month-1');
});

test('static HTML handlers all have explicit external implementations',()=>{
  const html=fs.readFileSync('index.html','utf8'),source=fs.readFileSync('events.js','utf8');
  assert.doesNotMatch(html,/\son(?:click|change|input|keyup)\s*=/i);
  for(const [,id] of html.matchAll(/data-handler-\w+="([^"]+)"/g)) assert.ok(source.includes('"'+id+'": function'));
  assert.doesNotMatch(fs.readFileSync('_headers','utf8'),/unsafe-inline|unsafe-eval/);
});
