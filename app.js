/**
 * Palengke Helper+ - Core Application Engine
 * Operational Lifecycle Script (app.js)
 */

// ==========================================
// 1. STATE CONFIGURATION & DATA DICTIONARIES
// ==========================================

// Global State
let currentActiveMonthId = null;
let activeSpecificationFilter = 'all';

// Multi-Tiered Filipino Recipe Database Matrix
const FILIPINO_RECIPE_POOL = {
    anything: [
        { name: "Tapsilog (Beef Tapa, Sinangag, Itlog)", baseCost: 160, mealType: "Breakfast" },
        { name: "Longsilog (Longganisa, Sinangag, Itlog)", baseCost: 120, mealType: "Breakfast" },
        { name: "Tosilog (Tocino, Sinangag, Itlog)", baseCost: 130, mealType: "Breakfast" },
        { name: "Spamsilog / MaLing-silog", baseCost: 110, mealType: "Breakfast" },
        { name: "Creamy Chicken Sopas with Pan de Sal", baseCost: 95, mealType: "Breakfast" },
        { name: "Chicken Adobo with Warm Rice", baseCost: 180, mealType: "Lunch" },
        { name: "Sinigang na Baboy (Pork Belly)", baseCost: 220, mealType: "Dinner" },
        { name: "Ginisang Monggo with Tinapa Shreads", baseCost: 90, mealType: "Lunch" },
        { name: "Nilagang Baka (Beef Shank Block)", baseCost: 260, mealType: "Dinner" }
    ],
    tipid: [
        { name: "Pansit Canton / Instant Noodles with Boiled Egg", baseCost: 45, mealType: "Breakfast" },
        { name: "Scrambled Eggs with Sardines (Gisadong Sardinas)", baseCost: 55, mealType: "Breakfast" },
        { name: "Champorado (Cacao Porridge) with Tuyo", baseCost: 50, mealType: "Breakfast" },
        { name: "Lugaw (Plain Rice Congee) with Tokwa't Baboy", baseCost: 60, mealType: "Breakfast" },
        { name: "Pan de Sal dipped in Hot Coffee or Milo", baseCost: 35, mealType: "Breakfast" },
        { name: "Tortang Talong (Eggplant Omelet)", baseCost: 70, mealType: "Lunch" },
        { name: "Ginisang Repolyo with Pork Cubes", baseCost: 80, mealType: "Dinner" },
        { name: "Pritong Tokwa with Soy-Vinegar Dip", baseCost: 40, mealType: "Lunch" },
        { name: "Sardines Sinigang with Pechay", baseCost: 65, mealType: "Dinner" }
    ],
    protein: [
        { name: "Bangsilog (Marinated Daing na Bangus, Sinangag, Eggs)", baseCost: 170, mealType: "Breakfast" },
        { name: "Corned Beef Gisado with Skillet Potatoes & Eggs", baseCost: 140, mealType: "Breakfast" },
        { name: "Tuna Omelet with Toasted Wheat Pan de Sal", baseCost: 100, mealType: "Breakfast" },
        { name: "Pork Chop Bistek Tagalog", baseCost: 200, mealType: "Lunch" },
        { name: "Garlic Butter Lemon Tilapia", baseCost: 160, mealType: "Dinner" },
        { name: "Grilled Chicken Breast Inasal", baseCost: 190, mealType: "Lunch" },
        { name: "Beef Caldereta (Lean Cuts)", baseCost: 250, mealType: "Dinner" }
    ],
    healthy: [
        { name: "Arroz Caldo (Ginger Chicken Rice Porridge)", baseCost: 90, mealType: "Breakfast" },
        { name: "Poached Eggs over Steamed Kamote Tops (Talbos)", baseCost: 50, mealType: "Breakfast" },
        { name: "Fresh Fruit Salad (Papaya, Saging) & Oatmeal", baseCost: 75, mealType: "Breakfast" },
        { name: "Pinakbet Tagalog (No Pork Bagoong)", baseCost: 110, mealType: "Lunch" },
        { name: "Ginisang Ampalaya with Tofu Crumples", baseCost: 85, mealType: "Dinner" },
        { name: "Sinigang na Bangus sa Sampalok", baseCost: 150, mealType: "Lunch" },
        { name: "Tinolang Manok with Malunggay Leaves", baseCost: 160, mealType: "Dinner" }
    ],
    nopork: [
        { name: "Chicksilog (Chicken Longganisa/Nuggets, Sinangag, Itlog)", baseCost: 125, mealType: "Breakfast" },
        { name: "Daing na Danggit with Garlic Rice and Tomato", baseCost: 115, mealType: "Breakfast" },
        { name: "Tinapasilog (Smoked Fish, Sinangag, Egg)", baseCost: 105, mealType: "Breakfast" },
        { name: "Beef Somalian-Style Guisado", baseCost: 190, mealType: "Lunch" },
        { name: "Ginisang Sayote with Shrimp", baseCost: 100, mealType: "Dinner" },
        { name: "Chicken Curry (Filipino Style)", baseCost: 175, mealType: "Lunch" },
        { name: "Adobong Sitaw with Squid Rings", baseCost: 140, mealType: "Dinner" }
    ]
};
const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

let currentMealPlan = {};
let selectedMealSlot = null;
function initializeMealPlanner() {

    DAYS_OF_WEEK.forEach(day => {

        currentMealPlan[day] = {

            Breakfast: null,
            Lunch: null,
            Dinner: null

        };

    });

    renderWeeklyPlanner();

}
function renderWeeklyPlanner() {

    const planner = document.getElementById("weeklyPlanner");

    planner.innerHTML = "";

    DAYS_OF_WEEK.forEach(day => {

        planner.innerHTML += `

        <div class="border rounded-xl p-5 bg-gray-50">

            <h3 class="text-xl font-bold mb-4">

                ${day}

            </h3>

            <div class="grid md:grid-cols-3 gap-3">

                ${renderMealSlot(day,"Breakfast")}

                ${renderMealSlot(day,"Lunch")}

                ${renderMealSlot(day,"Dinner")}

            </div>

        </div>

        `;

    });

}
function renderMealSlot(day,type){

    const meal=currentMealPlan[day][type];

    return `

    <button

    onclick="openRecipeSelector('${day}','${type}')"

    class="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-600 hover:shadow transition">

        <div class="text-sm text-gray-500">

            ${type}

        </div>

        <div class="font-semibold mt-2">

            ${meal ? meal.name : "+ Choose Meal"}

        </div>

    </button>

    `;

}
function openRecipeSelector(day,type){

    selectedMealSlot={day,type};

    document
    .getElementById("recipeSelectorModal")
    .classList.remove("hidden");

    renderRecipeSelector();

}
function selectRecipe(id){

    const recipe=RECIPE_DATABASE.find(r=>r.id===id);
    if (!recipe) return;

    currentMealPlan
    [selectedMealSlot.day]
    [selectedMealSlot.type]=recipe;

    document
    .getElementById("recipeSelectorModal")
    .classList.add("hidden");

    renderWeeklyPlanner();
    renderPlannerSummaryFromCurrentPlan();

}

function showMealPlannerWrapper(){
    const wrapper = document.getElementById('mealScheduleWrapper');
    if (!wrapper) return;
    wrapper.classList.remove('hidden');
}

function hideMealPlannerWrapper(){
    const wrapper = document.getElementById('mealScheduleWrapper');
    if (!wrapper) return;
    wrapper.classList.add('hidden');
}

function enterMealScheduleFlow(){
    const intro = document.getElementById('mealPlannerIntro');
    const actions = document.getElementById('mealScheduleActions');
    const summary = document.getElementById('plannerResultsSection');
    const saveButton = document.getElementById('saveMealPlanBtn');

    if (intro) intro.classList.add('hidden');
    if (actions) actions.classList.remove('hidden');
    if (summary) summary.classList.add('hidden');
    if (saveButton) saveButton.classList.add('hidden');
    showMealPlannerWrapper();
}

function completeMealPlan(){
    const saveButton = document.getElementById('saveMealPlanBtn');
    const actions = document.getElementById('mealScheduleActions');
    const summary = document.getElementById('plannerResultsSection');

    renderPlannerSummaryFromCurrentPlan(true);
    if (saveButton) saveButton.classList.remove('hidden');
    if (actions) actions.classList.add('hidden');
    if (summary) summary.classList.remove('hidden');
    document.getElementById('weeklyPlanner')?.scrollIntoView({ behavior: 'smooth' });
}

function customizeMealPlan(){
    enterMealScheduleFlow();
    document.getElementById('weeklyPlanner').scrollIntoView({ behavior: 'smooth' });
}

