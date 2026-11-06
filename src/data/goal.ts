// The one live health goal. Screens read name and tag from here; never retype either string.
export const GOAL = {
  goal_id: 'ldl',
  name: 'Healthy LDL cholesterol',
  tag: 'LDL-friendly',
} as const;

// DRAFT: pending RD review. Per-serving thresholds for the LDL-friendly bar.
export const GOAL_BAR = {
  maxSatFatG: 4,
  minFiberG: 6,
  qualifyingTiers: ['A', 'B'] as const,
};

// FDA Daily Values used only to show % DV on the nutrient panel.
export const DAILY_VALUE = { fiberG: 28, proteinG: 50, satFatG: 20, sodiumMg: 2300 };
