// Enhanced darkPatternDetector.js with precise location tracking
class DarkPatternDetector {
  constructor() {
    this.patterns = {
      creditCardForFreeTrial: this.detectCreditCardForFreeTrial.bind(this),
      autoSubscriptionToEmails: this.detectAutoSubscriptionToEmails.bind(this),
      manipulativeButtons: this.detectManipulativeButtons.bind(this),
      sneakIntoBasket: this.detectSneakIntoBasket.bind(this),
      contactAccess: this.detectContactAccess.bind(this),
      fomo: this.detectFOMO.bind(this),
      baitAndSwitch: this.detectBaitAndSwitch.bind(this),
      forcedContinuity: this.detectForcedContinuity.bind(this),
      hiddenCosts: this.detectHiddenCosts.bind(this),
      misdirection: this.detectMisdirection.bind(this),
      roachMotel: this.detectRoachMotel.bind(this),
      trickQuestions: this.detectTrickQuestions.bind(this),
      privacyZuckering: this.detectPrivacyZuckering.bind(this),
      urgencyTactics: this.detectUrgencyTactics.bind(this)
    };
  }

  // Helper method to find exact text locations with context
  findTextLocations(text, searchTerms, contextLength = 50) {
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

  // Helper method to find items in arrays with their original positions
  findArrayItemLocations(items, searchTerms) {
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

  // Main detection method with enhanced location tracking
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
            exactLocations: result.exactLocations || [], // New field for precise locations
            verificationData: result.verificationData || {} // New field for verification
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
      riskScore: this.calculateRiskScore(detectedPatterns)
    };
  }

