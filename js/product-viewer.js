/**
 * KK CREATIONS – Interactive 3D Product Viewer & Customizer
 * Allows real-time 360 rotation, zoom, material swatches, and WhatsApp bespoke inquiries.
 */

(function () {
  'use strict';

  const container = document.getElementById('viewer-3d-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 3.5;
  controls.maxDistance = 10.0;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  // Customizer Environment Map
  function createCustomizerEnvironment() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#F5EDE0');
    grad.addColorStop(0.65, '#0E6F78');
    grad.addColorStop(1, '#052A2F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    const rad = ctx.createRadialGradient(256, 80, 5, 256, 80, 160);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    rad.addColorStop(0.6, 'rgba(235, 215, 175, 0.5)');
    rad.addColorStop(1, 'rgba(235, 215, 175, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 512, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(texture).texture;
    pmrem.dispose();
    return env;
  }

  scene.environment = createCustomizerEnvironment();

  // Studio Lights
  const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffeed6, 2.5);
  mainLight.position.set(5, 7, 5);
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0x0e6f78, 2.6, 20);
  fillLight.position.set(-6, -2, -4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xfff0dd, 2.0, 18);
  rimLight.position.set(4, -3, 3);
  scene.add(rimLight);

  // Metal configurations
  const METAL_PRESETS = {
    'gold': {
      name: '18K Champagne Gold',
      color: '#E3C379',
      metalness: 0.95,
      roughness: 0.16,
      clearcoat: 0.8,
      priceOffset: 0
    },
    'rose-gold': {
      name: '18K Blush Rose Gold',
      color: '#E8A391',
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.85,
      priceOffset: 250
    },
    'silver': {
      name: 'Platinum Silver Vermeil',
      color: '#DFE5E9',
      metalness: 0.98,
      roughness: 0.14,
      clearcoat: 0.9,
      priceOffset: -300
    },
    'antique': {
      name: 'Imperial Matte Gold',
      color: '#BA9651',
      metalness: 0.85,
      roughness: 0.38,
      clearcoat: 0.2,
      priceOffset: 150
    }
  };

  // Gemstone / Drop configurations
  const STONE_PRESETS = {
    'pearl': {
      name: 'Grade-AAA Freshwater Baroque Pearl',
      color: '#FAF7F0',
      metalness: 0.05,
      roughness: 0.22,
      clearcoat: 1.0,
      iridescence: 0.9,
      transmission: 0.05,
      priceOffset: 0
    },
    'emerald': {
      name: 'Hydrothermal Royal Emerald',
      color: '#0A6B48',
      metalness: 0.08,
      roughness: 0.08,
      clearcoat: 0.95,
      iridescence: 0.2,
      transmission: 0.78,
      priceOffset: 650
    },
    'ruby': {
      name: 'Crimson Pigeon-Blood Ruby',
      color: '#9B1130',
      metalness: 0.08,
      roughness: 0.08,
      clearcoat: 0.95,
      iridescence: 0.2,
      transmission: 0.72,
      priceOffset: 750
    },
    'sapphire': {
      name: 'Deep Midnight Royal Sapphire',
      color: '#0E2E5C',
      metalness: 0.08,
      roughness: 0.08,
      clearcoat: 0.95,
      iridescence: 0.2,
      transmission: 0.74,
      priceOffset: 700
    }
  };

  // Dynamic active materials
  const activeMetalMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(METAL_PRESETS['gold'].color),
    metalness: METAL_PRESETS['gold'].metalness,
    roughness: METAL_PRESETS['gold'].roughness,
    clearcoat: METAL_PRESETS['gold'].clearcoat,
    envMapIntensity: 2.2
  });

  const activeStoneMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(STONE_PRESETS['pearl'].color),
    metalness: STONE_PRESETS['pearl'].metalness,
    roughness: STONE_PRESETS['pearl'].roughness,
    clearcoat: STONE_PRESETS['pearl'].clearcoat,
    iridescence: STONE_PRESETS['pearl'].iridescence,
    transmission: STONE_PRESETS['pearl'].transmission,
    envMapIntensity: 2.2
  });

  const sparkleGemMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    metalness: 0.1,
    roughness: 0.04,
    transmission: 0.95,
    ior: 2.4,
    envMapIntensity: 3.5
  });

  // Build the showcase single centerpiece earring
  const viewerGroup = new THREE.Group();
  scene.add(viewerGroup);

  // Hook
  const hookCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.75, 0),
    new THREE.Vector3(0.04, 1.4, 0.12),
    new THREE.Vector3(0, 2.1, 0.15),
    new THREE.Vector3(-0.08, 2.65, 0.05),
    new THREE.Vector3(-0.12, 2.85, -0.15),
    new THREE.Vector3(-0.06, 2.6, -0.45),
    new THREE.Vector3(0.02, 1.8, -0.7),
    new THREE.Vector3(0.05, 1.3, -0.75)
  ]);
  const hookMesh = new THREE.Mesh(new THREE.TubeGeometry(hookCurve, 48, 0.045, 12, false), activeMetalMat);
  viewerGroup.add(hookMesh);

  const stopperMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), activeMetalMat);
  stopperMesh.position.set(0.05, 1.3, -0.75);
  viewerGroup.add(stopperMesh);

  // Eyelet Ring
  const eyeletMesh = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 12, 24), activeMetalMat);
  eyeletMesh.position.set(0, 0.75, 0);
  eyeletMesh.rotation.y = Math.PI / 2;
  viewerGroup.add(eyeletMesh);

  // Floral Filigree Medallion
  const medallionGroup = new THREE.Group();
  medallionGroup.position.set(0, 0.35, 0);

  const discMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 24), activeMetalMat);
  discMesh.rotation.x = Math.PI / 2;
  medallionGroup.add(discMesh);

  const centerGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 2), sparkleGemMat);
  centerGem.position.z = 0.05;
  medallionGroup.add(centerGem);

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const petalMesh = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.44, 8), activeMetalMat);
    petalMesh.rotation.z = angle + Math.PI / 2;
    petalMesh.position.set(Math.cos(angle) * 0.34, Math.sin(angle) * 0.34, 0);
    medallionGroup.add(petalMesh);

    const microBead = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), sparkleGemMat);
    microBead.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0.02);
    medallionGroup.add(microBead);
  }

  // Branching Leaf Vines
  const leftLeafCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, -0.15, 0),
    new THREE.Vector3(-0.6, -0.45, 0.1),
    new THREE.Vector3(-0.48, -0.9, 0.05),
    new THREE.Vector3(-0.16, -1.1, 0)
  ]);
  medallionGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftLeafCurve, 24, 0.038, 8, false), activeMetalMat));

  const rightLeafCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, -0.15, 0),
    new THREE.Vector3(0.6, -0.45, -0.1),
    new THREE.Vector3(0.48, -0.9, -0.05),
    new THREE.Vector3(0.16, -1.1, 0)
  ]);
  medallionGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightLeafCurve, 24, 0.038, 8, false), activeMetalMat));

  viewerGroup.add(medallionGroup);

  // Drop Cap
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.12, 0.2, 16, 1, true), activeMetalMat);
  capMesh.position.set(0, -0.22, 0);
  viewerGroup.add(capMesh);

  // Baroque Drop / Gemstone
  const dropPoints = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = t * Math.PI;
    let r = Math.sin(a) * (1.16 - 0.44 * Math.cos(a)) * 0.75;
    r *= (1.0 + 0.035 * Math.sin(a * 3));
    const y = -(t * 2.4 - 0.08);
    dropPoints.push(new THREE.Vector2(Math.max(0.002, r), y));
  }
  const dropMesh = new THREE.Mesh(new THREE.LatheGeometry(dropPoints, 48), activeStoneMat);
  dropMesh.position.set(0, -0.25, 0);
  viewerGroup.add(dropMesh);

  // Bottom Charm
  const bottomPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.35, 8),
    activeMetalMat
  );
  bottomPin.position.set(0, -2.75, 0);
  viewerGroup.add(bottomPin);

  const bottomBead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), sparkleGemMat);
  bottomBead.position.set(0, -2.95, 0);
  viewerGroup.add(bottomBead);

  // Center vertical pivot
  viewerGroup.position.set(0, 0.6, 0);

  // Floating Sparkles for customizer
  const pCount = 50;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3 + 0] = (Math.random() - 0.5) * 6;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xe3c379,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(pGeo, pMat));

  // Current customization state
  let currentMetalKey = 'gold';
  let currentStoneKey = 'pearl';
  let currentLightingKey = 'warmth';
  const basePrice = 3450;

  function updateCustomizerUI() {
    const metal = METAL_PRESETS[currentMetalKey];
    const stone = STONE_PRESETS[currentStoneKey];
    const totalPrice = basePrice + metal.priceOffset + stone.priceOffset;

    // Update specs DOM elements
    const metalEl = document.getElementById('viewer-spec-metal');
    const stoneEl = document.getElementById('viewer-spec-stone');
    const priceEl = document.getElementById('viewer-spec-price');
    const ctaBtn = document.getElementById('viewer-whatsapp-cta');

    if (metalEl) metalEl.textContent = metal.name;
    if (stoneEl) stoneEl.textContent = stone.name;
    if (priceEl) priceEl.textContent = '₹' + totalPrice.toLocaleString('en-IN');

    // Update WhatsApp link
    if (ctaBtn) {
      const message = `Hello KK Creations! ✨\n\nI just designed a custom piece in your 3D Atelier Viewer:\n\n💎 *Aura Botanical Custom Earring*\n• Metal Finish: ${metal.name}\n• Drop Centerpiece: ${stone.name}\n• Estimated Value: ₹${totalPrice.toLocaleString('en-IN')}\n\nCould you please confirm making timeline and place my order? Thank you! 🌿`;
      ctaBtn.href = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    }
  }

  // Swatch Switch Handlers
  window.setCustomMetal = function (metalKey) {
    if (!METAL_PRESETS[metalKey]) return;
    currentMetalKey = metalKey;
    const m = METAL_PRESETS[metalKey];

    // Animate material transition
    gsap.to(activeMetalMat.color, {
      r: new THREE.Color(m.color).r,
      g: new THREE.Color(m.color).g,
      b: new THREE.Color(m.color).b,
      duration: 0.6
    });
    activeMetalMat.metalness = m.metalness;
    activeMetalMat.roughness = m.roughness;
    activeMetalMat.clearcoat = m.clearcoat;

    // Update UI active class
    document.querySelectorAll('[data-metal-swatch]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-metal-swatch') === metalKey);
    });

    updateCustomizerUI();
  };

  window.setCustomStone = function (stoneKey) {
    if (!STONE_PRESETS[stoneKey]) return;
    currentStoneKey = stoneKey;
    const s = STONE_PRESETS[stoneKey];

    gsap.to(activeStoneMat.color, {
      r: new THREE.Color(s.color).r,
      g: new THREE.Color(s.color).g,
      b: new THREE.Color(s.color).b,
      duration: 0.6
    });
    activeStoneMat.metalness = s.metalness;
    activeStoneMat.roughness = s.roughness;
    activeStoneMat.clearcoat = s.clearcoat;
    activeStoneMat.iridescence = s.iridescence;
    activeStoneMat.transmission = s.transmission;

    document.querySelectorAll('[data-stone-swatch]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-stone-swatch') === stoneKey);
    });

    updateCustomizerUI();
  };

  window.setCustomLighting = function (lightKey) {
    currentLightingKey = lightKey;
    if (lightKey === 'warmth') {
      ambientLight.color.setHex(0xfff6ea);
      ambientLight.intensity = 1.4;
      mainLight.color.setHex(0xffeed6);
      mainLight.intensity = 2.5;
      fillLight.color.setHex(0x0e6f78);
    } else if (lightKey === 'daylight') {
      ambientLight.color.setHex(0xf0f5ff);
      ambientLight.intensity = 1.6;
      mainLight.color.setHex(0xffffff);
      mainLight.intensity = 2.8;
      fillLight.color.setHex(0x388289);
    } else if (lightKey === 'midnight') {
      ambientLight.color.setHex(0x10252b);
      ambientLight.intensity = 0.8;
      mainLight.color.setHex(0xd4b36a);
      mainLight.intensity = 3.2;
      fillLight.color.setHex(0x08484f);
    }

    document.querySelectorAll('[data-light-swatch]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-light-swatch') === lightKey);
    });
  };

  window.resetCustomizerView = function () {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 6.2,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => controls.update()
    });
    controls.target.set(0, 0, 0);
  };

  window.toggleCustomizerAutoRotate = function () {
    controls.autoRotate = !controls.autoRotate;
    const btn = document.getElementById('btn-auto-rotate-toggle');
    if (btn) {
      btn.classList.toggle('active', controls.autoRotate);
    }
  };

  // Resize listener
  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Intersection observer to only render when on screen
  let isViewerVisible = true;
  const viewerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isViewerVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  viewerObserver.observe(container);

  // Render loop
  function animateViewer() {
    requestAnimationFrame(animateViewer);
    if (!isViewerVisible) return;

    controls.update();
    renderer.render(scene, camera);
  }

  animateViewer();
  updateCustomizerUI();

})();
