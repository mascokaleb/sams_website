import { fetchSiteContent } from "./lib/sanityClient.js";

const SELECTORS = {
  heading: "[data-page-heading]",
  subheading: "[data-page-subheading]",
  brandText: "[data-brand-text]",
  brandMark: "[data-brand-mark]",
  count: "[data-highlight-count]",
  filters: "[data-year-filters]",
  groups: "[data-highlights-grid]",
  message: "[data-page-message]",
  search: "[data-highlight-search]",
};

const overlayReferrerBack = /video-highlights\.html|gallery\.html/.test(
  (document.referrer || "").toLowerCase()
);

const MEDIA_PLACEHOLDER_IMAGE = "images/samuel-placeholder.svg";
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const highlightState = {
  events: [],
  activeYear: "all",
  searchQuery: "",
  videos: [],
  photos: [],
};

document.addEventListener("DOMContentLoaded", () => {
  loadTournamentHighlights();
});

async function loadTournamentHighlights() {
  setPageMessage("Loading the tournament library...");

  const data = await fetchSiteContent();

  if (!data) {
    setPageMessage("Unable to load tournament highlights right now. Please try again soon.", "error");
    return;
  }

  highlightState.events = sortHighlightsChronologically(data.highlightEvents || []);
  highlightState.videos = Array.isArray(data.videos) ? data.videos : [];
  highlightState.photos = Array.isArray(data.galleryPhotos) ? data.galleryPhotos : [];
  highlightState.searchQuery = "";
  renderSiteIdentity(data.site, "Tournament Highlights");
  renderPageHeading(data.highlightsSection, highlightState.events.length);
  renderYearFilters(highlightState.events);
  setupHighlightSearch();
  renderHighlightGroups();
  setPageMessage("");
  openTournamentFromUrl();
}

function renderSiteIdentity(site, pageTitleSuffix) {
  if (site?.siteTitle) {
    document.title = `${site.siteTitle} | ${pageTitleSuffix}`;
  }

  const brandTextEl = select(SELECTORS.brandText);
  if (brandTextEl && site?.siteTitle) {
    brandTextEl.textContent = site.siteTitle;
  }

  const brandMarkEl = select(SELECTORS.brandMark);
  if (brandMarkEl) {
    if (site?.brandMarkImage?.url) {
      brandMarkEl.innerHTML = `<span class="brand-mark-image"><img src="${escapeAttribute(
        site.brandMarkImage.url
      )}" alt="${escapeHtml(site.brandMarkImage.alt || site.siteTitle || "Site logo")}" loading="lazy" /></span>`;
      brandMarkEl.classList.add("has-image");
    } else {
      brandMarkEl.textContent = site?.brandMarkInitials || getInitials(site?.siteTitle) || brandMarkEl.textContent || "SM";
      brandMarkEl.classList.remove("has-image");
    }
  }
}

function renderPageHeading(meta, total) {
  const headingEl = select(SELECTORS.heading);
  if (headingEl && meta?.heading) {
    headingEl.textContent = meta.heading;
  }

  const subheadingEl = select(SELECTORS.subheading);
  if (subheadingEl && meta?.subheading) {
    subheadingEl.textContent = meta.subheading;
  }

  updateHighlightCount(total, total, highlightState.activeYear);
}

function renderYearFilters(events) {
  const filtersEl = select(SELECTORS.filters);
  if (!filtersEl) {
    return;
  }

  const datedYears = Array.from(
    new Set(
      events
        .map((event) => getEventYear(event))
        .filter((year) => year && year !== "undated")
    )
  ).sort((a, b) => Number(b) - Number(a));

  const hasUndated = events.some((event) => getEventYear(event) === "undated");
  const filters = ["all", ...datedYears, ...(hasUndated ? ["undated"] : [])];

  if (filters.length <= 1) {
    filtersEl.innerHTML = "";
    return;
  }

  filtersEl.innerHTML = `
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${filters
        .map((value) => {
          const label = value === "all" ? "All" : value === "undated" ? "Undated" : value;
          const isActive = value === highlightState.activeYear;
          return `<button class="video-filter-chip${isActive ? " is-active" : ""}" type="button" data-year="${value}">${label}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-year]").forEach((button) => {
    button.addEventListener("click", () => {
      const year = button.getAttribute("data-year") || "all";
      if (year === highlightState.activeYear) {
        return;
      }
      highlightState.activeYear = year;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderHighlightGroups();
    });
  });
}

