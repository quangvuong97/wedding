import { Image } from "@imagekit/react";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Col, Row, Typography } from "antd";

const { Text } = Typography;

const Couple: React.FC = () => {
  const homeData = useHomeData();

  const couple = {
    groom: {
      name: homeData?.groomName,
      info: homeData?.groomIntroduction,
      img: "/groomImage",
    },
    bride: {
      name: homeData?.brideName,
      info: homeData?.brideIntroduction,
      img: "/brideImage",
    },
  };

  const genInfo = (object: "groom" | "bride") => {
    return (
      <div
        // w-[29%] maxMd:w-full maxXs:w-[34%]
        // pb-[40px] maxMd:p-[0px]
        // pt-[140px] maxXs:pt-[70px] maxSm:pt-[10px] maxMd:pt-0
        className={`
          flex flex-col maxMd:items-center h-full justify-center maxMd:text-center
          ${
            object === "groom"
              ? `pr-[28px] maxMd:pr-[0px] text-right items-end`
              : "pl-[28px] maxMd:pl-[0px] text-left items-start"
          }
        `}
      >
        <div
          className="
          w-[100px] h-[100px]
        relative before:absolute before:left-[5px] before:top-[5px] 
        before:w-[90px] before:h-[90px] before:rounded-full 
        before:border before:border-white before:z-[1] before:content-['']
        mb-[20px]
        "
        >
          <Image
            urlEndpoint="https://ik.imagekit.io/quangvuong1015"
            className="rounded-full w-full"
            src={couple[object].img}
            alt=""
          />
        </div>
        <h3 className="mb-[0.8em] font-semibold text-[22px] text-[#002642]">
          {couple[object].name}
        </h3>
        <Text
          className="text-[16px] text-[#848892] leading-[1.8em]"
          style={{ whiteSpace: "pre-line" }}
        >
          {couple[object].info}
        </Text>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]">
      <Row gutter={[0, 16]}>
        <Col
          xs={{ flex: "100%" }}
          lg={{ flex: "28%" }}
          className="responsive-col"
        >
          {genInfo("groom")}
        </Col>
        <Col
          xs={{ flex: "100%" }}
          lg={{ flex: "44%" }}
          className="responsive-col justify-center flex"
        >
          <div className="col-content relative">
            <Image
              className="absolute left-[10%] top-1/2 -translate-y-1/2 rounded-[235px] w-[80%] h-[85%] max-w-[470px]"
              urlEndpoint="https://ik.imagekit.io/quangvuong1015"
              src="/coupleImage"
              alt=""
            />
            <div className="relative max-w-[577px] maxMd:max-w-[335px]">
              <img src="images/shape.png" alt="" />
            </div>
          </div>
        </Col>
        <Col
          xs={{ flex: "100%" }}
          lg={{ flex: "28%" }}
          className="responsive-col"
        >
          {genInfo("bride")}
        </Col>
      </Row>
    </div>
  );
};

export default Couple;
