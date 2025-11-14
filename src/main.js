import { toHTML } from "@portabletext/to-html";
import { fetchSiteContent } from "./lib/sanityClient.js";

const HERO_PLACEHOLDER_IMAGE = "images/samuel-placeholder.svg";

const SELECTORS = {
  heroCopy: '[data-template="hero-copy"]',
  heroPhoto: '[data-template="hero-photo"]',
  heroMetrics: '[data-template="hero-metrics"]',
  aboutHeading: '[data-template="about-heading"]',
  aboutGrid: '[data-template="about-grid"]',
  resumeHeading: '[data-template="resume-heading"]',
  resumePanels: '[data-template="resume-panels"]',
  academicsHeading: '[data-template="academics-heading"]',
  academicsGrid: '[data-template="academics-grid"]',
  highlightsHeading: '[data-template="highlights-heading"]',
  highlightsTimeline: '[data-template="timeline"]',
  videosHeading: '[data-template="videos-heading"]',
  videoGrid: '[data-template="video-grid"]',
  videosActions: '[data-template="videos-actions"]',
  dualHeading: '[data-template="dual-heading"]',
  dualGrid: '[data-template="dual-grid"]',
  contactHeading: '[data-template="contact-heading"]',
  contactGrid: '[data-template="contact-grid"]',
  highlightsActions: '[data-template="highlights-actions"]',
};

const highlightsState = {
  meta: null,
  items: [],
  expanded: false,
};

const videosState = {
  meta: null,
  items: [],
  expanded: false,
};

document.addEventListener("DOMContentLoaded", async () => {
  setupNav();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  await hydratePage();

  setupMotionAnimations(prefersReducedMotion);

  if (!prefersReducedMotion) {
    initInteractiveGolfBall();
  }
});

function setupNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true" ? "false" : "true";
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

async function hydratePage() {
  setGlobalLoadingState(true);
  const data = await fetchSiteContent();

  if (!data) {
    setPageError("Unable to load the latest content. Please try again shortly.");
    setGlobalLoadingState(false);
    return null;
  }

  renderMeta(data.site);
  renderHero(data.hero, data.site);
  renderAbout(data.about);
  renderResume(data.resume);
  renderAcademics(data.academics);
  highlightsState.meta = data.highlightsSection;
  highlightsState.items = data.highlightEvents || [];
  highlightsState.expanded = false;
  renderHighlights();

  videosState.meta = data.videosSection;
  videosState.items = data.videos || [];
  videosState.expanded = false;
  renderVideos();
  renderDualSport(data.dualSport);
  renderContact(data.contact);

  setGlobalLoadingState(false);
  setupVideoFrames();
  return data;
}

function renderMeta(site) {
  if (!site) {
    return;
  }

  if (site.siteTitle) {
    document.title = site.siteTitle;
    const brandText = document.querySelector(".brand-text");
    if (brandText) {
      brandText.textContent = site.siteTitle;
    }
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && site.seoDescription) {
    metaDescription.setAttribute("content", site.seoDescription);
  }

  const brandMark = document.querySelector(".brand-mark");
  if (brandMark) {
    if (site.brandMarkImage?.url) {
      brandMark.innerHTML = `<span class="brand-mark-image"><img src="${escapeAttribute(
        site.brandMarkImage.url
      )}" alt="${escapeHtml(site.brandMarkImage.alt || site.siteTitle || "Site logo")}" loading="lazy" /></span>`;
      brandMark.classList.add("has-image");
    } else {
      const initials =
        site.brandMarkInitials ||
        getInitials(site.siteTitle) ||
        brandMark.textContent ||
        "SM";
      brandMark.textContent = initials;
      brandMark.classList.remove("has-image");
    }
  }
}

