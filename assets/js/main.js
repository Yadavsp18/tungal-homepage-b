/* ==========================================================================
   Tungal homepage interactions. Vanilla JS + GSAP/ScrollTrigger where it helps.
   Every module guards for missing markup and respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';
  var D = window.TUNGAL || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------- header */
  function header() {
    var el = $('[data-header]');
    if (!el) return;
    var last = window.scrollY;
    var hero = $('[data-hero]');
    function onScroll() {
      var y = window.scrollY;
      var threshold = 10;
      el.classList.toggle('is-solid', y > threshold);
      var goingDown = y > last + 4, goingUp = y < last - 4;
      if (goingDown && y > 400 && !document.body.classList.contains('menu-open')) el.classList.add('is-hidden');
      if (goingUp || y < 200) el.classList.remove('is-hidden');
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', function () { el.classList.remove('is-hidden'); });
    onScroll();

    // current-section highlight
    var links = $$('.primary-nav a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var a = map[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute('aria-current'); });
            a.setAttribute('aria-current', 'true');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------------------------------------------------------- mobile menu */
  function mobileMenu() {
    var btn = $('[data-menu-toggle]'), menu = $('[data-mobile-menu]');
    if (!btn || !menu) return;
    var label = btn.querySelector('.sr-only');
    function focusables() { return [btn].concat($$('a, button', menu)); }
    function open() {
      menu.hidden = false;
      document.body.classList.add('menu-open');
      btn.setAttribute('aria-expanded', 'true');
      label.textContent = 'Close menu';
      if (hasGsap && !reduced) {
        gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: .3 });
        gsap.fromTo($$('.mobile-menu__links li, .mobile-menu .btn', menu), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out' });
      }
      var first = $('a', menu); if (first) first.focus();
    }
    function close(returnFocus) {
      menu.hidden = true;
      document.body.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      label.textContent = 'Open menu';
      if (returnFocus !== false) btn.focus();
    }
    btn.addEventListener('click', function () { btn.getAttribute('aria-expanded') === 'true' ? close() : open(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = focusables(), i = f.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) close(false); });
  }

  /* ---------------------------------------------------------- hero carousel */
  function hero() {
    var root = $('[data-hero]');
    if (!root) return;
    var slides = $$('[data-slide]', root), dots = $$('[data-goto]', root), caps = $$('[data-caption]', root), pauseBtn = $('[data-hero-pause]', root);
    var idx = 0, timer = null, interval = D.heroInterval || 7000, paused = reduced, hovering = false;
    root.style.setProperty('--hero-interval', interval + 'ms');
    if (reduced) { root.classList.add('no-autoplay', 'is-paused'); pauseBtn.setAttribute('aria-label', 'Play slideshow'); }

    function go(n, user) {
      n = (n + slides.length) % slides.length;
      slides[idx].classList.remove('is-active');
      slides[idx].setAttribute('aria-hidden', 'true');
      if (caps[idx]) caps[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active'); dots[idx].removeAttribute('aria-current');
      idx = n;
      // restart progress bar animation
      var bar = dots[idx].querySelector('.hero__bar b');
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; void bar.offsetWidth; bar.style.transition = ''; bar.style.transform = '';
      slides[idx].classList.add('is-active');
      slides[idx].removeAttribute('aria-hidden');
      if (caps[idx]) caps[idx].classList.add('is-active');
      dots[idx].classList.add('is-active'); dots[idx].setAttribute('aria-current', 'true');
      $$('img[loading="lazy"]', slides[idx]).forEach(function (img) { img.loading = 'eager'; });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (paused || hovering || document.hidden) return;
      timer = setTimeout(function () { go(idx + 1); }, interval);
    }
    function setPaused(p) {
      paused = p;
      root.classList.toggle('is-paused', p);
      pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
      if (!p) go(idx); else clearTimeout(timer);
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });
    pauseBtn.addEventListener('click', function () { setPaused(!paused); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(idx + 1, true); }
      if (e.key === 'ArrowLeft') { go(idx - 1, true); }
    });
    root.addEventListener('focusin', function () { hovering = true; clearTimeout(timer); });
    root.addEventListener('focusout', function () { hovering = false; schedule(); });
    // touch swipe
    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1), true);
      x0 = null;
    });
    document.addEventListener('visibilitychange', schedule);
    // stop autoplay when hero is off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { hovering = !en[0].isIntersecting; schedule(); }).observe(root);
    }
    schedule();

    if (hasGsap && !reduced && window.ScrollTrigger) {
      gsap.to('.hero__slides', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------------------------------------------------------- reveal on scroll */
  function reveals() {
    var items = $$('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (e, i) {
        e.target.style.transitionDelay = Math.min(i * 80, 400) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- counters, seal, parallax */
  function legacy() {
    var counters = $$('[data-count]');
    function runCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (reduced || !hasGsap) { el.textContent = target; return; }
      var o = { v: 0 };
      gsap.to(o, { v: target, duration: target > 50 ? 2 : 1.4, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); } });
      }, { threshold: .6 });
      counters.forEach(function (c) { io.observe(c); });
    }
    if (!hasGsap || reduced || !window.ScrollTrigger) return;
    var seal = $('[data-spin]');
    if (seal) gsap.fromTo(seal, { rotate: -30 }, { rotate: 30, ease: 'none', scrollTrigger: { trigger: seal.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -3, scale: 1.06 }, { yPercent: 3, scale: 1.06, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------------------------------------------------------- campus filter */
  function campusFilter() {
    var root = $('[data-filter]');
    if (!root) return;
    var btns = $$('[data-filter-key]', root), cards = $$('[data-campus]'), status = $('[data-filter-status]', root);
    var names = { all: 'all programmes', montessori: 'Montessori', cbse: 'CBSE Standard VI to X', puc: 'PU Science', degree: 'B.Sc and BCA', hostel: 'hostels' };
    function apply(key) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter-key') === key ? 'true' : 'false'); });
      var match = [];
      cards.forEach(function (c) {
        var on = key === 'all' || c.getAttribute('data-offers').split(' ').indexOf(key) !== -1;
        c.classList.toggle('is-dim', !on);
        if (on) match.push(c.querySelector('h3').textContent.replace(/^\s*\d+\s*/, '').trim());
      });
      if (status) status.textContent = key === 'all' ? 'Showing all four campuses.' : 'Campuses with ' + names[key] + ': ' + match.join(', ') + '.';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-filter-key')); }); });
    $$('[data-campus-link]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var card = document.getElementById('campus-' + a.getAttribute('data-campus-link'));
        if (!card) return;
        e.preventDefault();
        apply('all');
        card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        card.focus({ preventScroll: true });
        card.classList.remove('is-flash'); void card.offsetWidth; card.classList.add('is-flash');
        setTimeout(function () { card.classList.remove('is-flash'); }, 1800);
      });
    });
  }

  /* ---------------------------------------------------------- pathway ladder */
  function ladder() {
    var el = $('[data-ladder]'), prev = $('[data-ladder-prev]'), next = $('[data-ladder-next]');
    if (!el || !prev || !next) return;
    function step() { var c = el.querySelector('.rung'); return c ? c.getBoundingClientRect().width + 16 : 320; }
    function update() {
      var max = el.scrollWidth - el.clientWidth - 2;
      prev.disabled = el.scrollLeft <= 2;
      next.disabled = el.scrollLeft >= max;
      var hide = max <= 0; prev.parentNode.hidden = hide;
    }
    prev.addEventListener('click', function () { el.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { el.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }); });
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------------- lightbox */
  function lightbox() {
    var root = $('[data-lightbox-root]');
    if (!root) return;
    var items = $$('[data-lightbox]'), img = $('[data-lb-img]', root), cap = $('[data-lb-cap]', root), idx = 0, opener = null;
    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].querySelector('img');
      var big = (src.getAttribute('srcset') || '').split(',').pop().trim().split(' ')[0]; img.src = big || src.currentSrc || src.src; img.alt = src.alt; img.hidden = false;
      cap.textContent = items[idx].querySelector('span').textContent + ' · ' + (idx + 1) + ' of ' + items.length;
    }
    function open(i) { opener = document.activeElement; show(i); root.hidden = false; document.body.classList.add('menu-open'); $('[data-lb-close]', root).focus(); }
    function close() { root.hidden = true; document.body.classList.remove('menu-open'); if (opener) opener.focus(); }
    items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    $('[data-lb-close]', root).addEventListener('click', close);
    $('[data-lb-prev]', root).addEventListener('click', function () { show(idx - 1); });
    $('[data-lb-next]', root).addEventListener('click', function () { show(idx + 1); });
    root.addEventListener('click', function (e) { if (e.target === root) close(); });
    document.addEventListener('keydown', function (e) {
      if (root.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'Tab') {
        var f = $$('button', root), k = f.indexOf(document.activeElement);
        if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------------------------------------------------------- magnetic CTAs */
  function magnetic() {
    if (!finePointer || reduced || !hasGsap) return;
    $$('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .18);
        yTo((e.clientY - (r.top + r.height / 2)) * .3);
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dataSections() { var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear(); }

  /* ---------------------------------------------------------- enquiry form */
  function enquiry() {
    var form = $('[data-enquiry]');
    if (!form) return;
    var campus = $('[data-campus-select]', form), prog = $('[data-programme-select]', form);
    var hostelField = $('[data-hostel-field]', form), status = $('[data-form-status]', form);
    var P = D.programmes || {};

    function fillProgrammes() {
      var list = P[campus.value] || [];
      prog.innerHTML = '<option value="">' + (campus.value ? 'Select a programme' : 'Choose a campus first') + '</option>' +
        list.map(function (p) { return '<option value="' + esc(p.value) + '">' + esc(p.label) + '</option>'; }).join('');
      prog.disabled = !list.length;
      updateHostel();
    }
    function updateHostel() {
      var ok = (D.hostel && D.hostel[campus.value] || []).indexOf(prog.value) !== -1;
      hostelField.hidden = !ok;
      if (!ok) { var cb = $('input', hostelField); if (cb) cb.checked = false; }
    }
    campus.addEventListener('change', fillProgrammes);
    prog.addEventListener('change', updateHostel);

    // "Share your story" and campus chips can preselect the form
    $$('[data-campus-link]').forEach(function (a) {
      a.addEventListener('click', function () { campus.value = a.getAttribute('data-campus-link'); fillProgrammes(); });
    });

    var phone = $('#f-phone', form);
    phone.addEventListener('input', function () {
      var v = phone.value.replace(/\D/g, '');
      if (v.length > 10 && v.indexOf('91') === 0) v = v.slice(2);
      phone.value = v.slice(0, 10);
    });

    var rules = {
      'f-student': function (v) { return v.trim().length >= 2 || "Please enter the student's name."; },
      'f-parent': function (v) { return v.trim().length >= 2 || "Please enter the parent or guardian's name."; },
      'f-phone': function (v) { return /^[6-9]\d{9}$/.test(v) || 'Please enter a valid 10-digit mobile number.'; },
      'f-email': function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Please enter a valid email address.'; },
      'f-campus': function (v) { return !!v || 'Please choose a campus.'; },
      'f-programme': function (v) { return !!v || 'Please choose a programme.'; },
      'f-consent': function (v, el) { return el.checked || 'Please confirm we may contact you.'; }
    };
    function check(id) {
      var el = document.getElementById(id), err = document.getElementById(id + '-err');
      var r = rules[id](el.value, el);
      var bad = r !== true;
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) { err.textContent = r; err.hidden = false; el.setAttribute('aria-describedby', id + '-err'); }
      else { err.textContent = ''; err.hidden = true; el.removeAttribute('aria-describedby'); }
      return !bad;
    }
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('blur', function () { if (el.value || el.getAttribute('aria-invalid')) check(id); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') check(id); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) { if (!check(id) && !firstBad) firstBad = document.getElementById(id); });
      if (firstBad) {
        status.className = 'enquiry__status is-error';
        status.textContent = 'Please check the highlighted fields.';
        firstBad.focus();
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      status.className = 'enquiry__status';
      status.textContent = 'Sending your enquiry…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r; })
        .then(function () {
          status.className = 'enquiry__status is-success';
          status.textContent = 'Thank you. Your enquiry has been sent, and the campus office will be in touch.';
          form.reset(); fillProgrammes();
        })
        .catch(function () {
          status.className = 'enquiry__status is-error';
          status.textContent = 'We could not send your enquiry just now. Please try again in a moment.';
        })
        .then(function () { btn.disabled = false; });
    });
    fillProgrammes();
  }

  /* ---------------------------------------------------------- floating UI */
  function floating() {
    var top = $('[data-to-top]'), ring = $('[data-progress]'), cta = $('[data-mobile-cta]');
    var hero = $('[data-hero]'), adm = $('#admissions');
    var C = 132, admVisible = false;
    if ('IntersectionObserver' in window && adm) {
      new IntersectionObserver(function (en) { admVisible = en[0].isIntersecting; tick(); }, { threshold: .05 }).observe(adm);
    }
    function tick() {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      var past = y > (hero ? hero.offsetHeight * .8 : 600);
      if (top) top.classList.toggle('is-visible', past);
      if (ring) ring.style.strokeDashoffset = String(C - C * Math.min(1, y / Math.max(1, h)));
      if (cta) cta.classList.toggle('is-visible', past && !admVisible && !document.body.classList.contains('menu-open'));
    }
    window.addEventListener('scroll', tick, { passive: true });
    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      var skip = $('.brand'); if (skip) skip.focus({ preventScroll: true });
    });
    tick();
  }

  header();
  mobileMenu();
  hero();
  reveals();
  legacy();
  campusFilter();
  ladder();
  lightbox();
  magnetic();
  dataSections();
  enquiry();
  floating();
})();
