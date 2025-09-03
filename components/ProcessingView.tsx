
import React, { useState, useEffect } from 'react';
import { Icons } from './icons';
import { Costume } from '../types';

interface ProcessingViewProps {
  costume: Costume | null;
}

const messages = [
  "Warming up the AI transformation engine...",
  "Analyzing facial features for preservation...",
  "Stitching digital threads of your costume...",
  "Applying realistic lighting and shadows...",
  "Adding final touches of magic...",
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({ costume }) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] animate-spring-in text-center p-4">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-accent rounded-full animate-ring"></div>
        {costume?.thumbnailUrl && (
            <img 
                src={costume.thumbnailUrl} 
                alt={costume.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
            />
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-8 transition-colors duration-300">
        Creating Your Cosplay
      </h2>
      <p className="text-text-secondary mt-2 max-w-sm transition-colors duration-300">
        Please wait a moment. Our AI is crafting your transformation into a <span className="font-semibold text-text-primary transition-colors duration-300">{costume?.name}</span>.
      </p>
       <div className="mt-8 text-accent font-medium transition-all duration-500">
        {currentMessage}
      </div>
    </div>
  );
};