function renderHero(hero, site) {
  const copyEl = select(SELECTORS.heroCopy);
  const photoEl = select(SELECTORS.heroPhoto);
  const metricsEl = select(SELECTORS.heroMetrics);

  if (!hero) {
    if (copyEl) {
      copyEl.innerHTML = renderPlaceholder("Hero content coming soon.");
    }
    return;
  }

  if (copyEl) {
    const tagline = hero.tagline ? `<p class="hero-tag">${escapeHtml(hero.tagline)}</p>` : "";
    const subheadline = hero.subheadline ? `<span>${escapeHtml(hero.subheadline)}</span>` : "";
    const description = hero.bio ? `<p>${escapeHtml(hero.bio)}</p>` : "";
    const ctas = [
      buildCta(hero.primaryCta, "primary", "View Highlights", "#highlights"),
      buildCta(hero.secondaryCta, "ghost", "Connect", "#contact"),
    ]
      .filter(Boolean)
      .join("");

    copyEl.innerHTML = `
      ${tagline}
      <h1>
        ${escapeHtml(hero.headline || site?.siteTitle || "")}
        ${subheadline}
      </h1>
      ${description}
      <div class="hero-actions">
        ${ctas || '<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `;
  }

  if (photoEl) {
    const photoUrl = hero.headshot?.url || HERO_PLACEHOLDER_IMAGE;
    const alt = hero.headshot?.alt || "Portrait of Samuel Masco";
    const caption = hero.photoCaption || "Focused on the next shot.";

    photoEl.innerHTML = `
      <div class="hero-photo-frame">
        <img src="${photoUrl}" alt="${escapeHtml(alt)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${escapeHtml(caption)}</figcaption>
    `;
  }

  if (metricsEl) {
    if (Array.isArray(hero.metrics) && hero.metrics.length) {
      metricsEl.innerHTML = hero.metrics
        .map(
          (metric) => `
            <div class="metric-card" data-motion>
              <span class="metric-label">${escapeHtml(metric.label || "")}</span>
              <span class="metric-value">${escapeHtml(metric.value || "")}</span>
            </div>
          `
        )
        .join("");
    } else {
      metricsEl.innerHTML = renderPlaceholder("Metrics coming soon.");
    }
  }
}

function renderAbout(about) {
  const headingEl = select(SELECTORS.aboutHeading);
  const gridEl = select(SELECTORS.aboutGrid);

  if (headingEl) {
    headingEl.innerHTML = about
      ? `
          <h2>${escapeHtml(about.heading || "About")}</h2>
          <p>${escapeHtml(about.subheading || "")}</p>
        `
      : renderPlaceholder("About section coming soon.");
  }

  if (gridEl) {
    if (!about) {
      gridEl.innerHTML = renderPlaceholder("About details coming soon.");
      return;
    }

    gridEl.innerHTML = `
      <article class="about-card" data-motion="delay-1">
        <h3>${escapeHtml(about.profileCardTitle || "Profile")}</h3>
        <ul>
          ${(about.profileFacts || [])
            .map(
              (fact) => `
                <li><strong>${escapeHtml(fact.label || "")}: </strong>${escapeHtml(fact.value || "")}</li>
              `
            )
            .join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${escapeHtml(about.mindsetTitle || "Mindset & Goals")}</h3>
        ${renderPortableText(about.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${escapeHtml(about.quickHitsTitle || "Quick Hits")}</h3>
        ${(about.quickHits || [])
          .map(
            (hit) => `
              <div class="highlight-row">
                <span>${escapeHtml(hit.label || "")}</span>
                <span>${escapeHtml(hit.value || "")}</span>
              </div>
            `
          )
          .join("")}
      </article>
    `;
  }
}

