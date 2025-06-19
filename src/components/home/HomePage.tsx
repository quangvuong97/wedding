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

const { useBreakpoint } = Grid;

const HomePage: React.FC = () => {
  const screens = useBreakpoint();

  const spaceSize = useMemo(() => {
    if (screens.lg) return 120;
    if (screens.md) return 90;
    return 80;
  }, [screens]);

  return (
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
  );
};

export default HomePage;
