// Grimoire hero. Regenerating overwrites public/images/grimoire-hero.svg.
//
// Relationship, borrowed from "Circle, square, line": the open book's width
// is the circle's diameter. The circle rises from the spine and is tangent to
// the pages there; each page-edge, extended, is tangent to the circle again.
// Inside that circle, one center carries a square, a triangle, and an inner circle.
//
// Run: node public/images/grimoire-hero.mjs

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dimension, hatch, roleCss } from "file:///C:/Users/chris/.cursor/skills/plotter/assets/foundation/index.mjs";

const canvas = { w: 560, h: 440 };
const u = 25;
const cx = 280;
const cy = 170;
const R = 4 * u;
const bookH = R;
const spineW = 16;
const pageInset = 8;
const gutter = 4;
const witness = 5;
const axisOvershoot = 18;
const glyphOrbit = R + 20;
const elementSide = 14;
const elementOrbit = 82;
const sealR = 46;
const knotAngle = 90;
const knotSpread = 7;
const accent = "oklch(0.405 0.135 14.765)";

const bookLeft = cx - R;
const bookRight = cx + R;
const bookTop = cy + R;
const bookBottom = bookTop + bookH;
const spineLeft = cx - spineW / 2;
const spineRight = cx + spineW / 2;
const squareHalf = R / Math.SQRT2;
const triangleR = squareHalf;
const innerR = triangleR / 2;

const root = dirname(fileURLToPath(import.meta.url));

function n(value) {
  const rounded = Math.round((value + Number.EPSILON) * 1000) / 1000;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function pt(x, y) {
  return `${n(x)} ${n(y)}`;
}

function polar(radius, degrees) {
  const t = (degrees * Math.PI) / 180;
  return [cx + radius * Math.cos(t), cy - radius * Math.sin(t)];
}

function line(x1, y1, x2, y2) {
  return `M ${pt(x1, y1)} L ${pt(x2, y2)}`;
}

function hSpans(x0, x1, gaps) {
  let spans = [[Math.min(x0, x1), Math.max(x0, x1)]];
  for (const [a, b] of gaps) {
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    spans = spans.flatMap(([s, e]) => {
      if (high <= s || low >= e) return [[s, e]];
      const next = [];
      if (low > s) next.push([s, Math.min(low, e)]);
      if (high < e) next.push([Math.max(high, s), e]);
      return next;
    });
  }
  return spans.filter(([s, e]) => e - s > 0.5);
}

function hPath(y, x0, x1, gaps) {
  return hSpans(x0, x1, gaps)
    .map(([s, e]) => line(s, y, e, y))
    .join(" ");
}

function vPath(x, y0, y1, gaps) {
  return hSpans(y0, y1, gaps)
    .map(([s, e]) => line(x, s, x, e))
    .join(" ");
}

function arcMidpoint(center, radius, from, to, large, sweep) {
  const a0 = Math.atan2(from[1] - center[1], from[0] - center[0]);
  const a1 = Math.atan2(to[1] - center[1], to[0] - center[0]);
  let delta = a1 - a0;
  if (sweep === 1) {
    while (delta <= 1e-9) delta += Math.PI * 2;
  } else {
    while (delta >= -1e-9) delta -= Math.PI * 2;
  }
  const isLarge = Math.abs(delta) > Math.PI + 1e-6;
  if (isLarge !== large) return null;
  const mid = a0 + delta / 2;
  return [center[0] + radius * Math.cos(mid), center[1] + radius * Math.sin(mid)];
}

function arcTo(center, radius, from, to, aim) {
  let best = null;
  for (const large of [false, true]) {
    for (const sweep of [0, 1]) {
      const mid = arcMidpoint(center, radius, from, to, large, sweep);
      if (!mid) continue;
      const score = Math.hypot(mid[0] - aim[0], mid[1] - aim[1]);
      if (!best || score < best.score) best = { large, sweep, score };
    }
  }
  if (!best || best.score > radius) {
    throw new Error(`No arc toward ${aim.join(",")}`);
  }
  return `A ${n(radius)} ${n(radius)} 0 ${best.large ? 1 : 0} ${best.sweep} ${pt(to[0], to[1])}`;
}

function circleThrough(a, b, c) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const [x3, y3] = c;
  const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  if (Math.abs(d) < 1e-6) throw new Error("Knot points are collinear");
  const x =
    ((x1 * x1 + y1 * y1) * (y2 - y3) +
      (x2 * x2 + y2 * y2) * (y3 - y1) +
      (x3 * x3 + y3 * y3) * (y1 - y2)) /
    d;
  const y =
    ((x1 * x1 + y1 * y1) * (x3 - x2) +
      (x2 * x2 + y2 * y2) * (x1 - x3) +
      (x3 * x3 + y3 * y3) * (x2 - x1)) /
    d;
  return { x, y, r: Math.hypot(x - x1, y - y1) };
}

