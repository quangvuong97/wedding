import React, { useState, useEffect } from "react";
import { Progress } from "antd";

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  loadedCount: number;
  totalCount: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  progress,
  loadedCount,
  totalCount,
}) => {
  const [fontReady, setFontReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    // Check if font is already loaded
    if ((window as any).greatVibesLoaded) {
      setFontReady(true);
      return;
    }

    // Listen for font load event
    const handleFontLoad = () => {
      setFontReady(true);
    };

    // Add event listener for font load
    window.addEventListener("greatVibesLoaded", handleFontLoad);

    return () => {
      window.removeEventListener("greatVibesLoaded", handleFontLoad);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      // Start exit animation
      setIsExiting(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 800); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <style>{`
        .loading-overlay {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                      backdrop-filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .loading-overlay.exiting {
          opacity: 0;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
        }
        
        .custom-progress .ant-progress-bg {
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .custom-progress .ant-progress-outer {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .custom-progress .ant-progress-inner {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOutDown {
          from { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
          to { 
            opacity: 0; 
            transform: translateY(-40px) scale(0.95);
          }
        }
        
        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.8);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .loading-content {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .loading-content.exiting {
          animation: slideOutDown 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .loading-icon {
          animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1), pulse 2s ease-in-out infinite;
        }
        
        .loading-title {
          font-family: 'Great Vibes', cursive, serif !important;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        
        .loading-subtitle {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }
        
        .loading-progress {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
        }
        
        .loading-stats {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both;
        }
        
        .loading-dots {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s both;
        }
        
        .bounce-dot {
          animation: bounce 1.4s ease-in-out infinite;
        }
        
        .bounce-dot:nth-child(1) { animation-delay: 0s; }
        .bounce-dot:nth-child(2) { animation-delay: 0.2s; }
        .bounce-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          40% { 
            transform: translateY(-12px) scale(1.1);
            opacity: 1;
          }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center loading-overlay ${
          isExiting ? "exiting" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, #1e8267 0%, #2d9f7a 50%, #1e8267 100%)",
        }}
      >
        {/* Show content only when font is actually ready */}
        {fontReady && (
          <div
            className={`loading-content text-center text-white px-8 max-w-md mx-auto ${
              isExiting ? "exiting" : ""
            }`}
          >
            {/* Logo/Icon */}
            <div className="mb-10">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center loading-icon">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              <h2 className="text-4xl font-bold mb-3 loading-title text-white">
                Đang chuẩn bị...
              </h2>

              <p className="text-lg opacity-90 mb-8 loading-subtitle leading-relaxed">
                Chúng tôi đang tải những khoảnh khắc đẹp nhất
              </p>
            </div>

            {/* Progress Section */}
            <div className="loading-progress mb-6">
              <div className="w-full max-w-sm mx-auto mb-4">
                <Progress
                  percent={Math.round(progress)}
                  strokeColor={{
                    "0%": "#ffffff",
                    "100%": "#f8fafc",
                  }}
                  trailColor="rgba(255, 255, 255, 0.15)"
                  strokeWidth={10}
                  showInfo={false}
                  className="custom-progress"
                />
              </div>

              <div className="loading-stats text-sm opacity-80">
                <p className="font-medium">
                  {Math.round(progress)}% hoàn thành
                </p>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="loading-dots flex justify-center space-x-2">
              <div className="w-2.5 h-2.5 bg-white rounded-full bounce-dot"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full bounce-dot"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full bounce-dot"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoadingOverlay;
