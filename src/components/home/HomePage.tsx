import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import Invitation from "./Invitation";
import {
  Button,
  FloatButton,
  Grid,
  Input,
  Modal,
  Space,
  Typography,
} from "antd";
import Present from "./Present";
import WeddingFooter from "./WeddingFooter";
import SVGSymbols from "../common/SVGSymbols";
import LoadingOverlay from "../common/LoadingOverlay";
import { HomeDataContext, useHomeData } from "../../contexts/HomeDataContext";
import {
  ImageLoaderProvider,
  useImageLoaderContext,
} from "../../contexts/ImageLoaderContext";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Invite from "./Invite";
import { CustomButton } from "../../common";

const { useBreakpoint } = Grid;
const { Text } = Typography;

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

const HomePage: React.FC = () => {
  const screens = useBreakpoint();
  const [searchParams] = useSearchParams();

  const { response, loading } = WeddingPageApi.useGetConfig(
    searchParams.get("guest")
  );

  const spaceSize = useMemo(() => {
    if (screens.lg) return 120;
    if (screens.md) return 90;
    return 80;
  }, [screens]);

  return (
    <HomeDataContext.Provider value={response?.data}>
      <ImageLoaderProvider>
        <HomeContent loading={loading} spaceSize={spaceSize} />
      </ImageLoaderProvider>
    </HomeDataContext.Provider>
  );
};