function setupHighlightSearch() {
  const searchInput = select(SELECTORS.search);
  if (!searchInput) {
    return;
  }

  searchInput.value = highlightState.searchQuery;
  searchInput.addEventListener("input", (event) => {
    highlightState.searchQuery = event.target.value.trim();
    renderHighlightGroups();
  });
}

function renderHighlightGroups() {
  const gridEl = select(SELECTORS.groups);
  if (!gridEl) {
    return;
  }

  const filteredByYear = filterHighlightsByYear(highlightState.events, highlightState.activeYear);
  const filtered = filterHighlightsBySearch(filteredByYear, highlightState.searchQuery);
  const hasSearch = Boolean(highlightState.searchQuery);

  if (!filtered.length) {
    const label =
      highlightState.activeYear === "all"
        ? "the library"
        : highlightState.activeYear === "undated"
          ? "undated rounds"
          : highlightState.activeYear;
    const message = hasSearch
      ? `No highlights match “${highlightState.searchQuery}”${
          highlightState.activeYear === "all" ? "" : ` in ${label}`
        }.`
      : `No highlights recorded for ${label} yet.`;
    gridEl.innerHTML = renderPlaceholder(message);
    setPageMessage(hasSearch ? message : "");
    updateHighlightCount(highlightState.events.length, 0, highlightState.activeYear);
    return;
  }

  setPageMessage("");

  const grouped = groupHighlightsByYear(filtered);
  let cardIndex = 0;
  const sections = grouped
    .map(({ year, items }) => {
      const title = year === "undated" ? "Undated Rounds" : year;
      const listItems = orderFeaturedFirst(items)
        .map((event) => renderHighlightListItem(event, `${year}-${cardIndex++}`))
        .join("");
      return `
        <section class="highlight-year-group" id="year-${year}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${title}</span>
            <span class="highlight-year-count">${pluralize(items.length, "highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${listItems}
          </ul>
        </section>
      `;
    })
    .join("");

  gridEl.innerHTML = sections;
  setupHighlightModals(gridEl);
  updateHighlightCount(highlightState.events.length, filtered.length, highlightState.activeYear);
}

function filterHighlightsByYear(events, year) {
  if (year === "all") {
    return [...events];
  }

  return events.filter((event) => getEventYear(event) === year);
}

