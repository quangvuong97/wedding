import "../index.css";
import { useEffect, useState } from "react";
const slides = [
  {
    image:
      "https://wpocean.com/html/tf/loveme/assets/images/slider/slide-6.jpg",
    title: "Wedding & Event Planner",
    subtitle: "Your Special Day, Our Special Touch",
  },
  {
    image:
      "https://wpocean.com/html/tf/loveme/assets/images/slider/slide-4.jpg",
    title: "Make Your Wedding Unforgettable",
    subtitle: "Crafting Moments That Last Forever",
  },
  {
    image:
      "https://wpocean.com/html/tf/loveme/assets/images/slider/slide-5.jpg",
    title: "Make Your Wedding Unforgettable",
    subtitle: "Crafting Moments That Last Forever",
  },
];

const Header: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gray-300 flex items-center justify-center overflow-hidden h-[500px] sm:h-[600px] md:h-[680px] lg:h-[900px]">
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
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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
                <h2
                  className="text-[1.441562473rem] xxs:text-[1.6rem] xs:text-[1.91rem] sm:text-[2.666rem] md:text-[3.333rem] lg:text-[89px] leading-[36px] sm:leading-[55px] md:leading-[60px] text-white mt-[10px] mb-[10px] lg:mb-[35px] font-dancing-script flex items-center justify-center"
                  style={{ fontWeight: 450 }}
                >
                  {/* font-semibold */}
                  <p>Quang Vương</p>
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
                  <p>Phương Ninh</p>
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
                  02 Tháng 11 Năm 2025
                </p>
              </div>
              <div className="absolute left-0 top-0 h-[1px] bg-white w-[15%] xxxs:w-[30%] xxs:w-[36%] xs:w-[44%] sm:w-[67%] lg:w-[76.7%]"></div>
              <div className="absolute right-0 bottom-0 h-[1px] bg-white w-[15%] xxxs:w-[30%] xxs:w-[36%] xs:w-[44%] sm:w-[67%] lg:w-[76.7%]"></div>
              <div className="absolute right-0 bottom-0 w-[1px] bg-white h-[41%] sm:h-[64%] lg:h-[71.7%]"></div>
              <div className="absolute left-0 top-0 w-[1px] bg-white h-[41%] sm:h-[64%] lg:h-[71.7%]"></div>
              <div className="absolute -top-[55px] right-0">
                <img src="https://i.ibb.co/0Vv7LF6j/shape3.png" alt="" />
              </div>
              <div className="absolute -bottom-[54px] left-0">
                <img src="https://i.ibb.co/w9YJzQ7/shape4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Header;
