// VHL Lab Services — Application Logic
// Viva Health Laboratories 2025

(function () {
  'use strict';

  /* =========================================
     STATE
  ========================================= */
  let currentTab = 'screens';       // 'screens' | 'tests'
  let searchQuery = '';
  let activeCategory = 'All';
  let activeScreenCategory = 'All';

  /* =========================================
     HASH ROUTER
  ========================================= */
  const SECTIONS = ['home', 'services', 'tests', 'sample-guide', 'contact'];

  function getHash() {
    const hash = location.hash.replace('#', '') || 'home';
    return SECTIONS.includes(hash) ? hash : 'home';
  }

  function navigate(sectionId, pushState = true) {
    // Hide all sections
    SECTIONS.forEach(id => {
      const el = document.getElementById('section-' + id);
      if (el) el.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Update hash
    if (pushState) {
      history.pushState(null, '', '#' + sectionId);
    }

    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.remove('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', () => navigate(getHash(), false));
  window.addEventListener('load', () => navigate(getHash(), false));

  /* =========================================
     MOBILE NAV
  ========================================= */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.textContent = open ? '✕' : '☰';
    });
  }

  /* =========================================
     RENDER HELPERS
  ========================================= */

  function renderTestCards(tests) {
    if (!tests.length) {
      return `<div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <p>No tests match your search. Try a different term or category.</p>
      </div>`;
    }
    return tests.map(t => `
      <article class="test-card" itemscope itemtype="https://schema.org/MedicalTest">
        <div class="test-card__header">
          <h3 class="test-card__name" itemprop="name">${t.name}</h3>
          <span class="test-card__code" title="Test code">${t.code}</span>
        </div>
        <div class="test-card__meta">
          <span class="test-card__sample">🧪 ${t.sampleType}</span>
          <span class="test-card__turnaround">⏱ ${t.turnaround}</span>
        </div>
        <span class="badge badge--teal" style="font-size:0.7rem;margin-bottom:${t.notes ? '0.5rem' : '0'}">${t.category}</span>
        ${t.notes ? `<p class="test-card__notes">${t.notes}</p>` : ''}
      </article>
    `).join('');
  }

  function renderScreenCards(screens) {
    if (!screens.length) {
      return `<div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <p>No panels match your filter. Try selecting a different category.</p>
      </div>`;
    }
    return screens.map(s => `
      <article class="screen-card" itemscope itemtype="https://schema.org/MedicalTest">
        <div class="screen-card__header">
          <span class="screen-card__icon" aria-hidden="true">${s.icon}</span>
          <div>
            <h3 class="screen-card__title" itemprop="name">${s.name}</h3>
            <span class="badge badge--teal">${s.category}</span>
          </div>
        </div>
        <div class="screen-card__body">
          <p class="screen-card__desc" itemprop="description">${s.description}</p>
          <div class="screen-card__includes">
            <p class="includes-label">Includes</p>
            <div class="includes-list">
              ${s.includes.map(item => `<span class="includes-tag">${item}</span>`).join('')}
            </div>
          </div>
          <div class="screen-card__footer">
            <span class="screen-card__sample">🧪 ${s.sampleType}</span>
            <span class="screen-card__turnaround">⏱ ${s.turnaround}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderTubeCards(tubes) {
    return tubes.map(tube => {
      const useTagBg = tube.colour + '18';
      return `
        <article class="tube-card">
          <div class="tube-card__top" style="background:${tube.colour}"></div>
          <div class="tube-card__body">
            <div class="tube-card__header">
              <div class="tube-dot" style="background:${tube.colour};border-color:${tube.colour}"></div>
              <h3 class="tube-card__name">${tube.colourName} — ${tube.cap}</h3>
            </div>
            <p class="tube-card__additive"><strong>Additive:</strong> ${tube.additive}</p>
            <div class="tube-uses">
              <p class="tube-uses__label">Used for</p>
              ${tube.uses.map(u => `<span class="tube-use-tag" style="background:${useTagBg};color:${tube.colour}">${u}</span>`).join('')}
            </div>
            <p class="tube-card__notes">${tube.notes}</p>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderTeam(team) {
    return team.map(member => `
      <div class="team-card">
        <div class="team-avatar" aria-hidden="true">${member.name.charAt(0)}</div>
        <div class="team-card__info">
          <h4>${member.name}</h4>
          <p class="team-card__role">${member.role} — ${member.department}</p>
          <a class="team-card__email" href="mailto:${member.email}">${member.email}</a>
        </div>
      </div>
    `).join('');
  }

  function renderDepts(depts) {
    return depts.map(d => `
      <div class="dept-card">
        <div class="dept-card__header">
          <span class="dept-card__icon" aria-hidden="true">${d.icon}</span>
          <h4 class="dept-card__name">${d.name}</h4>
        </div>
        <p class="dept-card__desc">${d.description}</p>
        <a class="dept-card__email" href="mailto:${d.email}">${d.email}</a>
        <p class="dept-card__hours">${d.hours}</p>
      </div>
    `).join('');
  }

  function renderServices(services) {
    return services.map(s => `
      <div class="service-card" itemscope itemtype="https://schema.org/Service">
        <div class="service-card__header">
          <div class="service-card__icon" aria-hidden="true">${s.icon}</div>
          <h3 class="service-card__title" itemprop="name">${s.title}</h3>
          <div>
            <span class="service-card__price">${s.price}</span>
            <span class="service-card__price-note"> ${s.priceNote}</span>
          </div>
        </div>
        <div class="service-card__body">
          <p class="service-card__desc" itemprop="description">${s.description}</p>
          <ul class="service-card__features">
            ${s.features.map(f => `<li class="feature-item">${f}</li>`).join('')}
          </ul>
          <p class="service-card__booking">📅 ${s.booking}</p>
        </div>
      </div>
    `).join('');
  }

  /* =========================================
     TESTS SECTION
  ========================================= */

  function getFilteredTests() {
    let tests = INDIVIDUAL_TESTS;
    if (activeCategory !== 'All') {
      tests = tests.filter(t => t.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tests = tests.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.sampleType.toLowerCase().includes(q)
      );
    }
    return tests;
  }

  function getFilteredScreens() {
    if (activeScreenCategory === 'All') return VHL_SCREENS;
    return VHL_SCREENS.filter(s => s.category === activeScreenCategory);
  }

  function renderTestsContent() {
    const grid = document.getElementById('test-grid');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    if (currentTab === 'tests') {
      const filtered = getFilteredTests();
      grid.innerHTML = renderTestCards(filtered);
      if (countEl) countEl.textContent = `${filtered.length} test${filtered.length !== 1 ? 's' : ''}`;
    } else {
      const filtered = getFilteredScreens();
      grid.className = 'screens-grid';
      grid.innerHTML = renderScreenCards(filtered);
      if (countEl) countEl.textContent = `${filtered.length} panel${filtered.length !== 1 ? 's' : ''}`;
    }
  }

  function initTests() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Switch filter row visibility
        const testFilters = document.getElementById('test-filters');
        const screenFilters = document.getElementById('screen-filters');
        const searchRow = document.getElementById('search-row');

        if (currentTab === 'tests') {
          grid.className = 'test-grid';
          if (testFilters) testFilters.classList.remove('hidden');
          if (screenFilters) screenFilters.classList.add('hidden');
          if (searchRow) searchRow.classList.remove('hidden');
        } else {
          grid.className = 'screens-grid';
          if (testFilters) testFilters.classList.add('hidden');
          if (screenFilters) screenFilters.classList.remove('hidden');
          if (searchRow) searchRow.classList.add('hidden');
        }

        searchQuery = '';
        activeCategory = 'All';
        const searchEl = document.getElementById('test-search');
        if (searchEl) searchEl.value = '';
        document.querySelectorAll('#test-filters .pill').forEach(p => p.classList.remove('active'));
        const allPill = document.querySelector('#test-filters .pill[data-cat="All"]');
        if (allPill) allPill.classList.add('active');

        renderTestsContent();
      });
    });

    // Search
    const searchEl = document.getElementById('test-search');
    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderTestsContent();
      });
    }

    // Category filter pills (individual tests)
    const testFilters = document.getElementById('test-filters');
    if (testFilters) {
      testFilters.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          activeCategory = pill.dataset.cat;
          testFilters.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          renderTestsContent();
        });
      });
    }

    // Category filter pills (VHL Screens)
    const screenFilters = document.getElementById('screen-filters');
    if (screenFilters) {
      screenFilters.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          activeScreenCategory = pill.dataset.cat;
          screenFilters.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          renderTestsContent();
        });
      });
    }

    // Initial render
    const grid = document.getElementById('test-grid');
    if (grid) {
      grid.className = 'screens-grid';
      renderTestsContent();
    }
  }

  /* =========================================
     ACCORDION
  ========================================= */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        if (!item) return;
        const body = item.querySelector('.accordion-body');
        const isOpen = body && body.classList.contains('open');

        // Close all
        document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
        document.querySelectorAll('.accordion-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));

        // Toggle clicked
        if (!isOpen) {
          if (body) body.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* =========================================
     POPULATE DYNAMIC CONTENT
  ========================================= */
  function populateServices() {
    const container = document.getElementById('services-grid');
    if (container) container.innerHTML = renderServices(SERVICES);
  }

  function populateTubes() {
    const container = document.getElementById('tube-grid');
    if (container) container.innerHTML = renderTubeCards(TUBE_TYPES);
  }

  function populateTeam() {
    const teamContainer = document.getElementById('team-grid');
    if (teamContainer) teamContainer.innerHTML = renderTeam(TEAM);
    const deptContainer = document.getElementById('dept-grid');
    if (deptContainer) deptContainer.innerHTML = renderDepts(DEPARTMENTS);
  }

  function populateFooterLinks() {
    const el = document.getElementById('footer-company-phone');
    if (el) el.textContent = COMPANY.phone;
    const emailEl = document.getElementById('footer-company-email');
    if (emailEl) emailEl.href = 'mailto:' + COMPANY.emails.accountManagers;
  }

  /* =========================================
     FILTER PILLS BUILDER
  ========================================= */
  function buildFilterPills(containerId, categories, onClickKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = categories.map((cat, i) => `
      <button class="pill${i === 0 ? ' active' : ''}" data-cat="${cat}"
        aria-pressed="${i === 0}">${cat}</button>
    `).join('');
  }

  /* =========================================
     NAV LINK EVENTS
  ========================================= */
  function initNavLinks() {
    document.querySelectorAll('[data-section]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(el.dataset.section);
      });
    });
  }

  /* =========================================
     STRUCTURED DATA (JSON-LD) — injected at runtime
  ========================================= */
  function injectStructuredData() {
    const faqItems = REJECTION_REASONS.map(r => ({
      '@type': 'Question',
      name: r.title,
      acceptedAnswer: { '@type': 'Answer', text: r.description + ' Resolution: ' + r.resolution }
    }));

    const orgSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'MedicalOrganization'],
          '@id': 'https://www.vivahealthlaboratories.com/#org',
          name: COMPANY.name,
          alternateName: COMPANY.shortName,
          url: 'https://www.' + COMPANY.website,
          telephone: COMPANY.phone,
          email: COMPANY.emails.accountManagers,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'GB',
            streetAddress: COMPANY.address,
          },
          contactPoint: [
            { '@type': 'ContactPoint', telephone: COMPANY.phone, contactType: 'customer service' },
            { '@type': 'ContactPoint', email: COMPANY.emails.accountManagers, contactType: 'account management' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqItems,
        },
      ],
    };

    const script = document.getElementById('json-ld');
    if (script) script.textContent = JSON.stringify(orgSchema, null, 2);
  }

  /* =========================================
     INIT
  ========================================= */
  function init() {
    // Build filter pills
    buildFilterPills('test-filters', TEST_CATEGORIES);
    buildFilterPills('screen-filters', SCREEN_CATEGORIES);

    // Populate sections
    populateServices();
    populateTubes();
    populateTeam();
    populateFooterLinks();
    injectStructuredData();

    // Wire up interactivity
    initNavLinks();
    initMobileNav();
    initAccordions();
    initTests();

    // Initial route
    navigate(getHash(), false);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
