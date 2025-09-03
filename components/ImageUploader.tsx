
import React, { useState, useCallback, useRef } from 'react';
import { Icons } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
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
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 animate-spring-in">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-96 bg-card-surface border-2 border-dashed rounded-2xl transition-all duration-300 ${
          isDragging ? 'border-electric-blue scale-105' : 'border-border-subtle'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Icons.upload className="w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-white text-xl font-semibold">Drag & Drop Image</h3>
        <p className="text-gray-400 mt-1">or</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 px-6 py-2 bg-electric-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/heic"
          className="hidden"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        />
        <p className="text-xs text-gray-500 mt-4">JPG, PNG, WEBP, HEIC accepted. Max 10MB.</p>
      </div>
    </div>
  );
};
