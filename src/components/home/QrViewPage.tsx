import { QRCode } from "antd";
import React, { createRef, useEffect, useState } from "react";

const QrViewPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const imgData = urlParams.get("img");
  const [qrUrl, setQrUrl] = useState<string | undefined>(undefined);
  const qrRef = createRef<HTMLDivElement | null>();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("qr-view-html");

    return () => {
      html.classList.remove("qr-view-html");
    };
  }, []);

  useEffect(() => {
    if (!imgData) return;

    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        setQrUrl(canvas.toDataURL("image/png"));
      } else {
        const svgElement = qrRef.current.querySelector("svg");
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          const svgUrl = URL.createObjectURL(svgBlob);

          const img = document.createElement("img", {}) as HTMLImageElement;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = svgElement!.clientWidth;
            canvas.height = svgElement!.clientHeight;
            const ctx = canvas.getContext("2d");
            ctx!.fillStyle = "#ffffff";
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(img, 0, 0);
            setQrUrl(canvas.toDataURL("image/png"));
            URL.revokeObjectURL(svgUrl);
          };
          img.src = svgUrl;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgData]);

  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!imgData) {
    return (
      <div style={{ padding: 20, fontSize: 18, textAlign: "center" }}>
        Ảnh QR không tìm thấy
      </div>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", maxWidth: "90%", fontSize: 25 }}>
        Nhấn giữ vào ảnh để sao chép hoặc tải về nhé!
      </h1>
      <div ref={qrRef} style={{ display: "none" }}>
        <QRCode
          bgColor="#FFF"
          style={{ border: 0 }}
          value={imgData || ""}
          size={size}
          bordered={false}
        />
      </div>
      {qrUrl ? (
        <img
          src={qrUrl}
          alt="QR Code"
          style={{
            maxWidth: "80%",
            maxHeight: "80%",
            objectFit: "contain",
          }}
        />
      ) : (
        <p>Đang tạo QR...</p>
      )}
    </>
  );
};

export default QrViewPage;