const HomeContent = ({
  loading,
  spaceSize,
}: {
  loading: boolean;
  spaceSize: number;
}) => {
  const [openTooltip, setOpenTooltip] = useState({
    audio: false,
    invitation: false,
    present: false,
  });
  const homeData = useHomeData();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [openFloatGroup, setOpenFloatGroup] = useState(false);

  // Image loading context
  const { isAllLoaded, loadingProgress, loadedImages, totalImages } =
    useImageLoaderContext();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [name, setName] = useState("");
  const [isFamily, setIsFamily] = useState<"groom" | "bride" | null>(null);
  const [isAttendance, setIsAttendance] = useState<
    "attendance" | "not_attendance" | null
  >(null);
  const [nameError, setNameError] = useState("");
  const [thankYouScale, setThankYouScale] = useState<number>(1);

  const info = useMemo(() => {
    if (!homeData) return {};

    const date = new Date(homeData.solarDate);
    const brideDate = new Date(homeData.brideSolarDate);

    return {
      groom: {
        hour: homeData.weddingHours,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      },
      bride: {
        hour: homeData.brideWeddingHours,
        day: brideDate.getDate(),
        month: brideDate.getMonth() + 1,
        year: brideDate.getFullYear(),
      },
    };
  }, [homeData]);

  const { confirm, loading: confirmLoading } =
    WeddingPageApi.useConfirmAttendance();
  const thankYouImgRef = useRef<HTMLImageElement | null>(null);

  const waitForLoad = (audio: HTMLAudioElement) =>
    new Promise<void>((resolve) => {
      if (audio.readyState >= 2) return resolve();
      audio.onloadeddata = () => resolve();
      audio.load();
    });

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await waitForLoad(audio);
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Lỗi khi phát nhạc:", err);
      }
    }
  };

  useEffect(() => {
    const handleInteraction = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        await waitForLoad(audio);
        await audio.play();
        setIsPlaying(true);
        // console.log("✅ Nhạc đã phát sau tương tác");
      } catch (err) {
        console.error("❌ Không thể phát nhạc:", err);
      }

      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    let wasPlaying = false;
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        wasPlaying = !audio.paused;
        if (wasPlaying) {
          audio.pause();
        }
      } else {
        if (wasPlaying) {
          audio.play().catch((e) => {
            console.warn("Không thể phát audio:", e);
          });
        }
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const scrollToTarget = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onOpenChangeFloatButton = (
    type: "audio" | "invitation" | "present",
    visible: boolean
  ) => {
    setOpenTooltip((prev) => ({ ...prev, [type]: visible }));
  };

  const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  useEffect(() => {
    if (loading || !isAllLoaded) return;

    setOpenFloatGroup(true);
    setTimeout(
      () =>
        setOpenTooltip({
          audio: true,
          invitation: true,
          present: true,
        }),
      400
    );
    setTimeout(() => setOpenFloatGroup(false), 2200);
  }, [isAllLoaded, loading]);

  useEffect(() => {
    Object.entries(openTooltip).forEach(([key, value]) => {
      if (value) {
        if (timeoutRef.current[key]) {
          clearTimeout(timeoutRef.current[key]);
        }

        timeoutRef.current[key] = setTimeout(() => {
          setOpenTooltip((prev) => ({ ...prev, [key]: false }));
          delete timeoutRef.current[key];
        }, 1500);
      }
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRef.current).forEach(clearTimeout);
    };
  }, [openTooltip]);

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

  const handleThankYouImageLoad = useCallback(() => {
    const width = thankYouImgRef.current?.getBoundingClientRect().width || 520;
    setThankYouScale(width / 520);
  }, []);

  const thankYouContentStyle = useMemo(
    () => ({
      scale: thankYouScale,
    }),
    [thankYouScale]
  );

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

  const handleConfirmAttendance = useCallback(
    (tabName: string | null) => {
      setShowModal(true);
      setIsAttendance(null);
      if (homeData?.guestOf) {
        setIsFamily(homeData.guestOf);
      } else if (!tabName) {
        setIsFamily(null);
      } else setIsFamily(tabName === "Nhà Trai" ? "groom" : "bride");

      setName("");
      setNameError("");
    },
    [homeData?.guestOf]
  );

  return (
    <>
      {/* Loading overlay for images */}
      <LoadingOverlay
        isVisible={loading || !isAllLoaded}
        progress={loadingProgress}
        loadedCount={loadedImages.size}
        totalCount={totalImages}
      />

      <SVGSymbols />
      <FloatButton
        style={{ insetInlineStart: 16, insetBlockEnd: 24 }}
        onClick={toggleAudio}
        type="primary"
        tooltip={{
          title: "Bật/tắt nhạc",
          color: "#1e8267",
          onOpenChange: (visible) => onOpenChangeFloatButton("audio", visible),
          open: openTooltip.audio,
          placement: "left",
        }}
        icon={
          isPlaying ? (
            <i className="fi fi-tr-volume-down"></i>
          ) : (
            <i className="fi fi-tr-volume-mute"></i>
          )
        }
      />
      <FloatButton.Group
        open={openFloatGroup}
        trigger="click"
        style={{ right: 16, bottom: 24 }}
        icon={<i className="fi fi-rr-menu-burger"></i>}
        type="primary"
        onOpenChange={(isOpen) => {
          setOpenFloatGroup(isOpen);
          if (isOpen)
            setTimeout(
              () =>
                setOpenTooltip((pre) => ({
                  ...pre,
                  invitation: true,
                  present: true,
                })),
              350
            );
        }}
      >
        <FloatButton
          onClick={() => handleConfirmAttendance("")}
          tooltip={{
            title: "Xác nhận tham dự",
            placement: "left",
            color: "#1e8267",
            onOpenChange: (visible) =>
              onOpenChangeFloatButton("invitation", visible),
            open: openTooltip.invitation,
          }}
          type="primary"
          icon={<i className="fi fi-tr-document-writer"></i>}
        />
        <FloatButton
          onClick={scrollToTarget}
          tooltip={{
            title: "Mừng cưới",
            placement: "left",
            color: "#1e8267",
            onOpenChange: (visible) =>
              onOpenChangeFloatButton("present", visible),
            open: openTooltip.present,
          }}
          type="primary"
          icon={<i className="fi fi-tr-freemium"></i>}
        />
      </FloatButton.Group>
      <audio ref={audioRef} src={homeData?.audio} loop preload="auto" />
      <Modal
        open={showModal}
        onCancel={handleModalCancel}
        footer={null}
        centered
        destroyOnHidden
        width={372}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Cảm ơn bạn đã xác nhận giùm vợ chồng mình nhé
          </div>
          <ButtonFamily isFamilyType={isFamily} onClick={setIsFamily} />
          {!homeData?.guestSlug && (
            <div style={{ marginBottom: 12 }}>
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
          {nameError && (
            <div
              style={{
                color: "red",
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              {nameError}
            </div>
          )}
          <CustomButton
            loading={confirmLoading}
            onClick={handleSubmitConfirm}
            style={{ width: 160 }}
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
        styles={{
          content: { padding: 0, margin: "0 12px" },
          body: { position: "relative" as const },
        }}
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
              {"THÁNG " + (isFamily && info[isFamily]?.month)}
            </Text>
            <Text className="font-['Cormorant_Infant',serif] text-[32px] leading-[24px] h-[24px] font-normal text-[#3A5653]">
              {isFamily && info[isFamily]?.day}
            </Text>
            <Text className="flex-1 border-t border-b font-['Cormorant_Infant',serif] text-[17px] leading-[24px] h-[24px] font-normal text-[#3A5653] border-[#3A5653]">
              {isFamily && info[isFamily]?.year}
            </Text>
          </div>
          <Text className="font-['Cormorant_Garamond',serif] font-medium italic text-[15px] text-[#3A5653] w-[49%]">
            Chúc bạn luôn được bao quanh bởi những điều dịu dàng, an lành và ấm
            áp.
          </Text>
        </div>
      </Modal>
      <Space
        direction="vertical"
        size={0}
        style={{
          display: "flex",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          transitionDuration: "1500ms",
          opacity: loading || !isAllLoaded ? 0 : 1,
          transform:
            loading || !isAllLoaded ? "translateY(20px)" : "translateY(0)",
          transition:
            "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        styles={{ item: { marginBottom: spaceSize } }}
        className="home-space"
      >
        <Header />
        {homeData?.guestSlug ? (
          <Invite handleConfirmAttendance={handleConfirmAttendance} />
        ) : dayjs().isBefore(dayjs(homeData?.solarDate)) ? (
          <CountDown />
        ) : (
          ""
        )}
        <Couple />
        <Story />
        <Invitation handleConfirmAttendance={handleConfirmAttendance} />
        <Present targetRef={targetRef} />
        <Gallery />
        <WeddingFooter brideGroom="Quang Vương & Phương Ninh" />
      </Space>
    </>
  );
};

export default HomePage;
