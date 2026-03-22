/* ============================================================
   Interactive Product Walkthrough Engine
   ============================================================ */

(function() {
  var walkthroughs = {
    home: [
      {
        title: 'Security Dashboard',
        description: 'Get a real-time overview of your data security posture with key metrics, active threats, and compliance status at a glance.',
        spotlightX: '55%', spotlightY: '25%', spotlightSize: '220px',
        tooltipX: '60%', tooltipY: '55%'
      },
      {
        title: 'Data Classification',
        description: 'Automatically classify sensitive data across all your connected sources. PII, PHI, financial data — identified and tagged in seconds.',
        spotlightX: '12%', spotlightY: '55%', spotlightSize: '180px',
        tooltipX: '30%', tooltipY: '20%'
      },
      {
        title: 'Trend Analytics',
        description: 'Track security trends over time with built-in analytics. Identify patterns, measure improvement, and generate compliance-ready reports.',
        spotlightX: '45%', spotlightY: '75%', spotlightSize: '250px',
        tooltipX: '65%', tooltipY: '45%'
      }
    ]
  };

  document.querySelectorAll('[data-walkthrough]').forEach(function(container) {
    var name = container.getAttribute('data-walkthrough');
    var steps = walkthroughs[name];
    if (!steps) return;

    var currentStep = -1;
    var spotlight = container.querySelector('.walkthrough__spotlight');
    var spotlightBg = container.querySelector('.walkthrough__spotlight-bg');
    var tooltip = container.querySelector('.walkthrough__tooltip');
    var dotsContainer = container.querySelector('[id$="-dots"]');
    var prevBtn = container.querySelector('[id$="-prev"]');
    var nextBtn = container.querySelector('[id$="-next"]');

    // Build dots
    steps.forEach(function(_, i) {
      var dot = document.createElement('div');
      dot.className = 'walkthrough__dot';
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.walkthrough__dot');

    function goToStep(index) {
      if (index < 0 || index >= steps.length) return;
      currentStep = index;
      var step = steps[index];

      // Update spotlight
      spotlight.classList.add('is-active');
      spotlightBg.style.clipPath = 'circle(' + step.spotlightSize + ' at ' + step.spotlightX + ' ' + step.spotlightY + ')';
      spotlightBg.style.background = 'rgba(0, 19, 43, 0.7)';
      // Invert clip path for mask effect
      spotlightBg.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)';

      // Use radial gradient instead for spotlight effect
      var sx = step.spotlightX;
      var sy = step.spotlightY;
      var size = step.spotlightSize;
      spotlightBg.style.background = 'radial-gradient(circle ' + size + ' at ' + sx + ' ' + sy + ', transparent 0%, rgba(0, 19, 43, 0.75) 100%)';
      spotlightBg.style.clipPath = 'none';

      // Update tooltip
      tooltip.classList.remove('is-visible');
      setTimeout(function() {
        tooltip.innerHTML =
          '<div class="walkthrough__tooltip-step">Step ' + (index + 1) + ' of ' + steps.length + '</div>' +
          '<div class="walkthrough__tooltip-title">' + step.title + '</div>' +
          '<div class="walkthrough__tooltip-desc">' + step.description + '</div>';
        tooltip.style.left = step.tooltipX;
        tooltip.style.top = step.tooltipY;
        tooltip.style.transform = 'translate(-50%, 0)';
        tooltip.classList.add('is-visible');
      }, 200);

      // Update dots
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });

      // Update button states
      prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = index === steps.length - 1 ? 'Restart' : 'Next';
    }

    nextBtn.addEventListener('click', function() {
      if (currentStep >= steps.length - 1) {
        goToStep(0);
      } else {
        goToStep(currentStep + 1);
      }
    });

    prevBtn.addEventListener('click', function() {
      goToStep(currentStep - 1);
    });

    // Dot click
    dots.forEach(function(dot, i) {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', function() {
        goToStep(i);
      });
    });

    // Start with step 0 when walkthrough scrolls into view
    if ('IntersectionObserver' in window) {
      var wtObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && currentStep === -1) {
          setTimeout(function() { goToStep(0); }, 600);
          wtObserver.unobserve(container);
        }
      }, { threshold: 0.3 });
      wtObserver.observe(container);
    } else {
      goToStep(0);
    }
  });

  // ── FAQ Accordion ─────────────────────────────────────────
  document.querySelectorAll('.faq-item__trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var item = trigger.closest('.faq-item');
      var content = item.querySelector('.faq-item__content');
      var isOpen = item.classList.contains('is-open');

      // Close all others
      document.querySelectorAll('.faq-item.is-open').forEach(function(openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__content').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ── Use Case Card Expand ──────────────────────────────────
  document.querySelectorAll('.use-case-card__header').forEach(function(header) {
    var card = header.closest('.use-case-card');
    var detail = card.querySelector('.use-case-card__detail');
    if (!detail) return;

    header.addEventListener('click', function() {
      var isOpen = card.classList.contains('is-open');
      if (isOpen) {
        card.classList.remove('is-open');
        detail.style.maxHeight = '0';
      } else {
        card.classList.add('is-open');
        detail.style.maxHeight = detail.scrollHeight + 'px';
      }
    });
  });

  // ── Solution Tabs ─────────────────────────────────────────
  document.querySelectorAll('.solution-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-target');
      var container = tab.closest('.section');

      container.querySelectorAll('.solution-tab').forEach(function(t) {
        t.classList.remove('is-active');
      });
      tab.classList.add('is-active');

      container.querySelectorAll('.solution-panel').forEach(function(panel) {
        panel.classList.toggle('is-active', panel.id === target);
      });
    });
  });

  // ── Resource Filter ───────────────────────────────────────
  document.querySelectorAll('.filter-bar__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var filter = btn.getAttribute('data-filter');
      var container = btn.closest('.section');

      container.querySelectorAll('.filter-bar__btn').forEach(function(b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');

      container.querySelectorAll('.resource-card').forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
