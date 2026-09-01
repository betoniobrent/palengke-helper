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

// Palengke AI backend thread ID (preserves conversation)
let palengkeAIThreadId = localStorage.getItem('palengke_ai_thread') || '';

// Set this to your deployed Bo Sar backend URL (Replit, Render, etc.)
const BO_SAR_BACKEND_URL = 'https://palengke-helper-gemini.onrender.com';

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-medium max-w-md transition-all duration-300 transform translate-x-full`;
    
    // Set color based on type
    if (type === 'success') {
        notification.classList.add('bg-emerald-600');
    } else if (type === 'error') {
        notification.classList.add('bg-rose-600');
    } else {
        notification.classList.add('bg-blue-600');
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

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
    
    // Only show customize actions if in customize mode
    if (actions) {
        if (window.isGenerateMode === false) {
            actions.classList.remove('hidden');
        } else {
            actions.classList.add('hidden');
        }
    }
    
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
    // Set flag for customize mode
    window.isGenerateMode = false;
    
    initializeMealPlanner();
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

        const summaryPax = parseInt(document.getElementById('plannerPax')?.value, 10) || 0;
        const meals = ['Breakfast', 'Lunch', 'Dinner'].map(type => dayPlan[type]).filter(Boolean);
        const dayCost = meals.reduce((sum, meal) => sum + calculateRecipeCostFromMarket(meal, summaryPax), 0);
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

    filteredRecipes.forEach(recipe => {
        container.innerHTML += `
            <div
                class="bg-white border rounded-xl p-5 hover:shadow cursor-pointer transition"
                data-recipe-id="${recipe.id}"
                onclick="selectRecipe(${recipe.id})">
                <h4 class="font-bold text-lg text-gray-800 mb-1">${recipe.name}</h4>
                <p class="text-emerald-600 font-semibold mb-2">₱${recipe.estimatedCost}</p>
                <p class="text-sm text-gray-500 mb-1">${recipe.servings} pax · ${recipe.difficulty} · ${recipe.prepTime} prep / ${recipe.cookTime} cook</p>
                <p class="text-xs text-gray-400 mt-1">${(recipe.ingredients || []).slice(0, 4).join(', ')}${(recipe.ingredients || []).length > 4 ? '...' : ''}</p>
                <p class="text-xs text-emerald-600 mt-2 font-medium uppercase tracking-wide">${recipe.mealType.join(' · ')}</p>
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

async function getMealPlans(){
    const session = JSON.parse(localStorage.getItem('palengke_session') || '{}');
    
    // If authenticated user, fetch from Supabase
    if (session.role === 'member' && session.supabaseUserId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_meal_plans')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // Transform Supabase data to match localStorage format
            return data.map(plan => ({
                id: plan.id,
                name: plan.plan_name,
                createdAt: new Date(plan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                plan: plan.weekly_plan,
                budget: plan.target_budget,
                pax: plan.target_pax,
                diet: plan.diet_preference
            }));
        } catch (err) {
            console.error('Error fetching meal plans from Supabase:', err);
            // Fallback to localStorage on error
            return JSON.parse(localStorage.getItem('palengke_saved_meal_plans')) || [];
        }
    }
    
    // Guest user - use localStorage
    return JSON.parse(localStorage.getItem('palengke_saved_meal_plans')) || [];
}

async function setMealPlans(plans){
    const session = JSON.parse(localStorage.getItem('palengke_session') || '{}');
    
    // If authenticated user, sync to Supabase
    if (session.role === 'member' && session.supabaseUserId) {
        try {
            // This is a simplified sync - in production, you'd want more sophisticated conflict resolution
            // For now, we'll just update localStorage as backup
            localStorage.setItem('palengke_saved_meal_plans', JSON.stringify(plans));
        } catch (err) {
            console.error('Error syncing meal plans to Supabase:', err);
        }
    }
    
    // Always update localStorage as backup
    localStorage.setItem('palengke_saved_meal_plans', JSON.stringify(plans));
}

