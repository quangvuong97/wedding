import React from "react";
import { Card } from "antd";

interface FooterProps {
  brideGroom: string;
}

const WeddingFooter: React.FC<FooterProps> = ({ brideGroom }) => {
  return (
    <Card
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
          backgroundImage:
            "url(https://w.ladicdn.com/s1300x1000/5c728619c417ab07e5194baa/studio-anh-cuoi-chat-luong-tai-thanh-hoa-2-20240602022740-qudib.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
        },
      }}
    >
      <h1
        style={{
          fontSize: "95px",
          fontFamily: "VkJIDIIExvdmUudHRm",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        Thank You!
      </h1>
      <p
        style={{
          fontSize: "24px",
          fontFamily: "cursive",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        - {brideGroom} -
      </p>
      <div>
        <span role="img" aria-label="heart">
          ❤️
        </span>
        <span role="img" aria-label="heart">
          ❤️
        </span>
        <span role="img" aria-label="heart">
          ❤️
        </span>
      </div>
    </Card>
  );
};

export default WeddingFooter;