function filterHighlightsBySearch(events, query) {
  if (!query) {
    return [...events];
  }

  const normalized = query.toLowerCase();
  return events.filter((event) => {
    const parts = [event.title, event.summary, event.location, event.eventDate, event.endDate];
    if (Array.isArray(event.days)) {
      event.days.forEach((day) => {
        parts.push(day.label, day.score, day.notes);
      });
    }
    const haystack = parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function groupHighlightsByYear(events) {
  const map = new Map();
  events.forEach((event) => {
    const year = getEventYear(event) || "undated";
    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year).push(event);
  });

  return Array.from(map.entries())
    .sort(([yearA], [yearB]) => {
      if (yearA === "undated") {
        return 1;
      }
      if (yearB === "undated") {
        return -1;
      }
      return Number(yearB) - Number(yearA);
    })
    .map(([year, items]) => ({ year, items }));
}

function renderHighlightListItem(event, identifier) {
  const readableDate = formatReadableDate(event);
  const fallbackDate = !readableDate && event.eventDate ? escapeHtml(event.eventDate) : "";
  const badgeParts = getDateParts(event.eventDate);
  const summaryMarkup = event.summary ? `<p class="highlight-summary">${escapeHtml(event.summary)}</p>` : "";
  const days = Array.isArray(event.days) ? event.days : [];
  const statsMarkup = renderDayStats(days, { variant: "list" });
  const safeIdentifier = (identifier || Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g, "-");
  const eventId = event?._id || safeIdentifier;
  const isFeatured = Boolean(event.pinToTop);
  const featuredBadge = isFeatured ? `<span class="highlight-badge">Featured</span>` : "";
  const modalButton = `
    <button class="highlight-toggle" type="button" data-highlight-modal="${escapeAttribute(eventId)}">
      View Details
    </button>
  `;
  const actionRow = `<div class="highlight-row-actions">${featuredBadge}${modalButton}</div>`;

  return `
    <li class="highlight-list-item${isFeatured ? " is-featured" : ""}">
      ${badgeParts ? renderDateBadge(badgeParts) : ""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${readableDate ? `<span class="highlight-date">${readableDate}</span>` : ""}
          ${!readableDate && fallbackDate ? `<span class="highlight-date">${fallbackDate}</span>` : ""}
        </div>
        <div class="highlight-row">
          <h3>${escapeHtml(event.title || "Tournament highlight")}</h3>
          ${actionRow}
        </div>
        ${statsMarkup}
        ${summaryMarkup}
      </div>
    </li>
  `;
}

function orderFeaturedFirst(events) {
  if (!Array.isArray(events)) {
    return [];
  }

  const featured = [];
  const regular = [];
  events.forEach((event) => {
    if (event?.pinToTop) {
      featured.push(event);
    } else {
      regular.push(event);
    }
  });

  return [...featured, ...regular];
}

function renderDayStats(days = [], { variant = "default", showLabels } = {}) {
  if (!Array.isArray(days) || !days.length) {
    return "";
  }

  const total = days.length;
  const labels = typeof showLabels === "boolean" ? showLabels : total > 1;
  const className = [
    "day-stats",
    variant === "list" ? "day-stats--list" : "",
    total === 1 ? "day-stats--single" : "",
    `day-stats--cols-${Math.min(total, 3)}`,
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <div class="${className}">
      ${days
        .map((day, index) => renderDayStat(day, index, { showLabels: labels, total }))
        .join("")}
    </div>
  `;
}

const DAY_RING_LAYOUT = [
  { key: "score", radius: 60, width: 12 },
  { key: "yards", radius: 45, width: 12 },
  { key: "rank", radius: 30, width: 12 },
];

const SCORE_RING_MAX = 120;
const SCORE_RING_MIN = 57;

function renderDayStat(day, index, { showLabels, total }) {
  if (!day) {
    return "";
  }

  const isSingle = total === 1;
  const label = !isSingle && showLabels ? resolveDayLabel(day, index, total) : null;
  const metricsMarkup = renderDayMetricLayout(day);

  if (!metricsMarkup) {
    return "";
  }

  return `
    <div class="day-stat${isSingle ? " day-stat--single" : ""}">
      ${label ? `<span class="day-stat-label">${escapeHtml(label)}</span>` : ""}
      ${metricsMarkup}
    </div>
  `;
}

function renderDayMetricLayout(day) {
  const metrics = buildDayMetricData(day);
  if (!metrics.length) {
    return "";
  }

  return `
    <div class="day-metrics">
      ${renderDayMetricList(metrics)}
    </div>
  `;
}

function renderDayMetricList(metrics) {
  return `
    <div class="day-metric-list">
      ${metrics
        .map((metric) => {
          const secondary = metric.secondary
            ? `<span class="day-metric-secondary">${escapeHtml(metric.secondary)}</span>`
            : "";
          return `
            <div class="day-metric" data-metric="${metric.key}">
              <span class="day-metric-value">${escapeHtml(metric.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${escapeHtml(metric.label)}
                  ${secondary}
                </span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function buildDayMetricData(day) {
  if (!day) {
    return [];
  }

  const metrics = [];
  const scoreValue = normalizeMetricValue(day.score);
  const yardageValue = normalizeMetricValue(day.yardage);

  metrics.push(
    createMetricEntry({
      key: "score",
      label: "Score",
      display: typeof scoreValue === "number" ? String(scoreValue) : "—",
      progress: computeScoreRingProgress(scoreValue),
    })
  );

  metrics.push(
    createMetricEntry({
      key: "yards",
      label: "Yardage",
      display: typeof yardageValue === "number" ? yardageValue.toLocaleString() : "—",
      secondary: typeof yardageValue === "number" ? "" : "",
      progress: computePositiveProgress(yardageValue, resolveYardageTarget(day, yardageValue)),
    })
  );

  const ranking = resolveRankingMetrics(day);
  metrics.push(
    createMetricEntry({
      key: "rank",
      label: "Rank",
      display: ranking.display,
      secondary: ranking.secondary,
      progress: ranking.progress,
    })
  );

  return metrics.filter(Boolean);
}

function createMetricEntry({ key, label, display, secondary, progress }) {
  const safeDisplay = display != null && display !== "" ? String(display) : "—";
  const safeSecondary = secondary ? String(secondary) : "";
  const numericProgress = typeof progress === "number" && !Number.isNaN(progress) ? progress : 0;

  return {
    key,
    label,
    display: safeDisplay,
    secondary: safeSecondary,
    progress: Math.max(0, numericProgress),
  };
}

function renderDayNotes(days = []) {
  if (!Array.isArray(days)) {
    return "";
  }

  const notes = days
    .map((day, index) => {
      if (!day?.notes) {
        return "";
      }
      const label = resolveDayLabel(day, index, days.length) || "Notes";
      return `
        <div class="day-note">
          <strong>${escapeHtml(label)}</strong>
          <p>${escapeHtml(day.notes)}</p>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return notes ? `<div class="day-notes">${notes}</div>` : "";
}

function resolveDayLabel(day, index, total) {
  if (day?.label) {
    return day.label;
  }
  if (total > 1) {
    return `Day ${index + 1}`;
  }
  return null;
}

function normalizeMetricValue(value) {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function resolveYardageTarget(day, value) {
  if (typeof value === "number" && value > 0) {
    return Math.max(7200, Math.round(value / 50) * 50);
  }
  return 7200;
}

function computeScoreRingProgress(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  const span = SCORE_RING_MAX - SCORE_RING_MIN;
  if (span <= 0) {
    return 0;
  }

  return (SCORE_RING_MAX - value) / span;
}

function computePositiveProgress(value, target) {
  if (typeof value !== "number" || Number.isNaN(value) || !target || target <= 0) {
    return 0;
  }
  return value / target;
}

function computeRankProgress(position, outOf) {
  if (
    typeof position !== "number" ||
    Number.isNaN(position) ||
    typeof outOf !== "number" ||
    outOf <= 0
  ) {
    return 0;
  }

  if (outOf === 1) {
    return 1;
  }

  const ratio = (outOf - position) / (outOf - 1);
  return Math.max(0, Math.min(ratio, 1));
}

function resolveRankingMetrics(day) {
  const position = normalizeMetricValue(day?.rankingPosition);
  const outOf = normalizeMetricValue(day?.rankingOutOf);
  const progress = computeRankProgress(position, outOf);

  if (typeof position === "number") {
    return {
      display: String(position),
      secondary: typeof outOf === "number" ? `of ${outOf}` : "",
      progress,
    };
  }

  return {
    display: "—",
    secondary: "",
    progress: 0,
  };
}

function sortHighlightsChronologically(events) {
  if (!Array.isArray(events)) {
    return [];
  }

  return [...events].sort((a, b) => getEntryTimestamp(b) - getEntryTimestamp(a));
}

function getEntryTimestamp(entry) {
  if (!entry) {
    return 0;
  }

  if (entry.eventDate) {
    const parsed = Date.parse(entry.eventDate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (entry._createdAt) {
    const fallback = Date.parse(entry._createdAt);
    if (!Number.isNaN(fallback)) {
      return fallback;
    }
  }

  return 0;
}

function setupHighlightModals(root) {
  if (!root) {
    return;
  }

  root.querySelectorAll("[data-highlight-modal]").forEach((button) => {
    if (button.dataset.modalBound === "true") {
      return;
    }

    button.dataset.modalBound = "true";
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-highlight-modal");
      openHighlightOverlay(eventId);
    });
  });
}

function renderDateBadge(parts) {
  return `
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${parts.month}</span>
      <strong>${parts.day}</strong>
      <span class="year">${parts.year}</span>
    </div>
  `;
}

let highlightOverlayElement = null;

function ensureHighlightOverlay() {
  if (highlightOverlayElement) {
    return highlightOverlayElement;
  }

  const overlay = document.createElement("div");
  overlay.className = "highlight-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `;

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-highlight-overlay-close]")) {
      closeHighlightOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeHighlightOverlay();
    }
  });

  document.body.appendChild(overlay);
  highlightOverlayElement = overlay;
  return overlay;
}

function openHighlightOverlay(eventId) {
  const overlay = ensureHighlightOverlay();
  const body = overlay.querySelector("[data-highlight-overlay-body]");
  if (!body) {
    return;
  }

  const event = findHighlightEvent(eventId);
  if (!event) {
    return;
  }

  const videos = getVideosForEvent(event);
  const photos = getPhotosForEvent(event);

  body.innerHTML = renderHighlightOverlayContent(event, videos, photos);
  setupVideoFrames(body);
  setupPhotoPreviewButtons(body);
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-showing-highlight-overlay");
}

function closeHighlightOverlay() {
  if (!highlightOverlayElement) {
    return;
  }

  const body = highlightOverlayElement.querySelector("[data-highlight-overlay-body]");
  if (body) {
    body.innerHTML = "";
  }

  highlightOverlayElement.classList.remove("is-open");
  highlightOverlayElement.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-showing-highlight-overlay");

  if (overlayReferrerBack && window.history.length > 1) {
    history.back();
  }
}

function getRequestedTournamentId() {
  try {
    const url = new URL(window.location.href);
    const searchId = url.searchParams.get("tournament");
    if (searchId) {
      return decodeURIComponent(searchId);
    }
  } catch {
    // Ignore URL parsing issues
  }

  if (window.location.hash) {
    return decodeURIComponent(window.location.hash.replace(/^#/, ""));
  }

  return null;
}

function openTournamentFromUrl() {
  const targetId = getRequestedTournamentId();
  if (!targetId) {
    return;
  }

  const event = findHighlightEvent(targetId);
  if (!event) {
    return;
  }

  openHighlightOverlay(event._id || event.title || targetId);
}

function findHighlightEvent(eventId) {
  if (!eventId) {
    return highlightState.events[0] || null;
  }

  return (
    highlightState.events.find((event) => event?._id === eventId) ||
    highlightState.events.find((event) => event.title === eventId) ||
    null
  );
}

function renderHighlightOverlayContent(event, videos, photos) {
  const readableDate = formatReadableDate(event);
  const metaParts = [readableDate, event.location ? escapeHtml(event.location) : null].filter(Boolean);
  const metaMarkup = metaParts.length
    ? `<div class="highlight-overlay-meta">
        ${metaParts
          .map((part) => `<span>${part}</span>`)
          .join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`
    : "";
  const statsMarkup = renderDayStats(event.days || [], { variant: "list" });
  const notesMarkup = renderDayNotes(event.days || []);

  return `
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${escapeHtml(event.title || "Tournament highlight")}</h2>
        ${metaMarkup}
        ${event.summary ? `<p class="highlight-overlay-summary">${escapeHtml(event.summary)}</p>` : ""}
      </header>
      ${statsMarkup ? `<section class="highlight-overlay-section">${statsMarkup}</section>` : ""}
      ${notesMarkup ? `<section class="highlight-overlay-section">${notesMarkup}</section>` : ""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${renderOverlayVideos(videos)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${renderOverlayPhotos(photos)}
      </section>
    </div>
  `;
}

function renderOverlayVideos(videos) {
  if (!Array.isArray(videos) || !videos.length) {
    return `<p class="placeholder-text">No videos linked to this tournament yet.</p>`;
  }

  return `
    <div class="overlay-media-grid">
      ${videos.map(renderOverlayVideoCard).join("")}
    </div>
  `;
}

function renderOverlayVideoCard(video) {
  const youtubeId = resolveYoutubeVideoId(video);
  const thumbnail =
    video.thumbnailUrl ||
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : MEDIA_PLACEHOLDER_IMAGE);
  const alt = video.thumbnailAlt || video.title || "Video highlight";
  const videoTitle = video.title || "Video highlight";
  const isPlayable = Boolean(youtubeId);
  const buttonState = isPlayable ? "" : ' disabled aria-disabled="true"';
  const badgeParts = getVideoDateParts(video.eventDate);
  const dateOverlay = badgeParts ? renderVideoDateOverlay(badgeParts) : "";

  return `
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${escapeHtml(
        youtubeId
      )}" data-video-title="${escapeHtml(videoTitle)}">
        ${dateOverlay}
        <img src="${escapeAttribute(thumbnail)}" alt="${escapeHtml(alt)}" loading="lazy" />
        <button class="play-button" type="button"${buttonState} aria-label="Play ${escapeHtml(
          videoTitle
        )}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${escapeHtml(video.title || "Video highlight")}</h4>
        ${video.description ? `<p>${escapeHtml(video.description)}</p>` : ""}
      </div>
    </article>
  `;
}

function renderOverlayPhotos(photos) {
  if (!Array.isArray(photos) || !photos.length) {
    return `<p class="placeholder-text">No photos linked to this tournament yet.</p>`;
  }

  return `
    <div class="overlay-media-grid overlay-photo-grid">
      ${photos.map(renderOverlayPhotoCard).join("")}
    </div>
  `;
}

function renderOverlayPhotoCard(photo) {
  const imageUrl = photo?.image?.url || MEDIA_PLACEHOLDER_IMAGE;
  const alt = photo?.image?.alt || photo?.title || "Gallery photo";
  const shotDateParts = getShotDateParts(photo?.shotDate);
  const dateOverlay = shotDateParts ? renderPhotoDateOverlay(shotDateParts) : "";
  const previewData = photo?.image?.url
    ? { src: imageUrl, alt, title: photo?.title || "Gallery photo" }
    : null;
  const previewAttributes = previewData
    ? `data-photo-preview="true" data-photo-src="${escapeAttribute(previewData.src)}" data-photo-alt="${escapeAttribute(
        previewData.alt
      )}" data-photo-title="${escapeAttribute(previewData.title)}"`
    : "";
  const photographerText = photo?.photographer
    ? `<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${escapeHtml(photo.photographer)}</div>`
    : "";

  return `
    <article class="gallery-card">
      <div class="gallery-card-media"${previewAttributes ? ` ${previewAttributes}` : ""}>
        ${dateOverlay}
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeHtml(alt)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        <h4>${escapeHtml(photo?.title || "Gallery photo")}</h4>
        ${photo?.description ? `<p class="gallery-card-description">${escapeHtml(photo.description)}</p>` : ""}
        ${photographerText ? `<div class="gallery-card-footer">${photographerText}</div>` : ""}
      </div>
    </article>
  `;
}

function getVideosForEvent(event) {
  if (!event || !Array.isArray(highlightState.videos)) {
    return [];
  }

  return highlightState.videos.filter((video) => doesItemBelongToEvent(video, event));
}

function getPhotosForEvent(event) {
  if (!event || !Array.isArray(highlightState.photos)) {
    return [];
  }

  return highlightState.photos.filter((photo) => doesItemBelongToEvent(photo, event));
}

function doesItemBelongToEvent(item, event) {
  const info = getTournamentInfo(item);
  if (!info) {
    return false;
  }

  if (info.id && event?._id && info.id === event._id) {
    return true;
  }

  if (info.title && event?.title && info.title === event.title) {
    return true;
  }

  return false;
}

function getTournamentInfo(item) {
  if (!item) {
    return null;
  }

  if (item.tournament && typeof item.tournament === "object" && item.tournament.title) {
    return {
      id: item.tournament._id || item.tournament._ref || item.tournament.id || null,
      title: item.tournament.title,
    };
  }

  if (typeof item.tournament === "string" && item.tournament) {
    return { id: item.tournament, title: item.tournament };
  }

  return null;
}

function formatVideoMeta(video) {
  if (!video?.eventDate) {
    return "Updated recently";
  }

  const date = new Date(video.eventDate);
  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatVideoDate(video) {
  if (!video?.eventDate) {
    return "";
  }

  const date = new Date(video.eventDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getVideoDateParts(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.getDate().toString().padStart(2, "0"),
    year: date.getFullYear(),
  };
}

function renderVideoDateOverlay(parts) {
  return `
    <div class="video-date-overlay" aria-label="${parts.month} ${parts.day}, ${parts.year}">
      <span class="month">${parts.month}</span>
      <strong>${parts.day}</strong>
      <span class="year">${parts.year}</span>
    </div>
  `;
}

function getShotDateParts(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.getDate().toString().padStart(2, "0"),
    year: date.getFullYear(),
  };
}

function renderPhotoDateOverlay(parts) {
  return `
    <div class="video-date-overlay" aria-label="${parts.month} ${parts.day}, ${parts.year}">
      <span class="month">${parts.month}</span>
      <strong>${parts.day}</strong>
      <span class="year">${parts.year}</span>
    </div>
  `;
}

function getVideoExternalLink(video) {
  if (!video) {
    return "";
  }

  if (video.youtubeUrl) {
    return video.youtubeUrl;
  }

  if (video.youtubeId) {
    return `https://youtu.be/${video.youtubeId}`;
  }

  return "";
}

let videoOverlayElement = null;

function setupVideoFrames(scope = document) {
  const root = scope instanceof Element ? scope : document;
  root.querySelectorAll(".video-frame").forEach((frame) => {
    if (frame.dataset.playerReady === "true") {
      return;
    }

    const playButton = frame.querySelector(".play-button");
    const videoId = frame.dataset.videoId;
    const videoTitle = frame.dataset.videoTitle || "Samuel Masco golf video highlight";

    if (!playButton || !videoId) {
      return;
    }

    playButton.addEventListener("click", () => {
      openVideoOverlay(videoId, videoTitle);
    });

    frame.dataset.playerReady = "true";
  });
}

function ensureVideoOverlay() {
  if (videoOverlayElement) {
    return videoOverlayElement;
  }

  const overlay = document.createElement("div");
  overlay.className = "video-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `;

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-overlay-close]")) {
      closeVideoOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeVideoOverlay();
    }
  });

  document.body.appendChild(overlay);
  videoOverlayElement = overlay;
  return overlay;
}

function openVideoOverlay(videoId, videoTitle) {
  if (!videoId) {
    return;
  }

  const overlay = ensureVideoOverlay();
  const frame = overlay.querySelector(".video-overlay-frame");
  if (!frame) {
    return;
  }

  frame.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.title = videoTitle || "Samuel Masco golf video highlight";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;

  frame.appendChild(iframe);

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-showing-video");
}

function closeVideoOverlay() {
  if (!videoOverlayElement) {
    return;
  }

  const frame = videoOverlayElement.querySelector(".video-overlay-frame");
  if (frame) {
    frame.innerHTML = "";
  }

  videoOverlayElement.classList.remove("is-open");
  videoOverlayElement.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-showing-video");
}

let photoOverlayElement = null;

function setupPhotoPreviewButtons(scope = document) {
  if (!scope) {
    return;
  }

  const root = scope instanceof Element ? scope : document;
  root.querySelectorAll("[data-photo-preview]").forEach((media) => {
    if (media.dataset.photoPreviewReady === "true") {
      return;
    }
    media.addEventListener("click", () => {
      openPhotoOverlay(
        media.getAttribute("data-photo-src"),
        media.getAttribute("data-photo-alt"),
        media.getAttribute("data-photo-title")
      );
    });
    media.dataset.photoPreviewReady = "true";
  });
}

function ensurePhotoOverlay() {
  if (photoOverlayElement) {
    return photoOverlayElement;
  }

  const overlay = document.createElement("div");
  overlay.className = "photo-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="photo-overlay-backdrop" data-photo-overlay-close></div>
    <div class="photo-overlay-dialog" role="dialog" aria-modal="true">
      <button class="photo-overlay-close" type="button" data-photo-overlay-close>
        <span class="sr-only">Close photo</span>
        ×
      </button>
      <figure class="photo-overlay-frame">
        <img src="" alt="" loading="lazy" />
        <figcaption></figcaption>
      </figure>
    </div>
  `;

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-photo-overlay-close]")) {
      closePhotoOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closePhotoOverlay();
    }
  });

  document.body.appendChild(overlay);
  photoOverlayElement = overlay;
  return overlay;
}

function openPhotoOverlay(src, alt, title) {
  if (!src) {
    return;
  }

  const overlay = ensurePhotoOverlay();
  const image = overlay.querySelector("img");
  const caption = overlay.querySelector("figcaption");

  if (!image || !caption) {
    return;
  }

  image.src = src;
  image.alt = alt || title || "Gallery photo";
  caption.textContent = title || alt || "";

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-showing-photo");
}

function closePhotoOverlay() {
  if (!photoOverlayElement) {
    return;
  }

  const image = photoOverlayElement.querySelector("img");
  const caption = photoOverlayElement.querySelector("figcaption");
  if (image) {
    image.src = "";
    image.alt = "";
  }
  if (caption) {
    caption.textContent = "";
  }

  photoOverlayElement.classList.remove("is-open");
  photoOverlayElement.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-showing-photo");
}

function formatReadableDate(event) {
  if (!event) {
    return "";
  }

  return formatDateRangeDisplay(event.eventDate, event.endDate, { month: "long" });
}

function formatDateRangeDisplay(startValue, endValue, { month = "long" } = {}) {
  if (!startValue) {
    return "";
  }

  const start = new Date(startValue);
  if (Number.isNaN(start.getTime())) {
    return escapeHtml(startValue);
  }

  if (!endValue) {
    return start.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" });
  }

  const end = new Date(endValue);
  if (Number.isNaN(end.getTime())) {
    const startText = start.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" });
    return `${startText} – ${escapeHtml(endValue)}`;
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameYear && sameMonth) {
    const monthLabel = start.toLocaleDateString("en-US", { month });
    return `${monthLabel} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
  }

  if (sameYear) {
    const startText = start.toLocaleDateString("en-US", { month, day: "numeric" });
    const endText = end.toLocaleDateString("en-US", { month, day: "numeric" });
    return `${startText} – ${endText}, ${start.getFullYear()}`;
  }

  const startText = start.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" });
  const endText = end.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" });
  return `${startText} – ${endText}`;
}

