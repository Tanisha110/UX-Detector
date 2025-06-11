// models/UXsession.js
const mongoose = require('mongoose');

// Define exact location schema for precise tracking
const exactLocationSchema = new mongoose.Schema({
  term: String,
  startIndex: Number,
  endIndex: Number,
  context: String,
  exactMatch: String,
  contextStart: Number,
  contextEnd: Number,
  source: {
    type: String,
    enum: ['rawText', 'buttons', 'headings', 'alerts']
  },
  patternType: String,
  arrayIndex: Number,
  arrayItem: String,
  itemType: String,
  headingIndex: Number,
  headingText: String,
  alertIndex: Number,
  alertText: String,
  weight: Number,
  patternIndex: Number
}, { _id: false });

// Define verification data schema
const verificationDataSchema = new mongoose.Schema({
  freeTrialCount: Number,
  creditCardCount: Number,
  buttonCount: Number,
  emailMentionCount: Number,
  autoLanguageCount: Number,
  optOutCount: Number,
  patternsFound: Number,
  totalPositiveButtons: Number,
  checkoutMentions: Number,
  additionalItemMentions: Number,
  preselectedMentions: Number,
  totalScore: Number,
  textMentions: Number,
  headingMentions: Number,
  alertMentions: Number,
  baitButtonCount: Number,
  switchWordCount: Number,
  matchedPairs: Number,
  trickPatternCount: Number,
  foundPatterns: [String]
}, { _id: false, strict: false }); // Allow additional fields

// Define the dark pattern schema with enhanced tracking
const darkPatternSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  evidence: {
    type: mongoose.Schema.Types.Mixed, // Allows any structure
    default: {}
  },
  location: {
    type: String,
    required: true
  },
  exactLocations: {
    type: [exactLocationSchema],
    default: []
  },
  verificationData: {
    type: verificationDataSchema,
    default: {}
  }
}, { _id: false });

// Define the dark patterns analysis schema
const darkPatternsAnalysisSchema = new mongoose.Schema({
  totalPatterns: {
    type: Number,
    default: 0,
    min: 0
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  patterns: {
    type: [darkPatternSchema],
    default: [],
    validate: {
      validator: function(patterns) {
        return Array.isArray(patterns);
      },
      message: 'Patterns must be an array'
    }
  },
  analysisTimestamp: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { _id: false });

// Main UX Session schema
const uxSessionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(url) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  rawText: {
    type: String,
    required: [true, 'Raw text is required'],
    minlength: [1, 'Raw text cannot be empty']
  },
  deviceInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString(),
    validate: {
      validator: function(timestamp) {
        return !isNaN(Date.parse(timestamp));
      },
      message: 'Invalid timestamp format'
    }
  },
  headings: {
    type: [String],
    default: [],
    validate: {
      validator: function(headings) {
        return Array.isArray(headings);
      },
      message: 'Headings must be an array'
    }
  },
  buttons: {
    type: [String],
    default: [],
    validate: {
      validator: function(buttons) {
        return Array.isArray(buttons);
      },
      message: 'Buttons must be an array'
    }
  },
  alerts: {
    type: [String],
    default: [],
    validate: {
      validator: function(alerts) {
        return Array.isArray(alerts);
      },
      message: 'Alerts must be an array'
    }
  },
  darkPatterns: {
    type: darkPatternsAnalysisSchema,
    default: () => ({
      totalPatterns: 0,
      riskScore: 0,
      patterns: [],
      analysisTimestamp: new Date().toISOString()
    }),
    required: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  strict: true // Enforce schema structure
});

// Pre-save middleware to validate dark patterns structure
uxSessionSchema.pre('save', function(next) {
  // Ensure darkPatterns exists
  if (!this.darkPatterns) {
    this.darkPatterns = {
      totalPatterns: 0,
      riskScore: 0,
      patterns: [],
      analysisTimestamp: new Date().toISOString()
    };
  }

  // Ensure patterns is an array
  if (!Array.isArray(this.darkPatterns.patterns)) {
    this.darkPatterns.patterns = [];
  }

  // Validate each pattern
  this.darkPatterns.patterns.forEach((pattern, index) => {
    if (!pattern.type || !pattern.severity || pattern.confidence === undefined || !pattern.description) {
      const error = new Error(`Dark pattern at index ${index} is missing required fields`);
      error.name = 'ValidationError';
      return next(error);
    }
  });

  // Sync totalPatterns with actual count
  this.darkPatterns.totalPatterns = this.darkPatterns.patterns.length;

  next();
});

// Add indexes for better query performance
uxSessionSchema.index({ url: 1 });
uxSessionSchema.index({ timestamp: -1 });
uxSessionSchema.index({ 'darkPatterns.riskScore': -1 });
uxSessionSchema.index({ 'darkPatterns.totalPatterns': -1 });
uxSessionSchema.index({ createdAt: -1 });

// Instance methods
uxSessionSchema.methods.getDarkPatternSummary = function() {
  return {
    totalPatterns: this.darkPatterns.totalPatterns,
    riskScore: this.darkPatterns.riskScore,
    highSeverityCount: this.darkPatterns.patterns.filter(p => p.severity === 'high').length,
    mediumSeverityCount: this.darkPatterns.patterns.filter(p => p.severity === 'medium').length,
    lowSeverityCount: this.darkPatterns.patterns.filter(p => p.severity === 'low').length,
    patternTypes: this.darkPatterns.patterns.map(p => p.type)
  };
};

// Static methods
uxSessionSchema.statics.findByRiskScore = function(minScore = 0, maxScore = 100) {
  return this.find({
    'darkPatterns.riskScore': { $gte: minScore, $lte: maxScore }
  }).sort({ 'darkPatterns.riskScore': -1 });
};

uxSessionSchema.statics.findByPatternType = function(patternType) {
  return this.find({
    'darkPatterns.patterns.type': patternType
  });
};

const UXSession = mongoose.model('UXSession', uxSessionSchema);

module.exports = UXSession;