import { fetchSiteContent } from "./lib/sanityClient.js";

const HERO_PLACEHOLDER_IMAGE = "images/samuel-placeholder.svg";
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const SELECTORS = {
  heading: "[data-page-heading]",
  subheading: "[data-page-subheading]",
  brandText: "[data-brand-text]",
  brandMark: "[data-brand-mark]",
  count: "[data-video-count]",
  grid: "[data-video-grid]",
  search: "[data-video-search]",
  message: "[data-video-message]",
  filters: "[data-video-year-filters]",
  tagFilters: "[data-video-tag-filters]",
  tournamentFilters: "[data-video-tournament-filters]",
};

const videoState = {
  videos: [],
  searchQuery: "",
  activeYear: "all",
  activeTag: "all",
  activeTournament: "all",
};

document.addEventListener("DOMContentLoaded", () => {
  loadVideoHighlights();
});

async function loadVideoHighlights() {
  setPageMessage("Loading the video library...");

  const data = await fetchSiteContent();
  if (!data) {
    setPageMessage("Unable to load videos right now. Please try again soon.", "error");
    return;
  }

  videoState.videos = sortVideosChronologically(data.videos || []);
  renderSiteIdentity(data.site, "Video Highlights");
  renderPageHeading(data.videosSection, videoState.videos.length);
  renderYearFilters(videoState.videos);
  renderTagFilters(videoState.videos);
  renderTournamentFilters(videoState.videos);
  setupVideoSearch();
  renderVideoSections();
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

  updateVideoCount(total, total);
}

