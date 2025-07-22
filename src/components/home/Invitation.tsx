import { Col, Row, Space, Typography, Modal, Button, Input } from "antd";
import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { CustomButton } from "../../common";
import Section from "../../common/Section";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Image } from "@imagekit/react";
import { WeddingPageApi } from "../../services/weddingPage.api";
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
  bind: (methods: {
    handleConfirmAttendance: (tabName: string) => void;
  }) => void;
};

type ButtonFamilyProps = {
  isFamilyType: "groom" | "bride" | null;
  onClick: (isFamilyType: "groom" | "bride") => void;
};

// Memoize ButtonFamily component
const ButtonFamily: React.FC<ButtonFamilyProps> = memo(
  ({ isFamilyType, onClick }) => {
    const homeData = useHomeData();

    // Memoize style objects
    const containerStyle = useMemo(
      () => ({
        marginBottom: 12,
        display: "flex",
        justifyContent: "center",
        gap: 12,
      }),
      []
    );

    const imageStyle = useMemo(
      () => ({
        width: 126,
        aspectRatio: 1,
      }),
      []
    );

    const familyTypes = useMemo(() => ["groom", "bride"], []);

    const handleClick = useCallback(
      (familyType: string) => {
        if (!homeData?.guestOf) {
          onClick(familyType as "groom" | "bride");
        }
      },
      [homeData?.guestOf, onClick]
    );

    return (
      <div style={containerStyle}>
        {familyTypes.map((familyType) => (
          <Button
            key={familyType}
            type={
              homeData?.guestOf === familyType ||
              isFamilyType?.toString() === familyType
                ? "primary"
                : "default"
            }
            onClick={() => handleClick(familyType)}
            className="bt-ov-bg-hv flex flex-col gap-0 px-[13px] pt-1 h-auto shadow-none"
          >
            <img
              src={
                familyType === "groom"
                  ? "/images/groom.png"
                  : "/images/bride.png"
              }
              alt="icon"
              style={imageStyle}
            />
            {familyType === "groom" ? "Khách nhà trai" : "Khách nhà gái"}
          </Button>
        ))}
      </div>
    );
  }
);

