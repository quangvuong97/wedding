interface CustomTitleProps {
  text: string;
  style?: React.CSSProperties;
}

const Title: React.FC<CustomTitleProps> = ({ text, style }) => {
  return (
    <div
      style={style}
      className="mb-[60px] text-center maxLg:mb-[20px] flex-shrink-0 w-full max-w-full px-3 mt-0"
    >
      <img
        src="https://wpocean.com/html/tf/loveme/assets/images/section-title2.png"
        alt=""
        className="max-w-full align-middle inline"
      />
      <h2 className="text-[45px] leading-[55px] my-[15px] relative font-[marsha] font-medium text-[#002642] maxLg:text-[32px] maxLg:leading-[40px] maxSsm:text-[30px]">
        {text}
      </h2>
      <div
        className="max-w-[200px] mx-auto relative
            [&::before]:absolute [&::before]:left-[-70px] [&::before]:top-1/2 [&::before]:-translate-y-1/2 [&::before]:content-[''] [&::before]:w-[144px] [&::before]:h-[1px] [&::before]:bg-[#1e8267]
            [&::after]:absolute [&::after]:right-[-70px] [&::after]:top-1/2 [&::after]:-translate-y-1/2 [&::after]:content-[''] [&::after]:w-[144px] [&::after]:h-[1px] [&::after]:bg-[#1e8267]"
      >
        <div className="absolute left-1/2 w-[15px] h-[15px] border border-[#1e8267] rounded-full -translate-x-1/2 -top-[5px]"></div>
      </div>
    </div>
  );
};

export default Title;
