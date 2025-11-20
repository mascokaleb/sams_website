import { fetchSiteContent } from "./lib/sanityClient.js";

const HERO_PLACEHOLDER_IMAGE = "images/samuel-placeholder.svg";

const SELECTORS = {
  heading: "[data-page-heading]",
  subheading: "[data-page-subheading]",
  brandText: "[data-brand-text]",
  brandMark: "[data-brand-mark]",
  count: "[data-photo-count]",
  grid: "[data-photo-grid]",
  search: "[data-photo-search]",
  yearFilters: "[data-photo-year-filters]",
  tagFilters: "[data-photo-tag-filters]",
  tournamentFilters: "[data-photo-tournament-filters]",
  message: "[data-gallery-message]",
};

const galleryState = {
  photos: [],
  searchQuery: "",
  activeYear: "all",
  activeTag: "all",
  activeTournament: "all",
};

document.addEventListener("DOMContentLoaded", () => {
  loadGalleryPhotos();
});

async function loadGalleryPhotos() {
  setPageMessage("Loading the gallery...");

  const data = await fetchSiteContent();
  if (!data) {
    setPageMessage("Unable to load the gallery right now. Please try again soon.", "error");
    return;
  }

  galleryState.photos = sortGalleryPhotos(data.galleryPhotos || []);
  renderSiteIdentity(data.site, "Photo Gallery");
  renderPageHeading(data.gallerySection, galleryState.photos.length);
  renderYearFilters(galleryState.photos);
  renderTagFilters(galleryState.photos);
  renderTournamentFilters(galleryState.photos);
  setupSearch();
  renderGalleryGrid();
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
      brandMarkEl.textContent =
        site?.brandMarkInitials || getInitials(site?.siteTitle) || brandMarkEl.textContent || "SM";
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

  updatePhotoCount(total, total);
}

function renderYearFilters(photos) {
  const filtersEl = select(SELECTORS.yearFilters);
  if (!filtersEl) {
    return;
  }

  const years = Array.from(
    new Set(
      photos
        .map((photo) => getPhotoYear(photo))
        .filter((year) => year && year !== "undated")
    )
  ).sort((a, b) => Number(b) - Number(a));

  const hasUndated = photos.some((photo) => getPhotoYear(photo) === "undated");
  const options = ["all", ...years, ...(hasUndated ? ["undated"] : [])];

  if (options.length <= 1) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    return;
  }

  filtersEl.hidden = false;
  filtersEl.innerHTML = `
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${options
        .map((year) => {
          const label = year === "all" ? "All" : year === "undated" ? "Undated" : year;
          const isActive = year === galleryState.activeYear;
          return `<button class="video-filter-chip${
            isActive ? " is-active" : ""
          }" type="button" data-year="${escapeAttribute(year)}">${escapeHtml(label)}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-year]").forEach((button) => {
    button.addEventListener("click", () => {
      const year = button.getAttribute("data-year") || "all";
      if (year === galleryState.activeYear) {
        return;
      }

      galleryState.activeYear = year;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGalleryGrid();
    });
  });
}

function renderTagFilters(photos) {
  const filtersEl = select(SELECTORS.tagFilters);
  if (!filtersEl) {
    return;
  }

  const tags = Array.from(
    new Set(
      photos.flatMap((photo) => getNormalizedTags(photo))
    )
  ).sort((a, b) => a.localeCompare(b));

  if (!tags.length) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    return;
  }

  const options = ["all", ...tags];
  filtersEl.hidden = false;
  filtersEl.innerHTML = `
    <div class="filter-heading">Filter by tag</div>
    <div class="video-filter-chips">
      ${options
        .map((tag) => {
          const label = tag === "all" ? "All" : tag;
          const isActive = tag === galleryState.activeTag;
          return `<button class="video-filter-chip${
            isActive ? " is-active" : ""
          }" type="button" data-tag="${escapeAttribute(tag)}">${escapeHtml(label)}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.getAttribute("data-tag") || "all";
      if (tag === galleryState.activeTag) {
        return;
      }

      galleryState.activeTag = tag;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGalleryGrid();
    });
  });
}

function renderTournamentFilters(photos) {
  const filtersEl = select(SELECTORS.tournamentFilters);
  if (!filtersEl) {
    return;
  }

  const tournaments = new Map();
  photos.forEach((photo) => {
    const tournament = getPhotoTournament(photo);
    if (tournament?.title) {
      const key = tournament.id || tournament.title;
      if (!tournaments.has(key)) {
        tournaments.set(key, { id: key, title: tournament.title });
      }
    }
  });

  if (!tournaments.size) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    galleryState.activeTournament = "all";
    return;
  }

  const ordered = Array.from(tournaments.values()).sort((a, b) => a.title.localeCompare(b.title));
  if (galleryState.activeTournament !== "all" && !ordered.some((option) => option.id === galleryState.activeTournament)) {
    galleryState.activeTournament = "all";
  }
  filtersEl.hidden = false;
  filtersEl.innerHTML = `
    <div class="filter-heading">Filter by tournament</div>
    <div class="video-filter-chips">
      ${[
        { id: "all", title: "All" },
        ...ordered,
      ]
        .map((option) => {
          const isActive = option.id === galleryState.activeTournament;
          return `<button class="video-filter-chip${isActive ? " is-active" : ""}" type="button" data-tournament="${escapeAttribute(
            option.id
          )}">${escapeHtml(option.title)}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-tournament]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-tournament") || "all";
      if (value === galleryState.activeTournament) {
        return;
      }
      galleryState.activeTournament = value;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGalleryGrid();
    });
  });
}

