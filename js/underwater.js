/**
 * OCEAN LIFE - PERSISTENT UNDERWATER CANVAS ENGINE (js/underwater.js)
 * Implements persistent underwater simulation:
 * - Schools of small fish swimming in groups
 * - Medium colorful fish (clownfish, blue tang, yellow tang)
 * - Large slow silhouettes (manta ray, whale/shark)
 * - Floating bubbles with buoyancy and harmonic drift
 * - Animated sunlight rays (caustics)
 * - Swaying underwater sea kelp plants
 * - Floating marine snow & plankton particles
 * - Interactive cursor bubble vortices
 *
 * Designed as a singleton that NEVER restarts across page navigation.
 */

(function () {
  'use strict';

  // Check if engine is already running on window to prevent duplicate loops
  if (window.underwaterEngine && window.underwaterEngine.isRunning) {
    return;
  }

  class UnderwaterEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isRunning = false;
      this.animationFrameId = null;

      // Entities
      this.schools = [];
      this.mediumFish = [];
      this.largeSilhouettes = [];
      this.bubbles = [];
      this.particles = [];
      this.kelpForest = [];
      this.lightRays = [];

      // Mouse interaction
      this.mouse = { x: -1000, y: -1000, isMoving: false, lastMove: 0 };
      this.theme = localStorage.getItem('ocean_theme') || 'dark';

      this.init();
    }

    setTheme(theme) {
      this.theme = theme;
      const container = document.getElementById('underwater-container');
      if (container) {
        if (theme === 'light') {
          container.style.background = 'radial-gradient(circle at 50% 0%, #c1efff 0%, #76d3f2 35%, #359ec7 75%, #186b92 100%)';
        } else {
          container.style.background = 'radial-gradient(circle at 50% 0%, #0d386c 0%, #06193d 40%, #020b18 90%, #01060f 100%)';
        }
      }
    }

    init() {
      // Find or create canvas
      let container = document.getElementById('underwater-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'underwater-container';
        container.innerHTML = `
          <canvas id="underwater-canvas"></canvas>
          <div class="water-caustics-overlay"></div>
          <div class="underwater-vignette"></div>
        `;
        document.body.prepend(container);
      }

      this.canvas = document.getElementById('underwater-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.resize();

      // Setup window listeners (Mouse & Mobile Touch Support)
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      window.addEventListener('click', (e) => this.handleClick(e));
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.handleMouseMove(e.touches[0]);
        }
      }, { passive: true });
      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          this.handleClick(e.touches[0]);
        }
      }, { passive: true });

      // Build initial population
      this.buildEntities();

      this.setTheme(this.theme);
      window.addEventListener('ocean:themeChanged', (e) => {
        if (e.detail && e.detail.theme) this.setTheme(e.detail.theme);
      });

      this.isRunning = true;
      this.animate(0);
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      if (this.canvas) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
      }
      // Re-anchor kelp plants to bottom
      if (this.kelpForest.length > 0) {
        this.initKelp();
      }
    }

    buildEntities() {
      this.initLightRays();
      this.initKelp();
      this.initLargeSilhouettes();
      this.initMediumFish();
      this.initSchools();
      this.initBubbles(45);
      this.initMarineSnow(70);
    }

    // ==========================================
    // 1. SUNLIGHT RAYS (CAUSTICS)
    // ==========================================
    initLightRays() {
      this.lightRays = [];
      const count = 7;
      for (let i = 0; i < count; i++) {
        this.lightRays.push({
          x: (this.width / count) * i + Math.random() * 80 - 40,
          width: 70 + Math.random() * 90,
          opacity: 0.04 + Math.random() * 0.08,
          speed: 0.0006 + Math.random() * 0.0008,
          phase: Math.random() * Math.PI * 2,
          skew: -15 + Math.random() * 6
        });
      }
    }

    drawLightRays(time) {
      const ctx = this.ctx;
      ctx.save();
      for (let ray of this.lightRays) {
        const pulse = Math.sin(time * ray.speed + ray.phase) * 0.03 + ray.opacity;
        const grad = ctx.createLinearGradient(ray.x, 0, ray.x + ray.skew * 20, this.height * 0.75);
        grad.addColorStop(0, `rgba(0, 240, 255, ${pulse * 1.5})`);
        grad.addColorStop(0.3, `rgba(5, 213, 179, ${pulse})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(ray.x, 0);
        ctx.lineTo(ray.x + ray.width, 0);
        ctx.lineTo(ray.x + ray.width * 1.8 + ray.skew * 15, this.height * 0.8);
        ctx.lineTo(ray.x - ray.width * 0.5 + ray.skew * 15, this.height * 0.8);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // ==========================================
    // 2. SWAYING SEA KELP PLANTS AT BOTTOM
    // ==========================================
    initKelp() {
      this.kelpForest = [];
      const kelpCount = Math.floor(this.width / 55);
      for (let i = 0; i < kelpCount; i++) {
        const x = (this.width / kelpCount) * i + (Math.random() * 20 - 10);
        const segments = 12 + Math.floor(Math.random() * 6);
        const totalHeight = 160 + Math.random() * 200;
        this.kelpForest.push({
          x: x,
          y: this.height,
          segments: segments,
          segmentLength: totalHeight / segments,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0012 + Math.random() * 0.0008,
          width: 8 + Math.random() * 7,
          color: Math.random() > 0.4 ? 'rgba(0, 168, 150, 0.28)' : 'rgba(5, 120, 110, 0.22)'
        });
      }
    }

    drawKelp(time) {
      const ctx = this.ctx;
      ctx.save();
      for (let plant of this.kelpForest) {
        ctx.beginPath();
        ctx.moveTo(plant.x, plant.y);

        let currX = plant.x;
        let currY = plant.y;

        for (let s = 1; s <= plant.segments; s++) {
          const sway = Math.sin(time * plant.speed + plant.phase + s * 0.35) * (s * 4);
          currX = plant.x + sway;
          currY = plant.y - s * plant.segmentLength;

          // Draw leaves along stem
          if (s % 2 === 0 && s < plant.segments) {
            const leafDir = s % 4 === 0 ? 1 : -1;
            const leafX = currX + leafDir * (12 + s * 1.5);
            const leafY = currY - 6;
            ctx.quadraticCurveTo(currX, currY, leafX, leafY);
          }
          ctx.lineTo(currX, currY);
        }

        ctx.lineWidth = plant.width;
        ctx.strokeStyle = plant.color;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();
    }

    // ==========================================
    // 3. LARGE SLOW SILHOUETTES (MANTA RAY & WHALE)
    // ==========================================
    initLargeSilhouettes() {
      this.largeSilhouettes = [
        {
          type: 'manta',
          x: -180,
          y: this.height * 0.35,
          speedX: 0.75,
          speedY: 0.1,
          size: 75,
          wingPhase: 0,
          color: 'rgba(0, 20, 50, 0.45)'
        },
        {
          type: 'whale',
          x: this.width + 300,
          y: this.height * 0.65,
          speedX: -0.5,
          speedY: -0.05,
          size: 140,
          tailPhase: 0,
          color: 'rgba(2, 14, 38, 0.5)'
        }
      ];
    }

    updateAndDrawSilhouettes(time) {
      const ctx = this.ctx;
      for (let sil of this.largeSilhouettes) {
        sil.x += sil.speedX;
        sil.y += Math.sin(time * 0.001) * 0.4 + sil.speedY;

        // Wrap around screen
        if (sil.speedX > 0 && sil.x > this.width + 300) {
          sil.x = -300;
          sil.y = 80 + Math.random() * (this.height * 0.6);
        } else if (sil.speedX < 0 && sil.x < -350) {
          sil.x = this.width + 350;
          sil.y = 120 + Math.random() * (this.height * 0.6);
        }

        ctx.save();
        ctx.translate(sil.x, sil.y);

        if (sil.type === 'manta') {
          // Manta ray gliding
          sil.wingPhase += 0.035;
          const wingSpread = Math.sin(sil.wingPhase) * (sil.size * 0.3);

          ctx.fillStyle = sil.color;
          ctx.beginPath();
          // Manta head
          ctx.moveTo(sil.size * 0.8, 0);
          // Right wing tip
          ctx.bezierCurveTo(sil.size * 0.3, -sil.size * 0.7 + wingSpread, 0, -sil.size + wingSpread, -sil.size * 0.4, -sil.size * 0.5);
          // Tail base
          ctx.lineTo(-sil.size * 0.6, 0);
          // Left wing tip
          ctx.lineTo(-sil.size * 0.4, sil.size * 0.5);
          ctx.bezierCurveTo(0, sil.size - wingSpread, sil.size * 0.3, sil.size * 0.7 - wingSpread, sil.size * 0.8, 0);
          ctx.closePath();
          ctx.fill();

          // Tail
          ctx.beginPath();
          ctx.moveTo(-sil.size * 0.6, 0);
          ctx.quadraticCurveTo(-sil.size * 1.2, Math.sin(sil.wingPhase) * 6, -sil.size * 1.8, 0);
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = sil.color;
          ctx.stroke();

        } else if (sil.type === 'whale') {
          // Whale silhouette
          sil.tailPhase += 0.02;
          ctx.fillStyle = sil.color;
          ctx.beginPath();
          // Head
          ctx.moveTo(-sil.size * 0.8, 0);
          ctx.bezierCurveTo(-sil.size * 0.7, -sil.size * 0.3, sil.size * 0.1, -sil.size * 0.35, sil.size * 0.7, -sil.size * 0.1);
          // Tail fluke
          const flukeY = Math.sin(sil.tailPhase) * 15;
          ctx.lineTo(sil.size * 1.1, flukeY - 20);
          ctx.lineTo(sil.size * 1.05, flukeY);
          ctx.lineTo(sil.size * 1.1, flukeY + 20);
          ctx.lineTo(sil.size * 0.7, sil.size * 0.1);
          ctx.bezierCurveTo(sil.size * 0.1, sil.size * 0.35, -sil.size * 0.7, sil.size * 0.3, -sil.size * 0.8, 0);
          ctx.closePath();
          ctx.fill();

          // Flipper
          ctx.beginPath();
          ctx.ellipse(-sil.size * 0.1, sil.size * 0.12, sil.size * 0.25, sil.size * 0.08, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // ==========================================
    // 4. MEDIUM COLORFUL FISH
    // ==========================================
    initMediumFish() {
      this.mediumFish = [];
      const species = [
        { name: 'clownfish', color: '#ff6b35', stripe: '#ffffff', size: 18 },
        { name: 'bluetang', color: '#1d8cf8', stripe: '#030b18', size: 22 },
        { name: 'yellowtang', color: '#ffd166', stripe: '#fff3b0', size: 20 },
        { name: 'butterfly', color: '#00f0ff', stripe: '#06193d', size: 19 }
      ];

      for (let i = 0; i < 9; i++) {
        const spec = species[i % species.length];
        const dir = Math.random() > 0.45 ? 1 : -1;
        this.mediumFish.push({
          x: Math.random() * this.width,
          y: 70 + Math.random() * (this.height - 180),
          speedX: (1.1 + Math.random() * 1.4) * dir,
          speedY: (Math.random() - 0.5) * 0.4,
          dir: dir,
          spec: spec,
          tailWag: Math.random() * Math.PI,
          wagSpeed: 0.15 + Math.random() * 0.08
        });
      }
    }

    updateAndDrawMediumFish() {
      const ctx = this.ctx;
      for (let f of this.mediumFish) {
        f.x += f.speedX;
        f.y += f.speedY;
        f.tailWag += f.wagSpeed;

        // Boundary wrap
        if (f.dir > 0 && f.x > this.width + 60) {
          f.x = -60;
          f.y = 80 + Math.random() * (this.height - 200);
        } else if (f.dir < 0 && f.x < -60) {
          f.x = this.width + 60;
          f.y = 80 + Math.random() * (this.height - 200);
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.dir < 0) ctx.scale(-1, 1);

        const tailAngle = Math.sin(f.tailWag) * 0.45;
        const s = f.spec.size;

        // Fish body
        ctx.fillStyle = f.spec.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // Decorative Stripe
        ctx.fillStyle = f.spec.stripe;
        ctx.beginPath();
        ctx.ellipse(-s * 0.1, 0, s * 0.22, s * 0.54, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s * 0.55, -s * 0.15, s * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(s * 0.6, -s * 0.15, s * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Wagging tail
        ctx.save();
        ctx.translate(-s * 0.85, 0);
        ctx.rotate(tailAngle);
        ctx.fillStyle = f.spec.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-s * 0.6, -s * 0.5);
        ctx.lineTo(-s * 0.45, 0);
        ctx.lineTo(-s * 0.6, s * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Top fin
        ctx.fillStyle = f.spec.color;
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s * 0.45);
        ctx.quadraticCurveTo(0, -s * 0.9, s * 0.3, -s * 0.3);
        ctx.fill();

        ctx.restore();
      }
    }

    // ==========================================
    // 5. SMALL FISH SCHOOLING (GROUPS)
    // ==========================================
    initSchools() {
      this.schools = [];
      const school1 = this.createSchool(26, '#00f0ff', 1.8, 1);
      const school2 = this.createSchool(20, '#05d5b3', 1.5, -1);
      this.schools.push(school1, school2);
    }

    createSchool(count, color, speed, direction) {
      const boids = [];
      const leaderX = direction > 0 ? -100 : this.width + 100;
      const leaderY = 150 + Math.random() * (this.height - 350);

      for (let i = 0; i < count; i++) {
        boids.push({
          x: leaderX + (Math.random() * 90 - 45),
          y: leaderY + (Math.random() * 70 - 35),
          vx: speed * direction + (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.5,
          color: color,
          length: 9 + Math.random() * 5,
          tailPhase: Math.random() * Math.PI
        });
      }

      return {
        direction: direction,
        baseSpeed: speed,
        boids: boids,
        targetY: leaderY
      };
    }

    updateAndDrawSchools() {
      const ctx = this.ctx;

      for (let school of this.schools) {
        // Slowly drift school target vertically
        school.targetY += (Math.random() - 0.5) * 1.5;
        if (school.targetY < 80) school.targetY = 120;
        if (school.targetY > this.height - 180) school.targetY = this.height - 240;

        for (let b of school.boids) {
          b.tailPhase += 0.3;
          b.x += b.vx;
          b.y += b.vy;

          // Pull towards target Y
          b.vy += (school.targetY - b.y) * 0.0006;

          // Wrap school across screen
          if (school.direction > 0 && b.x > this.width + 120) {
            b.x = -80 - Math.random() * 50;
            b.y = school.targetY + (Math.random() * 60 - 30);
          } else if (school.direction < 0 && b.x < -120) {
            b.x = this.width + 80 + Math.random() * 50;
            b.y = school.targetY + (Math.random() * 60 - 30);
          }

          // Draw small streamlined fish
          const angle = Math.atan2(b.vy, b.vx);
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(angle);

          // Body
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, b.length, b.length * 0.32, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail Wag
          const wag = Math.sin(b.tailPhase) * (b.length * 0.35);
          ctx.beginPath();
          ctx.moveTo(-b.length * 0.8, 0);
          ctx.lineTo(-b.length * 1.3, wag - b.length * 0.4);
          ctx.lineTo(-b.length * 1.3, wag + b.length * 0.4);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }
    }

    // ==========================================
    // 6. BUBBLES (RISING & WOBBLING)
    // ==========================================
    initBubbles(count) {
      this.bubbles = [];
      for (let i = 0; i < count; i++) {
        this.bubbles.push(this.createBubble(Math.random() * this.height));
      }
    }

    createBubble(startY) {
      return {
        x: Math.random() * this.width,
        y: startY !== undefined ? startY : this.height + 20 + Math.random() * 50,
        radius: 2.5 + Math.random() * 7.5,
        speed: 0.9 + Math.random() * 1.8,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmount: 1.2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.45
      };
    }

    updateAndDrawBubbles() {
      const ctx = this.ctx;
      for (let i = 0; i < this.bubbles.length; i++) {
        const b = this.bubbles[i];
        b.y -= b.speed;
        b.phase += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.phase) * b.wobbleAmount;

        // Reset bubble when reaching top
        if (b.y < -15) {
          this.bubbles[i] = this.createBubble();
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);

        // Bubble glass rim and specular shine
        ctx.strokeStyle = `rgba(0, 240, 255, ${b.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.15})`;
        ctx.fill();

        // Highlight glint
        ctx.beginPath();
        ctx.arc(currentX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
        ctx.fill();

        ctx.restore();
      }
    }

    // ==========================================
    // 7. MARINE SNOW & PLANKTON PARTICLES
    // ==========================================
    initMarineSnow(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.2 + Math.random() * 0.5,
          alpha: 0.2 + Math.random() * 0.5
        });
      }
    }

    updateAndDrawMarineSnow() {
      const ctx = this.ctx;
      ctx.save();
      for (let p of this.particles) {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y > this.height + 5) {
          p.y = -5;
          p.x = Math.random() * this.width;
        }
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // ==========================================
    // 8. INTERACTIVE BUBBLE VORTICES ON MOUSE
    // ==========================================
    handleMouseMove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      const now = performance.now();
      if (now - this.mouse.lastMove > 80 && Math.random() > 0.4) {
        this.mouse.lastMove = now;
        this.bubbles.push({
          x: this.mouse.x + (Math.random() * 20 - 10),
          y: this.mouse.y + (Math.random() * 20 - 10),
          radius: 1.8 + Math.random() * 3.5,
          speed: 1.5 + Math.random() * 2.2,
          wobbleSpeed: 0.04,
          wobbleAmount: 2,
          phase: Math.random() * Math.PI,
          opacity: 0.65
        });
        if (this.bubbles.length > 85) this.bubbles.shift();
      }
    }

    handleClick(e) {
      // Spawn burst of bubbles at click position
      for (let i = 0; i < 7; i++) {
        this.bubbles.push({
          x: e.clientX + (Math.random() * 30 - 15),
          y: e.clientY + (Math.random() * 30 - 15),
          radius: 2 + Math.random() * 6,
          speed: 2 + Math.random() * 2.5,
          wobbleSpeed: 0.05,
          wobbleAmount: 3,
          phase: Math.random() * Math.PI,
          opacity: 0.8
        });
      }
    }

    // ==========================================
    // MAIN CONTINUOUS ANIMATION LOOP
    // ==========================================
    animate(time) {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Light rays in upper water
      this.drawLightRays(time);

      // 2. Deep silhouettes (manta / whale)
      this.updateAndDrawSilhouettes(time);

      // 3. Swaying bottom sea kelp
      this.drawKelp(time);

      // 4. Middle colorful fish
      this.updateAndDrawMediumFish();

      // 5. Small fish schools
      this.updateAndDrawSchools();

      // 6. Marine snow particles
      this.updateAndDrawMarineSnow();

      // 7. Bubbles rising to top
      this.updateAndDrawBubbles();

      this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Instantiate singleton on window
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.underwaterEngine) {
      window.underwaterEngine = new UnderwaterEngine();
    }
  });

  // Also initialize immediately if DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    if (!window.underwaterEngine) {
      window.underwaterEngine = new UnderwaterEngine();
    }
  }
})();

