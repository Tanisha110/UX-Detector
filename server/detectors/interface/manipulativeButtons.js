const DetectionUtils = require('../../core/utils');
const { SEVERITY_LEVELS, PATTERN_SOURCES } = require('../../types/PatternTypes');

class ManipulativeButtonsDetector {
  /**
   * Detect manipulative button design patterns
   * @param {Object} params - Detection parameters
   * @param {string[]} params.buttons - Button texts
   * @param {string} params.rawText - Raw text content
   * @returns {Object} Detection result
   */
  static detect({ buttons, rawText }) {
    const manipulativePatterns = [
      { 
        positive: ['yes', 'accept', 'continue', 'start'], 
        negative: ['no', 'decline', 'cancel', 'skip'] 
      },
      { 
        positive: ['upgrade now', 'get premium'], 
        negative: ['maybe later', 'not now'] 
      }
    ];
    
    let detected = false;
    let evidence = [];
    let allLocations = [];
    
    manipulativePatterns.forEach((pattern, patternIndex) => {
      const positiveButtonLocations = DetectionUtils.findArrayItemLocations(buttons, pattern.positive);
      const negativeButtonLocations = DetectionUtils.findArrayItemLocations(buttons, pattern.negative);
      
      // Also check if negative options are mentioned in text but not as buttons
      const negativeTextLocations = DetectionUtils.findTextLocations(rawText, pattern.negative);
      
      if (positiveButtonLocations.length > 0 && negativeButtonLocations.length === 0) {
        detected = true;
        evidence.push({
          patternIndex,
          positiveButtons: positiveButtonLocations.map(loc => loc.arrayItem),
          missingNegativeOptions: pattern.negative,
          negativeInText: negativeTextLocations.length > 0
        });
        
        allLocations.push(...positiveButtonLocations.map(loc => ({
          ...loc,
          source: PATTERN_SOURCES.BUTTONS,
          patternType: 'manipulativePositive',
          patternIndex
        })));
      }
    });
    
    return {
      detected,
      severity: SEVERITY_LEVELS.MEDIUM,
      confidence: detected ? 0.6 : 0,
      description: 'Manipulative button design - positive actions emphasized, negative options hidden',
      evidence,
      location: 'Interactive buttons',
      exactLocations: allLocations,
      verificationData: {
        patternsFound: evidence.length,
        totalPositiveButtons: allLocations.length
      }
    };
  }
}

module.exports = ManipulativeButtonsDetector;