function resolveYoutubeVideoId(video) {
  if (!video) {
    return "";
  }

  return extractYoutubeId(video.youtubeId) || extractYoutubeId(video.youtubeUrl);
}

function extractYoutubeId(value) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "") || "";
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "") || "";
      }

      const id = url.searchParams.get("v");
      if (id) {
        return id;
      }
    }
  } catch (error) {
    return "";
  }

  return "";
}

function getDateParts(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.getDate().toString().padStart(2, "0"),
    year: date.getFullYear(),
  };
}

function updateHighlightCount(total, visible, activeYear) {
  const countEl = select(SELECTORS.count);
  if (!countEl) {
    return;
  }

  const totalLabel = `${total} recorded ${pluralize(total, "highlight")}`;
  if (activeYear === "all") {
    countEl.textContent = totalLabel;
    return;
  }

  const yearLabel = activeYear === "undated" ? "undated rounds" : `${activeYear}`;
  const visibleLabel = `${visible} ${visible === 1 ? "entry" : "entries"}`;
  countEl.textContent = `${totalLabel} · ${visibleLabel} in ${yearLabel}`;
}

function getEventYear(event) {
  if (!event?.eventDate) {
    return "undated";
  }

  const date = new Date(event.eventDate);
  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  return date.getFullYear().toString();
}

function setPageMessage(message, tone = "info") {
  const messageEl = select(SELECTORS.message);
  if (!messageEl) {
    return;
  }

  if (!message) {
    messageEl.textContent = "";
    messageEl.classList.remove("error");
    messageEl.hidden = true;
    return;
  }

  messageEl.hidden = false;
  messageEl.textContent = message;
  if (tone === "error") {
    messageEl.classList.add("error");
  } else {
    messageEl.classList.remove("error");
  }
}

function pluralize(count, singular) {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

function select(selector) {
  if (!selector) {
    return null;
  }
  return document.querySelector(selector);
}

function escapeHtml(value) {
  if (value === null || value === undefined) {
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
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function getInitials(value) {
  if (!value) {
    return "";
  }
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
