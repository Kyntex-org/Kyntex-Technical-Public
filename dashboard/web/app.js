import { ChartManager, Sparkline } from './charts.js';
import { DemoTelemetry } from './demo-data.js';
import { SESSION_STATE, WEARABILITY } from './constants.js';
import { Store } from './store.js';

const demo = new DemoTelemetry();
const store = new Store();
const charts = new ChartManager();
const $ = (id) => document.getElementById(id);

const element = {
  statusDot: $('statusDot'),
  statusText: $('statusText'),
  sourceText: $('sourceText'),
  qualityBar: $('qualityBar'),
  qualityText: $('qualityText'),
  restartBtn: $('restartBtn'),
  sessionState: $('sessionState'),
  activityScore: $('activityScore'),
  activityLabel: $('activityLabel'),
  timer: $('timer'),
  motionEvents: $('motionEvents'),
  peakSignal: $('peakSignal'),
  startBtn: $('startBtn'),
  stopBtn: $('stopBtn'),
  resetBtn: $('resetBtn'),
  wearabilityRing: $('wearabilityRing'),
  wearabilityScore: $('wearabilityScore'),
  wearabilityLabel: $('wearabilityLabel'),
  activityTotal: $('activityTotal'),
  activityRate: $('activityRate'),
  intensity: $('intensity'),
  sourceState: $('sourceState'),
  timeline: $('timeline'),
  weekly: $('weekly'),
  historyList: $('historyList'),
  summaryModal: $('summaryModal'),
  summaryBody: $('summaryBody'),
  summaryClose: $('summaryClose'),
  summaryJSON: $('summaryJSON'),
  summaryCSV: $('summaryCSV'),
};

const spark = {
  motion: charts.add(new Sparkline($('chartMotion'), {
    color: '#39ff88', min: 0, max: 1.6, emptyLabel: 'Preparing synthetic stream',
  })),
  rotation: charts.add(new Sparkline($('chartRotation'), {
    color: '#5ad1ff', min: 0, max: 1.3, emptyLabel: 'Preparing synthetic stream',
  })),
  wearability: charts.add(new Sparkline($('chartWearability'), {
    color: '#ffb454', min: 0, max: 100, emptyLabel: 'Preparing synthetic stream',
  })),
  activity: charts.add(new Sparkline($('chartActivity'), {
    color: '#ff5a8a', min: 0, max: 150, emptyLabel: 'Start a demo session',
  })),
  intensity: charts.add(new Sparkline($('chartIntensity'), {
    color: '#c08aff', min: 0, max: 1, emptyLabel: 'Preparing synthetic stream',
  })),
};
charts.start();

demo.on('status', (value) => store.ingestStatus(value));
demo.on('quality', (value) => store.ingestQuality(value));
demo.on('motion', (value) => store.ingestMotion(value));
demo.on('wearability', (value) => store.ingestWearability(value));
demo.on('session', (value) => store.ingestSession(value));

element.restartBtn.onclick = () => demo.restart();
element.startBtn.onclick = () => demo.startSession();
element.stopBtn.onclick = () => demo.endSession();
element.resetBtn.onclick = () => store.clearHistory();
element.summaryClose.onclick = () => element.summaryModal.classList.remove('open');
element.summaryJSON.onclick = () => store.lastSummary && store.exportSessionJSON(store.lastSummary);
element.summaryCSV.onclick = () => store.lastSummary && store.exportSessionCSV(store.lastSummary);

store.subscribe(render);
let previousSummaryId = null;
let previousTimelineKey = null;
let previousHistoryKey = null;
let previousWeeklyKey = null;

function render(state) {
  const live = state.live;
  const session = live.session;
  const isActive = session.state === SESSION_STATE.ACTIVE;

  element.statusDot.className = 'dot connected';
  element.statusText.textContent = live.statusLabel;
  element.sourceText.textContent = 'No hardware required';
  element.qualityBar.style.width = `${live.quality}%`;
  element.qualityText.textContent = `${live.updatesPerSecond}/s demo`;
  element.sourceState.textContent = live.statusState === 'demo' ? 'Live' : 'Paused';

  element.sessionState.textContent = session.stateLabel;
  element.sessionState.className = `pill state-${session.state}`;
  element.activityScore.textContent = session.activityScore;
  element.activityLabel.textContent = session.movementLabel;
  element.activityLabel.className = `activity m${session.movement + 1}`;
  element.timer.textContent = formatDuration(session.durationSec);
  element.motionEvents.textContent = session.motionEvents;
  element.peakSignal.textContent = session.intensity.toFixed(1);
  element.startBtn.disabled = isActive;
  element.stopBtn.disabled = !isActive;

  const wearability = live.wearability;
  element.wearabilityScore.textContent = wearability.score ?? '—';
  setRing(element.wearabilityRing, wearability.score || 0);
  element.wearabilityLabel.textContent = wearability.quality === WEARABILITY.GOOD
    ? 'Good demo quality'
    : 'Illustrative adjustment';
  element.wearabilityLabel.className = `fit-status ${wearability.quality === WEARABILITY.GOOD ? 'ok' : 'warn'}`;

  element.activityTotal.textContent = session.activityScore;
  element.activityRate.textContent = session.durationSec
    ? `${(session.activityScore * 60 / session.durationSec).toFixed(1)}/min`
    : '0/min';
  element.intensity.textContent = session.intensity.toFixed(2);

  spark.motion.setData(state.series.motion);
  spark.rotation.setData(state.series.rotation);
  spark.wearability.setData(state.series.wearability);
  spark.activity.setData(state.series.activity);
  spark.intensity.setData(state.series.intensity);

  renderTimeline(state.session?.timeline || []);
  renderHistory(state.history);
  renderWeekly(state.history);

  if (state.lastSummary && state.lastSummary.id !== previousSummaryId) {
    previousSummaryId = state.lastSummary.id;
    showSummary(state.lastSummary);
  }
}

