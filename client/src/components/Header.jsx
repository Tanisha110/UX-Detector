import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          UX Pattern Detection
        </h1>
      </div>
      <p className="text-gray-400 text-lg">Analyzing dark patterns and UX issues across websites</p>
    </div>
  );
};

export default Header;