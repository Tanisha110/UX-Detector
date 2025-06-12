import React from 'react';
import { AlertTriangle, Shield, Eye, CreditCard, Target, Lock } from 'lucide-react';

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30';
    case 'medium': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30';
    default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30';
  }
};

export const getPatternIcon = (type) => {
  switch (type) {
    case 'creditCardForFreeTrial': return <CreditCard className="w-5 h-5" />;
    case 'manipulativeButtons': return <Target className="w-5 h-5" />;
    case 'fomo': return <AlertTriangle className="w-5 h-5" />;
    case 'privacyZuckering': return <Lock className="w-5 h-5" />;
    default: return <Eye className="w-5 h-5" />;
  }
};

export const formatPatternName = (type) => {
  switch (type) {
    case 'creditCardForFreeTrial': return 'Credit Card for Free Trial';
    case 'manipulativeButtons': return 'Manipulative Buttons';
    case 'fomo': return 'Fear of Missing Out (FOMO)';
    case 'privacyZuckering': return 'Privacy Zuckering';
    default: return type;
  }
};

export const getRiskLevel = (score) => {
  if (score >= 70) return { level: 'High Risk', color: 'text-red-400', bg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20' };
  if (score >= 40) return { level: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' };
  return { level: 'Low Risk', color: 'text-green-400', bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' };
};
