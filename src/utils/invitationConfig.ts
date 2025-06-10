// Configuration for invitation circular overlay positioning
// These values can be adjusted based on different invitation templates

export interface CircularAreaConfig {
  centerX: number; // Percentage from left (0-100)
  centerY: number; // Percentage from top (0-100)
  radiusPercent: number; // Percentage of image width (0-100)
}

// Default configuration for the current invitation template
export const defaultCircularConfig: CircularAreaConfig = {
  centerX: 50, // 50% from left (centered horizontally)
  centerY: 32, // 32% from top (based on template analysis)
  radiusPercent: 11, // 11% of image width
};

// Alternative configurations for different templates or adjustments
export const circularConfigs = {
  // Current template - optimized position
  default: defaultCircularConfig,
  
  // Slightly higher position
  higher: {
    centerX: 50,
    centerY: 28,
    radiusPercent: 11,
  },
  
  // Slightly lower position
  lower: {
    centerX: 50,
    centerY: 36,
    radiusPercent: 11,
  },
  
  // Larger circle
  larger: {
    centerX: 50,
    centerY: 32,
    radiusPercent: 13,
  },
  
  // Smaller circle
  smaller: {
    centerX: 50,
    centerY: 32,
    radiusPercent: 9,
  },
};

// Function to calculate pixel coordinates from percentage
export const calculatePixelCoordinates = (
  config: CircularAreaConfig,
  imageWidth: number,
  imageHeight: number
) => {
  const centerX = (config.centerX / 100) * imageWidth;
  const centerY = (config.centerY / 100) * imageHeight;
  const radius = (config.radiusPercent / 100) * imageWidth;
  
  return {
    centerX,
    centerY,
    radius,
    diameter: radius * 2,
    left: centerX - radius,
    top: centerY - radius,
  };
};

// Function to validate configuration values
export const validateConfig = (config: CircularAreaConfig): boolean => {
  return (
    config.centerX >= 0 && config.centerX <= 100 &&
    config.centerY >= 0 && config.centerY <= 100 &&
    config.radiusPercent > 0 && config.radiusPercent <= 50 // Max 50% to ensure it fits
  );
};

// Helper function to create responsive overlay styles
export const createOverlayStyle = (
  config: CircularAreaConfig,
  imageElement: HTMLImageElement | null
) => {
  if (!imageElement) return {};
  
  const rect = imageElement.getBoundingClientRect();
  const { width: imageWidth, height: imageHeight } = rect;
  
  if (imageWidth === 0 || imageHeight === 0) return {};
  
  const coords = calculatePixelCoordinates(config, imageWidth, imageHeight);
  
  return {
    position: 'absolute' as const,
    left: `${coords.left}px`,
    top: `${coords.top}px`,
    width: `${coords.diameter}px`,
    height: `${coords.diameter}px`,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    zIndex: 10,
  };
};