async function saveCurrentMealPlan(){
    console.log('saveCurrentMealPlan called');
    const nameInput = document.getElementById('mealPlanNameInput');
    const defaultName = 'Weekly Meal Plan';
    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : defaultName;

    const session = JSON.parse(localStorage.getItem('palengke_session') || '{}');
    console.log('Session:', session);
    
    // Calculate total cost
    let totalCost = 0;
    Object.values(currentMealPlan).forEach(dayPlan => {
        if (dayPlan) {
            Object.values(dayPlan).forEach(meal => {
                if (meal && meal.estimatedCost) {
                    totalCost += meal.estimatedCost;
                }
            });
        }
    });
    console.log('Total cost:', totalCost);
    console.log('Current meal plan:', currentMealPlan);

    // If authenticated user, save to Supabase
    if (session.role === 'member' && session.supabaseUserId) {
        console.log('Attempting to save to Supabase');
        console.log('Supabase client:', supabaseClient);
        try {
            const { data, error } = await supabaseClient
                .from('user_meal_plans')
                .insert({
                    user_id: session.supabaseUserId,
                    plan_name: name,
                    weekly_plan: currentMealPlan,
                    target_budget: parseFloat(document.getElementById('plannerBudget').value) || 0,
                    target_pax: parseInt(document.getElementById('plannerPax').value) || 4,
                    total_cost: totalCost,
                    diet_preference: document.getElementById('plannerDiet').value || 'anything'
                })
                .select();
            
            console.log('Supabase response:', { data, error });
            
            if (error) throw error;
            
            renderSavedMealPlans();
            showNotification('Meal plan saved successfully to your account.', 'success');
            return;
        } catch (err) {
            console.error('Error saving meal plan to Supabase:', err);
            // Fallback to localStorage on error
        }
    }

    // Guest user or fallback - save to localStorage
    console.log('Saving to localStorage');
    const mealPlans = await getMealPlans();
    mealPlans.unshift({
        id: 'meal_plan_' + Date.now(),
        name,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        plan: JSON.parse(JSON.stringify(currentMealPlan)),
        budget: parseFloat(document.getElementById('plannerBudget').value) || 0,
        pax: parseInt(document.getElementById('plannerPax').value) || 4,
        diet: document.getElementById('plannerDiet').value || 'anything'
    });

    await setMealPlans(mealPlans);
    renderSavedMealPlans();
    showNotification('Meal plan saved successfully.', 'success');
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

function backToMealPlannerIntro(){
    document.getElementById('mealScheduleWrapper').classList.add('hidden');
    document.getElementById('mealPlannerIntro').classList.remove('hidden');
    document.getElementById('mealScheduleActions').classList.add('hidden');
    initializeMealPlanner();
}

async function renderSavedMealPlans(){
    const container = document.getElementById('savedMealPlans');
    if (!container) return;
    const mealPlans = await getMealPlans();
    container.innerHTML = '';

    if (mealPlans.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500 italic col-span-full">No saved meal plans yet.</p>`;
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
}

async function loadMealPlan(id){
    try {
        const mealPlans = await getMealPlans();
        const plan = mealPlans.find(item => item.id === id);
        if (!plan) {
            showNotification('Saved meal plan not found.', 'error');
            return;
        }

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
        showNotification('Loaded saved meal plan.', 'success');
    } catch (error) {
        console.error('Error loading meal plan:', error);
        showNotification('There was an error loading the saved meal plan. Please try again.', 'error');
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

async function deleteMealPlan(id){
    if (!confirm('Delete this saved meal plan?')) return;
    const mealPlans = await getMealPlans();
    const filteredPlans = mealPlans.filter(item => item.id !== id);
    await setMealPlans(filteredPlans);
    renderSavedMealPlans();
    showNotification('Meal plan deleted.', 'success');
}

function showRecipeDetails(recipe){
    const modal = document.getElementById('recipeDetailsModal');
    const content = document.getElementById('recipeDetailsContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">${recipe.name}</h3>
                <p class="text-emerald-700 font-semibold text-lg mb-1">₱${recipe.estimatedCost}</p>
                <p class="text-sm text-gray-600 mb-3">${recipe.servings} pax · ${recipe.difficulty} · ${recipe.prepTime} prep · ${recipe.cookTime} cook</p>
                <p class="text-sm text-gray-600">Base estimate for ${recipe.servings} pax is ₱${recipe.estimatedCost} (₱${(recipe.estimatedCost / recipe.servings).toFixed(2)} per pax).</p>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
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

document.addEventListener('DOMContentLoaded', async function() {
    console.log('App.js loaded');

    // Check for existing session
    const cachedUser = localStorage.getItem('palengke_session');
    console.log('Cached user:', cachedUser);

    const authPage = document.getElementById('authPage');
    const appPage = document.getElementById('appPage');

    console.log('authPage element:', authPage);
    console.log('appPage element:', appPage);

    if (cachedUser) {
        const session = JSON.parse(cachedUser);
        console.log('Session role:', session.role);
        updateAuthNav(session);

        // Restore Supabase session if member
        if (session.role === 'member' && supabaseClient) {
            console.log('Restoring Supabase session...');
            const { data, error } = await supabaseClient.auth.setSession({
                access_token: session.accessToken,
                refresh_token: session.refreshToken
            });
            if (error) {
                console.error('Error restoring Supabase session:', error);
                // If session restore fails, clear and show auth
                localStorage.removeItem('palengke_session');
                location.reload();
            } else {
                console.log('Supabase session restored successfully:', data);
            }
        }

        // Hide auth page
        if (authPage) {
            authPage.style.setProperty('display', 'none', 'important');
            authPage.classList.add('hidden');
            console.log('AuthPage hidden');
        }

        // Show app page - remove Tailwind hidden class and set display
        if (appPage) {
            appPage.classList.remove('hidden');
            appPage.style.setProperty('display', 'block', 'important');
            appPage.style.visibility = 'visible';
            console.log('AppPage display set to block with !important');
            console.log('AppPage computed display:', window.getComputedStyle(appPage).display);
        } else {
            console.error('appPage element not found!');
        }

        // Initialize app functions if they exist
        try {
            if (typeof loadGroceryListFromSupabase === 'function') await loadGroceryListFromSupabase();
            if (typeof initializeBudgetHubEngine === 'function') initializeBudgetHubEngine();
            if (typeof renderGroceryItems === 'function') renderGroceryItems();
            if (typeof renderSavedMealPlans === 'function') renderSavedMealPlans();
            if (typeof calculatePlanMetrics === 'function') calculatePlanMetrics();
            if (typeof hideMealPlannerWrapper === 'function') hideMealPlannerWrapper();
            if (typeof initializeMealPlanner === 'function') initializeMealPlanner();
            // Delay switchTab to ensure DOM is ready
            setTimeout(() => {
                if (typeof switchTab === 'function') {
                    console.log('Calling switchTab(home) after initialization');
                    switchTab('home');
                }
            }, 100);
            console.log('App initialized successfully');
        } catch (err) {
            console.error('Error initializing app:', err);
        }
    } else {
        console.log('No cached user, showing auth page');
        // Ensure auth page is visible
        if (authPage) {
            authPage.style.display = 'flex';
            authPage.classList.remove('hidden');
        }
        if (appPage) {
            appPage.classList.add('hidden');
            appPage.style.display = 'none';
        }
    }

    // Add event listeners for meal planner
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

    if (plannerBudget) {
        plannerBudget.addEventListener('input', calculatePlanMetrics);
        plannerBudget.addEventListener('input', function() {
            this.classList.remove('border-rose-500', 'border-red-500');
            const budgetError = document.getElementById('budgetError');
            if (budgetError) budgetError.classList.add('hidden');
        });
    }
    if (plannerPax) {
        plannerPax.addEventListener('change', calculatePlanMetrics);
        plannerPax.addEventListener('input', function() {
            this.classList.remove('border-rose-500', 'border-red-500');
            const paxError = document.getElementById('paxError');
            if (paxError) paxError.classList.add('hidden');
        });
    }
    if (plannerDiet) plannerDiet.addEventListener('change', calculatePlanMetrics);
    document.querySelectorAll('#budgetPresets .budget-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (plannerBudget) {
                plannerBudget.value = btn.dataset.budget;
                plannerBudget.classList.remove('border-rose-500', 'border-red-500');
                const budgetError = document.getElementById('budgetError');
                if (budgetError) budgetError.classList.add('hidden');
                calculatePlanMetrics();
            }
        });
    });
    if (generateMealPlanBtn) generateMealPlanBtn.addEventListener('click', () => {
        generateFilipinoMealPlan();
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

    const boSarInput = document.getElementById('boSarInput');
    if (boSarInput) {
        boSarInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                processBoSarQuery();
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
});

async function ensureUserProfile(user) {
    if (!user || !user.id) return;
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!data) {
            const { error: insertError } = await supabaseClient.from('profiles').upsert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                age: user.user_metadata?.age || null,
                address: user.user_metadata?.address || '',
                role: user.app_metadata?.role || 'user',
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            if (insertError) console.error('Profile insert error:', insertError);
        }
    } catch (err) {
        console.error('ensureUserProfile error:', err);
    }
}

function loginAsGuest() {
    console.log('loginAsGuest called');
    localStorage.setItem('palengke_session', JSON.stringify({
        user: 'Guest_User',
        role: 'guest'
    }));
    console.log('Session set, reloading...');
    location.reload();
}

async function logout() {
    // Always try to sign out from Supabase and then clear cached session
    try {
        await supabaseClient.auth.signOut();
    } catch (err) {
        console.error('Supabase signout error:', err);
    }

    localStorage.removeItem('palengke_session');
    location.reload();
}

function updateAuthNav(session) {
    const isLoggedIn = session && (session.role === 'member' || session.role === 'admin');
    const loginRegisterDesktop = document.getElementById('navLoginRegisterDesktop');
    const accountDesktop = document.getElementById('navAccountDesktop');
    const loginRegisterMobile = document.getElementById('navLoginRegisterMobile');
    const accountMobile = document.getElementById('navAccountMobile');
    if (loginRegisterDesktop) loginRegisterDesktop.classList.toggle('hidden', isLoggedIn);
    if (accountDesktop) accountDesktop.classList.toggle('hidden', !isLoggedIn);
    if (loginRegisterMobile) loginRegisterMobile.classList.toggle('hidden', isLoggedIn);
    if (accountMobile) accountMobile.classList.toggle('hidden', !isLoggedIn);
}

function hideAuthBoxes() {
    ['loginBox', 'registerBox', 'forgotPasswordBox', 'resetPasswordBox'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function showRegister() {
    hideAuthBoxes();
    const registerBox = document.getElementById('registerBox');
    if (registerBox) registerBox.style.display = 'block';
}

function showForgotPassword() {
    hideAuthBoxes();
    const forgotPasswordBox = document.getElementById('forgotPasswordBox');
    if (forgotPasswordBox) forgotPasswordBox.style.display = 'block';
}

function showResetPassword() {
    hideAuthBoxes();
    const resetPasswordBox = document.getElementById('resetPasswordBox');
    if (resetPasswordBox) resetPasswordBox.style.display = 'block';
}

function showLogin() {
    hideAuthBoxes();
    const loginBox = document.getElementById('loginBox');
    if (loginBox) loginBox.style.display = 'block';
}

async function sendPasswordReset() {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href.split('#')[0]
        });
        if (error) {
            showNotification('Error sending reset link: ' + error.message, 'error');
            return;
        }
        showNotification('Password reset link sent. Check your email.', 'success');
        document.getElementById('forgotEmail').value = '';
    } catch (err) {
        showNotification('An unexpected error occurred.', 'error');
        console.error(err);
    }
}

async function updatePassword() {
    const newPassword = document.getElementById('newPassword').value.trim();
    if (!newPassword || newPassword.length < 6) {
        showNotification('Password must be at least 6 characters.', 'error');
        return;
    }
    try {
        const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
        if (error) {
            showNotification('Error updating password: ' + error.message, 'error');
            return;
        }
        showNotification('Password updated successfully. Please log in.', 'success');
        setTimeout(() => {
            localStorage.removeItem('palengke_session');
            location.reload();
        }, 1500);
    } catch (err) {
        showNotification('An unexpected error occurred.', 'error');
        console.error(err);
    }
}

// Supabase-based registration using email & password
async function registerWithEmail() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const age = document.getElementById('age')?.value ? parseInt(document.getElementById('age').value) : null;
    const address = document.getElementById('address')?.value?.trim() || '';

    if (!email || !password) {
        showNotification('Please enter both email and password.', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullname,
                    age: age,
                    address: address
                }
            }
        });

        if (error) {
            showNotification('Registration error: ' + error.message, 'error');
            return;
        }

        // If email confirmation is enabled, show message
        if (data.user && !data.session) {
            showNotification('Registration successful! Please check your email to confirm your account.', 'success');
            showLogin();
        } else if (data.session) {
            // Auto-login if email confirmation is disabled
            await ensureUserProfile(data.user);
            localStorage.setItem('palengke_session', JSON.stringify({
                user: email,
                email: email,
                full_name: fullname,
                address: address,
                role: 'member',
                supabaseUserId: data.user.id,
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token
            }));
            location.reload();
        }
    } catch (err) {
        showNotification('An unexpected error occurred during registration.', 'error');
        console.error(err);
    }
}

// Supabase-based login using email & password
async function loginWithEmail() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showNotification('Please enter both email and password.', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            showNotification('Login error: ' + error.message, 'error');
            return;
        }

        await ensureUserProfile(data.user);
        localStorage.setItem('palengke_session', JSON.stringify({
            user: email,
            email: email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            address: data.user.user_metadata?.address || '',
            role: 'member',
            supabaseUserId: data.user.id,
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token
        }));
        location.reload();
    } catch (err) {
        showNotification('An unexpected error occurred during login.', 'error');
        console.error(err);
    }
}

// Google OAuth login/registration
async function loginWithGoogle() {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href.split('#')[0],
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        if (error) {
            showNotification('Google login error: ' + error.message, 'error');
            return;
        }

        // Supabase will handle the redirect and callback
        // The session will be set automatically after redirect
    } catch (err) {
        showNotification('An unexpected error occurred during Google login.', 'error');
        console.error(err);
    }
}

// Handle OAuth callback
async function handleOAuthCallback() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    if (error) {
        showNotification('OAuth error: ' + (errorDescription || error), 'error');
        return;
    }

    if (accessToken && refreshToken) {
        try {
            const { data, error } = await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            if (error) throw error;

            if (data.session) {
                await ensureUserProfile(data.session.user);
                localStorage.setItem('palengke_session', JSON.stringify({
                    user: data.session.user.email,
                    email: data.session.user.email,
                    full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
                    address: data.session.user.user_metadata?.address || '',
                    role: 'member',
                    supabaseUserId: data.session.user.id,
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token
                }));
                // Clear URL hash
                window.location.hash = '';
                location.reload();
            }
        } catch (err) {
            showNotification('Error handling OAuth callback: ' + (err.message || 'unknown'), 'error');
            console.error('OAuth callback error:', err);
        }
    }
}

// Check for OAuth callback or password recovery on page load
window.addEventListener('load', () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    if (type === 'recovery') {
        showResetPassword();
        return;
    }
    if (window.location.hash && window.location.hash.includes('access_token')) {
        handleOAuthCallback();
    }
});

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

    // Calculate total estimated cost of current meal plan using live market prices
    let totalEstimatedCost = 0;
    if (currentMealPlan && typeof currentMealPlan === 'object') {
        Object.values(currentMealPlan).forEach(dayPlan => {
            if (!dayPlan) return;
            ['Breakfast', 'Lunch', 'Dinner'].forEach(mealType => {
                const meal = dayPlan[mealType];
                if (meal) {
                    totalEstimatedCost += calculateRecipeCostFromMarket(meal, rawPax);
                }
            });
        });
    }
    const remainingBudget = rawBudget - totalEstimatedCost;

    const calcPerMealEl = document.getElementById('calcPerMeal');
    const calcPerPaxEl = document.getElementById('calcPerPax');
    if (calcPerMealEl) calcPerMealEl.innerText = `₱${costPerMeal.toFixed(2)}`;
    if (calcPerPaxEl) calcPerPaxEl.innerText = `₱${costPerPaxDay.toFixed(2)} / day`;

    // Update totals if elements exist
    const totalCostEl = document.getElementById('planTotalEstimatedCost');
    const remainingEl = document.getElementById('planRemainingBudget');
    if (totalCostEl) totalCostEl.innerText = `₱${totalEstimatedCost.toFixed(2)}`;
    if (remainingEl) remainingEl.innerText = `₱${remainingBudget.toFixed(2)}`;
}

