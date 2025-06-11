import React, { useState } from 'react';
import { AlertTriangle, Shield, Eye, CreditCard, Target, Lock, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

// Note: Tailwind CSS is already available in this environment
// No need to import or configure Tailwind - just use the utility classes

const Dashboard = () => {
  const [expandedPattern, setExpandedPattern] = useState(null);

  // Parse the data from the document
  const analysisData = {
    url: "https://www.goibibo.com/",
    timestamp: "2025-06-11T07:21:52.606Z",
    totalPatterns: 4,
    riskScore: 48,
    patterns: [
      {
        type: "creditCardForFreeTrial",
        severity: "high",
        confidence: 0.8,
        description: "Requires credit card information for free trial",
        evidence: {
          freeTrialMentions: ["free"],
          paymentMentions: ["visa"],
          suspiciousButtons: []
        },
        location: "Form fields and payment section",
        exactLocations: [
          {
            term: "free",
            context: "alid till 15th Jun'25\n\nTrains\n\nUp to ₹300 OFF* on Free Cancellation feature & more on trains!\n\nValid til",
            exactMatch: "Free"
          },
          {
            term: "visa",
            context: "nsurance for Asia |\nTravel Insurance for Schengen Visa |\nTravel Insurance for Bhutan |\nTravel Insurance ",
            exactMatch: "Visa"
          }
        ]
      },
      {
        type: "manipulativeButtons",
        severity: "medium",
        confidence: 0.6,
        description: "Manipulative button design - positive actions emphasized, negative options hidden",
        evidence: [
          {
            positiveButtons: ["Continue"],
            missingNegativeOptions: ["no", "decline", "cancel", "skip"],
            negativeInText: true
          }
        ],
        location: "Interactive buttons"
      },
      {
        type: "fomo",
        severity: "medium",
        confidence: 0.5,
        description: "Uses fear of missing out tactics to pressure users",
        evidence: {
          fomoScore: 5,
          instances: [
            {
              location: "rawText",
              keyword: "only",
              context: "mbai\nAuckland\nSat, 16 Aug\n\nUpto ₹1700* Off\n\nValid only on app\n\nScan to download\n\nOffers For You\nAll\nBank"
            },
            {
              location: "rawText",
              keyword: "exclusive",
              context: "oking\n\nMy Trips\n\nManage Your Trips\nLogin / Signup\nExclusive Offers\nEarn goCash\nManage Your Trips\nLogin / Sign"
            }
          ]
        },
        location: "Headlines, alerts, and promotional content"
      },
      {
        type: "privacyZuckering",
        severity: "medium",
        confidence: 0.6,
        description: "Tricks users into sharing more personal information than necessary",
        evidence: {
          privacyMentions: ["privacy", "privacy"],
          trickyLanguage: ["you agree"],
          disguisedCollection: []
        },
        location: "Privacy policies and consent forms"
      }
    ]
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatternIcon = (type) => {
    switch (type) {
      case 'creditCardForFreeTrial': return <CreditCard className="w-5 h-5" />;
      case 'manipulativeButtons': return <Target className="w-5 h-5" />;
      case 'fomo': return <AlertTriangle className="w-5 h-5" />;
      case 'privacyZuckering': return <Lock className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  const formatPatternName = (type) => {
    switch (type) {
      case 'creditCardForFreeTrial': return 'Credit Card for Free Trial';
      case 'manipulativeButtons': return 'Manipulative Buttons';
      case 'fomo': return 'Fear of Missing Out (FOMO)';
      case 'privacyZuckering': return 'Privacy Zuckering';
      default: return type;
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 70) return { level: 'High Risk', color: 'text-red-600', bg: 'bg-red-100' };
    if (score >= 40) return { level: 'Medium Risk', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Low Risk', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const risk = getRiskLevel(analysisData.riskScore);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UX Pattern Detection Dashboard</h1>
          <p className="text-gray-600">Analyzing dark patterns and UX issues across websites</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Website Analyzed</p>
                <div className="flex items-center mt-1">
                  <ExternalLink className="w-4 h-4 text-blue-500 mr-2" />
                  <a href={analysisData.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    goibibo.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patterns Detected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analysisData.totalPatterns}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analysisData.riskScore}/100</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${risk.bg} ${risk.color}`}>
                  {risk.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patterns List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Detected Patterns</h2>
            <p className="text-sm text-gray-600 mt-1">Click on any pattern to view detailed analysis</p>
          </div>

          <div className="divide-y">
            {analysisData.patterns.map((pattern, index) => (
              <div key={index} className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedPattern(expandedPattern === index ? null : index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getPatternIcon(pattern.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {formatPatternName(pattern.type)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(pattern.severity)}`}>
                          {pattern.severity.charAt(0).toUpperCase() + pattern.severity.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(pattern.confidence * 100)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          Location: {pattern.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {expandedPattern === index ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPattern === index && (
                  <div className="mt-6 pl-9 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Evidence Found:</h4>
                      
                      {pattern.type === 'fomo' && pattern.evidence.instances && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">FOMO Score: {pattern.evidence.fomoScore}</p>
                          <div className="space-y-2">
                            {pattern.evidence.instances.slice(0, 3).map((instance, idx) => (
                              <div key={idx} className="bg-white p-3 rounded border">
                                <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {instance.keyword}
                                </span>
                                <p className="text-xs text-gray-600 mt-1 font-mono">
                                  ...{instance.context.substring(0, 100)}...
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pattern.type === 'creditCardForFreeTrial' && pattern.exactLocations && (
                        <div className="space-y-2">
                          {pattern.exactLocations.map((location, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <span className="font-mono text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                {location.exactMatch}
                              </span>
                              <p className="text-xs text-gray-600 mt-1 font-mono">
                                ...{location.context}...
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {pattern.type === 'manipulativeButtons' && pattern.evidence && (
                        <div className="space-y-2">
                          {pattern.evidence.map((evidence, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <p className="text-sm"><strong>Positive buttons:</strong> {evidence.positiveButtons.join(', ')}</p>
                              <p className="text-sm mt-1"><strong>Missing negative options:</strong> {evidence.missingNegativeOptions.join(', ')}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {pattern.type === 'privacyZuckering' && pattern.evidence && (
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm"><strong>Privacy mentions:</strong> {pattern.evidence.privacyMentions.length}</p>
                          <p className="text-sm mt-1"><strong>Tricky language:</strong> {pattern.evidence.trickyLanguage.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Analysis completed on {new Date(analysisData.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;