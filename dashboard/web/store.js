import { MOVEMENT, SESSION_LABEL, SESSION_STATE, WEARABILITY } from './constants.js';

const HISTORY_KEY = 'kyntex.public.sessions.v2';
const MAX_LIVE_POINTS = 240;

export class Store {
  constructor() {
    this.live = {
      statusState: 'simulated',
      statusLabel: 'Simulated sensor stream',
      quality: 0,
      updatesPerSecond: 0,
      wearability: { score: null, quality: WEARABILITY.GOOD },
      session: {
        state: SESSION_STATE.IDLE,
        stateLabel: SESSION_LABEL[SESSION_STATE.IDLE],
        movement: 0,
        movementLabel: MOVEMENT[0],
        durationSec: 0,
        activityScore: 0,
        motionEvents: 0,
        intensity: 0,
      },
    };

    this.series = {
      motion: [],
      rotation: [],
      wearability: [],
      activity: [],
      intensity: [],
    };
    this.session = null;
    this.history = this._loadHistory();
    this.lastSummary = null;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  _notify() {
    for (const callback of this.subscribers) callback(this);
  }

  _push(series, point) {
    const values = this.series[series];
    values.push(point);
    if (values.length > MAX_LIVE_POINTS) values.shift();
  }

  ingestStatus(status) {
    this.live.statusState = status.state;
    this.live.statusLabel = status.label;
    this._notify();
  }

  ingestQuality(quality) {
    this.live.quality = quality.value;
    this.live.updatesPerSecond = quality.updatesPerSecond;
    this._notify();
  }

  ingestMotion(sample) {
    const amplitude = Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
    this._push('motion', { t: sample.timestamp, v: amplitude });
    this._push('rotation', { t: sample.timestamp, v: sample.rotation });

    if (this.session) {
      this.session.samples.push({
        t: sample.timestamp,
        amplitude: Number(amplitude.toFixed(4)),
        rotation: Number(sample.rotation.toFixed(4)),
      });
      this.session.signalTotal += amplitude;
      this.session.signalCount += 1;
      this.session.peakSignal = Math.max(this.session.peakSignal, amplitude);
    }
    this._notify();
  }

  ingestWearability(value) {
    this.live.wearability = value;
    this._push('wearability', { t: Date.now(), v: value.score });
    if (this.session) {
      this.session.wearabilityTotal += value.score;
      this.session.wearabilityCount += 1;
    }
    this._notify();
  }

  ingestSession(value) {
    if (value.state === SESSION_STATE.ACTIVE && !this.session) this._beginSession();

    this.live.session = {
      ...value,
      stateLabel: SESSION_LABEL[value.state] || SESSION_LABEL[SESSION_STATE.IDLE],
      movementLabel: MOVEMENT[value.movement] || MOVEMENT[0],
    };
    this._push('activity', { t: Date.now(), v: value.activityScore });
    this._push('intensity', { t: Date.now(), v: value.intensity });

    if (this.session) {
      if (value.movement !== this.session.lastMovement) {
        this.session.timeline.push({
          t: Date.now(),
          movement: value.movement,
          label: MOVEMENT[value.movement] || MOVEMENT[0],
        });
        this.session.lastMovement = value.movement;
      }
      this.session.movementCounts[value.movement] = (this.session.movementCounts[value.movement] || 0) + 1;
      this.session.peakIntensity = Math.max(this.session.peakIntensity, value.intensity);
    }

    if (value.state === SESSION_STATE.ENDED && this.session) this._endSession(value);
    this._notify();
  }

  _beginSession() {
    this.session = {
      id: `session-${Date.now()}`,
      startedAt: Date.now(),
      samples: [],
      timeline: [],
      movementCounts: {},
      signalTotal: 0,
      signalCount: 0,
      peakSignal: 0,
      peakIntensity: 0,
      wearabilityTotal: 0,
      wearabilityCount: 0,
      lastMovement: -1,
    };
  }

  _endSession(finalValue) {
    const session = this.session;
    const movementTotal = Object.values(session.movementCounts).reduce((sum, count) => sum + count, 0) || 1;
    const movementBreakdown = Object.entries(session.movementCounts)
      .map(([movement, count]) => ({
        movement: Number(movement),
        label: MOVEMENT[movement] || MOVEMENT[0],
        percent: Math.round((count / movementTotal) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);

    const summary = {
      id: session.id,
      startedAt: session.startedAt,
      endedAt: Date.now(),
      durationSec: finalValue.durationSec,
      activityScore: finalValue.activityScore,
      motionEvents: finalValue.motionEvents,
      peakIntensity: Number(session.peakIntensity.toFixed(3)),
      averageSignal: session.signalCount ? Number((session.signalTotal / session.signalCount).toFixed(3)) : 0,
      peakSignal: Number(session.peakSignal.toFixed(3)),
      averageWearability: session.wearabilityCount
        ? Math.round(session.wearabilityTotal / session.wearabilityCount)
        : null,
      movementBreakdown,
      timeline: session.timeline,
      sampleCount: session.samples.length,
      samples: session.samples,
    };

    this.history.unshift(summary);
    this._saveHistory();
    this.lastSummary = summary;
    this.session = null;
  }

  _loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const history = raw ? JSON.parse(raw) : [];
      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }

  _saveHistory() {
    try {
      const conciseHistory = this.history.map(({ samples, ...summary }) => summary).slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(conciseHistory));
    } catch (error) {
      console.warn('Unable to save local session history.', error);
    }
  }

  clearHistory() {
    this.history = [];
    this.lastSummary = null;
    this._saveHistory();
    this._notify();
  }

  exportSessionJSON(session) {
    this._download(
      new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' }),
      `kyntex-session-${session.id}.json`
    );
  }

  exportSessionCSV(session) {
    const header = 'timestamp,relative_amplitude,relative_rotation\n';
    const rows = (session.samples || []).map((sample) =>
      `${sample.t},${sample.amplitude},${sample.rotation}`
    ).join('\n');
    this._download(new Blob([header + rows], { type: 'text/csv' }), `kyntex-session-${session.id}.csv`);
  }

  _download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
