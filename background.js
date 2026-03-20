/**
 * Animated mesh gradient background
 * Mirrors the MeshGradient + DotOrbit aesthetic from @paper-design/shaders-react
 * without requiring React or a bundler.
 */
(function () {
  function initBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let t = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Organic floating gradient blobs — steel blue / slate palette matching the logo
    const blobs = [
      { xf: t => 0.25 + 0.30 * Math.sin(t * 0.22), yf: t => 0.30 + 0.28 * Math.cos(t * 0.18), r: 0.50, c: [28,  38,  52]  },
      { xf: t => 0.75 + 0.28 * Math.cos(t * 0.28), yf: t => 0.65 + 0.30 * Math.sin(t * 0.20), r: 0.45, c: [22,  30,  42]  },
      { xf: t => 0.50 + 0.35 * Math.sin(t * 0.15), yf: t => 0.45 + 0.32 * Math.cos(t * 0.32), r: 0.55, c: [40,  52,  68]  },
      { xf: t => 0.20 + 0.25 * Math.cos(t * 0.35), yf: t => 0.70 + 0.25 * Math.sin(t * 0.25), r: 0.35, c: [15,  20,  30]  },
      { xf: t => 0.80 + 0.20 * Math.sin(t * 0.40), yf: t => 0.25 + 0.22 * Math.cos(t * 0.30), r: 0.38, c: [30,  40,  55]  },
    ];

    function animate() {
      const w = canvas.width;
      const h = canvas.height;

      // Solid black base
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Layer blobs with additive blending for soft glow
      ctx.globalCompositeOperation = 'lighter';

      for (const b of blobs) {
        const x = b.xf(t) * w;
        const y = b.yf(t) * h;
        const radius = b.r * Math.min(w, h);
        const [r, g, bl] = b.c;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grd.addColorStop(0,   `rgba(${r},${g},${bl},0.90)`);
        grd.addColorStop(0.4, `rgba(${r},${g},${bl},0.35)`);
        grd.addColorStop(1,   `rgba(0,0,0,0)`);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Very faint white accent pulse — mimics the pulsing overlays in the demo
      ctx.globalCompositeOperation = 'lighter';
      const ax = (0.50 + 0.28 * Math.sin(t * 0.11)) * w;
      const ay = (0.42 + 0.20 * Math.cos(t * 0.16)) * h;
      const ar = 0.28 * Math.min(w, h) * (1 + 0.08 * Math.sin(t * 2.0));
      const accent = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
      accent.addColorStop(0, 'rgba(138,157,179,0.04)');
      accent.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';

      t += 0.012;
      requestAnimationFrame(animate);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    initBackground();
  }
})();
