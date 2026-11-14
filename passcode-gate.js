(function () {
  var PASSCODE = '2917';
  var STORAGE_KEY = 'cs_unlocked_2917';
  var PROTECTED_PAGES = ['lending.html', 'df2030.html'];

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
  }

  function currentPageName() {
    var path = window.location.pathname || '';
    var parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function isProtectedHref(href) {
    if (!href) return false;
    var clean = href.split('#')[0].split('?')[0].replace(/^\.\//, '');
    return PROTECTED_PAGES.indexOf(clean) !== -1;
  }

  var isProtectedCurrentPage = PROTECTED_PAGES.indexOf(currentPageName()) !== -1;

  // Inject styles immediately so protected pages stay hidden until unlocked
  var style = document.createElement('style');
  style.textContent =
    'html[data-cs-locked="true"] body > *:not(#cs-gate-overlay){visibility:hidden!important}' +
    '#cs-gate-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(250,250,250,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}' +
    '#cs-gate-dialog{width:100%;max-width:400px;background:#FFFFFF;border:1px solid rgba(24,24,27,0.12);border-radius:16px;padding:28px;box-shadow:0 20px 50px rgba(24,24,27,0.10);font-family:"Inter",system-ui,sans-serif;color:#18181B}' +
    '.cs-gate-eyebrow{display:inline-block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6B53A6;background:#F3EFFB;padding:4px 10px;border-radius:999px;margin-bottom:14px}' +
    '#cs-gate-dialog h2{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;margin:0 0 8px;color:#18181B}' +
    '#cs-gate-dialog p{font-size:14.5px;line-height:1.55;color:#52525B;margin:0 0 20px}' +
    '#cs-gate-input{width:100%;box-sizing:border-box;font-family:"JetBrains Mono",monospace;font-size:18px;letter-spacing:0.25em;padding:12px 14px;border:1px solid rgba(24,24,27,0.18);border-radius:10px;background:#FAFAFA;color:#18181B;outline:none;transition:border-color .15s}' +
    '#cs-gate-input:focus{border-color:#6B53A6;background:#FFFFFF}' +
    '#cs-gate-error{min-height:20px;margin:8px 0 14px;font-size:13px;color:#B91C1C}' +
    '.cs-gate-actions{display:flex;gap:10px;justify-content:flex-end}' +
    '.cs-gate-btn{font-family:"Inter",system-ui,sans-serif;font-size:14px;font-weight:600;padding:10px 18px;border-radius:999px;cursor:pointer;border:1px solid transparent;transition:background .15s,border-color .15s}' +
    '.cs-gate-btn--cancel{background:#FFFFFF;color:#52525B;border-color:rgba(24,24,27,0.14)}' +
    '.cs-gate-btn--cancel:hover{border-color:#18181B;color:#18181B}' +
    '.cs-gate-btn--submit{background:#6B53A6;color:#FFFFFF}' +
    '.cs-gate-btn--submit:hover{background:#594391}';
  document.head.appendChild(style);

  if (isProtectedCurrentPage && !isUnlocked()) {
    document.documentElement.setAttribute('data-cs-locked', 'true');
  }

  function showGateModal(targetUrl, isDirectGuard) {
    var existing = document.getElementById('cs-gate-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'cs-gate-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cs-gate-title');

    overlay.innerHTML =
      '<form id="cs-gate-dialog" novalidate>' +
        '<span class="cs-gate-eyebrow">Protected Case Study</span>' +
        '<h2 id="cs-gate-title">Enter passcode</h2>' +
        '<p>This project contains confidential work. Enter the 4-digit passcode to continue.</p>' +
        '<input id="cs-gate-input" type="password" inputmode="numeric" maxlength="12" autocomplete="off" placeholder="••••" aria-label="Case study passcode">' +
        '<div id="cs-gate-error" role="alert"></div>' +
        '<div class="cs-gate-actions">' +
          '<button type="button" class="cs-gate-btn cs-gate-btn--cancel" id="cs-gate-cancel">Cancel</button>' +
          '<button type="submit" class="cs-gate-btn cs-gate-btn--submit">Unlock →</button>' +
        '</div>' +
      '</form>';

    document.body.appendChild(overlay);

    var form = document.getElementById('cs-gate-dialog');
    var input = document.getElementById('cs-gate-input');
    var errorEl = document.getElementById('cs-gate-error');
    var cancelBtn = document.getElementById('cs-gate-cancel');

    setTimeout(function () {
      if (input) input.focus();
    }, 10);

    function closeOrRedirect() {
      if (isDirectGuard) {
        window.location.href = 'index.html#work';
      } else {
        overlay.remove();
      }
    }

    cancelBtn.addEventListener('click', closeOrRedirect);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay && !isDirectGuard) closeOrRedirect();
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && document.getElementById('cs-gate-overlay')) {
        document.removeEventListener('keydown', onKey);
        closeOrRedirect();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      if (val === PASSCODE) {
        setUnlocked();
        document.documentElement.removeAttribute('data-cs-locked');
        overlay.remove();
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      } else {
        errorEl.textContent = 'Incorrect passcode. Please try again.';
        input.value = '';
        input.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (isProtectedCurrentPage && !isUnlocked()) {
      showGateModal(null, true);
    }

    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) return;
      var href = link.getAttribute('href');
      if (isProtectedHref(href) && !isUnlocked()) {
        e.preventDefault();
        showGateModal(href, false);
      }
    });
  });
})();
