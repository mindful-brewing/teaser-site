(function () {
  var pourFill = document.querySelector('.pour-fill');
  if (!pourFill) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var target = 0;   // where scroll says the level should be (0-1)
  var current = 0;   // where we're actually rendering it (eases toward target)
  var rafId = null;

  function computeTarget() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    target = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    // liquid "catches up" to the target level instead of snapping to it —
    // faster when far away, gently settling as it approaches.
    var diff = target - current;
    if (Math.abs(diff) < 0.0008) {
      current = target;
    } else {
      current += diff * 0.09;
    }
    pourFill.style.setProperty('--pour', (current * 100) + '%');
    if (current !== target) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  if (reduceMotion) {
    computeTarget();
    current = target;
    pourFill.style.setProperty('--pour', (current * 100) + '%');
  } else {
    window.addEventListener('scroll', computeTarget, { passive: true });
    window.addEventListener('resize', computeTarget);
    computeTarget();
  }
})();
