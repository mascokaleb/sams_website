import { parseDate } from "./lib/dateUtils.js";
import { fetchSiteContent } from "./lib/sanityClient.js";

/* =========================================================================
   Gallery — dark charcoal vertical masonry with ripple hover + morph lightbox
   ========================================================================= */

const PLACEHOLDER_PALETTES = [
  ["#2e3a4a", "#4a5a70"], ["#3d3426", "#6b5434"], ["#2a3530", "#4a6552"],
  ["#4a2d25", "#7a4830"], ["#1f2936", "#3a4a5c"], ["#40382a", "#7a6840"],
  ["#2d2a35", "#504a60"], ["#1e2a2a", "#384a48"], ["#3a2d2a", "#604540"],
  ["#252a2e", "#445058"],
];

const DEFAULT_ASPECT = 4 / 5; // portrait-ish default while dimensions resolve

const state = {
  photos: [],          // normalized photo objects
  filtered: [],
  tiles: [],
  query: "",
  year: "all",
  tag: "all",
  tournament: "all",
  cursor: { x: -9999, y: -9999, active: false },
  hoveredId: null,
  rippleRadius: 310,
  rippleScale: 0.14,
  rippleLift: 28,
  lightboxIndex: -1,
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadGallery();
});

async function loadGallery() {
  setStageMessage("Loading the gallery…");
  const data = await fetchSiteContent();
  if (!data) {
    setStageMessage("Unable to load the gallery right now. Please try again soon.", "error");
    return;
  }

  renderSiteIdentity(data.site);
  const normalized = normalizePhotos(data.galleryPhotos || []);

  if (!normalized.length) {
    setStageMessage("No photo gallery entries have been published yet.", "error");
    updateCounter(0, 0);
    return;
  }

  state.photos = normalized;
  state.filtered = sortFeaturedFirst(state.photos);

  // Preload so we can lay out with real aspect ratios
  await preloadImageDimensions(state.photos);

  setStageMessage("");
  renderFilters();
  bindSearch();
  bindFilterInteractions();
  layoutTiles();
  renderTiles();
  bindCursorTracking();
  bindLightbox();
  startRippleLoop();
  updateCounter(state.photos.length, state.filtered.length);
  window.addEventListener("resize", debounce(() => {
    layoutTiles();
    applyTilePositions();
  }, 120));
}

/* ---------- Data normalization ---------- */

function normalizePhotos(raw) {
  return raw
    .map((photo, i) => {
      const imageUrl = photo?.image?.url || photo?.photo?.asset?.url || "";
      const alt = photo?.image?.alt || photo?.photo?.alt || photo?.title || "Gallery image";
      const tournament = getPhotoTournament(photo);
      const tags = Array.isArray(photo?.tags)
        ? photo.tags.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean)
        : [];
      const shotDate = photo?.shotDate || photo?._createdAt || null;
      const palette = PLACEHOLDER_PALETTES[i % PLACEHOLDER_PALETTES.length];
      const parsedDims = parseSanityDimensions(imageUrl);
      const naturalWidth = parsedDims?.width || null;
      const naturalHeight = parsedDims?.height || null;
      return {
        id: photo?._id || `photo-${i}`,
        index: i,
        title: photo?.title || "Gallery highlight",
        description: photo?.description || "",
        imageUrl,
        alt,
        location: photo?.location || "",
        photographer: photo?.photographer || "",
        shotDate,
        tags,
        tournament, // { id, title } or null
        featured: Boolean(photo?.featured || photo?.pinToTop),
        palette,
        naturalWidth,
        naturalHeight,
        aspect: naturalWidth && naturalHeight ? naturalWidth / naturalHeight : DEFAULT_ASPECT,
        // Layout-computed fields populated later
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      };
    })
    .filter((p) => p.imageUrl); // only show photos with an image
}

function getPhotoTournament(photo) {
  if (!photo) return null;
  if (photo.tournament && typeof photo.tournament === "object" && photo.tournament.title) {
    return {
      id: photo.tournament._id || photo.tournament.id || photo.tournament._ref || photo.tournament.title,
      title: photo.tournament.title,
    };
  }
  if (typeof photo.tournament === "string" && photo.tournament) {
    return { id: photo.tournament, title: photo.tournament };
  }
  return null;
}

