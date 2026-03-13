/* ============================================================
   landing.js — Jee-Eun Lee Portfolio
   Parallax orbs + magnetic button.
   Cursor is handled entirely in scripts.js.
   ============================================================ */

(function () {

  /* ── CLICK RIPPLE ── */
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:60px;height:60px`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });

  /* ── PARALLAX ORBS ── */
  const bg = document.getElementById('parallaxBg');
  if (bg) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 28;
      ty = (e.clientY / window.innerHeight - 0.5) * 18;
    }, { passive: true });
    (function animateBg() {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      bg.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(animateBg);
    })();
  }

  /* ── MAGNETIC BUTTON ── */
  document.querySelectorAll('.magnetic').forEach(el => {
    let ticking = false;
    el.addEventListener('mousemove', e => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        el.style.transition = 'none';
        el.style.transform  = `translateZ(0) translate(${dx * 0.1}px, ${dy * 0.12}px)`;
        ticking = false;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      el.style.transform  = 'translateZ(0)';
    });
  });

})();
