import React, { useMemo } from "react";
import { Card, Grid } from "antd";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { useHomeData } from "../../contexts/HomeDataContext";

const { useBreakpoint } = Grid;

interface FooterProps {
  brideGroom: string;
}

const WeddingFooter: React.FC<FooterProps> = ({ brideGroom }) => {
  const { response: carouselResponse } = WeddingPageApi.useGetFooter();
  const image = useMemo(() => carouselResponse?.data, [carouselResponse?.data]);
  const homeData = useHomeData();

  const screens = useBreakpoint();
  const fontSize = screens.md ? "160px" : "95px";

  return (
    <Card
      style={{ border: 0 }}
      styles={{
        body: {
          padding: "20px",
          background: "#f0f0f0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw", // Full chiều rộng màn hình
          height: "100vh", // Chiều cao tối thiểu khi màn hình nhỏ
          backgroundImage: `url(${image && image[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          borderRadius: 0,
        },
      }}
    >
      <h1
        style={{
          fontSize: fontSize,
          fontFamily: "VkJIDIIExvdmUudHRm",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        Thank You!
      </h1>
      <p
        className={`font-dancing-script text-[#fff]`}
        style={{
          fontSize: screens.md ? "35px" : "25px",
        }}
      >
        - {`${homeData?.groomName} & ${homeData?.brideName}`} -
      </p>
      <div
        style={{
          width: 80,
          height: 80,
          fill: "rgb(188, 49, 49)",
        }}
      >
        <svg
          xmlSpace="preserve"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          fill="#BC3131"
        >
          <use xlinkHref="#shape_EaFugJijJm"></use>
        </svg>
      </div>
    </Card>
  );
};

export default WeddingFooter;
