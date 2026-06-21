/* ============================================
   LIFELINE FITNESS GYM - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 2000);
  });

  // Fallback: hide preloader after 3s even if load event doesn't fire
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 3500);

  // ---- Sticky Navbar ----
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);

  // ---- Hamburger Menu ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Initial check
  setTimeout(revealOnScroll, 100);

  // ---- Animated Counter ----
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const statTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (statTop < windowHeight - 50) {
      countersAnimated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
          }
        };

        updateCounter();
      });
    }
  };

  window.addEventListener('scroll', animateCounters);
  setTimeout(animateCounters, 500);

  // ---- Gallery Filter ----
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  // ---- Gallery Lightbox ----
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentLightboxIndex = 0;
  let visibleGalleryItems = [];

  const getVisibleItems = () => {
    return Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  const openLightbox = (index) => {
    visibleGalleryItems = getVisibleItems();
    currentLightboxIndex = index;
    const img = visibleGalleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction) => {
    visibleGalleryItems = getVisibleItems();
    currentLightboxIndex = (currentLightboxIndex + direction + visibleGalleryItems.length) % visibleGalleryItems.length;
    const img = visibleGalleryItems[currentLightboxIndex].querySelector('img');
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.opacity = '1';
    }, 200);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  // Close lightbox on overlay click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ---- Scroll to Top ----
  const scrollTopBtn = document.querySelector('.scroll-top');

  const toggleScrollTop = () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleScrollTop);

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax Effect on Hero ----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    });
  }

});
