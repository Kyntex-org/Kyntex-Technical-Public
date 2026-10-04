import test from 'node:test';
import assert from 'node:assert/strict';
import { Store, DEMO_LIMITS } from '../web/store.js';
import { SESSION_STATE } from '../web/constants.js';

const key = 'kyntex.public.sessions.v2';
function memoryStorage() {
  const values = new Map();
  return { getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => values.set(name, value) };
}
function state(status, movement = 1) {
  return { state: status, movement, durationSec: 10, activityScore: 20,
    motionEvents: 2, intensity: 0.5 };
}
function complete(store) {
  store.ingestSession(state(SESSION_STATE.ACTIVE));
  store.ingestMotion({ timestamp: 1, x: 1, y: 0, z: 0, rotation: 0.2 });
  store.ingestSession(state(SESSION_STATE.ENDED));
}

test('long sessions bound live charts, retained samples and movement changes without losing totals', () => {
  const store = new Store({ storage: memoryStorage() });
  store.ingestSession(state(SESSION_STATE.ACTIVE));
  const total = DEMO_LIMITS.samples + 100;
  for (let i = 0; i < total; i++) {
    store.ingestMotion({ timestamp: i, x: 2, y: 0, z: 0, rotation: 0.2 });
    store.ingestSession(state(SESSION_STATE.ACTIVE, i % 3));
  }
  assert.equal(store.series.motion.length, 240);
  assert.equal(store.session.timeline.length, DEMO_LIMITS.timeline);
  store.ingestSession(state(SESSION_STATE.ENDED));
  assert.equal(store.lastSummary.sampleCount, total);
  assert.equal(store.lastSummary.samples.length, DEMO_LIMITS.samples);
  assert.equal(store.lastSummary.droppedSamples, 100);
  assert.equal(store.lastSummary.averageSignal, 2);
  assert.ok(store.lastSummary.droppedTimelineEntries > 0);
});

test('history stays bounded in memory and survives reload as summaries only', () => {
  const storage = memoryStorage();
  const store = new Store({ storage });
  for (let i = 0; i < DEMO_LIMITS.history + 10; i++) complete(store);
  assert.equal(store.history.length, DEMO_LIMITS.history);
  assert.equal(new Set(store.history.map((row) => row.id)).size, DEMO_LIMITS.history);
  const reloaded = new Store({ storage });
  assert.equal(reloaded.history.length, DEMO_LIMITS.history);
  assert.equal(reloaded.history[0].sampleCount, 1);
  assert.equal(reloaded.history[0].samples, undefined);
});

test('clear history does not resurrect completed demo sessions after reload', () => {
  const storage = memoryStorage();
  const store = new Store({ storage });
  complete(store);
  store.clearHistory();
  assert.deepEqual(new Store({ storage }).history, []);
  assert.equal(store.lastSummary, null);
});

test('a failed write is visible and a later successful write clears the warning', () => {
  const storage = memoryStorage();
  const save = storage.setItem;
  const store = new Store({ storage });
  storage.setItem = () => { throw new Error('Quota exceeded'); };
  const original = console.warn;
  console.warn = () => {};
  try { complete(store); } finally { console.warn = original; }
  assert.match(store.persistenceError, /could not be saved/);
  assert.equal(store.history.length, 1);
  storage.setItem = save;
  complete(store);
  assert.equal(store.persistenceError, null);
  assert.equal(new Store({ storage }).history.length, 2);
});

test('corrupt or structurally invalid saved history cannot break initialization', () => {
  const storage = memoryStorage();
  storage.setItem(key, '{');
  assert.deepEqual(new Store({ storage }).history, []);
  storage.setItem(key, JSON.stringify([null, {}, 'bad']));
  assert.deepEqual(new Store({ storage }).history, []);
});

test('loading older history applies limits and strips raw samples', () => {
  const storage = memoryStorage();
  const store = new Store({ storage });
  complete(store);
  const row = { ...store.lastSummary, timeline: Array.from({ length: 400 }, () => ({ t: 0, movement: 1 })) };
  storage.setItem(key, JSON.stringify(Array.from({ length: 70 }, (_, i) => ({ ...row, id: `old-${i}` }))));
  const history = new Store({ storage }).history;
  assert.equal(history.length, DEMO_LIMITS.history);
  assert.equal(history[0].timeline.length, DEMO_LIMITS.timeline);
  assert.equal(history[0].samples, undefined);
});

test('JSON reports partial capture and CSV contains only retained samples', async () => {
  const store = new Store({ storage: memoryStorage() });
  complete(store);
  const files = [];
  store._download = (blob, name) => files.push({ blob, name });
  store.exportSessionJSON(store.lastSummary);
  store.exportSessionCSV(store.lastSummary);
  assert.equal(JSON.parse(await files[0].blob.text()).retainedSampleCount, 1);
  assert.equal((await files[1].blob.text()).trim().split('\n').length, 2);
});
