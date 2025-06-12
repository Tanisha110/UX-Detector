import React from 'react';
import { ExternalLink, AlertTriangle, Shield, Eye, Activity, BarChart3 } from 'lucide-react';
import { getRiskLevel } from '../utils/helpers';

const SummaryCards = ({ analysisData }) => {
  const risk = getRiskLevel(analysisData.riskScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Website Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div className="h-12 w-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Website Analyzed</p>
          <a href={analysisData.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
            goibibo.com
          </a>
        </div>
      </div>

      {/* Patterns Detected Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="h-12 w-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Patterns Detected</p>
          <p className="text-3xl font-bold text-white">{analysisData.totalPatterns}</p>
        </div>
      </div>

      {/* Risk Score Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400 mb-3">Risk Score</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-end space-x-2">
              <p className="text-3xl font-bold text-white">{analysisData.riskScore}</p>
              <p className="text-gray-400 text-sm mb-1">/100</p>
            </div>
            <CircularProgress score={analysisData.riskScore} />
          </div>
        </div>
      </div>

      {/* Risk Level Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 ${risk.color === 'text-red-400' ? 'bg-gradient-to-r from-red-500 to-pink-500' : risk.color === 'text-yellow-400' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} rounded-lg`}>
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400 mb-3">Risk Level</p>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${risk.bg} ${risk.color} border border-current/20`}>
              {risk.level}
            </span>
            <RiskLevelIndicator score={analysisData.riskScore} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ score }) => (
  <div className="relative w-16 h-16">
    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-700" />
      <circle
        cx="32" cy="32" r="28" stroke="url(#gradient-purple)" strokeWidth="6" fill="none"
        strokeDasharray={`${2 * Math.PI * 28}`}
        strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
        className="transition-all duration-1000 ease-out" strokeLinecap="round"
      />
    </svg>
    <defs>
      <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </div>
);

// Risk Level Indicator Component
const RiskLevelIndicator = ({ score }) => (
  <div className="relative w-12 h-12">
    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-700/50" />
      <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-700/50" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-700/50" />
      
      {score >= 1 && <circle cx="24" cy="24" r="10" stroke="#10b981" strokeWidth="2" fill="none" className="transition-all duration-500" />}
      {score >= 40 && <circle cx="24" cy="24" r="15" stroke="#f59e0b" strokeWidth="3" fill="none" className="transition-all duration-500" />}
      {score >= 70 && <circle cx="24" cy="24" r="20" stroke="#ef4444" strokeWidth="4" fill="none" className="transition-all duration-500" />}
    </svg>
  </div>
);

export default SummaryCards;

