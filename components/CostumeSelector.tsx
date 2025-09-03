
import React, { useState, useRef, useCallback } from 'react';
import { Costume, CostumeCategory } from '../types';
import { COSTUMES, CATEGORIES } from '../constants';
import { Icons } from './icons';

interface CostumeSelectorProps {
  userImage: string | null;
  onImageUpload: (base64Image: string) => void;
  onClearPhoto: () => void;
  onStartTransform: (costume: Costume) => void;
  isLoading: boolean;
}

const UploadCostumeCard: React.FC<{
  onClick: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  isSelected: boolean;
  previewImage: string | null;
}> = ({ onClick, onDrop, onDragOver, onDragEnter, onDragLeave, isDragging, isSelected, previewImage }) => (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`group relative flex flex-col items-center justify-center aspect-[2/3] rounded-2xl transition-all duration-300 border-2 cursor-pointer animate-spring-in overflow-hidden shadow-card ${
        isDragging 
          ? 'border-dashed border-accent scale-105 bg-accent/10' 
          : isSelected 
          ? `border-solid scale-105 ${previewImage ? 'border-accent' : 'border-dashed border-accent'}`
          : `hover:border-text-secondary/50 ${previewImage ? 'border-solid border-border-primary' : 'border-dashed border-border-dashed'}`
      }`}
      aria-label="Upload a custom costume"
    >
        {previewImage ? (
            <>
                <img src={previewImage} alt="Custom costume preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <Icons.upload className="w-10 h-10 text-white mb-3" />
                    <h3 className="text-white font-bold text-base">Change Costume</h3>
                </div>
                {isSelected && <div className="absolute inset-0 ring-4 ring-accent rounded-[14px] pointer-events-none"></div>}
            </>
        ) : (
            <>
                <Icons.upload className="w-10 h-10 text-text-secondary mb-3 transition-colors duration-300" />
                <h3 className="text-text-primary font-bold text-center text-base transition-colors duration-300">Upload Custom Costume</h3>
                <p className="text-text-tertiary text-xs mt-1 text-center px-2 transition-colors duration-300">Drag & drop or click</p>
                {isSelected && <div className="absolute inset-0 bg-accent/20 rounded-2xl pointer-events-none"></div>}
            </>
        )}
    </div>
);


const CostumeCard: React.FC<{ costume: Costume; onSelect: () => void; isSelected: boolean }> = ({ costume, onSelect, isSelected }) => (
    <div 
        className={`group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer animate-spring-in transition-all duration-300 shadow-card ${isSelected ? 'ring-4 ring-accent scale-105' : 'ring-0 hover:scale-105'}`}
        onClick={onSelect}
    >
        <img src={costume.thumbnailUrl} alt={costume.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-image-overlay-from to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-bold text-lg">{costume.name}</h3>
            <p className="text-gray-300 text-sm">{costume.category}</p>
        </div>
        <div className={`absolute inset-0 bg-accent/80 flex items-center justify-center transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
             <Icons.sparkles className="text-white" size={48} />
        </div>
    </div>
);


export const CostumeSelector: React.FC<CostumeSelectorProps> = ({ userImage, onImageUpload, onClearPhoto, onStartTransform, isLoading }) => {
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File is too large. Please select an image under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (file.name.startsWith('custom-')) {
             const customCostume: Costume = {
                id: `custom-${Date.now()}`,
                name: file.name.split('.').slice(0, -1).join('.') || 'Custom Costume',
                category: CostumeCategory.CUSTOM,
                thumbnailUrl: result,
            };
            setSelectedCostume(customCostume);
        } else {
            onImageUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleCustomCostumeFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File is too large. Please select an image under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const customCostume: Costume = {
            id: `custom-${Date.now()}`,
            name: file.name.split('.').slice(0, -1).join('.') || 'Custom Costume',
            category: CostumeCategory.CUSTOM,
            thumbnailUrl: result,
        };
        setSelectedCostume(customCostume);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Drag and Drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, isCustom: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      isCustom ? handleCustomCostumeFile(e.dataTransfer.files[0]) : handleFile(e.dataTransfer.files[0]);
    }
  };
  

    
  const isCustomCostumeSelected = selectedCostume?.category === CostumeCategory.CUSTOM;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-spring-in">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-1/3 xl:w-1/4">
                <div className="sticky top-24">
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4 transition-colors duration-300">Your Photo</h2>
                    <div className="h-[380px] sm:h-[420px] lg:h-auto lg:aspect-[3/4] mb-5">
                    {userImage ? (
                        <div className="group relative rounded-2xl overflow-hidden w-full h-full shadow-card">
                          <img src={userImage} alt="User upload" className="object-cover w-full h-full" />
                          <div 
                            onClick={onClearPhoto}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                          >
                              <Icons.upload size={32} className="text-white mb-2" />
                              <p className="font-semibold text-white">Change Photo</p>
                          </div>
                        </div>
                    ) : (
                        <div
                          className={`relative flex flex-col items-center justify-center w-full h-full bg-card-bg border-2 border-dashed rounded-2xl transition-all duration-300 shadow-card ${
                            isDragging ? 'border-accent scale-105' : 'border-border-dashed'
                          }`}
                          onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e)}
                        >
                          <Icons.upload className="w-12 h-12 text-text-tertiary mb-3" />
                          <h3 className="text-text-primary text-lg font-semibold text-center px-4">Drag & Drop Image</h3>
                          <p className="text-text-secondary mt-1">or</p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 px-5 py-2 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
                          >
                            Browse Files
                          </button>
                          <p className="absolute bottom-4 text-xs text-text-tertiary mt-4 px-2 text-center">JPG, PNG, WEBP, HEIC. Max 10MB.</p>
                          <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp, image/heic" className="hidden" onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)} />
                        </div>
                    )}
                    </div>
                    

                     <button
                        onClick={() => selectedCostume && userImage && onStartTransform(selectedCostume)}
                        disabled={!selectedCostume || !userImage || isLoading}
                        className="w-full h-14 flex items-center justify-center rounded-xl font-semibold text-base transition-all duration-300 disabled:cursor-not-allowed group bg-accent disabled:bg-btn-disabled-bg disabled:text-btn-disabled-text text-white active:scale-[0.98] disabled:active:scale-100"
                    >
                         {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Transforming...
                            </>
                        ) : !userImage ? 'Upload a Photo' : !selectedCostume ? 'Select a Costume' : 'Transform Now' }
                    </button>
                </div>
            </div>
            <div className="w-full lg:w-2/3 xl:w-3/4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 transition-colors duration-300">Choose a Costume</h2>
                <p className="text-text-secondary mb-6 transition-colors duration-300">Select a style or upload your own to begin the transformation.</p>
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    <UploadCostumeCard
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={(e) => handleDrop(e, true)}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        isDragging={isDragging}
                        isSelected={isCustomCostumeSelected}
                        previewImage={isCustomCostumeSelected ? selectedCostume.thumbnailUrl : null}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp, heic"
                        className="hidden"
                        onChange={(e) => handleCustomCostumeFile(e.target.files ? e.target.files[0] : null)}
                    />
                    {COSTUMES.map(costume => (
                        <CostumeCard 
                            key={costume.id} 
                            costume={costume} 
                            onSelect={() => setSelectedCostume(costume)}
                            isSelected={!isCustomCostumeSelected && selectedCostume?.id === costume.id} 
                        />
                    ))}
                 </div>
            </div>
        </div>
    </div>
  );
};
