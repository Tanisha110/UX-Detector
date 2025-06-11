require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const UXSession = require('./models/UXsession');
const DarkPatternDetector = require('./darkPatternDetector');

const app = express();
const detector = new DarkPatternDetector();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ux_detective';

// Debug: Log the MongoDB URL (without credentials)
console.log('MongoDB URL configured:', MONGO_URL ? 'Yes' : 'No');
console.log('MongoDB URL format:', MONGO_URL ? MONGO_URL.replace(/:[^:@]*@/, ':****@') : 'Not found');

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.error("Please check your MongoDB connection string and ensure MongoDB is running");
    process.exit(1);
  }
};

connectDB();

// Debug: MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development - restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Increase limit for large page content
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  if (req.method === 'POST' && req.body) {
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body size:', JSON.stringify(req.body).length, 'characters');
  }
  next();
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors
    });
  }
  
  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'The provided ID is not valid'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Entry',
      message: 'A record with this data already exists'
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on our end',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Helper function to validate and sanitize input
const validateCaptureInput = (body) => {
  const { url, rawText, deviceInfo, timestamp, headings, buttons, alerts } = body;
  
  // Required fields validation
  if (!url || typeof url !== 'string') {
    throw new Error('url is required and must be a string');
  }
  
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('rawText is required and must be a string');
  }
  
  // URL validation
  try {
    new URL(url);
  } catch {
    throw new Error('url must be a valid URL');
  }
  
  // Array validation
  const validateArray = (arr, name) => {
    if (arr && !Array.isArray(arr)) {
      throw new Error(`${name} must be an array`);
    }
    if (arr && arr.some(item => typeof item !== 'string')) {
      throw new Error(`All items in ${name} must be strings`);
    }
  };
  
  validateArray(headings, 'headings');
  validateArray(buttons, 'buttons');
  validateArray(alerts, 'alerts');
  
  return {
    url: url.trim(),
    rawText: rawText.trim(),
    deviceInfo: deviceInfo || {},
    timestamp: timestamp || new Date().toISOString(),
    headings: headings || [],
    buttons: buttons || [],
    alerts: alerts || []
  };
};

