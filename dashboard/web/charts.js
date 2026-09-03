/**
 * charts.js
 * -----------------------------------------------------------------------------
 * A tiny, dependency-free canvas line-chart renderer for the live traces. We
 * avoid Chart.js et al. to keep the PWA lightweight and fully self-contained
 * (per the "no frameworks unless necessary" brief).
 *
 * Each Sparkline owns one <canvas>, keeps a reference to a data array of
 * {t, v} points (or {t, v:[...] } for multi-series), uses fixed measurement
 * bounds when supplied, and redraws only when new telemetry or a layout resize requires
 * it. The look is an oscilloscope-style trace: thin glowing line on a faint
 * grid, matching the instrument aesthetic.
 * -----------------------------------------------------------------------------
 */

export class Sparkline {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} opts { color, min, max, fill, grid, emptyLabel }
   *   min/max: fixed Y bounds; if omitted, auto-scales to data.
   */
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.color = opts.color || '#39ff88';
    this.fixedMin = opts.min;
    this.fixedMax = opts.max;
    this.fill = opts.fill !== false;
    this.grid = opts.grid !== false;
    this.emptyLabel = opts.emptyLabel || 'Waiting for data';
    this.data = [];
    this._resize();
    // Re-fit the backing store on container resize for crisp lines on HiDPI.
    new ResizeObserver(() => {
      this._resize();
      this._requestDraw?.();
    }).observe(canvas);
  }

  setData(arr) {
    this.data = arr;
    this._requestDraw?.();
  }

  // Match the canvas backing store to its CSS size * devicePixelRatio.
  _resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._w = rect.width; this._h = rect.height;
  }

  draw() {
    const ctx = this.ctx;
    const w = this._w, h = this._h;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const pts = this.data;
    if (pts.length < 2) {
      this._drawGrid();
      this._drawEmptyState();
      return;
    }

    // Determine Y bounds.
    let min = this.fixedMin, max = this.fixedMax;
    if (min == null || max == null) {
      min = Infinity; max = -Infinity;
      for (const p of pts) { if (p.v < min) min = p.v; if (p.v > max) max = p.v; }
      if (min === max) { min -= 1; max += 1; }
      // pad 10%
      const pad = (max - min) * 0.1;
      min -= pad; max += pad;
    }

    this._drawGrid();

    // X maps index -> width (we treat the buffer as evenly spaced for speed).
    const n = pts.length;
    const xOf = i => (i / (n - 1)) * w;
    const yOf = v => h - ((v - min) / (max - min)) * h;

    // Optional gradient fill under the line.
    if (this.fill) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, this.color + '33');
      grad.addColorStop(1, this.color + '00');
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i < n; i++) ctx.lineTo(xOf(i), yOf(pts[i].v));
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // The trace line with a soft glow.
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = xOf(i), y = yOf(pts[i].v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Leading dot at the most recent sample.
    const lx = xOf(n - 1), ly = yOf(pts[n - 1].v);
    ctx.beginPath();
    ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  _drawGrid() {
    if (!this.grid) return;
    const ctx = this.ctx, w = this._w, h = this._h;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) {        // 3 horizontal gridlines
      const y = (i / 4) * h;
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  _drawEmptyState() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(209, 219, 211, 0.5)';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emptyLabel, this._w / 2, this._h / 2);
  }
}

/**
 * ChartManager: registers sparklines and drives them from a single rAF loop so
 * the whole dashboard repaints in one synchronized frame (smooth + efficient).
 */
export class ChartManager {
  constructor() { this.charts = []; this._running = false; this._frame = null; }
  add(spark) {
    spark._requestDraw = () => this.requestDraw();
    this.charts.push(spark);
    return spark;
  }
  start() {
    if (this._running) return;
    this._running = true;
    this.requestDraw();
  }
  requestDraw() {
    if (!this._running || this._frame != null) return;
    this._frame = requestAnimationFrame(() => {
      this._frame = null;
      for (const c of this.charts) c.draw();
    });
  }
  stop() {
    this._running = false;
    if (this._frame != null) cancelAnimationFrame(this._frame);
    this._frame = null;
  }
}
