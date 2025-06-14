import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import { getSubdomain } from "../../services/api";
import Invitation from "./Invitation";
import { Grid, Space } from "antd";
import Present from "./Present";

const { useBreakpoint } = Grid;

const HomePage: React.FC = () => {
  const [subdomain, setSubdomain] = useState<string>("");

  useEffect(() => {
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);

    // Here you can use the subdomain to fetch specific data for this domain
    console.log("Current subdomain:", currentSubdomain);
    // TODO: Implement API calls using the subdomain data
  }, []);

  const screens = useBreakpoint();

  <div className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]"></div>;

  const spaceSize = useMemo(() => {
    if (screens.lg) return 120;
    if (screens.md) return 90;
    return 80;
  }, [screens]);

  return (
    <Space
      direction="vertical"
      size={spaceSize} // mobile -> tablet -> desktop -> ultra wide
      style={{ display: "flex", textAlign: "center" }}
    >
      <Header />
      <CountDown />
      <Couple />
      <Story />
      <Gallery />
      <Invitation />
      <Present />
    </Space>
  );
};

export default HomePage;
