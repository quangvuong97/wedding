import { useHomeData } from "../../contexts/HomeDataContext";

const Couple: React.FC = () => {
  const homeData = useHomeData();

  const couple = {
    groom: {
      name: homeData?.groomName,
      info: homeData?.groomIntroduction,
      img: "https://wpocean.com/html/tf/loveme/assets/images/couple/2.jpg",
    },
    bride: {
      name: homeData?.brideName,
      info: homeData?.brideIntroduction,
      img: "https://wpocean.com/html/tf/loveme/assets/images/couple/3.jpg",
    },
  };

  const genInfo = (object: "groom" | "bride") => {
    return (
      <div
        className={`
          w-[29%] maxMd:w-full maxXs:w-[34%] 
          pt-[140px] maxXs:pt-[70px] maxSm:pt-[10px] maxMd:pt-0
          pb-[40px] maxMd:p-[0px] maxMd:text-center
          ${
            object === "groom"
              ? `pr-[80px] maxSm:pr-[56px] maxMd:pr-[0px] text-right items-end`
              : "pl-[80px] maxSm:pl-[56px] maxMd:pl-[0px] text-left items-start"
          }
          flex flex-col maxMd:items-center
        `}
      >
        <div
          className="
        relative before:absolute before:left-[5px] before:top-[5px] 
        before:w-[90px] before:h-[90px] before:rounded-full 
        before:border before:border-white before:z-[1] before:content-['']
        mb-[20px]
        "
        >
          <img
            className="rounded-full transition-all duration-300"
            src={couple[object].img}
            alt=""
          />
        </div>
        <h3 className="mb-[0.8em] font-semibold text-[22px] text-[#002642]">
          {couple[object].name}
        </h3>
        <p className="text-[16px] text-[#848892] leading-[1.8em]">
          {couple[object].info}
        </p>
      </div>
    );
  };

  return (
    <div
      className="flex
        w-full max-w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]
        justify-center
        px-[.75rem]
        flex-wrap
        mx-auto"
    >
      {genInfo("groom")}
      <div
        className="relative w-[470px] h-[690px] maxXs:w-[350px] maxXs:h-[510px] maxSm:w-[270px] 
      maxMd:my-[50px] maxSm:h-[380px] justify-center"
      >
        <img
          className="rounded-[235px]"
          src="https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg"
          alt=""
        />
        <div className="absolute left-[-54px] top-[-54px] w-[130%] h-[130%] maxSm:left-[-33px] maxSm:top-[-30px] maxSm:w-[124%]">
          <img src="images/shape.png" alt="" />
        </div>
      </div>
      {genInfo("bride")}
    </div>
  );
};

export default Couple;
