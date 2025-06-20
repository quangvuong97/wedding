import { Col, Row, Button, Space, Typography } from "antd";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { CustomButton } from "../../common";
import Section from "../../common/Section";

const { Text } = Typography;

interface InvitationInfo {
  image: string;
  tabName?: string;
  brideName: string;
  groomName: string;
  guestName: string;
  solarDate: {
    hour: string;
    date: number;
    month: number;
    year: number;
    dayOfWeek: string;
  };
  lunarDate: string;
  address: string;
  ggMap: string;
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
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const BASE_IMAGE_WIDTH = 464; // Base width for which the fixed values were designed

  const info: InvitationInfo[] = [
    {
      image: "https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg",
      tabName: "Nhà Trai",
      brideName: "Phương Ninh",
      groomName: "Quang Vương",
      guestName: "",
      solarDate: {
        hour: "9 giờ 30",
        date: 1,
        month: 1,
        year: 2026,
        dayOfWeek: "thứ 5",
      },
      lunarDate: "ngày 13 tháng 11 năm Ất Tỵ",
      address: "Hội trường thôn Kha Lý\nXã Thụy Quỳnh, Thái Thụy, Thái Bình",
      ggMap: "",
    },
    {
      image: "https://wpocean.com/html/tf/loveme/assets/images/story/1.jpg",
      tabName: "Nhà Gái",
      brideName: "Phương Ninh",
      groomName: "Quang Vương",
      guestName: "Bạn ABC",
      solarDate: {
        hour: "9 giờ 30",
        date: 1,
        month: 1,
        year: 2026,
        dayOfWeek: "thứ 5",
      },
      lunarDate: "ngày 13 tháng 11 năm Ất Tỵ",
      address: "Thôn Đào Khê Thượng\nNghĩa Châu, Nghĩa Hưng, Nam Định",
      ggMap: "",
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

  // Helper function to generate scaled styles for the invitation text
  const getScaledStyles = useCallback(() => {
    const scale = scaleFactor;
    return {
      container: {
        top: `${322.808 * scale}px`,
        width: `${BASE_IMAGE_WIDTH}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      },
    };
  }, [scaleFactor]);

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

    // Calculate scale factor based on current image width
    if (imageRef.current) {
      const currentWidth = imageRef.current.getBoundingClientRect().width;
      const newScaleFactor = currentWidth / BASE_IMAGE_WIDTH;
      setScaleFactor(newScaleFactor);
    }
  }, [calculateOverlayStyle, BASE_IMAGE_WIDTH]);

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
    <Section title="Wedding Invitation">
      <Row
        justify="center"
        gutter={[
          { xs: 0, sm: 16, md: 16 }, // horizontal gutter (giữa các cột)
          { xs: 40, sm: 16, md: 16 }, // vertical gutter (giữa các hàng)
        ]}
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
                    {item.tabName || `Person ${index + 1}`}
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
                  <Space
                    direction="vertical"
                    className="absolute"
                    style={{
                      display: "flex",
                      top: getScaledStyles().container.top,
                      width: getScaledStyles().container.width,
                      transform: getScaledStyles().container.transform,
                      transformOrigin:
                        getScaledStyles().container.transformOrigin,
                    }}
                  >
                    <Space direction="vertical" size={0}>
                      <Text className="font-[VVZORGluaEhvbiUVEY] text-[rgb(188,83,77)] tracking-[0.6px] text-[39px] leading-[1.4]">
                        {item.groomName} &amp; {item.brideName}
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] text-[rgb(0, 0, 0)] text-[15px] leading-[1.6]">
                        TRÂN TRỌNG KÍNH MỜI
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.6] text-black text-[16px]">
                        {item.guestName || "Quý Khách"}
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] leading-[1.6] text-black text-[14px]">
                        Đến dự buổi tiệc chung vui cùng gia đình chúng tôi
                      </Text>
                      <div className="pt-[5px]">
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px] relative -left-[8px]">
                          {item.solarDate.hour.toUpperCase()}
                        </Text>
                      </div>
                      <Space size={8} align="center">
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item.solarDate.dayOfWeek.toUpperCase()}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)] relative -top-[10px]"></div>
                        <Text className="text-[45px] font-dancing-script font-bold leading-[0.4] text-[rgb(205,99,99)]">
                          {item.solarDate.date.toString().padStart(2, "0")}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)]"></div>
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item.solarDate.month.toString().padStart(2, "0")} -{" "}
                          {item.solarDate.year}
                        </Text>
                      </Space>
                      <Text className="text-[13px] font-[Open_Sans,sans-serif] leading-[1.4] text-black">
                        (Tức {item.lunarDate} )
                      </Text>
                    </Space>
                    <Space direction="vertical">
                      <Text
                        className="text-[15px] font-[Mulish,sans-serif] font-bold leading-[1.6] text-[rgb(150,31,31)]"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        Tại: {item.address}
                      </Text>
                      <Text
                        className="text-[21px] font-[VVZORGluaEhvbiUVEY] leading-[1] text-[rgb(0,0,0)]"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {
                          "Sự hiện diện của quý khách là niềm vinh dự cho\ngia đình chúng tôi!"
                        }
                      </Text>
                    </Space>
                  </Space>
                </div>
                <Space size={14}>
                  <CustomButton
                    text="Xác nhận tham dự"
                    icon={<i className="text-[#fff] fi fi-ss-user-trust"></i>}
                    onClick={() => alert("Clicked!")}
                  />
                  <CustomButton
                    text="Chỉ đường"
                    icon={
                      <i className="text-[#fff] fi fi-ss-land-layer-location"></i>
                    }
                    onClick={() => alert("Clicked!")}
                  />
                </Space>
              </Space>
            </Col>
          );
        })}
      </Row>
    </Section>
  );
};

export default Invitation;
