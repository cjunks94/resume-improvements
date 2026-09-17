/**
 * Tech Radar Visualization
 * Adapted from Zalando Tech Radar: https://github.com/zalando/tech-radar
 * Licensed under MIT
 */

const radar_visualization = function(config) {
  // Helper function to resolve CSS variable colors
  const resolveColor = function(color) {
    if (color.startsWith('var(')) {
      // Extract variable name from var(--variable-name)
      const varName = color.match(/var\((--[\w-]+)\)/)[1];
      // Get computed value from root element
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return color;
  };

  // Deterministic 0..1 hash from a string seed.
  // Keeps blip positions stable across page loads so the radar
  // doesn't jitter every time it rerenders.
  const seededRandom = function(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 100000) / 100000;
  };

  // Configuration defaults
  const cfg = {
    svg_id: config.svg_id || "radar",
    width: config.width || 1200,
    height: config.height || 800,
    colors: config.colors || {
      background: "#fff",
      grid: "#bbb",
      inactive: "#ddd"
    },
    title: config.title || "Tech Radar",
    quadrants: config.quadrants || [],
    rings: config.rings.map(r => ({ ...r, color: resolveColor(r.color) })) || [],
    entries: config.entries || []
  };

  // Helpers
  const radius = Math.min(cfg.width, cfg.height) / 2 - 80;
  const center = { x: cfg.width / 2, y: cfg.height / 2 };

  // Clear any existing SVG
  d3.select("#" + cfg.svg_id).select("svg").remove();

  // Create SVG (no role="img" to avoid nested interactive controls)
  const svg = d3.select("#" + cfg.svg_id)
    .append("svg")
    .attr("width", cfg.width)
    .attr("height", cfg.height)
    .attr("viewBox", `0 0 ${cfg.width} ${cfg.height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("aria-hidden", "false");

  // Add title for accessibility
  svg.append("title").text(cfg.title);
  svg.append("desc").text("Interactive technology radar showing adoption levels across different categories");

  const radar = svg.append("g")
    .attr("transform", `translate(${center.x},${center.y})`);

  // Ring geometry. cfg.rings is ordered outer -> inner (last ring is the
  // center). Rings are sized by AREA so the ring holding most of the blips
  // gets most of the space: outer radius of ring k (from the center) is
  // R * sqrt(cumulativeCount_k / total). A minimum width keeps sparse or
  // empty rings (HOLD) visible and leaves room for 10px blips.
  const ringCount = cfg.rings.length;
  const counts = cfg.rings.map(r =>
    cfg.entries.filter(e => e.ring.toLowerCase() === r.name.toLowerCase()).length
  );
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const minWidth = radius * 0.15;

  // Ideal widths, inner -> outer (index ringCount-1 is the center ring).
  let cumulative = 0;
  const idealWidths = new Array(ringCount);
  for (let i = ringCount - 1; i >= 0; i--) {
    const innerR = radius * Math.sqrt(cumulative / total);
    cumulative += counts[i];
    const outerR = radius * Math.sqrt(cumulative / total);
    idealWidths[i] = outerR - innerR;
  }

  // Clamp to minWidth, then give the leftover radius to the rings that
  // are above the minimum, in proportion to their ideal width.
  const widths = idealWidths.slice();
  for (let pass = 0; pass < ringCount; pass++) {
    let fixed = 0;
    let flexIdeal = 0;
    const flexIdx = [];
    for (let i = 0; i < ringCount; i++) {
      if (widths[i] <= minWidth) { widths[i] = minWidth; fixed += minWidth; }
      else { flexIdeal += idealWidths[i]; flexIdx.push(i); }
    }
    const remaining = Math.max(radius - fixed, 0);
    let clampedAgain = false;
    flexIdx.forEach(i => {
      widths[i] = flexIdeal > 0 ? remaining * (idealWidths[i] / flexIdeal) : 0;
      if (widths[i] < minWidth) clampedAgain = true;
    });
    if (!clampedAgain) break;
  }

  // Outer radius of each ring (index 0 = outermost).
  const ringOuter = new Array(ringCount);
  let acc = 0;
  for (let i = ringCount - 1; i >= 0; i--) {
    acc += widths[i];
    ringOuter[i] = acc;
  }
  const ringInner = i => (i === ringCount - 1 ? 0 : ringOuter[i + 1]);

  // Draw grid circles (rings)
  cfg.rings.forEach((ring, i) => {
    radar.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", ringOuter[i])
      .style("fill", "none")
      .style("stroke", cfg.colors.grid)
      .style("stroke-width", 1);

    // Ring labels sit on the vertical axis, centered in their band
    const ringLabelY = -(ringInner(i) + widths[i] / 2) + 5;

    // White stroke (halo) layer
    radar.append("text")
      .attr("y", ringLabelY)
      .attr("text-anchor", "middle")
      .attr("class", "svg-text-halo")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text(ring.name.toUpperCase());

    // Colored fill layer on top
    radar.append("text")
      .attr("y", ringLabelY)
      .attr("text-anchor", "middle")
      .style("fill", ring.color)
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text(ring.name.toUpperCase());
  });

  // Draw quadrant lines
  radar.append("line")
    .attr("x1", 0).attr("y1", -radius)
    .attr("x2", 0).attr("y2", radius)
    .style("stroke", cfg.colors.grid)
    .style("stroke-width", 1);

  radar.append("line")
    .attr("x1", -radius).attr("y1", 0)
    .attr("x2", radius).attr("y2", 0)
    .style("stroke", cfg.colors.grid)
    .style("stroke-width", 1);

  // Quadrant labels with white stroke halo for contrast
  const quadrantAngles = [45, 135, 225, 315]; // degrees
  cfg.quadrants.forEach((quadrant, i) => {
    const angle = (quadrantAngles[i] - 90) * Math.PI / 180;
    const labelRadius = radius + 30;
    const x = labelRadius * Math.cos(angle);
    const y = labelRadius * Math.sin(angle);
    const labelText = quadrant.name.replace('-', ' & ').toUpperCase();

    // White stroke (halo) for contrast on dark backgrounds
    radar.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .attr("class", "svg-text-halo")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text(labelText);

    // Main text (black fill on top)
    radar.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .style("fill", "var(--c-ink)")
      .text(labelText);
  });

  // Map quadrant names to indices
  const quadrantMap = {};
  cfg.quadrants.forEach((q, i) => {
    quadrantMap[q.name] = i;
  });

  // Map ring names to indices
  const ringMap = {};
  cfg.rings.forEach((r, i) => {
    ringMap[r.name.toLowerCase()] = i;
  });

  // ------------------------------------------------------------------
  // Pass 1: compute a position for every entry (deterministic jitter),
  // then relax overlapping blips apart while keeping each one inside
  // its own ring band and quadrant.
  // ------------------------------------------------------------------
  const BLIP_R = 10;
  const MIN_DIST = BLIP_R * 2 + 4;
  const placed = [];

  cfg.entries.forEach((entry, idx) => {
    const quadrantIndex = quadrantMap[entry.quadrant];
    const ringIndex = ringMap[entry.ring.toLowerCase()];

    if (quadrantIndex === undefined || ringIndex === undefined) {
      console.warn(`Skipping entry: ${entry.label} (invalid quadrant or ring)`);
      return;
    }

    const bandWidth = widths[ringIndex];
    const rMin = ringInner(ringIndex) + BLIP_R + 2;
    const rMax = ringOuter[ringIndex] - BLIP_R - 2;
    const ringRadius = (rMin + rMax) / 2;
    const quadrantAngle = quadrantAngles[quadrantIndex];

    // Deterministic position within quadrant and ring (seeded by entry label).
    // The innermost ring spreads blips further from the center so they
    // don't pile up on the axis lines.
    const angleVariation = (seededRandom(entry.label + ":a") - 0.5) * 76; // +/- 38 degrees
    const radialSpread = ringIndex === ringCount - 1 ? 0.9 : 0.6;
    const radiusVariation = (seededRandom(entry.label + ":r") - 0.5) * (rMax - rMin) * radialSpread;

    const angle = (quadrantAngle + angleVariation - 90) * Math.PI / 180;
    const r = Math.max(rMin, Math.min(rMax, ringRadius + radiusVariation));

    placed.push({
      entry, idx, quadrantIndex, ringIndex,
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      rMin, rMax,
      // Allowed angular window (radians, screen coords) inside the quadrant
      aMin: (quadrantAngle - 45 + 6 - 90) * Math.PI / 180,
      aMax: (quadrantAngle + 45 - 6 - 90) * Math.PI / 180
    });
  });

  // Clamp a point back into its polar bounds.
  const clamp = function(p) {
    let r = Math.sqrt(p.x * p.x + p.y * p.y);
    let a = Math.atan2(p.y, p.x);
    // Normalise angle into the same range as aMin/aMax
    while (a < p.aMin - Math.PI) a += 2 * Math.PI;
    while (a > p.aMax + Math.PI) a -= 2 * Math.PI;
    if (a < p.aMin) a = p.aMin;
    if (a > p.aMax) a = p.aMax;
    if (r < p.rMin) r = p.rMin;
    if (r > p.rMax) r = p.rMax;
    p.x = r * Math.cos(a);
    p.y = r * Math.sin(a);
  };

  // Simple pairwise repulsion, a few dozen iterations is plenty for 35 blips.
  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let a = 0; a < placed.length; a++) {
      for (let b = a + 1; b < placed.length; b++) {
        const pa = placed[a], pb = placed[b];
        let dx = pb.x - pa.x, dy = pb.y - pa.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d >= MIN_DIST) continue;
        if (d < 0.01) { dx = 1; dy = 0; d = 1; }
        const push = (MIN_DIST - d) / 2 / d;
        pa.x -= dx * push; pa.y -= dy * push;
        pb.x += dx * push; pb.y += dy * push;
        clamp(pa); clamp(pb);
        moved = true;
      }
    }
    if (!moved) break;
  }

  // ------------------------------------------------------------------
  // Pass 2: draw
  // ------------------------------------------------------------------
  const legend = {};
  placed.forEach(({ entry, idx, quadrantIndex, ringIndex, x, y }) => {
    // Draw blip
    const blip = radar.append("g")
      .attr("transform", `translate(${x},${y})`)
      .attr("class", "blip")
      .attr("tabindex", "0")
      .attr("role", "group")
      .attr("aria-label", `${entry.label} - ${entry.ring} - ${cfg.quadrants[quadrantIndex].name}`);

    blip.append("circle")
      .attr("r", entry.moved > 0 ? 10 : 9)
      .attr("fill", cfg.rings[ringIndex].color)
      .style("opacity", 0.8)
      .style("cursor", "pointer");

    // Triangle for "new" items
    if (entry.moved > 0) {
      blip.append("path")
        .attr("d", "M -4,-6 L 0,-10 L 4,-6 Z")
        .attr("fill", cfg.rings[ringIndex].color);
    }

    // Number label - use white background circle for contrast
    const num = idx + 1;
    // White circle background for text contrast
    blip.append("circle")
      .attr("r", 7)
      .attr("fill", "#fff")
      .style("pointer-events", "none");
    // Black text on white for maximum contrast
    blip.append("text")
      .attr("y", 3)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "#000")
      .style("pointer-events", "none")
      .text(num);

    // Store for legend
    if (!legend[cfg.quadrants[quadrantIndex].name]) {
      legend[cfg.quadrants[quadrantIndex].name] = {};
    }
    if (!legend[cfg.quadrants[quadrantIndex].name][cfg.rings[ringIndex].name]) {
      legend[cfg.quadrants[quadrantIndex].name][cfg.rings[ringIndex].name] = [];
    }
    legend[cfg.quadrants[quadrantIndex].name][cfg.rings[ringIndex].name].push({
      number: num,
      label: entry.label,
      moved: entry.moved
    });

    // Visible hover label (hidden by default)
    const hoverLabel = blip.append("g")
      .attr("class", "hover-label")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // White background for label
    const labelText = entry.label;
    const labelPadding = 8;
    const labelWidth = labelText.length * 7 + labelPadding * 2;

    // White background rect (rendered first, so it's behind text)
    hoverLabel.append("rect")
      .attr("x", -labelWidth / 2)
      .attr("y", 15)
      .attr("width", labelWidth)
      .attr("height", 26)
      .attr("rx", 4)
      .style("fill", "#fff")
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))");

    // Tech name text (rendered second, so it's on top)
    hoverLabel.append("text")
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("fill", "#000")
      .text(labelText);

    // Show/hide label on hover
    blip.on("mouseenter", function() {
      hoverLabel.style("opacity", 1);
    });

    blip.on("mouseleave", function() {
      hoverLabel.style("opacity", 0);
    });

    // Click handler - show description
    blip.on("click", function(event) {
      showTooltip(entry, event);
    });

    blip.on("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showTooltip(entry, event);
      }
    });
  });

  // Build legend
  buildLegend(legend, cfg);
};

function showTooltip(entry, event) {
  // Remove existing tooltip
  d3.select("#radar-tooltip").remove();

  // Visual styling lives in components.css (#radar-tooltip) so it follows
  // the active theme; only the position is set here. Keyboard activation
  // has no pointer coordinates, so anchor to the blip's bounding box.
  let left, top;
  if (event.type === "click" && event.pageX !== undefined) {
    left = event.pageX + 10;
    top = event.pageY + 10;
  } else {
    const box = event.currentTarget.getBoundingClientRect();
    left = box.left + window.scrollX + box.width / 2;
    top = box.bottom + window.scrollY + 8;
  }

  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "radar-tooltip")
    .attr("role", "tooltip")
    .style("left", `${left}px`)
    .style("top", `${top}px`);

  tooltip.append("h4")
    .text(entry.label);

  tooltip.append("p")
    .html(`<strong>Ring:</strong> ${entry.ring.toUpperCase()}`);

  tooltip.append("p")
    .text(entry.description || "No description available");

  // Close on click anywhere
  d3.select("body").on("click.tooltip", function() {
    d3.select("#radar-tooltip").remove();
    d3.select("body").on("click.tooltip", null);
  });

  // Close on Escape key
  d3.select("body").on("keydown.tooltip", function(event) {
    if (event.key === "Escape") {
      d3.select("#radar-tooltip").remove();
      d3.select("body").on("keydown.tooltip", null);
    }
  });
}

function buildLegend(legend, cfg) {
  const legendContainer = d3.select("#radar-legend");
  legendContainer.selectAll("*").remove();

  // Add header with toggle button and action links
  const header = legendContainer.append("div")
    .attr("class", "radar-legend__header");

  header.append("h3")
    .attr("class", "radar-legend__title")
    .text("Technology Index");

  // Action buttons container
  const actions = header.append("div")
    .attr("class", "radar-legend__actions");

  // Download CSV link (subtle)
  actions.append("a")
    .attr("href", "tech-radar.csv")
    .attr("class", "radar-legend__link")
    .attr("title", "Download Tech Radar CSV")
    .html("📊 CSV");

  // Documentation link (subtle)
  actions.append("a")
    .attr("href", "TECH_RADAR.md")
    .attr("class", "radar-legend__link")
    .attr("title", "Read Full Documentation")
    .html("📖 Docs");

  // Below 768px the SVG is hidden (components.css), so the index is the
  // radar: open it by default there. Desktop keeps it collapsed.
  const narrow = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;

  // Toggle button
  const toggleBtn = actions.append("button")
    .attr("class", "radar-legend__toggle")
    .attr("aria-expanded", narrow ? "true" : "false")
    .attr("aria-controls", "radar-legend-content")
    .text(narrow ? "Hide All" : "Show All");

  // Content container (collapsed by default on desktop)
  const content = legendContainer.append("div")
    .attr("id", "radar-legend-content")
    .attr("class", "radar-legend__content")
    .attr("aria-hidden", narrow ? "false" : "true");

  // Toggle functionality
  toggleBtn.on("click", function() {
    const isExpanded = toggleBtn.attr("aria-expanded") === "true";
    toggleBtn
      .attr("aria-expanded", !isExpanded)
      .text(isExpanded ? "Show All" : "Hide All");
    content
      .attr("aria-hidden", isExpanded);
  });

  // Ring order for sorting: innermost (adopt) first
  const ringOrder = {};
  cfg.rings.slice().reverse().forEach((r, idx) => { ringOrder[r.name.toLowerCase()] = idx; });

  Object.keys(legend).forEach(quadrant => {
    const section = content.append("div")
      .attr("class", "legend-quadrant");

    section.append("h3")
      .text(quadrant.replace('-', ' & ').toUpperCase());

    // Flatten rings into one list per quadrant, ring shown as a tag
    const items = [];
    Object.keys(legend[quadrant]).forEach(ring => {
      legend[quadrant][ring].forEach(item => items.push({ ...item, ring: ring }));
    });
    items.sort((a, b) =>
      (ringOrder[a.ring.toLowerCase()] - ringOrder[b.ring.toLowerCase()]) || (a.number - b.number)
    );

    const list = section.append("ul")
      .attr("class", "legend-list");

    items.forEach(item => {
      const li = list.append("li");

      li.append("span")
        .attr("class", "legend-number")
        .text(item.number + ".");

      li.append("span")
        .attr("class", "legend-label")
        .text(item.label);

      li.append("span")
        .attr("class", "ring-tag ring-tag--" + item.ring.toLowerCase())
        .text(item.ring.toUpperCase());

      if (item.moved > 0) {
        li.append("span")
          .attr("class", "legend-new")
          .text("\u25b2 NEW");
      }
    });
  });
}
