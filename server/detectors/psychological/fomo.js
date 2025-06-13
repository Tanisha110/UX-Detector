const DetectionUtils = require('../../core/utils');
const { SEVERITY_LEVELS, PATTERN_SOURCES } = require('../../types/PatternTypes');

class FOMODetector {
  /**
   * Detect Fear of Missing Out tactics
   * @param {Object} params - Detection parameters
   * @param {string} params.rawText - Raw text content
   * @param {string[]} params.headings - Heading texts
   * @param {string[]} params.alerts - Alert texts
   * @returns {Object} Detection result
   */
  static detect({ rawText, headings, alerts }) {
    const fomoKeywords = [
      'limited time', 'only', 'left', 'hurry', 'ending soon', 'last chance',
      'limited offer', 'expires', 'countdown', 'almost gone', 'few remaining',
      'act now', 'don\'t miss out', 'exclusive', 'today only'
    ];
    
    let fomoScore = 0;
    let allLocations = [];
    
    // Check raw text
    const textLocations = DetectionUtils.findTextLocations(rawText, fomoKeywords);
    textLocations.forEach(loc => {
      fomoScore++;
      allLocations.push({
        ...loc,
        source: PATTERN_SOURCES.RAW_TEXT,
        patternType: 'fomo',
        weight: 1
      });
    });
    
    // Check headings (higher weight)
    headings.forEach((heading, index) => {
      const headingLocations = DetectionUtils.findTextLocations(heading, fomoKeywords);
      headingLocations.forEach(loc => {
        fomoScore += 2;
        allLocations.push({
          ...loc,
          source: PATTERN_SOURCES.HEADINGS,
          headingIndex: index,
          headingText: heading,
          patternType: 'fomo',
          weight: 2
        });
      });
    });
    
    // Check alerts (highest weight)
    alerts.forEach((alert, index) => {
      const alertLocations = DetectionUtils.findTextLocations(alert, fomoKeywords);
      alertLocations.forEach(loc => {
        fomoScore += 3;
        allLocations.push({
          ...loc,
          source: PATTERN_SOURCES.ALERTS,
          alertIndex: index,
          alertText: alert,
          patternType: 'fomo',
          weight: 3
        });
      });
    });
    
    const detected = fomoScore >= 3;
    
    return {
      detected,
      severity: SEVERITY_LEVELS.MEDIUM,
      confidence: detected ? Math.min(fomoScore / 10, 1) : 0,
      description: 'Uses fear of missing out tactics to pressure users',
      evidence: {
        fomoScore,
        instances: allLocations.map(loc => ({
          location: loc.source,
          keyword: loc.term,
          context: loc.context
        }))
      },
      location: 'Headlines, alerts, and promotional content',
      exactLocations: allLocations,
      verificationData: {
        totalScore: fomoScore,
        textMentions: textLocations.length,
        headingMentions: allLocations.filter(loc => loc.source === PATTERN_SOURCES.HEADINGS).length,
        alertMentions: allLocations.filter(loc => loc.source === PATTERN_SOURCES.ALERTS).length
      }
    };
  }
}

module.exports = FOMODetector;