function intersections(c0, r0, c1, r1) {
  const dx = c1[0] - c0[0];
  const dy = c1[1] - c0[1];
  const d = Math.hypot(dx, dy);
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h2 = r0 * r0 - a * a;
  if (h2 < 0) throw new Error("Circles do not meet");
  const h = Math.sqrt(Math.max(0, h2));
  const xm = c0[0] + (a * dx) / d;
  const ym = c0[1] + (a * dy) / d;
  const rx = (-dy * h) / d;
  const ry = (dx * h) / d;
  return [
    [xm + rx, ym + ry],
    [xm - rx, ym - ry],
  ];
}

function pathEl(d) {
  return `<path d="${d}"/>`;
}

function crescent(body, cutter) {
  const [p, q] = intersections([body[0], body[1]], body[2], [cutter[0], cutter[1]], cutter[2]);
  const outerAim = [2 * body[0] - cutter[0], 2 * body[1] - cutter[1]];
  const innerAim = [(body[0] + cutter[0]) / 2, (body[1] + cutter[1]) / 2];
  return pathEl(
    [
      `M ${pt(p[0], p[1])}`,
      arcTo([body[0], body[1]], body[2], p, q, outerAim),
      arcTo([cutter[0], cutter[1]], cutter[2], q, p, innerAim),
      "Z",
    ].join(" "),
  );
}

function elementMark(pointUp, barred) {
  const height = (elementSide * Math.sqrt(3)) / 2;
  const apexY = pointUp ? -((2 * height) / 3) : (2 * height) / 3;
  const baseY = pointUp ? height / 3 : -height / 3;
  const d = [`M ${pt(0, apexY)} L ${pt(-elementSide / 2, baseY)} L ${pt(elementSide / 2, baseY)} Z`];
  if (barred) {
    const y = (apexY + baseY) / 2;
    const t = (y - apexY) / (baseY - apexY);
    const half = (elementSide / 2) * t;
    d.push(line(-half, y, half, y));
  }
  return d.join(" ");
}

function elementBox(pointUp) {
  const height = (elementSide * Math.sqrt(3)) / 2;
  const apex = (2 * height) / 3;
  const base = height / 3;
  return {
    halfX: elementSide / 2 + 3,
    up: (pointUp ? apex : base) + 3,
    down: (pointUp ? base : apex) + 3,
  };
}

function starPoints(sides, step, radius) {
  const points = Array.from({ length: sides }, (_, i) => polar(radius, 90 - i * (360 / sides)));
  const order = [];
  for (let i = 0, k = 0; k < sides; k += 1) {
    order.push(points[i]);
    i = (i + step) % sides;
  }
  return `M ${order.map((p) => pt(p[0], p[1])).join(" L ")} Z`;
}

function inscribedSquare() {
  const a = squareHalf;
  return `M ${pt(cx - a, cy - a)} H ${n(cx + a)} V ${n(cy + a)} H ${n(cx - a)} Z`;
}

function nestedTriangle() {
  const vertices = [90, 210, 330].map((angle) => polar(triangleR, angle));
  return `M ${vertices.map((p) => pt(p[0], p[1])).join(" L ")} Z`;
}

const knotLeft = polar(R, knotAngle + knotSpread);
const knotRight = polar(R, knotAngle - knotSpread);
const knotCrown = polar(R + 14, knotAngle);
const knotThroat = polar(R + 4, knotAngle);
const knotOuter = circleThrough(knotLeft, knotCrown, knotRight);
const knotInner = circleThrough(knotLeft, knotThroat, knotRight);
const risingCircle = [
  `M ${pt(knotRight[0], knotRight[1])}`,
  arcTo([cx, cy], R, knotRight, knotLeft, [cx, bookTop]),
].join(" ");
const ouroborosKnot = [
  `M ${pt(knotLeft[0], knotLeft[1])}`,
  arcTo([knotOuter.x, knotOuter.y], knotOuter.r, knotLeft, knotRight, knotCrown),
  arcTo([knotInner.x, knotInner.y], knotInner.r, knotRight, knotLeft, knotThroat),
  "Z",
].join(" ");