function renderPlannerSummaryFromCurrentPlan(showSummary = true){
    const summarySection = document.getElementById('plannerResultsSection');
    const summaryCostNode = document.getElementById('plannerSummaryCost');
    const summaryWarning = document.getElementById('plannerSummaryWarning');
    const scheduleContainer = document.getElementById('weeklyScheduleCardsContainer');
    if (!summarySection || !summaryCostNode || !scheduleContainer) return;

    let totalCost = 0;
    scheduleContainer.innerHTML = '';

    DAYS_OF_WEEK.forEach(day => {
        const dayPlan = currentMealPlan[day];
        if (!dayPlan) return;

        const meals = ['Breakfast', 'Lunch', 'Dinner'].map(type => dayPlan[type]).filter(Boolean);
        const dayCost = meals.reduce((sum, meal) => sum + (meal.baseCost || meal.estimatedCost || 0), 0);
        totalCost += dayCost;

        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-100 rounded-2xl p-4 shadow-sm';
        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h4 class="font-bold text-gray-800">${day}</h4>
                    <p class="text-xs text-gray-500">Est. ₱${dayCost.toFixed(0)}</p>
                </div>
            </div>
            <div class="grid sm:grid-cols-3 gap-3 text-sm text-gray-700">
                ${['Breakfast','Lunch','Dinner'].map(type => {
                    const meal = dayPlan[type];
                    if (!meal) return `<div class="bg-gray-50 p-3 rounded-xl border border-gray-100"> <div class="text-xs font-semibold text-gray-500">${type}</div><p class="mt-2 text-sm text-gray-400">No meal selected</p></div>`;
                    return `
                        <button onclick="showRecipeDetailsById(${meal.id})" class="text-left bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition">
                            <div class="text-xs font-semibold text-gray-500">${type}</div>
                            <p class="mt-2 font-semibold text-gray-800">${meal.name}</p>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
        scheduleContainer.appendChild(card);
    });

    summaryCostNode.innerText = `₱${totalCost.toFixed(0)}`;
    const budgetValue = parseFloat(document.getElementById('plannerBudget').value);
    const hasValidBudget = !isNaN(budgetValue) && budgetValue > 0;
    summaryWarning.innerText = hasValidBudget && totalCost > budgetValue ? 'This plan exceeds your budget.' : '';
    if (showSummary) {
        summarySection.classList.remove('hidden');
    } else {
        summarySection.classList.add('hidden');
    }
}

function showRecipeDetailsById(id){
    let recipe = RECIPE_DATABASE.find(r => r.id === id);
    if (!recipe) {
        for (const day of DAYS_OF_WEEK) {
            const dayPlan = currentMealPlan[day];
            if (!dayPlan) continue;
            for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
                const meal = dayPlan[mealType];
                if (meal && meal.id === id) {
                    recipe = meal;
                    break;
                }
            }
            if (recipe) break;
        }
    }
    if (!recipe) return;
    showRecipeDetails(recipe);
}

function showRecipeDetailsByName(name){
    const recipe = RECIPE_DATABASE.find(r => r.name === name);
    if (recipe) {
        showRecipeDetails(recipe);
        return;
    }
    showRecipeDetails({
        name,
        servings: 4,
        estimatedCost: 0,
        difficulty: 'Standard',
        prepTime: 'N/A',
        cookTime: 'N/A',
        ingredients: ['Recipe details not available for this generated meal.'],
        instructions: ['Use any suitable recipe or ingredient list for this meal.'],
        image: 'https://via.placeholder.com/600x400?text=Recipe+Details+Unavailable'
    });
}

function renderRecipeSelector(){
    const container=document.getElementById("recipeSelectionList");
    const searchTerm = document.getElementById('recipeSearch')?.value.toLowerCase().trim() || '';
    container.innerHTML="";

    const availableRecipes = RECIPE_DATABASE.filter(recipe => recipe.mealType.includes(selectedMealSlot.type));
    const filteredRecipes = availableRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm));

    container.innerHTML = `
        <div
            class="bg-white border rounded-2xl p-6 hover:shadow-lg cursor-pointer text-center transition"
            onclick="openCustomRecipePrompt()">
            <div class="text-3xl">✍️</div>
            <h4 class="font-bold text-lg mt-3">Create Your Own Dish</h4>
            <p class="text-sm text-gray-500 mt-2">Add a custom meal to this slot.</p>
        </div>
    `;

    filteredRecipes.forEach(recipe=>{

        container.innerHTML+=`

        <div
        class="bg-white border rounded-xl overflow-hidden hover:shadow cursor-pointer"

        data-recipe-id="${recipe.id}"
        onclick="selectRecipe(${recipe.id})">

            <img

            src="${recipe.image}"

            class="h-40 w-full object-cover">

            <div class="p-4">

                <h4 class="font-bold">

                    ${recipe.name}

                </h4>

                <p class="text-sm text-gray-500">

                    ₱${recipe.estimatedCost}

                </p>

                <p class="text-sm text-gray-500">

                    ${recipe.servings} Pax

                </p>

                <p class="text-xs text-gray-400 mt-2">${recipe.mealType.join(', ')}</p>

            </div>

        </div>

        `;

    });
}

function openCustomRecipePrompt(){
    if (!selectedMealSlot) return;
    // Populate modal with sensible defaults
    const nameEl = document.getElementById('customRecipeName');
    const servingsEl = document.getElementById('customRecipeServings');
    const costEl = document.getElementById('customRecipeEstimatedCost');
    const ingEl = document.getElementById('customRecipeIngredients');
    const instrEl = document.getElementById('customRecipeInstructions');

    if (nameEl) nameEl.value = 'Custom Dish';
    if (servingsEl) servingsEl.value = 4;
    if (costEl) costEl.value = 120;
    if (ingEl) ingEl.value = 'Ingredient 1, Ingredient 2';
    if (instrEl) instrEl.value = 'Step 1; Step 2; Step 3';

    // Show modal
    document.getElementById('customRecipeModal')?.classList.remove('hidden');
}

function saveCustomRecipeFromModal(){
    if (!selectedMealSlot) return;
    const name = document.getElementById('customRecipeName')?.value.trim() || 'Custom Dish';
    const servings = parseInt(document.getElementById('customRecipeServings')?.value, 10) || 4;
    const estimatedCost = parseFloat(document.getElementById('customRecipeEstimatedCost')?.value) || 120;
    const ingredients = (document.getElementById('customRecipeIngredients')?.value || '').split(',').map(s=>s.trim()).filter(Boolean);
    const instructions = (document.getElementById('customRecipeInstructions')?.value || '').split(';').map(s=>s.trim()).filter(Boolean);
    const mealType = selectedMealSlot.type;

    const recipe = {
        id: 'custom_' + Date.now(),
        name,
        mealType: [mealType],
        diet: [document.getElementById('plannerDiet')?.value || 'anything', 'anything'],
        image: 'https://via.placeholder.com/600x400?text=Custom+Dish',
        servings,
        estimatedCost,
        prepTime: 'Custom',
        cookTime: 'Custom',
        difficulty: 'Custom',
        ingredients,
        instructions
    };

    currentMealPlan[selectedMealSlot.day][selectedMealSlot.type] = recipe;
    document.getElementById('customRecipeModal')?.classList.add('hidden');
    document.getElementById('recipeSelectorModal')?.classList.add('hidden');
    renderWeeklyPlanner();
    renderPlannerSummaryFromCurrentPlan();
}

function getMealPlans(){
    return JSON.parse(localStorage.getItem('palengke_saved_meal_plans')) || [];
}

function setMealPlans(plans){
    localStorage.setItem('palengke_saved_meal_plans', JSON.stringify(plans));
}

function saveCurrentMealPlan(){
    const nameInput = document.getElementById('mealPlanNameInput');
    const defaultName = 'Weekly Meal Plan';
    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : defaultName;

    const mealPlans = getMealPlans();
    mealPlans.unshift({
        id: 'meal_plan_' + Date.now(),
        name,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        plan: JSON.parse(JSON.stringify(currentMealPlan)),
        budget: parseFloat(document.getElementById('plannerBudget').value) || 0,
        pax: parseInt(document.getElementById('plannerPax').value) || 4,
        diet: document.getElementById('plannerDiet').value || 'anything'
    });

    setMealPlans(mealPlans);
    renderSavedMealPlans();
    alert('Meal plan saved successfully.');
}

function clearCurrentMealPlan(){
    if (!confirm('Clear the current weekly plan?')) return;
    initializeMealPlanner();
    document.getElementById('plannerSummaryCost').innerText = '₱0';
    document.getElementById('plannerSummaryWarning').innerText = '';
    const mealWrapper = document.getElementById('mealScheduleWrapper');
    if (mealWrapper) mealWrapper.classList.add('hidden');
    document.getElementById('plannerResultsSection').classList.add('hidden');
}

function updateSavedMealPlansVisibility(){
    const wrapper = document.getElementById('savedMealPlansWrapper');
    if (!wrapper) return;
    const mealPlans = getMealPlans();
    if (mealPlans.length > 0) {
        wrapper.classList.remove('hidden');
    } else {
        wrapper.classList.add('hidden');
    }
}

function renderSavedMealPlans(){
    const container = document.getElementById('savedMealPlans');
    if (!container) return;
    const mealPlans = getMealPlans();
    container.innerHTML = '';

    if (mealPlans.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500 italic col-span-full">No saved meal plans yet.</p>`;
        updateSavedMealPlansVisibility();
        return;
    }

    mealPlans.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-sm';
        card.innerHTML = `
            <div class="flex justify-between items-start gap-3 mb-3">
                <div>
                    <h4 class="font-bold text-gray-800">${plan.name}</h4>
                    <p class="text-xs text-gray-500">${plan.createdAt}</p>
                </div>
                <button onclick="loadMealPlan('${plan.id}')" class="text-emerald-700 font-semibold text-sm">Load</button>
            </div>
            <p class="text-sm text-gray-600">Budget: ₱${plan.budget.toFixed(0)} · Pax: ${plan.pax} · Diet: ${plan.diet}</p>
            <button onclick="deleteMealPlan('${plan.id}')" class="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-sm font-semibold">Delete</button>
        `;
        container.appendChild(card);
    });

    updateSavedMealPlansVisibility();
}

function loadMealPlan(id){
    try {
        const mealPlans = getMealPlans();
        const plan = mealPlans.find(item => item.id === id);
        if (!plan) return alert('Saved meal plan not found.');

        currentMealPlan = JSON.parse(JSON.stringify(plan.plan));
        document.getElementById('plannerBudget').value = plan.budget;
        document.getElementById('plannerPax').value = plan.pax;
        document.getElementById('plannerDiet').value = plan.diet;
        const mealPlanNameInput = document.getElementById('mealPlanNameInput');
        if (mealPlanNameInput) mealPlanNameInput.value = plan.name || '';

        if (typeof switchTab === 'function') {
            switchTab('meal');
        }

        calculatePlanMetrics();
        renderWeeklyPlanner();
        showMealPlannerWrapper();
        renderPlannerSummaryFromCurrentPlan(true);
        document.getElementById('saveMealPlanBtn')?.classList.remove('hidden');
        document.getElementById('backToSavedPlansBtn')?.classList.remove('hidden');
        document.getElementById('mealScheduleActions')?.classList.add('hidden');
        document.getElementById('mealPlannerIntro')?.classList.add('hidden');
        renderSavedMealPlans();
        alert('Loaded saved meal plan.');
    } catch (error) {
        console.error('Error loading meal plan:', error);
        alert('There was an error loading the saved meal plan. Please try again.');
    }
}

function backFromLoadedMealPlan(){
    document.getElementById('plannerResultsSection')?.classList.add('hidden');
    document.getElementById('mealScheduleActions')?.classList.add('hidden');
    document.getElementById('saveMealPlanBtn')?.classList.add('hidden');
    document.getElementById('backToSavedPlansBtn')?.classList.add('hidden');
    hideMealPlannerWrapper();
    document.getElementById('mealPlannerIntro')?.classList.remove('hidden');
    document.getElementById('mealPlannerIntro')?.scrollIntoView({ behavior: 'smooth' });
    renderSavedMealPlans();
}

function deleteMealPlan(id){
    if (!confirm('Delete this saved meal plan?')) return;
    const mealPlans = getMealPlans().filter(item => item.id !== id);
    setMealPlans(mealPlans);
    renderSavedMealPlans();
}

function showRecipeDetails(recipe){
    const modal = document.getElementById('recipeDetailsModal');
    const content = document.getElementById('recipeDetailsContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="grid md:grid-cols-[1.2fr_1fr] gap-6">
            <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">${recipe.name}</h3>
                <p class="text-sm text-gray-500 mb-4">Serves ${recipe.servings} pax · ₱${recipe.estimatedCost} · ${recipe.difficulty} · Prep ${recipe.prepTime} · Cook ${recipe.cookTime}</p>
                <div class="mb-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Ingredients</h4>
                    <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                        ${recipe.ingredients.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">Instructions</h4>
                    <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
                        ${recipe.instructions.map(item => `<li>${item}</li>`).join('')}
                    </ol>
                </div>
            </div>
            <div class="space-y-4">
                <img src="${recipe.image}" alt="${recipe.name}" class="w-full rounded-2xl h-64 object-cover border border-gray-200">
                <div class="bg-gray-100 rounded-2xl p-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Price Details</h4>
                    <p class="text-sm text-gray-700">Base estimate for ${recipe.servings} pax is ₱${recipe.estimatedCost}.</p>
                    <p class="text-sm text-gray-700 mt-2">Per pax estimate: ₱${(recipe.estimatedCost / recipe.servings).toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function attachRecipeDetailButtons(){
    document.getElementById('recipeSelectionList').querySelectorAll('[data-recipe-id]').forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = parseInt(card.dataset.recipeId, 10);
            const recipe = RECIPE_DATABASE.find(r => r.id === recipeId);
            if (recipe) showRecipeDetails(recipe);
        });
    });
}

// Global Selected Diet Category Variable
let activeSelectedDietStyle = 'anything';

// ==========================================
// 2. AUTHORIZATION & SESSION GATEWAY MANAGEMENT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const cachedUser = localStorage.getItem('palengke_session');
    if (cachedUser) {
        const authPage = document.getElementById('authPage');
        const appPage = document.getElementById('appPage');
        if (authPage) authPage.classList.add('hidden');
        if (appPage) appPage.classList.remove('hidden');
        initializeBudgetHubEngine();
        renderGroceryItems();
        renderSavedMealPlans();
        calculatePlanMetrics();
        hideMealPlannerWrapper();
    }

    const plannerBudget = document.getElementById('plannerBudget');
    const plannerPax = document.getElementById('plannerPax');
    const plannerDiet = document.getElementById('plannerDiet');
    const generateMealPlanBtn = document.getElementById('generateMealPlanBtn');
    const customizeMealBtnEl = document.getElementById('customizeMealBtn');
    const saveMealPlanBtn = document.getElementById('saveMealPlanBtn');
    const backToSavedPlansBtn = document.getElementById('backToSavedPlansBtn');
    const completeMealPlanBtn = document.getElementById('completeMealPlanBtn');
    const clearMealPlanBtn = document.getElementById('clearMealPlanBtn');
    const refreshMealPlansBtn = document.getElementById('refreshMealPlansBtn');
    const recipeSearchEl = document.getElementById('recipeSearch');
    const closeRecipeDetails = document.getElementById('closeRecipeDetails');
    const recipeDetailsModal = document.getElementById('recipeDetailsModal');
    const closeRecipeSelector = document.getElementById('closeRecipeSelector');
    const recipeSelectorModal = document.getElementById('recipeSelectorModal');

    if (plannerBudget) plannerBudget.addEventListener('input', calculatePlanMetrics);
    if (plannerPax) plannerPax.addEventListener('change', calculatePlanMetrics);
    if (plannerDiet) plannerDiet.addEventListener('change', calculatePlanMetrics);
    if (generateMealPlanBtn) generateMealPlanBtn.addEventListener('click', () => {
        generateFilipinoMealPlan();
        enterMealScheduleFlow();
    });
    if (customizeMealBtnEl) customizeMealBtnEl.addEventListener('click', customizeMealPlan);
    if (saveMealPlanBtn) saveMealPlanBtn.addEventListener('click', saveCurrentMealPlan);
    if (backToSavedPlansBtn) backToSavedPlansBtn.addEventListener('click', backFromLoadedMealPlan);
    if (completeMealPlanBtn) completeMealPlanBtn.addEventListener('click', completeMealPlan);
    if (clearMealPlanBtn) clearMealPlanBtn.addEventListener('click', clearCurrentMealPlan);
    if (refreshMealPlansBtn) refreshMealPlansBtn.addEventListener('click', renderSavedMealPlans);
    if (recipeSearchEl) recipeSearchEl.addEventListener('input', renderRecipeSelector);
    if (closeRecipeDetails && recipeDetailsModal) {
        closeRecipeDetails.addEventListener('click', () => {
            recipeDetailsModal.classList.add('hidden');
        });
    }
    if (recipeDetailsModal) {
        recipeDetailsModal.addEventListener('click', (event) => {
            if (event.target.id === 'recipeDetailsModal') {
                recipeDetailsModal.classList.add('hidden');
            }
        });
    }
    if (closeRecipeSelector && recipeSelectorModal) {
        closeRecipeSelector.addEventListener('click', () => {
            recipeSelectorModal.classList.add('hidden');
        });
        recipeSelectorModal.addEventListener('click', (event) => {
            if (event.target.id === 'recipeSelectorModal') {
                recipeSelectorModal.classList.add('hidden');
            }
        });
    }

    const saveCustomRecipeBtn = document.getElementById('saveCustomRecipeBtn');
    const closeCustomRecipeModal = document.getElementById('closeCustomRecipeModal');
    if (saveCustomRecipeBtn) saveCustomRecipeBtn.addEventListener('click', saveCustomRecipeFromModal);
    if (closeCustomRecipeModal) closeCustomRecipeModal.addEventListener('click', () => {
        document.getElementById('customRecipeModal').classList.add('hidden');
    });

    const aiQuestionInput = document.getElementById('aiQuestionInput');
    if (aiQuestionInput) {
        aiQuestionInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                processAISuggestionQuery();
            }
        });
    }

    // Editable stat cards on the AI Suggestions tab — kept in sync with the Meal Planner inputs
    const suggestionBudgetInput = document.getElementById('suggestionBudgetValue');
    if (suggestionBudgetInput) {
        suggestionBudgetInput.addEventListener('input', function() {
            const plannerBudgetInput = document.getElementById('plannerBudget');
            if (plannerBudgetInput) plannerBudgetInput.value = this.value;
            evaluateDynamicContextualAISuggestions();
        });
    }

    const suggestionPaxInput = document.getElementById('suggestionPaxValue');
    if (suggestionPaxInput) {
        suggestionPaxInput.addEventListener('input', function() {
            const plannerPaxInput = document.getElementById('plannerPax');
            if (plannerPaxInput) plannerPaxInput.value = this.value;
            evaluateDynamicContextualAISuggestions();
        });
    }

    initializeMealPlanner();
});

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) return alert('Please enter a valid credential pattern.');
    localStorage.setItem('palengke_session', JSON.stringify({ user: email, role: 'member' }));
    location.reload();
}

