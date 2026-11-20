/* ============================================================
   Rajmunch Foods — interactions & animations
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- 1. Apply site config (contact details, links) ---------- */
  const C = window.RAJMUNCH_CONFIG || {};

  if (C.whatsapp) {
    const waBase = "https://wa.me/" + String(C.whatsapp).replace(/\D/g, "");
    const defaultMsg = encodeURIComponent("Hi Rajmunch! I'd like to place an order.");
    $$("[data-whatsapp]").forEach(function (a) {
      const msg = a.dataset.whatsappMsg ? encodeURIComponent(a.dataset.whatsappMsg) : defaultMsg;
      a.href = waBase + "?text=" + msg;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  const setText = function (sel, value) {
    if (value) $$(sel).forEach(function (el) { el.textContent = value; });
  };
  setText('[data-config="phone"]', C.phoneDisplay);
  setText('[data-config="email"]', C.email);
  setText('[data-config="instagram"]', C.instagram ? "@" + C.instagram : null);
  setText('[data-config="address"]', C.address);
  setText('[data-config="city"]', C.city);

  if (C.phoneHref) $$("[data-phone-href]").forEach(function (el) { el.href = "tel:" + C.phoneHref; });
  if (C.email) $$("[data-email-href]").forEach(function (el) { el.href = "mailto:" + C.email; });
  if (C.instagramUrl) $$("[data-instagram-href]").forEach(function (el) { el.href = C.instagramUrl; });

  const map = $("#mapEmbed");
  if (map && C.mapQuery) {
    map.src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapQuery) + "&output=embed";
  }

  ["meesho", "flipkart"].forEach(function (m) {
    const url = C[m];
    if (url && url.indexOf("http") === 0) {
      $$('[data-marketplace="' + m + '"]').forEach(function (a) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
      });
    }
  });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Product carousels ---------- */
  $$('.product-carousel-shell').forEach(function (shell) {
    const carousel = $('.product-carousel', shell);
    const prev = $('.carousel-prev', shell);
    const next = $('.carousel-next', shell);
    if (!carousel || !prev || !next) return;

    const updateButtons = function () {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth - 2;
      prev.disabled = carousel.scrollLeft <= 2;
      next.disabled = carousel.scrollLeft >= maxScroll;
    };

    const move = function (direction) {
      carousel.scrollBy({ left: direction * carousel.clientWidth * 0.88, behavior: "smooth" });
    };

    prev.addEventListener("click", function () { move(-1); });
    next.addEventListener("click", function () { move(1); });
    carousel.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });

  /* ---------- 2. Mobile nav ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. Animations (skip if reduced motion or no GSAP) ---------- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof gsap === "undefined") return; // content stays fully visible

  gsap.registerPlugin(ScrollTrigger);

  // Smooth scrolling (Lenis)
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        const id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70 });
        }
      });
    });
  }

  // Scroll progress bar
  gsap.to("#progressBar", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  // Nav background on scroll
  ScrollTrigger.create({
    start: 40,
    onEnter: function () { if (nav) nav.classList.add("scrolled"); },
    onLeaveBack: function () { if (nav) nav.classList.remove("scrolled"); },
  });

  // Hero intro
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero-badge", { y: 24, opacity: 0, duration: 0.6 })
    .from(".hero-title .line > span", { y: "110%", duration: 0.9, stagger: 0.12 }, "-=0.3")
    .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
    .from(".hero-cta .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
    .from(".hero-stats > div", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
    .from(".hero-art .tile", { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.6)" }, "-=0.9");

  // Scroll reveals (single elements)
  $$("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // Scroll reveals (staggered groups)
  $$("[data-reveal-group]").forEach(function (group) {
    gsap.from(group.children, {
      y: 48,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: group, start: "top 85%" },
    });
  });

  // Parallax hero tiles
  $$("[data-parallax]").forEach(function (el) {
    gsap.to(el, {
      y: parseFloat(el.dataset.parallax) * 300,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  });

  // Full-bleed banner parallax (background drifts as you scroll)
  const bannerBg = document.querySelector("[data-parallax-bg]");
  if (bannerBg) {
    gsap.fromTo(
      bannerBg,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: bannerBg.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }

  // Animated counters
  $$("[data-count]").forEach(function (el) {
    const end = parseInt(el.dataset.count, 10) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { el.textContent = String(Math.round(obj.v)); },
    });
  });
})();
