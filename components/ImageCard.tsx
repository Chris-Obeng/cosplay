import React, { useState } from 'react';
import { Heart, Share, SwitchCamera } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageCardProps {
  src: string;
  alt: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cosplay Transformation',
        text: 'Check out this amazing cosplay transformation!',
        url: window.location.href,
      });
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out bg-card-light dark:bg-card-dark">
      <LazyLoadImage
        alt={alt}
        effect="blur"
        src={src}
        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
      <div className="absolute top-0 right-0 p-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
        <button className="text-white" onClick={handleShare}>
          <Share size={24} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 p-4 w-full flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
        <button className={`text-white transition-colors duration-300 ${liked ? 'text-red-500' : ''}`} onClick={handleLike}>
          <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default ImageCard;