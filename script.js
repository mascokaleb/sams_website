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

  document.querySelectorAll(".video-frame").forEach((frame) => {
    const playButton = frame.querySelector(".play-button");
    const videoId = frame.dataset.videoId;

    if (!playButton || !videoId) {
      return;
    }

    playButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      const title =
        frame.dataset.videoTitle || "Samuel Masco golf video highlight";

      iframe.setAttribute(
        "src",
        `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
      );
      iframe.setAttribute("title", title);
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.setAttribute("allowfullscreen", "");
      iframe.loading = "lazy";

      frame.classList.add("is-playing");
      frame.replaceChildren(iframe);
    });
  });
});