function renderResume(resume) {
  const headingEl = select(SELECTORS.resumeHeading);
  const panelsEl = select(SELECTORS.resumePanels);

  if (headingEl) {
    headingEl.innerHTML = resume
      ? `
          <h2>${escapeHtml(resume.heading || "Golf Resume")}</h2>
          <p>${escapeHtml(resume.subheading || "")}</p>
        `
      : renderPlaceholder("Golf resume coming soon.");
  }

  if (panelsEl) {
    if (!resume) {
      panelsEl.innerHTML = renderPlaceholder("Resume details coming soon.");
      return;
    }

    panelsEl.innerHTML = `
      <article class="panel" data-motion="delay-1">
        <h3>${escapeHtml(resume.performanceTitle || "Performance Snapshot")}</h3>
        <dl>
          ${(resume.performanceStats || [])
            .map(
              (stat) => `
                <div>
                  <dt>${escapeHtml(stat.label || "")}</dt>
                  <dd>${escapeHtml(stat.value || "")}</dd>
                </div>
              `
            )
            .join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${escapeHtml(resume.trainingTitle || "Training Routine")}</h3>
        ${renderPortableText(resume.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${escapeHtml(resume.experienceTitle || "Playing Experience")}</h3>
        <ul>
          ${(resume.experienceList || [])
            .map((item) => `<li>${escapeHtml(item || "")}</li>`)
            .join("")}
        </ul>
      </article>
    `;
  }
}

function renderAcademics(academics) {
  const headingEl = select(SELECTORS.academicsHeading);
  const gridEl = select(SELECTORS.academicsGrid);

  if (headingEl) {
    headingEl.innerHTML = academics
      ? `
          <h2>${escapeHtml(academics.heading || "Academics")}</h2>
          <p>${escapeHtml(academics.subheading || "")}</p>
        `
      : renderPlaceholder("Academics section coming soon.");
  }

  if (gridEl) {
    if (!academics) {
      gridEl.innerHTML = renderPlaceholder("Academic details coming soon.");
      return;
    }

    const transcriptLabel = academics.transcriptLabel || "Transcript";
    const transcriptButton = academics.transcriptUrl
      ? `<a class="btn subtle" href="${escapeAttribute(
          academics.transcriptUrl
        )}" target="_blank" rel="noopener">${escapeHtml(
          transcriptLabel
        )}</a>`
      : `<span class="btn subtle is-disabled" aria-disabled="true">${escapeHtml(transcriptLabel)}</span>`;

    gridEl.innerHTML = `
      <article class="academics-card" data-motion="delay-1">
        <h3>${escapeHtml(academics.schoolCardTitle || "School")}</h3>
        <ul>
          ${academics.gpa ? `<li><strong>GPA:</strong> ${escapeHtml(academics.gpa)}</li>` : ""}
          ${academics.honors ? `<li><strong>Honors:</strong> ${escapeHtml(academics.honors)}</li>` : ""}
          ${academics.apCourses ? `<li><strong>AP / IB:</strong> ${escapeHtml(academics.apCourses)}</li>` : ""}
        </ul>
        ${transcriptButton}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${escapeHtml(academics.interestsTitle || "Academic Interests")}</h3>
        ${renderPortableText(academics.interestsBody)}
      </article>
    `;
  }
}

function renderHighlights() {
  const sectionMeta = highlightsState.meta;
  const events = highlightsState.items || [];
  const headingEl = select(SELECTORS.highlightsHeading);
  const timelineEl = select(SELECTORS.highlightsTimeline);
  const actionsEl = select(SELECTORS.highlightsActions);

  if (headingEl) {
    headingEl.innerHTML = sectionMeta
      ? `
          <h2>${escapeHtml(sectionMeta.heading || "Highlights")}</h2>
          <p>${escapeHtml(sectionMeta.subheading || "")}</p>
        `
      : renderPlaceholder("Highlights coming soon.");
  }

  if (!timelineEl) {
    return;
  }

  const baseLimit = sectionMeta?.maxItems || 5;
  const limit = highlightsState.expanded ? events.length : baseLimit;
  const limitedEvents = events.slice(0, limit);

  if (!limitedEvents.length) {
    timelineEl.innerHTML = renderPlaceholder("Highlight events coming soon.");
    if (actionsEl) {
      actionsEl.innerHTML = "";
    }
    return;
  }

  timelineEl.innerHTML = limitedEvents
    .map((event, index) => renderHighlightCard(event, index))
    .join("");
  timelineEl
    .querySelectorAll("[data-motion]")
    .forEach((el) => el.classList.add("is-visible"));

  if (actionsEl) {
    const shouldShowToggle = events.length > baseLimit;
    if (!shouldShowToggle) {
      actionsEl.innerHTML = "";
    } else {
      actionsEl.innerHTML = `
        <button class="btn ghost" type="button" data-action="toggle-highlights">
          ${highlightsState.expanded ? "Show Less" : "See More"}
        </button>
      `;
      const button = actionsEl.querySelector("button");
      if (button) {
        button.addEventListener("click", () => {
          highlightsState.expanded = !highlightsState.expanded;
          renderHighlights();
        });
      }
    }
  }
}

