const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('app.js','utf8');
function load(c,names){vm.createContext(c);for(const name of names){const start=source.search(new RegExp(`^(?:async )?function ${name}\\(`,'m'));const tail=source.slice(start);const end=tail.slice(1).search(/^(?:async )?function |^\/\/ PWA install/m);vm.runInContext(tail.slice(0,end+1),c);}return c;}
test('AI includes later DTI prices, source dates and unavailable values',()=>{
 const c=load({ALL_PRICE_ITEMS:[...Array.from({length:25},()=>({item_name:'Rice',price_avg:50})),{item_name:'Soap',price_avg:25,source_agency:'DTI',source_date:'2026-05-11'},{item_name:'Missing',price_avg:null}],MARKET_PRICE_REFERENCE:[]},['buildMarketPriceContext']);
 const text=c.buildMarketPriceContext('soap missing');assert.match(text,/Soap: ₱25/);assert.match(text,/DTI;.*2026-05-11/);assert.match(text,/Missing: unavailable/);assert.doesNotMatch(text,/₱0.00/);assert.ok(text.length <= 4500);
});
test('clear cancels pending work and removes conversation identity',()=>{
 let aborted=false,removed=false,welcome=false;const history={innerHTML:'old'};
 const c=load({aiConversationVersion:0,aiRequestPending:true,aiRequestController:{abort(){aborted=true}},palengkeAIThreadId:'old',localStorage:{removeItem(){removed=true}},document:{getElementById(){return history}},renderAIWelcomeMessage(){welcome=true}},['clearAIChatHistory']);
 c.clearAIChatHistory();assert.equal(c.aiConversationVersion,1);assert.equal(c.palengkeAIThreadId,'');assert.equal(c.aiRequestPending,false);assert.ok(aborted&&removed&&welcome);
});
test('pending AI request blocks duplicate submissions',async()=>{
 const c=load({aiRequestPending:true,document:{getElementById(){throw Error('duplicate processed')}}},['processAISuggestionQuery']);await c.processAISuggestionQuery();
});
