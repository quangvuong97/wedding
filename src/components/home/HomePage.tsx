import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import Invitation from "./Invitation";
import { Grid, Space } from "antd";
import Present from "./Present";
import WeddingFooter from "./WeddingFooter";
import SVGSymbols from "../common/SVGSymbols";
import { HomeDataContext } from "../../contexts/HomeDataContext";
import { WeddingPageApi } from "../../services/weddingPage.api";

const { useBreakpoint } = Grid;

const HomePage: React.FC = () => {
  const screens = useBreakpoint();
  const { response, loading } = WeddingPageApi.useGetConfig();

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

  return (
    <>
      {/* {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="text-2xl font-bold text-blue-600">Loading...</div>
        </div>
      )} */}
      <SVGSymbols />
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
