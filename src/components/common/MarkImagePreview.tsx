import React from "react";
import TrackedImage from "./TrackedImage";

interface MarkImagePreviewProps {
  urlEndpoint: string;
  src: string;
  bodyWidth?: number;
  onClick?: () => void;
}

const MarkImagePreview: React.FC<MarkImagePreviewProps> = ({
  src,
  urlEndpoint,
  bodyWidth,
  onClick,
}: MarkImagePreviewProps) => {
  const breakpoint = bodyWidth ? Math.round(bodyWidth * 1.2) : undefined;

  if (!urlEndpoint || !src) return null;
  return (
    <div
      className="album-image"
      style={{ position: "relative" }}
      onClick={onClick}
    >
      <TrackedImage
        urlEndpoint={urlEndpoint}
        src={src}
        imageBreakpoints={breakpoint ? [breakpoint] : undefined}
        deviceBreakpoints={breakpoint ? [breakpoint] : undefined}
      />
      <div
        className="hover:!opacity-100"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "rgba(0, 0, 0, 0.5)",
          cursor: "pointer",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: "0 4px",
          }}
        >
          <span
            role="img"
            aria-label="eye"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "inherit",
              fontStyle: "normal",
              lineHeight: 0,
              textAlign: "center",
              textTransform: "none",
              verticalAlign: "-0.125em",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              marginInlineEnd: "4px",
            }}
          >
            <svg
              style={{ verticalAlign: "baseline", display: "inline-block" }}
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="eye"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
            </svg>
          </span>
          Preview
        </div>
      </div>
    </div>
  );
};

export default MarkImagePreview;
