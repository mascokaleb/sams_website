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

  if (!prefersReducedMotion) {
    initInteractiveGolfBall();
  }
});

function initInteractiveGolfBall() {
  const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersCoarsePointer) {
    return;
  }

  const ball = document.createElement("div");
  ball.className = "golf-ball";
  ball.setAttribute("aria-hidden", "true");
  document.body.appendChild(ball);

  const radius = 18;
  const state = {
    x: Math.min(window.innerWidth - radius - 24, window.innerWidth * 0.78),
    y: Math.min(window.innerHeight - radius - 24, window.innerHeight * 0.25),
    vx: 0,
    vy: 0,
    textureOffsetX: 0,
    textureOffsetY: 0,
  };

  let lastTime = performance.now();
  let isMoving = false;

  const pointerState = {
    x: 0,
    y: 0,
    active: false,
  };

  const collidableSelectors = [
    ".nav",
    ".hero-copy",
    ".hero-metrics",
    ".metric-card",
    ".about-card",
    ".panel",
    ".section-heading",
    ".academics-card",
    ".timeline-card",
    ".video-card",
    ".video-frame",
    ".dual-card",
    ".contact-card",
    ".site-footer",
  ];

  const collidableElements = collidableSelectors
    .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
    .filter((element) => element !== null && element.isConnected);

  const heroScroll = document.querySelector(".hero-scroll");
  const scrollLabel = heroScroll ? heroScroll.querySelector("span") : null;

  function setBallPosition() {
    ball.style.transform = `translate3d(${state.x - radius}px, ${state.y - radius}px, 0)`;
    ball.classList.toggle("is-moving", isMoving);
    ball.style.setProperty("--texture-offset-x", `${state.textureOffsetX}px`);
    ball.style.setProperty("--texture-offset-y", `${state.textureOffsetY}px`);
  }

  function positionBallUnderScroll() {
    if (!heroScroll) {
      return;
    }

    const rect = (scrollLabel || heroScroll).getBoundingClientRect();
    const initialX = rect.left + rect.width / 2;
    const initialY = rect.bottom + radius + 6;
    state.x = clamp(initialX, radius + 12, window.innerWidth - radius - 12);
    state.y = clamp(initialY, radius + 12, window.innerHeight - radius - 12);
    state.vx = 0;
    state.vy = 0;
    setBallPosition();
  }

  if (heroScroll) {
    positionBallUnderScroll();
    window.addEventListener("load", positionBallUnderScroll, { once: true });
    requestAnimationFrame(positionBallUnderScroll);
  } else {
    setBallPosition();
  }

  function applyPointerPush(moveX, moveY) {
    if (!pointerState.active) {
      return;
    }

    const dx = state.x - pointerState.x;
    const dy = state.y - pointerState.y;
    const distance = Math.hypot(dx, dy);
    const pushRadius = radius + 10;

    if (distance > pushRadius) {
      return;
    }

    const impulseScale = 0.42;
    state.vx += moveX * impulseScale;
    state.vy += moveY * impulseScale;

    const maxSpeed = 34;
    const speed = Math.hypot(state.vx, state.vy);
    if (speed > maxSpeed) {
      const ratio = maxSpeed / speed;
      state.vx *= ratio;
      state.vy *= ratio;
    }

    if (distance < radius) {
      const overlap = radius - distance;
      const nx = dx / (distance || 1);
      const ny = dy / (distance || 1);
      state.x += nx * (overlap + 0.5);
      state.y += ny * (overlap + 0.5);
    }
  }

  function resolveWorldBounds() {
    const restitution = 0.78;

    if (state.x < radius + 8) {
      state.x = radius + 8;
      state.vx = Math.abs(state.vx) * restitution;
    } else if (state.x > window.innerWidth - radius - 8) {
      state.x = window.innerWidth - radius - 8;
      state.vx = -Math.abs(state.vx) * restitution;
    }

    if (state.y < radius + 8) {
      state.y = radius + 8;
      state.vy = Math.abs(state.vy) * restitution;
    } else if (state.y > window.innerHeight - radius - 8) {
      state.y = window.innerHeight - radius - 8;
      state.vy = -Math.abs(state.vy) * restitution;
    }
  }

  function resolveElementCollisions() {
    const restitution = 0.72;

    for (const element of collidableElements) {
      if (!element.isConnected) {
        continue;
      }

      const rect = element.getBoundingClientRect();

      if (
        rect.width === 0 ||
        rect.height === 0 ||
        rect.right < -40 ||
        rect.left > window.innerWidth + 40 ||
        rect.bottom < -40 ||
        rect.top > window.innerHeight + 40
      ) {
        continue;
      }

      const closestX = clamp(state.x, rect.left, rect.right);
      const closestY = clamp(state.y, rect.top, rect.bottom);
      const diffX = state.x - closestX;
      const diffY = state.y - closestY;
      const distanceSq = diffX * diffX + diffY * diffY;

      if (distanceSq >= radius * radius || (diffX === 0 && diffY === 0)) {
        continue;
      }

      const distance = Math.sqrt(distanceSq) || 0.0001;
      const normalX = diffX / distance;
      const normalY = diffY / distance;

      state.x = closestX + normalX * (radius + 0.5);
      state.y = closestY + normalY * (radius + 0.5);

      const velocityAlongNormal = state.vx * normalX + state.vy * normalY;
      if (velocityAlongNormal > 0) {
        continue;
      }

      state.vx -= (1 + restitution) * velocityAlongNormal * normalX;
      state.vy -= (1 + restitution) * velocityAlongNormal * normalY;
    }
  }

  function step() {
    const now = performance.now();
    const delta = Math.min((now - lastTime) / 16.666, 3);
    lastTime = now;

    state.x += state.vx * delta;
    state.y += state.vy * delta;

    state.vx *= Math.pow(0.985, delta);
    state.vy *= Math.pow(0.985, delta);

    if (Math.abs(state.vx) < 0.02) {
      state.vx = 0;
    }
    if (Math.abs(state.vy) < 0.02) {
      state.vy = 0;
    }

    resolveWorldBounds();
    resolveElementCollisions();

    isMoving = Math.hypot(state.vx, state.vy) > 0.35;

    if (isMoving) {
      const textureSpeedFactor = 0.32;
      const patternSize = 12;
      state.textureOffsetX = wrapTexture(
        state.textureOffsetX + state.vx * delta * textureSpeedFactor,
        patternSize
      );
      state.textureOffsetY = wrapTexture(
        state.textureOffsetY + state.vy * delta * textureSpeedFactor,
        patternSize
      );
    }

    setBallPosition();

    requestAnimationFrame(step);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const previousX = pointerState.x;
      const previousY = pointerState.y;
      const hadPointer = pointerState.active;

      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      pointerState.active = true;

      const moveX =
        typeof event.movementX === "number"
          ? event.movementX
          : hadPointer
          ? pointerState.x - previousX
          : 0;
      const moveY =
        typeof event.movementY === "number"
          ? event.movementY
          : hadPointer
          ? pointerState.y - previousY
          : 0;

      if (!hadPointer) {
        return;
      }

      applyPointerPush(moveX, moveY);
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    pointerState.active = false;
  });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      pointerState.active = false;
    }
  });

  window.addEventListener("blur", () => {
    pointerState.active = false;
  });

  window.addEventListener("resize", () => {
    state.x = clamp(state.x, radius + 8, window.innerWidth - radius - 8);
    state.y = clamp(state.y, radius + 8, window.innerHeight - radius - 8);
    if (heroScroll) {
      positionBallUnderScroll();
    } else {
      setBallPosition();
    }
  });

  requestAnimationFrame(step);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function wrapTexture(value, size) {
  const wrapped = value % size;
  return wrapped < 0 ? wrapped + size : wrapped;
}