function generateFilipinoMealPlan() {
    const budgetInput = document.getElementById('plannerBudget');
    const paxInput = document.getElementById('plannerPax');
    const budgetError = document.getElementById('budgetError');
    const paxError = document.getElementById('paxError');
    const budgetValue = budgetInput.value.trim();
    const paxValue = paxInput.value.trim();
    
    // Clear previous validation styles and error messages
    budgetInput.classList.remove('border-rose-500', 'border-red-500');
    paxInput.classList.remove('border-rose-500', 'border-red-500');
    if (budgetError) budgetError.classList.add('hidden');
    if (paxError) paxError.classList.add('hidden');
    
    // Validate inputs
    let hasError = false;
    
    if (!budgetValue) {
        budgetInput.classList.add('border-rose-500');
        if (budgetError) budgetError.classList.remove('hidden');
        hasError = true;
    }
    
    if (!paxValue) {
        paxInput.classList.add('border-rose-500');
        if (paxError) paxError.classList.remove('hidden');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }

    const targetWeekBudget = parseFloat(budgetValue);
    const targetPaxCount = parseInt(paxValue, 10);

    if (isNaN(targetWeekBudget) || targetWeekBudget <= 0) {
        budgetInput.classList.add('border-rose-500');
        if (budgetError) {
            budgetError.textContent = 'Budget must be greater than 0';
            budgetError.classList.remove('hidden');
        }
        return;
    }
    
    if (isNaN(targetPaxCount) || targetPaxCount <= 0) {
        paxInput.classList.add('border-rose-500');
        if (paxError) {
            paxError.textContent = 'Family members must be greater than 0';
            paxError.classList.remove('hidden');
        }
        return;
    }

    initializeMealPlanner();
    showMealPlannerWrapper();
    enterMealScheduleFlow();
    
    // Set flag for generate mode
    window.isGenerateMode = true;

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
            // Use market-based pricing for accurate cost calculation, scaled for target pax
            const marketBasedCost = calculateRecipeCostFromMarket(recipe, targetPaxCount);
            const perServingCost = marketBasedCost / Math.max(targetPaxCount, 1);
            // Going over budget is penalized much more than staying under it
            const costDistance = perServingCost > budgetPerServing
                ? (perServingCost - budgetPerServing) * 3.5
                : (budgetPerServing - perServingCost);
            const servingDistance = Math.abs(recipe.servings - targetPaxCount);
            return {
                recipe,
                perServingCost,
                marketBasedCost,
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

        totalPlanCostAccumulator +=
            calculateRecipeCostFromMarket(bMeal, targetPaxCount) +
            calculateRecipeCostFromMarket(lMeal, targetPaxCount) +
            calculateRecipeCostFromMarket(dMeal, targetPaxCount);
    });

    // Repair pass: while the plan exceeds the budget, swap the most
    // expensive meals for the cheapest same-type alternatives
    if (totalPlanCostAccumulator > targetWeekBudget) {
        const optionsByType = {
            Breakfast: breakfastOptions,
            Lunch: lunchOptions,
            Dinner: dinnerOptions
        };
        const cheapestByType = {};
        Object.entries(optionsByType).forEach(([type, opts]) => {
            cheapestByType[type] = opts
                .map(recipe => ({ recipe, cost: calculateRecipeCostFromMarket(recipe, targetPaxCount) }))
                .sort((a, b) => a.cost - b.cost);
        });

        const slots = [];
        daysOfWeek.forEach(day => {
            ["Breakfast", "Lunch", "Dinner"].forEach(type => {
                slots.push({ day, type, cost: calculateRecipeCostFromMarket(currentMealPlan[day][type], targetPaxCount) });
            });
        });
        slots.sort((a, b) => b.cost - a.cost);

        for (const slot of slots) {
            if (totalPlanCostAccumulator <= targetWeekBudget) break;
            const dayIds = new Set(["Breakfast", "Lunch", "Dinner"].map(t => currentMealPlan[slot.day][t].id));
            const candidate = (cheapestByType[slot.type] || []).find(c => !dayIds.has(c.recipe.id) && c.cost < slot.cost);
            if (candidate) {
                totalPlanCostAccumulator -= slot.cost - candidate.cost;
                currentMealPlan[slot.day][slot.type] = candidate.recipe;
            }
        }
    }

    daysOfWeek.forEach(day => {
        const bMeal = currentMealPlan[day].Breakfast;
        const lMeal = currentMealPlan[day].Lunch;
        const dMeal = currentMealPlan[day].Dinner;

        // Use market-based pricing scaled for target pax
        const bCost = calculateRecipeCostFromMarket(bMeal, targetPaxCount);
        const lCost = calculateRecipeCostFromMarket(lMeal, targetPaxCount);
        const dCost = calculateRecipeCostFromMarket(dMeal, targetPaxCount);
        const dayCost = bCost + lCost + dCost;

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
    
    // Show save button for generate mode
    const saveButton = document.getElementById('saveMealPlanBtn');
    if (saveButton) {
        saveButton.classList.remove('hidden');
        console.log('Save button shown');
    } else {
        console.log('Save button not found');
    }
    
    const summaryWarning = document.getElementById('plannerSummaryWarning');
    if (summaryWarning) {
        if (totalPlanCostAccumulator > targetWeekBudget) {
            const avgDayCost = totalPlanCostAccumulator / 7;
            const daysCovered = Math.max(1, Math.floor(targetWeekBudget / avgDayCost));
            summaryWarning.innerText =
                `Heads up: even the cheapest 7-day plan for ${targetPaxCount} pax costs about ₱${totalPlanCostAccumulator.toFixed(0)} ` +
                `(₱${avgDayCost.toFixed(0)}/day). Your ₱${targetWeekBudget} budget fits about ${daysCovered} day${daysCovered === 1 ? '' : 's'} of this plan — ` +
                `we still generated the full week so you can pick which days to follow.`;
        } else {
            summaryWarning.innerText = `Great — this plan fits your ₱${targetWeekBudget} weekly budget for ${targetPaxCount} pax (est. ₱${totalPlanCostAccumulator.toFixed(0)}).`;
        }
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

function getItemUnitPrice(item) {
    const basePrice = parseFloat(item.basePrice !== undefined ? item.basePrice : item.price) || 0;
    const piecesPerKg = parseFloat(item.piecesPerKg) || 0;
    const unit = (item.unit || '').toString().toLowerCase();
    const isPiece = unit === 'pc' || unit === 'piece' || unit === 'pcs';
    if (isPiece && piecesPerKg > 0 && basePrice > 0) {
        return basePrice / piecesPerKg;
    }
    return basePrice;
}

async function saveGroceryListToSupabase() {
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) return;

        const items = getGroceryData();
        const totalCost = items.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);

        const { error } = await supabaseClient
            .from('user_grocery_lists')
            .upsert({
                user_id: user.id,
                list_name: 'Default List',
                items: items,
                total_cost: totalCost
            }, { onConflict: 'user_id,list_name' });

        if (error) console.error('Supabase grocery save error:', error);
    } catch (err) {
        console.error('saveGroceryListToSupabase error:', err);
    }
}

async function loadGroceryListFromSupabase() {
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) return;

        const { data, error } = await supabaseClient
            .from('user_grocery_lists')
            .select('items')
            .eq('user_id', user.id)
            .eq('list_name', 'Default List')
            .single();

        if (error) throw error;
        if (data && Array.isArray(data.items)) {
            setGroceryData(data.items);
            renderGroceryItems();
        }
    } catch (err) {
        console.warn('Supabase grocery load error:', err);
    }
}

function renderGroceryItems(filteredItems = null) {
    const cartContainer = document.getElementById('groceryCartItems');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    const items = filteredItems || getGroceryData();
    let totalCost = 0;

    items.forEach((item, index) => {
        const subtotal = getItemUnitPrice(item) * item.quantity;
        totalCost += subtotal;
        const isChecked = item.checked || false;

        const card = document.createElement('div');
        card.className = `bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition ${isChecked ? 'bg-emerald-50 border-emerald-300' : 'border-gray-200'}`;
        card.innerHTML = `
            <div class="flex items-start gap-3">
                <input type="checkbox" id="check-${index}" ${isChecked ? 'checked' : ''} onchange="toggleGroceryItemCheck(${index})" class="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                <div class='flex-1'>
                    <div class='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2'>
                        <div>
                            <h4 class="font-semibold text-gray-800 ${isChecked ? 'line-through text-gray-500' : ''}">${item.name}</h4>
                            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">${item.category}</span>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-emerald-700">₱${subtotal.toFixed(2)}</p>
                            <p class="text-xs text-gray-500">₱${getItemUnitPrice(item).toFixed(2)}/${item.unit || 'pc'} × ${item.quantity}</p>
                        </div>
                    </div>
                    <div class='flex flex-wrap items-center gap-2 mt-2'>
                        <button onclick="updateGroceryQuantity(${index}, -1)" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition">-</button>
                        <input type="number" step="0.01" min="0.01" value="${item.quantity}" onchange="setGroceryQuantity(${index}, this.value)" class="w-16 text-center font-medium border border-gray-300 rounded p-1 mx-1">
                        <button onclick="updateGroceryQuantity(${index}, 1)" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
                        <button onclick='deleteItem(${index})' class='ml-auto text-rose-600 hover:text-rose-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition'>Delete</button>
                    </div>
                </div>
            </div>
        `;
        cartContainer.appendChild(card);
    });

    updateCartSummary(items);
}