// POST /capture to save UX session and detect dark patterns
app.post('/capture', async (req, res) => {
  try {
    console.log('🔍 Processing /capture request...');
    
    // Validate and sanitize input
    const validatedData = validateCaptureInput(req.body);
    
    console.log('📊 Validated data:');
    console.log('- URL:', validatedData.url);
    console.log('- Raw text length:', validatedData.rawText.length);
    console.log('- Headings count:', validatedData.headings.length);
    console.log('- Buttons count:', validatedData.buttons.length);
    console.log('- Alerts count:', validatedData.alerts.length);

    // Prepare data for dark pattern detection
    const uxSessionData = {
      url: validatedData.url,
      rawText: validatedData.rawText,
      headings: validatedData.headings,
      buttons: validatedData.buttons,
      alerts: validatedData.alerts
    };

    // Detect dark patterns
    console.log('🕵️ Analyzing page for dark patterns...');
    const darkPatternAnalysis = await detector.detectDarkPatterns(uxSessionData);
    
    console.log('🎯 Dark pattern analysis complete:');
    console.log('- Total patterns found:', darkPatternAnalysis.totalPatterns);
    console.log('- Risk score:', darkPatternAnalysis.riskScore);

    // Validate dark pattern analysis structure
    if (!darkPatternAnalysis.patterns || !Array.isArray(darkPatternAnalysis.patterns)) {
      console.error('❌ Invalid dark pattern analysis structure');
      throw new Error('Dark pattern analysis returned invalid structure');
    }

    // Log detected patterns for debugging
    if (darkPatternAnalysis.patterns.length > 0) {
      console.log('📋 Pattern details:');
      darkPatternAnalysis.patterns.forEach((pattern, index) => {
        console.log(`  Pattern ${index + 1}:`, {
          type: pattern.type,
          severity: pattern.severity,
          confidence: pattern.confidence,
          description: pattern.description?.substring(0, 50) + '...',
          locationCount: pattern.exactLocations?.length || 0
        });
      });
    }

    // Create session object with proper structure
    const sessionData = {
      url: validatedData.url,
      rawText: validatedData.rawText,
      deviceInfo: validatedData.deviceInfo,
      timestamp: validatedData.timestamp,
      headings: validatedData.headings,
      buttons: validatedData.buttons,
      alerts: validatedData.alerts,
      darkPatterns: {
        totalPatterns: darkPatternAnalysis.totalPatterns,
        riskScore: darkPatternAnalysis.riskScore,
        patterns: darkPatternAnalysis.patterns,
        analysisTimestamp: darkPatternAnalysis.timestamp
      }
    };

    console.log('💾 Attempting to save to database...');
    
    // Validate each pattern object before saving
    sessionData.darkPatterns.patterns.forEach((pattern, index) => {
      if (!pattern.type || !pattern.severity || pattern.confidence === undefined || !pattern.description) {
        console.error(`❌ Invalid pattern structure at index ${index}:`, pattern);
        throw new Error(`Pattern at index ${index} is missing required fields`);
      }
    });

    // Save UX session with dark pattern analysis
    const newSession = new UXSession(sessionData);
    
    // Validate the model before saving
    const validationError = newSession.validateSync();
    if (validationError) {
      console.error('❌ Validation error before save:', validationError);
      throw validationError;
    }

    const savedSession = await newSession.save();
    console.log('✅ Session saved successfully!');
    console.log('Saved session ID:', savedSession._id);

    // Generate verification report
    const verificationReport = detector.generateVerificationReport(darkPatternAnalysis);

    // Return comprehensive response
    const response = {
      success: true,
      sessionId: savedSession._id,
      session: {
        _id: savedSession._id,
        url: savedSession.url,
        timestamp: savedSession.timestamp,
        darkPatterns: savedSession.darkPatterns
      },
      darkPatternAnalysis: {
        url: darkPatternAnalysis.url,
        totalPatterns: darkPatternAnalysis.totalPatterns,
        riskScore: darkPatternAnalysis.riskScore,
        patterns: darkPatternAnalysis.patterns.map(pattern => ({
          type: pattern.type,
          severity: pattern.severity,
          confidence: pattern.confidence,
          description: pattern.description,
          location: pattern.location,
          evidenceCount: pattern.exactLocations?.length || 0
        })),
        timestamp: darkPatternAnalysis.timestamp
      },
      verificationReport
    };

    console.log('📤 Sending response...');
    res.status(201).json(response);

  } catch (err) {
    console.error('❌ Error in /capture endpoint:', err);
    next(err);
  }
});

// GET /sessions - Get all sessions with pagination and filtering
app.get('/sessions', async (req, res) => {
  try {
    console.log('📋 Fetching sessions...');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const minRiskScore = parseInt(req.query.minRiskScore) || 0;
    const maxRiskScore = parseInt(req.query.maxRiskScore) || 100;
    const skip = (page - 1) * limit;

    const filter = {
      'darkPatterns.riskScore': { $gte: minRiskScore, $lte: maxRiskScore }
    };

    const [sessions, totalCount] = await Promise.all([
      UXSession.find(filter)
        .select('url timestamp darkPatterns.totalPatterns darkPatterns.riskScore darkPatterns.patterns createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UXSession.countDocuments(filter)
    ]);

    console.log('📊 Found', sessions.length, 'sessions out of', totalCount, 'total');
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      filters: {
        minRiskScore,
        maxRiskScore
      },
      sessions: sessions.map(session => ({
        _id: session._id,
        url: session.url,
        timestamp: session.timestamp,
        createdAt: session.createdAt,
        darkPatterns: {
          totalPatterns: session.darkPatterns.totalPatterns,
          riskScore: session.darkPatterns.riskScore,
          patternTypes: session.darkPatterns.patterns.map(p => p.type),
          severityBreakdown: {
            high: session.darkPatterns.patterns.filter(p => p.severity === 'high').length,
            medium: session.darkPatterns.patterns.filter(p => p.severity === 'medium').length,
            low: session.darkPatterns.patterns.filter(p => p.severity === 'low').length
          }
        }
      }))
    });
  } catch (err) {
    console.error('❌ Error fetching sessions:', err);
    next(err);
  }
});

// GET /session/:id - Get detailed session data
app.get('/session/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID format'
      });
    }

    const session = await UXSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Generate additional insights
    const summary = session.getDarkPatternSummary();

    res.json({
      success: true,
      session,
      summary
    });
  } catch (err) {
    console.error('❌ Error fetching session:', err);
    next(err);
  }
});

