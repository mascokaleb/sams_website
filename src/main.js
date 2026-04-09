import { toHTML } from "@portabletext/to-html";
import { parseDate } from "./lib/dateUtils.js";
import { fetchSiteContent } from "./lib/sanityClient.js";

const HERO_PLACEHOLDER_IMAGE = "images/samuel-placeholder.svg";
const MEDIA_PLACEHOLDER_IMAGE = HERO_PLACEHOLDER_IMAGE;
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const SELECTORS = {
  heroCopy: '[data-template="hero-copy"]',
  heroPhoto: '[data-template="hero-photo"]',
  heroMetrics: '[data-template="hero-metrics"]',
  coachSnapshot: '[data-template="coach-snapshot"]',
  aboutHeading: '[data-template="about-heading"]',
  aboutGrid: '[data-template="about-grid"]',
  resumeHeading: '[data-template="resume-heading"]',
  resumePanels: '[data-template="resume-panels"]',
  academicsHeading: '[data-template="academics-heading"]',
  academicsGrid: '[data-template="academics-grid"]',
  highlightsHeading: '[data-template="highlights-heading"]',
  highlightsTimeline: '[data-template="timeline"]',
  upcomingHeading: '[data-template="upcoming-heading"]',
  upcomingGrid: '[data-template="upcoming-grid"]',
  videosHeading: '[data-template="videos-heading"]',
  videoGrid: '[data-template="video-grid"]',
  videosActions: '[data-template="videos-actions"]',
  galleryHeading: '[data-template="gallery-heading"]',
  galleryGrid: '[data-template="gallery-grid"]',
  galleryActions: '[data-template="gallery-actions"]',
  dualHeading: '[data-template="dual-heading"]',
  dualGrid: '[data-template="dual-grid"]',
  contactHeading: '[data-template="contact-heading"]',
  contactGrid: '[data-template="contact-grid"]',
  highlightsActions: '[data-template="highlights-actions"]',
  highlightOverlayBody: "[data-highlight-overlay-body]",
};

const highlightsState = {
  meta: null,
  allItems: [],
  items: [],
  videos: [],
  photos: [],
};

const videosState = {
  meta: null,
  items: [],
  totalCount: 0,
};

const galleryState = {
  meta: null,
  items: [],
};