function updateCartSummary(items) {
    const totalCost = items.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);
    const checkedItems = items.filter(i => i.checked);
    const checkedCost = checkedItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);
    const remainingItems = items.filter(i => !i.checked);
    const remainingCost = remainingItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);

    document.getElementById('totalCost').innerText = `₱${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalItems').innerText = items.length;
    document.getElementById('checkedItems').innerText = checkedItems.length;
    document.getElementById('remainingItems').innerText = remainingItems.length;
    document.getElementById('checkedTotal').innerText = `₱${checkedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('remainingTotal').innerText = `₱${remainingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    
    checkGroceryBudgetConstraints(totalCost);
}

function toggleGroceryItemCheck(index) {
    const items = getGroceryData();
    items[index].checked = !items[index].checked;
    setGroceryData(items);
    renderGroceryItems();
    saveGroceryListToSupabase();
}

function updateGroceryQuantity(index, change) {
    const items = getGroceryData();
    const unit = (items[index].unit || '').toString().toLowerCase();
    const step = unit === 'kg' ? 0.5 : 1;
    const min = unit === 'kg' ? 0.5 : 1;
    const current = parseFloat(items[index].quantity) || 0;
    const newQuantity = Math.max(min, current + (step * Math.sign(change)));
    items[index].quantity = newQuantity;
    setGroceryData(items);
    renderGroceryItems();
    saveGroceryListToSupabase();
}

function setGroceryQuantity(index, value) {
    const items = getGroceryData();
    const quantity = parseFloat(value);
    if (isNaN(quantity) || quantity <= 0) {
        showNotification('Quantity must be a positive number.', 'error');
        renderGroceryItems();
        return;
    }
    items[index].quantity = quantity;
    setGroceryData(items);
    renderGroceryItems();
    saveGroceryListToSupabase();
}

function clearBoughtItems() {
    const items = getGroceryData();
    const boughtItems = items.filter(i => i.checked);
    
    if (boughtItems.length === 0) {
        showNotification('No bought items to clear', 'error');
        return;
    }
    
    // Remove bought items from list
    const remainingItems = items.filter(i => !i.checked);
    setGroceryData(remainingItems);
    renderGroceryItems();
    saveGroceryListToSupabase();
    showNotification(`Cleared ${boughtItems.length} bought items`, 'success');
}

function clearAllGroceryItems() {
    if (confirm('Are you sure you want to clear all grocery items?')) {
        setGroceryData([]);
        renderGroceryItems();
        saveGroceryListToSupabase();
        showNotification('All grocery items cleared', 'success');
    }
}

function addItem() {
    const nameEl = document.getElementById('itemName');
    const name = nameEl.value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const quantity = parseFloat(document.getElementById('itemQuantity').value);
    const unit = document.getElementById('itemUnit').value.trim() || 'pc';
    const category = document.getElementById('itemCategory').value;

    if (!name || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        showNotification('Please fill out all fields with valid numbers', 'error');
        return;
    }

    const basePrice = parseFloat(nameEl.dataset.basePrice) || price;
    const piecesPerKg = parseFloat(nameEl.dataset.piecesPerKg) || null;

    const items = getGroceryData();
    items.push({ name, price, quantity, unit, category, checked: false, basePrice, piecesPerKg });
    setGroceryData(items);

    // Clear dynamic operational field nodes
    nameEl.value = '';
    delete nameEl.dataset.basePrice;
    delete nameEl.dataset.piecesPerKg;
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemQuantity').value = '1';
    document.getElementById('itemUnit').value = '';

    // Clear search and show all items
    document.getElementById('grocerySearchInput').value = '';
    document.getElementById('marketPriceSuggestions').classList.add('hidden');
    
    renderGroceryItems();
    saveGroceryListToSupabase();
    showNotification('Item added to list', 'success');
}

function deleteItem(index) {
    const items = getGroceryData();
    items.splice(index, 1);
    setGroceryData(items);
    renderGroceryItems();
    saveGroceryListToSupabase();
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
    
    // Always update summary with ALL items, not filtered
    updateCartSummary(items);
}

// Search with market price integration (reads from Supabase ALL_PRICE_ITEMS)
function searchGroceryItemsWithMarket() {
    const query = document.getElementById('grocerySearchInput').value.toLowerCase().trim();
    const suggestionsDiv = document.getElementById('marketPriceSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');

    if (!query || query.length < 2) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    // Search in live Supabase market price data
    const matches = (ALL_PRICE_ITEMS || []).filter(item =>
        item.item_name?.toLowerCase().includes(query) ||
        query.includes(item.item_name?.toLowerCase())
    );

    if (matches.length > 0) {
        suggestionsDiv.classList.remove('hidden');
        suggestionsList.innerHTML = matches.slice(0, 5).map(match => `
            <div class="flex justify-between items-center p-2 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition" onclick="selectMarketItem('${escapeHtml(match.item_name)}', ${match.price_avg || match.price_min || 0}, '${escapeHtml(match.category || '')}', '${escapeHtml(match.unit || '')}')">
                <div>
                    <span class="text-sm text-gray-800 font-medium">${escapeHtml(match.item_name)}</span>
                    <span class="text-xs text-gray-500 ml-1">${escapeHtml(match.category || '')} · ${escapeHtml(match.unit || '')}</span>
                </div>
                <span class="text-sm font-bold text-emerald-700">₱${Number(match.price_avg || match.price_min || 0).toFixed(2)}</span>
            </div>
        `).join('');
    } else {
        suggestionsDiv.classList.add('hidden');
    }

    // Also filter existing grocery items
    searchItems();
}

// Select market price item and populate form
function parsePiecesPerKg(name) {
    if (!name) return 0;
    const rangeMatch = name.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(?:pcs?|pieces?)\s*(?:\/|\\)?\s*(?:per\s*)?kg/i);
    if (rangeMatch) {
        return (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2;
    }
    const singleMatch = name.match(/(\d+(?:\.\d+)?)\s*(?:pcs?|pieces?)\s*(?:\/|\\)?\s*(?:per\s*)?kg/i);
    if (singleMatch) {
        return parseFloat(singleMatch[1]);
    }
    return 0;
}

function selectMarketItem(name, price, category, unit) {
    document.getElementById('itemName').value = name;
    document.getElementById('itemName').dataset.basePrice = price.toFixed(4);
    const piecesPerKg = parsePiecesPerKg(name);
    document.getElementById('itemName').dataset.piecesPerKg = piecesPerKg || '';
    document.getElementById('itemPrice').value = price.toFixed(2);

    const categoryEl = document.getElementById('itemCategory');
    if (categoryEl && category) {
        categoryEl.value = category;
    }

    const unitEl = document.getElementById('itemUnit');
    if (unitEl && unit) {
        unitEl.value = unit;
    }

    document.getElementById('marketPriceSuggestions').classList.add('hidden');
    document.getElementById('itemName').focus();
}

function recalculateGroceryAddPrice() {
    const nameEl = document.getElementById('itemName');
    const priceEl = document.getElementById('itemPrice');
    const unitEl = document.getElementById('itemUnit');
    if (!nameEl || !priceEl || !unitEl) return;
    const basePrice = parseFloat(nameEl.dataset.basePrice) || 0;
    const piecesPerKg = parseFloat(nameEl.dataset.piecesPerKg) || 0;
    const unit = (unitEl.value || '').toString().toLowerCase();
    const isPiece = unit === 'pc' || unit === 'piece' || unit === 'pcs';
    if (basePrice <= 0) return;
    if (isPiece && piecesPerKg > 0) {
        priceEl.value = (basePrice / piecesPerKg).toFixed(2);
    } else {
        priceEl.value = basePrice.toFixed(2);
    }
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
    const totalGroceryCost = groceryItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);

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

async function processAISuggestionQuery() {
    const questionInput = document.getElementById('aiQuestionInput');
    const chatHistory = document.getElementById('aiChatHistory');
    if (!questionInput || !chatHistory) return;

    const question = questionInput.value.trim();
    if (!question) return;

    if (!navigator.onLine) {
        appendChatMessage('ai', 'Palengke AI is unavailable while you are offline. Please connect to the internet to chat.');
        return;
    }

    appendChatMessage('user', question);
    questionInput.value = '';

    const typingId = 'ai-typing-' + Date.now();
    appendChatMessage('ai', '<span id="' + typingId + '">Typing...</span>', true);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const responseText = await generateAIResponse(question);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.parentElement.remove();
        appendChatMessage('ai', responseText);
    } catch (error) {
        console.error('AI response error:', error);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.parentElement.remove();
        appendChatMessage('ai', 'Palengke AI error: ' + (error.message || 'Please try again later.'));
    }

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

function appendChatMessage(sender, text, raw = false) {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;

    if (chatHistory.children.length === 1 && chatHistory.children[0].textContent.includes('Your AI conversation will appear here')) {
        chatHistory.innerHTML = '';
    }

    const message = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const content = raw ? text : formatChatText(text);
    if (sender === 'user') {
        message.className = 'self-end bg-slate-100 border border-slate-200 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-gray-500">You</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${content}</p>`;
    } else {
        message.className = 'self-start bg-emerald-50 border border-emerald-100 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-emerald-700">Palengke AI</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${content}</p>`;
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
    updateAIChatInputState();
    updateAIStatusIndicator();
    updateBoSarStatus();
}

