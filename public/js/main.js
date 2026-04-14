/* GoDude Holidays — Main JS */
document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Hamburger ─────────────────────────────────────────
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // ── Floating particles ────────────────────────────────
  const particlesEl = document.querySelector('.hero-particles');
  if (particlesEl) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 6}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      particlesEl.appendChild(p);
    }
  }

  // ── Reveal on scroll ──────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObs.observe(el));
  }

  // ── Alert flash messages ──────────────────────────────
  const alerts = document.querySelectorAll('.alert-flash');
  alerts.forEach(a => {
    setTimeout(() => {
      a.style.transition = 'opacity 0.5s ease';
      a.style.opacity = '0';
      setTimeout(() => a.remove(), 500);
    }, 4000);
  });

  // ── AJAX Quick Quote Form ─────────────────────────────
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = quoteForm.querySelector('[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '⏳ Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(quoteForm)))
        });
        const data = await res.json();
        if (data.success) {
          showToast('✅ Your enquiry has been sent! We\'ll contact you soon.', 'success');
          quoteForm.reset();
        } else {
          showToast('❌ ' + (data.message || 'Something went wrong.'), 'error');
        }
      } catch {
        showToast('❌ Network error. Please try again.', 'error');
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  // ── AJAX B2B Form ─────────────────────────────────────
  const b2bForm = document.getElementById('b2bForm');
  if (b2bForm) {
    b2bForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = b2bForm.querySelector('[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '⏳ Submitting...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(b2bForm)))
        });
        const data = await res.json();
        if (data.success) {
          showToast('🎉 Registration successful! We\'ll review and contact you.', 'success');
          b2bForm.reset();
        } else {
          showToast('❌ ' + (data.message || 'Something went wrong.'), 'error');
        }
      } catch {
        showToast('❌ Network error. Please try again.', 'error');
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  // ── Counter animation ─────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target);
          let current = 0;
          const step = target / 60;
          const tick = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + (el.dataset.suffix || '');
            if (current >= target) clearInterval(tick);
          }, 20);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }
});

// ── Toast notification ────────────────────────────────
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:${type === 'success' ? '#00b894' : '#d63031'};
    color:#fff; padding:14px 28px; border-radius:50px;
    font-size:14px; font-weight:600; z-index:99999;
    box-shadow:0 8px 30px rgba(0,0,0,0.2);
    animation:slideUp 0.4s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 4000);
}

const style = document.createElement('style');
style.textContent = `@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(style);