function loginAsGuest() {
    localStorage.setItem('palengke_session', JSON.stringify({ user: 'Guest_User', role: 'guest' }));
    location.reload();
}

function logout() {
    localStorage.removeItem('palengke_session');
    location.reload();
}

function showRegister() {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('registerBox').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerBox').classList.add('hidden');
    document.getElementById('loginBox').classList.remove('hidden');
}

function register() {
    alert('Account structural initialization template mock processing complete. Switching view.');
    showLogin();
}

function toggleMenu() {
    const mm = document.getElementById('mobileMenu');
    mm.classList.toggle('hidden');
}

function toggleForm(formId) {
    const f = document.getElementById(formId);
    if (f) f.classList.toggle('hidden');
}

// ==========================================
// 3. ARCHITECTURE HUB BUDGET ENGINE
// ==========================================

function initializeBudgetHubEngine() {
    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const grid = document.getElementById('monthlyBudgetsHubGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (history.length === 0) {
        grid.innerHTML = `<p class="text-xs text-gray-400 italic col-span-full py-4">No historical monthly statement structural entries initialized yet.</p>`;
        return;
    }

    history.forEach(item => {
        // Read totals safely from item arrays
        const computedIncome = item.incomeList ? item.incomeList.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0) : 0;
        const computedExpense = item.expenseList ? item.expenseList.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0) : 0;
        const computedMargin = computedIncome - computedExpense;

        const dateObj = new Date(item.monthCode + "-01");
        const monthLabel = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded-xl shadow-sm border ${currentActiveMonthId === item.id ? 'border-emerald-600 ring-2 ring-emerald-500/10' : 'border-gray-100'} hover:shadow-md transition cursor-pointer flex flex-col justify-between`;
        card.onclick = () => activateLedgerWorkspace(item.id);

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-gray-800 text-base">${monthLabel}</h4>
                    <span class="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${currentActiveMonthId === item.id ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}">
                        ${currentActiveMonthId === item.id ? 'Active' : 'Closed'}
                    </span>
                </div>
                <div class="space-y-1 my-3 font-mono text-xs text-gray-600">
                    <div class="flex justify-between"><span>Income Base:</span><span class="text-emerald-600 font-bold">₱${computedIncome.toFixed(2)}</span></div>
                    <div class="flex justify-between"><span>Logged Spent:</span><span class="text-rose-500 font-bold">-₱${computedExpense.toFixed(2)}</span></div>
                </div>
            </div>
            <div class="border-t pt-3 flex items-center justify-between mt-2">
                <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase block">Running Margin</span>
                    <span class="text-sm font-bold font-mono ${computedMargin >= 0 ? 'text-gray-800' : 'text-rose-600'}">₱${computedMargin.toFixed(2)}</span>
                </div>
                <button onclick="event.stopPropagation(); purgeMonthlyBudgetFolder('${item.id}')" class="text-xs text-gray-400 hover:text-rose-600 font-medium p-1 transition">✕ Clear</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addNewMonthlyBudgetHubRecord() {
    const targetDateValue = document.getElementById('newBudgetDate').value;
    if (!targetDateValue) return alert('Please define operational context target date range framework.');

    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    
    // Check duplication values
    if (history.some(h => h.monthCode === targetDateValue)) {
        return alert('A workspace statement binder matches this monthly structural coordinate assignment.');
    }

    const newRecord = {
        id: 'hub_block_' + Date.now(),
        monthCode: targetDateValue,
        incomeList: [],
        expenseList: []
    };

    history.push(newRecord);
    localStorage.setItem('palengke_budgets_v2', JSON.stringify(history));
    
    currentActiveMonthId = newRecord.id;
    
    toggleForm('newMonthBudgetForm');
    initializeBudgetHubEngine();
    activateLedgerWorkspace(newRecord.id);
}

function purgeMonthlyBudgetFolder(id) {
    if (!confirm('Are you certain you want to purge this record block data matrix?')) return;
    let history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    history = history.filter(h => h.id !== id);
    localStorage.setItem('palengke_budgets_v2', JSON.stringify(history));
    
    if (currentActiveMonthId === id) {
        currentActiveMonthId = null;
        document.getElementById('activeLedgerWorkspaceSection').classList.add('hidden');
    }
    
    initializeBudgetHubEngine();
}

function activateLedgerWorkspace(id) {
    currentActiveMonthId = id;
    initializeBudgetHubEngine();
    
    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const activeData = history.find(h => h.id === id);
    if (!activeData) return;

    const dateObj = new Date(activeData.monthCode + "-01");
    document.getElementById('activeWorkspaceMonthTitle').innerText = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('activeLedgerWorkspaceSection').classList.remove('hidden');

    // Auto default fields
    document.getElementById('incDate').value = `${activeData.monthCode}-01`;
    document.getElementById('expDate').value = `${activeData.monthCode}-01`;

    recalculateActiveWorkspaceBalanceSheet();
}

function applySpecificationFilter(cadence) {
    activeSpecificationFilter = cadence;
    
    // Toggle active visual styles natively
    const buttons = document.querySelectorAll('[id^="filter-spec-"]');
    buttons.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow-sm');
        b.classList.add('bg-gray-50', 'text-gray-700', 'hover:bg-gray-100');
    });

    let activeBtnId = 'filter-spec-all';
    if (cadence === 'Monthly') activeBtnId = 'filter-spec-Monthly';
    else if (cadence === '1st Cut (1st-15th)') activeBtnId = 'filter-spec-1st';
    else if (cadence === '2nd Cut (16th-End)') activeBtnId = 'filter-spec-2nd';
    else if (cadence.includes('1')) activeBtnId = 'filter-spec-w1';
    else if (cadence.includes('2')) activeBtnId = 'filter-spec-w2';
    else if (cadence.includes('3')) activeBtnId = 'filter-spec-w3';
    else if (cadence.includes('4')) activeBtnId = 'filter-spec-w4';

    const currentBtn = document.getElementById(activeBtnId);
    if (currentBtn) {
        currentBtn.classList.remove('bg-gray-50', 'text-gray-700', 'hover:bg-gray-100');
        currentBtn.classList.add('bg-emerald-700', 'text-white', 'shadow-sm');
    }

    recalculateActiveWorkspaceBalanceSheet();
}

function recalculateActiveWorkspaceBalanceSheet() {
    if (!currentActiveMonthId) return;
    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const activeData = history.find(h => h.id === currentActiveMonthId);
    if (!activeData) return;

    // Filter Items arrays natively
    const filteredIncomes = activeData.incomeList.filter(i => activeSpecificationFilter === 'all' || i.specCadence === activeSpecificationFilter);
    const filteredExpenses = activeData.expenseList.filter(e => activeSpecificationFilter === 'all' || e.specCadence === activeSpecificationFilter);

    const totalIncomeValue = filteredIncomes.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);
    const totalExpensesValue = filteredExpenses.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
    const cumulativeNetBalance = totalIncomeValue - totalExpensesValue;

    // Direct output binding
    document.getElementById('ledgerTotalIncome').innerText = `₱${totalIncomeValue.toFixed(2)}`;
    document.getElementById('ledgerTotalExpenses').innerText = `-₱${totalExpensesValue.toFixed(2)}`;
    document.getElementById('ledgerNetSavings').innerText = `₱${cumulativeNetBalance.toFixed(2)}`;
    document.getElementById('activeWorkspaceBudgetValue').innerText = `₱${totalIncomeValue.toFixed(2)}`;

    // Build lists blocks
    renderLedgerStackElements('incomeItemsList', filteredIncomes, 'income');
    renderLedgerStackElements('expenseItemsList', filteredExpenses, 'expense');

    // Recompile layout chart components
    renderDynamicCategoryAnalyticsEngine(filteredExpenses);
}

function renderLedgerStackElements(containerId, dataset, type) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';

    if (dataset.length === 0) {
        el.innerHTML = `<p class="text-[11px] text-gray-400 italic py-2">No transaction lines categorized on this context path filter setup.</p>`;
        return;
    }

    dataset.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = "flex items-center justify-between text-xs p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 font-medium transition";
        itemRow.innerHTML = `
            <div class="space-y-0.5 max-w-[70%]">
                <span class="font-bold text-gray-800 block truncate">${item.description}</span>
                <div class="flex gap-1.5 flex-wrap items-center text-[10px] text-gray-400 font-semibold">
                    <span class="bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">${item.specCadence}</span>
                    ${item.category ? `<span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded whitespace-nowrap">${item.category}</span>` : ''}
                    <span class="font-mono text-gray-400">${item.dateLogged}</span>
                </div>
            </div>
            <div class="flex items-center gap-3 text-right">
                <span class="font-mono font-bold text-sm block ${type === 'income' ? 'text-emerald-700' : 'text-rose-600'}">
                    ${type === 'income' ? '+' : '-'}₱${parseFloat(item.amount).toFixed(2)}
                </span>
                <button onclick="purgeLedgerItemIndex('${item.itemId}', '${type}')" class="text-gray-300 hover:text-rose-600 text-sm font-bold p-1 transition focus:outline-none">✕</button>
            </div>
        `;
        el.appendChild(itemRow);
    });
}

function addLedgerItem(type) {
    if (!currentActiveMonthId) return alert('Please instantiate an operational month folder framework workspace baseline context.');

    let desc, amount, spec, date, category = null;

    if (type === 'income') {
        desc = document.getElementById('incDesc').value.trim();
        amount = parseFloat(document.getElementById('incAmount').value);
        spec = document.getElementById('incSpec').value;
        date = document.getElementById('incDate').value;
    } else {
        desc = document.getElementById('expDesc').value.trim();
        amount = parseFloat(document.getElementById('expAmount').value);
        spec = document.getElementById('expSpec').value;
        date = document.getElementById('expDate').value;
        category = document.getElementById('expCategory').value;
    }

    if (!desc || isNaN(amount) || amount <= 0 || !date) {
        return alert('Please structure balance metrics fields cleanly before execution validation procedures.');
    }

    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const activeIdx = history.findIndex(h => h.id === currentActiveMonthId);
    if (activeIdx === -1) return;

    const pipelineObject = {
        itemId: 'item_entity_' + Date.now() + Math.random().toString(36).substr(2, 4),
        description: desc,
        amount: amount,
        specCadence: spec,
        dateLogged: date,
        category: category
    };

    if (type === 'income') {
        history[activeIdx].incomeList.push(pipelineObject);
        document.getElementById('incDesc').value = '';
        document.getElementById('incAmount').value = '';
        toggleForm('incomeForm');
    } else {
        history[activeIdx].expenseList.push(pipelineObject);
        document.getElementById('expDesc').value = '';
        document.getElementById('expAmount').value = '';
        toggleForm('expenseForm');
    }

    localStorage.setItem('palengke_budgets_v2', JSON.stringify(history));
    recalculateActiveWorkspaceBalanceSheet();
    initializeBudgetHubEngine();
}

function purgeLedgerItemIndex(itemId, type) {
    if (!currentActiveMonthId) return;
    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const activeIdx = history.findIndex(h => h.id === currentActiveMonthId);
    if (activeIdx === -1) return;

    if (type === 'income') {
        history[activeIdx].incomeList = history[activeIdx].incomeList.filter(i => i.itemId !== itemId);
    } else {
        history[activeIdx].expenseList = history[activeIdx].expenseList.filter(e => e.itemId !== itemId);
    }

    localStorage.setItem('palengke_budgets_v2', JSON.stringify(history));
    recalculateActiveWorkspaceBalanceSheet();
    initializeBudgetHubEngine();
}

// ==========================================
// 4. REAL-TIME SVG PIE CHART & ANALYTICS
// ==========================================

function renderDynamicCategoryAnalyticsEngine(expenseDataset) {
    const categoriesList = [
        "Food & Groceries",
        "Electricity (Meralco)",
        "Water Bill",
        "House Rent",
        "Internet / Load",
        "Other Bills"
    ];

    const chartColors = {
        "Food & Groceries": "#f59e0b",
        "Electricity (Meralco)": "#3b82f6",
        "Water Bill": "#06b6d4",
        "House Rent": "#8b5cf6",
        "Internet / Load": "#ec4899",
        "Other Bills": "#64748b"
    };

    const container = document.getElementById('categoryBreakdownContainer');
    const svgChart = document.getElementById('pieChartSvg');
    if (!container || !svgChart) return;

    container.innerHTML = '';
    svgChart.innerHTML = '';

    const aggregatedGrandTotalExpenses = expenseDataset.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
    document.getElementById('pieCenterTotal').innerText = `₱${aggregatedGrandTotalExpenses.toFixed(0)}`;

    if (aggregatedGrandTotalExpenses === 0) {
        container.innerHTML = `<p class="text-xs text-gray-400 italic col-span-full">No active tracked expenses match current filtration logic criteria layout constraints.</p>`;
        return;
    }

    let accumulatedPercentagePieOffset = 0;

    categoriesList.forEach(cat => {
        const catSum = expenseDataset.filter(e => e.category === cat).reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
        if (catSum === 0) return;

        const ratioPercentage = (catSum / aggregatedGrandTotalExpenses) * 100;
        const colorStyle = chartColors[cat] || "#cfd8dc";

        // Append Analytical Legend Matrix Item Block
        const segmentRow = document.createElement('div');
        segmentRow.className = "space-y-1";
        segmentRow.innerHTML = `
            <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-gray-700 flex items-center gap-1.5 truncate">
                    <span class="w-2 h-2 rounded-full inline-block shrink-0" style="background-color: ${colorStyle}"></span>
                    ${cat}
                </span>
                <span class="font-mono text-gray-800">${ratioPercentage.toFixed(1)}% <span class="text-gray-400 font-normal text-[10px]">(₱${catSum.toFixed(0)})</span></span>
            </div>
            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" style="width: ${ratioPercentage}%; background-color: ${colorStyle}"></div>
            </div>
        `;
        container.appendChild(segmentRow);

        // Native High-Performance SVG Donut Processing Mechanics ($inline$ geometry)
        const radius = 16;
        const circumference = 2 * Math.PI * radius; // 100.53
        const strokeDashArray = `${(ratioPercentage * circumference) / 100} ${circumference}`;
        const strokeDashOffset = -((accumulatedPercentagePieOffset * circumference) / 100);

        const circleSegment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleSegment.setAttribute("cx", "16");
        circleSegment.setAttribute("cy", "16");
        circleSegment.setAttribute("r", radius.toString());
        circleSegment.setAttribute("fill", "transparent");
        circleSegment.setAttribute("stroke", colorStyle);
        circleSegment.setAttribute("stroke-width", "5");
        circleSegment.setAttribute("stroke-dasharray", strokeDashArray);
        circleSegment.setAttribute("stroke-dashoffset", strokeDashOffset.toString());
        circleSegment.setAttribute("class", "transition-all duration-500 hover:opacity-80 cursor-pointer");
        
        svgChart.appendChild(circleSegment);
        accumulatedPercentagePieOffset += ratioPercentage;
    });
}

// ==========================================
// 5. FILIPINO MEAL PLANNER ENGINE
// ==========================================

function selectDietStyle(styleKey, btnNode) {
    activeSelectedDietStyle = styleKey;
    
    // Reset structural borders class elements
    const elements = document.querySelectorAll('.diet-btn');
    elements.forEach(e => {
        e.classList.remove('border-emerald-600', 'bg-emerald-50/50');
        e.classList.add('border-gray-200', 'bg-gray-50/50');
        e.querySelector('span:last-child').classList.replace('text-gray-800', 'text-gray-700');
    });

    // Enforce active metrics highlights
    btnNode.classList.remove('border-gray-200', 'bg-gray-50/50');
    btnNode.classList.add('border-2', 'border-emerald-600', 'bg-emerald-50/50');
    btnNode.querySelector('span:last-child').classList.replace('text-gray-700', 'text-gray-800');

    calculatePlanMetrics();
}

function calculatePlanMetrics() {
    const rawBudget = parseFloat(document.getElementById('plannerBudget').value) || 0;
    const rawPax = parseInt(document.getElementById('plannerPax').value) || 4;

    // Standard Filipino structural cadence calculation (3 meals/day over 7 days = 21 meals)
    const costPerMeal = rawBudget / 21;
    const costPerPaxDay = rawBudget / (7 * rawPax);

    const calcPerMealEl = document.getElementById('calcPerMeal');
    const calcPerPaxEl = document.getElementById('calcPerPax');
    if (calcPerMealEl) calcPerMealEl.innerText = `₱${costPerMeal.toFixed(2)}`;
    if (calcPerPaxEl) calcPerPaxEl.innerText = `₱${costPerPaxDay.toFixed(2)} / day`;
}

function generateFilipinoMealPlan() {
    const budgetValue = document.getElementById('plannerBudget').value.trim();
    const paxValue = document.getElementById('plannerPax').value.trim();
    
    if (!budgetValue || !paxValue) {
        alert('Please enter your weekly budget and family size before generating a meal plan.');
        return;
    }

    const targetWeekBudget = parseFloat(budgetValue);
    const targetPaxCount = parseInt(paxValue, 10);

    if (isNaN(targetWeekBudget) || targetWeekBudget <= 0 || isNaN(targetPaxCount) || targetPaxCount <= 0) {
        alert('Please enter valid numeric values for budget and family members.');
        return;
    }

    initializeMealPlanner();
    showMealPlannerWrapper();

    // Read active exclusion list checkboxes array
    const selectedExclusions = Array.from(document.querySelectorAll('#allergyChipsContainer input:checked')).map(cb => cb.value);

    // Build scoped source arrays safely matching category logic keys
    const dietKey = document.getElementById('plannerDiet')?.value || activeSelectedDietStyle || 'anything';
    let dietFiltered = RECIPE_DATABASE.filter(recipe => {
        if (dietKey === 'anything') return true;
        return Array.isArray(recipe.diet) && recipe.diet.includes(dietKey);
    });

    if (dietFiltered.length === 0) {
        dietFiltered = RECIPE_DATABASE;
    }

    // Strict filtering protocol framework matching criteria indices
    let filteredRecipes = dietFiltered.filter(recipe => {
        const titleLower = recipe.name.toLowerCase();
        
        if (selectedExclusions.includes('shrimp') && (titleLower.includes('shrimp') || titleLower.includes('hipon') || titleLower.includes('alimango') || titleLower.includes('squid') || titleLower.includes('bangus') || titleLower.includes('danggit') || titleLower.includes('fish'))) return false;
        if (selectedExclusions.includes('chicken') && (titleLower.includes('chicken') || titleLower.includes('manok') || titleLower.includes('sopas') || titleLower.includes('itlog') || titleLower.includes('egg') || titleLower.includes('silog'))) return false;
        if (selectedExclusions.includes('peanuts') && (titleLower.includes('mani') || titleLower.includes('kare-kare'))) return false;
        if (selectedExclusions.includes('dairy') && (titleLower.includes('cheese') || titleLower.includes('gatas') || titleLower.includes('sopas'))) return false;
        
        return true;
    });

    // Fallback deployment routine to prevent crash behavior frameworks
    if (filteredRecipes.length < 3) {
        filteredRecipes = RECIPE_DATABASE;
    }

    const breakfastOptions = filteredRecipes.filter(r => r.mealType.includes("Breakfast"));
    const lunchOptions = filteredRecipes.filter(r => r.mealType.includes("Lunch"));
    const dinnerOptions = filteredRecipes.filter(r => r.mealType.includes("Dinner"));

    const budgetPerServing = targetWeekBudget / (21 * targetPaxCount);

    const getSafeRecipe = (array, fallbackPool, type) => {
        if (array.length > 0) return array[Math.floor(Math.random() * array.length)];
        const subFiltered = fallbackPool.filter(r => r.mealType.includes(type));
        return subFiltered[Math.floor(Math.random() * subFiltered.length)] || fallbackPool[0];
    };

    const usedRecipeIdsByType = { Breakfast: new Set(), Lunch: new Set(), Dinner: new Set() };

    const chooseBudgetFriendlyRecipe = (options, type, excludeIds = new Set()) => {
        if (options.length === 0) return getSafeRecipe([], RECIPE_DATABASE, type);

        const withMatchScore = options.map(recipe => {
            const perServingCost = recipe.estimatedCost / Math.max(recipe.servings, 1);
            const costDistance = Math.abs(perServingCost - budgetPerServing);
            const servingDistance = Math.abs(recipe.servings - targetPaxCount);
            return {
                recipe,
                perServingCost,
                score: costDistance * 1.4 + servingDistance * 1.2
            };
        });

        const sortedByScore = withMatchScore.sort((a, b) => a.score - b.score);

        // Pick among the best-fitting candidates, avoiding repeats within the week
        const used = usedRecipeIdsByType[type] || new Set();
        const topPool = sortedByScore.slice(0, Math.min(7, sortedByScore.length));
        const notToday = topPool.filter(entry => !excludeIds.has(entry.recipe.id));
        const dayPool = notToday.length > 0 ? notToday : topPool;
        const freshPool = dayPool.filter(entry => !used.has(entry.recipe.id));
        const pickPool = freshPool.length > 0 ? freshPool : dayPool;
        const chosen = pickPool[Math.floor(Math.random() * pickPool.length)].recipe;
        used.add(chosen.id);
        if (used.size >= topPool.length) used.clear();
        return chosen;
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const resultsContainer = document.getElementById('weeklyScheduleCardsContainer');
    
    resultsContainer.innerHTML = '';
    let totalPlanCostAccumulator = 0;

    daysOfWeek.forEach(day => {
        const todayIds = new Set();
        const bMeal = chooseBudgetFriendlyRecipe(breakfastOptions, "Breakfast", todayIds);
        todayIds.add(bMeal.id);
        const lMeal = chooseBudgetFriendlyRecipe(lunchOptions, "Lunch", todayIds);
        todayIds.add(lMeal.id);
        const dMeal = chooseBudgetFriendlyRecipe(dinnerOptions, "Dinner", todayIds);

        currentMealPlan[day] = {
            Breakfast: bMeal,
            Lunch: lMeal,
            Dinner: dMeal
        };

        const bCost = (bMeal.estimatedCost / Math.max(bMeal.servings, 1)) * targetPaxCount;
        const lCost = (lMeal.estimatedCost / Math.max(lMeal.servings, 1)) * targetPaxCount;
        const dCost = (dMeal.estimatedCost / Math.max(dMeal.servings, 1)) * targetPaxCount;
        const dayCost = bCost + lCost + dCost;
        totalPlanCostAccumulator += dayCost;

        const dayCard = document.createElement('div');
        dayCard.className = "bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid md:grid-cols-4 items-center gap-4 hover:border-emerald-200 transition";
        dayCard.innerHTML = `
            <div class="bg-emerald-50 p-3 rounded-lg text-center md:border-r border-emerald-100/50">
                <span class="text-xs font-black text-emerald-800 uppercase block tracking-wider">${day}</span>
                <span class="text-xs font-mono font-bold text-emerald-600 block mt-1">Est: ₱${dayCost.toFixed(0)}</span>
            </div>
            <div class="md:col-span-3 grid sm:grid-cols-3 gap-3 text-xs text-gray-700">
                <div class="bg-gray-50/70 p-2 rounded border border-gray-100">
                    <span class="text-[10px] font-black uppercase tracking-tight text-amber-700 block mb-0.5">🌅 Aga-Han (Breakfast)</span>
                    <p class="font-medium text-gray-800">${bMeal.name}</p>
                </div>
                <div class="bg-gray-50/70 p-2 rounded border border-gray-100">
                    <span class="text-[10px] font-black uppercase tracking-tight text-emerald-700 block mb-0.5">☀️ Tanghalian (Lunch)</span>
                    <p class="font-medium text-gray-800">${lMeal.name}</p>
                </div>
                <div class="bg-gray-50/70 p-2 rounded border border-gray-100">
                    <span class="text-[10px] font-black uppercase tracking-tight text-indigo-700 block mb-0.5">🌙 Hapunan (Dinner)</span>
                    <p class="font-medium text-gray-800">${dMeal.name}</p>
                </div>
            </div>
        `;
        resultsContainer.appendChild(dayCard);
    });

    document.getElementById('plannerResultsSection').classList.remove('hidden');
    renderWeeklyPlanner();
    renderPlannerSummaryFromCurrentPlan();
    const summaryWarning = document.getElementById('plannerSummaryWarning');
    if (totalPlanCostAccumulator > targetWeekBudget) {
        if (summaryWarning) {
            summaryWarning.innerText = `Notice: estimated weekly cost ₱${totalPlanCostAccumulator.toFixed(0)} exceeds your target ₱${targetWeekBudget}.`;
        }
    } else if (summaryWarning) {
        summaryWarning.innerText = '';
    }
}

// ==========================================
// 6. GROCERY LIST TRACKER SYSTEM
// ==========================================

function getGroceryData() {
    return JSON.parse(localStorage.getItem('groceryItems')) || [];
}

function setGroceryData(data) {
    localStorage.setItem('groceryItems', JSON.stringify(data));
}

function renderGroceryItems(filteredItems = null) {
    const tableBody = document.getElementById('groceryTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const items = filteredItems || getGroceryData();
    let totalCost = 0;

    items.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalCost += subtotal;

        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition border-b border-gray-100";
        row.innerHTML = `
            <td class="p-3 border-r border-gray-200 font-medium text-xs text-gray-500">${item.category}</td>
            <td class="p-3 border-r border-gray-200 font-bold text-gray-800">${item.name}</td>
            <td class="p-3 border-r border-gray-200 text-center font-mono font-medium">${item.quantity}</td>
            <td class="p-3 border-r border-gray-200 text-right font-mono font-semibold">₱${parseFloat(item.price).toFixed(2)}</td>
            <td class="p-3 border-r border-gray-200 text-right font-mono font-bold text-gray-900">₱${subtotal.toFixed(2)}</td>
            <td class="p-3 text-center">
                <button onclick="deleteItem(${index})" class="text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 transition">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalCost').innerText = `₱${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    checkGroceryBudgetConstraints(totalCost);
}

