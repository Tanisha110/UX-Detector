import React from 'react';
import { getPatternIcon, formatPatternName } from '../utils/helpers';

const PatternAnalysis = ({ analysisData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <PatternChart patterns={analysisData.patterns} />
      <PatternSummary patterns={analysisData.patterns} totalPatterns={analysisData.totalPatterns} />
    </div>
  );
};

// Pattern Distribution Chart Component
const PatternChart = ({ patterns }) => {
  const maxConfidence = Math.max(...patterns.map(p => p.confidence));

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Pattern Distribution</h3>
      <div className="space-y-4">
        {patterns.map((pattern, index) => {
          const barWidth = (pattern.confidence / maxConfidence) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${pattern.severity === 'high' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20' : pattern.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'}`}>
                    <div className={`w-4 h-4 ${pattern.severity === 'high' ? 'text-red-400' : pattern.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {getPatternIcon(pattern.type)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 font-medium">
                    {formatPatternName(pattern.type)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {Math.round(pattern.confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    pattern.severity === 'high' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                      : pattern.severity === 'medium' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pattern Summary Component
const PatternSummary = ({ patterns, totalPatterns }) => {
  const averageConfidence = Math.round(patterns.reduce((acc, p) => acc + p.confidence, 0) / patterns.length * 100);

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Pattern Summary</h3>
      <div className="space-y-6">
        {/* Severity Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">By Severity</h4>
          <div className="space-y-3">
            {['high', 'medium', 'low'].map(severity => {
              const count = patterns.filter(p => p.severity === severity).length;
              const percentage = (count / totalPatterns) * 100;
              return (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      severity === 'high' ? 'bg-red-500' : 
                      severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-gray-300 capitalize">{severity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white font-medium">{count}</span>
                    <span className="text-xs text-gray-400">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Average Confidence */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Average Confidence</h4>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white">{averageConfidence}%</span>
            <div className="flex-1 bg-slate-700/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${averageConfidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysis;