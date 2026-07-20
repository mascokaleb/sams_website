import { parseDate } from "./dateUtils.js";

// Score trend charts for the Tournament Highlights page.
//
// Both charts compute themselves from the tournament library, so they stay
// current automatically whenever a tournament (and its day scores) is added
// in Sanity Studio — no separate chart upkeep:
//   1. "2-Day Tournament Totals" — every event with exactly two scored days,
//      charted as a total over time.
//   2. "Season Score Trends" — high / low / average per season, computed from
//      every scored day of that season. Seasons that predate the tournament
//      library come from manual `seasonTrend` documents; a manual document
//      for a year that also has live data overrides the calculation.
// Events flagged `excludeFromTrends` in Studio (match-play / team formats)
// are left out of both charts.

// Chart colors come from the --chart-* tokens in styles.css so the charts
// follow the page theme (the tournament page is dark; both palettes are
// validated for CVD separation and contrast against their surface). These
// are the light-mode fallbacks; refreshChartColors() re-reads the tokens at
// render time.
let INK = "#1a1a1a";
let MUTED = "#57514a";
let GRID = "#e9e4d6";
let AXIS = "#a8a28d";
let NAVY = "#33548f";
let NAVY_RANGE = "#c7d2e8";
let NAVY_RANGE_HOVER = "#afc0de";
let GOLD = "#9a7420";
let SURFACE = "#ffffff";

function refreshChartColors() {
  const styles = window.getComputedStyle(document.body);
  const read = (name, fallback) => {
    const value = styles.getPropertyValue(name).trim();
    return value || fallback;
  };
  INK = read("--chart-ink", INK);
  MUTED = read("--chart-muted", MUTED);
  GRID = read("--chart-grid", GRID);
  AXIS = read("--chart-axis", AXIS);
  NAVY = read("--chart-mark", NAVY);
  NAVY_RANGE = read("--chart-range", NAVY_RANGE);
  NAVY_RANGE_HOVER = read("--chart-range-hover", NAVY_RANGE_HOVER);
  GOLD = read("--chart-accent", GOLD);
  SURFACE = read("--chart-surface", SURFACE);
}

const SVG_NS = "http://www.w3.org/2000/svg";
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      el.setAttribute(key, String(value));
    }
  });
  return el;
}

function htmlEl(name, className, text) {
  const el = document.createElement(name);
  if (className) {
    el.className = className;
  }
  if (text !== undefined && text !== null) {
    el.textContent = String(text);
  }
  return el;
}

function formatMonthYear(date) {
  return `${MONTH_SHORT[date.getMonth()]} ’${String(date.getFullYear()).slice(2)}`;
}