// Sanity image URLs embed dimensions: <id>-<WIDTH>x<HEIGHT>.<ext>
function parseSanityDimensions(url) {
  if (!url) return null;
  const match = /-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i.exec(url);
  if (!match) return null;
  const w = Number(match[1]);
  const h = Number(match[2]);
  if (!w || !h) return null;
  return { width: w, height: h };
}

async function preloadImageDimensions(photos) {
  // For any photo lacking dimensions, probe the image once
  const pending = photos.filter((p) => !p.naturalWidth || !p.naturalHeight);
  if (!pending.length) return;
  await Promise.all(
    pending.map(
      (p) =>
        new Promise((resolve) => {
          const img = new Image();
          const done = () => resolve();
          img.onload = () => {
            if (img.naturalWidth && img.naturalHeight) {
              p.naturalWidth = img.naturalWidth;
              p.naturalHeight = img.naturalHeight;
              p.aspect = img.naturalWidth / img.naturalHeight;
            }
            done();
          };
          img.onerror = done;
          // Use a smaller Sanity variant for the probe when possible
          img.src = thumbUrl(p.imageUrl, 400);
        })
    )
  );
}

function thumbUrl(url, width) {
  if (!url) return url;
  if (!/\bcdn\.sanity\.io\b/.test(url)) return url;
  const hasQuery = url.includes("?");
  return `${url}${hasQuery ? "&" : "?"}w=${width}&fit=max&auto=format`;
}

function sortFeaturedFirst(list) {
  return list.slice().sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    return getPhotoTimestamp(b) - getPhotoTimestamp(a);
  });
}

function getPhotoTimestamp(photo) {
  const parsed = parseDate(photo.shotDate);
  return parsed ? parsed.getTime() : -Infinity;
}

/* ---------- Site identity ---------- */

function renderSiteIdentity(site) {
  if (site?.siteTitle) {
    document.title = `${site.siteTitle} | Photo Gallery`;
  }
  const brandTextEl = document.querySelector("[data-brand-text]");
  if (brandTextEl && site?.siteTitle) {
    brandTextEl.textContent = site.siteTitle;
  }
  const brandMarkEl = document.querySelector("[data-brand-mark]");
  if (brandMarkEl) {
    if (site?.brandMarkImage?.url) {
      const alt = site.brandMarkImage.alt || site.siteTitle || "Site logo";
      brandMarkEl.classList.add("has-image");
      brandMarkEl.innerHTML = `<span class="brand-mark-image"><img src="${escapeAttr(
        site.brandMarkImage.url
      )}" alt="${escapeHtml(alt)}" loading="lazy" /></span>`;
    } else {
      const initials =
        site?.brandMarkInitials || getInitials(site?.siteTitle) || brandMarkEl.textContent || "SM";
      brandMarkEl.textContent = initials;
      brandMarkEl.classList.remove("has-image");
    }
  }
}

