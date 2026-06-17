import React from 'react';
import { Plus } from 'lucide-react';

const StartNewProjectCard = ({ onStartNewProject }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px] hover:border-gray-700 transition-all cursor-pointer group"
      onClick={onStartNewProject}>
      <div className="bg-lime-400/20 border border-lime-400/50 rounded-full p-6 mb-4 group-hover:bg-lime-400/30 transition-colors">
        <Plus size={40} className="text-lime-400" />
      </div>
      <h3 className="text-white text-lg font-semibold text-center">Start New Project</h3>
      <p className="text-gray-400 text-sm text-center mt-2">Scale your business with new ventures</p>
    </div>
  );
};

export default StartNewProjectCard;
