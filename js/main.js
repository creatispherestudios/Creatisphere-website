// CreatiSphere Studios — shared script, loaded on every page

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Fade sections in as they scroll into view (including staggered card grids)
const revealEls = document.querySelectorAll('.reveal, .stagger-group');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Discover page: category filter pills + search
const filterPills = document.querySelectorAll('.filter-pill');
const creatorCards = document.querySelectorAll('.creator-scroller .creator-card');
const searchInput = document.querySelector('.search-input');
const noResults = document.querySelector('.no-results');
let activeCategory = 'all';

function applyDiscoverFilters() {
  if (!creatorCards.length) return;
  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
  let visibleCount = 0;

  creatorCards.forEach((card) => {
    const category = card.dataset.category || '';
    const searchText = (card.dataset.search || card.textContent).toLowerCase();
    const matchesCategory = activeCategory === 'all' || category === activeCategory;
    const matchesQuery = !query || searchText.includes(query);
    const show = matchesCategory && matchesQuery;
    card.style.display = show ? '' : 'none';
    if (show) visibleCount += 1;
  });

  if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

if (filterPills.length) {
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      applyDiscoverFilters();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', applyDiscoverFilters);
}

// Discover page: creator profile modal
const profileModal = document.querySelector('.profile-modal');

if (profileModal && creatorCards.length) {
  const modalPhoto = profileModal.querySelector('.profile-photo');
  const modalName = profileModal.querySelector('.profile-name');
  const modalRole = profileModal.querySelector('.profile-role');
  const modalLoc = profileModal.querySelector('.profile-loc');
  const modalBio = profileModal.querySelector('.profile-bio');
  const modalSkills = profileModal.querySelector('.profile-skills');
  const modalInterests = profileModal.querySelector('.profile-interests');
  const closeBtn = profileModal.querySelector('.profile-close');

  function openProfile(card) {
    const d = card.dataset;
    if (modalPhoto) { modalPhoto.src = d.img || ''; modalPhoto.alt = d.name || ''; }
    if (modalName) modalName.textContent = d.name || '';
    if (modalRole) modalRole.textContent = d.role || '';
    if (modalLoc) modalLoc.textContent = d.location || '';
    if (modalBio) modalBio.textContent = d.bio || '';
    if (modalSkills) {
      modalSkills.innerHTML = '';
      (d.skills || '').split(',').filter(Boolean).forEach((skill) => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = skill.trim();
        modalSkills.appendChild(chip);
      });
    }
    if (modalInterests) {
      modalInterests.innerHTML = '';
      (d.interests || '').split(',').filter(Boolean).forEach((interest) => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = interest.trim();
        modalInterests.appendChild(chip);
      });
    }
    profileModal.classList.add('open');
  }

  creatorCards.forEach((card) => {
    card.addEventListener('click', () => openProfile(card));
  });

  if (closeBtn) closeBtn.addEventListener('click', () => profileModal.classList.remove('open'));
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') profileModal.classList.remove('open');
  });
}

// Highlight the current page in the nav
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});
