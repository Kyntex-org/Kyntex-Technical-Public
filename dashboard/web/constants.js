export const SESSION_STATE = Object.freeze({
  IDLE: 'idle',
  ACTIVE: 'active',
  ENDED: 'ended',
});

export const SESSION_LABEL = Object.freeze({
  [SESSION_STATE.IDLE]: 'Ready',
  [SESSION_STATE.ACTIVE]: 'Active',
  [SESSION_STATE.ENDED]: 'Complete',
});

export const MOVEMENT = Object.freeze({
  0: 'Rest',
  1: 'Walk',
  2: 'Run',
  3: 'Jump',
});

export const WEARABILITY = Object.freeze({
  GOOD: 'good',
  ADJUST: 'adjust',
});
