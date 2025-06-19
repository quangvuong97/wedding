import { Button, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../common/Section";
import { WeddingPageApi } from "../../services/weddingPage.api";

const Gallery: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { response: carouselResponse } = WeddingPageApi.useGetGallery();
  const images = useMemo(() => carouselResponse?.data || [], [carouselResponse?.data]); 

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
    <Section title="Sweet Moments">
      <div style={{ columnCount: 3 }}>
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
    </Section>
  );
};

export default Gallery;
