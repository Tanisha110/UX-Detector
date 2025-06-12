import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import PatternAnalysis from './components/PatternAnalysis';
import DetailedPatternsList from './components/DetailedPatternsList';
import Footer from './components/Footer';
import { analysisData } from './data/analysisData';

const Dashboard = () => {
  const [expandedPattern, setExpandedPattern] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <SummaryCards analysisData={analysisData} />
        <PatternAnalysis analysisData={analysisData} />
        <DetailedPatternsList 
          analysisData={analysisData}
          expandedPattern={expandedPattern}
          setExpandedPattern={setExpandedPattern}
        />
        <Footer analysisData={analysisData} />
      </div>
    </div>
  );
};

export default Dashboard;