function formatReadableDate(date) {
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function niceBounds(min, max, pad = 2, step = 10) {
  const lo = Math.floor((min - pad) / step) * step;
  const hi = Math.ceil((max + pad) / step) * step;
  return { lo, hi };
}

function ticksBetween(lo, hi, step = 10) {
  const ticks = [];
  for (let v = lo; v <= hi; v += step) {
    ticks.push(v);
  }
  return ticks;
}

// ---------------------------------------------------------------------------
// Data preparation
// ---------------------------------------------------------------------------

function eligibleEvents(events) {
  return (Array.isArray(events) ? events : []).filter((event) => event && !event.excludeFromTrends);
}

export function buildTwoDayTotals(events) {
  return eligibleEvents(events)
    .map((event) => {
      const days = Array.isArray(event.days) ? event.days : [];
      const scores = days
        .map((day) => (typeof day?.score === "number" ? day.score : null))
        .filter((score) => score !== null);
      // Only chart clean two-day events: exactly two days, both scored.
      if (days.length !== 2 || scores.length !== 2) {
        return null;
      }
      const date = parseDate(event.eventDate);
      if (!date) {
        return null;
      }
      return {
        date,
        title: event.title || "Tournament",
        dayScores: scores,
        total: scores[0] + scores[1],
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
}

export function buildSeasonStats(events, manualTrends) {
  const scoresByYear = new Map();
  const latestDateByYear = new Map();

  eligibleEvents(events).forEach((event) => {
    const date = parseDate(event.eventDate);
    if (!date) {
      return;
    }
    const year = String(date.getFullYear());
    (Array.isArray(event.days) ? event.days : []).forEach((day) => {
      if (typeof day?.score !== "number") {
        return;
      }
      if (!scoresByYear.has(year)) {
        scoresByYear.set(year, []);
      }
      scoresByYear.get(year).push(day.score);
    });
    const eventEnd = parseDate(event.endDate) || date;
    const prev = latestDateByYear.get(year);
    if (!prev || eventEnd > prev) {
      latestDateByYear.set(year, eventEnd);
    }
  });

  const seasons = new Map();
  scoresByYear.forEach((scores, year) => {
    if (!scores.length) {
      return;
    }
    const sum = scores.reduce((acc, value) => acc + value, 0);
    seasons.set(year, {
      year,
      high: Math.max(...scores),
      low: Math.min(...scores),
      avg: Math.round((sum / scores.length) * 10) / 10,
      rounds: scores.length,
      computed: true,
      latestDate: latestDateByYear.get(year) || null,
    });
  });

  // Manual documents fill in pre-library seasons and win over the
  // calculation when both exist for the same year.
  (Array.isArray(manualTrends) ? manualTrends : []).forEach((doc) => {
    if (!doc || !doc.year) {
      return;
    }
    if (
      typeof doc.highScore !== "number" ||
      typeof doc.lowScore !== "number" ||
      typeof doc.averageScore !== "number"
    ) {
      return;
    }
    seasons.set(String(doc.year), {
      year: String(doc.year),
      high: doc.highScore,
      low: doc.lowScore,
      avg: doc.averageScore,
      rounds: null,
      computed: false,
      note: doc.note || "",
      latestDate: null,
    });
  });

  return Array.from(seasons.values()).sort((a, b) => Number(a.year) - Number(b.year));
}

// ---------------------------------------------------------------------------
// Shared chart chrome
// ---------------------------------------------------------------------------

function buildCard(container, { eyebrow, title, subtitle }) {
  container.textContent = "";
  container.hidden = false;

  const header = htmlEl("figcaption", "trend-card-header");
  header.appendChild(htmlEl("p", "trend-card-eyebrow", eyebrow));
  header.appendChild(htmlEl("h3", "trend-card-title", title));
  if (subtitle) {
    header.appendChild(htmlEl("p", "trend-card-subtitle", subtitle));
  }
  container.appendChild(header);

  const wrap = htmlEl("div", "trend-chart-wrap");
  container.appendChild(wrap);

  const tooltip = htmlEl("div", "trend-tooltip");
  tooltip.hidden = true;
  wrap.appendChild(tooltip);

  return { wrap, tooltip };
}

function tooltipRow(tooltip, label, value, { strong = false, keyColor = null } = {}) {
  const row = htmlEl("div", "trend-tooltip-row");
  if (keyColor) {
    const key = htmlEl("span", "trend-tooltip-key");
    key.style.background = keyColor;
    row.appendChild(key);
  }
  row.appendChild(htmlEl("span", "trend-tooltip-label", label));
  row.appendChild(htmlEl("span", `trend-tooltip-value${strong ? " is-strong" : ""}`, value));
  tooltip.appendChild(row);
}

function positionTooltip(tooltip, wrap, xRatio, yRatio) {
  const wrapRect = wrap.getBoundingClientRect();
  const x = xRatio * wrapRect.width;
  const y = yRatio * wrapRect.height;
  tooltip.hidden = false;
  const tipRect = tooltip.getBoundingClientRect();
  let left = x + 14;
  if (left + tipRect.width > wrapRect.width - 4) {
    left = x - tipRect.width - 14;
  }
  let top = y - tipRect.height / 2;
  top = Math.max(4, Math.min(top, wrapRect.height - tipRect.height - 4));
  tooltip.style.left = `${Math.max(4, left)}px`;
  tooltip.style.top = `${top}px`;
}

function buildTable(container, caption, headers, rows) {
  const details = htmlEl("details", "trend-table");
  details.appendChild(htmlEl("summary", null, "View as table"));
  const table = htmlEl("table");
  const capEl = htmlEl("caption", "sr-only", caption);
  table.appendChild(capEl);
  const thead = htmlEl("thead");
  const headRow = htmlEl("tr");
  headers.forEach((label) => {
    const th = htmlEl("th", null, label);
    th.scope = "col";
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = htmlEl("tbody");
  rows.forEach((cells) => {
    const tr = htmlEl("tr");
    cells.forEach((value, index) => {
      const isNumeric = /^[\d.,—-]+$/.test(String(value));
      tr.appendChild(htmlEl(index === 0 ? "th" : "td", isNumeric ? "is-num" : null, value));
    });
    if (tr.firstChild) {
      tr.firstChild.scope = "row";
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  details.appendChild(table);
  container.appendChild(details);
}

function drawYAxis(svg, ticks, scaleY, plot) {
  ticks.forEach((value) => {
    const y = scaleY(value);
    svg.appendChild(
      svgEl("line", {
        x1: plot.left,
        x2: plot.left + plot.width,
        y1: y,
        y2: y,
        stroke: GRID,
        "stroke-width": 1,
      })
    );
    const label = svgEl("text", {
      x: plot.left - 8,
      y: y + 3.5,
      "text-anchor": "end",
      class: "trend-axis-text",
      fill: MUTED,
    });
    label.textContent = String(value);
    svg.appendChild(label);
  });
}

// ---------------------------------------------------------------------------
// Chart 1 — 2-day tournament totals over time (single-series line)
// ---------------------------------------------------------------------------

function renderTwoDayChart(container, points, width) {
  const { wrap, tooltip } = buildCard(container, {
    eyebrow: "Multi-day events",
    title: "2-Day Tournament Totals",
    subtitle: "Combined 36-hole score for every two-day tournament — lower is better.",
  });

  // The viewBox matches the rendered pixel width so SVG text renders at true
  // size on every screen (SVG text scales with the viewBox otherwise).
  const W = width;
  const H = width < 480 ? 300 : 330;
  const plot = { left: 46, top: 18, width: W - 46 - 18, height: H - 18 - 44 };

  const totals = points.map((p) => p.total);
  const { lo, hi } = niceBounds(Math.min(...totals), Math.max(...totals));
  const t0 = points[0].date.getTime();
  const t1 = points[points.length - 1].date.getTime();
  const span = Math.max(t1 - t0, 1);
  const scaleX = (date) => plot.left + ((date.getTime() - t0) / span) * plot.width;
  const scaleY = (value) => plot.top + ((hi - value) / (hi - lo)) * plot.height;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "trend-svg",
    role: "img",
  });
  const best = points.reduce((min, p) => (p.total < min.total ? p : min), points[0]);
  const svgTitle = svgEl("title");
  svgTitle.textContent = `Line chart of 2-day tournament totals from ${formatReadableDate(points[0].date)} to ${formatReadableDate(points[points.length - 1].date)}. Best total ${best.total} at ${best.title}.`;
  svg.appendChild(svgTitle);

  drawYAxis(svg, ticksBetween(lo, hi), scaleY, plot);

  // X ticks: month starts, thinned so labels never crowd.
  const monthTicks = [];
  const cursor = new Date(points[0].date.getFullYear(), points[0].date.getMonth(), 1);
  const end = points[points.length - 1].date;
  while (cursor <= end) {
    monthTicks.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  const stride = Math.max(1, Math.ceil(monthTicks.length / (W < 480 ? 4 : 6)));
  monthTicks
    .filter((_, index) => index % stride === 0)
    .forEach((date) => {
      const x = scaleX(date);
      if (x < plot.left - 1 || x > plot.left + plot.width + 1) {
        return;
      }
      svg.appendChild(
        svgEl("line", {
          x1: x,
          x2: x,
          y1: plot.top + plot.height,
          y2: plot.top + plot.height + 5,
          stroke: AXIS,
          "stroke-width": 1,
        })
      );
      const label = svgEl("text", {
        x,
        y: plot.top + plot.height + 20,
        "text-anchor": "middle",
        class: "trend-axis-text",
        fill: MUTED,
      });
      label.textContent = formatMonthYear(date);
      svg.appendChild(label);
    });

  // Baseline
  svg.appendChild(
    svgEl("line", {
      x1: plot.left,
      x2: plot.left + plot.width,
      y1: plot.top + plot.height,
      y2: plot.top + plot.height,
      stroke: AXIS,
      "stroke-width": 1,
    })
  );

  // The line itself
  const path = points
    .map((p, index) => `${index === 0 ? "M" : "L"}${scaleX(p.date).toFixed(1)},${scaleY(p.total).toFixed(1)}`)
    .join(" ");
  svg.appendChild(
    svgEl("path", {
      d: path,
      fill: "none",
      stroke: NAVY,
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    })
  );

  // Crosshair (hidden until hover)
  const crosshair = svgEl("line", {
    y1: plot.top,
    y2: plot.top + plot.height,
    stroke: AXIS,
    "stroke-width": 1,
    opacity: 0,
    "pointer-events": "none",
  });
  svg.appendChild(crosshair);

  // Dots with a surface ring so they stay legible on the line.
  points.forEach((p) => {
    svg.appendChild(
      svgEl("circle", {
        cx: scaleX(p.date).toFixed(1),
        cy: scaleY(p.total).toFixed(1),
        r: 4.5,
        fill: NAVY,
        stroke: SURFACE,
        "stroke-width": 2,
      })
    );
  });

  // Direct label on the extreme only (the best total); everything else lives
  // in the tooltip and table.
  const bestLabel = svgEl("text", {
    // Clamp so the label never clips when the best total sits near an edge.
    x: Math.max(plot.left + 42, Math.min(scaleX(best.date), plot.left + plot.width - 42)),
    y: Math.min(scaleY(best.total) + 20, plot.top + plot.height - 6),
    "text-anchor": "middle",
    class: "trend-direct-label",
    fill: INK,
  });
  bestLabel.textContent = `${best.total} · best`;
  svg.appendChild(bestLabel);

  const showPoint = (p) => {
    tooltip.textContent = "";
    tooltip.appendChild(htmlEl("p", "trend-tooltip-title", p.title));
    tooltip.appendChild(htmlEl("p", "trend-tooltip-date", formatReadableDate(p.date)));
    p.dayScores.forEach((score, index) => {
      tooltipRow(tooltip, `Day ${index + 1}`, String(score));
    });
    tooltipRow(tooltip, "Total", String(p.total), { strong: true, keyColor: NAVY });
    const xr = scaleX(p.date) / W;
    const yr = scaleY(p.total) / H;
    crosshair.setAttribute("x1", scaleX(p.date));
    crosshair.setAttribute("x2", scaleX(p.date));
    crosshair.setAttribute("opacity", "1");
    positionTooltip(tooltip, wrap, xr, yr);
  };

  const hide = () => {
    tooltip.hidden = true;
    crosshair.setAttribute("opacity", "0");
  };

  // The whole plot is the hit area — the crosshair snaps to the nearest event
  // so nobody has to aim at a dot.
  const overlay = svgEl("rect", {
    x: plot.left,
    y: plot.top,
    width: plot.width,
    height: plot.height,
    fill: "transparent",
  });
  overlay.addEventListener("pointermove", (event) => {
    const rect = svg.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = points[0];
    let bestDist = Infinity;
    points.forEach((p) => {
      const dist = Math.abs(scaleX(p.date) - px);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = p;
      }
    });
    showPoint(nearest);
  });
  overlay.addEventListener("pointerleave", hide);
  svg.appendChild(overlay);

  // Keyboard access: an invisible, generously sized focus target per event.
  points.forEach((p) => {
    const hit = svgEl("circle", {
      cx: scaleX(p.date).toFixed(1),
      cy: scaleY(p.total).toFixed(1),
      r: 12,
      fill: "transparent",
      tabindex: 0,
      role: "img",
      "aria-label": `${p.title}, ${formatReadableDate(p.date)}: days ${p.dayScores.join(" and ")}, total ${p.total}`,
    });
    hit.addEventListener("focus", () => showPoint(p));
    hit.addEventListener("blur", hide);
    svg.appendChild(hit);
  });

  wrap.appendChild(svg);

  buildTable(
    container,
    "2-day tournament totals",
    ["Tournament", "Date", "Day 1", "Day 2", "Total"],
    points.map((p) => [
      p.title,
      formatReadableDate(p.date),
      String(p.dayScores[0]),
      String(p.dayScores[1]),
      String(p.total),
    ])
  );

  container.appendChild(
    htmlEl("p", "trend-footnote", "Updates automatically as tournament results are added to the library.")
  );
}

// ---------------------------------------------------------------------------
// Chart 2 — season high / low / average (range bar + average marker)
// ---------------------------------------------------------------------------

function renderSeasonChart(container, seasons, width) {
  const currentYear = String(new Date().getFullYear());
  const { wrap, tooltip } = buildCard(container, {
    eyebrow: "Season by season",
    title: "Tournament Score Trends",
    subtitle: "18-hole tournament rounds per season — lower is better.",
  });

  // Legend (two entities: the range bar and the average marker).
  const legend = htmlEl("div", "trend-legend");
  const rangeItem = htmlEl("span", "trend-legend-item");
  const rangeSwatch = htmlEl("span", "trend-legend-swatch");
  rangeSwatch.style.background = NAVY_RANGE;
  rangeItem.appendChild(rangeSwatch);
  rangeItem.appendChild(htmlEl("span", null, "Score range (low–high)"));
  const avgItem = htmlEl("span", "trend-legend-item");
  const avgSwatch = htmlEl("span", "trend-legend-swatch is-line");
  avgSwatch.style.background = GOLD;
  avgItem.appendChild(avgSwatch);
  avgItem.appendChild(htmlEl("span", null, "Season average"));
  legend.appendChild(rangeItem);
  legend.appendChild(avgItem);
  wrap.appendChild(legend);

  const W = width;
  const H = width < 480 ? 300 : 330;
  const plot = { left: 46, top: 40, width: W - 46 - 18, height: H - 40 - 44 };

  const { lo, hi } = niceBounds(
    Math.min(...seasons.map((s) => s.low)),
    Math.max(...seasons.map((s) => s.high)),
    3
  );
  const scaleY = (value) => plot.top + ((hi - value) / (hi - lo)) * plot.height;
  const band = plot.width / seasons.length;
  const barWidth = 22;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${W} ${H}`,
    class: "trend-svg",
    role: "img",
  });
  const svgTitle = svgEl("title");
  svgTitle.textContent = `Season score trends: ${seasons
    .map((s) => `${s.year} low ${s.low}, average ${s.avg}, high ${s.high}`)
    .join("; ")}.`;
  svg.appendChild(svgTitle);

  drawYAxis(svg, ticksBetween(lo, hi), scaleY, plot);

  svg.appendChild(
    svgEl("line", {
      x1: plot.left,
      x2: plot.left + plot.width,
      y1: plot.top + plot.height,
      y2: plot.top + plot.height,
      stroke: AXIS,
      "stroke-width": 1,
    })
  );

  const footnotes = [];

  const showSeason = (season, cx) => {
    tooltip.textContent = "";
    tooltip.appendChild(htmlEl("p", "trend-tooltip-title", `${season.year} season`));
    if (season.rounds) {
      tooltip.appendChild(htmlEl("p", "trend-tooltip-date", `${season.rounds} tournament rounds`));
    }
    tooltipRow(tooltip, "High", String(season.high), { keyColor: NAVY_RANGE });
    tooltipRow(tooltip, "Average", String(season.avg), { strong: true, keyColor: GOLD });
    tooltipRow(tooltip, "Low", String(season.low), { keyColor: NAVY_RANGE });
    positionTooltip(tooltip, wrap, cx / W, scaleY(season.avg) / H);
  };
  const hide = () => {
    tooltip.hidden = true;
  };

  seasons.forEach((season, index) => {
    const cx = plot.left + band * index + band / 2;
    const yHigh = scaleY(season.high);
    const yLow = scaleY(season.low);
    const yAvg = scaleY(season.avg);
    const isCurrentPartial = season.computed && season.year === currentYear;

    const group = svgEl("g", { class: "trend-season-group" });

    // Range bar: a floating rounded bar from low to high in a light step of
    // the mark hue.
    const bar = svgEl("rect", {
      x: cx - barWidth / 2,
      y: yHigh,
      width: barWidth,
      height: Math.max(yLow - yHigh, 6),
      rx: 4,
      fill: NAVY_RANGE,
      class: "trend-range-bar",
    });
    group.appendChild(bar);

    // Average marker: a gold tick with a surface ring so it reads where it
    // crosses the bar.
    group.appendChild(
      svgEl("rect", {
        x: cx - barWidth / 2 - 4,
        y: yAvg - 2,
        width: barWidth + 8,
        height: 4,
        rx: 2,
        fill: GOLD,
        stroke: SURFACE,
        "stroke-width": 2,
        "paint-order": "stroke",
      })
    );

    // Selective direct labels: every season average (the story), high/low on
    // the first and latest seasons only (the arc); the rest stays in the
    // tooltip and table.
    const avgLabel = svgEl("text", {
      x: cx + barWidth / 2 + 10,
      y: yAvg + 4,
      "text-anchor": "start",
      class: "trend-direct-label",
      fill: INK,
    });
    avgLabel.textContent = String(season.avg);
    group.appendChild(avgLabel);

    if (index === 0 || index === seasons.length - 1) {
      const highLabel = svgEl("text", {
        x: cx,
        y: yHigh - 8,
        "text-anchor": "middle",
        class: "trend-minor-label",
        fill: MUTED,
      });
      highLabel.textContent = String(season.high);
      group.appendChild(highLabel);

      const lowLabel = svgEl("text", {
        x: cx,
        y: yLow + 16,
        "text-anchor": "middle",
        class: "trend-minor-label",
        fill: MUTED,
      });
      lowLabel.textContent = String(season.low);
      group.appendChild(lowLabel);
    }

    // Season label on the axis.
    const yearLabel = svgEl("text", {
      x: cx,
      y: plot.top + plot.height + 20,
      "text-anchor": "middle",
      class: "trend-axis-text is-season",
      fill: INK,
    });
    yearLabel.textContent = isCurrentPartial ? `${season.year}*` : season.year;
    group.appendChild(yearLabel);

    if (isCurrentPartial && season.latestDate) {
      footnotes.push(
        `*${season.year} season in progress — through ${MONTH_SHORT[season.latestDate.getMonth()]} ${season.latestDate.getDate()}.`
      );
    }
    if (!season.computed && season.note) {
      footnotes.push(`${season.year}: ${season.note}.`);
    }

    // The whole band is the hit target, mouse and keyboard alike.
    const hit = svgEl("rect", {
      x: plot.left + band * index,
      y: plot.top,
      width: band,
      height: plot.height,
      fill: "transparent",
      tabindex: 0,
      role: "img",
      "aria-label": `${season.year} season: low ${season.low}, average ${season.avg}, high ${season.high}`,
    });
    hit.addEventListener("pointerenter", () => {
      bar.setAttribute("fill", NAVY_RANGE_HOVER);
      showSeason(season, cx);
    });
    hit.addEventListener("pointerleave", () => {
      bar.setAttribute("fill", NAVY_RANGE);
      hide();
    });
    hit.addEventListener("focus", () => showSeason(season, cx));
    hit.addEventListener("blur", hide);
    group.appendChild(hit);

    svg.appendChild(group);
  });

  wrap.appendChild(svg);

  buildTable(
    container,
    "Season score trends",
    ["Season", "Low", "Average", "High", "Rounds"],
    seasons.map((season) => [
      season.year,
      String(season.low),
      String(season.avg),
      String(season.high),
      season.rounds ? String(season.rounds) : "—",
    ])
  );

  footnotes.push("Updates automatically as tournament results are added to the library.");
  footnotes.forEach((note) => {
    container.appendChild(htmlEl("p", "trend-footnote", note));
  });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function measureChartWidth(container) {
  const rect = container.getBoundingClientRect();
  const style = window.getComputedStyle(container);
  const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
  const inner = rect.width - padding;
  return Math.max(300, Math.min(680, Math.round(inner > 0 ? inner : 640)));
}

export function renderScoreTrends(data) {
  const section = document.querySelector("[data-score-trends]");
  if (!section) {
    return;
  }
  refreshChartColors();

  const twoDayContainer = section.querySelector("[data-trend-two-day]");
  const seasonContainer = section.querySelector("[data-trend-seasons]");

  const points = buildTwoDayTotals(data?.highlightEvents);
  const seasons = buildSeasonStats(data?.highlightEvents, data?.seasonTrends);

  const hasTwoDay = points.length >= 2 && twoDayContainer;
  const hasSeasons = seasons.length >= 2 && seasonContainer;

  if (!hasTwoDay && !hasSeasons) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  if (!hasTwoDay && twoDayContainer) {
    twoDayContainer.hidden = true;
  }
  if (!hasSeasons && seasonContainer) {
    seasonContainer.hidden = true;
  }

  let renderedWidth = 0;
  const render = () => {
    if (hasSeasons) {
      renderedWidth = measureChartWidth(seasonContainer);
      renderSeasonChart(seasonContainer, seasons, renderedWidth);
    }
    if (hasTwoDay) {
      renderedWidth = measureChartWidth(twoDayContainer);
      renderTwoDayChart(twoDayContainer, points, renderedWidth);
    }
  };
  render();

  // Re-render when the layout meaningfully changes width so SVG text keeps
  // its true pixel size on rotation / window resize. The width-delta guard
  // stops re-render loops (content swaps change height, never width).
  let resizeTimer = null;
  const target = hasTwoDay ? twoDayContainer : seasonContainer;
  const maybeRerender = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (Math.abs(measureChartWidth(target) - renderedWidth) > 32) {
        render();
      }
    }, 150);
  };
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(maybeRerender).observe(target);
  } else {
    window.addEventListener("resize", maybeRerender);
  }
}
