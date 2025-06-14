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
  ];
  const storyIcons = ["flaticon-heart", "flaticon-dove", "flaticon-calendar"];
  return (
    <Section title="Our Love Story">
      <div className="flex flex-wrap -mx-3 -mt-0">
        <div className="flex-1 flex-shrink-0 w-full max-w-full px-3 mt-0">
          <div className="relative [&::after]:content-[''] [&::after]:bg-[#1e8267] [&::after]:w-[2px] [&::after]:h-full [&::after]:absolute [&::after]:left-1/2 [&::after]:top-0 [&::after]:-translate-x-1/2">
            <div
              className="bg-white w-[20px] h-[20px] absolute left-1/2 top-0 border border-[#738ea5] -translate-x-1/2 rounded-full z-[1]
                [&::before]:absolute [&::before]:left-[2px] [&::before]:top-[2px] [&::before]:w-[14px] [&::before]:h-[14px] [&::before]:content-[''] [&::before]:bg-[#1e8267] [&::before]:rounded-full"
            ></div>
            {story.map((e, index) => {
              const check = index % 2;
              const image = (
                <div
                  className={
                    `max-w-[330px] p-[10px] border border-dashed border-[#1e8267] rounded-full relative z-[1] bg-white mx-auto` +
                    (check
                      ? " [&::before]:absolute [&::before]:left-auto [&::before]:-right-[102px] [&::before]:rotate-[102deg] [&::before]:top-[195px] [&::before]:w-[90%] [&::before]:h-[90%] [&::before]:border [&::before]:border-dashed [&::before]:border-[#1e8267] [&::before]:content-[''] [&::before]:rounded-full [&::before]:-z-[1] [&::before]:border-b-0 [&::before]:border-r-0 [&::before]:border-t-0 maxSsm:[&::before]:-right-[140px] maxXs:[&::before]:-right-[96px] maxSm:[&::before]:-right-[65px] left-auto [&::before]:-right-[102px] [&::before]:rotate-[102deg]"
                      : " [&::before]:absolute [&::before]:top-[195px] [&::before]:w-[90%] [&::before]:h-[90%] [&::before]:border [&::before]:border-dashed [&::before]:border-[#1e8267] [&::before]:content-[''] [&::before]:rounded-full [&::before]:-z-[1] [&::before]:border-b-0 [&::before]:border-r-0 [&::before]:border-t-0 maxSsm:[&::before]:left-[-140px] maxXs:[&::before]:left-[-96px] [&::before]:left-[-103px] [&::before]:rotate-[66deg] maxSm:[&::before]:left-[-65px]")
                  }
                >
                  <img
                    src={e.image}
                    alt=""
                    className="rounded-full inline-block max-w-full align-middle"
                  />
                  <div className="absolute -bottom-[45px] left-[55px]">
                    <img
                      src="https://wpocean.com/html/tf/loveme/assets/images/story/shape.png"
                      alt=""
                      className="rounded-full inline-block max-w-full align-middle"
                    />
                  </div>
                </div>
              );
              const text = (
                <div
                  className={
                    "pl-[50px] maxSsm:bg-[rgba(134,160,182,0.05)] maxSsm:p-[35px_25px] maxSsm:text-center" +
                    (check
                      ? " md:text-left"
                      : " md:pl-[0px] md:mr-[50px] md:text-right")
                  }
                >
                  <h3 className="text-[22px] font-medium text-[#002642] mb-[0.5em] uppercase font-[Futura_PT] mt-0 leading-[1.2] maxSsm:text-[18px] maxLg:text-[20px]">
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
                <div
                  key={index}
                  className={
                    "relative flex flex-wrap -mx-3 -mt-0 " +
                    (index > 0 ? " mt-[50px] pt-[15px]" : "")
                  }
                >
                  <div
                    className={
                      `flex-1 flex-shrink-0 w-full max-w-full px-3 mt-0 first:pl-[100px] first:pr-[45px] maxSm:first:px-[45px] maxSm:first:pl-[70px] maxSsm:first:px-[15px]
                    md:flex-[0_0_auto] md:w-1/2 ` +
                      (!check && index > 0 ? " relative" : "")
                    }
                  >
                    {!check && index > 0 ? (
                      <span className="bg-[#1e8267] w-[43px] h-[43px] leading-[41px] text-center absolute -right-[22px] -top-[22px] rounded-full z-10">
                        <i
                          className={`text-[#fff] fi ${storyIcons[index - 1]}`}
                        ></i>
                      </span>
                    ) : (
                      ""
                    )}
                    {check ? image : text}
                  </div>
                  <div
                    className={
                      `flex-1 flex-shrink-0 w-full max-w-full px-3 mt-0 last:pl-[45px] last:pr-[100px] maxSm:last:pl-[45px] maxSm:last:pr-[70px] maxSsm:last:px-[15px]
                    md:flex-[0_0_auto] md:w-1/2 ` +
                      (check && index > 0 ? " relative" : "")
                    }
                  >
                    {check && index > 0 ? (
                      <span className="bg-[#1e8267] w-[43px] h-[43px] leading-[41px] text-center absolute -top-[22px] rounded-full z-10 -left-[22px]">
                        <i
                          className={`text-[#fff] fi ${storyIcons[index - 1]}`}
                        ></i>
                      </span>
                    ) : (
                      ""
                    )}
                    {check ? text : image}
                  </div>
                </div>
              );
            })}
            <div className="relative flex flex-wrap -mx-3 -mt-0 mt-[50px] pt-[15px] last:maxSsm:p-0 last:maxSsm:m-0">
              <div className="flex-1 flex-shrink-0 w-full max-w-full px-3 mt-0 last:pl-[45px] last:pr-[100px] maxSm:last:pl-[45px] maxSm:last:pr-[70px] maxSsm:last:px-[15px] pt-0 relative maxSsm:border-0 maxSsm:pt-0 md:ml-[50%] md:flex-[0_0_auto] md:w-1/2">
                <span className="bg-[#1e8267] w-[43px] h-[43px] leading-[41px] text-center absolute -left-[22px] -top-[22px] rounded-full z-10 maxSsm:hidden">
                  <i className="text-[#fff] fi flaticon-wedding-rings"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Story;
