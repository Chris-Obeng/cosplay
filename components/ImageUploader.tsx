
import React, { useState, useCallback, useRef } from 'react';
import { Icons } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please ensure permissions are granted.");
        setIsCameraOpen(false);
    }
  };

  const takePicture = () => {
      const video = videoRef.current;
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageUpload(dataUrl);
        closeCamera();
      }
  };

  const closeCamera = () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
  };


  if (isCameraOpen) {
    return (
        <div className="w-full max-w-2xl mx-auto animate-spring-in">
             <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <button onClick={closeCamera} className="absolute top-4 right-4 h-10 w-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/75 transition-colors">
                    <Icons.close size={20}/>
                </button>
            </div>
             <div className="mt-6 flex justify-center">
                <button onClick={takePicture} className="h-16 w-16 bg-white rounded-full flex items-center justify-center ring-4 ring-white/30 hover:ring-white/50 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full border-2 border-space-gray"></div>
                </button>
             </div>
        </div>
    );
  }

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

       <div className="flex justify-center mt-6">
        <button
          onClick={openCamera}
          className="flex items-center space-x-2 px-6 py-3 bg-card-surface text-gray-300 font-medium rounded-lg hover:bg-border-subtle hover:text-white transition-colors"
        >
          <Icons.camera size={20} />
          <span>Use Camera</span>
        </button>
      </div>
    </div>
  );
};
