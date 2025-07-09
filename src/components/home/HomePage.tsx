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
import ReactAudioPlayer from "react-audio-player";

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
  const childCount = 1;
  const homeData = useHomeData();

  // Hàm callback để nhận thông báo từ component con
  const handleChildReady = (childId: string) => {
    setReadyStates((prev) => {
      const newState = { ...prev, [childId]: true };
      const allReady = Object.keys(newState).length === childCount;
      setIsAllReady(allReady);
      return newState;
    });
  };

  useEffect(() => {
    console.log("isAllReady: ", isAllReady);
  }, [isAllReady]);

  const audioRef = useRef<ReactAudioPlayer>(null);
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
        audio.audioEl.current.pause();
        setIsPlaying(false);
      } else {
        await waitForLoad(audio.audioEl.current);
        await audio.audioEl.current.play();
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
        await audio.audioEl.current.play();
        setIsPlaying(true);
        console.log("✅ Nhạc đã phát sau tương tác");
      } catch (err) {
        console.error("❌ Không thể phát nhạc:", err);
      }

      // Xóa sự kiện sau khi chạy
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <>
      {/* {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="text-2xl font-bold text-blue-600">Loading...</div>
        </div>
      )} */}
      <SVGSymbols />
      <FloatButton
        onClick={toggleAudio}
        style={{ insetInlineStart: 24 }}
        type="primary"
        tooltip={{
          title: "Bật/tắt nhạc",
          color: "#1e8267",
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
      <ReactAudioPlayer
        src={homeData?.audio}
        ref={(e) => {
          audioRef.current = e;
        }}
        loop
        preload="auto"
        autoPlay
      >
        {/* <source src={homeData?.audio} type="audio/mpeg" /> */}
      </ReactAudioPlayer>
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
        <CountDown />
        <Couple />
        <Story />
        <Invitation />
        <Present />
        <Gallery />
        <WeddingFooter brideGroom="Quang Vương & Phương Ninh" />
      </Space>
    </>
  );
};

export default HomePage;