function updateAIChatInputState() {
    const input = document.getElementById('aiQuestionInput');
    const btn = document.getElementById('aiAskBtn');
    if (!input || !btn) return;

    if (!navigator.onLine) {
        input.disabled = true;
        input.placeholder = 'Palengke AI is offline. Connect to the internet to chat.';
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        input.disabled = false;
        input.placeholder = 'Ask about meals, budgeting, palengke, or groceries...';
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// OpenAI API Configuration
const OPENAI_MODEL = 'gpt-4o-mini'; // Cost-effective model with good performance

function getOpenAIApiKey() {
    return localStorage.getItem('palengke_openai_key') || '';
}

function isAIReady() {
    return navigator.onLine && getOpenAIApiKey();
}

function updateAIStatusIndicator() {
    const indicator = document.getElementById('aiStatusIndicator');
    if (!indicator) return;

    if (!navigator.onLine) {
        indicator.textContent = 'offline';
        indicator.className = 'text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600';
    } else {
        indicator.textContent = 'ready';
        indicator.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600';
    }
}

// Bo Sar Method #2 AI (Replit backend + OpenAI Assistants API)
function getBoSarEndpoint() {
    return localStorage.getItem('palengke_bosar_endpoint') || '';
}

function updateBoSarStatus() {
    const status = document.getElementById('boSarStatus');
    if (!status) return;

    const endpoint = getBoSarEndpoint();
    if (!navigator.onLine) {
        status.textContent = 'offline';
        status.className = 'text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600';
    } else if (!endpoint) {
        status.textContent = 'free mode';
        status.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600';
    } else {
        status.textContent = 'ready';
        status.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600';
    }
}

function appendBoSarMessage(sender, text) {
    const chatHistory = document.getElementById('boSarChatHistory');
    if (!chatHistory) return;

    if (chatHistory.children.length === 1 && chatHistory.children[0].textContent.includes("I'm Bo Sar")) {
        chatHistory.innerHTML = '';
    }

    const message = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (sender === 'user') {
        message.className = 'self-end bg-slate-100 border border-slate-200 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-gray-500">You</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${formatChatText(text)}</p>`;
    } else {
        message.className = 'self-start bg-indigo-50 border border-indigo-100 p-4 rounded-3xl text-sm text-gray-800 max-w-[90%]';
        message.innerHTML = `<div class="flex items-center justify-between gap-3"><strong class="text-xs text-indigo-700">Bo Sar</strong><span class="text-[10px] text-gray-400">${time}</span></div><p class="mt-2">${formatChatText(text)}</p>`;
    }
    chatHistory.appendChild(message);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearBoSarChat() {
    const chatHistory = document.getElementById('boSarChatHistory');
    if (!chatHistory) return;
    chatHistory.innerHTML = '<div class="self-start bg-white border border-gray-200 rounded-3xl p-4 text-sm text-gray-500 max-w-[90%]">Hi! I\'m Bo Sar. Ask me about meal planning, palengke shopping, and tipid tips.</div>';
    localStorage.removeItem('palengke_bosar_thread');
}

async function processBoSarQuery() {
    const input = document.getElementById('boSarInput');
    if (!input) return;

    const question = input.value.trim();
    if (!question) return;

    const endpoint = getBoSarEndpoint();
    if (!endpoint) {
        if (!navigator.onLine) {
            appendBoSarMessage('ai', 'Bo Sar AI is unavailable while you are offline. Please connect to the internet.');
            return;
        }

        appendBoSarMessage('user', question);
        input.value = '';

        const typingId = 'bosar-typing-' + Date.now();
        appendBoSarMessage('ai', '<span id="' + typingId + '">Typing...</span>');

        setTimeout(() => {
            const reply = generateAIResponseFallback(question);
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.parentElement.remove();
            appendBoSarMessage('ai', reply);
        }, 500);
        return;
    }

    if (!navigator.onLine) {
        appendBoSarMessage('ai', 'Bo Sar AI is unavailable while you are offline. Please connect to the internet.');
        return;
    }

    appendBoSarMessage('user', question);
    input.value = '';

    const threadId = localStorage.getItem('palengke_bosar_thread') || '';
    const typingId = 'bosar-typing-' + Date.now();
    appendBoSarMessage('ai', '<span id="' + typingId + '">Typing...</span>');

    try {
        const response = await fetch(endpoint.replace(/\/$/, '') + '/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: question, thread_id: threadId })
        });

        const data = await response.json();
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.parentElement.remove();

        if (!response.ok || data.error) {
            appendBoSarMessage('ai', 'Sorry, Bo Sar could not respond: ' + (data.error || 'unknown error'));
            return;
        }

        if (data.thread_id) localStorage.setItem('palengke_bosar_thread', data.thread_id);
        appendBoSarMessage('ai', data.reply || 'No response from Bo Sar.');
    } catch (error) {
        console.error('Bo Sar query error:', error);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.parentElement.remove();
        appendBoSarMessage('ai', 'Sorry, I could not connect to the Bo Sar backend. Please check the Replit URL and try again.');
    }
}

window.addEventListener('online', () => {
    updateAIStatusIndicator();
    updateAIChatInputState();
    updateBoSarStatus();
});
window.addEventListener('offline', () => {
    updateAIStatusIndicator();
    updateAIChatInputState();
});

async function generateAIResponseWithOpenAI(question) {
    if (!navigator.onLine) {
        return 'Palengke AI is unavailable while you are offline. Please connect to the internet to use the AI chat.';
    }

    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
        return 'Please add your OpenAI API key in Account Settings to use Palengke AI. You can get a key from platform.openai.com';
    }

    const budget = parseFloat(document.getElementById('plannerBudget')?.value) || 0;
    const pax = parseInt(document.getElementById('plannerPax')?.value) || 0;
    const selectedDiet = document.getElementById('plannerDiet')?.value || 'anything';
    const groceryItems = getGroceryData();
    
    // Build context from app data
    const mealPlanContext = buildMealPlanContext();
    const marketPriceContext = buildMarketPriceContext();
    const recipeContext = buildRecipeContext();
    
    const systemPrompt = `You are Palengke AI, a helpful assistant for Filipino families planning meals, managing budgets, and shopping at palengke (wet markets). You speak both English and Tagalog naturally.

CURRENT USER CONTEXT:
- Weekly Budget: ₱${budget}
- Family Size: ${pax} people
- Diet Preference: ${selectedDiet}
- Grocery List: ${groceryItems.length} items (total: ₱${groceryItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(0)})

${mealPlanContext}
${marketPriceContext}
${recipeContext}

Your role:
1. Help with Filipino recipes and cooking instructions
2. Provide budget-friendly meal suggestions
3. Give palengke shopping tips and price information
4. Assist with meal planning and grocery list management
5. Answer questions in the language the user uses (English or Tagalog)

Be practical, culturally relevant to Filipino cooking and shopping, and always consider budget constraints. Give specific, actionable advice.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API error:', error);
        return 'Sorry, I could not connect to the AI service. Please check your OpenAI API key or try again later.';
    }
}

function buildMealPlanContext() {
    const hasPlan = DAYS_OF_WEEK.some(day => {
        const plan = currentMealPlan[day];
        return plan && (plan.Breakfast || plan.Lunch || plan.Dinner);
    });
    
    if (!hasPlan) return 'MEAL PLAN: No active meal plan';
    
    let context = 'MEAL PLAN:\n';
    DAYS_OF_WEEK.forEach(day => {
        const plan = currentMealPlan[day];
        if (plan && (plan.Breakfast || plan.Lunch || plan.Dinner)) {
            context += `${day}: `;
            if (plan.Breakfast) context += `Breakfast: ${plan.Breakfast.name} `;
            if (plan.Lunch) context += `Lunch: ${plan.Lunch.name} `;
            if (plan.Dinner) context += `Dinner: ${plan.Dinner.name}`;
            context += '\n';
        }
    });
    return context;
}

function buildMarketPriceContext() {
    const liveItems = (ALL_PRICE_ITEMS || []).length > 0 ? ALL_PRICE_ITEMS : MARKET_PRICE_REFERENCE;
    if (liveItems.length === 0) return 'MARKET PRICES: Not available';

    let context = 'CURRENT MARKET PRICES (latest published from Supabase):\n';
    if (ALL_PRICE_ITEMS && ALL_PRICE_ITEMS.length > 0) {
        ALL_PRICE_ITEMS.slice(0, 20).forEach(item => {
            const avg = item.price_avg || item.price_min || item.price_max || 0;
            context += `- ${item.item_name}: ₱${parseFloat(avg).toFixed(2)}/${item.unit || 'unit'}\n`;
        });
    } else {
        MARKET_PRICE_REFERENCE.slice(0, 10).forEach(item => {
            context += `- ${item.label}: ${item.price}\n`;
        });
    }
    return context;
}

function buildRecipeContext() {
    return `AVAILABLE RECIPES: ${RECIPE_DATABASE.length} Filipino dishes including Adobo, Sinigang, Tinola, etc.`;
}

function generateAIResponseFallback(question) {
    const normalized = question.toLowerCase();
    const budget = parseFloat(document.getElementById('plannerBudget')?.value) || 0;
    const pax = parseInt(document.getElementById('plannerPax')?.value) || 0;
    const selectedDiet = document.getElementById('plannerDiet')?.value || 'anything';
    const groceryItems = getGroceryData();

    // Greetings and small talk (expanded Tagalog support)
    if (/^(hi|hello|hey|yo|kumusta|musta|good\s*(morning|afternoon|evening|day)|magandang\s*(umaga|hapon|gabi|araw))\b/.test(normalized.trim())) {
        return 'Kumusta! I can help you plan meals, stretch your budget, and manage your grocery list.\nTry asking:\n• "Paano magluto ng Chicken Adobo?"\n• "Magkano ang tilapia?"\n• "Paano i-budget ang kinsena?"\n• "Ano ang in season ngayon?"';
    }
    if (/salamat|thank|salamat po|thank you|maraming salamat/.test(normalized)) {
        return 'Walang anuman! Happy to help. Ask me anytime about meals, palengke prices, or budgeting tips.';
    }
    if (/what can you (do|help)|help me|how do you work|anong kaya mo|ano ang kaya mo|paano ka tumulong/.test(normalized)) {
        return 'Here\'s what I can help with:\n• Recipes — "Paano magluto ng Sinigang?" (I know all ' + RECIPE_DATABASE.length + ' dishes in the app)\n• Meal ideas — "Anong murang ulam para sa 4 na tao?"\n• Your meal plan — "Ano ang plano ko para sa Lunes?"\n• Palengke prices — "Magkano ang manok?"\n• Budgeting — "Paano i-budget ang kinsena?", "Ano ang 50/30/20 rule?"\n• Grocery list — "Ano ang dapat bilhin?", "Ano ang pwedeng palitan para makatipid?"\n• Market tips — "Kailan ang best time sa palengke?"\n• Food storage — "Paano panatilihin sariwang gulay?"';
    }

    // How to cook a specific dish (expanded Tagalog)
    if (/how (do|to|can|should).*(cook|make|prepare)|paano.*(lut|gaw|magluto|magprepare)|recipe (for|of|ng)|ingredients (of|for|ng)|steps (for|to)|pano|paano|lutuin|gawin/.test(normalized)) {
        const recipeAnswer = respondToRecipeHowTo(normalized);
        if (recipeAnswer) return recipeAnswer;
    }

    // Palengke price lookups (expanded Tagalog + market data integration)
    if (/magkano|presyo|how much (is|are|does)|price of|cost of|tinda|halaga|sangkat|bayad/.test(normalized)) {
        const priceAnswer = respondToPriceQuery(normalized);
        if (priceAnswer) return priceAnswer;
    }

    // Current meal plan questions (expanded Tagalog)
    if (/\b(my|current|active|this week'?s?) (meal )?plan\b|plan (for|this) (today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|what('s| is) for (today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\b(breakfast|lunch|dinner|meal|ulam)\b.*\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*\b(breakfast|lunch|dinner|ulam)\b|ano ang plano|ano ang ulam|anong ulam|ano ang kakainin/.test(normalized)) {
        return respondToPlanQuery(normalized, budget);
    }

    // Food storage and leftovers (expanded Tagalog)
    if (/leftover|left-over|storage|how (do|to|can) .*(store|keep|preserve)|spoil|panis|freeze|freezer|refrigerat|keep.*fresh|stay.*fresh|natira|tira|panatilihin|sariwa|magburok|maglasap/.test(normalized)) {
        return respondToStorageQuery(normalized);
    }

    // Palengke shopping tips and seasonal produce (expanded Tagalog)
    if (/palengke|wet market|tawad|haggl|in season|seasonal|best time.*(shop|market|buy)|supermarket vs|talipapa|pamilihan|tawaran|diskwento|sale|promos/.test(normalized)) {
        return respondToPalengkeQuery(normalized);
    }

    // Nutrition and healthy eating (expanded Tagalog)
    if (/nutriti|nutrient|vitamin|masustansya|pinggang pinoy|balanced (diet|meal)|healthy eating|protein (source|intake)|malnutri|baon|sustansya|malusog|healthy/.test(normalized)) {
        return respondToNutritionQuery(normalized, budget, pax, selectedDiet);
    }

    if (/\b(?:grocery|list|buy|substitute|swap|ingredient|store|shop|shopping|bilhin|bili|palitan|sukli|ingredients|sangkap)\b/.test(normalized)) {
        return respondToGroceryQuery(normalized, budget, pax, selectedDiet, groceryItems);
    }

    if (/\b(?:budget|save|saving|ipon|cheap|tipid|expensive|cost|afford|spend|expense|tight|kinsena|payday|sweldo|allowance|utang|debt|emergency fund|envelope|50\/30\/20|price|kuripot|matipid|magastos|budgeting)\b/.test(normalized)) {
        return respondToBudgetQuery(normalized, budget, pax, selectedDiet, groceryItems);
    }

    if (/\b(?:breakfast|lunch|dinner|merienda|ulam|silog|recipe|meal|cook|menu|almusal|hapunan|tanghalian|kanin|ulam|pagkain|luto|magluto)\b/.test(normalized)) {
        return respondToMealQuery(normalized, budget, pax, selectedDiet);
    }

    return 'I can help with Filipino meals, budgeting, palengke prices, and grocery planning. Try:\n• "Paano magluto ng Chicken Adobo?"\n• "Magkano ang bangus?"\n• "Paano i-budget ang kinsena?"\n• "Ano ang dapat bilhin ngayong linggo?"\n• "Paano panatilihin sariwang gulay?"';
}

function generateAIResponse(question) {
    return generateAIResponseWithBackend(question);
}

async function generateAIResponseWithBackend(question) {
    if (!navigator.onLine) {
        return 'Palengke AI is unavailable while you are offline. Please connect to the internet to chat.';
    }
    if (BO_SAR_BACKEND_URL.includes('YOUR_BO_SAR_BACKEND_URL')) {
        return 'Palengke AI backend is not configured. The developer needs to set BO_SAR_BACKEND_URL in app.js.';
    }

    const context = [buildMealPlanContext(), buildMarketPriceContext(), buildRecipeContext()].join('\n\n');
    try {
        const response = await fetch(BO_SAR_BACKEND_URL.replace(/\/$/, '') + '/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: question, thread_id: palengkeAIThreadId, context: context })
        });
        const data = await response.json();
        if (!response.ok || data.error) return 'Palengke AI error: ' + (data.error || `HTTP ${response.status}`);
        if (data.thread_id) {
            palengkeAIThreadId = data.thread_id;
            localStorage.setItem('palengke_ai_thread', palengkeAIThreadId);
        }
        return data.reply || 'No response from Palengke AI.';
    } catch (error) {
        console.error('Palengke AI backend error:', error);
        return 'Palengke AI error: ' + (error.message || 'Please try again later.');
    }
}

// ==========================================
// 6b. INGREDIENT PRICE CALCULATION ENGINE
// ==========================================

// Parse ingredient string to extract item name and quantity
const INGREDIENT_UNIT_PATTERN = /(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*(kg|kilos?|grams?|g|cups?|tbsps?|tsps?|ml|liters?|litro|l|pcs?|pieces?|cloves?|heads?|bunch(?:es)?|bundles?|whole|cans?|packs?|trays?)\b/;

const INGREDIENT_UNIT_ALIASES = {
    kilo: 'kg', kilos: 'kg',
    gram: 'g', grams: 'g',
    cups: 'cup',
    tbsps: 'tbsp',
    liter: 'l', liters: 'l',
    pcs: 'pc', piece: 'pc', pieces: 'pc',
    clove: 'cloves',
    head: 'heads',
    bunches: 'bunch',
    bundles: 'bundle',
    cans: 'can',
    packs: 'pack',
    trays: 'tray'
};

function parseIngredient(ingredientStr) {
    const str = ingredientStr.toLowerCase().trim();

    let quantity = 1;
    let unit = 'piece';

    const match = str.match(INGREDIENT_UNIT_PATTERN);
    if (match) {
        quantity = parseFloat(match[1]);
        if (match[2]) quantity = quantity / parseFloat(match[2]);
        unit = INGREDIENT_UNIT_ALIASES[match[3]] || match[3];
    }

    // Extract item name by removing quantity, units, and common words
    let itemName = str
        .replace(new RegExp(INGREDIENT_UNIT_PATTERN.source, 'g'), '')
        .replace(/\d+(?:\.\d+)?/g, '')
        .replace(/\b(of|the|a|an|with|and|or|for|to|in|on|at|by)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    // Map common ingredient variations to standard names
    const ingredientMap = {
        'chicken': 'chicken',
        'pork': 'pork',
        'beef': 'beef',
        'fish': 'fish',
        'bangus': 'bangus',
        'tilapia': 'tilapia',
        'galunggong': 'galunggong',
        'egg': 'egg',
        'itlog': 'egg',
        'rice': 'rice',
        'kanin': 'rice',
        'bigas': 'rice',
        'garlic': 'garlic',
        'bawang': 'garlic',
        'onion': 'onion',
        'sibuyas': 'onion',
        'tomato': 'tomato',
        'kamatis': 'tomato',
        'potato': 'potato',
        'carrot': 'carrot',
        'tofu': 'tokwa',
        'tokwa': 'tokwa',
        'mung beans': 'monggo',
        'monggo': 'monggo',
        'munggo': 'monggo',
        'eggplant': 'talong',
        'talong': 'talong',
        'spinach': 'spinach',
        'kangkong': 'kangkong',
        'pechay': 'pechay',
        'cabbage': 'cabbage',
        'repolyo': 'cabbage',
        'togue': 'togue',
        'bean sprout': 'togue',
        'sardines': 'sardines',
        'sardinas': 'sardines',
        'tuyo': 'tuyo',
        'misua': 'noodles',
        'canton': 'noodles',
        'noodles': 'noodles',
        'bihon': 'bihon',
        'hotdog': 'hotdog',
        'longganisa': 'longganisa',
        'giniling': 'giniling',
        'ground pork': 'giniling',
        'tinapa': 'tinapa',
        'kamote': 'kamote',
        'sweet potato': 'kamote',
        'sayote': 'sayote',
        'sitaw': 'sitaw',
        'string beans': 'sitaw',
        'pandesal': 'pandesal',
        'coffee': 'coffee',
        'kape': 'coffee',
        'corned beef': 'corned beef',
        'squash': 'kalabasa',
        'kalabasa': 'kalabasa',
        'papaya': 'papaya',
        'malunggay': 'malunggay',
        'soy sauce': 'soy sauce',
        'vinegar': 'vinegar',
        'fish sauce': 'fish sauce',
        'patis': 'fish sauce',
        'oil': 'oil',
        'sugar': 'sugar',
        'salt': 'salt',
        'pepper': 'pepper',
        'coconut milk': 'coconut milk',
        'gata': 'coconut milk',
        'milk': 'milk',
    };
    
    // Find best match
    for (const [key, value] of Object.entries(ingredientMap)) {
        if (itemName.includes(key)) {
            itemName = value;
            break;
        }
    }
    
    return { name: itemName, quantity, unit };
}

function findSupabasePriceForIngredient(parsed) {
    if (!ALL_PRICE_ITEMS || ALL_PRICE_ITEMS.length === 0) return null;

    const item = ALL_PRICE_ITEMS.find(p =>
        parsed.name.includes(p.item_name?.toLowerCase()) ||
        p.item_name?.toLowerCase().includes(parsed.name)
    );

    return item ? item.price_avg : null;
}

function findReferencePriceForIngredient(parsed) {
    const marketItem = MARKET_PRICE_REFERENCE.find(item =>
        item.keys.some(key => parsed.name.includes(key) || key.includes(parsed.name))
    );
    if (!marketItem || !marketItem.price) return null;
    return parsePriceValue(marketItem.price);
}

// Get price from market data for an ingredient
function getMarketPriceForIngredient(ingredient) {
    const parsed = parseIngredient(ingredient);
    if (!parsed) return 0;

    // 1. Try Supabase live market prices first
    let unitPrice = findSupabasePriceForIngredient(parsed);
    let source = 'supabase';

    // 2. Fallback to MARKET_PRICE_REFERENCE
    if (!unitPrice) {
        unitPrice = findReferencePriceForIngredient(parsed);
        source = 'reference';
    }

    // 3. Hardcoded fallback estimates
    if (!unitPrice) {
        const fallbackPrices = {
            'chicken': 180, 'pork': 320, 'beef': 420, 'fish': 150,
            'bangus': 190, 'tilapia': 140, 'galunggong': 165, 'egg': 8.5,
            'rice': 52, 'garlic': 140, 'onion': 155, 'tomato': 80,
            'potato': 60, 'carrot': 70, 'tokwa': 15, 'monggo': 90,
            'talong': 90, 'spinach': 25, 'kangkong': 15, 'pechay': 20,
            'cabbage': 60, 'togue': 60, 'sardines': 25, 'tuyo': 8, 'noodles': 15,
            'bihon': 40, 'hotdog': 180, 'longganisa': 220, 'giniling': 320,
            'tinapa': 25, 'kamote': 50, 'sayote': 45, 'sitaw': 80,
            'pandesal': 4, 'coffee': 9, 'corned beef': 40,
            'kalabasa': 50, 'papaya': 40, 'malunggay': 30, 'soy sauce': 35,
            'vinegar': 30, 'fish sauce': 40, 'oil': 80, 'sugar': 60,
            'salt': 25, 'pepper': 200, 'milk': 75, 'coconut milk': 85
        };
        unitPrice = fallbackPrices[parsed.name] || 50;
        source = 'fallback';
    }

    // Adjust for unit
    const unitMultipliers = {
        'kg': 1, 'kilo': 1, 'g': 0.001, 'gram': 0.001,
        'cup': 0.24, 'tbsp': 0.015, 'tsps': 0.005, 'tsp': 0.005,
        'ml': 0.001, 'l': 1, 'pc': 1, 'piece': 1, 'pieces': 1,
        'cloves': 0.02, 'heads': 0.1, 'bunch': 0.2, 'bundle': 0.2,
        'whole': 1, 'can': 1, 'pack': 1, 'packs': 1, 'tray': 1,
        'litro': 1, 'liter': 1
    };

    // Approximate weights for per-piece produce priced per kilo
    const pieceWeightsKg = {
        'onion': 0.1, 'tomato': 0.12, 'carrot': 0.1, 'potato': 0.15,
        'talong': 0.15, 'papaya': 0.5, 'kalabasa': 0.5
    };

    let multiplier = unitMultipliers[parsed.unit] || 1;
    if ((parsed.unit === 'pc' || parsed.unit === 'piece' || parsed.unit === 'whole') && pieceWeightsKg[parsed.name]) {
        multiplier = pieceWeightsKg[parsed.name];
    }
    return unitPrice * parsed.quantity * multiplier;
}

// Calculate recipe cost based on market prices, scaled for target pax
function calculateRecipeCostFromMarket(recipe, pax = 0) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        if (pax) {
            return (recipe.estimatedCost / Math.max(recipe.servings, 1)) * pax;
        }
        return recipe.estimatedCost || 0;
    }

    let baseCost = 0;
    recipe.ingredients.forEach(ingredient => {
        baseCost += getMarketPriceForIngredient(ingredient);
    });

    if (pax > 0) {
        return (baseCost / Math.max(recipe.servings, 1)) * pax;
    }
    return Math.round(baseCost);
}

// ==========================================
// 7b. PALENGKE AI KNOWLEDGE BASE
// ==========================================

// Static fallback reference used if the live DA price feed can't be reached
// (offline, GitHub down, etc). Kept intentionally small and approximate.
const MARKET_PRICE_FALLBACK = [
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

// Common palengke items that the DA Bantay Presyo feed does not cover.
// Prices are typical CALABARZON wet-market retail estimates, used to
// supplement the live feed for recipe costing and the Prices tab.
const LOCAL_SUPPLEMENT_PRICES = [
    { id: 'tokwa', name: 'Tokwa (Tofu)', keys: ['tokwa', 'tofu'], category: 'other food', unit: 'piece', price: 15 },
    { id: 'togue', name: 'Togue (Mung Bean Sprouts)', keys: ['togue', 'bean sprout'], category: 'vegetables', unit: 'kg', price: 60 },
    { id: 'repolyo', name: 'Repolyo (Cabbage)', keys: ['cabbage', 'repolyo'], category: 'vegetables', unit: 'kg', price: 70 },
    { id: 'carrots', name: 'Carrots', keys: ['carrot'], category: 'vegetables', unit: 'kg', price: 90 },
    { id: 'potato', name: 'Potato', keys: ['potato', 'patatas'], category: 'vegetables', unit: 'kg', price: 90 },
    { id: 'sayote', name: 'Sayote', keys: ['sayote', 'chayote'], category: 'vegetables', unit: 'kg', price: 45 },
    { id: 'kangkong', name: 'Kangkong', keys: ['kangkong'], category: 'vegetables', unit: 'kg', price: 60 },
    { id: 'malunggay', name: 'Malunggay', keys: ['malunggay', 'moringa'], category: 'vegetables', unit: 'kg', price: 60 },
    { id: 'sitaw', name: 'Sitaw (String Beans)', keys: ['sitaw', 'string beans'], category: 'vegetables', unit: 'kg', price: 80 },
    { id: 'kamote', name: 'Kamote (Sweet Potato)', keys: ['kamote', 'sweet potato'], category: 'vegetables', unit: 'kg', price: 50 },
    { id: 'ginger', name: 'Luya (Ginger)', keys: ['ginger', 'luya'], category: 'spices', unit: 'kg', price: 120 },
    { id: 'calamansi', name: 'Calamansi', keys: ['calamansi', 'kalamansi'], category: 'fruits', unit: 'kg', price: 80 },
    { id: 'saba', name: 'Saging na Saba', keys: ['saba', 'saging', 'banana'], category: 'fruits', unit: 'kg', price: 60 },
    { id: 'tuyo', name: 'Tuyo (Dried Fish)', keys: ['tuyo', 'dried fish'], category: 'fish', unit: 'piece', price: 8 },
    { id: 'tinapa', name: 'Tinapa (Smoked Fish)', keys: ['tinapa', 'smoked fish'], category: 'fish', unit: 'piece', price: 25 },
    { id: 'instant-noodles', name: 'Instant Pancit Canton', keys: ['instant pancit canton', 'instant noodles', 'canton', 'noodles'], category: 'other food', unit: 'pack', price: 15 },
    { id: 'misua', name: 'Misua Noodles', keys: ['misua'], category: 'other food', unit: 'pack', price: 25 },
    { id: 'bihon', name: 'Bihon Noodles', keys: ['bihon'], category: 'other food', unit: 'pack', price: 40 },
    { id: 'corned-beef', name: 'Corned Beef (Small Can)', keys: ['corned beef'], category: 'other food', unit: 'can', price: 40 },
    { id: 'hotdog', name: 'Hotdog', keys: ['hotdog'], category: 'meat', unit: 'kg', price: 180 },
    { id: 'longganisa', name: 'Longganisa', keys: ['longganisa', 'longganiza'], category: 'meat', unit: 'kg', price: 220 },
    { id: 'giniling', name: 'Pork Giniling (Ground Pork)', keys: ['giniling', 'ground pork'], category: 'meat', unit: 'kg', price: 320 },
    { id: 'pandesal', name: 'Pandesal', keys: ['pandesal'], category: 'other food', unit: 'piece', price: 4 },
    { id: 'coffee-3in1', name: 'Coffee 3-in-1 Sachet', keys: ['coffee', 'kape'], category: 'other food', unit: 'piece', price: 9 },
    { id: 'evap-milk', name: 'Evaporated Milk (Can)', keys: ['evaporated milk', 'milk'], category: 'other food', unit: 'can', price: 40 },
    { id: 'gata', name: 'Gata (Coconut Milk)', keys: ['coconut milk', 'gata'], category: 'other food', unit: 'l', price: 100 },
    { id: 'soy-sauce', name: 'Soy Sauce', keys: ['soy sauce', 'toyo'], category: 'spices', unit: 'l', price: 60 },
    { id: 'vinegar', name: 'Vinegar (Suka)', keys: ['vinegar', 'suka'], category: 'spices', unit: 'l', price: 50 },
    { id: 'fish-sauce', name: 'Patis (Fish Sauce)', keys: ['fish sauce', 'patis'], category: 'spices', unit: 'l', price: 80 },
    { id: 'salt', name: 'Salt (Asin)', keys: ['salt', 'asin'], category: 'spices', unit: 'kg', price: 25 },
    { id: 'tablea', name: 'Tablea (Cacao)', keys: ['tablea'], category: 'other food', unit: 'pack', price: 60 }
].map(item => ({
    ...item,
    item_name: item.name,
    price_min: null,
    price_max: null,
    price_avg: item.price,
    notes: 'Local palengke estimate (not in DA Bantay Presyo)'
}));

// Merge supplemental estimates into a price list, skipping items the
// live feed already covers.
function mergeSupplementalPrices(items) {
    const haystack = items.map(i => `${i.id || ''} ${i.name || ''} ${i.item_name || ''}`.toLowerCase()).join(' | ');
    const missing = LOCAL_SUPPLEMENT_PRICES.filter(sup => !sup.keys.some(key => haystack.includes(key)));
    return [...items, ...missing];
}

// Live reference, replaced once the GitHub-hosted DA price feed loads.
// Starts as the fallback so the AI always has something to answer with.
let MARKET_PRICE_REFERENCE = MARKET_PRICE_FALLBACK;

// ==========================================
// 7c. LIVE DA PRICE FEED (GitHub-hosted JSON, synced from the admin panel)
// ==========================================

const PRICE_FEED_URL = 'https://raw.githubusercontent.com/betoniobrent/palengke-helper/main/data/prices.json';
const PRICE_EMOJI_MAP = {
    'rice': '🍚', 'chicken': '🍗', 'egg': '🥚', 'pork': '🥩',
    'beef': '🥩', 'tilapia': '🐟', 'bangus': '🐟', 'galunggong': '🐟',
    'sardines': '🐟', 'eggplant': '🍆', 'pechay': '🥬', 'squash': '🎃',
    'onion': '🧅', 'garlic': '🧄', 'oil': '🧂', 'sugar': '🧂',
    'mungbean': '🫘', 'monggo': '🫘'
};

function guessPriceEmoji(item) {
    const haystack = `${item.id || ''} ${item.name || ''}`.toLowerCase();
    for (const [needle, emoji] of Object.entries(PRICE_EMOJI_MAP)) {
        if (haystack.includes(needle)) return emoji;
    }
    return '🛒';
}

function formatPriceValue(item) {
    const min = Number(item.price_min ?? item.price ?? 0);
    const max = Number(item.price_max ?? item.price ?? 0);
    const avg = Number(item.price_avg ?? ((min + max) / 2) ?? 0);
    const unit = item.unit || 'unit';

    if (!min && !max && !avg) return 'n/a';

    // If range is meaningful, show avg with min-max spread
    if (min && max && min !== max) {
        return `₱${avg.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${min.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}-${max.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})/${unit}`;
    }

    const value = avg || min || max;
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
}

// Display labels for Supabase market_prices.category values.
const CATEGORY_TAB_LABELS = {
    'rice': '🍚 Rice',
    'meat': '🥩 Meat',
    'fish': '🐟 Fish',
    'vegetables': '🥬 Vegetables',
    'fruits': '🍎 Fruits',
    'spices': '🧂 Spices',
    'other food': '🥫 Other Food',
    'household': '🧹 Household'
};
const CATEGORY_TAB_ORDER = ['rice', 'meat', 'fish', 'vegetables', 'fruits', 'spices', 'other food', 'household'];
const CATEGORY_GROUP_ORDER = CATEGORY_TAB_ORDER;

let ALL_PRICE_ITEMS = [];
let ACTIVE_PRICE_GROUP = 'All';

function renderPriceCategoryTabs(items) {
    const container = document.getElementById('priceCategoryTabs');
    if (!container) return;

    const present = new Set(items.map(item => item.category).filter(Boolean));
    const groups = ['All', ...CATEGORY_TAB_ORDER.filter(c => present.has(c))];

    container.innerHTML = groups.map(g => {
        const active = g === ACTIVE_PRICE_GROUP;
        const label = g === 'All' ? '🌐 All' : (CATEGORY_TAB_LABELS[g] || g);
        const cls = active
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
        return `<button onclick="selectPriceCategory('${g}')" class="${cls} text-xs font-semibold px-3 py-1.5 rounded-full transition">${label}</button>`;
    }).join('');
}

function selectPriceCategory(groupName) {
    ACTIVE_PRICE_GROUP = groupName;
    renderPriceCategoryTabs(ALL_PRICE_ITEMS);
    renderFilteredPriceRows();
}

function renderFilteredPriceRows() {
    const tbody = document.getElementById('marketPricesTableBody');
    if (!tbody) return;

    const items = ACTIVE_PRICE_GROUP === 'All'
        ? ALL_PRICE_ITEMS
        : ALL_PRICE_ITEMS.filter(item => item.category === ACTIVE_PRICE_GROUP);

    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-gray-400">No price data available right now.</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr class="hover:bg-gray-50 transition">
            <td class="p-3 border-r border-gray-200 font-medium">${guessPriceEmoji(item)} ${item.name}</td>
            <td class="p-3 text-right font-mono font-bold text-gray-800">${formatPriceValue(item)}</td>
            <td class="p-3 text-right text-xs text-gray-500">${item.notes ? escapeHtml(item.notes) : '-'}</td>
        </tr>
    `).join('');
}

