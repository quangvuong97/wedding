import { /* Button, */ Image } from "antd";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../common/Section";
import { WeddingPageApi } from "../../services/weddingPage.api";
// import { Image as ImageKit } from "@imagekit/react";
import MarkImagePreview from "../common/MarkImagePreview";
import { useHomeData } from "../../contexts/HomeDataContext";

const Gallery: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(false);
  const [columnCount, setColumnCount] = useState(3);

  const homeData = useHomeData();

  // const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { response: carouselResponse } = WeddingPageApi.useGetGallery();
  const images = useMemo(() => {
    return carouselResponse?.data || [];
  }, [carouselResponse?.data]);

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

  // const scroll = (direction: "left" | "right") => {
  //   if (scrollRef.current) {
  //     const scrollAmount = direction === "left" ? -300 : 300;
  //     scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //   }
  // };

  useEffect(() => {
    const updateColumnCount = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setColumnCount(5);
      } else if (w >= 768) {
        setColumnCount(4);
      } else {
        setColumnCount(3);
      }
    };
    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return (
    <Section title="Khoảnh Khắc Ngọt Ngào">
      <div style={{ columnCount, columnGap: 4 }} ref={divRef}>
        <Image.PreviewGroup
          preview={{
            // styles: { wrapper: { height: "calc(100% - 166px)" } },
            // toolbarRender: (_, { transform: { scale } }) => (
            //   <div className="relative w-full">
            //     <Button
            //       icon={<LeftOutlined />}
            //       onClick={() => scroll("left")}
            //       className="!absolute left-0 top-1/2 -translate-y-1/2 z-10"
            //     />
            //     <div
            //       ref={scrollRef}
            //       className="flex overflow-x-auto gap-4 px-12 py-4 scroll-smooth"
            //       style={{
            //         scrollbarWidth: "none",
            //         msOverflowStyle: "none",
            //       }}
            //     >
            //       {images.map((src, index) => (
            //         <div
            //           ref={(el) => {
            //             imageRefs.current[index] = el;
            //           }}
            //           key={src}
            //           className={`flex-shrink-0 cursor-pointer rounded-lg transition-transform duration-200 ${
            //             current === index
            //               ? "ring-4 ring-blue-500 scale-105 shadow-lg"
            //               : "hover:scale-105"
            //           }`}
            //         >
            //           <div
            //             style={{
            //               height: "150px",
            //               overflow: "hidden",
            //             }}
            //           >
            //             <ImageKit
            //               urlEndpoint="https://ik.imagekit.io/vuongninh"
            //               src={src.split("/").pop() as string}
            //               alt={`image-${index}`}
            //               height={150}
            //               style={{
            //                 height: "100%",
            //                 width: "auto",
            //                 display: "block",
            //               }}
            //               className="rounded-lg"
            //               onClick={() => setCurrent(index)}
            //             />
            //           </div>
            //         </div>
            //       ))}
            //     </div>
            //     <Button
            //       icon={<RightOutlined />}
            //       onClick={() => scroll("right")}
            //       className="!absolute right-0 top-1/2 -translate-y-1/2 z-10"
            //     />
            //   </div>
            // ),
            visible,
            current,
            onVisibleChange: (v) => setVisible(v),
            onChange: (index) => setCurrent(index),
          }}
        >
          {images.map((item) =>
            homeData?.storageKey.urlEndpoint ? (
              <Image
                key={item + 1}
                src={homeData?.storageKey.urlEndpoint + item}
                style={{ height: 0, width: 0 }}
                wrapperStyle={{ display: "block" }}
              />
            ) : null
          )}

          {images.map((item, index) => (
            <MarkImagePreview
              src={item}
              bodyWidth={window.innerWidth / columnCount}
              urlEndpoint={homeData?.storageKey.urlEndpoint || ""}
              key={item + 2}
              styleImage={{ marginBottom: 4, width: "100%" }}
              onClick={() => {
                setCurrent(index);
                setVisible(true);
                setFirst(true);
              }}
            />
          ))}
        </Image.PreviewGroup>
      </div>
    </Section>
  );
};

export default Gallery;
