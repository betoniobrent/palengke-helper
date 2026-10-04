const DAILY_VERSES = [
    ['Psalm 118:24', 'This is the day which the LORD hath made; we will rejoice and be glad in it.'],
    ['Psalm 23:1', 'The LORD is my shepherd; I shall not want.'],
    ['Proverbs 16:3', 'Commit thy works unto the LORD, and thy thoughts shall be established.'],
    ['1 Thessalonians 5:16', 'Rejoice evermore.'],
    ['Psalm 34:8', 'O taste and see that the LORD is good: blessed is the man that trusteth in him.'],
    ['1 Corinthians 16:14', 'Let all your things be done with charity.'],
    ['Matthew 6:11', 'Give us this day our daily bread.'],
    ['Psalm 119:105', 'Thy word is a lamp unto my feet, and a light unto my path.'],
    ['Proverbs 3:5', 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.'],
    ['Philippians 4:4', 'Rejoice in the Lord alway: and again I say, Rejoice.'],
    ['Psalm 100:2', 'Serve the LORD with gladness: come before his presence with singing.'],
    ['1 Thessalonians 5:17', 'Pray without ceasing.'],
    ['Psalm 56:3', 'What time I am afraid, I will trust in thee.'],
    ['Proverbs 17:17', 'A friend loveth at all times, and a brother is born for adversity.']
];

function homeDayIndex(now = new Date()) {
    return Math.floor((now.getTime() + 8 * 60 * 60 * 1000) / 86400000);
}

function selectDailyHome(now, recipes) {
    const day = homeDayIndex(now);
    const meals = recipes.filter(recipe => recipe.mealType?.some(type => type === 'Lunch' || type === 'Dinner'));
    const index = length => ((day % length) + length) % length;
    return { recipe: meals.length ? meals[index(meals.length)] : null, verse: DAILY_VERSES[index(DAILY_VERSES.length)] };
}

function refreshDailyHome() {
    const {recipe, verse} = selectDailyHome(new Date(), RECIPE_DATABASE);
    const set = (id, text) => { const node = document.getElementById(id); if (node) node.textContent = text; };
    if (recipe) {
        set('dailyMealName', recipe.name);
        set('dailyMealDescription', `Today’s meal idea: ${recipe.name}. Open the recipe for ingredients and cooking steps.`);
        set('dailyMealTime', `Cook: ${recipe.cookTime || 'See recipe'}`);
        set('dailyMealServings', `Serves: ${recipe.servings}`);
        const button = document.getElementById('dailyMealRecipe');
        if (button) button.onclick = () => showRecipeDetailsById(recipe.id);
    }
    set('dailyVerseText', `“${verse[1]}”`);
    set('dailyVerseReference', `— ${verse[0]} (KJV)`);
}

if (typeof document !== 'undefined') {
    let dailyTimer;
    function scheduleDailyHome() {
        clearTimeout(dailyTimer);
        refreshDailyHome();
        const now = Date.now();
        const nextMidnight = (homeDayIndex(new Date(now)) + 1) * 86400000 - 8 * 60 * 60 * 1000;
        dailyTimer = setTimeout(scheduleDailyHome, nextMidnight - now + 100);
    }
    document.addEventListener('palengke:ready', scheduleDailyHome);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleDailyHome(); });
}
if (typeof module !== 'undefined') module.exports = {homeDayIndex, selectDailyHome};
