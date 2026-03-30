const navLinks = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll("section[id]");
const fadeSections = document.querySelectorAll("main section");
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const mainElement = document.querySelector("main");
const scrollToTopBtn = document.getElementById("scrollToTop");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const currentLang = document.documentElement.lang === "sl" ? "sl" : "en";
const isPortfolioPage = mainElement?.classList.contains("portfolio-page");

const translations = {
  en: {
    gallery: {
      print: "Print Design",
      banners: "Banner Design",
      social: "Social Media",
      default: "Gallery",
      descriptions: {
        print:
          "This includes business cards, flyers, vehicle wraps, and other printed materials for everyday use.",
        banners:
          "Banners and promotional visuals for web, print, and different types of campaigns.",
        social:
          "Graphics for social media and newsletters, designed to look clear, consistent, and easy to use."
      }
    },
    form: {
      sending: "Sending message...",
      success: "Thank you! Your message has been sent.",
      error: "Something went wrong. Please try again."
    }
  },
  sl: {
    gallery: {
      print: "Tiskovine",
      banners: "Oblikovanje bannerjev",
      social: "Družbena omrežja",
      default: "Galerija",
      descriptions: {
        print:
          "Sem spadajo vizitke, letaki, polepi vozil in drugi tiskani materiali za vsakdanjo uporabo.",
        banners:
          "Bannerji in promocijski vizuali za splet, tisk in različne kampanje.",
        social:
          "Grafike za družbena omrežja in novičnike, pripravljene tako, da delujejo enotno in pregledno."
      }
    },
    form: {
      sending: "Pošiljanje sporočila...",
      success: "Hvala! Vaše sporočilo je bilo poslano.",
      error: "Nekaj je šlo narobe. Poskusite znova."
    }
  }
};

const galleries = {
  print: [
    "obrazky/project4.webp",
    "obrazky/vizitka.webp",
    "obrazky/brozura.webp",
    "obrazky/Grepa_Letak_4_1.webp",
    "obrazky/rollup.webp",
    "obrazky/svatebni-noviny.webp",
    "obrazky/vlajky.webp",
    "obrazky/auto-polep.webp",
    "obrazky/letak-fitness.webp",
    "obrazky/vouchers.webp",
    "obrazky/letak-globus.webp"
  ],
  banners: [
    "obrazky/billboard-douchebags.webp",
    "obrazky/billboard-empreinte.webp",
    "obrazky/banner-halloween.webp",
    "obrazky/billboard-globus.webp",
    "obrazky/billboard-fotak.webp",
    "obrazky/hpbb.webp",
    "obrazky/webbannergrepa.webp"
  ],
  social: [
    "obrazky/kavarnasm.webp",
    "obrazky/smtv.webp",
    "obrazky/alza.webp",
    "obrazky/smpekarka.webp",
    "obrazky/newsletter-lavin.webp",
    "obrazky/newsletteralza.webp"
  ]
};

let isManualScrolling = false;
let manualScrollTimeout;
let cometInterval;
let lastFocusedElement = null;
let currentGallery = [];
let currentIndex = 0;
let currentCategory = "";
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

/* =========================
   HELPERS
========================= */
function getLinkTargetId(href) {
  if (!href || !href.includes("#")) return null;
  return href.split("#")[1];
}

function isMobileView() {
  return window.innerWidth <= 820;
}

function shouldRunBackgroundEffects() {
  return !prefersReducedMotion && !isPortfolioPage && !isMobileView();
}

function debounce(callback, delay = 150) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

/* =========================
   NAV / ACTIVE LINKS
========================= */
function moveIndicator(element) {
  if (!element || !indicator || isMobileView()) return;

  indicator.style.width = `${element.offsetWidth}px`;
  indicator.style.left = `${element.offsetLeft}px`;
}

function setActiveLink(id) {
  let activeLink = null;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const targetId = getLinkTargetId(href);
    const isActive = targetId === id;

    link.classList.toggle("active", isActive);

    if (isActive) {
      activeLink = link;
    }
  });

  if (activeLink) {
    moveIndicator(activeLink);
  }
}

function updateActiveSection() {
  if (isManualScrolling || sections.length === 0) return;

  const triggerPoint = window.innerHeight * 0.35;
  let currentSectionId = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
      currentSectionId = section.id;
    }
  });

  if (currentSectionId) {
    setActiveLink(currentSectionId);
  }
}

