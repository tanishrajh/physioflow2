/**
 * OneEuroFilter implementation for pose smoothing.
 * Reduces jitter while maintaining responsiveness.
 */

class LowPassFilter {
  constructor(alpha, initValue = 0) {
    this.y = initValue;
    this.s = initValue;
    this.initialized = false;
  }

  filter(value, alpha) {
    if (!this.initialized) {
      this.s = value;
      this.y = value;
      this.initialized = true;
      return value;
    }
    this.y = value;
    this.s = alpha * value + (1.0 - alpha) * this.s;
    return this.s;
  }

  hasLastRawValue() {
    return this.initialized;
  }

  lastRawValue() {
    return this.y;
  }
}

export class OneEuroFilter {
  constructor(minCutoff = 6.5, beta = 0.6, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xFilter = new LowPassFilter();
    this.yFilter = new LowPassFilter();
    this.dxFilter = new LowPassFilter();
    this.dyFilter = new LowPassFilter();
    this.lastTimestamp = Date.now();
  }

  alpha(cutoff, dt) {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / dt);
  }

  filter(x, y, timestamp) {
    // Convert timestamp to seconds
    const t = timestamp / 1000;
    const lastT = this.lastTimestamp / 1000;
    const dt = t - lastT;
    this.lastTimestamp = timestamp;

    // Avoid division by zero or too small dt
    if (dt <= 0) return { x, y }; 

    // Compute derivative (speed)
    const dx = (x - this.xFilter.lastRawValue()) / dt;
    const dy = (y - this.yFilter.lastRawValue()) / dt;

    const edx = this.dxFilter.filter(dx, this.alpha(this.dCutoff, dt));
    const edy = this.dyFilter.filter(dy, this.alpha(this.dCutoff, dt));

    // Compute cutoff based on speed
    const cutoffX = this.minCutoff + this.beta * Math.abs(edx);
    const cutoffY = this.minCutoff + this.beta * Math.abs(edy);

    // Filter position
    const smoothedX = this.xFilter.filter(x, this.alpha(cutoffX, dt));
    const smoothedY = this.yFilter.filter(y, this.alpha(cutoffY, dt));

    return { x: smoothedX, y: smoothedY };
  }
  
  reset() {
      this.xFilter = new LowPassFilter();
      this.yFilter = new LowPassFilter();
      this.dxFilter = new LowPassFilter();
      this.dyFilter = new LowPassFilter();
      this.lastTimestamp = Date.now();
  }
}
