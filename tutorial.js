const TUTORIAL_STEPS = [
    {title:'Welcome, Ka-Palengke!', section:'home', action:'Open Home', text:'Plan your meals, compare reference prices, and keep track of your grocery spending.', tips:['Start with a budget and the number of people you are feeding.','Use Next and Back to explore this guide. Close it anytime and reopen it with the Tutorial button.']},
    {title:'1. Set up your budget', section:'budget', action:'Open Budget', text:'Use Budget to organize your income and expenses.', tips:['Choose or create your budget folder, then record your income and expenses.','The Grocery budget is a separate target for your current shopping list.']},
    {title:'2. Plan meals for your household', section:'meal', action:'Open Meal Planner', text:'Choose your weekly budget, number of people (pax), and preferred diet.', tips:['Generate a meal plan or select Customize Meal Plan to choose dishes yourself.','Open a meal to see its ingredients and compare serving sizes. Changing pax scales the plan.','Planning estimates are not confirmed shopping totals. Check the ingredient breakdown for missing prices.','Use Add to Grocery List to transfer your planned ingredients.']},
    {title:'3. Check price references', section:'prices', action:'Open Prices', text:'Browse DA market prices, DTI suggested retail prices, and supplemental references.', tips:['Check the source, report date, region, and selling unit for each item.','A price for a 200 ml pack is different from a price per kg.','These are reference prices; the price at your shop may differ.']},
    {title:'4. Build your grocery list', section:'grocery', action:'Open Grocery', text:'The price list and your shopping items are together inside Grocery List Tracker.', tips:['Search or filter the price list, then select Add to grocery. Each click adds one selling unit; adjust the quantity in your list.','For Price needed items, enter a local price and the quantity it covers. Example: ₱20 for 10 g costs ₱4 for 2 g. Select Save local price.','Enter your Grocery budget in Shopping List Summary. It is saved in this browser and includes bought items in the comparison.','A partial total excludes missing prices. Mark items as bought while shopping; Delete removes an item.']},
    {title:'5. Ask Palengke AI', section:'suggestions', action:'Open Palengke AI', text:'Ask for meal ideas or help understanding your plan.', tips:['Try: “What can I cook for 4 people?”','Ask in English for an English response, or Filipino for a Filipino response.','Review the quantities, price sources, and missing-price notes before shopping.']},
    {title:'You’re ready to start', section:'grocery', action:'Start shopping', text:'Try adding one grocery item, adjusting its quantity, and setting a shopping budget.', tips:['You can replay this guide from the Tutorial button at any time.','Your grocery budget target is saved on this browser. Local price estimates apply to the current grocery list.']}
];
const TUTORIAL_TAGALOG = [
    {title:'Maligayang pagdating, Ka-Palengke!', action:'Buksan ang Home', text:'Magplano ng pagkain, magkumpara ng mga presyong sanggunian, at subaybayan ang gastos sa pamimili.', tips:['Magsimula sa badyet at bilang ng mga kakain.','Pindutin ang Susunod o Bumalik para basahin ang gabay. Maaari mo itong isara at buksan muli gamit ang Tutorial.']},
    {title:'1. Ayusin ang iyong badyet', action:'Buksan ang Budget', text:'Gamitin ang Budget para ayusin ang iyong kita at mga gastusin.', tips:['Pumili o gumawa ng folder ng badyet, saka ilagay ang iyong kita at gastusin.','Hiwalay ang Grocery budget: para ito sa kasalukuyan mong listahan ng bibilhin.']},
    {title:'2. Magplano ng pagkain para sa pamilya', action:'Buksan ang Meal Planner', text:'Piliin ang badyet para sa isang linggo, bilang ng kakain (pax), at nais na uri ng pagkain.', tips:['Pindutin ang Generate Meal Plan para gumawa ng plano, o Customize Meal Plan para ikaw ang pumili ng mga putahe.','Buksan ang isang putahe para makita ang mga sangkap at dami ng kakain. Kapag binago ang pax, magbabago rin ang dami at tantiya ng gastos.','Tantiya lamang ang gastos sa plano. Tingnan ang mga sangkap na wala pang presyo bago mamili.','Pindutin ang Add to Grocery List para ilipat ang mga sangkap sa listahan ng bibilhin.']},
    {title:'3. Tingnan ang mga presyong sanggunian', action:'Buksan ang Prices', text:'Tingnan ang presyo sa palengke mula sa DA, mungkahing presyong tingi o SRP mula sa DTI, at iba pang sanggunian.', tips:['Tingnan ang pinagmulan, petsa ng ulat, rehiyon, at yunit ng bawat produkto.','Magkaiba ang presyo ng isang pakete na 200 ml at ang presyo kada kilo.','Gabay lamang ang mga presyong ito. Maaaring iba ang aktuwal na presyo sa tindahan.']},
    {title:'4. Gumawa ng listahan ng bibilhin', action:'Buksan ang Grocery', text:'Magkasama sa Grocery List Tracker ang listahan ng presyo at ang iyong mga bibilhin.', tips:['Maghanap o pumili ng kategorya sa listahan ng presyo, saka pindutin ang Add to grocery. Isang yunit ang madaragdag sa bawat pindot; baguhin ang dami sa iyong listahan.','Kung may Price needed, ilagay ang presyo sa inyong tindahan at ang daming sakop nito. Halimbawa: kung ₱20 ang 10 g, ₱4 ang 2 g. Pindutin ang Save local price.','Ilagay ang iyong Grocery budget sa Shopping List Summary. Naka-save ito sa browser na ito. Kasama sa paghahambing ang mga nabili na.','Hindi kasama sa partial total ang mga wala pang presyo. Lagyan ng tsek ang mga nabili na. Pindutin ang Delete para alisin ang isang item.']},
    {title:'5. Magtanong sa Palengke AI', action:'Buksan ang Palengke AI', text:'Humingi ng ideya sa lulutuin o tulong sa pag-unawa sa iyong plano.', tips:['Subukan: “Ano ang puwedeng lutuin para sa 4 na tao?”','Magtanong sa Filipino para sa sagot sa Filipino, o sa English para sa sagot sa English.','Suriin ang dami, pinagmulan ng presyo, at mga sangkap na wala pang presyo bago mamili.']},
    {title:'Handa ka nang magsimula!', action:'Magsimulang mamili', text:'Subukang magdagdag ng isang item, baguhin ang dami, at magtakda ng badyet sa pamimili.', tips:['Maaari mong balikan ang gabay anumang oras gamit ang Tutorial.','Sa browser na ito naka-save ang Grocery budget. Ang mga presyong ikaw ang naglagay ay para sa kasalukuyang listahan lamang.']}
];
let tutorialLanguage = 'en';
function setTutorialLanguage(language) {
    tutorialLanguage = language === 'tl' ? 'tl' : 'en';
    try { localStorage.setItem('palengkeTutorialLanguage', tutorialLanguage); } catch (_) {}
    renderTutorialStep();
}
let tutorialStep = 0;
function openTutorial(step = 0) {
    try { tutorialLanguage = localStorage.getItem('palengkeTutorialLanguage') === 'tl' ? 'tl' : 'en'; } catch (_) {}
    tutorialStep = Number.isInteger(step) && step >= 0 && step < TUTORIAL_STEPS.length ? step : 0;
    renderTutorialStep();
    const dialog = document.getElementById('appTutorial');
    if (!dialog.open) dialog.showModal();
}
function renderTutorialStep() {
    const tagalog = tutorialLanguage === 'tl';
    const step = (tagalog ? TUTORIAL_TAGALOG : TUTORIAL_STEPS)[tutorialStep];
    document.getElementById('appTutorial').lang = tagalog ? 'fil' : 'en';
    document.getElementById('tutorialLanguage').value = tutorialLanguage;
    document.getElementById('tutorialLanguageLabel').textContent = tagalog ? 'Wika ng gabay' : 'Tutorial language';
    document.getElementById('tutorialClose').textContent = tagalog ? 'Isara' : 'Close';
    document.getElementById('tutorialClose').setAttribute('aria-label', tagalog ? 'Isara ang gabay' : 'Close tutorial');
    document.getElementById('tutorialBack').textContent = tagalog ? 'Bumalik' : 'Back';
    document.getElementById('tutorialProgress').textContent = (tagalog ? 'Hakbang ' : 'Step ') + (tutorialStep + 1) + (tagalog ? ' sa ' : ' of ') + TUTORIAL_STEPS.length;
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    const list = document.getElementById('tutorialTips');
    list.replaceChildren();
    for (const tip of step.tips) {
        const li = document.createElement('li');
        li.textContent = tip;
        list.appendChild(li);
    }
    document.getElementById('tutorialBack').disabled = tutorialStep === 0;
    document.getElementById('tutorialNext').textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? (tagalog ? 'Tapos' : 'Finish') : (tagalog ? 'Susunod' : 'Next');
    document.getElementById('tutorialOpenSection').textContent = step.action;
}
function advanceTutorial(direction) {
    if (direction === 1 && tutorialStep === TUTORIAL_STEPS.length - 1) {
        document.getElementById('appTutorial').close();
        return;
    }
    tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, tutorialStep + direction));
    renderTutorialStep();
}
function openTutorialSection() {
    document.getElementById('appTutorial').close();
    switchTab(TUTORIAL_STEPS[tutorialStep].section);
    document.getElementById('view-' + TUTORIAL_STEPS[tutorialStep].section)?.scrollIntoView({behavior:'smooth', block:'start'});
}
