import { Col, Row, Space, Typography } from "antd";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { CustomButton } from "../../common";
import Section from "../../common/Section";
import { useHomeData } from "../../contexts/HomeDataContext";
import TrackedImage from "../common/TrackedImage";
import { Gutter } from "antd/es/grid/row";

const { Text, Title } = Typography;

interface InvitationInfo {
  image: string;
  keyImage: string;
  queryImage: number;
  tabName: string;
  brideName: string;
  groomName: string;
  guestName: string | null;
  solarDate: {
    hour: string;
    day: number;
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

type InvitationProps = {
  handleConfirmAttendance: (tabName: string) => void;
};

const Invitation: React.FC<InvitationProps> = ({ handleConfirmAttendance }) => {
  const homeData = useHomeData();
  const [overlayStyles, setOverlayStyles] = useState<CircularOverlayStyle | {}>(
    {}
  );
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Memoize constants
  const BASE_IMAGE_WIDTH = useMemo(() => 464, []);
  const weekdays = useMemo(
    () => ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
    []
  );

  const circularAreaConfig = useMemo(
    () => ({
      centerX: 49.8,
      centerY: 26.25,
      radiusPercent: 21.7,
    }),
    []
  );
  const dateVersion = useMemo(() => Date.now(), []);

  // Memoize invitation info calculation
  const info: InvitationInfo[] | undefined[] = useMemo(() => {
    if (!homeData) return [undefined, undefined];

    const date = new Date(homeData.solarDate);
    const brideDate = new Date(homeData.brideSolarDate);

    const baseInfo = {
      brideName: homeData.brideName,
      groomName: homeData.groomName,
      lunarDate: homeData.lunarDate,
      queryImage: Date.now(),
    };

    return [
      {
        ...baseInfo,
        image: `/groomFamily?v=${dateVersion}`,
        keyImage: "groom" + Date.now(),
        tabName: "Nhà Trai",
        guestName: homeData.guestOf === "groom" ? homeData.guestName || "" : "",
        address: homeData.groomAddress,
        ggMap: homeData.groomGgAddress,
        solarDate: {
          hour: homeData.weddingHours,
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          dayOfWeek: weekdays[date.getDay()],
        },
      },
      {
        ...baseInfo,
        image: `/brideFamily?v=${dateVersion}`,
        keyImage: "bride" + Date.now(),
        tabName: "Nhà Gái",
        guestName: homeData.guestOf === "bride" ? homeData.guestName || "" : "",
        address: homeData.brideAddress,
        ggMap: homeData.brideGgAddress,
        solarDate: {
          hour: homeData.brideWeddingHours,
          day: brideDate.getDate(),
          month: brideDate.getMonth() + 1,
          year: brideDate.getFullYear(),
          dayOfWeek: weekdays[brideDate.getDay()],
        },
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeData, weekdays]);

  const titleStyle = useMemo(
    () => ({
      fontFamily: "VVZOTWpSGuZyUVEY",
      margin: 0,
      color: "#1e8267",
    }),
    []
  );

  const imageDisplayStyle = useMemo(
    () => ({
      display: "block",
    }),
    []
  );

  const gutterConfig: Gutter | [Gutter, Gutter] = useMemo(
    () => [
      { xs: 0, sm: 16, md: 16 },
      { xs: 40, sm: 16, md: 16 },
    ],
    []
  );

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
  }, [scaleFactor, BASE_IMAGE_WIDTH]);

  const calculateOverlayStyle = useCallback((): CircularOverlayStyle | {} => {
    if (!imageRef.current) return {};

    const rect = imageRef.current.getBoundingClientRect();
    const { width: imageWidth, height: imageHeight } = rect;

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

    if (imageRef.current) {
      const currentWidth = imageRef.current.getBoundingClientRect().width;
      const newScaleFactor = currentWidth / BASE_IMAGE_WIDTH;
      setScaleFactor(newScaleFactor);
    }
  }, [calculateOverlayStyle, BASE_IMAGE_WIDTH]);

  const handleImageLoad = useCallback(() => {
    requestAnimationFrame(updateOverlayPosition);
  }, [updateOverlayPosition]);

  const handleMapClick = useCallback((ggMap: string) => {
    window.open(ggMap, "_blank");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateOverlayPosition);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateOverlayPosition]);

  return (
    <Section title="Thiệp Mời">
      <Row
        justify="center"
        gutter={gutterConfig}
        className="px-3 mx-auto w-full"
      >
        {info.map((item, index) => {
          if (!item) return null;
          return (
            <Col xs={24} md={12} key={`invitation-${index}`}>
              <Space
                direction="vertical"
                size="middle"
                className="w-full"
                align="center"
              >
                <Space>
                  <Title style={titleStyle}>{item.tabName}</Title>
                </Space>
                <div className="w-full relative">
                  <TrackedImage
                    ref={(el) => {
                      if (index === 0 && el) {
                        imageRef.current = el;
                      }
                    }}
                    src="images/thiep.png"
                    alt={`Invitation ${index + 1}`}
                    className="w-full h-auto object-contain"
                    style={imageDisplayStyle}
                    onLoad={handleImageLoad}
                  />
                  {homeData?.storageKey.urlEndpoint && item.image ? (
                    <TrackedImage
                      imageId={`invitation-${item.keyImage}`}
                      key={item.keyImage}
                      urlEndpoint={homeData?.storageKey.urlEndpoint}
                      queryParameters={{ date: item.queryImage }}
                      src={item.image}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={overlayStyles}
                    />
                  ) : null}
                  <Space
                    direction="vertical"
                    className="absolute"
                    style={{
                      display: "flex",
                      ...getScaledStyles().container,
                    }}
                  >
                    <Space direction="vertical" size={0}>
                      <Text className="font-[VVRNIFZpYVyblKRidGY] text-[rgb(188,83,77)] text-[33px] leading-[1.63]">
                        {item.tabName === "Nhà Trai"
                          ? item.groomName
                          : item.brideName}{" "}
                        &amp;{" "}
                        {item.tabName === "Nhà Trai"
                          ? item.brideName
                          : item.groomName}
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
                          {item.solarDate?.hour?.toUpperCase()}
                        </Text>
                      </div>
                      <Space size={8} align="center">
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item.solarDate?.dayOfWeek?.toUpperCase()}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)] relative -top-[10px]"></div>
                        <Text className="text-[45px] font-['Dancing_Script',cursive] font-bold leading-[0.4] text-[rgb(205,99,99)]">
                          {item.solarDate?.day?.toString().padStart(2, "0")}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)]"></div>
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item.solarDate?.month?.toString().padStart(2, "0")} -{" "}
                          {item.solarDate.year}
                        </Text>
                      </Space>
                      <Text className="text-[13px] font-['Open_Sans',sans-serif] leading-[1.4] text-black">
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
                    onClick={() => handleConfirmAttendance(item.tabName)}
                  />
                  <CustomButton
                    text="Chỉ đường"
                    icon={
                      <i className="text-[#fff] fi fi-ss-land-layer-location"></i>
                    }
                    onClick={() => item.ggMap && handleMapClick(item.ggMap)}
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
