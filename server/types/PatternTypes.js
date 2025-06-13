const PATTERN_TYPES = {
  CREDIT_CARD_TRIAL: 'creditCardForFreeTrial',
  AUTO_SUBSCRIPTION: 'autoSubscriptionToEmails',
  MANIPULATIVE_BUTTONS: 'manipulativeButtons',
  SNEAK_INTO_BASKET: 'sneakIntoBasket',
  CONTACT_ACCESS: 'contactAccess',
  FOMO: 'fomo',
  BAIT_AND_SWITCH: 'baitAndSwitch',
  FORCED_CONTINUITY: 'forcedContinuity',
  HIDDEN_COSTS: 'hiddenCosts',
  MISDIRECTION: 'misdirection',
  ROACH_MOTEL: 'roachMotel',
  TRICK_QUESTIONS: 'trickQuestions',
  PRIVACY_ZUCKERING: 'privacyZuckering',
  URGENCY_TACTICS: 'urgencyTactics'
};

const SEVERITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const PATTERN_SOURCES = {
  RAW_TEXT: 'rawText',
  BUTTONS: 'buttons',
  HEADINGS: 'headings',
  ALERTS: 'alerts'
};

module.exports = {
  PATTERN_TYPES,
  SEVERITY_LEVELS,
  PATTERN_SOURCES
};
