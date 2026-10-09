// Jar și Plită: mobile navigation, hero video control, menu category highlighting.
(function () {
  document.documentElement.classList.add('js');

  // --- mobile navigation -------------------------------------------------
  var hdr = document.getElementById('hdr');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (hdr && toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        hdr.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', toggle.dataset.open);
      }
    });
  }

  // --- hero video: honour reduced motion, offer a pause button ------------
  var video = document.querySelector('.hero video');
  var vbtn = document.querySelector('.vbtn');
  if (video) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
    if (vbtn) {
      var setState = function (paused) {
        vbtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        vbtn.setAttribute('aria-label', paused ? vbtn.dataset.play : vbtn.dataset.pause);
      };
      setState(reduce);
      vbtn.addEventListener('click', function () {
        if (video.paused) { video.play(); setState(false); } else { video.pause(); setState(true); }
      });
      video.addEventListener('pause', function () { setState(true); });
      video.addEventListener('play', function () { setState(false); });
    }
  }

  // --- menu page: highlight the category in view -------------------------
  var cats = document.querySelectorAll('.menu-cat[id]');
  var links = document.querySelectorAll('.catnav a[href^="#"]');
  if (cats.length && links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (current) current.removeAttribute('aria-current');
        current = byId[en.target.id];
        if (current) {
          current.setAttribute('aria-current', 'true');
          current.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    cats.forEach(function (c) { io.observe(c); });
  }
})();
