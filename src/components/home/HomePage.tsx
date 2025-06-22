import React, { useMemo } from "react";
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
  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  return (
    <>
      <SVGSymbols />
      <Space
        direction="vertical"
        size={spaceSize}
        style={{
          display: "flex",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Header />
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
