import { useCallback, useMemo } from "react";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Button, Typography } from "antd";

const { Text } = Typography;

type InviteProps = {
  handleConfirmAttendance: (tabName: string) => void;
};

const Invite: React.FC<InviteProps> = ({ handleConfirmAttendance }) => {
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

  const handleMapClick = useCallback((ggMap: string) => {
    if (!ggMap) return;
    window.open(ggMap, "_blank");
  }, []);

  return (
    <div
      className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="flex flex-wrap -mx-3 -mt-0">
        <div className="mb-[25px] text-center flex-shrink-0 w-full px-3 mt-0">
          <h2 className="text-[30px] leading-[40px] my-[20px] font-medium text-[#002642]">
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
      <Text className="mb-2 font-['Quicksand',sans-serif] text-[24px] font-semibold underline">
        {homeData?.guestName}
      </Text>
      <Text className="mb-6 font-['Open_Sans',sans-serif] text-[20px] font-normal">
        Tới dự bữa cơm thân mật và chung vui cùng gia đình
      </Text>
      <Text className="text-[20px] font-['Quicksand',sans-serif] font-bold leading-[1.6] text-[rgb(138,20,20)] mb-1">
        TẠI:{" "}TƯ GIA NHÀ {homeData!.guestOf === "groom" ? "TRAI" : "GÁI"}
      </Text>
      <Text className="text-[18px] font-['Open_Sans',sans-serif] font-normal leading-[1.5] text-[rgb(138,20,20)] mb-3">
        {homeData!.guestOf === "groom"
          ? homeData?.groomAddress
          : homeData?.brideAddress}
      </Text>
      <Button
        type="default"
        className="bt-ov-bg-hv shadow-none rounded-none mb-6"
        icon={<i className="fi fi-ss-land-layer-location"></i>}
        onClick={() =>
          handleMapClick(
            (homeData &&
              (homeData.guestOf === "groom"
                ? homeData.groomGgAddress
                : homeData.brideGgAddress)) ||
              ""
          )
        }
      >
        Chỉ đường
      </Button>
      <Text className="mb-1 font-['Open_Sans',sans-serif] text-[20px] leading-[1.6] ">
        HÔN LỄ ĐƯỢC TỔ CHỨC VÀO HỒI
      </Text>
      <Text className="mb-3 font-['Quicksand',sans-serif] text-[30px] font-bold text-[#1e8267]">
        {homeData?.guestOf === "bride"
          ? homeData?.brideWeddingHours.toUpperCase()
          : homeData?.weddingHours.toUpperCase()}
      </Text>
      <div className="flex gap-[10px] w-[320px] mb-3">
        <Text className="text-[24px] font-bold flex-1 border-t-[2px] border-b-[2px] font-['Quicksand',sans-serif] text-[30px] leading-[40px] h-[40px] border-[#1e8267] text-[#1e8267]">
          {dayOfWeek?.toUpperCase()}
        </Text>
        <Text className="text-[56px] font-['Dancing_Script',cursive] font-bold leading-[0.4] text-[#d9534f] leading-[40px] h-[40px]">
          {day}
        </Text>
        <Text className="text-[24px] font-bold flex-1 border-t-[2px] border-b-[2px] font-['Quicksand',sans-serif] text-[30px] leading-[40px] h-[40px] border-[#1e8267] text-[#1e8267]">
          {`${month} - ${year}`}
        </Text>
      </div>
      <Text className="mb-8 text-[16px] text-gray-500 font-['Open_Sans',sans-serif]">
        (Tức {homeData?.guestOf === "bride"
          ? homeData?.brideLunarDate
          : homeData?.lunarDate} )
      </Text>
      <Text className="mb-10 text-[20px] font-['Quicksand',sans-serif] font-normal leading-[1rem] border-b border-black">
        Rất hân hạnh được đón tiếp
      </Text>
      <Button
        className="bt-ov-bg-hv2 shadow-none rounded-none"
        type="primary"
        icon={<i className="fi fi-ss-user-trust"></i>}
        onClick={() => handleConfirmAttendance("confirm")}
      >
        Xác nhận tham dự
      </Button>
    </div>
  );
};

export default Invite;