function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const category = document.getElementById('itemCategory').value;

    if (!name || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        alert('Please fill out all fields with valid numbers before appending item lines.');
        return;
    }

    const items = getGroceryData();
    items.push({ name, price, quantity, category });
    setGroceryData(items);

    // Clear dynamic operational field nodes
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemQuantity').value = '';

    renderGroceryItems();
}

function deleteItem(index) {
    const items = getGroceryData();
    items.splice(index, 1);
    setGroceryData(items);
    renderGroceryItems();
}

function searchItems() {
    const query = document.getElementById('grocerySearchInput').value.toLowerCase().trim();
    const items = getGroceryData();
    
    if (!query) {
        renderGroceryItems();
        return;
    }

    const filtered = items.filter(item => item.name.toLowerCase().includes(query));
    renderGroceryItems(filtered);
}

function checkGroceryBudgetConstraints(currentTotal) {
    const warningNode = document.getElementById('budgetWarning');
    if (!warningNode) return;

    // Cross-check values directly with the Active Workspace Module Framework
    if (!currentActiveMonthId) {
        warningNode.innerText = "💡 Notice: No active monthly budget folder selected to run comparison safeguards against.";
        return;
    }

    const history = JSON.parse(localStorage.getItem('palengke_budgets_v2')) || [];
    const activeData = history.find(h => h.id === currentActiveMonthId);
    if (!activeData) return;

    const computedIncomePool = activeData.incomeList.filter(i => activeSpecificationFilter === 'all' || i.specCadence === activeSpecificationFilter).reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

    if (computedIncomePool > 0 && currentTotal > computedIncomePool) {
        warningNode.innerText = `🚨 Warning: This grocery compilation setup (₱${currentTotal.toFixed(0)}) exceeds your currently filtered active income allocation context pool (₱${computedIncomePool.toFixed(0)}).`;
    } else {
        warningNode.innerText = "";
    }
}

