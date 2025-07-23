import { useMemo } from "react";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Typography } from "antd";

const { Text } = Typography;

const Invite: React.FC = () => {
  const homeData = useHomeData();
  const weekdays = useMemo(
    () => ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
    []
  );
  const date =
    homeData?.solarDate || homeData?.brideSolarDate
      ? new Date(
          homeData.guestOf === "bride"
            ? homeData.brideSolarDate
            : homeData.solarDate
        )
      : null;
  const day = date ? date.getDate() : undefined;
  const month = date ? date.getMonth() + 1 : undefined;
  const year = date ? date.getFullYear() : undefined;
  const dayOfWeek = date ? weekdays[date.getDay()] : undefined;

  return (
    <div
      className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="flex flex-wrap -mx-3 -mt-0">
        <div className="mb-[20px] text-center maxLg:mb-[20px] flex-shrink-0 w-full max-w-full px-3 mt-0">
          <h2 className="text-[30px] leading-[35px] my-[15px] relative font-medium text-[#002642] maxLg:text-[27px] maxLg:leading-[27px] maxSsm:text-[25px]">
            TRÂN TRỌNG KÍNH MỜI
          </h2>
          <div
            className="max-w-[200px] mx-auto relative
            [&::before]:absolute [&::before]:left-[-70px] [&::before]:top-1/2 [&::before]:-translate-y-1/2 [&::before]:content-[''] [&::before]:w-[144px] [&::before]:h-[1px] [&::before]:bg-[#1e8267]
            [&::after]:absolute [&::after]:right-[-70px] [&::after]:top-1/2 [&::after]:-translate-y-1/2 [&::after]:content-[''] [&::after]:w-[144px] [&::after]:h-[1px] [&::after]:bg-[#1e8267]"
          >
            <div className="absolute left-1/2 w-[15px] h-[15px] border border-[#1e8267] rounded-full -translate-x-1/2 -top-[5px]"></div>
          </div>
        </div>
      </div>
      <Text className="mb-0 font-[Quicksand,sans-serif] text-[22px] font-medium underline">
        {homeData?.guestName}
      </Text>
      <Text className="mb-5 font-[Quicksand,sans-serif] text-[20px] font-medium">
        Tới dự bữa cơm thân mật và chung vui cùng gia đình
      </Text>
      <Text className="text-[20px] font-[Niramit,sans-serif] font-bold leading-[1.6] text-[rgb(150,31,31)]">
        TẠI:{" TƯ GIA NHÀ "}
        {homeData!.guestOf === "groom" ? "TRAI" : "GÁI"}
      </Text>
      <Text className="text-[20px] font-[Itim,cursive] font-normal leading-[1.6] text-[rgb(150,31,31)] mb-5">
        {homeData!.guestOf === "groom"
          ? homeData?.groomAddress
          : homeData?.brideAddress}
      </Text>
      <Text className="mb-0 font-['Open_Sans',sans-serif] text-[20px] leading-[1.6] ">
        HÔN LỄ ĐƯỢC TỔ CHỨC VÀO HỒI
      </Text>
      <Text className="mb-0 font-[Quicksand,sans-serif] text-[28px] font-bold text-[#1e8267]">
        {homeData?.guestOf === "bride"
          ? homeData?.brideWeddingHours.toUpperCase()
          : homeData?.weddingHours.toUpperCase()}
      </Text>
      <div className="flex gap-[8px] w-[300px] mb-2">
        <Text className="text-[22px] font-bold flex-1 border-t-[1.5px] border-b-[1.5px] font-[Quicksand,sans-serif] text-[28px] leading-[35px] h-[35px] border-[#1e8267] text-[#1e8267]">
          {dayOfWeek?.toUpperCase()}
        </Text>
        <Text className="text-[50px] font-['Dancing_Script',cursive] font-bold leading-[0.4] text-[rgb(232,59,48)] leading-[35px] h-[35px] ">
          {day}
        </Text>
        <Text className="text-[22px] font-bold flex-1 border-t-[1.5px] border-b-[1.5px] font-[Quicksand,sans-serif] text-[28px] leading-[35px] h-[35px] border-[#1e8267] text-[#1e8267]">
          {`${month} - ${year}`}
        </Text>
      </div>
      <Text className="mb-5 font-['Open_Sans',sans-serif] text-[16px]">
        (Tức{" "}
        {homeData?.guestOf === "bride"
          ? homeData?.brideLunarDate
          : homeData?.lunarDate}{" "}
        )
      </Text>
      <Text className="text-[20px] font-[Quicksand,sans-serif] font-normal leading-[1rem] border-b border-black">
        {"Rất hân hạnh được đón tiếp"}
      </Text>
    </div>
  );
};

export default Invite;