  // 1. Credit card info required for free trial - Enhanced
  detectCreditCardForFreeTrial({ rawText, buttons }) {
    const freeTrialKeywords = ['free trial', 'trial', 'free', 'no charge', 'try free'];
    const creditCardKeywords = ['credit card', 'payment', 'billing', 'card number', 'visa', 'mastercard'];
    
    // Find exact locations in text
    const freeTrialLocations = this.findTextLocations(rawText, freeTrialKeywords);
    const creditCardLocations = this.findTextLocations(rawText, creditCardKeywords);
    
    // Find locations in buttons
    const buttonLocations = this.findArrayItemLocations(buttons, creditCardKeywords);
    
    const hasFreeTrial = freeTrialLocations.length > 0;
    const hasCreditCardMention = creditCardLocations.length > 0;
    const hasPaymentButtons = buttonLocations.length > 0;
    
    const detected = hasFreeTrial && (hasCreditCardMention || hasPaymentButtons);
    
    return {
      detected,
      severity: 'high',
      confidence: detected ? 0.8 : 0,
      description: 'Requires credit card information for free trial',
      evidence: {
        freeTrialMentions: freeTrialLocations.map(loc => loc.term),
        paymentMentions: creditCardLocations.map(loc => loc.term),
        suspiciousButtons: buttonLocations.map(loc => loc.arrayItem)
      },
      location: 'Form fields and payment section',
      exactLocations: [
        ...freeTrialLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'freeTrial'
        })),
        ...creditCardLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'creditCard'
        })),
        ...buttonLocations.map(loc => ({
          ...loc,
          source: 'buttons',
          patternType: 'creditCard'
        }))
      ],
      verificationData: {
        freeTrialCount: freeTrialLocations.length,
        creditCardCount: creditCardLocations.length,
        buttonCount: buttonLocations.length
      }
    };
  }

  // 2. Auto subscription to emails - Enhanced
  detectAutoSubscriptionToEmails({ rawText, buttons }) {
    const emailKeywords = ['newsletter', 'email updates', 'promotional emails', 'marketing emails', 'subscribe'];
    const autoSubscribeIndicators = ['automatically', 'by default', 'pre-selected', 'opt-out'];
    
    const emailLocations = this.findTextLocations(rawText, emailKeywords);
    const autoLocations = this.findTextLocations(rawText, autoSubscribeIndicators);
    
    const hasEmailSubscription = emailLocations.length > 0;
    const hasAutoSubscribeLanguage = autoLocations.length > 0;
    
    // Look for specific opt-out patterns
    const optOutPatterns = ['opt-out', 'uncheck to not receive'];
    const optOutLocations = this.findTextLocations(rawText, optOutPatterns);
    const hasOptOut = optOutLocations.length > 0;
    
    const detected = hasEmailSubscription && (hasAutoSubscribeLanguage || hasOptOut);
    
    return {
      detected,
      severity: 'medium',
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
          source: 'rawText',
          patternType: 'emailSubscription'
        })),
        ...autoLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'autoSubscribe'
        })),
        ...optOutLocations.map(loc => ({
          ...loc,
          source: 'rawText',
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

  // 3. Manipulative buttons - Enhanced
  detectManipulativeButtons({ buttons, rawText }) {
    const manipulativePatterns = [
      { positive: ['yes', 'accept', 'continue', 'start'], negative: ['no', 'decline', 'cancel', 'skip'] },
      { positive: ['upgrade now', 'get premium'], negative: ['maybe later', 'not now'] }
    ];
    
    let detected = false;
    let evidence = [];
    let allLocations = [];
    
    manipulativePatterns.forEach((pattern, patternIndex) => {
      const positiveButtonLocations = this.findArrayItemLocations(buttons, pattern.positive);
      const negativeButtonLocations = this.findArrayItemLocations(buttons, pattern.negative);
      
      // Also check if negative options are mentioned in text but not as buttons
      const negativeTextLocations = this.findTextLocations(rawText, pattern.negative);
      
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
          source: 'buttons',
          patternType: 'manipulativePositive',
          patternIndex
        })));
      }
    });
    
    return {
      detected,
      severity: 'medium',
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

  // 4. Sneak into basket - Enhanced
  detectSneakIntoBasket({ rawText, buttons }) {
    const checkoutKeywords = ['checkout', 'cart', 'basket', 'order', 'purchase'];
    const additionalItemKeywords = ['insurance', 'warranty', 'express delivery', 'premium shipping', 'add-on', 'extra'];
    const preselectedKeywords = ['pre-selected', 'automatically added', 'included by default'];
    
    const checkoutLocations = this.findTextLocations(rawText, checkoutKeywords);
    const additionalItemLocations = this.findTextLocations(rawText, additionalItemKeywords);
    const preselectedLocations = this.findTextLocations(rawText, preselectedKeywords);
    
    const isCheckoutContext = checkoutLocations.length > 0;
    const hasAdditionalItems = additionalItemLocations.length > 0;
    const hasPreSelectedLanguage = preselectedLocations.length > 0;
    
    const detected = isCheckoutContext && hasAdditionalItems && hasPreSelectedLanguage;
    
    return {
      detected,
      severity: 'high',
      confidence: detected ? 0.8 : 0,
      description: 'Additional items automatically added to cart/checkout',
      evidence: {
        checkoutContext: checkoutLocations.map(loc => loc.term),
        additionalItems: additionalItemLocations.map(loc => loc.term)
      },
      location: 'Checkout process',
      exactLocations: [
        ...checkoutLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'checkout'
        })),
        ...additionalItemLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'additionalItems'
        })),
        ...preselectedLocations.map(loc => ({
          ...loc,
          source: 'rawText',
          patternType: 'preselected'
        }))
      ],
      verificationData: {
        checkoutMentions: checkoutLocations.length,
        additionalItemMentions: additionalItemLocations.length,
        preselectedMentions: preselectedLocations.length
      }
    };
  }

  // 5. FOMO (Fear of Missing Out) - Enhanced
  detectFOMO({ rawText, headings, alerts }) {
    const fomoKeywords = [
      'limited time', 'only', 'left', 'hurry', 'ending soon', 'last chance',
      'limited offer', 'expires', 'countdown', 'almost gone', 'few remaining',
      'act now', 'don\'t miss out', 'exclusive', 'today only'
    ];
    
    let fomoScore = 0;
    let allLocations = [];
    
    // Check raw text
    const textLocations = this.findTextLocations(rawText, fomoKeywords);
    textLocations.forEach(loc => {
      fomoScore++;
      allLocations.push({
        ...loc,
        source: 'rawText',
        patternType: 'fomo',
        weight: 1
      });
    });
    
    // Check headings (higher weight)
    headings.forEach((heading, index) => {
      const headingLocations = this.findTextLocations(heading, fomoKeywords);
      headingLocations.forEach(loc => {
        fomoScore += 2;
        allLocations.push({
          ...loc,
          source: 'headings',
          headingIndex: index,
          headingText: heading,
          patternType: 'fomo',
          weight: 2
        });
      });
    });
    
    // Check alerts (highest weight)
    alerts.forEach((alert, index) => {
      const alertLocations = this.findTextLocations(alert, fomoKeywords);
      alertLocations.forEach(loc => {
        fomoScore += 3;
        allLocations.push({
          ...loc,
          source: 'alerts',
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
      severity: 'medium',
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
        headingMentions: allLocations.filter(loc => loc.source === 'headings').length,
        alertMentions: allLocations.filter(loc => loc.source === 'alerts').length
      }
    };
  }

  // 6. Bait and Switch - Enhanced
  detectBaitAndSwitch({ rawText, buttons }) {
    const baitWords = ['free', 'download', 'continue', 'next', 'start'];
    const switchWords = ['pay', 'subscribe', 'upgrade', 'premium', 'billing'];
    
    let detected = false;
    let evidence = [];
    let allLocations = [];
    
    const buttonLocations = this.findArrayItemLocations(buttons, baitWords);
    const switchTextLocations = this.findTextLocations(rawText, switchWords);
    
    buttonLocations.forEach(buttonLoc => {
      if (switchTextLocations.length > 0) {
        detected = true;
        evidence.push({
          buttonText: buttonLoc.arrayItem,
          buttonIndex: buttonLoc.arrayIndex,
          baitWord: buttonLoc.term,
          contextualSwitchWords: switchTextLocations.map(loc => loc.term)
        });
        
        allLocations.push({
          ...buttonLoc,
          source: 'buttons',
          patternType: 'bait'
        });
      }
    });
    
    // Add switch word locations
    if (detected) {
      allLocations.push(...switchTextLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'switch'
      })));
    }
    
    return {
      detected,
      severity: 'high',
      confidence: detected ? 0.7 : 0,
      description: 'Misleading button text that doesn\'t match actual action',
      evidence,
      location: 'Action buttons and forms',
      exactLocations: allLocations,
      verificationData: {
        baitButtonCount: buttonLocations.length,
        switchWordCount: switchTextLocations.length,
        matchedPairs: evidence.length
      }
    };
  }

  // 7. Trick Questions - Enhanced
  detectTrickQuestions({ rawText }) {
    const trickPatterns = [
      'do not want to not receive',
      'uncheck to not opt out',
      'disable to enable',
      'turn off to turn on',
      'opt out of not receiving'
    ];
    
    const confusingLanguage = [
      'unless you don\'t want',
      'if you don\'t want to not'
    ];
    
    const allPatterns = [...trickPatterns, ...confusingLanguage];
    const locations = this.findTextLocations(rawText, allPatterns);
    
    const detected = locations.length > 0;
    
    return {
      detected,
      severity: 'medium',
      confidence: detected ? 0.8 : 0,
      description: 'Uses confusing or trick questions to mislead users',
      evidence: locations.map(loc => loc.term),
      location: 'Form questions and labels',
      exactLocations: locations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'trickQuestion'
      })),
      verificationData: {
        trickPatternCount: locations.length,
        foundPatterns: locations.map(loc => loc.term)
      }
    };
  }
  // Add these missing methods to your DarkPatternDetector class

