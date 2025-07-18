/* eslint-disable react-hooks/exhaustive-deps */
import "../../index.css";
import { useEffect, useState, useMemo, useRef } from "react";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { Image } from "@imagekit/react";
import { useHomeData } from "../../contexts/HomeDataContext";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

const Header: React.FC<{
  childId: string;
  onReady: (childId: string) => void;
}> = ({ childId, onReady }) => {
  const [index, setIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const screens = useBreakpoint();

  const { response: carouselResponse, loading } =
    WeddingPageApi.useGetCarousel();
  const slides = useMemo(
    () => carouselResponse?.data || [],
    [carouselResponse?.data]
  );
  const homeData = useHomeData();
  const solarDate = homeData?.solarDate && new Date(homeData.solarDate);

  useEffect(() => {
    if (!screens.xs && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides, screens.xs]);

  useEffect(() => {
    if (slides.length <= 0) return;
    if (!loading && imagesLoaded) {
      onReady(childId);
    }
  }, [loading, imagesLoaded]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      Math.abs(touchStartX.current - touchEndX.current) > 50
    ) {
      if (touchStartX.current > touchEndX.current) {
        // swipe left
        setIndex((prev) => (prev + 1) % slides.length);
      } else {
        // swipe right
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Navigation buttons for desktop
  const goPrev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length);

  return (
    <div
      className="relative bg-gray-300 flex items-center justify-center overflow-hidden h-[500px] sm:h-[600px] md:h-[680px] lg:h-[900px]"
      style={{ width: "100%", height: "100vh" }}
      onTouchStart={screens.xs ? handleTouchStart : undefined}
      onTouchMove={screens.xs ? handleTouchMove : undefined}
      onTouchEnd={screens.xs ? handleTouchEnd : undefined}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-[1200ms] ease ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }  ${
            i === index
              ? "translate-x-0 opacity-100"
              : i === (index + slides.length - 1) % slides.length
              ? "-translate-x-1/2 opacity-50"
              : "translate-x-full opacity-0"
          }`}
          style={{ background: "#ddd" }}
        >
          <Image
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
            transformation={[{ format: "auto" }]}
            loading="lazy"
            lqip={{ active: true }}
            urlEndpoint={homeData?.storageKey.urlEndpoint}
            src={slide}
            onLoad={() => {
              i === 0 && setImagesLoaded(true);
            }}
          />
          <div className="w-full px-[var(--bs-gutter-x,.75rem)] mx-auto">
            <div className="max-w-[450px] sm:max-w-[650px] md:max-w-[760px] lg:max-w-[1090px] px-[50px] sm:px-[70px] py-[40px] sm:py-[80px] relative mx-auto text-center bg-[rgba(30,130,103,0.1)]">
              <div
                style={{
                  transform:
                    i === index
                      ? `translate3d(0px, 0px, 0px)`
                      : `translate3d(300px, 0px, 0px)`,
                  transitionDuration: "1200ms",
                }}
              >
                <h2 className="text-[30px] gap-[10px] xxs:text-[1.6rem] xs:text-[28px] sm:text-[2.666rem] md:text-[3.333rem] lg:text-[85px] leading-[36px] sm:leading-[55px] md:leading-[60px] text-white mt-[10px] mb-[10px] lg:mb-[35px] font-['Great_Vibes',cursive] font-normal not-italic flex items-center justify-center">
                  <p>{homeData?.groomName}</p>
                  <svg
                    focusable="false"
                    data-icon="heart"
                    width="1em"
                    height="1em"
                    style={{ minWidth: "22px" }}
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="64 64 896 896"
                  >
                    <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                  </svg>{" "}
                  <p>{homeData?.brideName}</p>
                </h2>
              </div>

              <div
                style={{
                  transform:
                    i === index
                      ? `translate3d(0px, 0px, 0px)`
                      : `translate3d(400px, 0px, 0px)`,
                  transitionDuration: "1200ms",
                }}
              >
                <p
                  className="text-[1.06667rem] sm:text-[1.2rem] md:text-[30px] leading-[22px] sm:leading-[30px] md:leading-[45px] max-w-[780px] text-white mx-auto mb-[0px] font-muli"
                  style={{ fontWeight: 600 }}
                >
                  {solarDate && typeof solarDate !== "string" ? (
                    `${solarDate.getDate().toString().padStart(2, "0")} Tháng ${(solarDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")} Năm ${solarDate.getFullYear()}`
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="absolute left-0 top-0 h-[1px] bg-white w-[15%] xxxs:w-[30%] xxs:w-[36%] xs:w-[44%] sm:w-[67%] lg:w-[76.7%]"></div>
              <div className="absolute right-0 bottom-0 h-[1px] bg-white w-[15%] xxxs:w-[30%] xxs:w-[36%] xs:w-[44%] sm:w-[67%] lg:w-[76.7%]"></div>
              <div className="absolute right-0 bottom-0 w-[1px] bg-white h-[41%] sm:h-[64%] lg:h-[71.7%]"></div>
              <div className="absolute left-0 top-0 w-[1px] bg-white h-[41%] sm:h-[64%] lg:h-[71.7%]"></div>
              <div className="absolute -top-[55px] right-0">
                <img src="images/shape3.png" alt="" />
              </div>
              <div className="absolute -bottom-[54px] left-0">
                <img src="images/shape4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-white"
                  : "opacity-100 bg-[rgba(255,255,255,0.2)]"
              }`}
              style={{ outline: "none" }}
              onClick={() => setIndex(i)}
              aria-label={`Chuyển đến ảnh ${i + 1}`}
            />
          ))}
        </div>
      )}
      {!screens.xs && slides.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[rgba(30,130,103,0.5)] hover:bg-[rgba(30,130,103,0.8)] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
            onClick={goPrev}
            aria-label="Ảnh trước"
          >
            <i className="flaticon-right-arrow rotate-[180deg] text-2xl"></i>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-[rgba(30,130,103,0.5)] hover:bg-[rgba(30,130,103,0.8)] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
            onClick={goNext}
            aria-label="Ảnh tiếp theo"
          >
            <i className="flaticon-right-arrow text-2xl"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
