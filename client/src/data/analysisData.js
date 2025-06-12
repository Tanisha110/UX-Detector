// data/analysisData.js
export const analysisData = {
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