// 8. Contact Access - Enhanced
detectContactAccess({ rawText, buttons }) {
  const contactKeywords = ['phone number', 'contact info', 'email address', 'personal details'];
  const accessKeywords = ['required', 'mandatory', 'must provide', 'need your'];
  
  const contactLocations = this.findTextLocations(rawText, contactKeywords);
  const accessLocations = this.findTextLocations(rawText, accessKeywords);
  
  const hasContactRequirement = contactLocations.length > 0;
  const hasAccessLanguage = accessLocations.length > 0;
  
  const detected = hasContactRequirement && hasAccessLanguage;
  
  return {
    detected,
    severity: 'medium',
    confidence: detected ? 0.6 : 0,
    description: 'Requires unnecessary contact information access',
    evidence: {
      contactMentions: contactLocations.map(loc => loc.term),
      accessMentions: accessLocations.map(loc => loc.term)
    },
    location: 'Contact forms and privacy settings',
    exactLocations: [
      ...contactLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'contact'
      })),
      ...accessLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'access'
      }))
    ],
    verificationData: {
      contactMentions: contactLocations.length,
      accessMentions: accessLocations.length
    }
  };
}

// 9. Forced Continuity - Enhanced
detectForcedContinuity({ rawText, buttons }) {
  const continuityKeywords = ['auto-renew', 'automatically renew', 'recurring', 'subscription continues'];
  const cancelKeywords = ['cancel', 'stop subscription', 'opt out', 'end subscription'];
  
  const continuityLocations = this.findTextLocations(rawText, continuityKeywords);
  const cancelLocations = this.findTextLocations(rawText, cancelKeywords);
  const cancelButtonLocations = this.findArrayItemLocations(buttons, cancelKeywords);
  
  const hasContinuity = continuityLocations.length > 0;
  const hasEasyCancellation = cancelLocations.length > 0 || cancelButtonLocations.length > 0;
  
  // Detect if cancellation is made difficult
  const difficultCancelKeywords = ['call to cancel', 'contact us to cancel', 'phone only'];
  const difficultCancelLocations = this.findTextLocations(rawText, difficultCancelKeywords);
  const hasDifficultCancellation = difficultCancelLocations.length > 0;
  
  const detected = hasContinuity && (!hasEasyCancellation || hasDifficultCancellation);
  
  return {
    detected,
    severity: 'high',
    confidence: detected ? 0.8 : 0,
    description: 'Makes it difficult to cancel recurring subscriptions',
    evidence: {
      continuityMentions: continuityLocations.map(loc => loc.term),
      difficultCancellation: difficultCancelLocations.map(loc => loc.term)
    },
    location: 'Subscription and billing sections',
    exactLocations: [
      ...continuityLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'continuity'
      })),
      ...difficultCancelLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'difficultCancel'
      }))
    ],
    verificationData: {
      continuityMentions: continuityLocations.length,
      cancelMentions: cancelLocations.length,
      difficultCancelMentions: difficultCancelLocations.length
    }
  };
}

