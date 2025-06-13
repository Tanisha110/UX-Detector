const DetectionUtils = require('../../core/utils');
const { SEVERITY_LEVELS, PATTERN_SOURCES } = require('../../types/PatternTypes');

class CreditCardTrialDetector {
  static detect({ rawText, buttons }) {
    const freeTrialKeywords = ['free trial', 'trial', 'free', 'no charge', 'try free'];
    const creditCardKeywords = ['credit card', 'payment', 'billing', 'card number', 'visa', 'mastercard'];
    
    // Find exact locations in text
    const freeTrialLocations = DetectionUtils.findTextLocations(rawText, freeTrialKeywords);
    const creditCardLocations = DetectionUtils.findTextLocations(rawText, creditCardKeywords);
    
    // Find locations in buttons
    const buttonLocations = DetectionUtils.findArrayItemLocations(buttons, creditCardKeywords);
    
    const hasFreeTrial = freeTrialLocations.length > 0;
    const hasCreditCardMention = creditCardLocations.length > 0;
    const hasPaymentButtons = buttonLocations.length > 0;
    
    const detected = hasFreeTrial && (hasCreditCardMention || hasPaymentButtons);
    
    return {
      detected,
      severity: SEVERITY_LEVELS.HIGH,
      confidence: detected ? 0.8 : 0,
      description: 'Requires credit card information for free trial',
      evidence: {
        freeTrialMentions: freeTrialLocations.map(loc => loc.term),
        paymentMentions: creditCardLocations.map(loc => loc.term),
        suspiciousButtons: buttonLocations.map(loc => loc.arrayItem)
      },
      location: 'Form fields and payment section',
      exactLocations: [
        ...freeTrialLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.RAW_TEXT,
          patternType: 'freeTrial'
        })),
        ...creditCardLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.RAW_TEXT,
          patternType: 'creditCard'
        })),
        ...buttonLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.BUTTONS,
          patternType: 'creditCard'
        }))
      ],
      verificationData: {
        freeTrialCount: freeTrialLocations.length,
        creditCardCount: creditCardLocations.length,
        buttonCount: buttonLocations.length
      }
    };
  }
}

module.exports = CreditCardTrialDetector;