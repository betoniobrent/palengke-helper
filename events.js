// Explicit actions migrated from the static HTML. No evaluation of DOM strings.
const dynamicUIActions = {
  'recipe-selector': e => openRecipeSelector(e.dataset.day, e.dataset.mealType),
  'recipe-details': e => showRecipeDetailsById(Number(e.dataset.id)),
  'custom-recipe': () => openCustomRecipePrompt(),
  'select-recipe': e => selectRecipe(Number(e.dataset.id)),
  'load-plan': e => loadMealPlan(e.dataset.id),
  'delete-plan': e => deleteMealPlan(e.dataset.id),
  'planner-pax': e => setPlannerPax(e.dataset.pax || e.value),
  'delete-budget': (e, event) => { event.stopPropagation(); purgeMonthlyBudgetFolder(e.dataset.id); },
  'delete-ledger': e => purgeLedgerItemIndex(e.dataset.id, e.dataset.ledgerType),
  'add-price': e => addGroceryPriceItem(Number(e.dataset.index)),
  'check-grocery': e => toggleGroceryItemCheck(Number(e.dataset.index)),
  'clear-local-price': e => clearGroceryLocalPrice(Number(e.dataset.index)),
  'save-local-price': e => setGroceryLocalPrice(Number(e.dataset.index), document.getElementById('localPrice-' + e.dataset.index).value, document.getElementById('localPriceQuantity-' + e.dataset.index).value),
  'grocery-quantity': e => updateGroceryQuantity(Number(e.dataset.index), Number(e.dataset.delta)),
  'set-grocery-quantity': e => setGroceryQuantity(Number(e.dataset.index), e.value),
  'delete-grocery': e => deleteItem(Number(e.dataset.index)),
  'select-market': e => selectMarketItem(e.dataset.name, Number(e.dataset.price), e.dataset.category, e.dataset.unit),
  'price-category': e => selectPriceCategory(e.dataset.category),
  'price-page': e => goToPricePage(Number(e.dataset.page))
};
for (const type of ['click', 'change']) {
  document.addEventListener(type, event => {
    const element = event.target.closest?.('[data-action-' + type + ']');
    if (!element || element.disabled) return;
    const key = element.getAttribute('data-action-' + type);
    if (Object.hasOwn(dynamicUIActions, key)) dynamicUIActions[key](element, event);
  }, true);
}
const staticUIActions = {
"hb655e6275924": function(event) { openAccountSettings(); toggleMenu() },
"he2077e5cea97": function(event) { logout(); toggleMenu() },
"h9b1aa004b70f": function(event) { logout() },
"h9d5abb6ef6db": function(event) { loginWithEmail() },
"h471b2b37f91d": function(event) { loginWithGoogle() },
"h9e3984618ada": function(event) { loginAsGuest() },
"h51731e466945": function(event) { localStorage.removeItem('palengke_session'); location.reload(); },
"hda5e086e7c0d": function(event) { showRegister() },
"h061c00cc0d65": function(event) { showForgotPassword() },
"h6c7579c938a8": function(event) { registerWithEmail() },
"hb4f688bff708": function(event) { showLogin() },
"hf36407c909d2": function(event) { sendPasswordReset() },
"h505bfee5470e": function(event) { updatePassword() },
"h53987178ee59": function(event) { switchTab('home') },
"hf14a4159b832": function(event) { switchTab('budget') },
"haeeb1051058d": function(event) { switchTab('meal') },
"h2dba71df4ea4": function(event) { switchTab('prices') },
"h77f383c26ed0": function(event) { switchTab('suggestions') },
"he821f2a99eb9": function(event) { switchTab('grocery') },
"hd061d43a2783": function(event) { openTutorial() },
"h37933584a7f0": function(event) { toggleAccountMenu() },
"haf4effefa762": function(event) { openAccountSettings() },
"h74ac9886f884": function(event) { openPwaInstallModal() },
"h34b597957f88": function(event) { logout() },
"h6a8556577b38": function(event) { toggleMenu() },
"h1970af45a402": function(event) { toggleMenu(); openTutorial() },
"h5dff562cb40f": function(event) { openPwaInstallModal(); toggleMenu() },
"h71bb4df9b69c": function(event) { openTabTutorial('home') },
"hcc25564b1062": function(event) { openTabTutorial('budget') },
"h7f0df4f6d8e3": function(event) { toggleForm('newMonthBudgetForm') },
"h89daf8174c47": function(event) { addNewMonthlyBudgetHubRecord() },
"h5ccda40841e6": function(event) { applySpecificationFilter('all') },
"h5e93e95e4c91": function(event) { applySpecificationFilter('Monthly') },
"h3af50c318335": function(event) { applySpecificationFilter('1st Cut (1st-15th)') },
"h1ebd105662fb": function(event) { applySpecificationFilter('2nd Cut (16th-End)') },
"h6ffdd3d44136": function(event) { applySpecificationFilter('Week 1') },
"hc393dced5645": function(event) { applySpecificationFilter('Week 2') },
"h52e95bb0bcff": function(event) { applySpecificationFilter('Week 3') },
"h564274bdb630": function(event) { applySpecificationFilter('Week 4') },
"he15e6daca709": function(event) { toggleForm('incomeForm') },
"h7ff2ab6f1768": function(event) { addLedgerItem('income') },
"h66a585dd1b91": function(event) { toggleForm('expenseForm') },
"h075100f7b938": function(event) { addLedgerItem('expense') },
"h0ca404e2d2be": function(event) { openTabTutorial('meal') },
"h91c08c4748c4": function(event) { setPlannerPax(1) },
"h3d474c240fb3": function(event) { setPlannerPax(2) },
"h4e47e39cb0b5": function(event) { setPlannerPax(4) },
"he026598f90ba": function(event) { setPlannerPax(6) },
"hb7dfdc7d061e": function(event) { setPlannerPax(8) },
"hf0996a9cd4d2": function(event) { backToMealPlannerIntro() },
"hdfd33ee4ea5a": function(event) { addMealPlanToGroceryList() },
"heb052239e2b7": function(event) { openTabTutorial('prices') },
"h675d034cc886": function(event) { openTabTutorial('suggestions') },
"h8027f910899f": function(event) { clearAIChatHistory() },
"hf948e37d86bb": function(event) { handleQuickPrompt('What should I cook for dinner?') },
"h8be3ae770846": function(event) { handleQuickPrompt('How can I save money on groceries?') },
"h90c1bc6a7fa5": function(event) { handleQuickPrompt('Give me budget-friendly lunch ideas.') },
"h47195ec3199c": function(event) { handleQuickPrompt('What breakfast can I make for 4 people?') },
"h89b0cf881ffc": function(event) { processAISuggestionQuery() },
"h76d9d20364a6": function(event) { openTabTutorial('grocery') },
"he6a81c5a84a4": function(event) { renderGroceryPriceList() },
"h7a067b34f84f": function(event) { renderGroceryPriceList() },
"hcc4fb28ab383": function(event) { searchGroceryItemsWithMarket() },
"h5c1776cbdae3": function(event) { recalculateGroceryAddPrice() },
"h319962e45fad": function(event) { addItem() },
"h2246004aa0d8": function(event) { setGroceryBudget(this.value) },
"h247e18768231": function(event) { clearBoughtItems() },
"h7fcb49131142": function(event) { clearAllGroceryItems() },
"hd825ae9cc05d": function(event) { closeAccountSettings() },
"ha9a6a5ecb31a": function(event) { exportAllData() },
"h109ab21d4fb3": function(event) { clearAllData() },
"h0fa610533cff": function(event) { deleteAccount() },
"h4c5e9658eeb6": function(event) { document.getElementById('customRecipeModal').classList.add('hidden') },
"h89642d01f17e": function(event) { document.getElementById('appTutorial').close() },
"hd80cadae90db": function(event) { setTutorialLanguage(this.value) },
"h4ea7489ac007": function(event) { openTutorialSection() },
"hb99d61783f4e": function(event) { advanceTutorial(-1) },
"h5c060ea49966": function(event) { advanceTutorial(1) },
"h80e9f6a77eaf": function(event) { closePwaInstallModal() }
};
document.addEventListener('DOMContentLoaded', () => {
  for (const type of ['click','change','input','keyup']) {
    document.querySelectorAll('[data-handler-' + type + ']').forEach(element => {
      const action = staticUIActions[element.getAttribute('data-handler-' + type)];
      if (action) element.addEventListener(type, function(event) { action.call(this,event); });
    });
  }
});
