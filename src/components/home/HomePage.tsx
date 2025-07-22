import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import Invitation from "./Invitation";
import { FloatButton, Grid, Space } from "antd";
import Present from "./Present";
import WeddingFooter from "./WeddingFooter";
import SVGSymbols from "../common/SVGSymbols";
import { HomeDataContext, useHomeData } from "../../contexts/HomeDataContext";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const { useBreakpoint } = Grid;

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
      <HomeContent loading={loading} spaceSize={spaceSize} />
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
  const [, setReadyStates] = useState({});
  const [isAllReady, setIsAllReady] = useState(false);
  const [openTooltip, setOpenTooltip] = useState({
    audio: false,
    invitation: false,
    present: false,
  });
  const childCount = 1;
  const homeData = useHomeData();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const childMethodsRef = useRef<{
    handleConfirmAttendance: (tabName: string) => void;
  }>(undefined);
  const [openFloatGroup, setOpenFloatGroup] = useState(false);

  // Hàm callback để nhận thông báo từ component con
  const handleChildReady = (childId: string) => {
    setReadyStates((prev) => {
      const newState = { ...prev, [childId]: true };
      const allReady = Object.keys(newState).length === childCount;
      setIsAllReady(allReady);
      return newState;
    });
  };

  // useEffect(() => {
  //   console.log("isAllReady: ", isAllReady);
  // }, [isAllReady]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const scrollToTarget = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConfirmAttendance = () => {
    childMethodsRef.current?.handleConfirmAttendance("");
  };

  const onOpenChangeFloatButton = (
    type: "audio" | "invitation" | "present",
    visible: boolean
  ) => {
    setOpenTooltip((prev) => ({ ...prev, [type]: visible }));
  };

  const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
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

  return (
    <>
      {/* {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="text-2xl font-bold text-blue-600">Loading...</div>
        </div>
      )} */}
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
          onClick={() => handleConfirmAttendance()}
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
      <Space
        direction="vertical"
        size={spaceSize}
        style={{
          display: "flex",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          transitionDuration: "1500ms",
        }}
        // className={`transition-opacity ${
        //   isAllReady ? "opacity-100" : "opacity-0"
        // }`}
      >
        <Header childId="header" onReady={handleChildReady} />
        {dayjs().isBefore(dayjs(homeData?.solarDate)) ? <CountDown /> : ""}
        <Couple />
        <Story />
        <Invitation bind={(methods) => (childMethodsRef.current = methods)} />
        <Present targetRef={targetRef} />
        <Gallery />
        <WeddingFooter brideGroom="Quang Vương & Phương Ninh" />
      </Space>
    </>
  );
};

export default HomePage;
