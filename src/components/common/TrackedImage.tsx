import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Image } from "@imagekit/react";
import { useImageLoaderContext } from "../../contexts/ImageLoaderContext";

interface TrackedImageProps {
  src: string;
  urlEndpoint?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  transformation?: any[];
  loading?: "lazy" | "eager";
  lqip?: { active: boolean };
  onLoad?: () => void;
  onError?: () => void;
  imageId?: string;
  [key: string]: any;
}

const TrackedImage = forwardRef<HTMLImageElement, TrackedImageProps>(
  (
    { src, urlEndpoint, imageId, onLoad, onError, loading, ...props },
    externalRef
  ) => {
    const { registerImage, markImageLoaded } = useImageLoaderContext();
    const [hasRegistered, setHasRegistered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const internalRef = useRef<HTMLImageElement | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const finalImageId = useMemo(() => {
      return imageId || `${urlEndpoint || "static"}${src}`;
    }, [imageId, urlEndpoint, src]);

    useImperativeHandle(externalRef, () => internalRef.current!, []);

    useEffect(() => {
      if (!hasRegistered && src && finalImageId) {
        registerImage(finalImageId);
        setHasRegistered(true);
      }
    }, [finalImageId, hasRegistered, registerImage, src]);

    // Function để mark image là completed
    const markAsCompleted = useCallback(
      (source: string) => {
        if (isCompleted) return;

        markImageLoaded(finalImageId);
        setIsCompleted(true);

        // Clear interval nếu có
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      },
      [finalImageId, markImageLoaded, isCompleted]
    );

    // Check trạng thái ảnh
    const checkImageStatus = useCallback(() => {
      if (!internalRef.current || isCompleted) return;

      const img = internalRef.current;

      // Case 1: Ảnh đã load thành công (từ cache hoặc network)
      if (img.complete && img.naturalWidth > 0) {
        markAsCompleted("cache/complete");
        onLoad?.();
        return;
      }

      // Case 2: Ảnh load lỗi
      if (img.complete && img.naturalWidth === 0) {
        markAsCompleted("error");
        onError?.();
        return;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markAsCompleted, onLoad, onError, finalImageId, isCompleted]);

    // Event handlers
    const handleLoad = useCallback(() => {
      markAsCompleted("network");
      onLoad?.();
    }, [markAsCompleted, onLoad]);

    const handleError = useCallback(() => {
      markAsCompleted("error");
      onError?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markAsCompleted, onError, finalImageId]);

    // Ref callback để handle cả internal và external ref
    const setImgRef = useCallback(
      (element: HTMLImageElement | null) => {
        internalRef.current = element;

        if (element && !isCompleted) {
          // Check ngay lập tức
          setTimeout(checkImageStatus, 0);

          // Setup interval để check định kỳ (fallback)
          if (!checkIntervalRef.current) {
            checkIntervalRef.current = setInterval(checkImageStatus, 100);

            // Clear interval sau 5 giây để tránh memory leak
            setTimeout(() => {
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
            }, 5000);
          }
        }
      },
      [checkImageStatus, isCompleted]
    );

    // Reset state khi src thay đổi
    useEffect(() => {
      setIsCompleted(false);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    }, [src]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }, []);

    // Force eager loading để track được tất cả ảnh ngay từ đầu
    // Chỉ override thành "eager" nếu không có loading prop được truyền vào
    const loadingMode = loading || "eager";

    if (urlEndpoint) {
      return (
        <Image
          {...props}
          src={src}
          urlEndpoint={urlEndpoint}
          onLoad={handleLoad}
          onError={handleError}
          ref={setImgRef}
          loading={loadingMode}
        />
      );
    }

    // For static images
    return (
      <img
        alt=""
        {...props}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        ref={setImgRef}
        loading={loadingMode}
      />
    );
  }
);

TrackedImage.displayName = "TrackedImage";

export default React.memo(TrackedImage);
