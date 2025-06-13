class ReportGenerator {
  /**
   * Generate verification report from analysis results
   * @param {Object} analysisResult - Result from detectDarkPatterns
   * @returns {Object} Verification report
   */
  static generateVerificationReport(analysisResult) {
    const report = {
      url: analysisResult.url,
      timestamp: analysisResult.timestamp,
      summary: {
        totalPatterns: analysisResult.totalPatterns,
        riskScore: analysisResult.riskScore,
        highSeverityPatterns: analysisResult.patterns.filter(p => p.severity === 'high').length,
        mediumSeverityPatterns: analysisResult.patterns.filter(p => p.severity === 'medium').length,
        lowSeverityPatterns: analysisResult.patterns.filter(p => p.severity === 'low').length
      },
      patternDetails: analysisResult.patterns.map(pattern => ({
        type: pattern.type,
        severity: pattern.severity,
        confidence: pattern.confidence,
        description: pattern.description,
        locationCount: pattern.exactLocations ? pattern.exactLocations.length : 0,
        verificationSnippets: pattern.exactLocations ? 
          pattern.exactLocations.slice(0, 3).map(loc => ({
            source: loc.source,
            context: loc.context,
            exactMatch: loc.exactMatch,
            position: loc.startIndex
          })) : [],
        verificationData: pattern.verificationData
      }))
    };
    
    return report;
  }

  /**
   * Generate summary statistics for multiple analyses
   * @param {Array} analysisResults - Array of analysis results
   * @returns {Object} Summary statistics
   */
  static generateSummaryStats(analysisResults) {
    const stats = {
      totalSites: analysisResults.length,
      averageRiskScore: 0,
      patternFrequency: {},
      severityBreakdown: { high: 0, medium: 0, low: 0 },
      mostCommonPatterns: [],
      timeline: []
    };

    let totalRiskScore = 0;
    const patternCounts = {};

    analysisResults.forEach(result => {
      totalRiskScore += result.riskScore;
      
      result.patterns.forEach(pattern => {
        // Count pattern frequency
        patternCounts[pattern.type] = (patternCounts[pattern.type] || 0) + 1;
        
        // Count severity
        stats.severityBreakdown[pattern.severity]++;
      });

      // Add to timeline
      stats.timeline.push({
        timestamp: result.timestamp,
        url: result.url,
        riskScore: result.riskScore,
        patternCount: result.totalPatterns
      });
    });

    stats.averageRiskScore = analysisResults.length > 0 ? 
      Math.round(totalRiskScore / analysisResults.length) : 0;

    // Sort patterns by frequency
    stats.mostCommonPatterns = Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));

    stats.patternFrequency = patternCounts;

    return stats;
  }
}

module.exports = ReportGenerator;