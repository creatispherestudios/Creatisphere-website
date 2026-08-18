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

// Highlight the current page in the nav
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});

// Magazine flip viewer (Growth Galaxy only — no-ops elsewhere)
const magazineViewer = document.getElementById('magazineViewer');

if (magazineViewer) {
  const pageEls = Array.from(document.querySelectorAll('[data-magazine-index]'));
  const pages = pageEls.map((el) => ({
    src: el.getAttribute('data-src'),
    title: el.getAttribute('data-title'),
  }));

  const pageWrap = magazineViewer.querySelector('.viewer-page-wrap');
  const viewerImg = magazineViewer.querySelector('.viewer-page');
  const viewerTitle = magazineViewer.querySelector('.viewer-title');
  const viewerCount = magazineViewer.querySelector('.viewer-count');
  const prevBtn = magazineViewer.querySelector('.viewer-prev');
  const nextBtn = magazineViewer.querySelector('.viewer-next');
  const closeBtn = magazineViewer.querySelector('.viewer-close');

  let currentIndex = 0;

  function showPage(index) {
    const page = pages[index];
    viewerImg.src = page.src;
    viewerImg.alt = page.title;
    viewerTitle.textContent = page.title;
    viewerCount.textContent = 'Page ' + (index + 1) + ' of ' + pages.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
  }

  function goToPage(index) {
    if (index < 0 || index >= pages.length || index === currentIndex) return;
    currentIndex = index;
    pageWrap.classList.remove('flip-in');
    pageWrap.classList.add('flip-out');
    setTimeout(() => {
      showPage(currentIndex);
      pageWrap.classList.remove('flip-out');
      pageWrap.classList.add('flip-in');
    }, 260);
  }

  function openViewer(index) {
    currentIndex = index;
    showPage(currentIndex);
    magazineViewer.classList.add('open');
    magazineViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    magazineViewer.classList.remove('open');
    magazineViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  pageEls.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openViewer(i);
    });
  });

  document.querySelectorAll('[data-open-magazine]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openViewer(0);
    });
  });

  closeBtn.addEventListener('click', closeViewer);
  prevBtn.addEventListener('click', () => goToPage(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToPage(currentIndex + 1));

  magazineViewer.addEventListener('click', (e) => {
    if (e.target === magazineViewer) closeViewer();
  });

  document.addEventListener('keydown', (e) => {
    if (!magazineViewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight') goToPage(currentIndex + 1);
    if (e.key === 'ArrowLeft') goToPage(currentIndex - 1);
  });
}