// 10. Hidden Costs - Enhanced
detectHiddenCosts({ rawText }) {
  const hiddenCostKeywords = ['additional fees', 'extra charges', 'processing fee', 'handling fee', 'service charge'];
  const hiddenLocationKeywords = ['fine print', 'terms apply', 'see details', 'additional terms'];
  
  const costLocations = this.findTextLocations(rawText, hiddenCostKeywords);
  const hiddenLocations = this.findTextLocations(rawText, hiddenLocationKeywords);
  
  const hasCostMentions = costLocations.length > 0;
  const hasHiddenReferences = hiddenLocations.length > 0;
  
  const detected = hasCostMentions || hasHiddenReferences;
  
  return {
    detected,
    severity: 'high',
    confidence: detected ? 0.7 : 0,
    description: 'Contains hidden or unclear additional costs',
    evidence: {
      costMentions: costLocations.map(loc => loc.term),
      hiddenReferences: hiddenLocations.map(loc => loc.term)
    },
    location: 'Pricing and checkout sections',
    exactLocations: [
      ...costLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'hiddenCost'
      })),
      ...hiddenLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'hiddenReference'
      }))
    ],
    verificationData: {
      costMentions: costLocations.length,
      hiddenReferences: hiddenLocations.length
    }
  };
}

// 11. Misdirection - Enhanced
detectMisdirection({ rawText, buttons }) {
  const misdirectionKeywords = ['click here', 'download now', 'get started'];
  const actualActionKeywords = ['subscribe', 'purchase', 'pay', 'upgrade'];
  
  const misdirectionLocations = this.findArrayItemLocations(buttons, misdirectionKeywords);
  const actualActionLocations = this.findTextLocations(rawText, actualActionKeywords);
  
  // Look for buttons that don't clearly state what they do
  const vagueButtons = buttons.filter(button => 
    button.toLowerCase().includes('continue') || 
    button.toLowerCase().includes('next') ||
    button.toLowerCase().includes('proceed')
  );
  
  const detected = misdirectionLocations.length > 0 && actualActionLocations.length > 0;
  
  return {
    detected,
    severity: 'medium',
    confidence: detected ? 0.6 : 0,
    description: 'Uses misdirection in button labels or calls to action',
    evidence: {
      misdirectionButtons: misdirectionLocations.map(loc => loc.arrayItem),
      vagueButtons: vagueButtons,
      actualActions: actualActionLocations.map(loc => loc.term)
    },
    location: 'Action buttons and CTAs',
    exactLocations: [
      ...misdirectionLocations.map(loc => ({
        ...loc,
        source: 'buttons',
        patternType: 'misdirection'
      })),
      ...actualActionLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'actualAction'
      }))
    ],
    verificationData: {
      misdirectionButtons: misdirectionLocations.length,
      vagueButtons: vagueButtons.length,
      actualActionMentions: actualActionLocations.length
    }
  };
}

