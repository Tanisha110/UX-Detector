import React from 'react';

const Footer = ({ analysisData }) => {
  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">
          Analysis completed on {new Date(analysisData.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Footer;