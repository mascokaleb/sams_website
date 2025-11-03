document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isExpanded =
        navToggle.getAttribute("aria-expanded") === "true" ? "false" : "true";
      navToggle.setAttribute("aria-expanded", isExpanded);
      navLinks.classList.toggle("is-open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
      });
    });
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    document
      .querySelectorAll("[data-motion]")
      .forEach((el) => observer.observe(el));
  } else {
    document
      .querySelectorAll("[data-motion]")
      .forEach((el) => el.classList.add("is-visible"));
  }
});
