import { Button, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

const Gallery: React.FC = () => {
  const images = [
    "https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/story/4.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/7.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/8.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/9.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/10.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/11.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/12.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-2.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-3.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/couple/1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/story/4.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/7.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/8.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/9.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/10.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/11.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/portfolio/12.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-1.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-2.jpg",
    "https://wpocean.com/html/tf/loveme/assets/images/blog/img-3.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Khi currentIndex thay đổi, cuộn ảnh tương ứng vào giữa
  useEffect(() => {
    if (!visible) return;
    const f = first;
    setFirst(false);
    const timeout = setTimeout(
      () => {
        const imgEl = imageRefs.current[current];
        if (imgEl) {
          imgEl.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      },
      f ? 1000 : 0
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, visible]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-[120px] maxMd:py-[90px] maxLg:py-[80px]">
      <div className="w-full px-3 mx-auto">
        <div className="flex flex-wrap -mx-3 -mt-0">
          <div className="mb-[60px] text-center maxLg:mb-[40px] flex-shrink-0 w-full max-w-full px-3 mt-0">
            <img
              src="https://wpocean.com/html/tf/loveme/assets/images/section-title2.png"
              alt=""
              className="max-w-full align-middle inline"
            />
            <h2 className="text-[40px] leading-[55px] my-[15px] relative uppercase font-[Futura_PT] font-medium text-[#002642] maxLg:text-[32px] maxLg:leading-[40px] maxSsm:text-[22px]">
              Sweet Moments
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
        <div className="columns-[16rem]">
          <Image.PreviewGroup
            preview={{
              wrapStyle: { height: "calc(100% - 166px)" },
              toolbarRender: (_, { transform: { scale } }) => (
                <div className="relative w-full">
                  <Button
                    icon={<LeftOutlined />}
                    onClick={() => scroll("left")}
                    className="!absolute left-0 top-1/2 -translate-y-1/2 z-10"
                  />
                  <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 px-12 py-4 scroll-smooth"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {images.map((src, index) => (
                      <div
                        ref={(el) => {
                          imageRefs.current[index] = el;
                        }}
                        key={index}
                        className={`flex-shrink-0 cursor-pointer rounded-lg transition-transform duration-200 ${
                          current === index
                            ? "ring-4 ring-blue-500 scale-105 shadow-lg"
                            : "hover:scale-105"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`image-${index}`}
                          height={150}
                          preview={false}
                          style={{ display: "inline" }}
                          className="rounded-lg"
                          onClick={() => setCurrent(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    icon={<RightOutlined />}
                    onClick={() => scroll("right")}
                    className="!absolute right-0 top-1/2 -translate-y-1/2 z-10"
                  />
                </div>
              ),
              visible,
              current,
              onVisibleChange: (v) => setVisible(v),
              onChange: (index) => setCurrent(index),
            }}
          >
            {images.map((item, index) => (
              <Image
                key={index}
                src={item}
                onClick={() => {
                  setFirst(true);
                  setCurrent(index);
                }}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