function renderVideos() {
  const sectionMeta = videosState.meta;
  const videos = videosState.items || [];
  const headingEl = select(SELECTORS.videosHeading);
  const gridEl = select(SELECTORS.videoGrid);
  const actionsEl = select(SELECTORS.videosActions);

  if (headingEl) {
    headingEl.innerHTML = sectionMeta
      ? `
          <h2>${escapeHtml(sectionMeta.heading || "Videos")}</h2>
          <p>${escapeHtml(sectionMeta.subheading || "")}</p>
        `
      : renderPlaceholder("Videos coming soon.");
  }

  if (!gridEl) {
    return;
  }

  const baseLimit = sectionMeta?.maxItems || 3;
  const limit = videosState.expanded ? videos.length : baseLimit;
  const limitedVideos = videos.slice(0, limit);

  if (!limitedVideos.length) {
    gridEl.innerHTML = renderPlaceholder("Video highlights coming soon.");
    if (actionsEl) {
      actionsEl.innerHTML = "";
    }
    return;
  }

  gridEl.innerHTML = limitedVideos.map((video, index) => renderVideoCard(video, index)).join("");
  gridEl.querySelectorAll("[data-motion]").forEach((el) => el.classList.add("is-visible"));
  setupVideoFrames();

  if (actionsEl) {
    const shouldShowToggle = videos.length > baseLimit;
    if (!shouldShowToggle) {
      actionsEl.innerHTML = "";
    } else {
      actionsEl.innerHTML = `
        <button class="btn ghost" type="button" data-action="toggle-videos">
          ${videosState.expanded ? "Show Less" : "See More"}
        </button>
      `;
      const button = actionsEl.querySelector("button");
      if (button) {
        button.addEventListener("click", () => {
          videosState.expanded = !videosState.expanded;
          renderVideos();
        });
      }
    }
  }
}

function renderDualSport(dual) {
  const headingEl = select(SELECTORS.dualHeading);
  const gridEl = select(SELECTORS.dualGrid);

  if (headingEl) {
    headingEl.innerHTML = dual
      ? `
          <h2>${escapeHtml(dual.heading || "Dual-Sport Athlete")}</h2>
          <p>${escapeHtml(dual.subheading || "")}</p>
        `
      : renderPlaceholder("Dual-sport content coming soon.");
  }

  if (gridEl) {
    if (!dual || !Array.isArray(dual.cards) || !dual.cards.length) {
      gridEl.innerHTML = renderPlaceholder("Dual-sport cards coming soon.");
      return;
    }

    gridEl.innerHTML = dual.cards
      .map(
        (card, index) => `
          <article class="dual-card" data-motion="delay-${index + 1}">
            <h3>${escapeHtml(card.title || "")}</h3>
            ${card.body ? `<p>${escapeHtml(card.body)}</p>` : ""}
            ${Array.isArray(card.bulletPoints) && card.bulletPoints.length
              ? `<ul>${card.bulletPoints.map((point) => `<li>${escapeHtml(point || "")}</li>`).join("")}</ul>`
              : ""}
          </article>
        `
      )
      .join("");
  }
}