// 12. Roach Motel - Enhanced
detectRoachMotel({ rawText, buttons }) {
  const easySignUpKeywords = ['quick signup', 'easy registration', 'one click', 'instant access'];
  const difficultCancelKeywords = ['call to cancel', 'contact support', 'customer service required'];
  
  const easySignUpLocations = this.findTextLocations(rawText, easySignUpKeywords);
  const difficultCancelLocations = this.findTextLocations(rawText, difficultCancelKeywords);
  
  // Look for sign up buttons vs cancel options
  const signUpButtons = this.findArrayItemLocations(buttons, ['sign up', 'register', 'join']);
  const cancelButtons = this.findArrayItemLocations(buttons, ['cancel', 'unsubscribe', 'delete account']);
  
  const hasEasySignUp = easySignUpLocations.length > 0 || signUpButtons.length > 0;
  const hasDifficultCancel = difficultCancelLocations.length > 0 || cancelButtons.length === 0;
  
  const detected = hasEasySignUp && hasDifficultCancel;
  
  return {
    detected,
    severity: 'high',
    confidence: detected ? 0.7 : 0,
    description: 'Easy to sign up but difficult to cancel or leave',
    evidence: {
      easySignUp: easySignUpLocations.map(loc => loc.term),
      difficultCancel: difficultCancelLocations.map(loc => loc.term),
      signUpButtons: signUpButtons.length,
      cancelButtons: cancelButtons.length
    },
    location: 'Registration and account management',
    exactLocations: [
      ...easySignUpLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'easySignUp'
      })),
      ...difficultCancelLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'difficultCancel'
      }))
    ],
    verificationData: {
      easySignUpMentions: easySignUpLocations.length,
      difficultCancelMentions: difficultCancelLocations.length,
      signUpButtonCount: signUpButtons.length,
      cancelButtonCount: cancelButtons.length
    }
  };
}

