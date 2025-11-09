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

  // Draw grid circles (rings)
  const ringWidth = radius / cfg.rings.length;
  cfg.rings.forEach((ring, i) => {
    radar.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius - (i * ringWidth))
      .style("fill", "none")
      .style("stroke", cfg.colors.grid)
      .style("stroke-width", 1);

    // Ring labels
    radar.append("text")
      .attr("y", -radius + (i * ringWidth) + ringWidth / 2)
      .attr("text-anchor", "middle")
      .style("fill", ring.color)
      .style("font-weight", "bold")
      .style("font-size", "12px")
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

  // Quadrant labels
  const quadrantAngles = [45, 135, 225, 315]; // degrees
  cfg.quadrants.forEach((quadrant, i) => {
    const angle = (quadrantAngles[i] - 90) * Math.PI / 180;
    const labelRadius = radius + 30;
    const x = labelRadius * Math.cos(angle);
    const y = labelRadius * Math.sin(angle);

    radar.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .style("fill", "#000")  // Black for maximum contrast
      .text(quadrant.name.replace('-', ' & ').toUpperCase());
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

  // Plot entries (blips)
  const legend = {};
  cfg.entries.forEach((entry, idx) => {
    const quadrantIndex = quadrantMap[entry.quadrant];
    const ringIndex = ringMap[entry.ring.toLowerCase()];

    if (quadrantIndex === undefined || ringIndex === undefined) {
      console.warn(`Skipping entry: ${entry.label} (invalid quadrant or ring)`);
      return;
    }

    // Calculate position
    const ringRadius = radius - (ringIndex * ringWidth) - ringWidth / 2;
    const quadrantAngle = quadrantAngles[quadrantIndex];

    // Random position within quadrant and ring
    const angleVariation = (Math.random() - 0.5) * 80; // +/- 40 degrees
    const radiusVariation = (Math.random() - 0.5) * ringWidth * 0.6;

    const angle = (quadrantAngle + angleVariation - 90) * Math.PI / 180;
    const r = ringRadius + radiusVariation;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);

    // Draw blip
    const blip = radar.append("g")
      .attr("transform", `translate(${x},${y})`)
      .attr("class", "blip")
      .attr("tabindex", "0")
      .attr("role", "group")
      .attr("aria-label", `${entry.label} - ${entry.ring} - ${cfg.quadrants[quadrantIndex].name}`);

    blip.append("circle")
      .attr("r", entry.moved > 0 ? 8 : 6)
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

    // Tooltip/hover
    blip.append("title").text(entry.label);

    // Click handler - show description
    blip.on("click", function() {
      showTooltip(entry, d3.event);
    });

    blip.on("keydown", function() {
      if (d3.event.key === "Enter" || d3.event.key === " ") {
        d3.event.preventDefault();
        showTooltip(entry, d3.event);
      }
    });
  });

  // Build legend
  buildLegend(legend, cfg);
};

function showTooltip(entry, event) {
  // Remove existing tooltip
  d3.select("#radar-tooltip").remove();

  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "radar-tooltip")
    .attr("role", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "2px solid #0066cc")
    .style("border-radius", "8px")
    .style("padding", "1rem")
    .style("max-width", "300px")
    .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
    .style("z-index", "1000")
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY + 10}px`);

  tooltip.append("h4")
    .style("margin", "0 0 0.5rem 0")
    .style("color", "#0066cc")
    .text(entry.label);

  tooltip.append("p")
    .style("margin", "0 0 0.5rem 0")
    .html(`<strong>Level:</strong> ${entry.ring.toUpperCase()}`);

  tooltip.append("p")
    .style("margin", "0")
    .style("font-size", "0.9rem")
    .style("color", "#666")
    .text(entry.description || "No description available");

  // Close on click anywhere
  d3.select("body").on("click.tooltip", function() {
    d3.select("#radar-tooltip").remove();
    d3.select("body").on("click.tooltip", null);
  });

  // Close on Escape key
  d3.select("body").on("keydown.tooltip", function() {
    if (d3.event.key === "Escape") {
      d3.select("#radar-tooltip").remove();
      d3.select("body").on("keydown.tooltip", null);
    }
  });
}

function buildLegend(legend, cfg) {
  const legendContainer = d3.select("#radar-legend");
  legendContainer.selectAll("*").remove();

  // Add header with toggle button
  const header = legendContainer.append("div")
    .attr("class", "radar-legend__header");

  header.append("h3")
    .attr("class", "radar-legend__title")
    .text("Technology Index");

  const toggleBtn = header.append("button")
    .attr("class", "radar-legend__toggle")
    .attr("aria-expanded", "false")
    .attr("aria-controls", "radar-legend-content")
    .text("Show All");

  // Content container (collapsed by default)
  const content = legendContainer.append("div")
    .attr("id", "radar-legend-content")
    .attr("class", "radar-legend__content")
    .attr("aria-hidden", "true");

  // Toggle functionality
  toggleBtn.on("click", function() {
    const isExpanded = toggleBtn.attr("aria-expanded") === "true";
    toggleBtn
      .attr("aria-expanded", !isExpanded)
      .text(isExpanded ? "Show All" : "Hide All");
    content
      .attr("aria-hidden", isExpanded);
  });

  Object.keys(legend).forEach(quadrant => {
    const section = content.append("div")
      .attr("class", "legend-quadrant")
      .style("margin-bottom", "2rem");

    section.append("h3")
      .style("margin-bottom", "1rem")
      .text(quadrant.replace('-', ' & ').toUpperCase());

    Object.keys(legend[quadrant]).forEach(ring => {
      const ringSection = section.append("div")
        .style("margin-bottom", "1rem");

      ringSection.append("h4")
        .style("font-size", "1rem")
        .style("margin-bottom", "0.5rem")
        .text(ring.toUpperCase());

      const list = ringSection.append("ul")
        .style("list-style", "none")
        .style("padding", "0")
        .style("margin", "0");

      legend[quadrant][ring].forEach(item => {
        const li = list.append("li")
          .style("margin-bottom", "0.25rem")
          .style("font-size", "0.9rem");

        li.append("span")
          .attr("class", "legend-number")
          .style("display", "inline-block")
          .style("width", "30px")
          .style("font-weight", "bold")
          .text(item.number + ".");

        li.append("span")
          .text(item.label);

        if (item.moved > 0) {
          li.append("span")
            .style("margin-left", "0.5rem")
            .style("color", "var(--radar-new)")
            .style("font-weight", "bold")
            .text("▲ NEW");
        }
      });
    });
  });
}