function renderContact(contact) {
  const headingEl = select(SELECTORS.contactHeading);
  const gridEl = select(SELECTORS.contactGrid);

  if (headingEl) {
    headingEl.innerHTML = contact
      ? `
          <h2>${escapeHtml(contact.heading || "Let's Connect")}</h2>
          <p>${escapeHtml(contact.subheading || "")}</p>
        `
      : renderPlaceholder("Contact section coming soon.");
  }

  if (!gridEl) {
    return;
  }

  if (!contact || !Array.isArray(contact.cards) || !contact.cards.length) {
    gridEl.innerHTML = renderPlaceholder("Contact cards coming soon.");
    return;
  }

  gridEl.innerHTML = contact.cards
    .map(
      (card, index) => `
        <article class="contact-card" data-motion="delay-${index + 1}">
          <h3>${escapeHtml(card.title || "")}</h3>
          <ul>
            ${(card.entries || [])
              .map((entry) => `<li>${renderContactEntry(entry)}</li>`)
              .join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderContactEntry(entry) {
  if (!entry) {
    return "";
  }

  const label = entry.label ? `<strong>${escapeHtml(entry.label)}:</strong> ` : "";
  const segments = splitContactValue(entry.value);
  const target = entry.link?.startsWith("http") ? ' target="_blank" rel="noopener"' : "";

  if (entry.link && segments.length <= 1) {
    return `${label}<a href="${escapeAttribute(entry.link)}"${target}>${escapeHtml(entry.value || entry.link)}</a>`;
  }

  if (segments.length) {
    return `${label}${segments
      .map((segment, index) => {
        const href = index === 0 && entry.link ? entry.link : segment.link;
        if (href) {
          const isExternal = href.startsWith("http");
          const segmentTarget = isExternal ? ' target="_blank" rel="noopener"' : "";
          return `<a href="${escapeAttribute(href)}"${segmentTarget}>${escapeHtml(segment.text)}</a>`;
        }
        return escapeHtml(segment.text);
      })
      .join(" · ")}`;
  }

  return `${label}${escapeHtml(entry.value || "")}`;
}

function renderHighlightCard(event, index) {
  const dateLabel = formatEventDate(event);
  const summary = event.summary ? `<p>${escapeHtml(event.summary)}</p>` : "";
  const results = Array.isArray(event.results)
    ? `<ul>${event.results.map((item) => `<li>${escapeHtml(item.description || "")}</li>`).join("")}</ul>`
    : "";

  return `
    <article class="timeline-card" data-motion="delay-${index + 1}">
      <header>
        <h3>${escapeHtml(event.title || "")}</h3>
        ${dateLabel ? `<span class="timeline-date">${dateLabel}</span>` : ""}
      </header>
      ${summary}
      ${results}
    </article>
  `;
}

function renderVideoCard(video, index) {
  const youtubeId = video.youtubeId || "";
  const thumbnail = video.thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const alt = video.thumbnailAlt || video.title || "Video highlight";
  const buttonLabel = video.ctaLabel || "Play";

  return `
    <article class="video-card" data-motion="delay-${index + 1}">
      <div class="video-frame" data-video-id="${escapeHtml(youtubeId)}" data-video-title="${escapeHtml(video.title || "Video highlight")}">
        <img src="${escapeAttribute(thumbnail)}" alt="${escapeHtml(alt)}" loading="lazy" />
        <button class="play-button" type="button" aria-label="Play ${escapeHtml(video.title || "highlight")}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${escapeHtml(buttonLabel)}</span>
        </button>
      </div>
      <h3>${escapeHtml(video.title || "")}</h3>
      <p>${escapeHtml(video.description || "")}</p>
    </article>
  `;
}

function setupVideoFrames() {
  document.querySelectorAll(".video-frame").forEach((frame) => {
    if (frame.dataset.playerReady === "true") {
      return;
    }

    const playButton = frame.querySelector(".play-button");
    const videoId = frame.dataset.videoId;

    if (!playButton || !videoId) {
      return;
    }

    playButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      const title = frame.dataset.videoTitle || "Samuel Masco golf video highlight";

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

    frame.dataset.playerReady = "true";
  });
}

function renderPortableText(value) {
  if (!Array.isArray(value) || !value.length) {
    return "";
  }

  return toHTML(value);
}

function select(selector) {
  return selector ? document.querySelector(selector) : null;
}

function renderPlaceholder(message) {
  return `<p class="placeholder-text">${escapeHtml(message)}</p>`;
}

function setGlobalLoadingState(isLoading) {
  document.body.dataset.contentLoading = String(isLoading);
}

function setPageError(message) {
  const main = document.querySelector("main");
  if (main) {
    main.insertAdjacentHTML(
      "afterbegin",
      `<div class="notification error">${escapeHtml(message)}</div>`
    );
  }
}

function buildCta(cta, style, fallbackLabel, fallbackHref) {
  if (cta?.label && cta?.href) {
    return `<a class="btn ${style}" href="${escapeAttribute(cta.href)}">${escapeHtml(cta.label)}</a>`;
  }
  if (fallbackLabel && fallbackHref) {
    return `<a class="btn ${style}" href="${escapeAttribute(fallbackHref)}">${escapeHtml(fallbackLabel)}</a>`;
  }
  return "";
}

function escapeHtml(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function getInitials(value) {
  if (!value) {
    return "";
  }

  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) {
    return "";
  }
  return parts
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function splitContactValue(value) {
  if (!value) {
    return [];
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return [];
  }

  const normalized = trimmed.replace(/\s[-–—]\s/g, "|");
  const parts = normalized.split(/·|\|/g).map((part) => part.trim());
  return parts
    .filter(Boolean)
    .map((part) => ({
      text: part,
      link: inferLink(part),
    }));
}

function inferLink(text) {
  if (!text) {
    return null;
  }

  const cleaned = text.replace(/\s+/g, "");
  if (/^\(?\+?\d[\d\-()\s\.]+$/.test(text)) {
    const digits = cleaned.replace(/[^\d+]/g, "");
    return `tel:${digits}`;
  }

  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(text)) {
    return `mailto:${cleaned}`;
  }

  return null;
}

function formatEventDate(event) {
  if (!event) {
    return "";
  }

  if (event.dateLabel) {
    return escapeHtml(event.dateLabel);
  }

  if (!event.eventDate) {
    return "";
  }

  const date = new Date(event.eventDate);
  if (Number.isNaN(date.getTime())) {
    return escapeHtml(event.eventDate);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function setupMotionAnimations(prefersReducedMotion) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    document
      .querySelectorAll("[data-motion]")
      .forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-motion]").forEach((el) => observer.observe(el));
}

/* Existing interactive ball logic remains unchanged below */

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

  const heroSection = document.querySelector(".site-header");
  const pointerState = {
    x: 0,
    y: 0,
    active: false,
  };

  const collidableSelectors = [
    ".nav",
    ".hero-copy",
    ".hero-photo",
    ".hero-photo-frame",
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
  const heroAnchorOffset = { x: .5, y: -32 };
  const scrollAnchorOffset = { x: 0, y: 10 };
  const worldTopOffset = -80;

  function setBallPosition() {
    ball.style.transform = `translate3d(${state.x - radius}px, ${state.y - radius}px, 0)`;
    ball.classList.toggle("is-moving", isMoving);
    ball.style.setProperty("--texture-offset-x", `${state.textureOffsetX}px`);
    ball.style.setProperty("--texture-offset-y", `${state.textureOffsetY}px`);
  }

  function getHeroNameAnchorRect() {
    const heading = document.querySelector(".hero-copy h1");
    if (!heading) {
      return null;
    }

    const targetWord = "masco";
    const textContent = heading.textContent || "";
    const normalized = textContent.toLowerCase();
    const wordIndex = normalized.lastIndexOf(targetWord);
    if (wordIndex === -1) {
      return null;
    }

    const letterIndex = wordIndex + targetWord.length - 1;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let currentNode = walker.nextNode();

    while (currentNode) {
      const value = currentNode.textContent || "";
      const length = value.length;

      if (letterIndex < offset + length) {
        const charIndex = letterIndex - offset;
        if (charIndex < 0 || charIndex >= length) {
          return null;
        }

        const character = value.charAt(charIndex);
        if (!character || !character.trim()) {
          return null;
        }

        const range = document.createRange();
        range.setStart(currentNode, charIndex);
        range.setEnd(currentNode, Math.min(charIndex + 1, length));
        const rect = range.getBoundingClientRect();
        range.detach?.();

        if (!rect || (!rect.width && !rect.height)) {
          return null;
        }

        return {
          left: rect.left + window.scrollX,
          right: rect.right + window.scrollX,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height,
        };
      }

      offset += length;
      currentNode = walker.nextNode();
    }

    return null;
  }

  function positionBallAtHeroName() {
    const rect = getHeroNameAnchorRect();
    if (!rect) {
      return false;
    }

    const bounds = getWorldBounds();
    const initialX = rect.left + rect.width / 3 + heroAnchorOffset.x;
    const initialY = rect.top + rect.height / 30 + heroAnchorOffset.y;
    const minX = bounds.left + radius + 12;
    const maxX = bounds.right - radius - 12;
    const minY = bounds.top + radius + worldTopOffset;
    const maxY = bounds.bottom - radius - 12;
    state.x = clamp(initialX, minX, maxX);
    state.y = clamp(initialY, minY, maxY);
    state.vx = 0;
    state.vy = 0;
    setBallPosition();
    return true;
  }

  function positionBallUnderScroll() {
    if (!heroScroll) {
      return false;
    }

    const rect = getDocumentRect(scrollLabel || heroScroll);
    const bounds = getWorldBounds();
    const initialX = rect.left + rect.width / 2 + scrollAnchorOffset.x;
    const initialY = rect.bottom + radius + scrollAnchorOffset.y;
    const minX = bounds.left + radius + 12;
    const maxX = bounds.right - radius - 12;
    const minY = bounds.top + radius + worldTopOffset;
    const maxY = bounds.bottom - radius - 12;
    state.x = clamp(initialX, minX, maxX);
    state.y = clamp(initialY, minY, maxY);
    state.vx = 0;
    state.vy = 0;
    setBallPosition();
    return true;
  }

  function placeBallAtPreferredAnchor() {
    if (positionBallAtHeroName()) {
      return;
    }

    if (positionBallUnderScroll()) {
      return;
    }

    setBallPosition();
  }

  placeBallAtPreferredAnchor();
  window.addEventListener("load", placeBallAtPreferredAnchor, { once: true });
  requestAnimationFrame(placeBallAtPreferredAnchor);

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
    const bounds = getWorldBounds();
    const minX = bounds.left + radius + 8;
    const maxX = bounds.right - radius - 8;
    const minY = bounds.top + radius + worldTopOffset;
    const maxY = bounds.bottom - radius - 8;

    if (state.x < minX) {
      state.x = minX;
      state.vx = Math.abs(state.vx) * restitution;
    } else if (state.x > maxX) {
      state.x = maxX;
      state.vx = -Math.abs(state.vx) * restitution;
    }

    if (state.y < minY) {
      state.y = minY;
      state.vy = Math.abs(state.vy) * restitution;
    } else if (state.y > maxY) {
      state.y = maxY;
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
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const docRect = {
        left: rect.left + scrollX,
        right: rect.right + scrollX,
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY,
      };

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

      const closestX = clamp(state.x, docRect.left, docRect.right);
      const closestY = clamp(state.y, docRect.top, docRect.bottom);
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

  function getWorldBounds() {
    if (heroSection) {
      return getDocumentRect(heroSection);
    }

    return {
      left: window.scrollX,
      right: window.scrollX + window.innerWidth,
      top: window.scrollY,
      bottom: window.scrollY + window.innerHeight,
    };
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

      const currentX = event.clientX + window.scrollX;
      const currentY = event.clientY + window.scrollY;

      pointerState.x = currentX;
      pointerState.y = currentY;
      pointerState.active = true;

      const moveX = hadPointer ? currentX - previousX : 0;
      const moveY = hadPointer ? currentY - previousY : 0;

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

  window.addEventListener("scroll", () => {
    pointerState.active = false;
  });

  window.addEventListener("resize", () => {
    const bounds = getWorldBounds();
    state.x = clamp(state.x, bounds.left + radius + 8, bounds.right - radius - 8);
    state.y = clamp(state.y, bounds.top + radius + worldTopOffset, bounds.bottom - radius - 8);
    placeBallAtPreferredAnchor();
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

function getDocumentRect(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}
