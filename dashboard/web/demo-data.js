import { MOVEMENT, SESSION_STATE, WEARABILITY } from './constants.js';

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

/**
 * A deterministic synthetic source used to demonstrate the dashboard without
 * a device, network service, or personal data. Consumers only depend on the
 * event interface, so a private transport can use the same boundary elsewhere.
 */
export class DemoTelemetry {
  constructor() {
    this.listeners = new Map();
    this.timer = null;
    this.tick = 0;
    this.sessionStartedAt = null;
    this.isSessionActive = false;
  }

  on(event, callback) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.push(callback);
    this.listeners.set(event, callbacks);
    return this;
  }

  _emit(event, payload) {
    for (const callback of this.listeners.get(event) || []) callback(payload);
  }

  connect() {
    this.restart();
  }

  restart() {
    if (this.isSessionActive) this.endSession();
    this.stop();
    this.tick = 0;
    this.sessionStartedAt = null;
    this.isSessionActive = false;
    this._emit('status', { state: 'demo', label: 'Synthetic data stream' });
    this._tick();
    this.timer = window.setInterval(() => this._tick(), 250);
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  startSession() {
    if (this.isSessionActive) return;
    this.isSessionActive = true;
    this.sessionStartedAt = Date.now();
    this._emitSession(SESSION_STATE.ACTIVE);
  }

  endSession() {
    if (!this.isSessionActive) return;
    this._emitSession(SESSION_STATE.ENDED);
    this.isSessionActive = false;
    this.sessionStartedAt = null;
  }

  _tick() {
    this.tick += 1;
    const time = Date.now();
    const phase = this.tick / 5;
    const burst = Math.max(0, Math.sin(phase * 0.38));
    const amplitude = clamp(0.28 + burst * 0.68 + Math.sin(phase * 1.9) * 0.08, 0.04, 1.15);
    const rotation = clamp(0.32 + Math.abs(Math.cos(phase * 0.47)) * 0.72, 0.05, 1.1);
    const intensity = clamp(amplitude * 0.7 + rotation * 0.3, 0, 1);
    const wearability = Math.round(clamp(87 + Math.sin(phase * 0.2) * 8 - burst * 5, 68, 97));

    this._emit('motion', {
      timestamp: time,
      x: amplitude,
      y: amplitude * 0.62 + Math.sin(phase) * 0.08,
      z: amplitude * 0.35 + 0.12,
      rotation,
    });
    this._emit('wearability', {
      score: wearability,
      quality: wearability >= 75 ? WEARABILITY.GOOD : WEARABILITY.ADJUST,
    });
    this._emit('quality', { value: 96, updatesPerSecond: 4 });

    this._emitSession(this.isSessionActive ? SESSION_STATE.ACTIVE : SESSION_STATE.IDLE, intensity);
  }

  _emitSession(state, intensity = 0) {
    const now = Date.now();
    const durationSec = this.sessionStartedAt
      ? Math.max(0, Math.floor((now - this.sessionStartedAt) / 1000))
      : 0;
    const movement = this.isSessionActive ? Math.min(3, 1 + Math.floor((this.tick / 18) % 3)) : 0;
    const activityScore = this.isSessionActive
      ? Math.round(durationSec * 3.2 + intensity * 18 + Math.sin(this.tick * 0.25) * 3)
      : 0;
    const motionEvents = this.isSessionActive ? Math.max(0, Math.round(durationSec * 1.6)) : 0;

    this._emit('session', {
      state,
      movement,
      movementLabel: MOVEMENT[movement],
      durationSec,
      activityScore: Math.max(0, activityScore),
      motionEvents,
      intensity,
    });
  }
}
