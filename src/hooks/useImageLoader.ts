import { useState, useCallback, useRef } from 'react';

interface ImageLoaderState {
  loadedImages: Set<string>;
  totalImages: number;
  isAllLoaded: boolean;
}

export const useImageLoader = () => {
  const [state, setState] = useState<ImageLoaderState>({
    loadedImages: new Set(),
    totalImages: 0,
    isAllLoaded: false,
  });

  // Sử dụng ref để track các images đã được register
  const registeredImages = useRef<Set<string>>(new Set());

  const registerImage = useCallback((imageId: string) => {
    if (registeredImages.current.has(imageId)) {
      return;
    }
    // console.log("📝 TrackedImage useEffect triggered for:", imageId);
    registeredImages.current.add(imageId);
    setState(prev => ({
      ...prev,
      totalImages: prev.totalImages + 1,
    }));
  }, []);

  const markImageLoaded = useCallback((imageId: string) => {
    setState(prev => {
      const newLoadedImages = new Set(prev.loadedImages);
      newLoadedImages.add(imageId);
      const isAllLoaded = newLoadedImages.size >= prev.totalImages && prev.totalImages > 0;
      
      return {
        ...prev,
        loadedImages: newLoadedImages,
        isAllLoaded,
      };
    });
  }, []);

  const resetLoader = useCallback(() => {
    registeredImages.current.clear();
    setState({
      loadedImages: new Set(),
      totalImages: 0,
      isAllLoaded: false,
    });
  }, []);

  return {
    ...state,
    registerImage,
    markImageLoaded,
    resetLoader,
    loadingProgress: state.totalImages > 0 ? (state.loadedImages.size / state.totalImages) * 100 : 0,
  };
};