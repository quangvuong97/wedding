import { Col, Row } from "antd";
import Section from "../../common/Section";

const Story: React.FC = () => {
  const story = [
    {
      title: "First time we meet",
      description:
        "I must explain to you how all this mistaken idea of denouing pleasure and praising pain was born and I will give you com acount of system,the actual teach",
      image: "https://wpocean.com/html/tf/loveme/assets/images/story/1.jpg",
    },
    {
      title: "First date",
      description:
        "I must explain to you how all this mistaken idea of denouing pleasure and praising pain was born and I will give you com acount of system,the actual teach",
      image: "https://wpocean.com/html/tf/loveme/assets/images/story/2.jpg",
    },
    {
      title: "First time we meet",
      description:
        "I must explain to you how all this mistaken idea of denouing pleasure and praising pain was born and I will give you com acount of system,the actual teach",
      image: "https://wpocean.com/html/tf/loveme/assets/images/story/1.jpg",
    },
    undefined,
  ];
  const storyIcons = [
    "flaticon-heart",
    "flaticon-dove",
    "flaticon-calendar",
    "flaticon-wedding-rings",
  ];
  return (
    <Section title="Our Love Story">
      <div className="relative sm:[&::after]:content-[''] [&::after]:bg-[#1e8267] [&::after]:w-[2px] [&::after]:h-full [&::after]:absolute [&::after]:left-1/2 [&::after]:top-0 [&::after]:-translate-x-1/2">
        <div
          className="bg-white w-[20px] h-[20px] absolute left-1/2 top-0 border border-[#738ea5] -translate-x-1/2 rounded-full z-[1]
                [&::before]:absolute [&::before]:left-[2px] [&::before]:top-[2px] [&::before]:w-[14px] [&::before]:h-[14px] [&::before]:content-[''] [&::before]:bg-[#1e8267] [&::before]:rounded-full"
        ></div>
        {story.map((e, index) => {
          const check = index % 2;

          const image = e && (
            <div
              className={
                `max-w-[330px] p-[10px] border border-dashed border-[#1e8267] rounded-full relative z-[1] bg-white mx-auto sm:mx-[50px] md:mx-auto maxLg:[&::before]:hidden` +
                (check
                  ? " [&::before]:absolute [&::before]:left-auto [&::before]:-right-[102px] [&::before]:rotate-[102deg] [&::before]:top-[195px] [&::before]:w-[90%] [&::before]:h-[90%] [&::before]:border [&::before]:border-dashed [&::before]:border-[#1e8267] [&::before]:content-[''] [&::before]:rounded-full [&::before]:-z-[1] [&::before]:border-b-0 [&::before]:border-r-0 [&::before]:border-t-0 left-auto maxSsm:[&::before]:-right-[140px] maxXs:[&::before]:-right-[88px] maxSm:[&::before]:-right-[71px] [&::before]:-right-[96px] maxXxl:[&::before]:-right-[133px] [&::before]:rotate-[110deg] maxMd:[&::before]:-right-[52px]"
                  : " [&::before]:absolute [&::before]:top-[195px] [&::before]:w-[90%] [&::before]:h-[90%] [&::before]:border [&::before]:border-dashed [&::before]:border-[#1e8267] [&::before]:content-[''] [&::before]:rounded-full [&::before]:-z-[1] [&::before]:border-b-0 [&::before]:border-r-0 [&::before]:border-t-0 maxSsm:[&::before]:left-[-140px] maxXs:[&::before]:left-[-88px] [&::before]:left-[-96px] [&::before]:rotate-[66deg] maxSm:[&::before]:left-[-71px] maxXxl:[&::before]:-left-[133px] maxMd:[&::before]:-left-[52px]")
              }
            >
              <img
                src={e.image}
                alt=""
                className="rounded-full inline-block max-w-full align-middle"
              />
              <div className="absolute -bottom-[14%] left-1/2 -translate-x-1/2">
                <img
                  src="https://wpocean.com/html/tf/loveme/assets/images/story/shape.png"
                  alt=""
                  className="rounded-full inline-block max-w-full align-middle"
                />
              </div>
            </div>
          );
          const text = e && (
            <div
              className={
                "text-center mr-0 maxLg:pb-0 maxLg:p-[15px_25px]" +
                (check
                  ? " sm:text-left sm:ml-[70px]"
                  : " sm:text-right sm:mr-[70px]")
              }
            >
              <h3 className="text-[22px] font-medium text-[#002642] mb-[0.5em] uppercase font-futura mt-0 leading-[1.2] maxSsm:text-[18px] maxLg:text-[20px]">
                {e.title}
              </h3>
              <span className="text-[14px] font-medium block mb-[15px] text-[#1e8267]">
                Nov 12,2021
              </span>
              <p className="text-[16px] text-[#848892] leading-[1.8em] mt-0 mb-0">
                {e.description}
              </p>
            </div>
          );
          return (
            <Row
              gutter={[0, 30]}
              className={`${!check ? "sm:flex-row-reverse" : ""} ${
                index > 0 ? "pt-[15px] mt-[50px]" : ""
              } ${index === story.length - 1 ? "maxLg:hidden" : ""}`}
            >
              <Col
                xs={24}
                md={12}
                className={`${
                  check
                    ? "lg:pr-[45px] lg:pl-[100px]"
                    : "lg:pl-[45px] lg:pr-[100px]"
                }`}
              >
                {image}
              </Col>
              <Col
                xs={24}
                md={12}
                className={
                  `${
                    check
                      ? "lg:pl-[45px] lg:pr-[100px]"
                      : "lg:pr-[45px] lg:pl-[100px]"
                  }` +
                  (index > 0 && index < story.length - 1 ? " sm:pt-[45px]" : "")
                }
              >
                {index > 0 ? (
                  <span
                    className={`bg-[#1e8267] w-[43px] h-[43px] leading-[41px] text-center absolute  -top-[22px] rounded-full z-10 ${"maxLg:hidden"} ${
                      check ? "-left-[22px]" : "-right-[22px]"
                    }`}
                  >
                    <i
                      className={`text-[#fff] fi ${
                        storyIcons[
                          index === story.length - 1
                            ? storyIcons.length - 1
                            : index
                        ]
                      }`}
                    ></i>
                  </span>
                ) : null}
                {text}
              </Col>
            </Row>
          );
        })}
      </div>
    </Section>
  );
};

export default Story;
