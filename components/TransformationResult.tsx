
import React, { useState } from 'react';
import { Transformation } from '../types';
import { Icons } from './icons';

interface TransformationResultProps {
  transformation: Transformation | null;
  onStartNew: () => void;
}

export const TransformationResult: React.FC<TransformationResultProps> = ({ transformation, onStartNew }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    if (!transformation) return null;

    const handleMove = (clientX: number, rect: DOMRect) => {
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-spring-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary text-center transition-colors duration-300">Transformation Complete!</h1>
            <p className="text-text-secondary text-center mt-2 mb-8 transition-colors duration-300">You've been transformed into <span className="font-semibold text-text-primary transition-colors duration-300">{transformation.costume.name}</span>.</p>

            <div 
                className="relative w-full max-w-2xl mx-auto aspect-[3/4] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-card"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                <img src={transformation.originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                <div 
                    className="absolute inset-0 w-full h-full overflow-hidden" 
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={transformation.resultImage} alt="Transformed" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'contrast(1.1) saturate(1.1)' }}/>
                </div>
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm cursor-ew-resize"
                    style={{ left: `calc(${sliderPosition}% - 2px)` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-slider-handle-text" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                <button className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-bg-secondary text-text-secondary font-medium rounded-lg hover:bg-border-primary hover:text-text-primary transition-colors duration-300">
                    <Icons.download size={20} />
                    <span>Download 4K</span>
                </button>
                 <button className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-bg-secondary text-text-secondary font-medium rounded-lg hover:bg-border-primary hover:text-text-primary transition-colors duration-300">
                    <Icons.share size={20} />
                    <span>Share</span>
                </button>
                <button 
                    onClick={onStartNew}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                     <Icons.sparkles size={20} />
                    <span>Create Another</span>
                </button>
            </div>
        </div>
    );
};