const pitchDx = Math.sqrt(glyphOrbit * glyphOrbit - R * R);
const pitchRight = (Math.atan2(R, pitchDx) * 180) / Math.PI;
const pitchLeft = 180 + pitchRight;
const glyphAngles = { sol: 45, luna: 135, saturn: 225, mercury: 315 };
const glyphGap = 13;

function pitchSegments() {
  // The pitch stays above the book. Glyphs and the knot open gaps in that arc.
  const start = pitchLeft;
  const end = -pitchRight;
  const blocks = [
    [225, glyphGap],
    [135, glyphGap],
    [90, knotSpread + 4],
    [45, glyphGap],
    [-45, glyphGap],
  ]
    .map(([angle, gap]) => [Math.min(start, angle + gap), Math.max(end, angle - gap)])
    .filter(([high, low]) => high - low > 0.5)
    .sort((a, b) => b[0] - a[0]);
  const segments = [];
  let cursor = start;
  for (const [high, low] of blocks) {
    if (cursor - high > 8) segments.push([cursor, high]);
    cursor = Math.min(cursor, low);
  }
  if (cursor - end > 8) segments.push([cursor, end]);
  return segments;
}

const pitch = pitchSegments();

function pitchPath() {
  return pitch
    .map(([from, to]) => {
      const start = polar(glyphOrbit, from);
      const end = polar(glyphOrbit, to);
      const midAngle = (from + to) / 2;
      return `M ${pt(start[0], start[1])} ${arcTo([cx, cy], glyphOrbit, start, end, polar(glyphOrbit, midAngle))}`;
    })
    .join(" ");
}

const sol = `<circle cx="0" cy="0" r="5.2"/><circle cx="0" cy="0" r="0.55"/>`;
const luna = crescent([-1.1, 0, 6.2], [2.15, 0, 5.35]);
function arcBetween(from, to, radius, aim) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.hypot(dx, dy);
  const lift = Math.sqrt(Math.max(0, radius * radius - (dist / 2) ** 2));
  const normal = [-dy / dist, dx / dist];
  let best = null;
  for (const sign of [1, -1]) {
    const center = [mid[0] + normal[0] * lift * sign, mid[1] + normal[1] * lift * sign];
    for (const sweep of [0, 1]) {
      const point = arcMidpoint(center, radius, from, to, false, sweep);
      if (!point) continue;
      const score = Math.hypot(point[0] - aim[0], point[1] - aim[1]);
      if (!best || score < best.score) best = { score, sweep };
    }
  }
  if (!best) throw new Error("No minor arc");
  return `A ${n(radius)} ${n(radius)} 0 0 ${best.sweep} ${pt(to[0], to[1])}`;
}

const mercuryHorns = [
  [-3.2, -7.2],
  [3.2, -7.2],
];
const mercury = [
  pathEl(
    [
      `M ${pt(mercuryHorns[0][0], mercuryHorns[0][1])}`,
      arcBetween(mercuryHorns[0], mercuryHorns[1], 4.2, [0, -3.6]),
      arcBetween(mercuryHorns[1], mercuryHorns[0], 8.5, [0, -5.8]),
      "Z",
    ].join(" "),
  ),
  `<circle cx="0" cy="0.2" r="3.15"/>`,
  pathEl(line(0, 3.35, 0, 8.4)),
  pathEl(line(-3.2, 6.1, 3.2, 6.1)),
].join("");
const saturn = [
  pathEl(line(-3.6, -5.2, 3.6, -5.2)),
  pathEl(line(0, -8.4, 0, -1.2)),
  pathEl(`M ${pt(0, -1.2)} A 4.6 4.6 0 0 1 ${pt(0, 8)}`),
].join("");

const glyphs = {
  sol,
  luna,
  mercury,
  saturn,
};

const fireBox = elementBox(true);
const waterBox = elementBox(false);
const radiusGaps = {
  north: [cy - elementOrbit - fireBox.up, cy - elementOrbit + fireBox.down],
  south: [cy + elementOrbit - waterBox.up, cy + elementOrbit + waterBox.down],
  west: [cx - elementOrbit - fireBox.halfX, cx - elementOrbit + fireBox.halfX],
  east: [cx + elementOrbit - fireBox.halfX, cx + elementOrbit + fireBox.halfX],
};

