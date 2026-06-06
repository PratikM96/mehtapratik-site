/* Pratik Mehta / Kinetic Teal. Shared behavior: scroll reveal + work filter. */
(function () {
  // Image load resilience. Lazy-loaded CDN images can have their request dropped
  // under connection load (more often in Firefox), and a failed lazy image never
  // auto-retries, so it stays broken until reload. Retry each failed image up to
  // twice with a short backoff and a cache-busting param to dodge a cached miss.
  function retryBrokenImages() {
    var imgs = document.querySelectorAll('img[src*="cdn.mehtapratik.com"]');
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.dataset.retry) return;
      var attempts = 0;
      var onErr = function () {
        if (attempts >= 3) { img.removeEventListener('error', onErr); return; }
        attempts++;
        var base = (img.currentSrc || img.src).split('#')[0].split('?')[0];
        setTimeout(function () {
          var pre = new Image();
          pre.onload = function () { img.src = pre.src; };
          pre.src = base + '?r=' + attempts + '-' + Date.now();
        }, 500 * attempts);
      };
      img.addEventListener('error', onErr);
      img.dataset.retry = '1';
      if (img.complete && img.naturalWidth === 0) onErr();
    });
  }
  retryBrokenImages();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', retryBrokenImages);
  }

  // Random hero texture background. Skips the resume header (kept clean for print).
  var TEXTURES = [
    'texture-dealnews', 'texture-fiveeighty', 'texture-frc', 'texture-pipeline',
    'texture-raa', 'texture-sportime', 'texture-srlc',
    'texture-gold-particles', 'texture-blue-wood', 'texture-blue-black',
    'texture-space-shimmer', 'texture-blue-swirls', 'texture-feather',
    'texture-teal-swirls', 'texture-teal-leaves', 'texture-ocean',
    'texture-grunge', 'texture-green'
  ];
  var hero = document.querySelector('header');
  if (hero && !hero.querySelector('.rsum')) {
    // Gradient shows immediately via the --cover:none default in CSS. Only fetch
    // the decorative texture on larger screens, so phones skip the big download.
    hero.classList.add('cs-hero', 'has-cover');
    if (window.innerWidth > 880) {
      var pick = TEXTURES[Math.floor(Math.random() * TEXTURES.length)];
      var url = 'https://cdn.mehtapratik.com/cover%20images/' + pick + '.webp';
      hero.style.setProperty('--cover', "url('" + url + "')");
    }
  }

  // Scroll reveal for project cards
  var cards = document.querySelectorAll('.p');
  if ('IntersectionObserver' in window && cards.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (el, i) {
      el.style.transitionDelay = (i % 2 * 0.08) + 's';
      io.observe(el);
    });
  } else {
    cards.forEach(function (el) { el.classList.add('in'); });
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);
    var setOpen = function (open) {
      toggle.classList.toggle('open', open);
      links.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(!links.classList.contains('open'));
    });
    scrim.addEventListener('click', function () { setOpen(false); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Work filter
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    var btns = filterBar.querySelectorAll('button');
    var items = document.querySelectorAll('.proj .p');
    filterBar.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button');
      if (!btn) return;
      btns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        var tags = (it.getAttribute('data-tags') || '').split(' ');
        var show = (f === 'all') || tags.indexOf(f) !== -1;
        it.hidden = !show;
      });
    });
  }
})();
