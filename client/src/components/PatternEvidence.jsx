import React from 'react';

const PatternEvidence = ({ pattern }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/30">
      <h4 className="font-semibold text-white mb-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        <span>Evidence Found</span>
      </h4>
      
      {pattern.type === 'fomo' && <FomoEvidence evidence={pattern.evidence} />}
      {pattern.type === 'creditCardForFreeTrial' && <CreditCardEvidence exactLocations={pattern.exactLocations} />}
      {pattern.type === 'manipulativeButtons' && <ManipulativeButtonsEvidence evidence={pattern.evidence} />}
      {pattern.type === 'privacyZuckering' && <PrivacyZuckeringEvidence evidence={pattern.evidence} />}
    </div>
  );
};

// FOMO Evidence Component
const FomoEvidence = ({ evidence }) => (
  <div>
    <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
      <span className="text-blue-300 font-medium">FOMO Score: {evidence.fomoScore}</span>
    </div>
    <div className="space-y-3">
      {evidence.instances.slice(0, 3).map((instance, idx) => (
        <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/30">
          <span className="font-mono text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
            {instance.keyword}
          </span>
          <p className="text-xs text-gray-400 mt-3 font-mono leading-relaxed">
            ...{instance.context.substring(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Credit Card Evidence Component
const CreditCardEvidence = ({ exactLocations }) => (
  <div className="space-y-3">
    {exactLocations.map((location, idx) => (
      <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/30">
        <span className="font-mono text-xs bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
          {location.exactMatch}
        </span>
        <p className="text-xs text-gray-400 mt-3 font-mono leading-relaxed">
          ...{location.context}...
        </p>
      </div>
    ))}
  </div>
);

// Manipulative Buttons Evidence Component
const ManipulativeButtonsEvidence = ({ evidence }) => (
  <div className="space-y-3">
    {evidence.map((evidenceItem, idx) => (
      <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/30">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            <span className="text-yellow-400 font-medium">Positive buttons:</span> {evidenceItem.positiveButtons.join(', ')}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-red-400 font-medium">Missing negative options:</span> {evidenceItem.missingNegativeOptions.join(', ')}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// Privacy Zuckering Evidence Component
const PrivacyZuckeringEvidence = ({ evidence }) => (
  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/30">
    <div className="space-y-2">
      <p className="text-sm text-gray-300">
        <span className="text-purple-400 font-medium">Privacy mentions:</span> {evidence.privacyMentions.length}
      </p>
      <p className="text-sm text-gray-300">
        <span className="text-orange-400 font-medium">Tricky language:</span> {evidence.trickyLanguage.join(', ')}
      </p>
    </div>
  </div>
);

export default PatternEvidence;