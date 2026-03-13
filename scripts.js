/* ============================================================
   scripts.js — Jee-Eun Lee Portfolio
   Navigation, scroll, dropdowns + cursor, ripple, parallax
   ============================================================ */

/* ── PAGE NAVIGATION ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({ top: 0 });
  setTimeout(initFade, 50);
}

function switchTab(tab) {
  showPage(tab === 'home' ? 'home' : tab === 'work' ? 'work' : tab === 'about' ? 'about' : tab);
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + tab).classList.add('active');
}

function showCase(slug) {
  showPage(slug);
}

function goHome(section) {
  if (section === 'work') {
    switchTab('work');
  } else {
    switchTab('home');
    setTimeout(() => {
      const el = document.getElementById(section + '-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }
}

/* ── TIME-BASED GREETING ── */
(function () {
  const h = new Date().getHours();
  const time = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const el = document.getElementById('greeting-text');
  if (el) el.textContent = `Good ${time} — welcome`;
})();

/* ── NAV SCROLL STATE + HIDE SCROLL HINT ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  // Hide floating scroll hint once user scrolls
  document.querySelectorAll('.page.active').forEach(p => {
    p.classList.toggle('scrolled-down', window.scrollY > 80);
  });
});

/* ── SCROLL FADE-IN ── */
function initFade() {
  const els = document.querySelectorAll('.page.active .fade-in');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ── CHIP DROPDOWNS ── */
let activeDropdown = null;
let activeChip = null;

function toggleDropdown(id, event) {
  event.stopPropagation();
  const dropdown = document.getElementById('dropdown-' + id);
  const chip = event.currentTarget;

  if (activeDropdown && activeDropdown !== dropdown) {
    activeDropdown.classList.remove('active');
    if (activeChip) activeChip.classList.remove('active');
  }

  const isOpen = dropdown.classList.contains('active');
  dropdown.classList.toggle('active');
  chip.classList.toggle('active');
  activeDropdown = isOpen ? null : dropdown;
  activeChip = isOpen ? null : chip;
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.chip-wrap') && activeDropdown) {
    activeDropdown.classList.remove('active');
    if (activeChip) activeChip.classList.remove('active');
    activeDropdown = null;
    activeChip = null;
  }
});

/* ── CUSTOM CURSOR ── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (cursor && cursorRing) {
  // Use transform instead of left/top — GPU composited, zero reflow
  cursor.style.willChange     = 'transform';
  cursorRing.style.willChange = 'transform';

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  // Dot: snap instantly to mouse — no lag at all
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  }, { passive: true });

  // Ring: lerp at 0.28 — noticeably faster, still smooth
  (function animateRing() {
    rx += (mx - rx) * 0.28;
    ry += (my - ry) * 0.28;
    cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateRing);
  })();

  // Expand on hover over interactive elements
  const hoverTargets = 'a, button, .chip, .project-row, .cs-next-card, .dropdown-item, .landing-cta';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('expanded');
      cursorRing.classList.add('expanded');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('expanded');
      cursorRing.classList.remove('expanded');
    }
  });
}

/* ── CLICK RIPPLE ── */
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:60px;height:60px`;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* ── PARALLAX ORBS ON MOUSE MOVE ── */
const parallaxBg = document.getElementById('parallaxBg');
if (parallaxBg) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 28;
    ty = (e.clientY / window.innerHeight - 0.5) * 18;
  });
  (function animateBg() {
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    parallaxBg.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(animateBg);
  })();
}

/* ── MAGNETIC CTA BUTTON ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.landing-cta').forEach(el => {
    let ticking = false;
    el.addEventListener('mousemove', e => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        el.style.transition = 'none';
        el.style.transform = `translateZ(0) translate(${dx * 0.1}px, ${dy * 0.12}px)`;
        ticking = false;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      el.style.transform = 'translateZ(0)';
    });
  });

  switchTab('home');
  initFade();
});