function getInitials(value) {
  if (!value) return "";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/* ---------- Layout (vertical masonry) ---------- */

function layoutTiles() {
  const photos = state.filtered;
  if (!photos.length) return;

  const plane = document.getElementById("plane");
  const planeW = plane.clientWidth || Math.min(1600, window.innerWidth - 48);

  let cols;
  if (planeW < 640) cols = 2;
  else if (planeW < 960) cols = 3;
  else if (planeW < 1320) cols = 4;
  else cols = 5;
  cols = Math.min(cols, 4); // grid preset caps at 4

  const gap = 14;
  const colWidth = (planeW - gap * (cols - 1)) / cols;
  const colHeights = new Array(cols).fill(0);

  photos.forEach((p) => {
    const targetW = colWidth;
    const targetH = Math.round(targetW / (p.aspect || DEFAULT_ASPECT));
    p.width = targetW;
    p.height = targetH;

    let minCol = 0;
    for (let c = 1; c < cols; c++) {
      if (colHeights[c] < colHeights[minCol]) minCol = c;
    }
    p.x = minCol * (colWidth + gap);
    p.y = colHeights[minCol];
    colHeights[minCol] = p.y + p.height + gap;
  });

  let maxBottom = 0;
  photos.forEach((p) => {
    maxBottom = Math.max(maxBottom, p.y + p.height);
  });
  plane.style.height = maxBottom + 40 + "px";
}

function applyTilePositions() {
  state.tiles.forEach((tile, i) => {
    const p = state.filtered[i];
    if (!p) return;
    tile.style.setProperty("--w", p.width + "px");
    tile.style.setProperty("--h", p.height + "px");
    tile.style.setProperty("--x", p.x + "px");
    tile.style.setProperty("--y", p.y + "px");
  });
}

/* ---------- Tile rendering ---------- */

function renderTiles() {
  const plane = document.getElementById("plane");
  plane.innerHTML = "";
  state.tiles = [];

  state.filtered.forEach((photo, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile is-entering" + (photo.featured ? " is-featured" : "");
    tile.style.setProperty("--w", photo.width + "px");
    tile.style.setProperty("--h", photo.height + "px");
    tile.style.setProperty("--x", photo.x + "px");
    tile.style.setProperty("--y", photo.y + "px");
    tile.dataset.photoId = photo.id;
    tile.dataset.photoIndex = String(idx);

    const parts = getShotDateParts(photo.shotDate);
    const dateBlock = parts
      ? `<div class="tile-date">
          <span class="month">${escapeHtml(parts.month)}</span>
          <span class="day">${escapeHtml(parts.day)}</span>
          <span class="year">${escapeHtml(String(parts.year))}</span>
        </div>`
      : "";

    const metaBits = [];
    if (photo.tournament?.title) metaBits.push(escapeHtml(photo.tournament.title));
    if (photo.tags[0]) metaBits.push(escapeHtml(photo.tags[0]));
    const metaMarkup = metaBits.length
      ? `<div class="tile-caption-meta">${metaBits
          .map((m, i) => (i === 0 ? `<span>${m}</span>` : `<span class="dot"></span><span>${m}</span>`))
          .join("")}</div>`
      : "";

    const imgSrc = thumbUrl(photo.imageUrl, 800);
    tile.innerHTML = `
      <div class="tile-frame">
        <img src="${escapeAttr(imgSrc)}" alt="${escapeHtml(photo.alt)}" loading="lazy" />
      </div>
      ${dateBlock}
      ${photo.featured ? '<div class="tile-badge">Featured</div>' : ""}
      <div class="tile-caption">
        <p class="tile-caption-title">${escapeHtml(photo.title)}</p>
        ${metaMarkup}
      </div>
    `;

    plane.appendChild(tile);
    state.tiles.push(tile);
  });

  requestAnimationFrame(() => {
    state.tiles.forEach((tile, i) => {
      const delay = Math.min(600, i * 18);
      tile.style.transition = `opacity 520ms cubic-bezier(.2,.7,.2,1) ${delay}ms, filter 520ms ease ${delay}ms, transform 520ms cubic-bezier(.2,.7,.2,1) ${delay}ms`;
      requestAnimationFrame(() => {
        tile.classList.remove("is-entering");
        setTimeout(() => {
          tile.style.transition = "";
        }, delay + 600);
      });
    });
  });
}

/* ---------- Cursor tracking + ripple loop ---------- */

function bindCursorTracking() {
  const stage = document.getElementById("stage");
  stage.addEventListener("pointermove", (e) => {
    state.cursor.x = e.clientX;
    state.cursor.y = e.clientY;
    state.cursor.active = true;
  });
  stage.addEventListener("pointerleave", () => {
    state.cursor.active = false;
  });
  stage.addEventListener("pointerenter", () => {
    state.cursor.active = true;
  });
}

function startRippleLoop() {
  let hoveredId = null;
  let tileRects = [];

  function cacheRects() {
    tileRects = state.tiles.map((tile) => {
      const r = tile.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, el: tile };
    });
  }

  window.addEventListener("resize", cacheRects);
  setTimeout(cacheRects, 200);

  let lastCacheTime = 0;
  function tick(t) {
    if (t - lastCacheTime > 100) {
      cacheRects();
      lastCacheTime = t;
    }

    const cx = state.cursor.x;
    const cy = state.cursor.y;
    const active = state.cursor.active;
    const radius = state.rippleRadius;
    const peakScale = state.rippleScale;
    const peakLift = state.rippleLift;

    let newHoveredId = null;
    let closestDist = Infinity;

    for (let i = 0; i < tileRects.length; i++) {
      const { cx: tx, cy: ty, el } = tileRects[i];
      const dx = tx - cx;
      const dy = ty - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let falloff = 0;
      if (active && dist < radius) {
        const u = 1 - dist / radius;
        falloff = u * u * (3 - 2 * u); // smoothstep
      }

      const scale = 1 + peakScale * falloff;
      const lift = -peakLift * falloff;
      const tiltX = -dx * 0.03 * falloff;
      const tiltY = -dy * 0.03 * falloff;
      const shadowLift = 8 + 24 * falloff;
      const shadowBlur = 16 + 40 * falloff;

      el.style.setProperty("--rs", scale.toFixed(3));
      el.style.setProperty("--rx", tiltX.toFixed(1) + "px");
      el.style.setProperty("--ry", (tiltY + lift).toFixed(1) + "px");
      el.style.setProperty("--shadow-lift", shadowLift.toFixed(1));
      el.style.setProperty("--shadow-blur", shadowBlur.toFixed(1));
      el.style.setProperty("--brightness-boost", falloff.toFixed(3));
      el.style.zIndex = 1 + Math.round(falloff * 8);

      if (active && dist < closestDist) {
        const r = el.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
          closestDist = dist;
          newHoveredId = el.dataset.photoId;
        }
      }
    }

    if (newHoveredId !== hoveredId) {
      if (hoveredId) {
        const prev = document.querySelector(`.tile[data-photo-id="${cssEscape(hoveredId)}"]`);
        if (prev) prev.classList.remove("is-hovered");
      }
      if (newHoveredId) {
        const next = document.querySelector(`.tile[data-photo-id="${cssEscape(newHoveredId)}"]`);
        if (next) next.classList.add("is-hovered");
      }
      hoveredId = newHoveredId;
      state.hoveredId = newHoveredId;
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Filters ---------- */

function renderFilters() {
  const photos = state.photos;

  const years = Array.from(
    new Set(
      photos
        .map((p) => {
          const d = parseDate(p.shotDate);
          return d ? d.getFullYear() : null;
        })
        .filter((y) => y != null)
    )
  ).sort((a, b) => b - a);
  const hasUndated = photos.some((p) => !parseDate(p.shotDate));
  const yearOpts = [
    { v: "all", l: "All" },
    ...years.map((y) => ({ v: String(y), l: String(y) })),
    ...(hasUndated ? [{ v: "undated", l: "Undated" }] : []),
  ];
  renderChipGroup("year-chips", yearOpts, state.year, (v, l) => {
    state.year = v;
    document.getElementById("year-value").textContent = l;
    document.getElementById("fg-year").classList.toggle("has-active", v !== "all");
    closeAllFilterGroups();
    applyFilters();
  });

  const tags = Array.from(new Set(photos.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b));
  const tagOpts = [{ v: "all", l: "All" }, ...tags.map((t) => ({ v: t, l: t }))];
  renderChipGroup("tag-chips", tagOpts, state.tag, (v, l) => {
    state.tag = v;
    document.getElementById("tag-value").textContent = l;
    document.getElementById("fg-tag").classList.toggle("has-active", v !== "all");
    closeAllFilterGroups();
    applyFilters();
  });

  const tournamentsMap = new Map();
  photos.forEach((p) => {
    if (p.tournament?.title) {
      const id = p.tournament.id || p.tournament.title;
      if (!tournamentsMap.has(id)) tournamentsMap.set(id, p.tournament);
    }
  });
  const ts = Array.from(tournamentsMap.values()).sort((a, b) => a.title.localeCompare(b.title));
  const tourOpts = [{ v: "all", l: "All" }, ...ts.map((t) => ({ v: t.id, l: shortTourney(t.title) }))];
  renderChipGroup("tournament-chips", tourOpts, state.tournament, (v, l) => {
    state.tournament = v;
    document.getElementById("tournament-value").textContent = l;
    document.getElementById("fg-tournament").classList.toggle("has-active", v !== "all");
    closeAllFilterGroups();
    applyFilters();
  });
}

function bindFilterInteractions() {
  document.querySelectorAll(".filter-group").forEach((grp) => {
    const trig = grp.querySelector(".filter-trigger");
    if (!trig) return;
    trig.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = grp.classList.contains("is-open");
      closeAllFilterGroups();
      if (!wasOpen) grp.classList.add("is-open");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-group")) closeAllFilterGroups();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllFilterGroups();
  });
}

function closeAllFilterGroups() {
  document.querySelectorAll(".filter-group.is-open").forEach((g) => g.classList.remove("is-open"));
}

function shortTourney(name) {
  return name.replace(/ (Junior |Classic|Championship|Invitational|Amateur|Open|Cup)/g, (m) => {
    if (/Invitational/.test(m)) return " Inv.";
    if (/Championship/.test(m)) return " Champ.";
    return m;
  });
}

function renderChipGroup(id, options, activeValue, onPick) {
  const host = document.getElementById(id);
  if (!host) return;
  host.innerHTML = options
    .map(
      (o) =>
        `<button class="chip${o.v === activeValue ? " is-active" : ""}" data-value="${escapeAttr(
          o.v
        )}">${escapeHtml(o.l)}</button>`
    )
    .join("");
  host.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      host.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      onPick(btn.dataset.value, btn.textContent);
    });
  });
}

