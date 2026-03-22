/* ============================================================
   Animations — Scroll reveals, counters, typing effect
   ============================================================ */

(function() {
  // Respect reduced motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll Reveal (IntersectionObserver) ────────────────
  var revealElements = document.querySelectorAll('.reveal, .reveal--scale, .reveal--fade, .reveal--slide-left, .reveal--slide-right');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) {
      if (prefersReducedMotion) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // ── Animated Counters ───────────────────────────────────
  var counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals')) || 0;
    var duration = 2000;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    if (prefersReducedMotion) {
      el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    } else {
      requestAnimationFrame(update);
    }
  }

  // ── Typing Effect ───────────────────────────────────────
  var heroHeadline = document.getElementById('hero-headline');

  if (heroHeadline) {
    var text = 'Protect Your Data. Accelerate Your Business.';

    if (prefersReducedMotion) {
      heroHeadline.textContent = text;
    } else {
      var i = 0;
      heroHeadline.innerHTML = '<span class="typing-cursor"></span>';

      function typeChar() {
        if (i < text.length) {
          heroHeadline.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
          i++;
          setTimeout(typeChar, 50 + Math.random() * 30);
        } else {
          // Remove cursor after a delay
          setTimeout(function() {
            heroHeadline.innerHTML = text;
          }, 2000);
        }
      }

      // Start after a brief delay
      setTimeout(typeChar, 500);
    }
  }

  // ── Timeline Items ──────────────────────────────────────
  var timelineItems = document.querySelectorAll('.timeline__item');
  if (timelineItems.length > 0 && 'IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    timelineItems.forEach(function(el) {
      timelineObserver.observe(el);
    });
  }

  // ── Scroll-Pinned Capability Sections ──────────────────
  var capSections = document.querySelectorAll('.cap-section');

  if (capSections.length > 0 && !prefersReducedMotion) {
    window.addEventListener('scroll', function() {
      capSections.forEach(function(section) {
        var sticky = section.querySelector('.cap-section__sticky');
        if (!sticky) return;

        var stepCount = section.querySelectorAll('.cap-step').length / 1; // count unique steps
        // Get unique step count from first visual
        var visual = section.querySelector('.cap-section__visual');
        if (visual) {
          stepCount = visual.querySelectorAll('.cap-step').length;
        }
        if (stepCount === 0) return;

        var rect = section.getBoundingClientRect();
        var sectionHeight = section.offsetHeight;
        var viewportHeight = window.innerHeight;

        // How far we've scrolled into this section
        var scrolled = -rect.top;
        var scrollable = sectionHeight - viewportHeight;

        if (scrollable <= 0) return;

        var progress = Math.max(0, Math.min(1, scrolled / scrollable));

        // Map progress to step index
        var step = Math.min(stepCount - 1, Math.floor(progress * stepCount));
        sticky.setAttribute('data-step', step);
      });
    }, { passive: true });
  }
})();