// 13. Privacy Zuckering - Enhanced
detectPrivacyZuckering({ rawText }) {
  const privacyKeywords = ['privacy', 'personal data', 'share information', 'data collection'];
  const trickyLanguage = ['by continuing', 'you agree', 'accept terms', 'implicit consent'];
  
  const privacyLocations = this.findTextLocations(rawText, privacyKeywords);
  const trickyLanguageLocations = this.findTextLocations(rawText, trickyLanguage);
  
  // Look for privacy-invasive practices disguised as features
  const featureKeywords = ['personalized experience', 'better recommendations', 'improve service'];
  const featureLocations = this.findTextLocations(rawText, featureKeywords);
  
  const hasPrivacyMentions = privacyLocations.length > 0;
  const hasTrickyLanguage = trickyLanguageLocations.length > 0;
  const hasDisguisedDataCollection = featureLocations.length > 0;
  
  const detected = hasPrivacyMentions && (hasTrickyLanguage || hasDisguisedDataCollection);
  
  return {
    detected,
    severity: 'medium',
    confidence: detected ? 0.6 : 0,
    description: 'Tricks users into sharing more personal information than necessary',
    evidence: {
      privacyMentions: privacyLocations.map(loc => loc.term),
      trickyLanguage: trickyLanguageLocations.map(loc => loc.term),
      disguisedCollection: featureLocations.map(loc => loc.term)
    },
    location: 'Privacy policies and consent forms',
    exactLocations: [
      ...privacyLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'privacy'
      })),
      ...trickyLanguageLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'trickyLanguage'
      })),
      ...featureLocations.map(loc => ({
        ...loc,
        source: 'rawText',
        patternType: 'disguisedCollection'
      }))
    ],
    verificationData: {
      privacyMentions: privacyLocations.length,
      trickyLanguageCount: trickyLanguageLocations.length,
      disguisedCollectionCount: featureLocations.length
    }
  };
}

// 14. Urgency Tactics - Enhanced
detectUrgencyTactics({ rawText, headings, alerts }) {
  const urgencyKeywords = [
    'act now', 'limited time', 'expires soon', 'hurry up', 'don\'t wait',
    'immediate action', 'urgent', 'deadline', 'time sensitive', 'last chance'
  ];
  
  let urgencyScore = 0;
  let allLocations = [];
  
  // Check raw text
  const textLocations = this.findTextLocations(rawText, urgencyKeywords);
  textLocations.forEach(loc => {
    urgencyScore++;
    allLocations.push({
      ...loc,
      source: 'rawText',
      patternType: 'urgency',
      weight: 1
    });
  });
  
  // Check headings (higher weight)
  headings.forEach((heading, index) => {
    const headingLocations = this.findTextLocations(heading, urgencyKeywords);
    headingLocations.forEach(loc => {
      urgencyScore += 2;
      allLocations.push({
        ...loc,
        source: 'headings',
        headingIndex: index,
        headingText: heading,
        patternType: 'urgency',
        weight: 2
      });
    });
  });
  
  // Check alerts (highest weight)
  alerts.forEach((alert, index) => {
    const alertLocations = this.findTextLocations(alert, urgencyKeywords);
    alertLocations.forEach(loc => {
      urgencyScore += 3;
      allLocations.push({
        ...loc,
        source: 'alerts',
        alertIndex: index,
        alertText: alert,
        patternType: 'urgency',
        weight: 3
      });
    });
  });
  
  const detected = urgencyScore >= 2;
  
  return {
    detected,
    severity: 'medium',
    confidence: detected ? Math.min(urgencyScore / 8, 1) : 0,
    description: 'Uses artificial urgency to pressure users into quick decisions',
    evidence: {
      urgencyScore,
      instances: allLocations.map(loc => ({
        location: loc.source,
        keyword: loc.term,
        context: loc.context
      }))
    },
    location: 'Headlines, alerts, and call-to-action sections',
    exactLocations: allLocations,
    verificationData: {
      totalScore: urgencyScore,
      textMentions: textLocations.length,
      headingMentions: allLocations.filter(loc => loc.source === 'headings').length,
      alertMentions: allLocations.filter(loc => loc.source === 'alerts').length
    }
  };
}
  // Calculate overall risk score
  calculateRiskScore(patterns) {
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

  // New method: Generate verification report
  generateVerificationReport(analysisResult) {
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
}

module.exports = DarkPatternDetector;