const radiusMeasure = dimension({
  axis: "x",
  witnesses: [
    [cx, bookBottom],
    [bookRight, bookBottom],
  ],
  position: bookBottom + 22,
  extensions: { gap: 8, overshoot: 8 },
  label: {
    text: "r = 4u",
    anchor: [cx + R / 2, bookBottom + 26],
    clearance: { x: cx + R / 2 - 24, y: bookBottom + 14, width: 48, height: 18 },
  },
});

const spineHatch = hatch({
  region: {
    kind: "rect",
    x: spineLeft,
    y: bookTop + witness + 4,
    width: spineW,
    height: bookH - witness - 12,
  },
  pattern: "H1",
});

function assertClear(name, value, minimum) {
  if (!(value >= minimum)) {
    throw new Error(`${name} clearance ${n(value)} is under ${minimum}`);
  }
}

function reviewClearances() {
  for (const [name, angle] of Object.entries(glyphAngles)) {
    const [x, y] = polar(glyphOrbit, angle);
    const bound = name === "sol" || name === "luna" ? 7 : 10;
    assertClear(`${name} above the book`, bookTop - (y + bound), 4);
    assertClear(`${name} outside the circle`, glyphOrbit - bound - R, 4);
  }
  assertClear("fire inside the circle", R - (elementOrbit + fireBox.up - 3), 4);
  assertClear("water above the witness", bookTop - witness - (cy + elementOrbit + waterBox.down - 3), 3);
  assertClear("knot above fire", cy - elementOrbit - (fireBox.up - 3) - knotLeft[1], 3);
  assertClear("knot inside the pitch", glyphOrbit - (R + 14), 4);
  if (bookBottom + axisOvershoot > canvas.h - 8) throw new Error("Axis overshoots the sheet");
  if (cy - R - axisOvershoot < 8) throw new Error("Axis overshoots the sheet");
}

reviewClearances();

function glyphGroup(id, angle) {
  const [x, y] = polar(glyphOrbit, angle);
  return `    <g id="${id}" data-plotter-role="primary" transform="translate(${n(x)} ${n(y)})">
      ${glyphs[id.replace("glyph-", "")]}
    </g>`;
}

function elementGroup(id, angle, mark) {
  const [x, y] = polar(elementOrbit, angle);
  return `    <g id="${id}" transform="translate(${n(x)} ${n(y)})">
      <path d="${mark}"/>
    </g>`;
}

const pageLeft = {
  x: bookLeft + pageInset,
  y: bookTop + pageInset,
  w: spineLeft - gutter - (bookLeft + pageInset),
  h: bookH - pageInset * 2,
};
const pageRight = {
  x: spineRight + gutter,
  y: bookTop + pageInset,
  w: bookRight - pageInset - (spineRight + gutter),
  h: bookH - pageInset * 2,
};

const bookOutline = [
  `M ${pt(bookLeft, bookTop)} H ${n(cx)}`,
  `M ${pt(cx + witness, bookTop)} H ${n(bookRight)} V ${n(bookBottom)} H ${n(bookLeft)} V ${n(bookTop)}`,
].join(" ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="440" viewBox="0 0 560 440" data-plotter="" data-plotter-unit="${u}" data-center="${cx} ${cy}" data-radius="${R}" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" role="img" aria-labelledby="title desc" style="color:#171717;font-family:Cal Sans, sans-serif;font-optical-sizing:auto;font-synthesis:none;font-variation-settings:'GEOM' 25;font-weight:400;--plotter-aura:${accent}">
  <title id="title">Squared circle on an open grimoire</title>
  <desc id="desc">An open book of two square pages is the base. A circle rises from the spine, tangent to the pages, and its diameter equals the book’s width. The same center holds a square, a triangle, and an inner circle. Elemental triangles stand at the cardinal points, and Sol, Luna, Saturn, and Mercury sit on the outer pitch.</desc>
  <style data-plotter-styles="true">${roleCss}</style>
  <g id="seal" data-plotter-role="guide">
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(sealR)}"/>
    <path d="${starPoints(5, 2, sealR)}"/>
  </g>
  <g id="book">
    <path id="book-outline" data-plotter-role="primary" d="${bookOutline}"/>
    <g id="page-left" data-plotter-role="secondary">
      <rect x="${n(pageLeft.x)}" y="${n(pageLeft.y)}" width="${n(pageLeft.w)}" height="${n(pageLeft.h)}"/>
    </g>
    <g id="page-right" data-plotter-role="secondary">
      <rect x="${n(pageRight.x)}" y="${n(pageRight.y)}" width="${n(pageRight.w)}" height="${n(pageRight.h)}"/>
    </g>
    <g id="spine">
      <path id="spine-edges" data-plotter-role="primary" d="${line(spineLeft, bookTop, spineLeft, bookBottom)} ${line(spineRight, bookTop, spineRight, bookBottom)}"/>
      <path id="spine-hatch" data-plotter-role="hatch" d="${spineHatch.d}"/>
    </g>
  </g>
  <g id="circle-rising" data-plotter-role="primary">
    <path id="rising-circle" d="${risingCircle}"/>
  </g>
  <g id="ouroboros" data-plotter-role="primary">
    <path id="ouroboros-knot" d="${ouroborosKnot}"/>
  </g>
  <g id="square-nested" data-plotter-role="primary">
    <path d="${inscribedSquare()}"/>
  </g>
  <g id="triangle-nested" data-plotter-role="primary">
    <path d="${nestedTriangle()}"/>
  </g>
  <g id="circle-inner" data-plotter-role="primary">
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(innerR)}"/>
  </g>
  <g id="elements" data-plotter-role="primary">