// ==========================================
// 7. EXTERNAL CONTEXT AI SUGGESTIONS MODULE
// ==========================================

function evaluateDynamicContextualAISuggestions() {
    const targetContainer = document.getElementById('aiSuggestionsList');
    const budgetValueNode = document.getElementById('suggestionBudgetValue');
    const paxValueNode = document.getElementById('suggestionPaxValue');
    const planStatusNode = document.getElementById('suggestionPlanStatus');
    if (!targetContainer || !budgetValueNode || !paxValueNode || !planStatusNode) return;

    const budget = parseFloat(document.getElementById('plannerBudget')?.value) || 0;
    const pax = parseInt(document.getElementById('plannerPax')?.value) || 0;

    if (document.activeElement !== budgetValueNode) budgetValueNode.value = budget > 0 ? budget : '';
    if (document.activeElement !== paxValueNode) paxValueNode.value = pax > 0 ? pax : '';

    const hasPlan = DAYS_OF_WEEK.some(day => {
        const plan = currentMealPlan[day];
        return plan && (plan.Breakfast || plan.Lunch || plan.Dinner);
    });
    planStatusNode.innerText = hasPlan ? 'Active meal plan detected' : 'No active plan';

    const groceryItems = getGroceryData();
    const totalGroceryCost = groceryItems.reduce((acc, i) => acc + ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 0)), 0);

    let suggestions = [];

    if (budget <= 0 || pax <= 0) {
        suggestions.push('Set your weekly budget and family size in the cards above to get tailored suggestions.');
    } else {
        const perMealBudget = budget / 21;
        suggestions.push(`Your target average is around ₱${perMealBudget.toFixed(0)} per meal.`);

        if (perMealBudget < 80) {
            suggestions.push('You are on a tight meal budget. Favor soups, vegetable dishes, and mixed protein pansit recipes to stay within cost.');
        } else if (perMealBudget < 140) {
            suggestions.push('A balanced budget range. Mix lean pork, fish, and vegetable dishes while keeping one or two tipid meals per week.');
        } else {
            suggestions.push('You have room for higher protein choices this week; prioritize fresh chicken, beef, and fish with rice and veggie sides.');
        }

        const selectedDiet = document.getElementById('plannerDiet')?.value || 'anything';
        if (selectedDiet === 'tipid') {
            suggestions.push('Because you selected Petsa de Peligro, use more itlog, tokwa, tasty stir-fried vegetables, and soups to stretch your budget.');
        } else if (selectedDiet === 'healthy') {
            suggestions.push('Healthy mode is on: choose more tinola, sinigang, and sautéed vegetable dishes with lean protein sources.');
        } else if (selectedDiet === 'protein') {
            suggestions.push('Protein focus active: add more Filipinobreakfast silog combinations and hearty adobo, inasal, or caldereta variants.');
        } else if (selectedDiet === 'nopork') {
            suggestions.push('Pork-free mode: prioritize bangus, tilapia, chicken, tofu, and vegetable-based dishes.');
        }

        if (totalGroceryCost > budget * 0.6) {
            suggestions.push('Your grocery list already uses more than 60% of your weekly budget. Review staples and avoid premium processed items.');
        }

        if (groceryItems.some(i => i.category && i.category.toLowerCase().includes('condiments'))) {
            suggestions.push('Check condiments and spice items. Small swaps in this category often save more than swapping main dishes.');
        }

        if (!hasPlan) {
            suggestions.push('No active meal plan found yet. Generate or customize a weekly plan to get better, actionable grocery recommendations.');
        }
    }

    if (suggestions.length === 0) {
        suggestions.push('No AI suggestions are available yet. Try refreshing after setting your budget and family size.');
    }
    targetContainer.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
}

