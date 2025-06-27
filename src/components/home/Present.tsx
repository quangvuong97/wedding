import { Button, Card, Divider, Image, QRCode, Space, Typography } from "antd";
import Section from "../../common/Section";
import { useEffect, useRef, useState } from "react";
import { useHomeData } from "../../contexts/HomeDataContext";

const { Title, Text } = Typography;

const Present: React.FC = () => {
  const homeData = useHomeData();
  const qrData = [
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
  ];

  const DESIGN_WIDTH = 576;
  const [scale, setScale] = useState(1);
  const [spaceHeight, setSpaceHeight] = useState(0);

  const divRef = useRef<HTMLDivElement | null>(null);
  const spaceRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <Section titleStyle={{ marginBottom: "30px" }} title="Mừng cưới">
      <Text>
        Mình rất muốn được chụp chung với bạn những tấm hình kỷ niệm vì vậy hãy
        đến sớm hơn một chút bạn yêu nhé! Đám cưới của chúng mình sẽ trọn vẹn
        hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn.
      </Text>
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
          {qrData.map((item) => {
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
                  <img src="images/shape1.png" alt="bottom-right-decoration" />
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
                  <Title className="!text-[25px] !font-futura !text-[#1e8267] !mb-[0]">
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
                        // width: 100%;
                        /* height: 300px; */
                        overflow: "hidden",
                      }}
                      src={item.bankLog}
                      preview={false}
                      width={138}
                      style={{ objectFit: "cover" }}
                    />
                    <QRCode
                      value={item.dataQR || ""}
                      size={140}
                      bordered={false}
                    />
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
                        fontSize: 15,
                        lineHeight: "30px",
                        fontWeight: 700,
                      }}
                    >
                      {item.accountNo?.toUpperCase()}
                    </Text>
                  </Space>
                  <Space>
                    <Button
                      className="!bg-[#1e8267] !text-white !border-none !rounded-none shadow-none font-muli font-semibold"
                      icon={<i className="fi fi-br-download"></i>}
                    >
                      Tải QR
                    </Button>
                    <Button
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
  );
};

export default Present;
