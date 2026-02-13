import React from 'react';

interface FeatureTileProps {
  feature: {
    icon: string;
    title: string;
    description: string;
  };
  isActive: boolean;
  onClick: () => void;
}

const FeatureTile: React.FC<FeatureTileProps> = ({ feature, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
        isActive
          ? 'bg-gradient-to-br from-[#16a34a] to-[#34d399] text-white shadow-2xl scale-105'
          : 'bg-[#fafaff] backdrop-blur-sm border border-[#16a34a]/20 text-[#1a1a2e] shadow-lg hover:border-[#16a34a]'
      }`}
    >
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className={`text-xl font-bold mb-3 ${
        isActive ? 'text-white' : 'text-[#1a1a2e]'
      }`}>
        {feature.title}
      </h3>
      <p className={`text-sm font-medium ${
        isActive ? 'text-white/90' : 'text-[#4a4a6a]'
      }`}>
        {feature.description}
      </p>
      <div className={`mt-4 text-sm font-semibold ${
        isActive ? 'text-white/80' : 'text-[#16a34a]'
      }`}>
        Click to see example →
      </div>
    </div>
  );
};

export default FeatureTile;

