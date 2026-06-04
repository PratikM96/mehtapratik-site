/* Pratik Mehta / Kinetic Teal. Shared behavior: scroll reveal + work filter. */
(function () {
  // Random hero texture background. Picks one of the abstract textures on every
  // page load and sets it as the hero cover. Skips the resume header (kept clean
  // for scanning and print).
  var TEXTURES = [
    'texture-dealnews', 'texture-fiveeighty', 'texture-frc', 'texture-jmtp',
    'texture-photography', 'texture-pipeline', 'texture-raa', 'texture-sportime',
    'texture-srlc'
  ];
  var hero = document.querySelector('header');
  if (hero && !hero.querySelector('.rsum')) {
    var pick = TEXTURES[Math.floor(Math.random() * TEXTURES.length)];
    var url = 'https://cdn.mehtapratik.com/cover%20images/' + pick + '.webp';
    hero.classList.add('cs-hero', 'has-cover');
    hero.style.setProperty('--cover', "url('" + url + "')");
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
    // inject a scrim that dims the page behind the open menu
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
    // close when a link is tapped
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    // close on Escape
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
