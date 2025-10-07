document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.sidebar__nav .nav-link'));
  const sections = Array.from(document.querySelectorAll('.content > section'));
  const navToggle = document.querySelector('[data-toggle="nav"]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  const openNav = () => {
    document.body.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);

      if (!target) {
        return;
      }

      event.preventDefault();

      if (!prefersReducedMotion) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        target.scrollIntoView();
      }

      history.replaceState(null, '', hash);
      closeNav();
    });
  });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeNav();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0.1, 0.25],
    }
  );

  sections.forEach((section) => observer.observe(section));

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const publicationTabs = Array.from(document.querySelectorAll('.pub-tab'));
  const publicationSlider = document.querySelector('.publication-slider');
  const publicationTrack = publicationSlider ? publicationSlider.querySelector('.publication-track') : null;
  const publicationGroups = publicationTrack ? Array.from(publicationTrack.querySelectorAll('.publication-group')) : [];
  let activePublicationIndex = Math.max(
    0,
    publicationTabs.findIndex((tab) => tab.classList.contains('active'))
  );

  const setPublicationHeight = () => {
    if (!publicationSlider || !publicationGroups.length) {
      return;
    }
    const activeGroup = publicationGroups[activePublicationIndex];
    if (!activeGroup) {
      return;
    }
    publicationSlider.style.height = `${activeGroup.offsetHeight}px`;
  };

  const activatePublicationTab = (index) => {
    if (!publicationTrack || index < 0 || index >= publicationGroups.length) {
      return;
    }

    activePublicationIndex = index;
    const activeGroup = publicationGroups[index];
    const activeTarget = activeGroup?.dataset.tab;

    publicationTrack.style.transform = `translateX(-${index * 100}%)`;

    publicationTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    publicationGroups.forEach((group, groupIndex) => {
      group.setAttribute('aria-hidden', groupIndex === index ? 'false' : 'true');
    });

    if (publicationSlider && activeTarget) {
      publicationSlider.setAttribute('data-active', activeTarget);
    }

    setPublicationHeight();
  };

  if (publicationTabs.length && publicationTrack && publicationGroups.length) {
    if (publicationSlider) {
      publicationSlider.setAttribute('data-enhanced', 'true');
    }

    publicationTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        const targetIndex = publicationGroups.findIndex((group) => group.dataset.tab === target);
        if (targetIndex !== -1) {
          activatePublicationTab(targetIndex);
        }
      });

      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
          return;
        }

        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        let nextIndex = (activePublicationIndex + direction + publicationGroups.length) % publicationGroups.length;
        activatePublicationTab(nextIndex);
        publicationTabs[nextIndex].focus();
      });
    });

    window.addEventListener('resize', () => {
      setPublicationHeight();
    });

    activatePublicationTab(activePublicationIndex);
    window.setTimeout(setPublicationHeight, 100);
  }

  const lifeSlider = document.querySelector('[data-life-slider]');

  if (lifeSlider) {
    const lifeTrack = lifeSlider.querySelector('.life-track');
    const lifeSlides = lifeTrack ? Array.from(lifeTrack.children) : [];
    const prevButton = lifeSlider.querySelector('[data-life-prev]');
    const nextButton = lifeSlider.querySelector('[data-life-next]');
    const lightbox = document.querySelector('[data-life-lightbox]');
    const lightboxImage = lightbox ? lightbox.querySelector('[data-life-lightbox-image]') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('[data-life-lightbox-caption]') : null;
    const lightboxCloseElements = lightbox ? Array.from(lightbox.querySelectorAll('[data-life-close]')) : [];
    let lifeIndex = 0;

    const updateLifeSlider = () => {
      if (!lifeTrack || !lifeSlides.length) {
        return;
      }

      lifeTrack.style.transform = `translateX(-${lifeIndex * 100}%)`;

      if (prevButton) {
        prevButton.disabled = lifeIndex === 0;
      }

      if (nextButton) {
        nextButton.disabled = lifeIndex === lifeSlides.length - 1;
      }
    };

    const goToLifeSlide = (index) => {
      if (index < 0 || index >= lifeSlides.length) {
        return;
      }

      lifeIndex = index;
      updateLifeSlider();
    };

    if (lifeSlider && lifeSlides.length > 1) {
      lifeSlider.setAttribute('data-enhanced', 'true');
    }

    const openLightbox = (slide) => {
      if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
      }

      const image = slide.querySelector('img');
      const caption = slide.querySelector('figcaption');
      if (!image) {
        return;
      }

      lightboxImage.src = image.getAttribute('src') || '';
      lightboxImage.alt = image.getAttribute('alt') || '';
      lightboxCaption.textContent = caption ? caption.textContent : '';

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeButton = lightbox.querySelector('.life-lightbox__close');
      if (closeButton) {
        closeButton.focus();
      }
    };

    const closeLightbox = () => {
      if (!lightbox) {
        return;
      }
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    lifeSlides.forEach((slide, index) => {
      const image = slide.querySelector('img');
      if (!image) {
        return;
      }
      image.addEventListener('click', () => {
        openLightbox(slide);
      });

      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(slide);
        }
      });
      image.setAttribute('tabindex', '0');
    });

    lightboxCloseElements.forEach((element) => {
      element.addEventListener('click', () => {
        closeLightbox();
      });
    });

    if (lightbox) {
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
          closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', (event) => {
      if (!lightbox || !lightbox.classList.contains('is-open')) {
        return;
      }

      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToLifeSlide(Math.max(0, lifeIndex - 1));
        const targetSlide = lifeSlides[lifeIndex];
        if (targetSlide) {
          openLightbox(targetSlide);
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToLifeSlide(Math.min(lifeSlides.length - 1, lifeIndex + 1));
        const targetSlide = lifeSlides[lifeIndex];
        if (targetSlide) {
          openLightbox(targetSlide);
        }
      }
    });

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        goToLifeSlide(lifeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        goToLifeSlide(lifeIndex + 1);
      });
    }

    lifeSlider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToLifeSlide(lifeIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToLifeSlide(lifeIndex - 1);
      }
    });

    updateLifeSlider();
  }
});
