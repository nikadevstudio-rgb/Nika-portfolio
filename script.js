const navLinks = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll("section[id]");
const fadeSections = document.querySelectorAll("main section");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const currentLang = document.documentElement.lang === "sl" ? "sl" : "en";
const mainElement = document.querySelector("main");
const isPortfolioPage = mainElement?.classList.contains("portfolio-page");

const translations = {
  en: {
    gallery: {
      print: "Print Design",
      banners: "Banner Design",
      social: "Social Media",
      default: "Gallery"
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
      default: "Galerija"
    },
    form: {
      sending: "Pošiljanje sporočila...",
      success: "Hvala! Vaše sporočilo je bilo poslano.",
      error: "Nekaj je šlo narobe. Poskusite znova."
    }
  }
};

let isManualScrolling = false;
let manualScrollTimeout;
let cometInterval;
let resizeTimeout;
let lastFocusedElement = null;

/* =========================
   NAV INDICATOR
========================= */
function moveIndicator(element) {
  if (!element || !indicator) return;

  indicator.style.width = `${element.offsetWidth}px`;
  indicator.style.left = `${element.offsetLeft}px`;
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isHashLink = href.startsWith("#");
    const isActive = isHashLink && href === `#${id}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      moveIndicator(link);
    }
  });
}

/* =========================
   STARS
========================= */
function createStars(numStars) {
  if (prefersReducedMotion || isPortfolioPage) return;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * document.body.scrollHeight;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDuration = `${Math.random() * 2 + 2}s`;

    document.body.appendChild(star);
  }
}

function clearStars() {
  document.querySelectorAll(".star").forEach((star) => star.remove());
}

function generateStars() {
  if (isPortfolioPage) return;

  clearStars();
  createStars(180);
}

/* =========================
   COMETS
========================= */
function createComet() {
  if (prefersReducedMotion || isPortfolioPage) return;

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
      { opacity: 1 },
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

function startComets() {
  if (prefersReducedMotion || isPortfolioPage) return;

  if (cometInterval) {
    clearInterval(cometInterval);
  }

  cometInterval = setInterval(() => {
    if (Math.random() < 0.2) {
      createComet();
    }
  }, 1200);
}

/* =========================
   ACTIVE SECTION OBSERVER
========================= */
if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      if (isManualScrolling) return;

      const visibleSections = entries.filter((entry) => entry.isIntersecting);

      if (visibleSections.length > 0) {
        const currentSection = visibleSections.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        );

        setActiveLink(currentSection.target.id);
      }
    },
    {
      threshold: [0.35, 0.55, 0.75],
      rootMargin: "-20% 0px -35% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================
   FADE-IN SECTIONS
========================= */
if (!prefersReducedMotion) {
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
} else {
  fadeSections.forEach((section) => {
    section.classList.add("visible");
  });
}

/* =========================
   NAV SCROLL FOR HASH LINKS
========================= */
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetId = href.replace("#", "");
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

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
      setActiveLink(targetId);
    }, prefersReducedMotion ? 100 : 900);
  });
});

/* =========================
   PAGE LOAD
========================= */
window.addEventListener("load", () => {
  if (!isPortfolioPage) {
    generateStars();
    startComets();
  }

  const activeLink = document.querySelector(".nav-link.active");
  if (activeLink) {
    moveIndicator(activeLink);
  }
});

/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    if (!isPortfolioPage) {
      generateStars();
    }

    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      moveIndicator(activeLink);
    }
  }, 150);
});

/* =========================
   WEB CAROUSEL
========================= */
const carousel = document.getElementById("webCarousel");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if (carousel && prevBtn && nextBtn) {
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

const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const galleryTitle = document.getElementById("galleryTitle");
const galleryCounter = document.getElementById("galleryCounter");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryBackdrop = document.querySelector(".gallery-backdrop");
const graphicSlides = document.querySelectorAll(".graphic-slide");

let currentGallery = [];
let currentIndex = 0;
let currentCategory = "";

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

function updateGalleryImage() {
  if (!galleryImage || currentGallery.length === 0) return;

  galleryImage.src = currentGallery[currentIndex];
  galleryTitle.textContent = formatGalleryTitle(currentCategory);
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

document.addEventListener("keydown", (e) => {
  if (!galleryModal || !galleryModal.classList.contains("open")) return;

  if (e.key === "Escape") {
    closeGallery();
  }

  if (e.key === "ArrowRight") {
    showNextImage();
  }

  if (e.key === "ArrowLeft") {
    showPrevImage();
  }
});

/* =========================
   CONTACT FORM
========================= */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
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
    } catch (error) {
      formStatus.textContent = translations[currentLang].form.error;
      formStatus.classList.add("error");
    }
  });
}

/* =========================
   SCROLL TO TOP
========================= */
const scrollToTopBtn = document.getElementById("scrollToTop");

if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}