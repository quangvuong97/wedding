import { useEffect, useState } from "react";
import { useHomeData } from "../../contexts/HomeDataContext";

const CountDown: React.FC = () => {
  const homeData = useHomeData();
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    if (!homeData?.solarDate) return;
    const targetDate = new Date(homeData.solarDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setDay(0);
        setHour(0);
        setMinute(0);
        setSecond(0);
        clearInterval(interval);
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setDay(days);
      setHour(hours);
      setMinute(minutes);
      setSecond(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [homeData?.solarDate]);

  return (
    <div
      className="
    max-w-[304px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px] w-full
    px-[var(--bs-gutter-x,0.75rem)] mx-auto justify-around flex flex-wrap"
    >
      {[
        { title: "Day", value: day },
        { title: "Hour", value: hour },
        { title: "Minute", value: minute },
        { title: "Second", value: second },
      ].map((e, i) => (
        <div
          key={i}
          className="bg-clock bg-cover bg-center sm:min-w-[120px]
          maxMd:w-[120px] maxSm:w-[144px] w-[180px]
          maxMd:h-[108.6666666px] maxSm:h-[130.4px] h-[163px] 
          mb-[20px]
          flex flex-col justify-center
          relative
          "
        >
          <img src="images/clock-bg.png" alt="clock" className="absolute top-0"/>
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
