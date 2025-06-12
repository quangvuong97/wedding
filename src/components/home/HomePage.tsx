import React, { useEffect, useState } from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import { getSubdomain } from "../../services/api";
import Invitation from "./Invitation";
import { Space } from "antd";

const HomePage: React.FC = () => {
  const [subdomain, setSubdomain] = useState<string>("");

  useEffect(() => {
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);

    // Here you can use the subdomain to fetch specific data for this domain
    console.log("Current subdomain:", currentSubdomain);
    // TODO: Implement API calls using the subdomain data
  }, []);

  return (
    <Space direction="vertical" size={0} style={{ display: "flex" }}>
      <Header />
      <CountDown />
      <Couple />
      <Story />
      <Gallery />
      <Invitation />
    </Space>
  );
};

export default HomePage;
