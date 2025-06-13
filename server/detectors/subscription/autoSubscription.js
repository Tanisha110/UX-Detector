const DetectionUtils = require('../../core/utils');
const { SEVERITY_LEVELS, PATTERN_SOURCES } = require('../../types/PatternTypes');

class AutoSubscriptionDetector {
  /**
   * Detect automatic subscription to emails/newsletters
   * @param {Object} params - Detection parameters
   * @param {string} params.rawText - Raw text content
   * @param {string[]} params.buttons - Button texts
   * @returns {Object} Detection result
   */
  static detect({ rawText, buttons }) {
    const emailKeywords = ['newsletter', 'email updates', 'promotional emails', 'marketing emails', 'subscribe'];
    const autoSubscribeIndicators = ['automatically', 'by default', 'pre-selected', 'opt-out'];
    
    const emailLocations = DetectionUtils.findTextLocations(rawText, emailKeywords);
    const autoLocations = DetectionUtils.findTextLocations(rawText, autoSubscribeIndicators);
    
    const hasEmailSubscription = emailLocations.length > 0;
    const hasAutoSubscribeLanguage = autoLocations.length > 0;
    
    // Look for specific opt-out patterns
    const optOutPatterns = ['opt-out', 'uncheck to not receive'];
    const optOutLocations = DetectionUtils.findTextLocations(rawText, optOutPatterns);
    const hasOptOut = optOutLocations.length > 0;
    
    const detected = hasEmailSubscription && (hasAutoSubscribeLanguage || hasOptOut);
    
    return {
      detected,
      severity: SEVERITY_LEVELS.MEDIUM,
      confidence: detected ? 0.7 : 0,
      description: 'Automatically subscribes users to emails/newsletters',
      evidence: {
        emailMentions: emailLocations.map(loc => loc.term),
        autoLanguage: autoLocations.map(loc => loc.term)
      },
      location: 'Signup forms and checkboxes',
      exactLocations: [
        ...emailLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.RAW_TEXT,
          patternType: 'emailSubscription'
        })),
        ...autoLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.RAW_TEXT,
          patternType: 'autoSubscribe'
        })),
        ...optOutLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.RAW_TEXT,
          patternType: 'optOut'
        }))
      ],
      verificationData: {
        emailMentionCount: emailLocations.length,
        autoLanguageCount: autoLocations.length,
        optOutCount: optOutLocations.length
      }
    };
  }
}

module.exports = AutoSubscriptionDetector;