function bindSearch() {
  const input = document.getElementById("photo-search");
  if (!input) return;
  input.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

function applyFilters() {
  const { query, year, tag, tournament } = state;
  state.filtered = state.photos.filter((p) => {
    if (year !== "all") {
      const d = parseDate(p.shotDate);
      const yr = d ? String(d.getFullYear()) : "undated";
      if (yr !== year) return false;
    }
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    if (tournament !== "all") {
      const tid = p.tournament?.id || p.tournament?.title || "";
      if (tid !== tournament) return false;
    }
    if (query) {
      const hay = [
        p.title,
        p.description,
        p.location,
        p.photographer,
        p.tournament?.title || "",
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
  state.filtered = sortFeaturedFirst(state.filtered);

  const total = state.photos.length;
  const vis = state.filtered.length;
  updateCounter(total, vis);

  if (!vis) {
    setStageMessage("No photos match your current search or filter selection.");
    const plane = document.getElementById("plane");
    plane.innerHTML = "";
    state.tiles = [];
    return;
  }

  setStageMessage("");
  layoutTiles();
  renderTiles();
}

function updateCounter(total, visible) {
  const el = document.getElementById("counter-value");
  if (!el) return;
  if (total === 0) {
    el.textContent = "0 photos";
  } else if (visible === total) {
    el.textContent = `${total} ${total === 1 ? "photo" : "photos"}`;
  } else {
    el.textContent = `${visible} of ${total}`;
  }
}

/* ---------- Lightbox (shared-element morph) ---------- */

function bindLightbox() {
  const plane = document.getElementById("plane");
  plane.addEventListener("click", (e) => {
    // Prefer the visually-hovered tile (ripple's latest target) so ripple
    // scale/translate can't cause the click to resolve to a neighboring tile.
    let tile = null;
    if (state.hoveredId) {
      tile = document.querySelector(`.tile[data-photo-id="${cssEscape(state.hoveredId)}"]`);
    }
    if (!tile) {
      tile = e.target.closest(".tile");
    }
    if (!tile) return;
    const idx = Number(tile.dataset.photoIndex);
    if (!Number.isNaN(idx)) openLightbox(idx);
  });

  document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });
  document
    .querySelector("[data-lightbox-prev]")
    ?.addEventListener("click", () => navLightbox(-1));
  document
    .querySelector("[data-lightbox-next]")
    ?.addEventListener("click", () => navLightbox(1));

  window.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") navLightbox(-1);
    else if (e.key === "ArrowRight") navLightbox(1);
  });
}

function openLightbox(idx, skipMorph = false) {
  state.lightboxIndex = idx;
  const photo = state.filtered[idx];
  if (!photo) return;

  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const img = document.getElementById("lightbox-img");

  // Start with the same URL the tile already used (browser-cached → instant,
  // no stale-image flash), then upgrade to hi-res in the background.
  const thumbSrc = thumbUrl(photo.imageUrl, 800);
  const hiresSrc = thumbUrl(photo.imageUrl, 1600);
  img.src = thumbSrc;
  img.alt = photo.alt;
  if (hiresSrc !== thumbSrc) {
    const capturedId = photo.id;
    const loader = new Image();
    loader.onload = () => {
      const current = state.filtered[state.lightboxIndex];
      if (current?.id === capturedId) img.src = hiresSrc;
    };
    loader.src = hiresSrc;
  }
  document.getElementById("lightbox-eyebrow").textContent = photo.tournament?.title || "";
  document.getElementById("lightbox-title").textContent = photo.title;
  document.getElementById("lightbox-desc").textContent = photo.description;
  document.getElementById("lightbox-tags").innerHTML = photo.tags
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");
  const d = parseDate(photo.shotDate);
  const pretty = d
    ? d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
  const footBits = [pretty, photo.location, photo.photographer ? `Photo ${photo.photographer}` : ""]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("lightbox-foot").textContent = footBits;
  document.getElementById("lightbox-index").textContent = `${idx + 1} / ${state.filtered.length}`;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw * 0.8;
  const maxH = vh * 0.72;
  const ratio = photo.width / photo.height || photo.aspect || DEFAULT_ASPECT;
  let endW, endH;
  if (maxW / ratio <= maxH) {
    endW = maxW;
    endH = maxW / ratio;
  } else {
    endH = maxH;
    endW = maxH * ratio;
  }
  const endX = (vw - endW) / 2;
  const endY = (vh - endH) / 2 - 20;

  const tile = document.querySelector(`.tile[data-photo-index="${idx}"]`);
  const tileRect = tile ? tile.getBoundingClientRect() : null;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");

  if (skipMorph || !tileRect) {
    frame.style.transition = "none";
    frame.style.width = endW + "px";
    frame.style.height = endH + "px";
    frame.style.transform = `translate(${endX}px, ${endY}px)`;
    // force reflow so subsequent transition (e.g. from nav) is clean
    // eslint-disable-next-line no-unused-expressions
    frame.offsetHeight;
    frame.style.transition = "";
    return;
  }

  if (tile) tile.classList.add("is-morphing");

  frame.style.transition = "none";
  frame.style.width = tileRect.width + "px";
  frame.style.height = tileRect.height + "px";
  frame.style.transform = `translate(${tileRect.left}px, ${tileRect.top}px)`;
  // eslint-disable-next-line no-unused-expressions
  frame.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      frame.style.transition =
        "width 520ms cubic-bezier(.2,.7,.2,1), height 520ms cubic-bezier(.2,.7,.2,1), transform 520ms cubic-bezier(.2,.7,.2,1)";
      frame.style.width = endW + "px";
      frame.style.height = endH + "px";
      frame.style.transform = `translate(${endX}px, ${endY}px)`;
    });
  });
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const idx = state.lightboxIndex;
  const tile = document.querySelector(`.tile[data-photo-index="${idx}"]`);

  // Reveal the tile right away so the frame shrinks into an already-visible
  // tile — no "fade out then pop in" gap. The frame is on top (z-index 300)
  // so it still covers the tile during the morph.
  if (tile) tile.classList.remove("is-morphing");

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  if (tile) {
    const tr = tile.getBoundingClientRect();
    frame.style.transition =
      "width 420ms cubic-bezier(.2,.7,.2,1), height 420ms cubic-bezier(.2,.7,.2,1), transform 420ms cubic-bezier(.2,.7,.2,1)";
    frame.style.width = tr.width + "px";
    frame.style.height = tr.height + "px";
    frame.style.transform = `translate(${tr.left}px, ${tr.top}px)`;
    setTimeout(() => {
      state.lightboxIndex = -1;
    }, 420);
  } else {
    state.lightboxIndex = -1;
  }
}

