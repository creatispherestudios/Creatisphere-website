// Creatisphere Studios — shared script, loaded on every page

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Fade sections in as they scroll into view
const revealEls = document.querySelectorAll('.reveal');

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
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Highlight the current page in the nav
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a[href]:not(.btn)').forEach((link) => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Email links open the visitor's mail app. Not every computer has one set up,
// so the address is also copied and a short note says so.
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

if (emailLinks.length) {
  const note = document.createElement('div');
  note.className = 'copy-note';
  note.setAttribute('role', 'status');
  document.body.appendChild(note);
  let noteTimer;

  emailLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const address = link.getAttribute('href').replace('mailto:', '').split('?')[0];
      const show = (text) => {
        note.textContent = text;
        note.classList.add('show');
        clearTimeout(noteTimer);
        noteTimer = setTimeout(() => note.classList.remove('show'), 6000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(
          () => show('Opening your email app. If nothing opens, our address is copied: paste it into a new email.'),
          () => show('Opening your email app.')
        );
      } else {
        show('Opening your email app.');
      }
    });
  });
}

// Magazine flip viewer (Galaxy only — no-ops elsewhere)
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

// Service selector and contact form (Join the Universe only — no-ops elsewhere)
const consult = document.getElementById('consult');

if (consult) {
  const items = Array.from(consult.querySelectorAll('.acc-item'));
  const boxes = Array.from(consult.querySelectorAll('input[name="services[]"]'));
  const intake = consult.querySelector('[data-intake]');
  const summaryList = consult.querySelector('.summary-list');
  const summaryEmpty = consult.querySelector('.summary-empty');
  const summaryField = consult.querySelector('input[name="selection-summary"]');
  const continueLinks = Array.from(consult.querySelectorAll('[data-continue]'));
  const bar = consult.querySelector('[data-bar]');
  const barCount = consult.querySelector('[data-bar-count]');
  const otherBox = consult.querySelector('[data-other-toggle]');
  const otherField = consult.querySelector('[data-other-field]');
  const followUps = Array.from(consult.querySelectorAll('[data-show-for]'));

  let intakeInView = false;

  // Accordion: opening one element closes the others, but checked groups stay checked
  function setOpen(item, open) {
    item.querySelector('.acc-head').setAttribute('aria-expanded', open ? 'true' : 'false');
    item.querySelector('.acc-panel').hidden = !open;
  }

  items.forEach((item) => {
    setOpen(item, false);
    item.querySelector('.acc-head').addEventListener('click', () => {
      const wasOpen = !item.querySelector('.acc-panel').hidden;
      items.forEach((other) => setOpen(other, false));
      setOpen(item, !wasOpen);
    });
  });

  function updateBar() {
    bar.hidden = intakeInView || !boxes.some((box) => box.checked);
  }

  // Running summary of selected groups. The contact form appears once something is selected.
  function renderSummary() {
    const checked = boxes.filter((box) => box.checked);

    boxes.forEach((box) => box.closest('.group-option').classList.toggle('is-selected', box.checked));

    summaryList.innerHTML = '';
    items.forEach((item) => {
      const inItem = checked.filter((box) => item.contains(box));
      const count = item.querySelector('.acc-count');
      count.textContent = inItem.length ? inItem.length + ' selected' : '';
      count.hidden = !inItem.length;
      if (!inItem.length) return;

      const group = document.createElement('div');
      group.className = 'summary-group';

      const heading = document.createElement('h3');
      heading.textContent = item.dataset.name;
      const mini = document.createElement('small');
      mini.textContent = item.dataset.mini;
      heading.appendChild(mini);
      group.appendChild(heading);

      const list = document.createElement('ul');
      inItem.forEach((box) => {
        const row = document.createElement('li');
        const label = document.createElement('span');
        label.textContent = box.dataset.label;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'summary-remove';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', 'Remove ' + box.dataset.label);
        remove.addEventListener('click', () => {
          box.checked = false;
          renderSummary();
        });
        row.appendChild(label);
        row.appendChild(remove);
        list.appendChild(row);
      });
      group.appendChild(list);
      summaryList.appendChild(group);
    });

    // Follow up questions only show for what was selected, and only those answers are sent
    followUps.forEach((block) => {
      const show = block.dataset.showFor.split(' ').some((id) => document.getElementById(id).checked);
      block.hidden = !show;
      block.querySelectorAll('input').forEach((input) => { input.disabled = !show; });
    });

    const any = checked.length > 0;
    summaryEmpty.hidden = any;
    intake.hidden = !any;
    continueLinks.forEach((link) => { link.hidden = !any; });
    barCount.textContent = checked.length + (checked.length === 1 ? ' group selected' : ' groups selected');
    summaryField.value = checked.map((box) => box.value).join('; ');
    updateBar();
  }

  boxes.forEach((box) => box.addEventListener('change', renderSummary));

  // Continue takes you straight to the form
  continueLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      intake.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      intakeInView = entries[0].isIntersecting;
      updateBar();
    }).observe(intake);
  }

  // "Something else" reveals a short text field
  function syncOther() {
    otherField.hidden = !otherBox.checked;
  }
  otherBox.addEventListener('change', syncOther);
  consult.querySelectorAll('.choices input').forEach((box) => {
    box.addEventListener('change', () => box.closest('.group-option').classList.toggle('is-selected', box.checked));
  });

  // Nothing is sent without at least one selection
  consult.addEventListener('submit', (e) => {
    if (!boxes.some((box) => box.checked)) e.preventDefault();
  });

  // Links from element pages can open an element or preselect a group
  const params = new URLSearchParams(window.location.search);
  const preselect = document.getElementById(params.get('select') || '');
  if (preselect && boxes.includes(preselect)) preselect.checked = true;
  const openName = preselect ? preselect.closest('.acc-item').dataset.element : params.get('element');
  const openItem = items.find((item) => item.dataset.element === openName);
  if (openItem) setOpen(openItem, true);

  syncOther();
  renderSummary();
}