const Invitation: React.FC<InvitationProps> = ({ bind }) => {
  const homeData = useHomeData();
  const [overlayStyles, setOverlayStyles] = useState<CircularOverlayStyle | {}>(
    {}
  );
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const thankYouImgRef = useRef<HTMLImageElement | null>(null);
  const [thankYouScale, setThankYouScale] = useState<number>(1);

  const [showModal, setShowModal] = useState(false);
  const [isAttendance, setIsAttendance] = useState<
    "attendance" | "not_attendance" | null
  >(null);
  const [isFamily, setIsFamily] = useState<"groom" | "bride" | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const { confirm, loading: confirmLoading } =
    WeddingPageApi.useConfirmAttendance();

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

  // Memoize invitation info calculation
  const info: InvitationInfo[] | undefined[] = useMemo(() => {
    if (!homeData) return [undefined, undefined];

    const date = new Date(homeData.solarDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayOfWeek = weekdays[date.getDay()];

    const baseInfo = {
      brideName: homeData.brideName,
      groomName: homeData.groomName,
      solarDate: { hour: homeData.weddingHours, day, month, year, dayOfWeek },
      lunarDate: homeData.lunarDate,
      queryImage: Date.now(),
    };

    return [
      {
        ...baseInfo,
        image: "/groomFamily",
        keyImage: "groom" + Date.now(),
        tabName: "Nhà Trai",
        guestName: homeData.guestOf === "groom" ? homeData.guestName || "" : "",
        address: homeData.groomAddress,
        ggMap: homeData.groomGgAddress,
      },
      {
        ...baseInfo,
        image: "/brideFamily",
        keyImage: "bride" + Date.now(),
        tabName: "Nhà Gái",
        guestName: homeData.guestOf === "bride" ? homeData.guestName || "" : "",
        address: homeData.brideAddress,
        ggMap: homeData.brideGgAddress,
      },
    ];
  }, [homeData, weekdays]);

  // Memoize style objects
  const modalContentStyle = useMemo(
    () => ({
      textAlign: "center" as const,
    }),
    []
  );

  const modalHeaderStyle = useMemo(
    () => ({
      fontWeight: 600,
      fontSize: 18,
      marginBottom: 12,
    }),
    []
  );

  const inputContainerStyle = useMemo(
    () => ({
      marginBottom: 12,
    }),
    []
  );

  const errorStyle = useMemo(
    () => ({
      color: "red",
      marginBottom: 12,
      fontSize: 13,
    }),
    []
  );

  const confirmButtonStyle = useMemo(
    () => ({
      width: 160,
    }),
    []
  );

  const thankYouModalStyles = useMemo(
    () => ({
      content: { padding: 0, margin: "0 12px" },
      body: { position: "relative" as const },
    }),
    []
  );

  const thankYouContentStyle = useMemo(
    () => ({
      scale: thankYouScale,
    }),
    [thankYouScale]
  );

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

  // Memoize callbacks
  const handleConfirmAttendance = useCallback(
    (tabName: string) => {
      setShowModal(true);
      setIsAttendance(null);
      if (homeData?.guestOf) {
        setIsFamily(homeData.guestOf);
      } else {
        setIsFamily(tabName === "Nhà Trai" ? "groom" : "bride");
      }
      setName("");
      setNameError("");
    },
    [homeData?.guestOf]
  );

  const handleModalCancel = useCallback(() => {
    setShowModal(false);
    setIsFamily(null);
    setNameError("");
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      if (e.target.value) setNameError("");
    },
    []
  );

  const handleSubmitConfirm = useCallback(async () => {
    if (!isFamily) {
      setNameError("Bạn là khách bên nhà trai 👦🏻 hay nhà gái 👧🏻 vậy?");
      return;
    }
    if (!homeData?.guestSlug && !name.trim()) {
      setNameError("Bạn ơi cho tụi mình xin tên dễ thương với nha 📝🧸");
      return;
    }
    if (!isAttendance) {
      setNameError(
        "Nhớ bấm chọn có đến được không nhaaaa, tụi mình mong chờ lắm đó 🥹💌"
      );
      return;
    }

    const body: any = { isAttendance };
    if (homeData?.guestSlug) {
      body.guestSlug = homeData.guestSlug;
    } else {
      body.guestOf = isFamily;
      body.name = name.trim();
    }

    await confirm(body);
    setShowModal(false);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  }, [isFamily, homeData, name, isAttendance, confirm]);

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

  const handleThankYouImageLoad = useCallback(() => {
    const width = thankYouImgRef.current?.getBoundingClientRect().width || 520;
    setThankYouScale(width / 520);
  }, []);

  const handleMapClick = useCallback((ggMap: string) => {
    window.open(ggMap, "_blank");
  }, []);

  // Bind the method for parent component
  bind({ handleConfirmAttendance });

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateOverlayPosition);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateOverlayPosition]);

  useEffect(() => {
    if (!showThankYou) return;

    const handleResize = () => {
      const width =
        thankYouImgRef.current?.getBoundingClientRect().width || 520;
      setThankYouScale(width / 520);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showThankYou]);

  return (
    <Section title="Thiệp Mời">
      <Modal
        open={showModal}
        onCancel={handleModalCancel}
        footer={null}
        centered
        destroyOnHidden
        width={372}
      >
        <div style={modalContentStyle}>
          <div style={modalHeaderStyle}>
            Cảm ơn bạn đã xác nhận giùm vợ chồng mình nhé
          </div>
          <ButtonFamily isFamilyType={isFamily} onClick={setIsFamily} />
          {!homeData?.guestSlug && (
            <div style={inputContainerStyle}>
              <Input
                placeholder="Nhập tên của bạn"
                value={name}
                className="text-[16px]"
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className="flex flex-wrap gap-3 mb-[12px]">
            <Button
              type={isAttendance === "attendance" ? "primary" : "default"}
              onClick={() => setIsAttendance("attendance")}
              className="bt-ov-bg-hv shadow-none flex-1 text-[12px]"
            >
              Có, tôi sẽ đến
            </Button>
            <Button
              type={isAttendance === "not_attendance" ? "primary" : "default"}
              onClick={() => setIsAttendance("not_attendance")}
              className="bt-ov-bg-hv shadow-none flex-1 text-[12px]"
            >
              Xin lỗi, tôi bận mất rồi
            </Button>
          </div>
          {nameError && <div style={errorStyle}>{nameError}</div>}
          <CustomButton
            loading={confirmLoading}
            onClick={handleSubmitConfirm}
            style={confirmButtonStyle}
          >
            Xác nhận
          </CustomButton>
        </div>
      </Modal>

      <Modal
        open={showThankYou}
        footer={null}
        closable={false}
        centered
        width={544}
        destroyOnHidden
        onCancel={() => setShowThankYou(false)}
        styles={thankYouModalStyles}
      >
        <img
          src="images/thankYou.jpg"
          alt=""
          ref={thankYouImgRef}
          onLoad={handleThankYouImageLoad}
        />
        <div
          className="flex flex-col text-center items-center absolute top-[39%] left-1/2 -translate-x-1/2 w-[520px] gap-[12px] origin-top-left"
          style={thankYouContentStyle}
        >
          <Text className="font-['Cormorant_Garamond',serif] font-normal italic text-[17px] text-[#3A5653] w-[72%]">
            Cảm ơn bạn đã phản hồi lời mời cưới của tụi mình! Tụi mình rất mong
            được gặp bạn trong ngày đặc biệt ấy.
          </Text>
          <div className="flex w-[38%] gap-[8px] ">
            <Text className="flex-1 border-t border-b font-['Cormorant_Infant',serif] text-[17px] leading-[24px] h-[24px] font-normal text-[#3A5653] border-[#3A5653]">
              {"THÁNG " + info[0]?.solarDate.month}
            </Text>
            <Text className="font-['Cormorant_Infant',serif] text-[32px] leading-[24px] h-[24px] font-normal text-[#3A5653]">
              {info[0]?.solarDate.day}
            </Text>
            <Text className="flex-1 border-t border-b font-['Cormorant_Infant',serif] text-[17px] leading-[24px] h-[24px] font-normal text-[#3A5653] border-[#3A5653]">
              {info[0]?.solarDate.year}
            </Text>
          </div>
          <Text className="font-['Cormorant_Garamond',serif] font-medium italic text-[15px] text-[#3A5653] w-[49%]">
            Chúc bạn luôn được bao quanh bởi những điều dịu dàng, an lành và ấm
            áp.
          </Text>
        </div>
      </Modal>

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
                  <img
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
                    <Image
                      key={item.keyImage}
                      urlEndpoint={homeData?.storageKey.urlEndpoint}
                      queryParameters={{ date: item.queryImage }}
                      src={item.image}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={overlayStyles}
                      loading="lazy"
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
