import React, { useState, useEffect } from 'react';
import FeatureTile from './FeatureTile';
import FeatureModal from './FeatureExampleModal';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const WhyChoosePollVotePro: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: '🎨',
      title: 'Advanced Design',
      description: 'Professional templates, color palettes, and custom styling options'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Live vote tracking with beautiful charts and visualizations'
    },
    {
      icon: '🚀',
      title: 'Multiple Workspaces',
      description: 'Organize polls across different projects and teams'
    },
    {
      icon: '💾',
      title: 'Export & Share',
      description: 'Download results as CSV, JSON, or share with custom links'
    }
  ];

  // Auto-rotate featured tile highlight
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleTileClick = (index: number) => {
    setSelectedFeatureIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedFeatureIndex(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-white">
        Why Choose PollVote Pro?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureTile
            key={index}
            feature={feature}
            isActive={currentFeature === index}
            onClick={() => handleTileClick(index)}
          />
        ))}
      </div>

      {/* Feature Modal */}
      {selectedFeatureIndex !== null && (
        <FeatureModal
          isOpen={selectedFeatureIndex !== null}
          onClose={handleCloseModal}
          feature={features[selectedFeatureIndex]}
        />
      )}
    </div>
  );
};

export default WhyChoosePollVotePro;

