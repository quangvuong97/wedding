import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  QRCode,
  Row,
  Space,
  Typography,
} from "antd";
import Section from "../../common/Section";

const { Title, Text } = Typography;

const Present: React.FC = () => {
  const qrData = [{ title: "Chú Rể" }, { title: "Cô Dâu" }];
  const dataQR =
    "00020101021238560010A0000007270126000697041501121133666688880208QRIBFTTA53037045405790005802VN62220818Ung";

  return (
    <Section titleStyle={{ marginBottom: "24px" }} title="Mừng cưới">
      <Text style={{ marginBottom: "30px" }}>
        Mình rất muốn được chụp chung với bạn những tấm hình kỷ niệm vì vậy hãy
        đến sớm hơn một chút bạn yêu nhé! Đám cưới của chúng mình sẽ trọn vẹn
        hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn.
      </Text>
      <Space wrap className="justify-center w-full pt-[20px]" size={[16, 60]}>
        {qrData.map((item) => {
          return (
            <Card className="max-w-[317px] rounded-none border-2 border-[#1e8267]">
              <div className="absolute -top-[20px] -right-[5px] p-[5px] bg-white">
                <img
                  src="https://wpocean.com/html/tf/loveme/assets/images/event-shape-1.png"
                  alt="top-left-decoration"
                />
              </div>
              <div className="absolute -bottom-[20px] -left-[5px] transform rotate-180 p-[2px] bg-white">
                <img
                  src="https://wpocean.com/html/tf/loveme/assets/images/event-shape-1.png"
                  alt="bottom-right-decoration"
                />
              </div>
              <Space
                size={20}
                direction="vertical"
                className="text-center px-[15px] py-[25px] bg-[#1e82671a] flex"
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
                    wrapperStyle={{ height: 40, display: "flex" }}
                    src="https://api.vietqr.io/img/TCB.png"
                    preview={false}
                    width={180}
                    style={{ objectFit: "cover" }}
                  />
                  <QRCode value={dataQR} size={165} bordered={false} />
                  <Row justify="space-between" align="middle" className="flex">
                    <Col className="flex">
                      <Image
                        src="https://camo.githubusercontent.com/b624142eb1373b5f2b06067da2427c6386d90d17519aee75ad69d2b8baefee59/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f7461736b6d616e616765726561676c6f623132332f696d6167652f75706c6f61642f76313634313937303939352f5669657451522e34366137386362625f7574777a7a682e706e67"
                        preview={false}
                        height={28}
                      />
                    </Col>
                    <Col className="flex h-[32.4px]">
                      <Image
                        src="https://kiemtrabank.com/assets/images/Napas247.b58ff17b.png"
                        preview={false}
                        height={38}
                      />
                    </Col>
                  </Row>
                </Card>
                <Space size={0} direction="vertical" className="flex">
                  <Text
                    className="font-muli text-[#848892]"
                    style={{
                      fontSize: 17,
                      lineHeight: "30px",
                      fontWeight: 700,
                    }}
                  >
                    NGUYEN THI PHUONG NINH
                  </Text>
                  <Text
                    className="font-muli text-[#848892]"
                    style={{
                      fontSize: 17,
                      lineHeight: "30px",
                      fontWeight: 700,
                    }}
                  >
                    09878977234323
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
    </Section>
  );
};

export default Present;