function processAISuggestionQuery() {
    const questionInput = document.getElementById('aiQuestionInput');
    const chatHistory = document.getElementById('aiChatHistory');
    if (!questionInput || !chatHistory) return;

    const question = questionInput.value.trim();
    if (!question) return;

    appendChatMessage('user', question);
    const responseText = generateAIResponse(question);
    appendChatMessage('ai', responseText);

    questionInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleQuickPrompt(prompt) {
    const questionInput = document.getElementById('aiQuestionInput');
    if (!questionInput) return;
    questionInput.value = prompt;
    processAISuggestionQuery();
}

function escapeChatHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatChatText(text) {
    return escapeChatHtml(text).replace(/\n/g, '<br>');
}

function appendChatMessage(sender, text) {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;

    if (chatHistory.children.length === 1 && chatHistory.children[0].textContent.includes('Your AI conversation will appear here')) {
        chatHistory.innerHTML = '';
    }

    const message = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (sender === 'user') {
        message.className = 'self-end bg-slate-100 border border-slate-200 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-gray-500">You</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${formatChatText(text)}</p>`;
    } else {
        message.className = 'self-start bg-emerald-50 border border-emerald-100 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-emerald-700">Palengke AI</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${formatChatText(text)}</p>`;
    }
    chatHistory.appendChild(message);
}

function renderAIWelcomeMessage() {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;
    if (chatHistory.children.length === 0 || (chatHistory.children.length === 1 && chatHistory.children[0].textContent.includes('Your AI conversation will appear here'))) {
        chatHistory.innerHTML = '';
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'self-start bg-emerald-50 border border-emerald-100 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        welcomeMessage.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-emerald-700">Palengke AI</strong><span class="text-[10px] text-gray-400">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><p class="mt-2">Welcome! Ask me about meals, budgeting, or groceries and I’ll suggest Filipino dishes and smart shopping tips.</p>`;
        chatHistory.appendChild(welcomeMessage);
    }
}

function generateAIResponse(question) {
    const normalized = question.toLowerCase();
    const budget = parseFloat(document.getElementById('plannerBudget')?.value) || 0;
    const pax = parseInt(document.getElementById('plannerPax')?.value) || 0;
    const selectedDiet = document.getElementById('plannerDiet')?.value || 'anything';
    const groceryItems = getGroceryData();

    // Greetings and small talk
    if (/^(hi|hello|hey|yo|kumusta|musta|good\s*(morning|afternoon|evening|day))\b/.test(normalized.trim())) {
        return 'Kumusta! I can help you plan meals, stretch your budget, and manage your grocery list.\nTry asking:\n• "How do I cook Chicken Adobo?"\n• "Magkano ang tilapia?"\n• "How should I split my kinsena budget?"\n• "What\'s in season this month?"';
    }
    if (/salamat|thank/.test(normalized)) {
        return 'Walang anuman! Happy to help. Ask me anytime about meals, palengke prices, or budgeting tips.';
    }
    if (/what can you (do|help)|help me|how do you work|anong kaya mo/.test(normalized)) {
        return 'Here\'s what I can help with:\n• Recipes — "How do I cook Sinigang?" (I know all ' + RECIPE_DATABASE.length + ' dishes in the app)\n• Meal ideas — "What\'s a cheap dinner for 4?"\n• Your meal plan — "What\'s my plan for Monday?"\n• Palengke prices — "Magkano ang manok?"\n• Budgeting — "How do I budget my kinsena?", "What is the 50/30/20 rule?"\n• Grocery list — "What should I buy?", "What can I swap to save money?"\n• Market tips — "When is the best time to go to the palengke?"\n• Food storage — "How do I keep vegetables fresh?"';
    }

    // How to cook a specific dish
    if (/how (do|to|can|should).*(cook|make|prepare)|paano.*(lut|gaw)|recipe (for|of|ng)|ingredients (of|for|ng)|steps (for|to)/.test(normalized)) {
        const recipeAnswer = respondToRecipeHowTo(normalized);
        if (recipeAnswer) return recipeAnswer;
    }

    // Palengke price lookups
    if (/magkano|presyo|how much (is|are|does)|price of|cost of/.test(normalized)) {
        const priceAnswer = respondToPriceQuery(normalized);
        if (priceAnswer) return priceAnswer;
    }

    // Current meal plan questions
    if (/\b(my|current|active|this week'?s?) (meal )?plan\b|plan (for|this) (today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|what('s| is) for (today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\b(breakfast|lunch|dinner|meal|ulam)\b.*\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*\b(breakfast|lunch|dinner|ulam)\b/.test(normalized)) {
        return respondToPlanQuery(normalized, budget);
    }

    // Food storage and leftovers
    if (/leftover|left-over|storage|how (do|to|can) .*(store|keep|preserve)|spoil|panis|freeze|freezer|refrigerat|keep.*fresh|stay.*fresh/.test(normalized)) {
        return respondToStorageQuery(normalized);
    }

    // Palengke shopping tips and seasonal produce
    if (/palengke|wet market|tawad|haggl|in season|seasonal|best time.*(shop|market|buy)|supermarket vs|talipapa/.test(normalized)) {
        return respondToPalengkeQuery(normalized);
    }

    // Nutrition and healthy eating
    if (/nutriti|nutrient|vitamin|masustansya|pinggang pinoy|balanced (diet|meal)|healthy eating|protein (source|intake)|malnutri|baon/.test(normalized)) {
        return respondToNutritionQuery(normalized, budget, pax, selectedDiet);
    }

    if (/\b(?:grocery|list|buy|substitute|swap|ingredient|store|shop|shopping)\b/.test(normalized)) {
        return respondToGroceryQuery(normalized, budget, pax, selectedDiet, groceryItems);
    }

    if (/\b(?:budget|save|saving|ipon|cheap|tipid|expensive|cost|afford|spend|expense|tight|kinsena|payday|sweldo|allowance|utang|debt|emergency fund|envelope|50\/30\/20|price)\b/.test(normalized)) {
        return respondToBudgetQuery(normalized, budget, pax, selectedDiet, groceryItems);
    }

    if (/\b(?:breakfast|lunch|dinner|merienda|ulam|silog|recipe|meal|cook|menu|almusal|hapunan|tanghalian)\b/.test(normalized)) {
        return respondToMealQuery(normalized, budget, pax, selectedDiet);
    }

    return 'I can help with Filipino meals, budgeting, palengke prices, and grocery planning. Try:\n• "How do I cook Chicken Adobo?"\n• "Magkano ang bangus?"\n• "How should I budget my kinsena?"\n• "What should I buy this week?"\n• "How do I keep gulay fresh longer?"';
}

// ==========================================
// 7b. PALENGKE AI KNOWLEDGE BASE
// ==========================================

const MARKET_PRICE_REFERENCE = [
    { keys: ['rice', 'bigas', 'kanin'], label: 'Well-milled rice', price: '₱48–55/kg' },
    { keys: ['chicken', 'manok'], label: 'Whole chicken', price: '₱170–190/kg' },
    { keys: ['egg', 'itlog'], label: 'Chicken eggs', price: '₱8–9/pc' },
    { keys: ['pork', 'baboy', 'kasim'], label: 'Pork kasim', price: '₱300–330/kg' },
    { keys: ['liempo'], label: 'Pork liempo', price: '₱340–380/kg' },
    { keys: ['beef', 'baka'], label: 'Beef (stewing cuts)', price: '₱400–450/kg' },
    { keys: ['tilapia'], label: 'Tilapia', price: '₱130–150/kg' },
    { keys: ['bangus', 'milkfish'], label: 'Bangus', price: '₱180–200/kg' },
    { keys: ['galunggong', 'gg'], label: 'Galunggong', price: '₱150–180/kg' },
    { keys: ['tokwa', 'tofu'], label: 'Tokwa', price: '₱12–18/pc' },
    { keys: ['monggo', 'munggo', 'mung bean'], label: 'Monggo beans', price: '₱80–100/kg' },
    { keys: ['talong', 'eggplant'], label: 'Talong', price: '₱80–100/kg' },
    { keys: ['pechay'], label: 'Pechay', price: '₱15–25/bundle' },
    { keys: ['kangkong'], label: 'Kangkong', price: '₱10–20/bundle' },
    { keys: ['sayote'], label: 'Sayote', price: '₱35–50/kg' },
    { keys: ['kalabasa', 'squash'], label: 'Kalabasa', price: '₱40–60/kg' },
    { keys: ['kamote', 'sweet potato'], label: 'Kamote', price: '₱40–60/kg' },
    { keys: ['tomato', 'kamatis'], label: 'Kamatis', price: '₱60–100/kg' },
    { keys: ['onion', 'sibuyas'], label: 'Red onions', price: '₱140–170/kg' },
    { keys: ['garlic', 'bawang'], label: 'Garlic', price: '₱120–160/kg' },
    { keys: ['sardines', 'sardinas'], label: 'Canned sardines', price: '₱22–28/can' },
    { keys: ['noodles', 'pancit canton', 'instant'], label: 'Instant noodles', price: '₱12–18/pack' },
    { keys: ['oil', 'mantika'], label: 'Cooking oil', price: '₱80–100/L' },
    { keys: ['sugar', 'asukal'], label: 'Sugar', price: '₱80–90/kg' }
];

function respondToPriceQuery(question) {
    const matches = MARKET_PRICE_REFERENCE.filter(entry => entry.keys.some(k => question.includes(k)));
    if (matches.length === 0) {
        return 'Here are common palengke reference prices:\n• Well-milled rice — ₱48–55/kg\n• Whole chicken — ₱170–190/kg\n• Pork kasim — ₱300–330/kg\n• Tilapia — ₱130–150/kg\n• Eggs — ₱8–9/pc\n• Red onions — ₱140–170/kg\nPrices vary per market and season — check the Market Prices tab for the watchlist.';
    }
    const lines = matches.map(m => `• ${m.label} — ${m.price}`);
    return `Estimated palengke prices:\n${lines.join('\n')}\nPrices vary per market and season — tawad politely and compare 2–3 stalls before buying.`;
}

function respondToRecipeHowTo(question) {
    let best = null;
    let bestScore = 0;
    RECIPE_DATABASE.forEach(recipe => {
        const name = recipe.name.toLowerCase();
        let score = 0;
        if (question.includes(name)) {
            score = 100;
        } else {
            const words = name.split(/[^a-zñ]+/).filter(w => w.length >= 4 && !['with', 'and'].includes(w));
            score = words.filter(w => question.includes(w)).length * 10;
        }
        if (score > bestScore) { bestScore = score; best = recipe; }
    });
    if (!best || bestScore < 10) return null;

    const perPax = (best.estimatedCost / Math.max(best.servings, 1)).toFixed(0);
    const ingredients = best.ingredients.map(i => `• ${i}`).join('\n');
    const steps = best.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n');
    return `${best.name} — ${best.difficulty} · Prep ${best.prepTime} · Cook ${best.cookTime} · Serves ${best.servings} pax · ~₱${best.estimatedCost} (₱${perPax}/pax)\n\nIngredients:\n${ingredients}\n\nSteps:\n${steps}\n\nTip: You can add this dish to your weekly plan from the Meal Planner tab.`;
}

function respondToPlanQuery(question, budget) {
    if (!hasActiveMealPlan()) {
        return 'You don\'t have an active meal plan yet. Go to the Meal Planner tab and press "Generate Meal Plan", or build your own with "Customize Meal Plan". Once a plan is active, I can summarize it and answer questions like "What\'s for dinner on Monday?"';
    }

    const dayAsked = DAYS_OF_WEEK.find(d => question.includes(d.toLowerCase()));
    const mealName = m => (m && (m.name || m)) || '—';
    const dayLine = day => {
        const p = currentMealPlan[day] || {};
        return `${day}: Breakfast — ${mealName(p.Breakfast)} · Lunch — ${mealName(p.Lunch)} · Dinner — ${mealName(p.Dinner)}`;
    };

    if (dayAsked) {
        return `Here\'s your plan for ${dayAsked}:\n${dayLine(dayAsked)}\nClick any meal in the Meal Planner to see its full recipe.`;
    }

    let total = 0;
    DAYS_OF_WEEK.forEach(day => {
        const p = currentMealPlan[day] || {};
        ['Breakfast', 'Lunch', 'Dinner'].forEach(t => {
            const m = p[t];
            if (m) total += (m.baseCost || m.estimatedCost || 0);
        });
    });
    const lines = DAYS_OF_WEEK.map(dayLine).join('\n');
    const budgetLine = budget > 0
        ? (total > budget ? `Estimated week cost is ~₱${total.toFixed(0)}, which is OVER your ₱${budget} budget — consider swapping 2–3 dishes for cheaper ones.` : `Estimated week cost is ~₱${total.toFixed(0)}, within your ₱${budget} budget.`)
        : `Estimated week cost is ~₱${total.toFixed(0)}. Set your weekly budget so I can check if it fits.`;
    return `Here\'s your current weekly plan:\n${lines}\n\n${budgetLine}`;
}

function respondToStorageQuery(question) {
    if (/rice|bigas|kanin/.test(question)) {
        return 'Rice storage tips:\n• Store uncooked bigas in a sealed container away from moisture — add a few dried bay leaves to deter weevils (bukbok).\n• Cooked rice: refrigerate within 2 hours, keep max 3–4 days, and reheat until steaming.\n• Leftover rice is perfect for sinangag — day-old rice fries better than fresh.';
    }
    if (/fish|isda|bangus|tilapia|meat|karne|baboy|manok|chicken|pork/.test(question)) {
        return 'Meat & fish storage tips:\n• Buy meat and fish last at the palengke and get them home quickly.\n• Portion into meal-size packs before freezing so you only thaw what you need.\n• Freezer: fish 2–3 months, chicken/pork 3–6 months. Fridge: cook within 1–2 days.\n• Thaw overnight in the fridge, not on the counter.';
    }
    if (/gulay|vegetable|veggie|pechay|kangkong|talong/.test(question)) {
        return 'Vegetable storage tips:\n• Leafy greens (pechay, kangkong): wrap in slightly damp paper towel or newspaper, then keep in a container in the fridge — lasts 3–5 days.\n• Talong, sayote, kalabasa: keep at room temp away from sun for 3–4 days, or refrigerate for up to a week.\n• Onions and garlic: dry, dark, airy spot — never in the fridge.\n• Kamatis: room temp until ripe, then refrigerate.';
    }
    return 'Food storage basics:\n• Cool leftovers quickly and refrigerate within 2 hours; consume within 3–4 days.\n• Reheat food until steaming hot — sabaw dishes like sinigang keep well for 2–3 days refrigerated.\n• Freeze proteins in meal-size portions to avoid waste.\n• Store rice, monggo, and dry goods in sealed containers to avoid bukbok.\n• Label containers with dates — first in, first out.';
}

function respondToPalengkeQuery(question) {
    if (/season/.test(question)) {
        return 'Buying in-season produce saves 20–40%:\n• Rainy season (Jun–Nov): kangkong, kamote tops, sitaw, kalabasa, saging na saba\n• Dry season (Dec–May): kamatis, talong, ampalaya, upo, mangga\n• Year-round cheap picks: sayote, repolyo, monggo, pechay\nIf a vegetable is suddenly expensive, it\'s usually off-season — swap it for whatever is abundant that week.';
    }
    if (/tawad|haggl/.test(question)) {
        return 'Tawad (haggling) tips:\n• Be friendly and buy in bundles — "suki" treatment earns discounts over time.\n• Ask "May tawad pa po ba?" politely; works best near closing time.\n• Compare 2–3 stalls before committing — prices can differ ₱10–30/kg in the same market.\n• Buying slightly "ugly" but fresh produce is often 20–30% cheaper and cooks the same.';
    }
    return 'Palengke shopping tips:\n• Go early morning (5–7 AM) for the freshest fish and meat, or near closing (5–6 PM) for discounted vegetables.\n• Build "suki" relationships with 2–3 stalls — regulars get better prices and freebies like sili or kalamansi.\n• Buy staples (rice, oil, monggo) in bulk; buy perishables in smaller, frequent trips.\n• Wet market beats supermarket by 15–25% for meat, fish, and vegetables; supermarkets win for canned goods on promo.\n• Bring your own bayong and small bills — easier tawad.';
}

function respondToNutritionQuery(question, budget, pax, diet) {
    const healthy = getRecipeSuggestions('Lunch', 'healthy', 3).map(r => `• ${r.name} (${r.servings} pax, ₱${r.estimatedCost})`).join('\n');
    return 'Follow the Pinggang Pinoy guide for balanced meals:\n• 1/2 of your plate: gulay at prutas (vegetables and fruits)\n• 1/4: kanin or other go foods (rice, kamote, corn)\n• 1/4: protein (isda, itlog, manok, monggo, tokwa)\n\nBudget-friendly protein sources: eggs (₱8–9/pc), monggo, tokwa, galunggong, and sardines.\n\nHealthy dishes from our recipe list:\n' + healthy + '\n\nTip: set your diet to "Healthy" in the Meal Planner and I\'ll prioritize these when generating plans.';
}

function getRecipeSuggestions(mealType, diet, maxResults = 3) {
    const matching = RECIPE_DATABASE.filter(recipe => {
        const mealMatch = recipe.mealType.includes(mealType);
        const dietMatch = diet === 'anything' || recipe.diet.includes(diet);
        return mealMatch && dietMatch;
    });

    matching.sort((a, b) => {
        const costA = a.estimatedCost / Math.max(a.servings, 1);
        const costB = b.estimatedCost / Math.max(b.servings, 1);
        return costA - costB;
    });

    return matching.slice(0, maxResults);
}

function findRecipesByKeyword(keyword, diet, maxResults = 4) {
    const lowerKeyword = keyword.toLowerCase();
    const matching = RECIPE_DATABASE.filter(recipe => {
        const dietMatch = diet === 'anything' || recipe.diet.includes(diet);
        return dietMatch && (recipe.name.toLowerCase().includes(lowerKeyword) || recipe.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword)));
    });
    if (matching.length === 0) {
        const generalMatch = RECIPE_DATABASE.filter(recipe => {
            const dietMatch = diet === 'anything' || recipe.diet.includes(diet);
            return dietMatch && recipe.name.toLowerCase().includes(lowerKeyword);
        });
        return generalMatch.slice(0, maxResults);
    }
    return matching.slice(0, maxResults);
}

