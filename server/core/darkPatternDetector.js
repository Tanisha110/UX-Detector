const DETECTORS = require('../detectors');
const DetectionUtils = require('./utils');
const ReportGenerator = require('../reports/ReportGenerator');

class DarkPatternDetector {
  constructor() {
    this.patterns = DETECTORS;
  }

  /**
   * Main detection method with enhanced location tracking
   * @param {Object} uxSessionData - UX session data containing url, rawText, headings, buttons, alerts
   * @returns {Promise<Object>} Analysis result with detected patterns
   */
  async detectDarkPatterns(uxSessionData) {
    const { url, rawText, headings, buttons, alerts } = uxSessionData;
    const detectedPatterns = [];

    for (const [patternName, detector] of Object.entries(this.patterns)) {
      try {
        const result = await detector({ rawText, headings, buttons, alerts, url });
        if (result.detected) {
          detectedPatterns.push({
            type: patternName,
            severity: result.severity,
            confidence: result.confidence,
            description: result.description,
            evidence: result.evidence,
            location: result.location,
            exactLocations: result.exactLocations || [],
            verificationData: result.verificationData || {}
          });
        }
      } catch (error) {
        console.error(`Error detecting ${patternName}:`, error);
      }
    }

    return {
      url,
      timestamp: new Date().toISOString(),
      totalPatterns: detectedPatterns.length,
      patterns: detectedPatterns,
      riskScore: DetectionUtils.calculateRiskScore(detectedPatterns)
    };
  }

  /**
   * Generate verification report
   * @param {Object} analysisResult - Result from detectDarkPatterns
   * @returns {Object} Verification report
   */
  generateVerificationReport(analysisResult) {
    return ReportGenerator.generateVerificationReport(analysisResult);
  }
}

module.exports = DarkPatternDetector;