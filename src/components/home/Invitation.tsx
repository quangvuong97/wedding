import { Col, Row, Button, Space } from "antd";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface InvitationInfo {
  image: string;
  name?: string;
}

interface CircularOverlayStyle {
  position: "absolute";
  left: string;
  top: string;
  width: string;
  height: string;
  borderRadius: string;
  overflow: string;
  border: string;
  boxShadow: string;
  zIndex: number;
}

const Invitation: React.FC = () => {
  const [overlayStyles, setOverlayStyles] = useState<
    CircularOverlayStyle | {}
  >();
  const imageRef = useRef<HTMLImageElement | null>(null);

  const info: InvitationInfo[] = [
    {
      image: "https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg",
      name: "Nhà Trai",
    },
    {
      image: "https://wpocean.com/html/tf/loveme/assets/images/story/1.jpg",
      name: "Nhà Gái",
    },
  ];

  const circularAreaConfig = useMemo(
    () => ({
      centerX: 49.8,
      centerY: 26.25,
      radiusPercent: 21.7,
    }),
    []
  );

  const handleButtonClick = () => {
    console.log("Button clicked!");
  };

  // Calculate overlay style with useCallback to fix dependency warning
  const calculateOverlayStyle = useCallback((): CircularOverlayStyle | {} => {
    if (!imageRef.current) return {};

    const rect = imageRef.current.getBoundingClientRect();
    const imageWidth = rect.width;
    const imageHeight = rect.height;

    if (imageWidth === 0 || imageHeight === 0) return {};

    const centerX = (circularAreaConfig.centerX / 100) * imageWidth;
    const centerY = (circularAreaConfig.centerY / 100) * imageHeight;
    const radius = (circularAreaConfig.radiusPercent / 100) * imageWidth;

    const overlaySize = radius * 2;
    const overlayLeft = centerX - radius;
    const overlayTop = centerY - radius;

    return {
      position: "absolute" as const,
      left: `${overlayLeft}px`,
      top: `${overlayTop}px`,
      width: `${overlaySize}px`,
      height: `${overlaySize}px`,
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5)",
      zIndex: 10,
    };
  }, [circularAreaConfig]);

  const updateOverlayPosition = useCallback(() => {
    const newStyle = calculateOverlayStyle();
    setOverlayStyles(newStyle);
  }, [calculateOverlayStyle]);

  const handleImageLoad = () => {
    requestAnimationFrame(() => {
      updateOverlayPosition();
    });
  };

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        updateOverlayPosition();
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateOverlayPosition]);

  return (
    <section>
      <div className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]">
        <div className="flex flex-wrap -mx-3 -mt-0">
          <div className="mb-[60px] text-center maxLg:mb-[40px] flex-shrink-0 w-full max-w-full px-3 mt-0">
            <img
              src="https://wpocean.com/html/tf/loveme/assets/images/section-title2.png"
              alt=""
              className="max-w-full align-middle inline"
            />
            <h2 className="text-[40px] leading-[55px] my-[15px] relative uppercase font-[Futura_PT] font-medium text-[#002642] maxLg:text-[32px] maxLg:leading-[40px] maxSsm:text-[22px]">
              Wedding Invitation
            </h2>
            <div
              className="max-w-[200px] mx-auto relative
            [&::before]:absolute [&::before]:left-[-70px] [&::before]:top-1/2 [&::before]:-translate-y-1/2 [&::before]:content-[''] [&::before]:w-[144px] [&::before]:h-[1px] [&::before]:bg-[#1e8267]
            [&::after]:absolute [&::after]:right-[-70px] [&::after]:top-1/2 [&::after]:-translate-y-1/2 [&::after]:content-[''] [&::after]:w-[144px] [&::after]:h-[1px] [&::after]:bg-[#1e8267]"
            >
              <div className="absolute left-1/2 w-[15px] h-[15px] border border-[#1e8267] rounded-full -translate-x-1/2 -top-[5px]"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 -mt-0">
          <Row
            justify="center"
            gutter={[16, 16]}
            className="px-3 mx-auto w-full"
          >
            {info.map((item, index) => {
              return (
                <Col xs={24} md={12} key={index}>
                  <Space
                    direction="vertical"
                    size="middle"
                    className="w-full"
                    align="center"
                  >
                    <Space>
                      <Button
                        type="default"
                        size="middle"
                        style={{ width: "auto", minWidth: "120px" }}
                      >
                        {item.name || `Person ${index + 1}`}
                      </Button>
                      <Button
                        type="primary"
                        size="middle"
                        onClick={handleButtonClick}
                        style={{ width: "auto", minWidth: "120px" }}
                      >
                        View Details {index + 1}
                      </Button>
                    </Space>
                    <div className="w-full relative">
                      <img
                        ref={(el) => {
                          if (index === 0 && el) {
                            imageRef.current = el;
                          }
                        }}
                        src="https://w.ladicdn.com/s800x1000/5c728619c417ab07e5194baa/3-20240601020038-vnpyd.png"
                        alt={`Invitation ${index + 1}`}
                        className="w-full h-auto object-contain"
                        style={{ display: "block" }}
                        onLoad={() => handleImageLoad()}
                      />

                      <img
                        src={item.image}
                        alt={`Profile ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={overlayStyles}
                      />
                    </div>
                  </Space>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default Invitation;