function respondToMealQuery(question, budget, pax, diet) {
    const lower = question;
    const requestedMeals = determineRequestedMeals(lower);
    const count = parseInt((question.match(/\b(\d+)\b/) || [0])[0], 10) || pax || 4;
    const suggestions = [];

    if (requestedMeals.length === 0) {
        requestedMeals.push('Lunch');
    }

    requestedMeals.forEach(type => {
        let recipes = getRecipeSuggestions(type, diet, 4);
        if (lower.includes('chicken')) recipes = findRecipesByKeyword('chicken', diet, 4).filter(r => r.mealType.includes(type));
        if (lower.includes('fish') || lower.includes('bangus') || lower.includes('tilapia')) recipes = findRecipesByKeyword('fish', diet, 4).filter(r => r.mealType.includes(type));
        if (lower.includes('vegetable') || lower.includes('veggie') || lower.includes('healthy')) recipes = findRecipesByKeyword('healthy', diet, 4).filter(r => r.mealType.includes(type));
        if (recipes.length > 0) {
            const lines = recipes.map(r => `• ${r.name} — ${r.servings} pax, ₱${r.estimatedCost} (₱${Math.round(r.estimatedCost / Math.max(r.servings, 1))}/pax)`).join('\n');
            suggestions.push(`${type} ideas:\n${lines}`);
        }
    });

    const budgetTip = budget > 0 ? `With ₱${budget} weekly for ${count} pax, aim for about ₱${Math.round(budget / Math.max(count * 3, 1))} per meal.` : 'Set your weekly budget and family size, and I can give more accurate meal estimates.';
    const planAdvice = hasActiveMealPlan() ? 'Tip: your meal plan is active — you can swap any slot for one of these dishes.' : 'Tip: ask me "How do I cook …?" for full ingredients and steps of any dish.';

    return [budgetTip, '', ...suggestions, '', planAdvice].join('\n').replace(/\n{3,}/g, '\n\n');
}