function setupSearch() {
  const searchInput = select(SELECTORS.search);
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", (event) => {
    galleryState.searchQuery = event.target.value.trim().toLowerCase();
    renderGalleryGrid();
  });
}

function renderGalleryGrid() {
  const gridEl = select(SELECTORS.grid);
  if (!gridEl) {
    return;
  }

  const filtered = galleryState.photos
    .filter(filterByYear)
    .filter(filterByTag)
    .filter(filterByTournament)
    .filter(filterBySearch);

  updatePhotoCount(galleryState.photos.length, filtered.length);

  if (!filtered.length) {
    const hasFilters =
      galleryState.searchQuery.length ||
      galleryState.activeYear !== "all" ||
      galleryState.activeTag !== "all" ||
      galleryState.activeTournament !== "all";
    setPageMessage(
      hasFilters
        ? "No photos match your current search or filter selection."
        : "No photo gallery entries have been published yet.",
      hasFilters ? "info" : "error"
    );
    gridEl.innerHTML = "";
    return;
  }

  setPageMessage("");
  gridEl.innerHTML = filtered.map((photo, index) => renderGalleryPhoto(photo, index)).join("");
  gridEl.querySelectorAll("[data-motion]").forEach((el) => el.classList.add("is-visible"));
  setupPhotoPreviewButtons(gridEl);
}

function filterByYear(photo) {
  if (galleryState.activeYear === "all") {
    return true;
  }

  const year = getPhotoYear(photo);
  return year === galleryState.activeYear;
}

function filterByTag(photo) {
  if (galleryState.activeTag === "all") {
    return true;
  }

  const tags = getNormalizedTags(photo);
  return tags.includes(galleryState.activeTag);
}

function filterByTournament(photo) {
  if (galleryState.activeTournament === "all") {
    return true;
  }

  const tournament = getPhotoTournament(photo);
  const tournamentId = tournament?.id || tournament?.title || "";
  return tournamentId === galleryState.activeTournament;
}

function filterBySearch(photo) {
  if (!galleryState.searchQuery) {
    return true;
  }

  const haystack = [
    photo?.title,
    photo?.description,
    getPhotoTournamentTitle(photo),
    photo?.location,
    photo?.photographer,
    getNormalizedTags(photo).join(" "),
  ]
    .map((value) => (value ? String(value).toLowerCase() : ""))
    .join(" ");

  return haystack.includes(galleryState.searchQuery);
}

function renderGalleryPhoto(photo, index = 0) {
  const tournamentChip = renderTournamentChip(photo);
  const isFeatured = isFeaturedPhoto(photo);
  const featureBadge = isFeatured ? `<span class="highlight-badge">Featured</span>` : "";
  const imageUrl = photo?.image?.url || photo?.photo?.asset?.url || HERO_PLACEHOLDER_IMAGE;
  const altText = photo?.image?.alt || photo?.photo?.alt || photo?.title || "Gallery image";
  const shotDateParts = getShotDateParts(photo?.shotDate);
  const dateOverlay = shotDateParts ? renderPhotoDateOverlay(shotDateParts) : "";
  const previewData = imageUrl
    ? {
        src: imageUrl,
        alt: altText,
        title: photo?.title || "Gallery highlight",
      }
    : null;
  const previewAttributes = previewData
    ? `data-photo-src="${escapeAttribute(previewData.src)}" data-photo-alt="${escapeAttribute(
        previewData.alt
      )}" data-photo-title="${escapeAttribute(previewData.title)}"`
    : "";
  const metaParts = [];
  if (photo?.location) {
    metaParts.push(photo.location);
  }

  const metaLabels = metaParts
    .map((part) => `<span>${escapeHtml(part)}</span>`)
    .join('<span class="meta-dot" aria-hidden="true">•</span>');
  const metaMarkup = metaLabels ? `<div class="gallery-card-meta">${metaLabels}</div>` : "";
  const cardTop = featureBadge || metaMarkup ? `<div class="gallery-card-top">${featureBadge}${metaMarkup}</div>` : "";

  const descriptionMarkup = photo?.description
    ? `<p class="gallery-card-description">${escapeHtml(photo.description)}</p>`
    : "";
  const photographerText = photo?.photographer
    ? `<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${escapeHtml(photo.photographer)}</div>`
    : "";
  const footerMarkup = photographerText ? `<div class="gallery-card-footer">${photographerText}</div>` : "";
  const mediaAttributes = previewData ? `data-photo-preview="true" ${previewAttributes}` : "";

  return `
    <article class="gallery-card${isFeatured ? " is-featured" : ""}" data-motion="delay-${(index % 3) + 1}">
      <div class="gallery-card-media"${mediaAttributes ? ` ${mediaAttributes}` : ""}>
        ${dateOverlay}
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeHtml(altText)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        ${cardTop}
        <h3>${escapeHtml(photo?.title || "Gallery highlight")}</h3>
        ${tournamentChip ? `<div class="card-chip-slot">${tournamentChip}</div>` : ""}
        ${descriptionMarkup}
        ${renderTagList(photo?.tags)}
        ${footerMarkup}
      </div>
    </article>
  `;
}