function setupNavClicks() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const targetId = getLinkTargetId(href);

      if (!targetId) return;

      const targetSection = document.getElementById(targetId);

      if (href.startsWith("#") && targetSection) {
        e.preventDefault();

        isManualScrolling = true;
        clearTimeout(manualScrollTimeout);

        setActiveLink(targetId);

        targetSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });

        manualScrollTimeout = setTimeout(() => {
          isManualScrolling = false;
          updateActiveSection();
        }, prefersReducedMotion ? 100 : 1000);
      }

      if (navbar && isMobileView()) {
        navbar.classList.remove("open");
      }
    });
  });
}

/* =========================
   STARS
========================= */
function clearStars() {
  document.querySelectorAll(".star").forEach((star) => star.remove());
}

function createStars(numStars) {
  if (!shouldRunBackgroundEffects()) return;

  const fragment = document.createDocumentFragment();
  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * pageHeight;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDuration = `${Math.random() * 2 + 2}s`;

    fragment.appendChild(star);
  }

  document.body.appendChild(fragment);
}

function generateStars() {
  clearStars();

  if (!shouldRunBackgroundEffects()) return;

  createStars(180);
}

/* =========================
   COMETS
========================= */
function createComet() {
  if (!shouldRunBackgroundEffects()) return;

  const cometsContainer = document.getElementById("comets");
  if (!cometsContainer) return;

  const comet = document.createElement("div");
  comet.classList.add("comet");

  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * 200;
  const length = Math.random() * 40 + 40;
  const duration = Math.random() * 1 + 0.8;

  comet.style.left = `${startX}px`;
  comet.style.top = `${startY}px`;
  comet.style.height = `${length}px`;

  comet.animate(
    [
      { transform: "translate(0, 0) rotate(145deg)", opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { transform: "translate(500px, 600px) rotate(145deg)", opacity: 0 }
    ],
    {
      duration: duration * 1000,
      easing: "linear"
    }
  );

  cometsContainer.appendChild(comet);

  setTimeout(() => {
    comet.remove();
  }, duration * 1000);
}

function stopComets() {
  if (cometInterval) {
    clearInterval(cometInterval);
    cometInterval = null;
  }
}

function startComets() {
  stopComets();

  if (!shouldRunBackgroundEffects()) return;

  cometInterval = setInterval(() => {
    if (Math.random() < 0.2) {
      createComet();
    }
  }, 1200);
}

/* =========================
   FADE-IN SECTIONS
========================= */
function setupFadeSections() {
  if (fadeSections.length === 0) return;

  if (prefersReducedMotion) {
    fadeSections.forEach((section) => {
      section.classList.add("visible");
    });
    return;
  }

  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeSections.forEach((section) => {
    section.classList.add("fade-in-section");
    fadeObserver.observe(section);
  });
}

/* =========================
   WEB CAROUSEL
========================= */
function setupCarousel() {
  const carousel = document.getElementById("webCarousel");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (!carousel || !prevBtn || !nextBtn) return;

  function getScrollAmount() {
    const firstSlide = carousel.querySelector(".project-slide");
    if (!firstSlide) return 380;

    const carouselStyles = window.getComputedStyle(carousel);
    const gap = parseFloat(carouselStyles.columnGap || carouselStyles.gap) || 24;

    return firstSlide.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -getScrollAmount(),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: getScrollAmount(),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

/* =========================
   GALLERY MODAL
========================= */
const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const galleryTitle = document.getElementById("galleryTitle");
const galleryDescription = document.getElementById("galleryDescription");
const galleryCounter = document.getElementById("galleryCounter");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryBackdrop = document.querySelector(".gallery-backdrop");
const graphicSlides = document.querySelectorAll(".graphic-slide");

function formatGalleryTitle(category) {
  switch (category) {
    case "print":
      return translations[currentLang].gallery.print;
    case "banners":
      return translations[currentLang].gallery.banners;
    case "social":
      return translations[currentLang].gallery.social;
    default:
      return translations[currentLang].gallery.default;
  }
}

function formatGalleryDescription(category) {
  const descriptions = translations[currentLang].gallery.descriptions;

  switch (category) {
    case "print":
      return descriptions.print;
    case "banners":
      return descriptions.banners;
    case "social":
      return descriptions.social;
    default:
      return "";
  }
}

function updateGalleryImage() {
  if (!galleryImage || !galleryCounter || currentGallery.length === 0) return;

  galleryImage.src = currentGallery[currentIndex];
  galleryImage.alt = `${formatGalleryTitle(currentCategory)} ${currentIndex + 1}`;

  if (galleryTitle) {
    galleryTitle.textContent = formatGalleryTitle(currentCategory);
  }

  if (galleryDescription) {
    galleryDescription.textContent = formatGalleryDescription(currentCategory);
  }

  galleryCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
}

function openGallery(category) {
  if (!galleryModal || !galleries[category]) return;

  lastFocusedElement = document.activeElement;
  currentCategory = category;
  currentGallery = galleries[category];
  currentIndex = 0;

  updateGalleryImage();
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (galleryClose) {
    galleryClose.focus();
  }
}

function closeGallery() {
  if (!galleryModal) return;

  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  currentGallery = [];
  currentIndex = 0;
  currentCategory = "";

  if (galleryImage) {
    galleryImage.src = "";
    galleryImage.alt = "";
  }

  if (galleryTitle) {
    galleryTitle.textContent = "";
  }

  if (galleryDescription) {
    galleryDescription.textContent = "";
  }

  if (galleryCounter) {
    galleryCounter.textContent = "";
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function showNextImage() {
  if (currentGallery.length === 0) return;

  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateGalleryImage();
}

function showPrevImage() {
  if (currentGallery.length === 0) return;

  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateGalleryImage();
}

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 50;

  if (Math.abs(deltaX) < minSwipeDistance) return;
  if (Math.abs(deltaY) > Math.abs(deltaX)) return;

  if (deltaX < 0) {
    showNextImage();
  } else {
    showPrevImage();
  }
}

function setupGallery() {
  if (!graphicSlides.length) return;

  graphicSlides.forEach((slide) => {
    const openCurrentGallery = () => {
      const category = slide.dataset.category;
      if (!category) return;

      openGallery(category);
    };

    slide.addEventListener("click", openCurrentGallery);

    slide.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCurrentGallery();
      }
    });
  });

  if (galleryClose) {
    galleryClose.addEventListener("click", closeGallery);
  }

  if (galleryBackdrop) {
    galleryBackdrop.addEventListener("click", closeGallery);
  }

  if (galleryNext) {
    galleryNext.addEventListener("click", showNextImage);
  }

  if (galleryPrev) {
    galleryPrev.addEventListener("click", showPrevImage);
  }

  if (galleryModal) {
    galleryModal.addEventListener(
      "touchstart",
      (e) => {
        if (!galleryModal.classList.contains("open")) return;

        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );

    galleryModal.addEventListener(
      "touchend",
      (e) => {
        if (!galleryModal.classList.contains("open")) return;

        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipeGesture();
      },
      { passive: true }
    );
  }

  document.addEventListener("keydown", (e) => {
    if (!galleryModal || !galleryModal.classList.contains("open")) return;

    if (e.key === "Escape") {
      closeGallery();
    } else if (e.key === "ArrowRight") {
      showNextImage();
    } else if (e.key === "ArrowLeft") {
      showPrevImage();
    }
  });
}

/* =========================
   CONTACT FORM
========================= */
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (!contactForm || !formStatus) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    formStatus.textContent = translations[currentLang].form.sending;
    formStatus.className = "form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formStatus.textContent = translations[currentLang].form.success;
        formStatus.classList.add("success");
        contactForm.reset();
      } else {
        formStatus.textContent = translations[currentLang].form.error;
        formStatus.classList.add("error");
      }
    } catch {
      formStatus.textContent = translations[currentLang].form.error;
      formStatus.classList.add("error");
    }
  });
}

/* =========================
   SCROLL TO TOP
========================= */
function setupScrollToTop() {
  if (!scrollToTopBtn) return;

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

/* =========================
   MOBILE MENU
========================= */
function setupMobileMenu() {
  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });
}

/* =========================
   GLOBAL SCROLL / RESIZE
========================= */
function handleScroll() {
  updateActiveSection();

  if (scrollToTopBtn) {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  }
}

const handleResize = debounce(() => {
  generateStars();
  startComets();
  updateActiveSection();

  const activeLink =
    document.querySelector(".nav-link.active") ||
    document.querySelector(".nav-link");

  if (activeLink) {
    moveIndicator(activeLink);
  }

  if (navbar && !isMobileView()) {
    navbar.classList.remove("open");
  }
}, 150);

/* =========================
   INIT
========================= */
function init() {
  setupFadeSections();
  setupNavClicks();
  setupCarousel();
  setupGallery();
  setupContactForm();
  setupScrollToTop();
  setupMobileMenu();

  generateStars();
  startComets();
  updateActiveSection();

  const activeLink =
    document.querySelector(".nav-link.active") ||
    document.querySelector(".nav-link");

  if (activeLink) {
    moveIndicator(activeLink);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  window.addEventListener("beforeunload", stopComets);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}