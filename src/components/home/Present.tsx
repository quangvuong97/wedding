import {
  Button,
  Card,
  Divider,
  Image,
  message,
  QRCode,
  Space,
  Typography,
} from "antd";
import Section from "../../common/Section";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useHomeData } from "../../contexts/HomeDataContext";

const { Title, Text } = Typography;
const Present: React.FC<{
  targetRef: React.RefObject<HTMLDivElement | null>;
}> = ({ targetRef }) => {
  const homeData = useHomeData();
  const count = 2;
  const qrRef = useMemo(
    () => Array.from({ length: count }, () => createRef<HTMLDivElement>()),
    [count]
  );

  const qrData = useMemo(
    () => [
      {
        title: "Chú Rể",
        dataQR: homeData?.dataGroomQR,
        accountNo: homeData?.groomAccountNumber,
        accountName: homeData?.groomAccountName,
        bankLog: homeData?.logoBankGroom,
      },
      {
        title: "Cô Dâu",
        dataQR: homeData?.dataBrideQR,
        accountNo: homeData?.brideAccountNumber,
        accountName: homeData?.brideAccountName,
        bankLog: homeData?.logoBankBride,
      },
    ],
    [
      homeData?.dataGroomQR,
      homeData?.groomAccountNumber,
      homeData?.groomAccountName,
      homeData?.logoBankGroom,
      homeData?.dataBrideQR,
      homeData?.brideAccountNumber,
      homeData?.brideAccountName,
      homeData?.logoBankBride,
    ]
  );

  const DESIGN_WIDTH = 576;
  const [scale, setScale] = useState(1);
  const [spaceHeight, setSpaceHeight] = useState(0);

  const divRef = useRef<HTMLDivElement | null>(null);
  const spaceRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!divRef.current || !spaceRef.current) return;

      const rect = divRef.current.getBoundingClientRect();
      const ratio = rect.width / DESIGN_WIDTH;
      const newScale = ratio < 1 ? ratio : 1;
      setScale(newScale);

      const height = spaceRef.current.getBoundingClientRect().height + 12;
      setSpaceHeight(height);
    };

    const observer = new ResizeObserver(() => {
      if (!spaceRef.current || !divRef.current) return;
      const height = spaceRef.current.getBoundingClientRect().height + 12;
      setSpaceHeight(height);
    });

    if (spaceRef.current) {
      observer.observe(spaceRef.current);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [scale]);

  const [qrUrl, setQrUrl] = useState<(string | undefined)[]>([
    undefined,
    undefined,
  ]);
  useEffect(() => {
    for (let index = 0; index < qrRef.length; index++) {
      const qrR = qrRef[index];
      if (qrR.current) {
        const canvas = qrR.current.querySelector("canvas");
        if (canvas) {
          setQrUrl((value) => {
            value[index] = canvas.toDataURL("image/png");
            return value;
          });
        } else {
          const svgElement = qrR.current.querySelector("svg");
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
              ctx!.fillStyle = "#ffffff"; // Màu trắng
              ctx!.fillRect(0, 0, canvas.width, canvas.height);
              ctx!.drawImage(img, 0, 0);
              setQrUrl((value) => {
                value[index] = canvas.toDataURL("image/png");
                return value;
              });
              URL.revokeObjectURL(svgUrl);
            };
            img.src = svgUrl;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeData?.dataGroomQR, homeData?.dataBrideQR]);

  const isIOS = useMemo(
    () =>
      /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    []
  );

  const downloadQR = async (index: number) => {
    const url = qrUrl[index];
    if (!url) return;
    if (isIOS) {
      const qrPageUrl = `${window.location.origin}/qr-view?img=${qrData[index].dataQR}`;
      window.location.href = qrPageUrl;
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = "vuong-ninh-wedding-code.png";
      link.click();
    }
  };

  function isMessengerOnAndroid(): boolean {
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isMessenger = /(FBAN|FBAV|Messenger)/i.test(ua);

    return isAndroid && isMessenger;
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Đã copy!");
    } catch (err) {
      // Fallback cho browser không hỗ trợ Clipboard API
      if (textAreaRef.current) {
        const textArea = textAreaRef.current;
        textArea.value = text;
        textArea.focus({ preventScroll: true });
        textArea.select();

        try {
          document.execCommand("copy");
          message.success("Đã copy!");
        } catch (err) {
          message.error("Copy thất bại!");
        }
        textArea.value = "";
      }
    }
  };

  return (
    <div ref={targetRef}>
      <Section titleStyle={{ marginBottom: "30px" }} title="Mừng Cưới">
        <Text className="font-muli text-[#848892]">
          Mình rất muốn được chụp chung với bạn những tấm hình kỷ niệm vì vậy
          hãy đến sớm hơn một chút bạn yêu nhé! Đám cưới của chúng mình sẽ trọn
          vẹn hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn.
        </Text>
        <textarea
          ref={textAreaRef}
          readOnly
          className="absolute w-px h-px opacity-0 -left-[9999px] -top-[9999px]"
          aria-hidden="true"
        />
        <div
          className="justify-center w-full pt-[24px] relative"
          ref={divRef}
          style={{ height: spaceHeight }}
        >
          <Space
            ref={spaceRef}
            size={16}
            style={{
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          >
            {qrData.map((item, index) => {
              if (!item) return null;
              return (
                <Card
                  key={item.title}
                  className="w-[280px] rounded-none border-2 border-[#1e8267]"
                  styles={{ body: { padding: 16 } }}
                >
                  <div className="absolute -top-[20px] -right-[5px] p-[5px] bg-white">
                    <img src="images/shape1.png" alt="top-left-decoration" />
                  </div>
                  <div className="absolute -bottom-[20px] -left-[5px] transform rotate-180 p-[2px] bg-white">
                    <img
                      src="images/shape1.png"
                      alt="bottom-right-decoration"
                    />
                  </div>
                  <Space
                    size={6}
                    direction="vertical"
                    className="text-center px-[15px] py-[12px] bg-[#1e82671a] flex"
                    styles={{
                      item: {
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      },
                    }}
                  >
                    <Title className="!text-[25px] !font-[Mulish,sans-serif] !font-bold !text-[#1e8267] !mb-[0]">
                      {item.title.toUpperCase()}
                    </Title>
                    <Divider className="border-[#1e826766] m-0" />
                    <Card
                      style={{ width: 200 }}
                      styles={{
                        body: {
                          padding: "0",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        },
                      }}
                    >
                      <Image
                        wrapperStyle={{
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                        }}
                        src={item.bankLog}
                        preview={false}
                        width={140}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "auto",
                        }}
                      />
                      <div ref={qrRef[index]} style={{ display: "none" }}>
                        {item.dataQR ? (
                          <QRCode
                            bgColor="#FFF"
                            style={{ border: 0 }}
                            value={item.dataQR || ""}
                            size={140}
                            bordered={false}
                          />
                        ) : null}
                      </div>
                      {qrUrl && qrUrl[index] ? (
                        <Image
                          preview={false}
                          src={qrUrl[index]}
                          alt="QR Code"
                          width={140}
                          height={140}
                        />
                      ) : (
                        <p>Đang tạo QR...</p>
                      )}
                      <div className="flex justify-center">
                        <div className="w-[40%]">
                          <img alt="" src="images/vietQR.png" />
                        </div>
                        <div className="w-[50%]">
                          <img alt="" src="images/napas247.png" />
                        </div>
                      </div>
                    </Card>
                    <Space size={0} direction="vertical" className="flex">
                      <Text
                        className="font-muli text-[#848892]"
                        style={{
                          fontSize: 15,
                          lineHeight: "30px",
                          fontWeight: 700,
                        }}
                      >
                        {item.accountName?.toUpperCase()}
                      </Text>
                      <Text
                        className="font-muli text-[#848892]"
                        style={{
                          fontSize: 14,
                          lineHeight: "30px",
                          fontWeight: 700,
                        }}
                      >
                        {item.accountNo?.toUpperCase()}
                      </Text>
                    </Space>
                    <Space>
                      {!isMessengerOnAndroid() ? (
                        <Button
                          className="!bg-[#1e8267] !text-white !border-none !rounded-none shadow-none font-muli font-semibold"
                          onClick={() => downloadQR(index)}
                          icon={<i className="fi fi-br-download"></i>}
                        >
                          Tải QR
                        </Button>
                      ) : null}
                      <Button
                        onClick={() => handleCopy(item.accountNo || "")}
                        icon={<i className="fi fi-rr-duplicate"></i>}
                        className="!bg-[#1e8267] !text-white !border-none !rounded-none shadow-none font-muli font-semibold"
                      >
                        Copy STK
                      </Button>
                    </Space>
                  </Space>
                </Card>
              );
            })}
          </Space>
        </div>
      </Section>
    </div>
  );
};

export default Present;