function renderTagList(tags) {
  const cleaned = normalizeTags(tags);
  if (!cleaned.length) {
    return "";
  }

  return `
    <div class="gallery-card-tags">
      ${cleaned.map((tag) => `<span class="gallery-tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

function updatePhotoCount(total, visible) {
  const countEl = select(SELECTORS.count);
  if (!countEl) {
    return;
  }

  const totalLabel = `${total} ${total === 1 ? "photo" : "photos"}`;
  if (visible === total) {
    countEl.textContent = totalLabel;
  } else {
    countEl.textContent = `${totalLabel} · Showing ${visible}`;
  }
}

function sortGalleryPhotos(photos) {
  if (!Array.isArray(photos)) {
    return [];
  }

  return [...photos].sort((a, b) => {
    const aFeatured = isFeaturedPhoto(a);
    const bFeatured = isFeaturedPhoto(b);
    if (aFeatured !== bFeatured) {
      return aFeatured ? -1 : 1;
    }
    return getPhotoTimestamp(b) - getPhotoTimestamp(a);
  });
}

function getPhotoTimestamp(photo) {
  if (!photo) {
    return 0;
  }

  if (photo.shotDate) {
    const parsed = Date.parse(photo.shotDate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (photo._createdAt) {
    const fallback = Date.parse(photo._createdAt);
    if (!Number.isNaN(fallback)) {
      return fallback;
    }
  }

  return 0;
}

function getPhotoYear(photo) {
  if (!photo?.shotDate) {
    return "undated";
  }

  const parsed = new Date(photo.shotDate);
  if (Number.isNaN(parsed.getTime())) {
    return "undated";
  }

  return String(parsed.getFullYear());
}

function getNormalizedTags(photo) {
  return normalizeTags(photo?.tags);
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean);
}

function isFeaturedPhoto(photo) {
  return Boolean(photo?.featured || photo?.pinToTop);
}

function getPhotoTournament(photo) {
  if (!photo) {
    return null;
  }

  if (photo.tournament && typeof photo.tournament === "object" && photo.tournament.title) {
    return {
      id: photo.tournament._id || photo.tournament.id || photo.tournament._ref || null,
      title: photo.tournament.title,
    };
  }

  if (typeof photo.tournament === "string" && photo.tournament) {
    return { id: photo.tournament, title: photo.tournament };
  }

  return null;
}

function getPhotoTournamentTitle(photo) {
  const tournament = getPhotoTournament(photo);
  return tournament?.title || "";
}

function renderTournamentChip(photo) {
  const tournament = getPhotoTournament(photo);
  if (!tournament?.title) {
    return "";
  }

  const targetId = tournament.id || tournament.title;
  const params = new URLSearchParams();
  if (targetId) {
    params.set("tournament", targetId);
  }
  params.set("origin", "gallery");
  const href = `tournament-highlights.html${params.toString() ? `?${params.toString()}` : ""}`;

  return `
    <a class="tournament-chip tournament-chip--on-card" href="${escapeAttribute(href)}"${
    targetId ? ` data-highlight-modal="${escapeAttribute(targetId)}" aria-label="View ${escapeAttribute(tournament.title)} tournament details"` : ""
  }>
      <span class="tournament-chip-name">${escapeHtml(tournament.title)}</span>
    </a>
  `;
}

let photoOverlayElement = null;

function setupPhotoPreviewButtons(scope = document) {
  if (!scope) {
    return;
  }

  const root = scope.querySelectorAll ? scope : document;
  root.querySelectorAll("[data-photo-preview]").forEach((media) => {
    if (media.dataset.photoPreviewReady === "true") {
      return;
    }
    media.addEventListener("click", (event) => {
      if (event.target.closest(".tournament-chip")) {
        return;
      }
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

function formatShotDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
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

function select(selector) {
  return selector ? document.querySelector(selector) : null;
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
