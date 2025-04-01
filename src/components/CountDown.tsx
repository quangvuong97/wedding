import { useEffect, useState } from "react";

const CountDown: React.FC = () => {
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const targetDate = new Date(2025, 11, 28);
    const interval = setInterval(() => {
      const now = new Date();
      //   if (now >= targetDate) {
      //     console.log("Hết thời gian!");
      //     clearInterval(interval);
      //     return;
      // }
      let monthsDiff =
        targetDate.getMonth() -
        now.getMonth() +
        (targetDate.getFullYear() - now.getFullYear()) * 12;
      let daysDiff = targetDate.getDate() - now.getDate();
      let hoursDiff = targetDate.getHours() - now.getHours();
      let minutesDiff = targetDate.getMinutes() - now.getMinutes();
      let secondsDiff = targetDate.getSeconds() - now.getSeconds();

      // Điều chỉnh giây
      if (secondsDiff < 0) {
        secondsDiff += 60;
        minutesDiff--;
      }

      // Điều chỉnh phút
      if (minutesDiff < 0) {
        minutesDiff += 60;
        hoursDiff--;
      }

      // Điều chỉnh giờ
      if (hoursDiff < 0) {
        hoursDiff += 24;
        daysDiff--;
      }

      // Nếu ngày bị âm, mượn tháng trước
      if (daysDiff < 0) {
        const lastMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          0
        ).getDate();
        daysDiff += lastMonth;
        monthsDiff--;
      }

      setMonth(Math.floor(monthsDiff));
      setDay(Math.floor(daysDiff));
      setHour(Math.floor(hoursDiff));
      setMinute(Math.floor(minutesDiff));
      setSecond(Math.floor(secondsDiff));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
    pt-[80px] sm:pt-[90px] md:pt-[120px]
    max-w-[304px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px] w-full
    px-[var(--bs-gutter-x,0.75rem)] mx-auto justify-around flex flex-wrap"
    >
      {[
        { title: "Month", value: month },
        { title: "Day", value: day },
        { title: "Hour", value: hour },
        { title: "Minute", value: minute },
        { title: "Second", value: second },
      ].map((e, i) => (
        <div
          className="bg-clock bg-cover bg-center sm:min-w-[120px]
          maxMd:w-[120px] maxSm:w-[144px] w-[180px]
          maxMd:h-[108.6666666px] maxSm:h-[130.4px] h-[163px] 
          mb-[20px]
          flex flex-col justify-center
          "
        >
          <div
            className="
            font-futura
            maxSm:text-[2.6666666667rem] maxMd:text-[2rem] text-[3.6rem] leading-[1em] pt-[15px] text-primary
            "
          >
            {e.value}
          </div>
          <div className="font-muli">{e.title}</div>
        </div>
      ))}
    </div>
  );
};

export default CountDown;
