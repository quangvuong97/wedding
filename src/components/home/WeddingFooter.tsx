import React, { useMemo } from "react";
import { Card, Grid } from "antd";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { useHomeData } from "../../contexts/HomeDataContext";
import TrackedImage from "../common/TrackedImage";

const { useBreakpoint } = Grid;

const WeddingFooter: React.FC = () => {
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
          padding: "0px",
          background: "#f0f0f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
          borderRadius: 0,
          position: "relative",
        },
      }}
    >
      {homeData?.storageKey.urlEndpoint && image ? (
        <TrackedImage
          urlEndpoint={"https://ik.imagekit.io/vuongninh"}
          src={image[0]}
          className="absolute w-full h-full z-1 object-cover"
        />
      ) : null}
      <h1
        style={{
          fontSize: fontSize,
          fontFamily: "VkJIDIIExvdmUudHRm",
          color: "#fff",
          marginBottom: "10px",
          zIndex: 2,
        }}
      >
        Thank You!
      </h1>
      <p
        className={`font-['Dancing_Script',cursive] text-[#fff] z-20`}
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
          zIndex: 2,
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
