import React from 'react';
// FIX: Import LucideProps to correctly type icon component props.
import { UploadCloud, Camera, Sparkles, ChevronLeft, Download, Share2, X, Sun, Moon, type LucideProps } from 'lucide-react';

// You can pre-configure size, strokeWidth, etc. here
const defaultProps = {
  size: 24,
  strokeWidth: 1.5,
};

export const Icons = {
  // FIX: Explicitly type props with LucideProps to allow passing className, size, etc.
  upload: (props: LucideProps) => <UploadCloud {...defaultProps} {...props} />,
  camera: (props: LucideProps) => <Camera {...defaultProps} {...props} />,
  sparkles: (props: LucideProps) => <Sparkles {...defaultProps} {...props} />,
  back: (props: LucideProps) => <ChevronLeft {...defaultProps} {...props} />,
  download: (props: LucideProps) => <Download {...defaultProps} {...props} />,
  share: (props: LucideProps) => <Share2 {...defaultProps} {...props} />,
  close: (props: LucideProps) => <X {...defaultProps} {...props} />,
  sun: (props: LucideProps) => <Sun {...defaultProps} {...props} />,
  moon: (props: LucideProps) => <Moon {...defaultProps} {...props} />,
};
