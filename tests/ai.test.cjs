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
test('English and Filipino recipe questions get scaled verified quotes, not fallback totals',()=>{
 const c=load({document:{getElementById:()=>({value:''})},MealCosting:require('../meal-costing'),ALL_PRICE_ITEMS:[{item_name:'Whole Chicken, Local Fully Dressed',unit:'kg',price_avg:200,source_agency:'DA',source_date:'2026-09-27',region:'NCR'}],RECIPE_DATABASE:[{name:'Chicken Adobo',servings:4,ingredients:['1 kg Chicken','6 cloves Garlic'],instructions:['Simmer.'],diet:['anything']}]},['buildAIMealQuote']);
 const en=c.buildAIMealQuote('How much does Chicken Adobo cost for 2 people?');
 assert.match(en.text,/₱100.00/);assert.match(en.text,/incomplete subtotal/);
 const tl=c.buildAIMealQuote('Magkano ang Chicken Adobo para sa 2 tao?');
 assert.match(tl.text,/Subtotal lang/);assert.match(tl.text,/₱100.00/);
 const custom=c.buildAIMealQuote('Cost of Chicken Adobo using 400 g boneless chicken');
 assert.doesNotMatch(custom.text,/₱/);assert.match(custom.text,/no verified calculation/);
 assert.equal(c.buildAIMealQuote('Magkano ang sabon ayon sa DTI?'),null);
});
test('ingredient suggestions never select the first catalog recipe or append its bill',async()=>{
 let sent;
 const c=load({navigator:{onLine:true},BO_SAR_BACKEND_URL:'https://example.test',document:{getElementById:()=>({value:''})},
 RECIPE_DATABASE:[{name:'Champorado',ingredients:['100 g Rice'],servings:2},{name:'Chicken Adobo'},{name:'Pork Adobo'}],
 buildMarketPriceContext:()=>'',buildMealPlanContext:()=>'',aiConversationVersion:0,aiRequestController:null,palengkeAIThreadId:'',
 AbortController,setTimeout,clearTimeout,localStorage:{setItem(){}},
 fetch:async(url,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({reply:'**Ginisang baboy at malunggay**\\\nIgisa ang baboy.\\nIdagdag ang malunggay.'})};}
 },['buildAIMealQuote','generateAIResponseWithBackend']);
 const question='anong pwedeng lutuin kung meron akong malunggay at karne ng baboy';
 assert.equal(c.buildAIMealQuote(question),null);
 assert.equal(c.buildAIMealQuote('What can I cook with pork and malunggay?'),null);
 const answer=await c.generateAIResponseWithBackend(question);
 assert.equal(answer,'Ginisang baboy at malunggay\nIgisa ang baboy.\nIdagdag ang malunggay.');
 assert.equal(sent.meal_cost_mode,false);assert.equal(sent.message,question);
 assert.doesNotMatch(sent.context,/Champorado/);
 assert.doesNotMatch(c.buildAIMealQuote('What can I cook with pork on a budget?').text,/Champorado/);
 assert.doesNotMatch(c.buildAIMealQuote('How much does adobo cost?').text,/Chicken Adobo|Pork Adobo/);
});
