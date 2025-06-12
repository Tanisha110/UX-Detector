import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getSeverityColor, getPatternIcon, formatPatternName } from '../utils/helpers';
import PatternEvidence from './PatternEvidence';

const DetailedPatternsList = ({ analysisData, expandedPattern, setExpandedPattern }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50">
      <div className="px-8 py-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">Detailed Analysis</h2>
        <p className="text-gray-400">Click on any pattern to view comprehensive details</p>
      </div>

      <div className="divide-y divide-slate-700/50">
        {analysisData.patterns.map((pattern, index) => (
          <PatternCard
            key={index}
            pattern={pattern}
            index={index}
            isExpanded={expandedPattern === index}
            onToggle={() => setExpandedPattern(expandedPattern === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Pattern Card Component
const PatternCard = ({ pattern, index, isExpanded, onToggle }) => {
  return (
    <div className="p-6 hover:bg-slate-800/30 transition-all duration-300">
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center space-x-6">
          <div className={`p-3 rounded-xl ${pattern.severity === 'high' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20' : pattern.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'}`}>
            <div className={`${pattern.severity === 'high' ? 'text-red-400' : pattern.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
              {getPatternIcon(pattern.type)}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-xl font-semibold text-white">
                {formatPatternName(pattern.type)}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(pattern.severity)}`}>
                {pattern.severity.charAt(0).toUpperCase() + pattern.severity.slice(1)}
              </span>
            </div>
            <p className="text-gray-300 mb-3">{pattern.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-400">
                  Confidence: {Math.round(pattern.confidence * 100)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-400">
                  Location: {pattern.location}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
            {isExpanded ? 
              <ChevronDown className="w-5 h-5 text-gray-400" /> : 
              <ChevronRight className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-8 pl-16">
          <PatternEvidence pattern={pattern} />
        </div>
      )}
    </div>
  );
};

export default DetailedPatternsList;