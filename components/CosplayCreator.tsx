
import React, { useState } from 'react';
import { AppStep, Costume, Transformation } from '../types';
import { transformImage } from '../services/geminiService';
import { CostumeSelector } from './CostumeSelector';
import { ProcessingView } from './ProcessingView';
import { TransformationResult } from './TransformationResult';

export const CosplayCreator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECT_COSTUME);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [latestTransformation, setLatestTransformation] = useState<Transformation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64Image: string) => {
    setUserImage(base64Image);
  };

  const handleCostumeSelect = async (costume: Costume) => {
    if (!userImage) return;
    setSelectedCostume(costume);
    setCurrentStep(AppStep.PROCESSING);
    setIsLoading(true);
    setError(null);
    try {
      const resultImage = await transformImage(userImage, costume);
      const newTransformation: Transformation = {
        id: new Date().toISOString(),
        originalImage: userImage,
        resultImage,
        costume,
        createdAt: new Date(),
      };
      setLatestTransformation(newTransformation);
      setCurrentStep(AppStep.RESULT);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
      setCurrentStep(AppStep.SELECT_COSTUME); // Go back to costume selection on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetFlow = () => {
    setCurrentStep(AppStep.SELECT_COSTUME);
    setUserImage(null);
    setSelectedCostume(null);
    setError(null);
  };

  const handleClearPhoto = () => {
    setUserImage(null);
    setSelectedCostume(null); // Also reset selection when photo changes
  }

  const renderContent = () => {
    switch (currentStep) {
      case AppStep.SELECT_COSTUME:
        return <CostumeSelector 
          userImage={userImage} 
          onImageUpload={handleImageUpload}
          onClearPhoto={handleClearPhoto}
          onStartTransform={handleCostumeSelect} 
          isLoading={isLoading} 
        />;
      case AppStep.PROCESSING:
        return <ProcessingView costume={selectedCostume} />;
      case AppStep.RESULT:
        return <TransformationResult transformation={latestTransformation} onStartNew={resetFlow} />;
      default:
        return <CostumeSelector 
          userImage={userImage} 
          onImageUpload={handleImageUpload}
          onClearPhoto={handleClearPhoto}
          onStartTransform={handleCostumeSelect} 
          isLoading={isLoading} 
        />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        {error && (
        <div className="absolute top-20 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center animate-spring-in">
            <strong>Error:</strong> {error}
        </div>
        )}
        {renderContent()}
    </div>
  );
};