function determineRequestedMeals(question) {
    const meals = [];
    if (/\bbreakfast\b/.test(question)) meals.push('Breakfast');
    if (/\blunch\b/.test(question)) meals.push('Lunch');
    if (/\bdinner\b/.test(question)) meals.push('Dinner');
    if (question.includes('ulam') || question.includes('silog')) meals.push('Lunch');
    return meals;
}

function respondToBudgetQuery(question, budget, pax, diet, groceryItems) {
    // Specific budgeting methods and concepts
    if (/50\/?30\/?20/.test(question)) {
        return 'The 50/30/20 rule splits your monthly income:\n• 50% — needs: food, rent, bills, transport, school\n• 30% — wants: eating out, load, entertainment\n• 20% — savings and debt payments\nFor a ₱15,000 monthly income, that\'s ₱7,500 needs / ₱4,500 wants / ₱3,000 savings.\nYour food budget usually sits inside the 50% — use the Budget Tracker tab to see if yours fits.';
    }
    if (/kinsena|payday|sweldo/.test(question)) {
        const half = budget > 0 ? ` With your ₱${budget}/week food budget, set aside about ₱${(budget * 2).toFixed(0)} per kinsena for food.` : '';
        return 'Kinsena budgeting tips:\n• On payday, immediately set aside fixed costs (bills, rent, baon) before anything else.\n• Split your food money into 2 weekly envelopes so week 2 doesn\'t go hungry.\n• Do one big palengke trip per week instead of daily small trips — fewer trips, fewer impulse buys.\n• Keep a small ₱200–300 buffer for price spikes.' + half + '\nUse the Budget Tracker tab with the "kinsena" timeline to monitor this.';
    }
    if (/envelope/.test(question)) {
        return 'The envelope method:\n• Divide cash into labeled envelopes — e.g. Palengke, Bills, Baon, Ipon.\n• Only spend what\'s inside each envelope; when it\'s empty, stop.\n• Digital version: use separate e-wallet pockets or bank sub-accounts.\nIt works because it makes overspending physically visible. Start with a Palengke envelope equal to your weekly food budget.';
    }
    if (/ipon|emergency fund/.test(question)) {
        return 'Ipon (savings) tips:\n• Pay yourself first — move savings on payday, don\'t wait for "sobra".\n• Try the 52-week ipon challenge: start at ₱10/week, increase weekly — you\'ll save ₱13,780 in a year.\n• Target an emergency fund of 3–6 months of expenses; keep it separate from daily money.\n• Cut food costs without cutting nutrition: cook in batches, use in-season gulay, and plan meals with the Meal Planner so nothing goes to waste.';
    }
    if (/utang|debt/.test(question)) {
        return 'Managing utang wisely:\n• List all debts with amounts and due dates — visibility first.\n• Pay high-interest debts first (5-6 loans are the most expensive).\n• Avoid borrowing for daily food — shrink the food budget instead using tipid meals like monggo, tortang talong, and sardines-based dishes.\n• Once a debt is cleared, redirect that payment amount into ipon.';
    }

    const perMeal = budget > 0 ? budget / 21 : 0;
    const budgetCategory = perMeal > 0 ? (perMeal < 80 ? 'tight' : perMeal < 140 ? 'moderate' : 'comfortable') : 'unset';
    const groceryTotal = groceryItems.reduce((acc, i) => acc + ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 0)), 0);
    const planStatus = hasActiveMealPlan() ? 'You have a plan; compare it against your grocery list to decide where to swap or simplify.' : 'No plan loaded yet; generating one will help me give more accurate budget advice.';
    const tips = [];

    if (budgetCategory === 'tight') {
        tips.push('Your budget is tight. Favor soups, vegetable stir-fries, and egg-based dishes like Tortang Talong or Ginisang Munggo.');
    } else if (budgetCategory === 'moderate') {
        tips.push('Your budget is moderate. Mix affordable meals with one or two protein-rich options like Adobo or Sinigang.');
    } else if (budgetCategory === 'comfortable') {
        tips.push('Your budget is comfortable. You can include more fish and chicken while still balancing with vegetables and rice.');
    } else {
        tips.push('Set your weekly budget and family size to get an exact per-meal cost estimate.');
    }

    const groceryAnalysis = groceryTotal > 0 ? `Current grocery total is ₱${groceryTotal.toFixed(0)}.` : 'Your grocery list is empty.';
    if (budget > 0 && groceryTotal > budget) {
        tips.push('Your grocery list exceeds your budget. Swap premium proteins for cheaper local fish or eggs, and buy vegetables that are in season.');
    } else if (groceryTotal > 0) {
        tips.push('Your grocery list is in a safer range, but keep an eye on expensive items and avoid overbuying perishable goods.');
    }

    if (diet === 'tipid') {
        tips.push('For tipid mode, choose more vegetable stews, sardines, tokwa, and itlog to stretch your budget.');
    }

    return [planStatus, groceryAnalysis, ...tips].filter(Boolean).join(' ');
}

function respondToGroceryQuery(question, budget, pax, diet, groceryItems) {
    const lower = question;
    const groceryTotal = groceryItems.reduce((acc, i) => acc + ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 0)), 0);
    const analysis = analyzeGroceryList(groceryItems, budget);

    if (groceryItems.length === 0) {
        return 'Your grocery list is empty. Start with rice, eggs, local vegetables, onions, garlic, and a protein such as chicken, fish, or tofu. I can suggest a weekly ingredients list.';
    }

    if (lower.includes('swap') || lower.includes('substitute') || lower.includes('replace')) {
        const expensive = findExpensiveItems(groceryItems, budget);
        const swaps = groceryItems.map(item => suggestGrocerySwap(item.name)).filter(Boolean);
        return `${analysis} ${expensive.length ? `High-cost items include ${expensive.join(', ')}.` : ''} ${swaps.length ? `Try swaps like ${[...new Set(swaps)].join('; ')}.` : 'You are already keeping your list fairly balanced.'}`;
    }

    if (lower.includes('cheap') || lower.includes('save') || lower.includes('budget')) {
        const swaps = groceryItems.map(item => suggestGrocerySwap(item.name)).filter(Boolean);
        return `${analysis} ${swaps.length ? `For cheaper options, ${[...new Set(swaps)].join('; ')}.` : 'Consider buying more rice, eggs, and local vegetables to reduce cost.'}`;
    }

    if (lower.includes('what') && lower.includes('buy')) {
        const stapleHints = suggestStapleGroceryItems(groceryItems);
        return `${analysis} ${stapleHints}`;
    }

    return `${analysis} If you want, I can suggest a balanced grocery list for a Filipino weekly menu based on your budget.`;
}

function analyzeGroceryList(groceryItems, budget) {
    if (groceryItems.length === 0) return 'Your grocery list is empty.';

    const total = groceryItems.reduce((acc, i) => acc + ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 0)), 0);
    const categories = [...new Set(groceryItems.map(item => item.category.toLowerCase()))];
    const staples = findMissingStaples(groceryItems);
    const expensive = findExpensiveItems(groceryItems, budget);
    const warning = budget > 0 && total > budget ? ' Your list is over budget.' : '';
    const staplesHint = staples.length ? `Missing staples include ${staples.join(', ')}.` : 'You have the essential staples covered.';
    const expensiveHint = expensive.length ? ` High-cost items include ${expensive.join(', ')}.` : '';

    return `You have ${groceryItems.length} items in ${categories.length} categories totaling ₱${total.toFixed(0)}.${warning} ${staplesHint}${expensiveHint}`;
}

function findMissingStaples(groceryItems) {
    const names = groceryItems.map(item => item.name.toLowerCase());
    const staples = [];
    if (!names.some(name => name.includes('rice'))) staples.push('rice');
    if (!names.some(name => name.includes('egg'))) staples.push('eggs');
    if (!names.some(name => name.includes('onion'))) staples.push('onion');
    if (!names.some(name => name.includes('garlic'))) staples.push('garlic');
    if (!names.some(name => name.includes('tomato') || name.includes('talong') || name.includes('pechay') || name.includes('vegetable'))) staples.push('local vegetables');
    return staples;
}

function suggestStapleGroceryItems(groceryItems) {
    const missing = findMissingStaples(groceryItems);
    if (missing.length === 0) {
        return 'You have most staple items covered. Add seasonal vegetables and a protein source for better balance.';
    }
    return `You may want to buy ${missing.join(', ')} as staples for Filipino meal preparation.`;
}

function suggestGrocerySwap(itemName) {
    const text = itemName.toLowerCase();
    if (text.includes('beef')) return 'swap beef for chicken or bangus';
    if (text.includes('pork')) return 'swap some pork for tokwa or eggs';
    if (text.includes('chicken')) return 'try tilapia or bangus as a cheaper protein alternative';
    if (text.includes('fish') || text.includes('bangus') || text.includes('tilapia')) return 'choose cheaper local fish or use frozen options';
    if (text.includes('shrimp') || text.includes('seafood')) return 'reduce seafood to one meal and use eggs or tofu on other days';
    if (text.includes('cheese') || text.includes('cream') || text.includes('butter')) return 'replace dairy with eggs, coconut milk, or vegetable-rich sauces';
    if (text.includes('bread') || text.includes('pan de sal')) return 'use rice and local vegetables to stretch meals further';
    return null;
}

function hasActiveMealPlan() {
    return DAYS_OF_WEEK.some(day => {
        const plan = currentMealPlan[day];
        return plan && (plan.Breakfast || plan.Lunch || plan.Dinner);
    });
}

function clearAIChatHistory() {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;
    chatHistory.innerHTML = '';
}

// ==========================================
// 8. DATA EXPEDITION DATA TRANSFER CAPABILITIES
// ==========================================

document.getElementById('exportCsvBtn').addEventListener('click', function() {
    const items = getGroceryData();
    if (items.length === 0) return alert('No valid list items arrays are tracked to backup via CSV transfer maps.');

    let csvContent = "data:text/csv;charset=utf-8,Category,Item Name,Quantity,Unit Price,Subtotal\n";
    
    items.forEach(i => {
        const rowString = `"${i.category}","${i.name}",${i.quantity},${i.price},${(i.price * i.quantity).toFixed(2)}`;
        csvContent += rowString + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `PalengkeHelper_Backup_2026.csv`);
    document.body.appendChild(downloadAnchor);
    
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
});
