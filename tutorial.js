const TUTORIAL_STEPS = [
    {title:'Welcome, Ka-Palengke!', section:'home', action:'Open Home', text:'Plan your meals, compare reference prices, and keep track of your grocery spending.', tips:['Start with a budget and the number of people you are feeding.','Use Next and Back to explore this guide. Close it anytime and reopen it with the Tutorial button.']},
    {title:'1. Set up your budget', section:'budget', action:'Open Budget', text:'Use Budget to organize your income and expenses.', tips:['Choose or create your budget folder, then record your income and expenses.','The Grocery budget is a separate target for your current shopping list.']},
    {title:'2. Plan meals for your household', section:'meal', action:'Open Meal Planner', text:'Choose your weekly budget, number of people (pax), and preferred diet.', tips:['Generate a meal plan or select Customize Meal Plan to choose dishes yourself.','Open a meal to see its ingredients and compare serving sizes. Changing pax scales the plan.','Planning estimates are not confirmed shopping totals. Check the ingredient breakdown for missing prices.','Use Add to Grocery List to transfer your planned ingredients.']},
    {title:'3. Check price references', section:'prices', action:'Open Prices', text:'Browse DA market prices, DTI suggested retail prices, and supplemental references.', tips:['Check the source, report date, region, and selling unit for each item.','A price for a 200 ml pack is different from a price per kg.','These are reference prices; the price at your shop may differ.']},
    {title:'4. Build your grocery list', section:'grocery', action:'Open Grocery', text:'The price list and your shopping items are together inside Grocery List Tracker.', tips:['Search or filter the price list, then select Add to grocery. Each click adds one selling unit; adjust the quantity in your list.','For Price needed items, enter a local price and the quantity it covers. Example: ₱20 for 10 g costs ₱4 for 2 g. Select Save local price.','Enter your Grocery budget in Shopping List Summary. It is saved in this browser and includes bought items in the comparison.','A partial total excludes missing prices. Mark items as bought while shopping; Delete removes an item.']},
    {title:'5. Ask Palengke AI', section:'suggestions', action:'Open Palengke AI', text:'Ask for meal ideas or help understanding your plan.', tips:['Try: “What can I cook for 4 people?”','Ask in English for an English response, or Filipino for a Filipino response.','Review the quantities, price sources, and missing-price notes before shopping.']},
    {title:'You’re ready to start', section:'grocery', action:'Start shopping', text:'Try adding one grocery item, adjusting its quantity, and setting a shopping budget.', tips:['You can replay this guide from the Tutorial button at any time.','Your grocery budget target is saved on this browser. Local price estimates apply to the current grocery list.']}
];
let tutorialStep = 0;
function openTutorial(step = 0) {
    tutorialStep = Number.isInteger(step) && step >= 0 && step < TUTORIAL_STEPS.length ? step : 0;
    renderTutorialStep();
    const dialog = document.getElementById('appTutorial');
    if (!dialog.open) dialog.showModal();
}
function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    document.getElementById('tutorialProgress').textContent = 'Step ' + (tutorialStep + 1) + ' of ' + TUTORIAL_STEPS.length;
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
    document.getElementById('tutorialNext').textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next';
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
