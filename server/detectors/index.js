
const CreditCardTrialDetector = require('./financial/creditCardTrial');
const AutoSubscriptionDetector = require('./subscription/autoSubscription');
const ManipulativeButtonsDetector = require('./interface/manipulativeButtons');
const SneakIntoBasketDetector = require('./shopping/sneakIntoBasket');
const ContactAccessDetector = require('./privacy/contactAccess');
const FOMODetector = require('./psychological/fomo');
const BaitAndSwitchDetector = require('./interface/baitAndSwitch');
const ForcedContinuityDetector = require('./financial/forcedContinuity');
const HiddenCostsDetector = require('./financial/hiddenCosts');
const MisdirectionDetector = require('./interface/misdirection');
const RoachMotelDetector = require('./subscription/roachMotel');
const TrickQuestionsDetector = require('./interface/trickQuestions');
const PrivacyZuckeringDetector = require('./privacy/privacyZuckering');
const UrgencyTacticsDetector = require('./psychological/urgencyTactics');

const { PATTERN_TYPES } = require('../types/PatternTypes');

const DETECTORS = {
  [PATTERN_TYPES.CREDIT_CARD_TRIAL]: CreditCardTrialDetector.detect,
  [PATTERN_TYPES.AUTO_SUBSCRIPTION]: AutoSubscriptionDetector.detect,
  [PATTERN_TYPES.MANIPULATIVE_BUTTONS]: ManipulativeButtonsDetector.detect,
  [PATTERN_TYPES.SNEAK_INTO_BASKET]: SneakIntoBasketDetector.detect,
  [PATTERN_TYPES.CONTACT_ACCESS]: ContactAccessDetector.detect,
  [PATTERN_TYPES.FOMO]: FOMODetector.detect,
  [PATTERN_TYPES.BAIT_AND_SWITCH]: BaitAndSwitchDetector.detect,
  [PATTERN_TYPES.FORCED_CONTINUITY]: ForcedContinuityDetector.detect,
  [PATTERN_TYPES.HIDDEN_COSTS]: HiddenCostsDetector.detect,
  [PATTERN_TYPES.MISDIRECTION]: MisdirectionDetector.detect,
  [PATTERN_TYPES.ROACH_MOTEL]: RoachMotelDetector.detect,
  [PATTERN_TYPES.TRICK_QUESTIONS]: TrickQuestionsDetector.detect,
  [PATTERN_TYPES.PRIVACY_ZUCKERING]: PrivacyZuckeringDetector.detect,
  [PATTERN_TYPES.URGENCY_TACTICS]: UrgencyTacticsDetector.detect
};

module.exports = DETECTORS;