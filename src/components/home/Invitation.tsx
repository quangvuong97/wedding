import {
  Col,
  Row,
  Space,
  Typography,
  Modal,
  Button,
  Input,
  message,
} from "antd";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { CustomButton } from "../../common";
import Section from "../../common/Section";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Image } from "@imagekit/react";
import { WeddingPageApi } from "../../services/weddingPage.api";

const { Text, Title } = Typography;

interface InvitationInfo {
  image: string;
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

const Invitation: React.FC = () => {
  const homeData = useHomeData();
  const [overlayStyles, setOverlayStyles] = useState<
    CircularOverlayStyle | {}
  >();
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [info, setInfo] = useState<
    [InvitationInfo | undefined, InvitationInfo | undefined]
  >([undefined, undefined]);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const BASE_IMAGE_WIDTH = 464; // Base width for which the fixed values were designed

  useEffect(() => {
    if (!homeData) return;
    const date = new Date(homeData.solarDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const weekdays = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    const dayOfWeek = weekdays[date.getDay()];

    setInfo([
      {
        image: "https://ik.imagekit.io/vuongninh/groomFamily",
        tabName: "Nhà Trai",
        brideName: homeData.brideName,
        groomName: homeData.groomName,
        guestName: homeData.guestOf === "groom" ? homeData.guestName || "" : "",
        solarDate: {
          hour: homeData.weddingHours,
          day,
          month,
          year,
          dayOfWeek,
        },
        lunarDate: homeData.lunarDate,
        address: homeData.groomAddress,
        ggMap: homeData.groomGgAddress,
      },
      {
        image: "https://ik.imagekit.io/vuongninh/brideFamily",
        tabName: "Nhà Gái",
        brideName: homeData.brideName,
        groomName: homeData.groomName,
        guestName: homeData.guestOf === "bride" ? homeData.guestName || "" : "",
        solarDate: {
          hour: homeData.weddingHours,
          day,
          month,
          year,
          dayOfWeek,
        },
        lunarDate: homeData.lunarDate,
        address: homeData.brideAddress,
        ggMap: homeData.brideGgAddress,
      },
    ]);
  }, [homeData]);

  const circularAreaConfig = useMemo(
    () => ({
      centerX: 49.8,
      centerY: 26.25,
      radiusPercent: 21.7,
    }),
    []
  );

  // State cho popup xác nhận
  const [showModal, setShowModal] = useState(false);
  const [isAttendance, setIsAttendance] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  // Sử dụng custom hook mới
  const { confirm, loading: confirmLoading } =
    WeddingPageApi.useConfirmAttendance();

  // Lưu tabName để xác định guestOf khi cần
  const [currentTabName, setCurrentTabName] = useState<string>("");

  const handleConfirmAttendance = (tabName: string) => {
    setShowModal(true);
    setIsAttendance(null);
    setName("");
    setNameError("");
    setCurrentTabName(tabName);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setIsAttendance(null);
    setNameError("");
  };

  const handleAttendanceSelect = (value: string) => {
    setIsAttendance(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value) setNameError("");
  };

  const handleSubmitConfirm = async () => {
    if (!isAttendance) return;
    if (!homeData?.guestSlug && !name.trim()) {
      setNameError("Nhập tên của bạn giúp vợ chồng mình nhé");
      return;
    }
    try {
      const body: any = {
        isAttendance,
      };
      if (homeData?.guestSlug) {
        body.guestSlug = homeData.guestSlug;
      } else {
        body.guestOf = currentTabName === "Nhà Trai" ? "groom" : "bride";
        body.name = name.trim();
      }
      await confirm(body);
      setShowModal(false);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 5000);
    } catch (err) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
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
      <Modal
        open={showModal}
        onCancel={handleModalCancel}
        footer={null}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: "center", padding: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
            Cảm ơn bạn đã xác nhận giùm vợ chồng mình nhé
          </div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type={isAttendance === "attendance" ? "primary" : "default"}
              onClick={() => handleAttendanceSelect("attendance")}
              style={{ marginRight: 8 }}
            >
              Có, tôi sẽ đến
            </Button>
            <Button
              type={isAttendance === "not_attendance" ? "primary" : "default"}
              onClick={() => handleAttendanceSelect("not_attendance")}
            >
              Xin lỗi, tôi bận mất rồi
            </Button>
          </div>
          {!homeData?.guestSlug && (
            <div style={{ marginBottom: 12 }}>
              <Input
                placeholder="Nhập tên của bạn"
                value={name}
                onChange={handleNameChange}
              />
              {nameError && (
                <div style={{ color: "red", marginTop: 4, fontSize: 13 }}>
                  {nameError}
                </div>
              )}
            </div>
          )}
          <Button
            type="primary"
            loading={confirmLoading}
            disabled={!isAttendance || (!homeData?.guestSlug && !name.trim())}
            onClick={handleSubmitConfirm}
            style={{ marginTop: 8, width: 160 }}
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
      <Modal
        open={showThankYou}
        footer={null}
        closable={false}
        centered
        destroyOnClose
        onCancel={() => setShowThankYou(false)}
      >
        <div style={{ textAlign: "center", padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10 }}>
            Cảm ơn đã phản hồi cho hai vợ chồng
          </div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>
            Thank you!
            <br />
            Chúc bạn thật nhiều sức khỏe nhé ❤️️
          </div>
        </div>
      </Modal>
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
                  <Title
                    style={{
                      fontFamily: "VVZOTWpSGuZyUVEY",
                      margin: 0,
                      color: "#1e8267",
                    }}
                  >
                    {item?.tabName}
                  </Title>
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
                    style={{ display: "block" }}
                    onLoad={() => handleImageLoad()}
                  />

                  <Image
                    key={Date.now()}
                    urlEndpoint={homeData?.storageKey.urlEndpoint}
                    queryParameters={{ date: Date.now() }}
                    src={item?.image || ""}
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
                      <Text className="font-[VVRNIFZpYVyblKRidGY] text-[rgb(188,83,77)] text-[33px] leading-[1.63]">
                        {item?.groomName} &amp; {item?.brideName}
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] text-[rgb(0, 0, 0)] text-[15px] leading-[1.6]">
                        TRÂN TRỌNG KÍNH MỜI
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.6] text-black text-[16px]">
                        {item?.guestName || "Quý Khách"}
                      </Text>
                      <Text className="font-[Quicksand,sans-serif] leading-[1.6] text-black text-[14px]">
                        Đến dự buổi tiệc chung vui cùng gia đình chúng tôi
                      </Text>
                      <div className="pt-[5px]">
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px] relative -left-[8px]">
                          {item?.solarDate.hour.toUpperCase()}
                        </Text>
                      </div>
                      <Space size={8} align="center">
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item?.solarDate?.dayOfWeek.toUpperCase()}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)] relative -top-[10px]"></div>
                        <Text className="text-[45px] font-dancing-script font-bold leading-[0.4] text-[rgb(205,99,99)]">
                          {item?.solarDate?.day?.toString().padStart(2, "0")}
                        </Text>
                        <div className="h-[45px] border-l-2 border-[rgb(34,32,32)]"></div>
                        <Text className="font-[Quicksand,sans-serif] font-bold leading-[1.4] text-black text-[14px]">
                          {item?.solarDate?.month?.toString().padStart(2, "0")}{" "}
                          - {item?.solarDate.year}
                        </Text>
                      </Space>
                      <Text className="text-[13px] font-[Open_Sans,sans-serif] leading-[1.4] text-black">
                        (Tức {item?.lunarDate} )
                      </Text>
                    </Space>
                    <Space direction="vertical">
                      <Text
                        className="text-[15px] font-[Mulish,sans-serif] font-bold leading-[1.6] text-[rgb(150,31,31)]"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        Tại: {item?.address}
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
                    onClick={() => handleConfirmAttendance(item?.tabName || "")}
                  />
                  <CustomButton
                    text="Chỉ đường"
                    icon={
                      <i className="text-[#fff] fi fi-ss-land-layer-location"></i>
                    }
                    onClick={() =>
                      item?.ggMap && window.open(item?.ggMap, "_blank")
                    }
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