function renderMarketPricesTable(items) {
    ALL_PRICE_ITEMS = items || [];
    if (!CATEGORY_GROUP_ORDER.concat(['All']).includes(ACTIVE_PRICE_GROUP)) {
        ACTIVE_PRICE_GROUP = 'All';
    }
    renderPriceCategoryTabs(ALL_PRICE_ITEMS);
    renderFilteredPriceRows();
}

function buildMarketPriceReferenceFromFeed(items) {
    return items
        .filter(item => item.name)
        .map(item => ({
            keys: [item.name.toLowerCase(), ...(item.item_name ? [item.item_name.toLowerCase()] : [])],
            label: item.name,
            price: formatPriceValue(item)
        }));
}

async function loadLiveMarketPrices() {
    const updatedLabel = document.getElementById('pricesUpdatedLabel');
    const statusBadge = document.getElementById('pricesStatusBadge');

    try {
        // Fetch only published market prices from Supabase, ordered by latest date
        const { data: rows, error } = await supabaseClient
            .from('market_prices')
            .select('*')
            .eq('published', true)
            .order('source_date', { ascending: false });

        if (error) throw error;
        if (!Array.isArray(rows) || rows.length === 0) throw new Error('Empty price feed');

        // Map to internal format
        const items = mergeSupplementalPrices(rows.map(row => ({
            id: row.id,
            name: row.item_name,
            item_name: row.item_name,
            category: row.category,
            unit: row.unit,
            price_min: row.price_min,
            price_max: row.price_max,
            price_avg: row.price_avg,
            price: row.price_avg,
            notes: row.notes,
            source_date: row.source_date,
            reportDate: row.source_date
        })));

        renderMarketPricesTable(items);

        const liveReference = buildMarketPriceReferenceFromFeed(items);
        if (liveReference.length > 0) {
            MARKET_PRICE_REFERENCE = liveReference;
        }

        const latestDate = items[0]?.source_date;
        if (updatedLabel) {
            updatedLabel.textContent = latestDate
                ? `Official DA Bantay Presyo rates — Region 4-A (CALABARZON), as of ${new Date(latestDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}.`
                : 'Official DA Bantay Presyo reference rates.';
        }
        if (statusBadge) {
            statusBadge.textContent = '● Live DA Bantay Presyo (Region 4-A)';
            statusBadge.className = 'bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-full whitespace-nowrap';
        }

        // Update home page price movements
        updateHomePagePriceMovements(items);
    } catch (error) {
        console.warn('Live price feed unavailable, using fallback prices:', error);
        renderMarketPricesTable(mergeSupplementalPrices(MARKET_PRICE_FALLBACK.map(entry => ({
            id: entry.keys[0],
            name: entry.label,
            price_min: null,
            price_max: null,
            price_avg: null,
            price: null,
            unit: '',
            category: null
        }))));
        if (updatedLabel) {
            updatedLabel.textContent = 'Showing offline estimated rates — live DA feed unavailable right now.';
        }
        if (statusBadge) {
            statusBadge.textContent = '● Offline Estimate';
            statusBadge.className = 'bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-full whitespace-nowrap';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLiveMarketPrices);
} else {
    loadLiveMarketPrices();
}

// ==========================================
// 8. HOME PAGE PRICE MOVEMENTS
// ==========================================

function updateHomePagePriceMovements(currentItems) {
    const previousPrices = JSON.parse(localStorage.getItem('palengke_previous_prices')) || {};
    const priceIncreases = [];
    const priceDrops = [];

    currentItems.forEach(item => {
        if (!item.keys || item.keys.length === 0) return;
        const key = item.keys[0];
        const currentPrice = parsePriceValue(item.price);
        
        if (previousPrices[key] && currentPrice) {
            const previousPrice = previousPrices[key];
            const change = currentPrice - previousPrice;
            const percentChange = ((change / previousPrice) * 100).toFixed(1);
            
            if (Math.abs(change) > 0.5) { // Only show significant changes
                const movement = {
                    name: item.name,
                    change: change,
                    percentChange: percentChange,
                    unit: item.unit || 'kg'
                };
                
                if (change > 0) {
                    priceIncreases.push(movement);
                } else {
                    priceDrops.push(movement);
                }
            }
        }
        
        // Store current price for next comparison
        if (currentPrice) {
            previousPrices[key] = currentPrice;
        }
    });

    // Save current prices
    localStorage.setItem('palengke_previous_prices', JSON.stringify(previousPrices));

    // Update home page UI
    renderPriceMovements(priceIncreases, priceDrops);
}

function parsePriceValue(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr || typeof priceStr !== 'string') return null;
    const match = priceStr.match(/₱?(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function renderPriceMovements(increases, decreases) {
    const increaseList = document.querySelector('.bg-rose-50 ul');
    const decreaseList = document.querySelector('.bg-emerald-50 ul');
    
    if (!increaseList || !decreaseList) return;

    // Sort by magnitude of change
    increases.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    decreases.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    // Render top 3 increases
    if (increases.length > 0) {
        increaseList.innerHTML = increases.slice(0, 3).map(item => {
            const emoji = getItemEmoji(item.name);
            const sign = item.change > 0 ? '+' : '';
            return `<li>${emoji} ${item.name} (${sign}₱${Math.abs(item.change).toFixed(2)}/${item.unit}, ${item.percentChange}%)</li>`;
        }).join('');
    } else {
        increaseList.innerHTML = '<li class="text-gray-500 italic">No significant price increases this week</li>';
    }

    // Render top 3 decreases
    if (decreases.length > 0) {
        decreaseList.innerHTML = decreases.slice(0, 3).map(item => {
            const emoji = getItemEmoji(item.name);
            const sign = item.change < 0 ? '-' : '';
            return `<li>${emoji} ${item.name} (${sign}₱${Math.abs(item.change).toFixed(2)}/${item.unit}, ${item.percentChange}%)</li>`;
        }).join('');
    } else {
        decreaseList.innerHTML = '<li class="text-gray-500 italic">No significant price drops this week</li>';
    }
}

function getItemEmoji(name) {
    const lower = name.toLowerCase();
    if (lower.includes('tomato')) return '🍅';
    if (lower.includes('onion')) return '🧅';
    if (lower.includes('garlic')) return '🧄';
    if (lower.includes('chicken') || lower.includes('manok')) return '🍗';
    if (lower.includes('cabbage')) return '🥬';
    if (lower.includes('egg') || lower.includes('itlog')) return '🥚';
    if (lower.includes('fish') || lower.includes('isda')) return '🐟';
    if (lower.includes('pork') || lower.includes('baboy')) return '🥓';
    if (lower.includes('beef') || lower.includes('baka')) return '🥩';
    if (lower.includes('rice') || lower.includes('bigas')) return '🍚';
    if (lower.includes('carrot')) return '🥕';
    if (lower.includes('potato')) return '🥔';
    return '📦';
}

function parseAIQuantityQuery(question) {
    // Try to find a pattern like "2 kg chicken", "1.5 kg of pork", "3 pieces eggs"
    const regex = /(\d+(?:\.\d+)?)\s*(kg|kilo|g|gram|pc|piece|pieces|tray|cup|tbsp|tsp|ml|l|litro|liter|bunch|bundle|heads|cloves)\s*(?:of\s*)?(.+)/i;
    const match = question.match(regex);
    if (match) {
        return {
            quantity: parseFloat(match[1]),
            unit: match[2].toLowerCase(),
            name: match[3].trim().toLowerCase().replace(/[?.!]+$/, '')
        };
    }
    return null;
}

function respondToPriceQuery(question) {
    const parsed = parseAIQuantityQuery(question);
    let query = parsed ? parsed.name : question;

    // 1. Search live Supabase market prices first
    let liveMatches = (ALL_PRICE_ITEMS || []).filter(item =>
        item.item_name?.toLowerCase().includes(query) ||
        query.includes(item.item_name?.toLowerCase())
    );

    // 2. Fallback to static reference
    if (liveMatches.length === 0) {
        const refMatches = MARKET_PRICE_REFERENCE.filter(entry =>
            entry.keys.some(k => query.includes(k) || k.includes(query))
        );
        if (refMatches.length === 0) {
            return 'Here are common palengke reference prices:\n• Well-milled rice — ₱48–55/kg\n• Whole chicken — ₱170–190/kg\n• Pork kasim — ₱300–330/kg\n• Tilapia — ₱130–150/kg\n• Eggs — ₱8–9/pc\n• Red onions — ₱140–170/kg\nPrices vary per market and season — check the Market Prices tab for the watchlist.';
        }
        const lines = refMatches.map(m => `• ${m.label} — ${m.price}`);
        return `Estimated palengke prices:\n${lines.join('\n')}\nPrices vary per market and season — tawad politely and compare 2–3 stalls before buying.`;
    }

    const item = liveMatches[0];
    const avg = parseFloat(item.price_avg || item.price_min || 0);
    const min = parseFloat(item.price_min || avg);
    const max = parseFloat(item.price_max || avg);
    const unit = item.unit || 'unit';

    if (parsed && parsed.quantity) {
        // Compute cost for the requested quantity
        const cost = getMarketPriceForIngredient(`${parsed.quantity} ${parsed.unit} ${parsed.name}`);
        return `Live price for ${item.item_name}: ₱${avg.toFixed(2)} per ${unit} (range ₱${min.toFixed(2)}–₱${max.toFixed(2)}).\nEstimated cost for ${parsed.quantity} ${parsed.unit}: ₱${cost.toFixed(2)}\nPrices vary per market and season — tawad politely and compare 2–3 stalls before buying.`;
    }

    return `Live price for ${item.item_name}: ₱${avg.toFixed(2)} per ${unit} (range ₱${min.toFixed(2)}–₱${max.toFixed(2)}).\nPrices vary per market and season — check the Market Prices tab for more.`;
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
    const groceryTotal = groceryItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);
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
    const groceryTotal = groceryItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);
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

    const total = groceryItems.reduce((acc, i) => acc + ((getItemUnitPrice(i)) * (parseFloat(i.quantity) || 0)), 0);
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

// PWA install helpers and service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered:', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

function openPwaInstallModal() {
    const modal = document.getElementById('pwaInstallModal');
    if (modal) modal.classList.remove('hidden');
}

function closePwaInstallModal() {
    const modal = document.getElementById('pwaInstallModal');
    if (modal) modal.classList.add('hidden');
}