function renderYearFilters(videos) {
  const filtersEl = select(SELECTORS.filters);
  if (!filtersEl) {
    return;
  }

  const years = Array.from(
    new Set(
      videos
        .map((video) => getVideoYear(video))
        .filter((year) => year && year !== "undated")
    )
  ).sort((a, b) => Number(b) - Number(a));

  const hasUndated = videos.some((video) => getVideoYear(video) === "undated");
  const filters = ["all", ...years, ...(hasUndated ? ["undated"] : [])];

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
          const isActive = value === videoState.activeYear;
          return `<button class="video-filter-chip${isActive ? " is-active" : ""}" type="button" data-year="${value}">${label}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-year]").forEach((button) => {
    button.addEventListener("click", () => {
      const year = button.getAttribute("data-year") || "all";
      if (year === videoState.activeYear) {
        return;
      }
      videoState.activeYear = year;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderVideoSections();
    });
  });
}

function renderTagFilters(videos) {
  const filtersEl = select(SELECTORS.tagFilters);
  if (!filtersEl) {
    return;
  }

  const tags = Array.from(
    new Set(
      videos.flatMap((video) => getVideoTags(video))
    )
  ).sort((a, b) => a.localeCompare(b));

  if (!tags.length) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    videoState.activeTag = "all";
    return;
  }

  filtersEl.hidden = false;
  filtersEl.innerHTML = `
    <div class="filter-heading">Filter by tag</div>
    <div class="video-filter-chips">
      ${["all", ...tags]
        .map((tag) => {
          const label = tag === "all" ? "All" : tag;
          const isActive = tag === videoState.activeTag;
          return `<button class="video-filter-chip${isActive ? " is-active" : ""}" type="button" data-tag="${escapeAttribute(
            tag
          )}">${escapeHtml(label)}</button>`;
        })
        .join("")}
    </div>
  `;

  filtersEl.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.getAttribute("data-tag") || "all";
      if (tag === videoState.activeTag) {
        return;
      }
      videoState.activeTag = tag;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderVideoSections();
    });
  });
}

function renderTournamentFilters(videos) {
  const filtersEl = select(SELECTORS.tournamentFilters);
  if (!filtersEl) {
    return;
  }

  const tournaments = new Map();
  videos.forEach((video) => {
    const tournament = getVideoTournament(video);
    if (tournament?.title) {
      const id = tournament.id || tournament.title;
      if (!tournaments.has(id)) {
        tournaments.set(id, { id, title: tournament.title });
      }
    }
  });

  if (!tournaments.size) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    videoState.activeTournament = "all";
    return;
  }

  const ordered = Array.from(tournaments.values()).sort((a, b) => a.title.localeCompare(b.title));
  if (
    videoState.activeTournament !== "all" &&
    !ordered.some((item) => item.id === videoState.activeTournament)
  ) {
    videoState.activeTournament = "all";
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
          const isActive = option.id === videoState.activeTournament;
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
      if (value === videoState.activeTournament) {
        return;
      }
      videoState.activeTournament = value;
      filtersEl.querySelectorAll(".video-filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      renderVideoSections();
    });
  });
}

function setupVideoSearch() {
  const searchInput = select(SELECTORS.search);
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", (event) => {
    videoState.searchQuery = event.target.value.trim();
    renderVideoSections();
  });
}

function renderVideoSections() {
  const byYear = filterVideosByYear(videoState.videos, videoState.activeYear);
  const byTag = filterVideosByTag(byYear, videoState.activeTag);
  const byTournament = filterVideosByTournament(byTag, videoState.activeTournament);
  const filtered = filterVideosBySearch(byTournament, videoState.searchQuery);

  renderVideoLibrary(filtered);
  setupVideoFrames();
}

function renderVideoLibrary(list) {
  const gridEl = select(SELECTORS.grid);
  if (!gridEl) {
    return;
  }

  updateVideoCount(videoState.videos.length, list.length);

  if (!list.length) {
    const hasFilters =
      videoState.searchQuery.length ||
      videoState.activeYear !== "all" ||
      videoState.activeTag !== "all" ||
      videoState.activeTournament !== "all";
    setPageMessage(
      hasFilters
        ? "No clips match your current search or filter selection."
        : "No video highlights are available yet.",
      hasFilters ? "info" : "error"
    );
    gridEl.innerHTML = "";
    return;
  }

  setPageMessage("");
  const orderedList = orderFeaturedVideos(list);
  gridEl.innerHTML = orderedList.map((video) => renderGalleryVideo(video)).join("");
}

function renderGalleryVideo(video) {
  const youtubeId = resolveYoutubeVideoId(video);
  const thumbnail =
    video.thumbnailUrl ||
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : HERO_PLACEHOLDER_IMAGE);
  const isPlayable = Boolean(youtubeId);
  const buttonState = isPlayable ? "" : ' disabled aria-disabled="true"';
  const externalLink = video.youtubeUrl
    ? `<a class="video-card-link" href="${escapeAttribute(video.youtubeUrl)}" target="_blank" rel="noopener">Watch on YouTube</a>`
    : "";
  const isFeatured = isFeaturedVideo(video);
  const badgeParts = getVideoDateParts(video.eventDate);
  const primaryDate = badgeParts ? formatVideoDate(video) : formatVideoMeta(video);
  const badge = isFeatured ? `<span class="highlight-badge">Featured</span>` : "";
  const dateOverlay = badgeParts ? renderVideoDateOverlay(badgeParts) : "";
  const tagsMarkup = renderVideoTags(video);
  const tournamentChip = renderTournamentChip(video);
  const topRow =
    badge || externalLink
      ? `<div class="video-card-top">
          ${badge || ""}
          ${externalLink || ""}
        </div>`
      : "";
  const focalPoint = buildObjectPosition(video.thumbnailHotspot);
  const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

  return `
    <article class="video-gallery-card${isFeatured ? " is-featured" : ""}">
      <div class="video-frame" data-video-id="${escapeHtml(youtubeId)}" data-video-title="${escapeHtml(
        video.title || "Video highlight"
      )}">
        ${dateOverlay}
        <img src="${escapeAttribute(thumbnail)}" alt="${escapeHtml(
          video.thumbnailAlt || video.title || "Video"
        )}" loading="lazy"${focalStyle} />
        <button class="play-button" type="button"${buttonState} aria-label="Play ${escapeHtml(
          video.title || "video"
        )}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        ${topRow}
        <h3>${escapeHtml(video.title || "Video highlight")}</h3>
        ${tournamentChip ? `<div class="card-chip-slot">${tournamentChip}</div>` : ""}
        <p>${escapeHtml(video.description || "")}</p>
        ${tagsMarkup}
      </div>
    </article>
  `;
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

function filterVideosBySearch(videos, query) {
  if (!query) {
    return [...videos];
  }

  const normalized = query.toLowerCase();
  return videos.filter((video) => {
    const text = [
      video.title,
      video.description,
      getVideoTournamentTitle(video),
      getVideoTags(video).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(normalized);
  });
}

function filterVideosByYear(videos, year) {
  if (year === "all") {
    return [...videos];
  }

  return videos.filter((video) => getVideoYear(video) === year);
}

function filterVideosByTag(videos, tag) {
  if (tag === "all") {
    return [...videos];
  }

  return videos.filter((video) => getVideoTags(video).includes(tag));
}

function filterVideosByTournament(videos, tournamentId) {
  if (tournamentId === "all") {
    return [...videos];
  }

  return videos.filter((video) => {
    const tournament = getVideoTournament(video);
    const id = tournament?.id || tournament?.title || "";
    return id === tournamentId;
  });
}

function getVideoYear(video) {
  if (!video?.eventDate) {
    return "undated";
  }

  const date = new Date(video.eventDate);
  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  return date.getFullYear().toString();
}

function isFeaturedVideo(video) {
  return Boolean(video?.pinToTop);
}

function getVideoTags(video) {
  if (!video || !Array.isArray(video.tags)) {
    return [];
  }
  return video.tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean);
}

function getVideoTournament(video) {
  if (!video) {
    return null;
  }

  if (video.tournament && typeof video.tournament === "object" && video.tournament.title) {
    return {
      id: video.tournament._id || video.tournament._ref || video.tournament.id || null,
      title: video.tournament.title,
    };
  }

  return null;
}

function getVideoTournamentTitle(video) {
  const tournament = getVideoTournament(video);
  return tournament?.title || "";
}

function renderTournamentChip(video) {
  const tournament = getVideoTournament(video);
  if (!tournament?.title) {
    return "";
  }

  const targetId = tournament.id || tournament.title;
  const params = new URLSearchParams();
  if (targetId) {
    params.set("tournament", targetId);
  }
  params.set("origin", "video-highlights");
  const href = `tournament-highlights.html${params.toString() ? `?${params.toString()}` : ""}`;

  return `
    <a class="tournament-chip tournament-chip--on-card" href="${escapeAttribute(href)}"${
    targetId ? ` data-highlight-modal="${escapeAttribute(targetId)}" aria-label="View ${escapeAttribute(tournament.title)} tournament details"` : ""
  }>
      <span class="tournament-chip-name">${escapeHtml(tournament.title)}</span>
    </a>
  `;
}

function orderFeaturedVideos(videos) {
  if (!Array.isArray(videos)) {
    return [];
  }

  const featured = [];
  const regular = [];
  videos.forEach((video) => {
    if (isFeaturedVideo(video)) {
      featured.push(video);
    } else {
      regular.push(video);
    }
  });

  return [...featured, ...regular];
}

function renderVideoTags(video) {
  const tags = getVideoTags(video);
  if (!tags.length) {
    return "";
  }

  return `
    <div class="gallery-card-tags video-card-tags">
      ${tags.map((tag) => `<span class="gallery-tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

function sortVideosChronologically(videos) {
  if (!Array.isArray(videos)) {
    return [];
  }

  return [...videos].sort((a, b) => getVideoTimestamp(b) - getVideoTimestamp(a));
}

function getVideoTimestamp(video) {
  if (!video) {
    return 0;
  }

  if (video.eventDate) {
    const parsed = Date.parse(video.eventDate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (video._createdAt) {
    const fallback = Date.parse(video._createdAt);
    if (!Number.isNaN(fallback)) {
      return fallback;
    }
  }

  return 0;
}

function updateVideoCount(total, visible) {
  const countEl = select(SELECTORS.count);
  if (!countEl) {
    return;
  }

  const totalLabel = `${total} ${total === 1 ? "video" : "videos"}`;
  if (visible === total) {
    countEl.textContent = totalLabel;
  } else {
    countEl.textContent = `${totalLabel} · Showing ${visible}`;
  }
}

function setupVideoFrames() {
  document.querySelectorAll(".video-frame").forEach((frame) => {
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

let videoOverlayElement = null;

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

function openVideoOverlay(videoId, title) {
  const overlay = ensureVideoOverlay();
  const frame = overlay.querySelector(".video-overlay-frame");
  if (!frame) {
    return;
  }

  frame.innerHTML = "";
  const iframe = document.createElement("iframe");
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

  const trimmed = String(value).trim();
  if (!trimmed) {
    return "";
  }

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    try {
      parsedUrl = new URL(`https://${trimmed}`);
    } catch {
      return "";
    }
  }

  const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

  if (hostname === "youtu.be") {
    const shortId = parsedUrl.pathname.split("/").filter(Boolean)[0];
    return shortId && YOUTUBE_ID_PATTERN.test(shortId) ? shortId : "";
  }

  if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
    const queryId = parsedUrl.searchParams.get("v");
    if (queryId && YOUTUBE_ID_PATTERN.test(queryId)) {
      return queryId;
    }

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && (segments[0] === "embed" || segments[0] === "shorts")) {
      const candidate = segments[1];
      return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : "";
    }
  }

  return "";
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

function buildObjectPosition(hotspot) {
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") {
    return "";
  }

  const clamp = (val) => Math.max(0, Math.min(1, val));
  const x = Math.round(clamp(hotspot.x) * 1000) / 10;
  const y = Math.round(clamp(hotspot.y) * 1000) / 10;
  return `${x}% ${y}%`;
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