document.addEventListener("DOMContentLoaded", async () => {
  setupNav();
  setupSmoothScroll();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  await hydratePage();
  if (window.location.hash) {
    setTimeout(() => scrollToHash(window.location.hash), 100);
  }

  setupMotionAnimations(prefersReducedMotion);
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
  renderCoachSnapshot(data.coachSnapshot, { hero: data.hero, about: data.about });
  renderAbout(data.about, { academics: data.academics });
  renderResume(data.resume);
  renderAcademics(data.academics);

  const orderedHighlights = sortEntriesChronologically(data.highlightEvents || []);
  // Defensive guard: any highlight whose event date is still in the future
  // gets re-routed to the Upcoming Tournaments bucket, regardless of how it
  // was categorized in the CMS. This prevents mis-tagged entries from leaking
  // into the "recent results" timeline.
  const { past: pastHighlights, future: futureHighlights } = partitionByEventDate(orderedHighlights);
  highlightsState.meta = data.highlightsSection;
  highlightsState.allItems = pastHighlights;
  highlightsState.items = pastHighlights.filter(shouldDisplayOnHome);
  renderHighlights();

  const cmsUpcoming = Array.isArray(data.upcomingTournaments) ? data.upcomingTournaments : [];
  const mergedUpcoming = mergeUpcomingTournaments(cmsUpcoming, futureHighlights);
  renderUpcomingTournaments(data.upcomingTournamentsSection, mergedUpcoming);

  const orderedVideos = sortEntriesChronologically(data.videos || [], "eventDate");
  highlightsState.videos = orderedVideos;
  videosState.meta = data.videosSection;
  videosState.items = orderedVideos.filter(shouldDisplayOnHome);
  videosState.totalCount = orderedVideos.length;
  renderVideos();
  const orderedPhotos = sortEntriesChronologically(data.galleryPhotos || [], "shotDate");
  highlightsState.photos = orderedPhotos;
  galleryState.meta = data.gallerySection;
  galleryState.items = orderedPhotos.filter(shouldDisplayOnHome);
  renderGallery();
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
      const focalPoint = buildObjectPosition(
        site.brandMarkImage.focalPoint || site.brandMarkImage.hotspot
      );
      const focalStyle = focalPoint
        ? ` style="object-position: ${escapeAttribute(focalPoint)};"`
        : "";
      brandMark.innerHTML = `<span class="brand-mark-image"><img src="${escapeAttribute(
        site.brandMarkImage.url
      )}" alt="${escapeHtml(site.brandMarkImage.alt || site.siteTitle || "Site logo")}" loading="lazy"${focalStyle} /></span>`;
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

  if (!hero) {
    if (copyEl) {
      copyEl.innerHTML = renderPlaceholder("Hero content coming soon.");
    }
    return;
  }

  if (copyEl) {
    const tagline = hero.tagline ? `<p class="hero-tag">${escapeHtml(hero.tagline)}</p>` : "";
    const description = hero.bio ? `<p>${escapeHtml(hero.bio)}</p>` : "";
    const ctas = [
      buildCta(hero.primaryCta, "primary", "View Highlights", "#highlights"),
      buildCta(null, "ghost", "Schedule a Conversation", "#contact"),
    ]
      .filter(Boolean)
      .join("");

    const snapshotItems = Array.isArray(hero.metrics)
      ? hero.metrics
          .filter((metric) => metric && (metric.label || metric.value))
          .map(
            (metric) => `
              <li class="hero-snapshot-item">
                <span class="hero-snapshot-value">${escapeHtml(metric.value || "")}</span>
                <span class="hero-snapshot-label">${escapeHtml(metric.label || "")}</span>
              </li>
            `
          )
          .join("")
      : "";
    const snapshotMarkup = snapshotItems
      ? `<ul class="hero-snapshot" aria-label="Player snapshot">${snapshotItems}</ul>`
      : "";

    copyEl.innerHTML = `
      ${tagline}
      <h1>${escapeHtml(hero.headline || site?.siteTitle || "")}</h1>
      ${snapshotMarkup}
      ${description}
      <div class="hero-actions">
        ${ctas || '<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `;
  }

  if (photoEl) {
    const photoUrl = hero.headshot?.url || HERO_PLACEHOLDER_IMAGE;
    const alt = hero.headshot?.alt || "Portrait of Samuel Masco";
    const focalPoint = buildObjectPosition(hero.headshot?.focalPoint || hero.headshot?.hotspot);
    const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

    photoEl.innerHTML = `
      <div class="hero-photo-frame">
        <img src="${photoUrl}" alt="${escapeHtml(alt)}" loading="lazy"${focalStyle} />
      </div>
    `;
  }
}

function renderCoachSnapshot(snapshot, context = {}) {
  const sectionEl = select(SELECTORS.coachSnapshot);
  if (!sectionEl) return;

  // The Coach Snapshot only renders when the CMS singleton has at least one
  // recruiting-critical field populated. This prevents the section from
  // appearing with nothing but a "Verified" timestamp while Sam is still
  // filling out Studio. As soon as any of these fields lights up in Sanity,
  // the whole section snaps into view.
  const hasSnapshotData =
    snapshot &&
    [
      snapshot.gpaWeighted,
      snapshot.satScore,
      snapshot.actScore,
      snapshot.ncaaId,
      snapshot.ncaaStatus,
      snapshot.transcriptUrl,
      snapshot.parentName,
      snapshot.parentEmail,
      snapshot.parentPhone,
      snapshot.clubCoachName,
      snapshot.clubCoachEmail,
      snapshot.clubCoachPhone,
      snapshot.hsCoachName,
      snapshot.hsCoachEmail,
      snapshot.hsCoachPhone,
    ].some((value) => typeof value === "string" && value.trim() !== "");

  if (!hasSnapshotData) {
    sectionEl.hidden = true;
    sectionEl.innerHTML = "";
    return;
  }

  const about = context.about || {};
  const profileFacts = Array.isArray(about.profileFacts) ? about.profileFacts : [];
  const findFact = (labelPattern) =>
    profileFacts.find((fact) => fact?.label && labelPattern.test(fact.label))?.value || "";

  // Only fall back to data from other Sanity docs when it ADDS information
  // beyond what the hero snapshot row already shows. Duplicating the hero's
  // Handicap / 18-Hole Avg / Scoring Diff / GPA here would feel redundant.
  const graduationYear = findFact(/graduat/i);
  const resolvedClassYear =
    snapshot?.classYear ||
    (graduationYear ? `Class of ${graduationYear}` : "");

  const data = {
    eyebrow: snapshot?.eyebrow || "Coach Snapshot",
    heading: snapshot?.heading || "The 30-second read",
    subheading: snapshot?.subheading || "",
    classYear: resolvedClassYear,
    gpaWeighted: snapshot?.gpaWeighted || "",
    sat: snapshot?.satScore || "",
    act: snapshot?.actScore || "",
    ncaaId: snapshot?.ncaaId || "",
    ncaaStatus: snapshot?.ncaaStatus || "",
    transcriptLabel: snapshot?.transcriptLabel || "Download transcript",
    transcriptUrl: snapshot?.transcriptUrl || "",
    parentName: snapshot?.parentName || "",
    parentRole: snapshot?.parentRole || "",
    parentEmail: snapshot?.parentEmail || "",
    parentPhone: snapshot?.parentPhone || "",
    clubCoachName: snapshot?.clubCoachName || findFact(/private\s*coach|club\s*coach/i),
    clubCoachOrg: snapshot?.clubCoachOrg || "",
    clubCoachEmail: snapshot?.clubCoachEmail || "",
    clubCoachPhone: snapshot?.clubCoachPhone || "",
    hsCoachName: snapshot?.hsCoachName || "",
    hsCoachEmail: snapshot?.hsCoachEmail || "",
    hsCoachPhone: snapshot?.hsCoachPhone || "",
    verifiedAt: snapshot?.verifiedAt || findFact(/verified/i),
  };

  const factRow = (label, value, mono = false) => {
    if (!value) return "";
    const valueClass = mono
      ? "coach-snapshot-fact-value coach-snapshot-fact-value--mono"
      : "coach-snapshot-fact-value";
    return `
      <div class="coach-snapshot-fact">
        <span class="coach-snapshot-fact-label">${escapeHtml(label)}</span>
        <span class="${valueClass}">${escapeHtml(value)}</span>
      </div>
    `;
  };

  const contactRow = (name, role, phone, email) => {
    if (!name && !phone && !email) return "";
    const roleMarkup = role ? `<span class="coach-snapshot-contact-role">${escapeHtml(role)}</span>` : "";
    const phoneMarkup = phone
      ? `<a href="tel:${escapeAttribute(phone.replace(/[^0-9+]/g, ""))}">${escapeHtml(phone)}</a>`
      : "";
    const emailMarkup = email
      ? `<a href="mailto:${escapeAttribute(email)}">${escapeHtml(email)}</a>`
      : "";
    const meta = [phoneMarkup, emailMarkup].filter(Boolean).join('<span class="coach-snapshot-contact-divider" aria-hidden="true">·</span>');
    return `
      <div class="coach-snapshot-contact">
        <div class="coach-snapshot-contact-identity">
          <span class="coach-snapshot-contact-name">${escapeHtml(name || "")}</span>
          ${roleMarkup}
        </div>
        ${meta ? `<div class="coach-snapshot-contact-meta">${meta}</div>` : ""}
      </div>
    `;
  };

  // --- Column 1: Academic / recruiting identity (things NOT already in the hero row) ---
  const identityMarkup = [
    factRow("Class", data.classYear),
    factRow("GPA (W)", data.gpaWeighted, true),
    factRow("SAT", data.sat, true),
    factRow("ACT", data.act, true),
  ]
    .filter(Boolean)
    .join("");

  // --- Column 2: NCAA eligibility + transcript ---
  const eligibilityMarkup = [
    factRow("NCAA ID", data.ncaaId, true),
    factRow("NCAA Status", data.ncaaStatus),
    factRow("Verified", formatVerifiedDate(data.verifiedAt)),
  ]
    .filter(Boolean)
    .join("");

  const transcriptMarkup = data.transcriptUrl
    ? `<a class="btn subtle coach-snapshot-transcript" href="${escapeAttribute(data.transcriptUrl)}" target="_blank" rel="noopener">${escapeHtml(data.transcriptLabel)}</a>`
    : "";

  // --- Column 3: Recruiting contacts ---
  const contactsMarkup = [
    contactRow(data.parentName, data.parentRole || "Parent / Guardian", data.parentPhone, data.parentEmail),
    contactRow(data.clubCoachName, data.clubCoachOrg || "Private Coach", data.clubCoachPhone, data.clubCoachEmail),
    contactRow(data.hsCoachName, "HS Coach", data.hsCoachPhone, data.hsCoachEmail),
  ]
    .filter(Boolean)
    .join("");

  const columns = [
    identityMarkup ? { title: "By the numbers", body: identityMarkup } : null,
    eligibilityMarkup || transcriptMarkup
      ? {
          title: "Eligibility",
          body: `${eligibilityMarkup}${transcriptMarkup ? `<div class="coach-snapshot-transcript-wrap">${transcriptMarkup}</div>` : ""}`,
        }
      : null,
    contactsMarkup ? { title: "Recruiting contacts", body: contactsMarkup } : null,
  ].filter(Boolean);

  if (!columns.length) {
    // Nothing to show — keep the section hidden.
    sectionEl.hidden = true;
    return;
  }

  const eyebrowMarkup = data.eyebrow
    ? `<p class="section-kicker">${escapeHtml(data.eyebrow)}</p>`
    : "";
  const headingMarkup = data.heading
    ? `<h2 class="coach-snapshot-heading">${escapeHtml(data.heading)}</h2>`
    : "";
  const subheadingMarkup = data.subheading
    ? `<p class="coach-snapshot-subheading">${escapeHtml(data.subheading)}</p>`
    : "";

  sectionEl.hidden = false;
  sectionEl.innerHTML = `
    <header class="coach-snapshot-header" data-motion>
      ${eyebrowMarkup}
      ${headingMarkup}
      ${subheadingMarkup}
    </header>
    <div class="coach-snapshot-grid">
      ${columns
        .map(
          (col, idx) => `
            <section class="coach-snapshot-column" data-motion="delay-${idx + 1}">
              <h3 class="coach-snapshot-column-title">${escapeHtml(col.title)}</h3>
              <div class="coach-snapshot-column-body">${col.body}</div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function formatVerifiedDate(value) {
  if (!value) return "";
  const date = parseDate(value);
  if (!date) return String(value);
  try {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return String(value);
  }
}

function renderAbout(about, context = {}) {
  const headingEl = select(SELECTORS.aboutHeading);
  const gridEl = select(SELECTORS.aboutGrid);
  const academics = context.academics || null;

  if (headingEl) {
    headingEl.innerHTML = about
      ? `
          <h2>${escapeHtml(about.heading || "About")}</h2>
          <p>${escapeHtml(about.subheading || "")}</p>
        `
      : renderPlaceholder("About section coming soon.");
  }

  if (!gridEl) return;

  if (!about) {
    gridEl.innerHTML = renderPlaceholder("About details coming soon.");
    return;
  }

  const profileCard = `
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
  `;

  const mindsetCard = `
    <article class="about-card about-story" data-motion="delay-2">
      <h3>${escapeHtml(about.mindsetTitle || "Mindset & Goals")}</h3>
      ${renderPortableText(about.mindsetBody)}
    </article>
  `;

  const quickHitsCard = `
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

  // Academics is now folded into About as a fourth card so coaches see the
  // full off-course profile in one place. The standalone Academics <section>
  // in the DOM is hidden via the `hidden` attribute on the element.
  let academicsCard = "";
  if (academics) {
    const academicsFacts = [
      { label: "School", value: academics.schoolCardTitle },
      { label: "GPA", value: academics.gpa },
      { label: "Honors / AP", value: academics.honors },
      { label: "AP / IB Status", value: academics.apCourses },
    ].filter((f) => f.value);

    const factsMarkup = academicsFacts.length
      ? `
          <ul class="about-facts-list">
            ${academicsFacts
              .map(
                (fact) => `
                  <li><strong>${escapeHtml(fact.label)}: </strong>${escapeHtml(fact.value)}</li>
                `
              )
              .join("")}
          </ul>
        `
      : "";

    const interestsMarkup = academics.interestsBody
      ? `<div class="about-academics-interests">${renderPortableText(academics.interestsBody)}</div>`
      : "";

    const transcriptMarkup =
      academics.transcriptUrl
        ? `<a class="btn subtle" href="${escapeAttribute(academics.transcriptUrl)}" target="_blank" rel="noopener">${escapeHtml(academics.transcriptLabel || "Transcript")}</a>`
        : "";

    if (factsMarkup || interestsMarkup || transcriptMarkup) {
      academicsCard = `
        <article class="about-card about-academics" data-motion="delay-4">
          <h3>${escapeHtml(academics.heading || "Academics")}</h3>
          ${factsMarkup}
          ${interestsMarkup}
          ${transcriptMarkup ? `<div class="about-academics-actions">${transcriptMarkup}</div>` : ""}
        </article>
      `;
    }
  }

  gridEl.innerHTML = `
    ${profileCard}
    ${mindsetCard}
    ${quickHitsCard}
    ${academicsCard}
  `;
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

    // Split performance stats so any "Club Yardages" legacy string entry
    // can be parsed into the bulleted column instead of rendering as a stat.
    // Also strip stats that are already shown in the hero snapshot row
    // (Handicap, GPA) to avoid duplication between the top of the page and
    // the Performance Snapshot card.
    const HERO_DUPLICATE_LABEL = /^(handicap|gpa)$/i;
    const rawStats = Array.isArray(resume.performanceStats) ? resume.performanceStats : [];
    const inlineClubYardages = [];
    const regularStats = [];
    rawStats.forEach((stat) => {
      if (isClubYardagesStat(stat)) {
        inlineClubYardages.push(...parseClubYardagesString(stat?.value));
      } else if (HERO_DUPLICATE_LABEL.test((stat?.label || "").trim())) {
        // Already shown in the hero snapshot — skip to avoid duplication.
      } else {
        regularStats.push(stat);
      }
    });

    const structuredClubYardages = Array.isArray(resume.clubYardages) ? resume.clubYardages : [];
    const clubYardages = structuredClubYardages.length ? structuredClubYardages : inlineClubYardages;
    const hasClubYardages = clubYardages.length > 0;
    const clubYardagesTitle = resume.clubYardagesTitle || "Club Yardages";
    const clubYardagesMarkup = hasClubYardages
      ? `
          <div class="performance-clubs">
            <h4 class="performance-section-title">${escapeHtml(clubYardagesTitle)}</h4>
            ${renderClubYardageGroups(clubYardages)}
          </div>
        `
      : "";

    const statsMarkup = regularStats
      .map(
        (stat) => `
          <div class="performance-stat">
            <span class="performance-stat-label">${escapeHtml(stat.label || "")}</span>
            <span class="performance-stat-value">${escapeHtml(stat.value || "")}</span>
          </div>
        `
      )
      .join("");

    panelsEl.innerHTML = `
      <article class="panel performance-panel" data-motion="delay-1">
        <h3>${escapeHtml(resume.performanceTitle || "Performance Snapshot")}</h3>
        <div class="performance-content">
          <div class="performance-stats-grid" data-count="${regularStats.length}">
            ${statsMarkup}
          </div>
          ${clubYardagesMarkup}
        </div>
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

function renderUpcomingTournaments(sectionMeta, tournaments) {
  const headingEl = select(SELECTORS.upcomingHeading);
  const gridEl = select(SELECTORS.upcomingGrid);

  if (headingEl) {
    headingEl.innerHTML = sectionMeta
      ? `
          <h2>${escapeHtml(sectionMeta.heading || "Upcoming Tournaments")}</h2>
          ${sectionMeta.subheading ? `<p>${escapeHtml(sectionMeta.subheading)}</p>` : ""}
        `
      : `
          <h2>Upcoming Tournaments</h2>
          <p>Next events on Samuel's competitive schedule.</p>
        `;
  }

  if (!gridEl) {
    return;
  }

  const items = Array.isArray(tournaments) ? tournaments : [];
  if (!items.length) {
    gridEl.innerHTML = renderPlaceholder("Upcoming tournaments coming soon.");
    return;
  }

  const maxItems = Math.max(1, sectionMeta?.maxItems || items.length);
  const limited = items.slice(0, maxItems);

  gridEl.innerHTML = limited
    .map((tournament, index) => renderUpcomingTournamentCard(tournament, index))
    .join("");
  gridEl
    .querySelectorAll("[data-motion]")
    .forEach((el) => el.classList.add("is-visible"));
}

function renderUpcomingTournamentCard(tournament, index = 0) {
  if (!tournament) {
    return "";
  }

  const course = tournament.course || "Course TBD";
  const location = tournament.location || "";
  const dateLabel = formatDateRangeDisplay(tournament.eventDate, tournament.endDate, {
    month: "short",
  });
  const yardageValue = formatYardageLabel(tournament.yardage);
  const delay = (index % 4) + 1;

  return `
    <article class="upcoming-card" data-motion="delay-${delay}">
      <div class="upcoming-card-date">${dateLabel || "Date TBD"}</div>
      <h3 class="upcoming-card-course">${escapeHtml(course)}</h3>
      <div class="upcoming-card-meta">
        ${location ? `<span class="upcoming-card-location">${escapeHtml(location)}</span>` : ""}
        ${yardageValue ? `<span class="upcoming-card-yardage">${escapeHtml(yardageValue)}</span>` : ""}
      </div>
    </article>
  `;
}

function formatYardageLabel(value) {
  if (value === undefined || value === null) {
    return "";
  }
  const text = String(value).trim();
  if (!text) {
    return "";
  }
  if (/yard|yd/i.test(text)) {
    return text;
  }
  return `${text} yds`;
}

function isClubYardagesStat(stat) {
  if (!stat || typeof stat.label !== "string") {
    return false;
  }
  return /club\s*yardage/i.test(stat.label);
}

const CLUB_CATEGORY_ORDER = ["Woods", "Irons", "Wedges", "Putter", "Other"];

function categorizeClubName(name) {
  const n = (name || "").toLowerCase();
  if (/putter/.test(n)) {
    return "Putter";
  }
  if (/wedge/.test(n)) {
    return "Wedges";
  }
  if (/iron/.test(n)) {
    return "Irons";
  }
  if (/driver|wood|hybrid|\b\d+\s*w\b|\b\dw\b/.test(n)) {
    return "Woods";
  }
  return "Other";
}

function formatClubYardageValue(value) {
  if (value === undefined || value === null) {
    return "";
  }
  const text = String(value).trim();
  if (!text) {
    return "";
  }
  if (/yard|yd/i.test(text)) {
    return text;
  }
  return `${text} yds`;
}

function renderClubYardageGroups(clubs) {
  const groups = new Map();
  clubs.forEach((club) => {
    if (!club || !club.club) {
      return;
    }
    const category = categorizeClubName(club.club);
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(club);
  });

  if (!groups.size) {
    return "";
  }

  const orderedCategories = CLUB_CATEGORY_ORDER.filter((cat) => groups.has(cat));
  // Include any categories not in the predefined order (edge case).
  Array.from(groups.keys()).forEach((cat) => {
    if (!orderedCategories.includes(cat)) {
      orderedCategories.push(cat);
    }
  });

  // Hide the group header entirely when everything landed in one category.
  const showHeaders = orderedCategories.length > 1;

  return `
    <div class="club-yardage-groups">
      ${orderedCategories
        .map((category) => {
          const items = groups.get(category) || [];
          return `
            <div class="club-yardage-group">
              ${
                showHeaders
                  ? `<h5 class="club-yardage-group-title">${escapeHtml(category)}</h5>`
                  : ""
              }
              <ul class="club-yardage-list">
                ${items
                  .map(
                    (club) => `
                      <li>
                        <span class="club-yardage-name">${escapeHtml(club?.club || "")}</span>
                        <span class="club-yardage-value">${escapeHtml(
                          formatClubYardageValue(club?.yardage)
                        )}</span>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function parseClubYardagesString(value) {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(/[,\n;]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const colonIndex = chunk.indexOf(":");
      if (colonIndex > -1) {
        return {
          club: chunk.slice(0, colonIndex).trim(),
          yardage: chunk.slice(colonIndex + 1).trim(),
        };
      }
      const match = chunk.match(/^(.*?)\s+(\d[\d,]*)(\s*(?:yds?|yards?)?)\s*$/i);
      if (match) {
        return {
          club: match[1].trim(),
          yardage: `${match[2]}${match[3] ? match[3].trim() : ""}`,
        };
      }
      return { club: chunk, yardage: "" };
    })
    .filter((entry) => entry.club);
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
  const limitedEvents = events.slice(0, baseLimit);

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
  setupHighlightDetailButtons(timelineEl);

  if (actionsEl) {
    actionsEl.innerHTML = `
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `;
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
  const limitedVideos = videos.slice(0, baseLimit);

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
  setupHighlightDetailButtons(gridEl);

  if (actionsEl) {
    actionsEl.innerHTML = `
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `;
  }
}

function renderGallery() {
  const sectionMeta = galleryState.meta;
  const photos = galleryState.items || [];
  const headingEl = select(SELECTORS.galleryHeading);
  const gridEl = select(SELECTORS.galleryGrid);
  const actionsEl = select(SELECTORS.galleryActions);

  if (headingEl) {
    const headingText = sectionMeta?.heading || "Photo Gallery";
    const subheadingText =
      sectionMeta?.subheading || "Tournament action and behind-the-scenes moments.";
    headingEl.innerHTML = `
      <h2>${escapeHtml(headingText)}</h2>
      ${subheadingText ? `<p>${escapeHtml(subheadingText)}</p>` : ""}
    `;
  }

  if (!gridEl) {
    return;
  }

  const limit = Math.max(1, sectionMeta?.maxItems || 6);
  const limitedPhotos = photos.slice(0, limit);

  if (!limitedPhotos.length) {
    gridEl.innerHTML = renderPlaceholder("Gallery photos coming soon.");
    if (actionsEl) {
      actionsEl.innerHTML = "";
    }
    return;
  }

  gridEl.innerHTML = limitedPhotos.map((photo, index) => renderGalleryCard(photo, index)).join("");
  gridEl.querySelectorAll("[data-motion]").forEach((el) => el.classList.add("is-visible"));
  setupPhotoPreviewButtons(gridEl);
  setupHighlightDetailButtons(gridEl);

  if (actionsEl) {
    const href = "gallery.html";
    const label = sectionMeta?.ctaLabel || "Explore the full gallery";
    actionsEl.innerHTML = `<a class="btn ghost" href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`;
  }
}

function renderGalleryCard(photo, index = 0) {
  const imageUrl = photo?.image?.url || HERO_PLACEHOLDER_IMAGE;
  const altText = photo?.image?.alt || photo?.title || "Gallery highlight";
  const tournamentBadge = renderTournamentChip(photo, { variant: "card" });
  const shotDateParts = getShotDateParts(photo?.shotDate);
  const dateOverlay = shotDateParts ? renderVideoDateOverlay(shotDateParts) : "";
  const previewData = photo?.image?.url
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
  const descriptionMarkup = photo?.description
    ? `<p class="gallery-card-description">${escapeHtml(photo.description)}</p>`
    : "";
  const photographerText = photo?.photographer
    ? `<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${escapeHtml(photo.photographer)}</div>`
    : "";
  const footerMarkup = photographerText ? `<div class="gallery-card-footer">${photographerText}</div>` : "";

  const mediaAttributes = previewData ? `data-photo-preview="true" ${previewAttributes}` : "";
  const focalPoint = buildObjectPosition(photo?.image?.focalPoint || photo?.image?.hotspot);
  const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

  return `
    <article class="gallery-card" data-motion="delay-${(index % 3) + 1}">
      <div class="gallery-card-media"${mediaAttributes ? ` ${mediaAttributes}` : ""}>
        ${dateOverlay}
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeHtml(altText)}" loading="lazy"${focalStyle} />
      </div>
      <div class="gallery-card-body">
        ${metaMarkup}
        <h3>${escapeHtml(photo?.title || "Gallery highlight")}</h3>
        ${tournamentBadge ? `<div class="card-chip-slot">${tournamentBadge}</div>` : ""}
        ${descriptionMarkup}
        ${renderGalleryTags(photo?.tags)}
        ${footerMarkup}
      </div>
    </article>
  `;
}

function renderGalleryTags(tags) {
  if (!Array.isArray(tags) || !tags.length) {
    return "";
  }

  const cleaned = tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean);
  if (!cleaned.length) {
    return "";
  }

  return `
    <div class="gallery-card-tags">
      ${cleaned.map((tag) => `<span class="gallery-tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
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
      .map((card, index) => {
        const focalPoint = buildObjectPosition(card?.image?.focalPoint || card?.image?.hotspot);
        const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";
        const imageMarkup = card?.image?.url
          ? `
              <div class="dual-card-media">
                <img
                  src="${escapeAttribute(card.image.url)}"
                  alt="${escapeHtml(card.image.alt || card.title || "Dual-sport card image")}"
                  loading="lazy"${focalStyle}
                />
              </div>
            `
          : "";

        return `
          <article class="dual-card" data-motion="delay-${index + 1}">
            ${imageMarkup}
            <h3>${escapeHtml(card.title || "")}</h3>
            ${card.body ? `<p>${escapeHtml(card.body)}</p>` : ""}
            ${Array.isArray(card.bulletPoints) && card.bulletPoints.length
              ? `<ul>${card.bulletPoints.map((point) => `<li>${escapeHtml(point || "")}</li>`).join("")}</ul>`
              : ""}
          </article>
        `;
      })
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
  const days = Array.isArray(event.days) ? event.days : [];
  const dayStats = renderDayStats(days, { variant: "compact" });
  const fallbackId = `home-highlight-${index}`;
  const eventId = event?._id || event?.title || fallbackId;
  const actionButton = `
    <button class="highlight-toggle" type="button" data-highlight-modal="${escapeAttribute(
      eventId
    )}">
      View Details
    </button>
  `;
  const actionRow = `<div class="highlight-row-actions">${actionButton}</div>`;

  return `
    <article class="timeline-card" data-motion="delay-${index + 1}">
      <header>
        <div class="highlight-row">
          <h3>${escapeHtml(event.title || "")}</h3>
          ${actionRow}
        </div>
        ${dateLabel ? `<span class="timeline-date">${dateLabel}</span>` : ""}
      </header>
      ${dayStats}
      ${summary}
    </article>
  `;
}

function renderDayStats(days = [], { variant = "default", showLabels } = {}) {
  if (!Array.isArray(days) || !days.length) {
    return "";
  }

  const total = days.length;
  const labels = typeof showLabels === "boolean" ? showLabels : total > 1;
  const className = [
    "day-stats",
    variant === "compact" ? "day-stats--compact" : "",
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

function setupHighlightDetailButtons(root) {
  if (!root) {
    return;
  }

  root.querySelectorAll("[data-highlight-modal]").forEach((button) => {
    if (button.dataset.modalBound === "true") {
      return;
    }

    button.dataset.modalBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const eventId = button.getAttribute("data-highlight-modal");
      openHighlightOverlay(eventId);
    });
  });
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
}

function findHighlightEvent(eventId) {
  const pools = [];
  if (Array.isArray(highlightsState.items)) {
    pools.push(highlightsState.items);
  }
  if (Array.isArray(highlightsState.allItems)) {
    pools.push(highlightsState.allItems);
  }

  if (!eventId) {
    return (pools[0] && pools[0][0]) || (pools[1] && pools[1][0]) || null;
  }

  for (const list of pools) {
    const byId = list.find((event) => (event?._id || "") === eventId);
    if (byId) {
      return byId;
    }
    const byTitle = list.find((event) => event?.title === eventId);
    if (byTitle) {
      return byTitle;
    }
  }

  return null;
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
  const tagsMarkup = renderVideoTags ? renderVideoTags(video) : "";
  const focalPoint = buildObjectPosition(video.thumbnailFocalPoint || video.thumbnailHotspot);
  const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

  return `
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${escapeHtml(
        youtubeId
      )}" data-video-title="${escapeHtml(videoTitle)}">
        <img src="${escapeAttribute(thumbnail)}" alt="${escapeHtml(alt)}" loading="lazy"${focalStyle} />
        <button class="play-button" type="button"${buttonState} aria-label="Play ${escapeHtml(
          videoTitle
        )}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${escapeHtml(video.title || "Video highlight")}</h4>
        ${video.description ? `<p>${escapeHtml(video.description)}</p>` : ""}
        ${tagsMarkup}
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
  const focalPoint = buildObjectPosition(photo?.image?.focalPoint || photo?.image?.hotspot);
  const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

  return `
    <article class="gallery-card">
      <div class="gallery-card-media"${previewAttributes ? ` ${previewAttributes}` : ""}>
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeHtml(alt)}" loading="lazy"${focalStyle} />
      </div>
      <div class="gallery-card-body">
        <h4>${escapeHtml(photo?.title || "Gallery photo")}</h4>
        ${photo?.description ? `<p class="gallery-card-description">${escapeHtml(photo.description)}</p>` : ""}
        ${renderGalleryTags ? renderGalleryTags(photo?.tags) : ""}
        ${photographerText ? `<div class="gallery-card-footer">${photographerText}</div>` : ""}
      </div>
    </article>
  `;
}

function getVideosForEvent(event) {
  if (!event || !Array.isArray(highlightsState.videos)) {
    return [];
  }

  return highlightsState.videos.filter((video) => doesItemBelongToEvent(video, event));
}

function getPhotosForEvent(event) {
  if (!event || !Array.isArray(highlightsState.photos)) {
    return [];
  }

  return highlightsState.photos.filter((photo) => doesItemBelongToEvent(photo, event));
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

function isFeaturedVideo(video) {
  return Boolean(video?.pinToTop);
}

function getVideoTags(video) {
  if (!video || !Array.isArray(video.tags)) {
    return [];
  }
  return video.tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean);
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

function resolveTournamentTarget(item) {
  const info = getTournamentInfo(item);
  if (!info || !info.title) {
    return null;
  }

  const lookupKey = info.id || info.title;
  const event = lookupKey ? findHighlightEvent(lookupKey) : null;
  const targetId = event ? event._id || event.title : null;
  const label = event?.title || info.title;

  return {
    label,
    targetId,
  };
}

function renderTournamentChip(item, { variant = "inline" } = {}) {
  const data = resolveTournamentTarget(item);
  if (!data?.label) {
    return "";
  }

  const classes = ["tournament-chip"];
  if (variant === "card") {
    classes.push("tournament-chip--on-card");
  }
  if (variant === "inline") {
    classes.push("tournament-chip--inline");
  }

  const label = escapeHtml(data.label);
  const actionLabel = escapeAttribute(`View ${data.label} tournament details`);
  const targetAttr = data.targetId ? ` data-highlight-modal="${escapeAttribute(data.targetId)}"` : "";
  const href = data.targetId
    ? `tournament-highlights.html?tournament=${encodeURIComponent(data.targetId)}`
    : "tournament-highlights.html";
  const tagName = "a";
  const typeAttr = "";

  return `
    <${tagName} class="${classes.join(" ")}" href="${escapeAttribute(href)}"${targetAttr}${typeAttr}${
    data.targetId ? ` aria-label="${actionLabel}"` : ""
  }>
      <span class="tournament-chip-name">${label}</span>
    </${tagName}>
  `;
}

function formatVideoMeta(video) {
  if (!video?.eventDate) {
    return "Updated recently";
  }

  const date = parseDate(video.eventDate);
  if (!date) {
    return "Updated recently";
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatVideoDate(video) {
  if (!video?.eventDate) {
    return "";
  }

  const date = parseDate(video.eventDate);
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getVideoDateParts(value) {
  if (!value) {
    return null;
  }

  const date = parseDate(value);
  if (!date) {
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

function getVideoThumbnail(video) {
  if (!video) {
    return MEDIA_PLACEHOLDER_IMAGE;
  }

  if (video.thumbnailUrl) {
    return video.thumbnailUrl;
  }

  if (video.youtubeId) {
    return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }

  return MEDIA_PLACEHOLDER_IMAGE;
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

function formatReadableDate(event) {
  if (!event) {
    return "";
  }

  return formatDateRangeDisplay(event.eventDate, event.endDate, { month: "long" });
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
      secondary: "",
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

function resolveDayLabel(day, index, total) {
  if (day.label) {
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

function renderVideoCard(video, index) {
  const youtubeId = resolveYoutubeVideoId(video);
  const thumbnail =
    video.thumbnailUrl ||
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : HERO_PLACEHOLDER_IMAGE);
  const alt = video.thumbnailAlt || video.title || "Video highlight";
  const videoTitle = video.title || "Video highlight";
  const isPlayable = Boolean(youtubeId);
  const buttonState = isPlayable ? "" : ' disabled aria-disabled="true"';
  const tournamentChip = renderTournamentChip(video, { variant: "card" });
  const badgeParts = getVideoDateParts(video.eventDate);
  const dateOverlay = badgeParts ? renderVideoDateOverlay(badgeParts) : "";
  const tagsMarkup = renderVideoTags(video);
  const focalPoint = buildObjectPosition(video.thumbnailFocalPoint || video.thumbnailHotspot);
  const focalStyle = focalPoint ? ` style="object-position: ${escapeAttribute(focalPoint)};"` : "";

  return `
    <article class="video-gallery-card" data-motion="delay-${index + 1}">
      <div class="video-frame" data-video-id="${escapeHtml(
        youtubeId
      )}" data-video-title="${escapeHtml(videoTitle)}">
        ${dateOverlay}
        <img src="${escapeAttribute(thumbnail)}" alt="${escapeHtml(alt)}" loading="lazy"${focalStyle} />
        <button class="play-button" type="button"${buttonState} aria-label="Play ${escapeHtml(
          videoTitle
        )}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${escapeHtml(video.title || "")}</h3>
        ${tournamentChip ? `<div class="card-chip-slot">${tournamentChip}</div>` : ""}
        <p>${escapeHtml(video.description || "")}</p>
        ${tagsMarkup}
      </div>
    </article>
  `;
}

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
  const label = cta?.label || fallbackLabel;
  const href = cta?.href || fallbackHref;

  if (!label || !href) {
    return "";
  }

  const isInternal = href.startsWith("#");
  const attrs = isInternal ? ' data-scroll="true"' : ' target="_blank" rel="noopener"';
  return `<a class="btn ${style}" href="${escapeAttribute(href)}"${attrs}>${escapeHtml(label)}</a>`;
}

function setupSmoothScroll() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[data-scroll="true"]');
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    if (!scrollToHash(href)) {
      return;
    }

    event.preventDefault();
  });
}

function scrollToHash(hash) {
  if (!hash || !hash.startsWith("#") || hash.length === 1) {
    return false;
  }

  const target = document.querySelector(hash);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function formatDateRangeDisplay(startValue, endValue, { month = "short" } = {}) {
  if (!startValue) {
    return "";
  }

  const start = parseDate(startValue);
  if (!start) {
    return escapeHtml(startValue);
  }

  if (!endValue) {
    return start.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" });
  }

  const end = parseDate(endValue);
  if (!end) {
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

function buildObjectPosition(point) {
  if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
    return "";
  }

  const clamp = (val) => Math.max(0, Math.min(1, val));
  const x = Math.round(clamp(point.x) * 1000) / 10;
  const y = Math.round(clamp(point.y) * 1000) / 10;
  return `${x}% ${y}%`;
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

  return formatDateRangeDisplay(event.eventDate, event.endDate, { month: "short" });
}

function formatShotDate(value) {
  if (!value) {
    return "";
  }

  const date = parseDate(value);
  if (!date) {
    return value;
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getShotDateParts(value) {
  if (!value) {
    return null;
  }

  const date = parseDate(value);
  if (!date) {
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

function getPhotoTournamentTitle(photo) {
  if (!photo) {
    return "";
  }
  return photo?.tournament?.title || photo?.tournament || "";
}

function sortEntriesChronologically(items, dateField = "eventDate") {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items].sort((a, b) => getDateScore(b, dateField) - getDateScore(a, dateField));
}

function getDateScore(entry, dateField) {
  if (!entry) {
    return 0;
  }

  const value = entry[dateField];
  const parsed = parseDate(value);
  if (parsed) {
    return parsed.getTime();
  }

  const fallback = parseDate(entry._createdAt);
  if (fallback) {
    return fallback.getTime();
  }

  return 0;
}

function shouldDisplayOnHome(entry) {
  if (!entry) {
    return false;
  }

  if (typeof entry.showOnHomePage === "boolean") {
    return entry.showOnHomePage;
  }

  if (typeof entry.featured === "boolean") {
    return entry.featured;
  }

  if (typeof entry.pinToTop === "boolean") {
    return entry.pinToTop;
  }

  return true;
}

function partitionByEventDate(entries) {
  const past = [];
  const future = [];
  if (!Array.isArray(entries)) {
    return { past, future };
  }

  // Compare against the START of today (local) so events happening later
  // today are still considered "upcoming" and not retroactively "past."
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  entries.forEach((entry) => {
    if (!entry) return;
    const endDate = parseDate(entry.endDate);
    const startDate = parseDate(entry.eventDate);
    // Use the latest known date so a multi-day event only moves to "past"
    // once its final day is behind us.
    const reference = endDate || startDate;
    if (reference && reference.getTime() >= todayStart) {
      future.push(entry);
    } else {
      past.push(entry);
    }
  });

  return { past, future };
}

function mergeUpcomingTournaments(cmsUpcoming, rescuedHighlights) {
  const seen = new Set();
  const combined = [];

  const pushUnique = (item) => {
    if (!item) return;
    const key = item._id || item.id || `${item.course || ""}|${item.eventDate || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    combined.push(item);
  };

  cmsUpcoming.forEach(pushUnique);

  // Re-shape highlight events into the upcoming-tournament card's expected
  // shape. Highlight events use `course`/`title` and `eventDate`/`endDate`;
  // upcoming cards expect the same keys plus `location` and `yardage`.
  rescuedHighlights.forEach((highlight) => {
    if (!highlight) return;
    pushUnique({
      _id: highlight._id,
      course: highlight.course || highlight.title || highlight.headline || "",
      location: highlight.location || highlight.city || "",
      eventDate: highlight.eventDate,
      endDate: highlight.endDate,
      yardage: highlight.yardage || highlight.days?.[0]?.yardage || "",
    });
  });

  // Sort upcoming soonest-first.
  combined.sort((a, b) => {
    const da = parseDate(a?.eventDate)?.getTime() ?? Number.POSITIVE_INFINITY;
    const db = parseDate(b?.eventDate)?.getTime() ?? Number.POSITIVE_INFINITY;
    return da - db;
  });

  return combined;
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
  let ballIsVisible = true;
  let homePosition = null;
  let homePositionSet = false;
  let isHoleAnimating = false;
  let holeAnimationTimeout = null;
  let scoreHideTimeout = null;
  let hitCount = 0;
  let pointerInsideBall = false;
  let strokeCooldown = false;
  let strokeCooldownTimeout = null;

  const heroSection = document.querySelector(".site-header");
  const heroElement = document.querySelector(".hero");
  const holeElement = document.querySelector("[data-golf-hole]");
  const scoreboard = document.querySelector("[data-golf-scoreboard]");
  const scoreboardValue = scoreboard ? scoreboard.querySelector("[data-golf-score-value]") : null;
  const pointerState = {
    x: 0,
    y: 0,
    active: false,
  };
  const pushRadius = radius + 16;

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
  const heroAnchorOffset = { x: 0.5, y: -32 };
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

  function captureHomePosition() {
    if (homePositionSet) {
      return;
    }
    homePosition = { x: state.x, y: state.y };
    homePositionSet = true;
  }

  function getHomePosition() {
    return homePosition || { x: state.x, y: state.y };
  }

  function resetScore() {
    hitCount = 0;
    if (scoreboardValue) {
      scoreboardValue.textContent = hitCount;
    }
  }

  function registerHit() {
    if (strokeCooldown) {
      return;
    }

    hitCount += 1;
    if (scoreboardValue) {
      scoreboardValue.textContent = hitCount;
    }

    strokeCooldown = true;
    clearTimeout(strokeCooldownTimeout);
    strokeCooldownTimeout = window.setTimeout(() => {
      strokeCooldown = false;
    }, 500);
  }

  function resetStrokeCooldown() {
    strokeCooldown = false;
    clearTimeout(strokeCooldownTimeout);
  }

  function showScoreboard() {
    if (!scoreboard) {
      return;
    }
    scoreboard.classList.add("is-visible");
    scoreboard.setAttribute("aria-hidden", "false");
    clearTimeout(scoreHideTimeout);
    scoreHideTimeout = window.setTimeout(() => hideScoreboard(), 3200);
  }

  function hideScoreboard() {
    if (!scoreboard) {
      return;
    }
    scoreboard.classList.remove("is-visible");
    scoreboard.setAttribute("aria-hidden", "true");
    resetScore();
  }

  function getHoleMetrics() {
    if (!holeElement) {
      return null;
    }

    const rect = holeElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const paddingX = radius * 0.5;
    const paddingY = radius * 0.2;

    return {
      centerX: rect.left + scrollX + rect.width / 2,
      centerY: rect.top + scrollY + rect.height * 0.5,
      radiusX: rect.width / 2 + paddingX,
      radiusY: rect.height / 2 + paddingY,
    };
  }

  function isBallOverHoleArea(hole) {
    if (!hole) {
      return false;
    }

    const dx = state.x - hole.centerX;
    const dy = state.y - hole.centerY;
    const normalizedX = dx / hole.radiusX;
    const normalizedY = dy / hole.radiusY;
    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
  }

  function getMinYClamp(bounds) {
    const baseMin = bounds.top + radius + worldTopOffset;
    const documentMin = radius + 4;
    return Math.max(baseMin, documentMin);
  }

  function hasThreeHeroColumns() {
    if (!heroElement) {
      return true;
    }

    const styles = window.getComputedStyle(heroElement);
    const gapValue =
      parseFloat(styles.getPropertyValue("column-gap") || styles.getPropertyValue("gap")) || 0;
    const availableWidth = heroElement.clientWidth;
    if (!availableWidth) {
      return false;
    }

    const minColumnWidth = 280;
    const minWidthForThreeColumns = minColumnWidth * 3 + gapValue * 2;
    return availableWidth >= minWidthForThreeColumns - 0.5;
  }

  function positionBallAtHeroName(options = {}) {
    const rect = getHeroNameAnchorRect();
    if (!rect) {
      return false;
    }

    const bounds = getWorldBounds();
    const initialX = rect.left + rect.width / 3 + heroAnchorOffset.x;
    const initialY = rect.top + rect.height / 30 + heroAnchorOffset.y;
    const minX = bounds.left + radius + 12;
    const maxX = bounds.right - radius - 12;
    const minY = getMinYClamp(bounds);
    const maxY = bounds.bottom - radius - 12;
    state.x = clamp(initialX, minX, maxX);
    state.y = clamp(initialY, minY, maxY);
    state.vx = 0;
    state.vy = 0;
    setBallPosition();
    if (options.recordHome) {
      captureHomePosition();
    }
    return true;
  }

  function positionBallUnderScroll(options = {}) {
    if (!heroScroll) {
      return false;
    }

    const rect = getDocumentRect(scrollLabel || heroScroll);
    const bounds = getWorldBounds();
    const initialX = rect.left + rect.width / 2 + scrollAnchorOffset.x;
    const initialY = rect.bottom + radius + scrollAnchorOffset.y;
    const minX = bounds.left + radius + 12;
    const maxX = bounds.right - radius - 12;
    const minY = getMinYClamp(bounds);
    const maxY = bounds.bottom - radius - 12;
    state.x = clamp(initialX, minX, maxX);
    state.y = clamp(initialY, minY, maxY);
    state.vx = 0;
    state.vy = 0;
    setBallPosition();
    if (options.recordHome) {
      captureHomePosition();
    }
    return true;
  }

  function placeBallAtPreferredAnchor(options = {}) {
    const { recordHome = false } = options;

    if (positionBallAtHeroName({ recordHome })) {
      return;
    }

    if (positionBallUnderScroll({ recordHome })) {
      return;
    }

    setBallPosition();
    if (recordHome) {
      captureHomePosition();
    }
  }

  function syncBallVisibility(options = {}) {
    const { force = false, skipReposition = false } = options;
    if (isHoleAnimating) {
      return;
    }

    const shouldBeVisible = hasThreeHeroColumns();
    if (!force && shouldBeVisible === ballIsVisible) {
      return;
    }

    const wasVisible = ballIsVisible;
    ballIsVisible = shouldBeVisible;
    ball.style.display = shouldBeVisible ? "" : "none";

    if (shouldBeVisible && (!wasVisible || force) && !skipReposition) {
      placeBallAtPreferredAnchor();
    }
  }

  placeBallAtPreferredAnchor({ recordHome: true });
  syncBallVisibility({ force: true });
  window.addEventListener(
    "load",
    () => {
      placeBallAtPreferredAnchor();
      syncBallVisibility({ force: true });
    },
    { once: true }
  );
  requestAnimationFrame(() => {
    placeBallAtPreferredAnchor();
    syncBallVisibility({ force: true });
  });

  function applyPointerPush(moveX, moveY) {
    if (isHoleAnimating) {
      return;
    }

    if (!pointerState.active) {
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

    const dx = state.x - pointerState.x;
    const dy = state.y - pointerState.y;
    const distance = Math.hypot(dx, dy);
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
    const minY = getMinYClamp(bounds);
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

  // When the ball overlaps the hero hole, run a sink + respawn animation back at home.
  function animateBallIntoHole(hole) {
    if (isHoleAnimating) {
      return;
    }

    if (!homePosition) {
      captureHomePosition();
    }

    isHoleAnimating = true;
    pointerState.active = false;
    pointerInsideBall = false;
    resetStrokeCooldown();
    isMoving = false;
    state.vx = 0;
    state.vy = 0;
    ball.classList.remove("is-moving");
    ball.classList.add("is-sinking");
    showScoreboard();

    const sinkX = hole.centerX - radius;
    const sinkY = hole.centerY - radius * 0.6;
    const sinkScale = 0.6;

    clearTimeout(holeAnimationTimeout);
    ball.style.transition =
      "transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in";
    ball.style.transform = `translate3d(${sinkX}px, ${sinkY}px, 0) scale(${sinkScale})`;
    ball.style.opacity = "0";
    ball.style.boxShadow = "0 10px 20px rgba(15, 29, 51, 0.2)";

    holeAnimationTimeout = window.setTimeout(() => {
      const home = getHomePosition();
      state.x = home.x;
      state.y = home.y;
      state.vx = 0;
      state.vy = 0;

      ball.style.transition = "none";
      ball.style.transform = `translate3d(${home.x - radius}px, ${home.y - radius}px, 0) scale(0.35)`;
      ball.style.opacity = "0";

      requestAnimationFrame(() => {
        ball.classList.remove("is-sinking");
        ball.classList.add("is-returning");
        ball.style.transition =
          "transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out";
        ball.style.opacity = "1";
        ball.style.boxShadow = "3px 4px 12px rgba(15, 29, 51, 0.25)";
        ball.style.transform = `translate3d(${home.x - radius}px, ${home.y - radius}px, 0) scale(1)`;
      });

      holeAnimationTimeout = window.setTimeout(() => {
        ball.classList.remove("is-returning", "is-sinking");
        ball.style.transition = "";
        ball.style.opacity = "";
        ball.style.boxShadow = "";
        setBallPosition();
        isHoleAnimating = false;
        syncBallVisibility({ force: true, skipReposition: true });
      }, 520);
    }, 360);
  }

  function step() {
    requestAnimationFrame(step);

    if (isHoleAnimating) {
      return;
    }

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

    if (ballIsVisible) {
      const hole = getHoleMetrics();
      if (hole && isBallOverHoleArea(hole)) {
        animateBallIntoHole(hole);
        return;
      }
    }

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

      const dx = state.x - pointerState.x;
      const dy = state.y - pointerState.y;
      const distance = Math.hypot(dx, dy);
      const wasInside = pointerInsideBall;
      pointerInsideBall = distance <= pushRadius;

      if (!pointerInsideBall) {
        return;
      }

      const preSpeed = Math.hypot(state.vx, state.vy);
      applyPointerPush(moveX, moveY);
      const postSpeed = Math.hypot(state.vx, state.vy);
      const speedGain = postSpeed - preSpeed;

      if (!wasInside && !strokeCooldown) {
        const movement = Math.hypot(moveX, moveY);
        if (speedGain > 0.35 || postSpeed > 1 || movement > 1.2) {
          registerHit();
        }
      }
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    pointerState.active = false;
    pointerInsideBall = false;
    resetStrokeCooldown();
  });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      pointerState.active = false;
      pointerInsideBall = false;
      resetStrokeCooldown();
    }
  });

  window.addEventListener("blur", () => {
    pointerState.active = false;
    pointerInsideBall = false;
    resetStrokeCooldown();
  });

  window.addEventListener("scroll", () => {
    pointerState.active = false;
    pointerInsideBall = false;
    resetStrokeCooldown();
  });

  window.addEventListener("resize", () => {
    if (!isHoleAnimating) {
      const bounds = getWorldBounds();
      state.x = clamp(state.x, bounds.left + radius + 8, bounds.right - radius - 8);
      state.y = clamp(state.y, getMinYClamp(bounds), bounds.bottom - radius - 8);
    }
    syncBallVisibility();
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
