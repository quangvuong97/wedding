const Couple: React.FC = () => {
  return (
    <div
      className="flex maxLg:py-[80px] maxMd:py-[90px] py-[120px]
        w-full max-w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]
        justify-center
        px-[.75rem]
        flex-wrap
        mx-auto"
    >
      <div
        className="
      w-[29%] maxMd:w-full maxXs:w-[34%] 
      pt-[140px] maxXs:pt-[70px] maxSm:pt-[10px] maxMd:pt-0
      pb-[40px] maxMd:p-[0px]
      pr-[80px] maxSm:pr-[56px] maxMd:pr-[0px]
      maxMd:text-center text-right
      flex flex-col items-end maxMd:items-center
      "
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
            className="rounded-full scale-100 transition-all duration-300"
            src="https://wpocean.com/html/tf/loveme/assets/images/couple/2.jpg"
            alt=""
          />
        </div>
        <h3 className="mb-[0.8em] font-dancing-script font-bold text-[28px] text-[#002642]">Quang Vương</h3>
        <p className="text-[16px] text-[#848892] leading-[1.8em]">
          Quis ipsum suspendisse ultrices gravida. Risus commodo viverra
          maecenas accumsan lacus vel facilisis give you com of system.{" "}
        </p>
      </div>
      <div className="relative w-[470px] h-[690px] maxXs:w-[350px] maxXs:h-[510px] maxSm:w-[270px] 
      maxMd:my-[50px] maxSm:h-[380px] justify-center">
        <img
          className="rounded-[235px]"
          src="https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg"
          alt=""
        />
        <div className="absolute left-[-54px] top-[-54px] w-[130%] h-[130%] maxSm:left-[-33px] maxSm:top-[-30px] maxSm:w-[124%]">
          <img src="https://i.ibb.co/YB3FRkNf/shape.png" alt="" />
        </div>
      </div>
      <div
        className="w-[29%] maxMd:w-full maxXs:w-[34%] 
      pt-[140px] maxXs:pt-[70px] maxSm:pt-[10px] maxMd:pt-0
      pb-[40px] maxMd:p-[0px]
      pl-[80px] maxSm:pl-[56px] maxMd:pl-[0px]
      maxMd:text-center text-left
      flex flex-col items-start maxMd:items-center
      "
      >
        <div
          className="relative before:absolute before:left-[5px] before:top-[5px] 
            before:w-[90px] before:h-[90px] before:rounded-full 
            before:border before:border-white before:z-[1] before:content-['']
            mb-[20px]
            "
        >
          <img
            className="rounded-full scale-100 transition-all duration-300"
            src="https://wpocean.com/html/tf/loveme/assets/images/couple/3.jpg"
            alt=""
          />
        </div>
        <h3 className="mb-[0.8em] font-dancing-script font-bold text-[28px] text-[#002642]">Phương Ninh</h3>
        <p className="text-[16px] text-[#848892] leading-[1.8em]">
          Quis ipsum suspendisse ultrices gravida. Risus commodo viverra
          maecenas accumsan lacus vel facilisis give you com of system.{" "}
        </p>
      </div>
    </div>
  );
};

export default Couple;
