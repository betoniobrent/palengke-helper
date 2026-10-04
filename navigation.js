        let activeTabTransition = null;
        function switchTab(tabId) {
            const target = document.getElementById('view-' + tabId);
            if (!target) return;
            const previous = document.querySelector('.tab-content:not(.hidden)');
            activeTabTransition?.cancel();
            activeTabTransition = null;
            const views = document.querySelectorAll('.tab-content');
            views.forEach(v => v.classList.add('hidden'));

            const hero = document.getElementById('homeHero');
            if (hero) hero.classList.toggle('hidden', tabId !== 'home');

            target.classList.remove('hidden');
            if (previous && previous !== target && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof target.animate === 'function') {
                const order = ['home','budget','meal','prices','suggestions','grocery'];
                const direction = order.indexOf(tabId) >= order.indexOf(previous.id.replace('view-', '')) ? 1 : -1;
                activeTabTransition = target.animate([
                    {opacity:0.35, transform:'translateX(' + direction * 12 + 'px)'},
                    {opacity:1, transform:'translateX(0)'}
                ], {duration:180, easing:'cubic-bezier(0.2, 0.7, 0.2, 1)'});
            }

            if (tabId === 'suggestions') {
                if (typeof renderAIWelcomeMessage === 'function') {
                    renderAIWelcomeMessage();
                }
                if (typeof evaluateDynamicContextualAISuggestions === 'function') {
                    evaluateDynamicContextualAISuggestions();
                }
            }
            document.getElementById('mobileMenu')?.classList.add('hidden');
            const tabButtons = document.querySelectorAll('.tab-link');
            tabButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
                if (btn.dataset.tab === tabId) btn.setAttribute('aria-current', 'page');
                else btn.removeAttribute('aria-current');
            });
            if (tabId === 'meal') {
                const mealWrapper = document.getElementById('mealScheduleWrapper');
                const intro = document.getElementById('mealPlannerIntro');
                const plannerResult = document.getElementById('plannerResultsSection');
                const savedWrapper = document.getElementById('savedMealPlansWrapper');
                const planActive = typeof hasActiveMealPlan === 'function' && hasActiveMealPlan();
                if (mealWrapper) mealWrapper.classList.toggle('hidden', !planActive);
                if (intro) intro.classList.toggle('hidden', planActive);
                if (plannerResult) plannerResult.classList.toggle('hidden', !planActive);
                if (savedWrapper) savedWrapper.classList.remove('hidden');
            }
        }

        function toggleAccountMenu() {
            const dropdown = document.getElementById('accountDropdown');
            dropdown.classList.toggle('hidden');
        }

        function openAccountSettings() {
            const modal = document.getElementById('accountSettingsModal');
            modal.classList.remove('hidden');

            // Populate account info
            const session = JSON.parse(localStorage.getItem('palengke_session') || '{}');
            document.getElementById('settingsFullName').textContent = session.full_name || session.name || session.user || 'Not set';
            document.getElementById('settingsEmail').textContent = session.email || session.user || 'guest@local';
            document.getElementById('settingsAddress').textContent = session.address || 'Not set';
            document.getElementById('settingsRole').textContent = session.role || 'guest';

            // Close dropdown if open
            const dropdown = document.getElementById('accountDropdown');
            dropdown.classList.add('hidden');
        }

        function closeAccountSettings() {
            const modal = document.getElementById('accountSettingsModal');
            modal.classList.add('hidden');
        }

        function exportAllData() {
            const data = {
                budget: JSON.parse(localStorage.getItem('palengke_budget') || '[]'),
                grocery: JSON.parse(localStorage.getItem('palengke_grocery') || '[]'),
                mealPlans: JSON.parse(localStorage.getItem('palengke_mealplans') || '[]'),
                customRecipes: JSON.parse(localStorage.getItem('palengke_customrecipes') || '[]'),
                session: JSON.parse(localStorage.getItem('palengke_session') || '{}')
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'palengke-backup-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);

            showNotification('Data exported successfully!', 'success');
        }

        function clearAllData() {
            if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
                localStorage.removeItem('palengke_budget');
                localStorage.removeItem('palengke_grocery');
                localStorage.removeItem('palengke_mealplans');
                localStorage.removeItem('palengke_customrecipes');
                showNotification('All local data cleared.', 'success');
                setTimeout(() => location.reload(), 1500);
            }
        }

        function deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This will sign you out and clear all local data.')) {
                localStorage.removeItem('palengke_session');
                localStorage.removeItem('palengke_budget');
                localStorage.removeItem('palengke_grocery');
                localStorage.removeItem('palengke_mealplans');
                localStorage.removeItem('palengke_customrecipes');
                localStorage.removeItem('palengke_ai_thread');

                if (typeof supabaseClient !== 'undefined' && supabaseClient.auth) {
                    supabaseClient.auth.signOut().finally(() => location.reload());
                } else {
                    location.reload();
                }
            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('accountDropdown');
            const accountButton = event.target.closest('button[onclick="toggleAccountMenu()"]');
            if (!accountButton && !dropdown.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // Filter price categories
        function filterPriceCategory(category) {
            // Update button styles
            const buttons = document.querySelectorAll('.price-tab-btn');
            buttons.forEach(btn => {
                if (btn.dataset.category === category) {
                    btn.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-200');
                    btn.classList.add('bg-emerald-700', 'text-white', 'shadow-sm');
                } else {
                    btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-200');
                    btn.classList.remove('bg-emerald-700', 'text-white', 'shadow-sm');
                }
            });

            // Filter the table rows (this would need to be implemented with actual price data)
            const tableBody = document.getElementById('marketPricesTableBody');
            // For now, this is a placeholder - the actual filtering logic would need
            // to be implemented based on the price data structure
            console.log('Filtering by category:', category);
        }