function setRing(circle, percentage) {
  const radius = Number(circle.getAttribute('r')) || 52;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - percentage / 100)}`;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function renderTimeline(timeline) {
  const key = timeline.map((item) => `${item.t}:${item.movement}`).join('|');
  if (key === previousTimelineKey) return;
  previousTimelineKey = key;
  if (!timeline.length) {
    element.timeline.innerHTML = '<span class="muted">Start a demo session to build a timeline</span>';
    return;
  }
  element.timeline.innerHTML = timeline.slice(-30).map((item) =>
    `<span class="chip m${item.movement + 1}" title="${new Date(item.t).toLocaleTimeString()}">${item.label}</span>`
  ).join('');
}

function renderHistory(history) {
  const key = history.map((item) => `${item.id}:${item.activityScore}:${item.durationSec}`).join('|');
  if (key === previousHistoryKey) return;
  previousHistoryKey = key;
  if (!history.length) {
    element.historyList.innerHTML = '<li class="muted">No sessions recorded</li>';
    return;
  }
  element.historyList.innerHTML = history.slice(0, 12).map((item) => `
    <li data-id="${item.id}">
      <div class="hl-main">
        <span class="hl-date">${new Date(item.startedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        <span class="hl-dur">${formatDuration(item.durationSec)}</span>
      </div>
      <div class="hl-stats">
        <span>Score ${item.activityScore}</span>
        <span>${item.motionEvents} events</span>
        <span>Peak ${item.peakSignal}</span>
      </div>
    </li>`).join('');
  element.historyList.querySelectorAll('li[data-id]').forEach((row) => {
    row.onclick = () => {
      const summary = history.find((item) => item.id === row.dataset.id);
      if (summary) {
        store.lastSummary = summary;
        showSummary(summary);
      }
    };
  });
}

function renderWeekly(history) {
  const key = history.map((item) => `${item.id}:${item.activityScore}:${item.startedAt}`).join('|');
  if (key === previousWeeklyKey) return;
  previousWeeklyKey = key;
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totals = new Array(7).fill(0);
  const cutoff = Date.now() - 7 * 86400000;
  for (const item of history) {
    if (item.startedAt >= cutoff) totals[new Date(item.startedAt).getDay()] += item.activityScore;
  }
  const maximum = Math.max(1, ...totals);
  element.weekly.innerHTML = totals.map((value, index) => `
    <div class="bar" aria-label="${labels[index]}: ${value} activity score">
      <div class="bar-fill" style="height:${value ? Math.max(6, (value / maximum) * 100) : 0}%"></div>
      <span class="bar-label">${labels[index]}</span>
    </div>`).join('');
}

function showSummary(summary) {
  const breakdown = (summary.movementBreakdown || []).map((item) =>
    `<div class="bd-row"><span>${item.label}</span><div class="bd-bar"><div style="width:${item.percent}%"></div></div><span>${item.percent}%</span></div>`
  ).join('');
  element.summaryBody.innerHTML = `
    <div class="sum-grid">
      <div><label>Duration</label><b>${formatDuration(summary.durationSec)}</b></div>
      <div><label>Activity score</label><b>${summary.activityScore}</b></div>
      <div><label>Activity rate</label><b>${summary.durationSec ? (summary.activityScore * 60 / summary.durationSec).toFixed(1) : 0}/min</b></div>
      <div><label>Motion events</label><b>${summary.motionEvents}</b></div>
      <div><label>Peak intensity</label><b>${summary.peakIntensity.toFixed(2)}</b></div>
      <div><label>Average signal</label><b>${summary.averageSignal.toFixed(2)}</b></div>
      <div><label>Peak signal</label><b>${summary.peakSignal.toFixed(2)}</b></div>
      <div><label>Wearability</label><b>${summary.averageWearability ?? '—'}</b></div>
    </div>
    <h4>Pattern breakdown</h4>
    <div class="breakdown">${breakdown || '<span class="muted">No data</span>'}</div>`;
  element.summaryModal.classList.add('open');
}

demo.connect();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('../sw.js', import.meta.url)).catch(() => {});
}