${elementGroup("element-fire", 90, elementMark(true, false))}
${elementGroup("element-air", 0, elementMark(true, true))}
${elementGroup("element-water", 270, elementMark(false, false))}
${elementGroup("element-earth", 180, elementMark(false, true))}
  </g>
  <g id="ring-planets">
    <path id="pitch-ring" data-plotter-role="secondary" d="${pitchPath()}"/>
${Object.entries(glyphAngles)
  .map(([name, angle]) => glyphGroup(`glyph-${name}`, angle))
  .join("\n")}
  </g>
  <g id="construction">
    <path id="axis" data-plotter-role="centerline" d="${[
      vPath(cx, cy - R - axisOvershoot, cy - 4, [
        radiusGaps.north,
        [knotCrown[1] - 3, Math.max(knotLeft[1], knotRight[1]) + 3],
      ]),
      vPath(cx, bookTop + witness + 2, bookBottom, []),
      hPath(cy, bookLeft + 4, cx - 4, [radiusGaps.west]),
    ].join(" ")}"/>
    <path id="radius-spine" data-plotter-role="secondary" d="${vPath(cx, cy + 4, bookTop - witness, [radiusGaps.south])}"/>
    <path id="radius-page" data-plotter-role="secondary" d="${hPath(cy, cx + 4, bookRight - 4, [radiusGaps.east])}"/>
    <path id="page-tangents" data-plotter-role="guide" d="${line(bookLeft, cy + 4, bookLeft, bookTop)} ${line(bookRight, cy + 4, bookRight, bookTop)}"/>
    <path id="tangency" data-plotter-role="primary" d="M ${pt(cx, bookTop - witness)} V ${n(bookTop)} H ${n(cx + witness)} V ${n(bookTop - witness)} Z"/>
    <g id="nodes" data-plotter-role="primary">
      <circle cx="${n(cx)}" cy="${n(cy)}" r="2.4"/>
      <circle cx="${n(bookLeft)}" cy="${n(cy)}" r="2"/>
      <circle cx="${n(bookRight)}" cy="${n(cy)}" r="2"/>
    </g>
  </g>
  <g id="dimension-radius" data-plotter-role="dimension">
    <path d="${radiusMeasure.witnessD}"/>
    <path d="${radiusMeasure.lineD}"/>
    <path d="${radiusMeasure.slashD}"/>
  </g>
  <g id="dimension-label" fill="currentColor" stroke="none" opacity="0.5" font-size="10" font-weight="400">
    <text text-anchor="middle" x="${n(radiusMeasure.label.anchor[0])}" y="${n(radiusMeasure.label.anchor[1])}">${radiusMeasure.label.text}</text>
  </g>
  <g id="aura" style="opacity:0;stroke:var(--plotter-aura, currentColor)">
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R + 8)}"/>
  </g>
</svg>
`;

const source = join(root, "grimoire-hero.svg");
writeFileSync(source, svg);
console.log(`Wrote ${source}`);
console.log(
  JSON.stringify(
    {
      center: [cx, cy],
      radius: R,
      unit: u,
      book: [bookLeft, bookTop, bookRight - bookLeft, bookH],
      knot: { angle: knotAngle, crown: knotCrown.map((value) => Math.round(value * 10) / 10) },
      pitchSegments: pitch,
    },
    null,
    2,
  ),
);