function navLightbox(dir) {
  const next = state.lightboxIndex + dir;
  if (next < 0 || next >= state.filtered.length) return;
  const prevTile = document.querySelector(`.tile[data-photo-index="${state.lightboxIndex}"]`);
  if (prevTile) prevTile.classList.remove("is-morphing");

  const nextTile = document.querySelector(`.tile[data-photo-index="${next}"]`);
  if (nextTile) nextTile.classList.add("is-morphing");

  openLightbox(next, true);
  const img = document.getElementById("lightbox-img");
  img.style.transition = "opacity 200ms ease";
  img.style.opacity = "0";
  setTimeout(() => {
    img.style.opacity = "1";
  }, 220);
}

/* ---------- Messaging / utilities ---------- */

function setStageMessage(text, tone = "info") {
  const el = document.getElementById("stage-message");
  if (!el) return;
  if (!text) {
    el.textContent = "";
    el.style.display = "none";
    el.classList.remove("error");
    return;
  }
  el.textContent = text;
  el.style.display = "block";
  el.classList.toggle("error", tone === "error");
}

function getShotDateParts(value) {
  const date = parseDate(value);
  if (!date) return null;
  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: String(date.getDate()).padStart(2, "0"),
    year: date.getFullYear(),
  };
}

function escapeHtml(v) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAttr(v) {
  return escapeHtml(v).replace(/`/g, "&#96;");
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