// GET /analytics - Get analytics data
app.get('/analytics', async (req, res) => {
  try {
    const [
      totalSessions,
      avgRiskScore,
      patternTypeStats,
      severityStats,
      recentSessions
    ] = await Promise.all([
      UXSession.countDocuments(),
      UXSession.aggregate([
        { $group: { _id: null, avgRiskScore: { $avg: '$darkPatterns.riskScore' } } }
      ]),
      UXSession.aggregate([
        { $unwind: '$darkPatterns.patterns' },
        { $group: { _id: '$darkPatterns.patterns.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      UXSession.aggregate([
        { $unwind: '$darkPatterns.patterns' },
        { $group: { _id: '$darkPatterns.patterns.severity', count: { $sum: 1 } } }
      ]),
      UXSession.find()
        .select('url timestamp darkPatterns.riskScore')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      analytics: {
        totalSessions,
        averageRiskScore: avgRiskScore[0]?.avgRiskScore || 0,
        patternTypeDistribution: patternTypeStats,
        severityDistribution: severityStats,
        recentActivity: recentSessions
      }
    });
  } catch (err) {
    console.error('❌ Error generating analytics:', err);
    next(err);
  }
});

// Test endpoint to verify database connection and schema
app.get('/test-db', async (req, res) => {
  try {
    console.log('🧪 Testing database connection and schema...');
    
    // Test database connection
    const dbStatus = mongoose.connection.readyState;
    if (dbStatus !== 1) {
      throw new Error('Database not connected');
    }

    // Create a test dark pattern analysis
    const testDarkPatterns = {
      totalPatterns: 1,
      riskScore: 50,
      patterns: [{
        type: 'testPattern',
        severity: 'medium',
        confidence: 0.8,
        description: 'This is a test pattern for schema validation',
        evidence: { test: 'data' },
        location: 'Test location',
        exactLocations: [],
        verificationData: {}
      }],
      analysisTimestamp: new Date().toISOString()
    };

    // Try to create a test document
    const testSession = new UXSession({
      url: 'https://test.example.com',
      rawText: 'This is a test session for database connectivity and schema validation',
      timestamp: new Date().toISOString(),
      headings: ['Test Heading'],
      buttons: ['Test Button'],
      alerts: ['Test Alert'],
      darkPatterns: testDarkPatterns
    });

    // Validate before saving
    const validationError = testSession.validateSync();
    if (validationError) {
      console.error('❌ Test validation failed:', validationError);
      throw validationError;
    }

    const saved = await testSession.save();
    console.log('✅ Test document saved with ID:', saved._id);

    // Count total documents
    const count = await UXSession.countDocuments();
    console.log('📊 Total documents in collection:', count);

    // Clean up test document
    await UXSession.findByIdAndDelete(saved._id);
    console.log('🧹 Test document cleaned up');

    res.json({
      success: true,
      message: 'Database connection and schema working perfectly',
      testResults: {
        connectionStatus: 'connected',
        schemaValidation: 'passed',
        totalDocuments: count - 1, // Subtract the deleted test document
        testCompleted: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('❌ Database test failed:', err);
    res.status(500).json({
      success: false,
      error: 'Database test failed',
      message: err.message,
      details: err.errors || null
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.json(health);
});

// Basic GET for testing
app.get('/', (req, res) => {
  res.json({
    message: "UX Detective Backend with Enhanced Dark Pattern Detection",
    status: "online",
    version: "2.0.0",
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    darkPatternDetector: "enhanced with precise location tracking",
    endpoints: {
      capture: 'POST /capture - Capture and analyze UX session',
      sessions: 'GET /sessions - List sessions with pagination and filtering',
      session: 'GET /session/:id - Get detailed session data',
      analytics: 'GET /analytics - Get system analytics',
      testDb: 'GET /test-db - Test database connection and schema',
      health: 'GET /health - System health check'
    },
    features: [
      'Enhanced dark pattern detection with precise location tracking',
      'Comprehensive evidence collection and verification',
      'Risk scoring and pattern confidence assessment',
      'Detailed analytics and reporting',
      'Robust error handling and validation'
    ]
  });
});

// 404 handler
// 404 handler - Replace the problematic line
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log('🕵️ Enhanced Dark Pattern Detector initialized and ready');
  console.log('🌐 Access server at: http://localhost:' + PORT);
  console.log('📊 Health check: http://localhost:' + PORT + '/health');
  console.log('🧪 Database test: http://localhost:' + PORT + '/test-db');
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;