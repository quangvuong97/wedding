import React from 'react';
import { Progress } from 'antd';

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
  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .custom-progress .ant-progress-bg {
          transition: width 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .loading-overlay .text-center > * {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
      
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center loading-overlay"
        style={{
          background: 'linear-gradient(135deg, #1e8267 0%, #2d9f7a 50%, #1e8267 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="text-center text-white px-8">
          {/* Logo hoặc icon wedding */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 font-['Great_Vibes',cursive]">
              Đang chuẩn bị...
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Chúng tôi đang tải những khoảnh khắc đẹp nhất
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto mb-4">
            <Progress
              percent={Math.round(progress)}
              strokeColor={{
                '0%': '#ffffff',
                '100%': '#f0f0f0',
              }}
              trailColor="rgba(255, 255, 255, 0.2)"
              strokeWidth={8}
              showInfo={false}
              className="custom-progress"
            />
          </div>

          {/* Loading stats */}
          <div className="text-sm opacity-80">
            <p className="mt-1">{Math.round(progress)}% hoàn thành</p>
          </div>

          {/* Loading animation */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingOverlay;