class DetectionUtils {
  /**
   * Find exact text locations with context
   * @param {string} text - Text to search in
   * @param {string[]} searchTerms - Terms to search for
   * @param {number} contextLength - Context length around matches
   * @returns {Array} Array of location objects
   */
  static findTextLocations(text, searchTerms, contextLength = 50) {
    const locations = [];
    const lowerText = text.toLowerCase();
    
    searchTerms.forEach(term => {
      const lowerTerm = term.toLowerCase();
      let index = 0;
      
      while ((index = lowerText.indexOf(lowerTerm, index)) !== -1) {
        const start = Math.max(0, index - contextLength);
        const end = Math.min(text.length, index + term.length + contextLength);
        
        locations.push({
          term: term,
          startIndex: index,
          endIndex: index + term.length,
          context: text.substring(start, end),
          exactMatch: text.substring(index, index + term.length),
          contextStart: start,
          contextEnd: end
        });
        
        index += term.length;
      }
    });
    
    return locations;
  }

  /**
   * Find items in arrays with their original positions
   * @param {string[]} items - Array of items to search
   * @param {string[]} searchTerms - Terms to search for
   * @returns {Array} Array of location objects
   */
  static findArrayItemLocations(items, searchTerms) {
    const locations = [];
    
    items.forEach((item, itemIndex) => {
      searchTerms.forEach(term => {
        if (item.toLowerCase().includes(term.toLowerCase())) {
          locations.push({
            term: term,
            arrayIndex: itemIndex,
            arrayItem: item,
            itemType: 'array_item'
          });
        }
      });
    });
    
    return locations;
  }

  /**
   * Calculate risk score based on detected patterns
   * @param {Array} patterns - Array of detected patterns
   * @returns {number} Risk score (0-100)
   */
  static calculateRiskScore(patterns) {
    const weights = {
      high: 3,
      medium: 2,
      low: 1
    };
    
    const totalScore = patterns.reduce((sum, pattern) => {
      return sum + (weights[pattern.severity] * pattern.confidence);
    }, 0);
    
    const maxPossibleScore = patterns.length * 3;
    return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  }
}

module.exports = DetectionUtils;