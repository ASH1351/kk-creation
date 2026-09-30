/**
 * KK CREATIONS – 3D Earring Hero & Scroll-Driven Story Engine
 * Built with Three.js & GSAP ScrollTrigger
 */

(function () {
  'use strict';

  // Check WebGL availability
  if (!window.WebGLRenderingContext) {
    console.warn("WebGL not supported, falling back to static visual presentation.");
    return;
  }

  const container = document.getElementById('three-hero-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = false;
  container.appendChild(renderer.domElement);

  // Generate luxury procedural studio environment map
  function createStudioEnvironment() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Luxurious gradient: soft warm champagne top, deep rich teal bottom, glowing softbox center
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#FAF2DD');     // warm champagne softbox ceiling
    grad.addColorStop(0.35, '#EAD7AE');  // gold studio glow
    grad.addColorStop(0.65, '#0E6F78');  // signature brand deep teal
    grad.addColorStop(1.0, '#062B30');   // dark teal shadow depth
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Studio softbox highlights
    const radial = ctx.createRadialGradient(256, 70, 10, 256, 70, 140);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    radial.addColorStop(0.5, 'rgba(245, 225, 175, 0.6)');
    radial.addColorStop(1, 'rgba(234, 215, 174, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 512, 256);

    // Side soft rim strip
    ctx.fillStyle = 'rgba(255, 245, 230, 0.45)';
    ctx.fillRect(40, 20, 45, 200);
    ctx.fillRect(430, 20, 45, 200);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();
    return envMap;
  }

  const envMap = createStudioEnvironment();
  scene.environment = envMap;

  // Master materials for luxury metals & gemstones
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E3C379'),
    emissive: new THREE.Color('#2A1F08'),
    metalness: 0.96,
    roughness: 0.16,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
    reflectivity: 1.0,
    envMapIntensity: 2.2
  });

  const pearlMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FAF7F0'),
    metalness: 0.05,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    iridescence: 0.9,
    iridescenceIOR: 1.34,
    transmission: 0.05,
    reflectivity: 0.9,
    envMapIntensity: 2.0
  });

  const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    metalness: 0.1,
    roughness: 0.04,
    transmission: 0.92,
    ior: 2.41,
    thickness: 1.2,
    reflectivity: 1.0,
    envMapIntensity: 3.5
  });

  const emeraldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0A6B48'),
    metalness: 0.1,
    roughness: 0.08,
    transmission: 0.75,
    ior: 1.76,
    thickness: 1.4,
    reflectivity: 1.0,
    envMapIntensity: 2.8
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  const tealRimLight = new THREE.PointLight(0x0e6f78, 3.2, 18);
  tealRimLight.position.set(-5, -2, -3);
  scene.add(tealRimLight);

  const warmBounceLight = new THREE.PointLight(0xd4b36a, 2.0, 15);
  warmBounceLight.position.set(3, -4, 2);
  scene.add(warmBounceLight);

  // Procedural Earring Geometry Construction
  function createEarring() {
    const earringGroup = new THREE.Group();

    // 1. French Wire / Shepherd Hook Curve
    const hookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.75, 0),        // Eyelet loop connection
      new THREE.Vector3(0.05, 1.4, 0.12),
      new THREE.Vector3(0, 2.1, 0.15),
      new THREE.Vector3(-0.08, 2.65, 0.05), // Peak arch
      new THREE.Vector3(-0.12, 2.85, -0.15),
      new THREE.Vector3(-0.06, 2.6, -0.45),
      new THREE.Vector3(0.02, 1.8, -0.7),   // Long graceful tail
      new THREE.Vector3(0.05, 1.3, -0.75)
    ]);
    const hookGeo = new THREE.TubeGeometry(hookCurve, 48, 0.042, 12, false);
    const hookMesh = new THREE.Mesh(hookGeo, goldMaterial);
    earringGroup.add(hookMesh);

    // Decorative stopper ball on the back of the wire
    const stopperGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const stopperMesh = new THREE.Mesh(stopperGeo, goldMaterial);
    stopperMesh.position.set(0.05, 1.3, -0.75);
    earringGroup.add(stopperMesh);

    // 2. Connector Eyelet Ring
    const eyeletGeo = new THREE.TorusGeometry(0.12, 0.038, 12, 24);
    const eyeletMesh = new THREE.Mesh(eyeletGeo, goldMaterial);
    eyeletMesh.position.set(0, 0.75, 0);
    eyeletMesh.rotation.y = Math.PI / 2;
    earringGroup.add(eyeletMesh);

    // 3. Botanical Filigree Medallion (Central Floral Rosette)
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, 0.35, 0);

    // Center disc
    const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24);
    discGeo.rotateX(Math.PI / 2);
    const discMesh = new THREE.Mesh(discGeo, goldMaterial);
    medallionGroup.add(discMesh);

    // Sparkling center gemstone
    const gemGeo = new THREE.OctahedronGeometry(0.12, 2);
    const gemMesh = new THREE.Mesh(gemGeo, diamondMaterial);
    gemMesh.position.z = 0.05;
    medallionGroup.add(gemMesh);

    // 6 Botanical Petals radiating outward
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const petalGeo = new THREE.ConeGeometry(0.14, 0.42, 8);
      petalGeo.rotateZ(Math.PI / 2);
      const petalMesh = new THREE.Mesh(petalGeo, goldMaterial);
      petalMesh.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);
      petalMesh.rotation.z = angle;
      medallionGroup.add(petalMesh);

      // Micro diamond prongs on petal tips
      const microGemGeo = new THREE.SphereGeometry(0.04, 10, 10);
      const microGem = new THREE.Mesh(microGemGeo, diamondMaterial);
      microGem.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.02);
      medallionGroup.add(microGem);
    }

    // Two graceful curving leaf tendrils branching down to frame the drop
    const leftLeafCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, -0.15, 0),
      new THREE.Vector3(-0.55, -0.45, 0.1),
      new THREE.Vector3(-0.45, -0.85, 0.05),
      new THREE.Vector3(-0.15, -1.05, 0)
    ]);
    const leftLeafTube = new THREE.Mesh(new THREE.TubeGeometry(leftLeafCurve, 24, 0.035, 8, false), goldMaterial);
    medallionGroup.add(leftLeafTube);

    const rightLeafCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, -0.15, 0),
      new THREE.Vector3(0.55, -0.45, -0.1),
      new THREE.Vector3(0.45, -0.85, -0.05),
      new THREE.Vector3(0.15, -1.05, 0)
    ]);
    const rightLeafTube = new THREE.Mesh(new THREE.TubeGeometry(rightLeafCurve, 24, 0.035, 8, false), goldMaterial);
    medallionGroup.add(rightLeafTube);

    earringGroup.add(medallionGroup);

    // 4. Connecting Jump Ring to Drop
    const dropRingGeo = new THREE.TorusGeometry(0.1, 0.032, 12, 20);
    const dropRing = new THREE.Mesh(dropRingGeo, goldMaterial);
    dropRing.position.set(0, -0.12, 0);
    earringGroup.add(dropRing);

    // 5. Filigree Drop Cap (Fluted gold cup cradling the baroque pearl)
    const capGeo = new THREE.CylinderGeometry(0.28, 0.1, 0.18, 16, 1, true);
    const capMesh = new THREE.Mesh(capGeo, goldMaterial);
    capMesh.position.set(0, -0.22, 0);
    earringGroup.add(capMesh);

    // 6. Sculpted Organic Baroque Teardrop Pearl
    // Handcrafted lathe profile with organic teardrop curves
    const pearlPoints = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI;
      // Organic pearl shape: tapering top neck, voluptuous round base
      let r = Math.sin(angle) * (1.15 - 0.42 * Math.cos(angle)) * 0.72;
      // subtle organic variation
      r *= (1.0 + 0.03 * Math.sin(angle * 3));
      const y = -(t * 2.3 - 0.08);
      pearlPoints.push(new THREE.Vector2(Math.max(0.002, r), y));
    }
    const pearlGeo = new THREE.LatheGeometry(pearlPoints, 48);
    const pearlMesh = new THREE.Mesh(pearlGeo, pearlMaterial);
    pearlMesh.position.set(0, -0.25, 0);
    earringGroup.add(pearlMesh);

    // 7. Bottom Charm (Delicate hanging diamond/gold drop pin)
    const pinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.55, 0),
      new THREE.Vector3(0, -2.85, 0)
    ]);
    const pinMesh = new THREE.Mesh(new THREE.TubeGeometry(pinCurve, 8, 0.025, 8, false), goldMaterial);
    earringGroup.add(pinMesh);

    const bottomBeadGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const bottomBead = new THREE.Mesh(bottomBeadGeo, diamondMaterial);
    bottomBead.position.set(0, -2.95, 0);
    earringGroup.add(bottomBead);

    return {
      group: earringGroup,
      goldParts: [hookMesh, stopperMesh, eyeletMesh, discMesh, capMesh, pinMesh, leftLeafTube, rightLeafTube],
      gemParts: [gemMesh, bottomBead],
      pearlPart: pearlMesh,
      allMaterials: {
        gold: goldMaterial,
        pearl: pearlMaterial,
        diamond: diamondMaterial,
        emerald: emeraldMaterial
      }
    };
  }

  // Master Earring Pair Group
  const masterPair = new THREE.Group();
  scene.add(masterPair);

  const leftEarringData = createEarring();
  const rightEarringData = createEarring();

  // Position left and right earrings with natural boutique spacing
  leftEarringData.group.position.set(-1.45, 0.35, 0);
  leftEarringData.group.rotation.set(0.05, 0.25, -0.04);

  rightEarringData.group.position.set(1.45, 0.05, -0.25);
  rightEarringData.group.rotation.set(-0.04, -0.28, 0.05);

  masterPair.add(leftEarringData.group);
  masterPair.add(rightEarringData.group);

  // Responsive scale & position adjustments
  function adjustResponsiveLayout() {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    if (width < 768) {
      // Mobile layout: stack or bring pair closer together and slightly lower
      masterPair.scale.set(0.72, 0.72, 0.72);
      leftEarringData.group.position.set(-0.85, 0.4, 0);
      rightEarringData.group.position.set(0.85, 0.1, -0.15);
      camera.position.z = 8.5;
    } else if (width < 1024) {
      masterPair.scale.set(0.88, 0.88, 0.88);
      leftEarringData.group.position.set(-1.2, 0.3, 0);
      rightEarringData.group.position.set(1.2, 0.0, -0.2);
      camera.position.z = 7.8;
    } else {
      masterPair.scale.set(1.0, 1.0, 1.0);
      leftEarringData.group.position.set(-1.45, 0.35, 0);
      rightEarringData.group.position.set(1.45, 0.05, -0.25);
      camera.position.z = 7.5;
    }
  }

  window.addEventListener('resize', adjustResponsiveLayout);
  adjustResponsiveLayout();

  // Floating Golden Sparkle Particles
  const particleCount = width < 768 ? 45 : 110;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particlePhases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 14;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    particlePhases[i] = Math.random() * Math.PI * 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Circular sparkle particle texture
  function createParticleTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const rad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    rad.addColorStop(0, 'rgba(255, 245, 205, 1)');
    rad.addColorStop(0.3, 'rgba(212, 179, 106, 0.8)');
    rad.addColorStop(0.7, 'rgba(212, 179, 106, 0.2)');
    rad.addColorStop(1, 'rgba(212, 179, 106, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  const particleMat = new THREE.PointsMaterial({
    size: 0.28,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlePoints = new THREE.Points(particleGeo, particleMat);
  scene.add(particlePoints);

  // Mouse Parallax & Gyroscope Physics
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let isVisible = true;

  // Track viewport visibility with IntersectionObserver to save battery & 60fps
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = mouseX * 0.45;
    targetRotX = mouseY * 0.35;
  }, { passive: true });

  // Touch drag for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const dx = (e.touches[0].clientX - touchStartX) / window.innerWidth;
      const dy = (e.touches[0].clientY - touchStartY) / window.innerHeight;
      targetRotY += dx * 0.25;
      targetRotX += dy * 0.25;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Gyroscope tilt on mobile devices
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        targetRotY = (e.gamma / 45) * 0.4;
        targetRotX = ((e.beta - 40) / 45) * 0.3;
      }
    }, { passive: true });
  }

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerping of mouse parallax rotation
    masterPair.rotation.y += (targetRotY - masterPair.rotation.y) * 0.05;
    masterPair.rotation.x += (targetRotX - masterPair.rotation.x) * 0.05;

    // Harmonic boutique floating
    masterPair.position.y = Math.sin(elapsedTime * 1.3) * 0.12;

    // Subtle individual earring pendulum sway
    leftEarringData.group.rotation.z = -0.04 + Math.sin(elapsedTime * 1.6) * 0.04;
    leftEarringData.group.rotation.x = 0.05 + Math.cos(elapsedTime * 1.2) * 0.03;

    rightEarringData.group.rotation.z = 0.05 + Math.cos(elapsedTime * 1.5) * 0.04;
    rightEarringData.group.rotation.x = -0.04 + Math.sin(elapsedTime * 1.1) * 0.03;

    // Drifting sparkle particles
    const positions = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += Math.sin(elapsedTime + particlePhases[i]) * 0.003;
      positions[i * 3 + 0] += Math.cos(elapsedTime * 0.8 + particlePhases[i]) * 0.002;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Render scene
    renderer.render(scene, camera);
  }

  animate();

  // Expose global controller for GSAP Scroll Story
  window.KKEarringHero = {
    scene,
    camera,
    masterPair,
    leftEarringData,
    rightEarringData,
    goldMaterial,
    pearlMaterial,
    emeraldMaterial,
    renderer
  };

  // Connect GSAP ScrollTrigger to 3D Earring Story
  function initScrollDrivenStory() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initScrollDrivenStory, 150);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const storySection = document.getElementById('story-section');
    if (!storySection) return;

    // Palette targets for material transition
    const metalColors = {
      yellowGold: new THREE.Color('#E3C379'),
      roseGold: new THREE.Color('#E6A896'),
      silver: new THREE.Color('#D8DFE3'),
      antiqueGold: new THREE.Color('#B69352')
    };

    // Color morphing object
    const colorMorph = {
      r: goldMaterial.color.r,
      g: goldMaterial.color.g,
      b: goldMaterial.color.b,
      metalness: goldMaterial.metalness,
      roughness: goldMaterial.roughness
    };

    // GSAP Timeline pinned to story section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#story-section',
        start: 'top top',
        end: '+=3200',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update active step indicators
          const progress = self.progress;
          const steps = document.querySelectorAll('.story-step-indicator');
          const stepIndex = Math.min(3, Math.floor(progress * 4));
          steps.forEach((st, idx) => {
            st.classList.toggle('active', idx === stepIndex);
          });
        }
      }
    });

    // STEP 1: Handcrafted Perfection - Zoom into filigree leaf and hook
    tl.to(masterPair.position, {
      x: window.innerWidth < 768 ? 0 : -1.8,
      y: 0.4,
      z: 1.8,
      duration: 2,
      ease: 'power2.inOut'
    }, 0)
    .to(masterPair.rotation, {
      x: 0.28,
      y: 0.65,
      z: -0.1,
      duration: 2,
      ease: 'power2.inOut'
    }, 0)
    .to('.story-card-1', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 0.2)
    .to('.story-card-1', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.in'
    }, 1.8);

    // STEP 2: Featherlight Comfort - Rotate 90 deg side profile to reveal hollow ergonomic lightness
    tl.to(masterPair.position, {
      x: window.innerWidth < 768 ? 0 : 1.6,
      y: -0.2,
      z: 1.2,
      duration: 2.2,
      ease: 'power2.inOut'
    }, 2)
    .to(masterPair.rotation, {
      x: -0.15,
      y: Math.PI * 0.95,
      z: 0.12,
      duration: 2.2,
      ease: 'power2.inOut'
    }, 2)
    .to('.story-card-2', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 2.2)
    .to('.story-card-2', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.in'
    }, 3.8);

    // STEP 3: Bespoke Finishes - Live Color & Material Switch (Yellow -> Rose Gold -> Silver)
    tl.to(masterPair.position, {
      x: 0,
      y: 0.1,
      z: 2.2,
      duration: 2.4,
      ease: 'power2.inOut'
    }, 4)
    .to(masterPair.rotation, {
      x: 0.1,
      y: Math.PI * 1.8,
      z: 0,
      duration: 2.4,
      ease: 'power2.inOut'
    }, 4)
    // Morph material to Rose Gold
    .to(colorMorph, {
      r: metalColors.roseGold.r,
      g: metalColors.roseGold.g,
      b: metalColors.roseGold.b,
      duration: 1.2,
      onUpdate: () => {
        goldMaterial.color.setRGB(colorMorph.r, colorMorph.g, colorMorph.b);
      }
    }, 4.2)
    // Morph material to Platinum Silver
    .to(colorMorph, {
      r: metalColors.silver.r,
      g: metalColors.silver.g,
      b: metalColors.silver.b,
      duration: 1.2,
      onUpdate: () => {
        goldMaterial.color.setRGB(colorMorph.r, colorMorph.g, colorMorph.b);
      }
    }, 5.2)
    .to('.story-card-3', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 4.2)
    .to('.story-card-3', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.in'
    }, 5.8);

    // STEP 4: Made For Every Occasion - Restore Gold, Pull back to Twin Symmetry with Particle Spark
    tl.to(colorMorph, {
      r: metalColors.yellowGold.r,
      g: metalColors.yellowGold.g,
      b: metalColors.yellowGold.b,
      duration: 1.2,
      onUpdate: () => {
        goldMaterial.color.setRGB(colorMorph.r, colorMorph.g, colorMorph.b);
      }
    }, 6.2)
    .to(masterPair.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2.2,
      ease: 'power2.inOut'
    }, 6)
    .to(masterPair.rotation, {
      x: 0,
      y: Math.PI * 2,
      z: 0,
      duration: 2.2,
      ease: 'power2.inOut'
    }, 6)
    .to('.story-card-4', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 6.3);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollDrivenStory);
  } else {
    initScrollDrivenStory();
  }

})();
