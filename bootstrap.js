// The welcome screen needs only theme controls. Load the workspace on intent.
(() => {
  const sources = ['/vendor/supabase-2.117.2.js', '/data/recipes.js?v=9',
    '/daily-home.js?v=1', '/supabase.js?v=3', '/meal-costing.js?v=3',
    '/app.js?v=49', '/tutorial-tabs.js?v=2', '/tutorial.js?v=4',
    '/navigation.js?v=1', '/events.js?v=1'];
  const loaded = new Set();
  let preloaded = false;
  let pending, ready = false, handling = false;
  function status(message) {
    let node = document.getElementById('startupStatus');
    if (!node) {
      node = document.createElement('p');
      node.id = 'startupStatus';
      node.setAttribute('role', 'status');
      document.querySelector('#authPage > div').appendChild(node);
    }
    node.textContent = message;
  }
  function loadScript(src) {
    if (loaded.has(src)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => { loaded.add(src); resolve(); };
      script.onerror = () => { script.remove(); reject(new Error('Unable to load app')); };
      document.head.appendChild(script);
    });
  }
  async function load() {
    if (ready) return;
    if (pending) return pending;
    status('Loading Palengke Helper+…');
    if (!preloaded) {
      preloaded = true;
      for (const src of sources) {
        const hint = document.createElement('link');
        hint.rel = 'preload'; hint.as = 'script'; hint.href = src;
        document.head.appendChild(hint);
      }
    }
    pending = (async () => {
      for (const src of sources) await loadScript(src);
      document.dispatchEvent(new Event('palengke:ready'));
      window.dispatchEvent(new Event('palengke:ready'));
      ready = true;
      status('');
    })().catch(error => {
      pending = null;
      status('Could not load the app. Check your connection and select an option to retry.');
      throw error;
    });
    return pending;
  }
  document.addEventListener('click', async event => {
    if (ready) return;
    const control = event.target.closest?.('#authPage button, #authPage a');
    if (!control || control.hasAttribute('data-theme-toggle')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (handling) return;
    handling = true;
    try { await load(); control.click(); } catch (_) {} finally { handling = false; }
  }, true);
  let returning = false;
  try { returning = !!localStorage.getItem('palengke_session'); } catch (_) {}
  const callback = /(?:access_token=|type=recovery|[?&]code=)/.test(location.hash + location.search);
  if (returning || callback) load().catch(() => {});
})();
