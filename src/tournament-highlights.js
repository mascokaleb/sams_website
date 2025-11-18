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

const highlightState = {
  events: [],
  activeYear: "all",
  searchQuery: "",
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
  highlightState.searchQuery = "";
  renderSiteIdentity(data.site, "Tournament Highlights");
  renderPageHeading(data.highlightsSection, highlightState.events.length);
  renderYearFilters(highlightState.events);
  setupHighlightSearch();
  renderHighlightGroups();
  setPageMessage("");
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
  setupHighlightToggles(gridEl);
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
  const summary = event.summary ? `<p class="highlight-summary">${escapeHtml(event.summary)}</p>` : "";
  const days = Array.isArray(event.days) ? event.days : [];
  const statsMarkup = renderDayStats(days, { variant: "list" });
  const notesMarkup = renderDayNotes(days);
  const safeIdentifier = (identifier || Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g, "-");
  const detailsId = `highlight-details-${safeIdentifier}`;
  const hasDetails = Boolean(summary || notesMarkup);
  const isFeatured = Boolean(event.pinToTop);
  const featuredBadge = isFeatured ? `<span class="highlight-badge">Featured</span>` : "";
  const toggleButton = hasDetails
    ? `<button class="highlight-toggle" type="button" data-highlight-toggle data-target="${detailsId}" aria-expanded="false">View Details</button>`
    : "";
  const detailsMarkup = hasDetails
    ? `<div class="highlight-details" data-highlight-details="${detailsId}" id="${detailsId}" hidden>
        ${summary}
        ${notesMarkup}
      </div>`
    : "";
  const actionRow = featuredBadge || toggleButton ? `<div class="highlight-row-actions">${featuredBadge}${toggleButton}</div>` : "";

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
        ${detailsMarkup}
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

  const label = showLabels ? resolveDayLabel(day, index, total) : null;
  const metricsMarkup = renderDayMetricLayout(day);

  if (!metricsMarkup) {
    return "";
  }

  return `
    <div class="day-stat">
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

function setupHighlightToggles(root) {
  if (!root) {
    return;
  }

  root.querySelectorAll("[data-highlight-toggle]").forEach((button) => {
    if (button.dataset.toggleBound === "true") {
      return;
    }

    button.dataset.toggleBound = "true";
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const container = button.closest(".highlight-list-item");
      const details = container?.querySelector(`[data-highlight-details="${targetId}"]`);

      if (!details) {
        return;
      }

      const isHidden = details.hasAttribute("hidden");
      if (isHidden) {
        details.removeAttribute("hidden");
      } else {
        details.setAttribute("hidden", "");
      }

      button.setAttribute("aria-expanded", isHidden ? "true" : "false");
      button.classList.toggle("is-open", isHidden);
      button.textContent = isHidden ? "Hide Details" : "View Details";
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
