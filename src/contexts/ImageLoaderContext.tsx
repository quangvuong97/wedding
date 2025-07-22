import React, { createContext, useContext } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';

interface ImageLoaderContextType {
  loadedImages: Set<string>;
  totalImages: number;
  isAllLoaded: boolean;
  loadingProgress: number;
  registerImage: (imageId: string) => void;
  markImageLoaded: (imageId: string) => void;
  resetLoader: () => void;
}

const ImageLoaderContext = createContext<ImageLoaderContextType | null>(null);

export const ImageLoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const imageLoader = useImageLoader();

  return (
    <ImageLoaderContext.Provider value={imageLoader}>
      {children}
    </ImageLoaderContext.Provider>
  );
};

export const useImageLoaderContext = () => {
  const context = useContext(ImageLoaderContext);
  if (!context) {
    throw new Error('useImageLoaderContext must be used within ImageLoaderProvider');
  }
  return context;
};