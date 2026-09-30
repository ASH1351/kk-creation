const fs = require('fs');
const path = require('path');

function generateWreathSVG() {
  const leafPaths = [];
  const flowerPaths = [];
  const sprigPaths = [];

  // Function to create a realistic curved leaf with center vein
  function createLeaf(bx, by, angle, length, width) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tx = bx + cos * length;
    const ty = by + sin * length;
    const mx = (bx + tx) / 2;
    const my = (by + ty) / 2;
    const nx = -sin * width;
    const ny = cos * width;

    const p1x = (mx + nx).toFixed(1);
    const p1y = (my + ny).toFixed(1);
    const p2x = (mx - nx * 0.4).toFixed(1);
    const p2y = (my - ny * 0.4).toFixed(1);
    const tipX = tx.toFixed(1);
    const tipY = ty.toFixed(1);
    const baseX = bx.toFixed(1);
    const baseY = by.toFixed(1);

    // Leaf outline + center vein
    return `M ${baseX} ${baseY} Q ${p1x} ${p1y} ${tipX} ${tipY} Q ${p2x} ${p2y} ${baseX} ${baseY} M ${baseX} ${baseY} L ${(bx + (tx - bx)*0.85).toFixed(1)} ${(by + (ty - by)*0.85).toFixed(1)}`;
  }

  // Function to create a 5-petal flower blossom cluster
  function createBloom(cx, cy, scale) {
    const petals = [];
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = (cx + Math.cos(a) * 7.5 * scale).toFixed(1);
      const py = (cy + Math.sin(a) * 7.5 * scale).toFixed(1);
      const c1x = (cx + Math.cos(a - 0.4) * 10 * scale).toFixed(1);
      const c1y = (cy + Math.sin(a - 0.4) * 10 * scale).toFixed(1);
      const c2x = (cx + Math.cos(a + 0.4) * 10 * scale).toFixed(1);
      const c2y = (cy + Math.sin(a + 0.4) * 10 * scale).toFixed(1);
      petals.push(`M ${cx.toFixed(1)} ${cy.toFixed(1)} Q ${c1x} ${c1y} ${px} ${py} Q ${c2x} ${c2y} ${cx.toFixed(1)} ${cy.toFixed(1)}`);
    }
    // Tiny center pistil
    petals.push(`M ${(cx - 1.2).toFixed(1)} ${cy.toFixed(1)} A 1.2 1.2 0 1 0 ${(cx + 1.2).toFixed(1)} ${cy.toFixed(1)} A 1.2 1.2 0 1 0 ${(cx - 1.2).toFixed(1)} ${cy.toFixed(1)}`);
    return petals.join(' ');
  }

  function createSprig(bx, by, angle) {
    const f1x = bx + Math.cos(angle) * 22;
    const f1y = by + Math.sin(angle) * 22;
    const f2x = bx + Math.cos(angle - 0.45) * 16;
    const f2y = by + Math.sin(angle - 0.45) * 16;
    const f3x = bx + Math.cos(angle + 0.45) * 17;
    const f3y = by + Math.sin(angle + 0.45) * 17;

    sprigPaths.push(`M ${bx.toFixed(1)} ${by.toFixed(1)} Q ${((bx+f1x)/2 + 2).toFixed(1)} ${((by+f1y)/2).toFixed(1)} ${f1x.toFixed(1)} ${f1y.toFixed(1)}`);
    sprigPaths.push(`M ${bx.toFixed(1)} ${by.toFixed(1)} L ${f2x.toFixed(1)} ${f2y.toFixed(1)}`);
    sprigPaths.push(`M ${bx.toFixed(1)} ${by.toFixed(1)} L ${f3x.toFixed(1)} ${f3y.toFixed(1)}`);

    flowerPaths.push(createBloom(f1x, f1y, 1.1));
    flowerPaths.push(createBloom(f2x, f2y, 0.75));
    flowerPaths.push(createBloom(f3x, f3y, 0.8));
  }

  // Top arch bezier: from (46, 212) up to (250, 45) down to (454, 212)
  const topMain = "M 46 210 C 48 110, 130 46, 250 46 C 370 46, 452 110, 454 210";
  // Bottom arch bezier: from (46, 298) down to (250, 464) up to (454, 298)
  const btmMain = "M 46 300 C 48 400, 130 464, 250 464 C 370 464, 452 400, 454 300";

  // Evaluate points along top arch
  const topPoints = [];
  for (let t = 0.05; t <= 0.95; t += 0.042) {
    const u = 1 - t;
    const p0 = {x: 46, y: 210}, p1 = {x: 130, y: 46}, p2 = {x: 370, y: 46}, p3 = {x: 454, y: 210};
    const x = u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x;
    const y = u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y;
    const dx = 3*u*u*(p1.x - p0.x) + 6*u*t*(p2.x - p1.x) + 3*t*t*(p3.x - p2.x);
    const dy = 3*u*u*(p1.y - p0.y) + 6*u*t*(p2.y - p1.y) + 3*t*t*(p3.y - p2.y);
    const tangent = Math.atan2(dy, dx);
    topPoints.push({ x, y, tangent, t });
  }

  topPoints.forEach(({ x, y, tangent, t }) => {
    const normal = tangent + Math.PI / 2;
    // Outward pointing leaf
    leafPaths.push(createLeaf(x, y, normal - 0.35, 27, 8.5));
    // Inward pointing leaf
    leafPaths.push(createLeaf(x, y, normal - Math.PI + 0.35, 23, 7.5));

    // Flower clusters at rhythmic intervals
    if (Math.abs(t - 0.23) < 0.02 || Math.abs(t - 0.5) < 0.02 || Math.abs(t - 0.77) < 0.02) {
      createSprig(x, y, normal - 0.15);
    }
  });

  // Evaluate points along bottom arch
  const btmPoints = [];
  for (let t = 0.05; t <= 0.95; t += 0.042) {
    const u = 1 - t;
    const p0 = {x: 46, y: 300}, p1 = {x: 130, y: 464}, p2 = {x: 370, y: 464}, p3 = {x: 454, y: 300};
    const x = u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x;
    const y = u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y;
    const dx = 3*u*u*(p1.x - p0.x) + 6*u*t*(p2.x - p1.x) + 3*t*t*(p3.x - p2.x);
    const dy = 3*u*u*(p1.y - p0.y) + 6*u*t*(p2.y - p1.y) + 3*t*t*(p3.y - p2.y);
    const tangent = Math.atan2(dy, dx);
    btmPoints.push({ x, y, tangent, t });
  }

  btmPoints.forEach(({ x, y, tangent, t }) => {
    const normal = tangent - Math.PI / 2;
    leafPaths.push(createLeaf(x, y, normal + 0.35, 27, 8.5));
    leafPaths.push(createLeaf(x, y, normal + Math.PI - 0.35, 23, 7.5));

    if (Math.abs(t - 0.23) < 0.02 || Math.abs(t - 0.5) < 0.02 || Math.abs(t - 0.77) < 0.02) {
      createSprig(x, y, normal + 0.15);
    }
  });

  const upperLine = "M 42 216 L 458 216";
  const lowerLine = "M 42 294 L 458 294";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" class="kk-wreath-vector">
  <defs>
    <style>
      .kk-stem { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
      .kk-leaf { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
      .kk-flower { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .kk-bar { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
      .kk-title { font-family: 'Cormorant Garamond', Georgia, serif; fill: currentColor; font-weight: 700; letter-spacing: 0.14em; }
      .kk-subtitle { font-family: 'Cormorant Garamond', Georgia, serif; fill: currentColor; font-style: italic; font-weight: 500; letter-spacing: 0.08em; }
    </style>
  </defs>

  <!-- Circular Main Stems -->
  <g class="wreath-stems">
    <path class="kk-stem stem-top" d="${topMain}" />
    <path class="kk-stem stem-bottom" d="${btmMain}" />
    <path class="kk-stem sprigs" d="${sprigPaths.join(' ')}" />
  </g>

  <!-- Foliage Leaves -->
  <g class="wreath-leaves">
    <path class="kk-leaf" d="${leafPaths.join(' ')}" />
  </g>

  <!-- Flower Petals & Centers -->
  <g class="wreath-flowers">
    <path class="kk-flower" d="${flowerPaths.join(' ')}" />
  </g>

  <!-- Horizontal Dividing Lines -->
  <g class="wreath-bars">
    <path class="kk-bar bar-top" d="${upperLine}" />
    <path class="kk-bar bar-bottom" d="${lowerLine}" />
  </g>

  <!-- Brand Typography -->
  <g class="wreath-brand-text">
    <text class="kk-title" x="250" y="258" text-anchor="middle" font-size="37">KK CREATIONS</text>
    <text class="kk-subtitle" x="250" y="284" text-anchor="middle" font-size="24">Elegant Designs</text>
  </g>
</svg>`;
}

const svg = generateWreathSVG();
const outPath = path.join(__dirname, '../assets/images/wreath-logo.svg');
fs.writeFileSync(outPath, svg, 'utf-8');
console.log('Saved wreath SVG to', outPath);
