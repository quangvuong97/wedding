import { /* Button, */ Image } from "antd";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../common/Section";
import { WeddingPageApi } from "../../services/weddingPage.api";
import MarkImagePreview from "../common/MarkImagePreview";
import { useHomeData } from "../../contexts/HomeDataContext";

const AlbumWedding: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(false);

  const homeData = useHomeData();

  // const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { response: carouselResponse } = WeddingPageApi.useGetAlbumWedding();
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

  useEffect(() => {
    const container = divRef.current;
    if (!container) return;

    const rowHeight = 220;
    const SPACE = 4;

    container.style.boxSizing = "border-box";
    // Remove inline-block whitespace gaps
    container.style.fontSize = "0";

    const getAlbumDivs = () =>
      Array.from(container.querySelectorAll(".album-image")) as HTMLElement[];

    const getImagesData = () => {
      const items = getAlbumDivs()
        .map((div) => {
          const img = div.querySelector("img") as HTMLImageElement | null;
          return img ? { div, img } : null;
        })
        .filter(Boolean) as { div: HTMLElement; img: HTMLImageElement }[];

      return items.map(({ div, img }) => ({
        div,
        img,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        aspect: img.naturalWidth / img.naturalHeight,
      }));
    };

    const applyRow = (
      row: {
        div: HTMLElement;
        img: HTMLImageElement;
        aspect: number;
      }[],
      scaleRatio: number
    ) => {
      row.forEach(({ div, img, aspect }, i) => {
        const w = rowHeight * aspect * scaleRatio;
        const h = rowHeight * scaleRatio;

        img.style.width = w + "px";
        img.style.height = h + "px";
        img.style.objectFit = "cover";

        div.style.width = w + "px";
        div.style.height = h + "px";
        div.style.display = "inline-block";
        div.style.verticalAlign = "top";
        div.style.boxSizing = "border-box";
        div.style.marginRight = i < row.length - 1 ? SPACE + "px" : "0";
        div.style.marginBottom = SPACE + "px";
        // Reset font-size for descendants so overlay text remains visible
        div.style.fontSize = "initial";
      });
    };

    const layoutGallery = () => {
      const containerWidth = container.clientWidth;
      const imagesData = getImagesData();
      if (!imagesData.length) return;

      let row:
        | {
            div: HTMLElement;
            img: HTMLImageElement;
            aspect: number;
          }[] = [];
      let rowWidth = 0;

      imagesData.forEach((data, i) => {
        const scaledWidth = rowHeight * data.aspect;
        row.push(data as any);
        rowWidth += scaledWidth;

        if (
          rowWidth + SPACE * (row.length - 1) >= containerWidth ||
          i === imagesData.length - 1
        ) {
          const totalMargin = SPACE * (row.length - 1);
          const scaleRatio = Math.min(
            (containerWidth - totalMargin) / rowWidth,
            1
          );
          applyRow(row as any, scaleRatio);
          row = [];
          rowWidth = 0;
        }
      });
    };

    const waitForImages = () =>
      new Promise<void>((resolve) => {
        const imgs = getAlbumDivs()
          .map((div) => div.querySelector("img"))
          .filter(Boolean) as HTMLImageElement[];

        if (!imgs.length) {
          resolve();
          return;
        }

        let pending = imgs.filter(
          (img) => !(img.complete && img.naturalWidth > 0)
        ).length;

        if (pending === 0) {
          resolve();
          return;
        }

        const done = () => {
          pending -= 1;
          if (pending <= 0) {
            resolve();
          }
        };

        imgs.forEach((img) => {
          if (img.complete && img.naturalWidth > 0) return;
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      });

    let resizeObserver: ResizeObserver | null = null;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(layoutGallery);
    };

    let stopped = false;
    const init = async () => {
      await waitForImages();
      if (stopped) return;
      layoutGallery();

      resizeObserver = new ResizeObserver(() => schedule());
      resizeObserver.observe(container);
      window.addEventListener("resize", schedule);
    };
    init();

    return () => {
      stopped = true;
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [images, homeData?.storageKey?.urlEndpoint]);

  // const scroll = (direction: "left" | "right") => {
  //   if (scrollRef.current) {
  //     const scrollAmount = direction === "left" ? -300 : 300;
  //     scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //   }
  // };

  return (
    <Section title="Album Hình Cưới">
      <div className="album-wedding" ref={divRef}>
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
              />
            ) : null
          )}

          {images.map((item, index) => (
            <MarkImagePreview
              src={item}
              bodyWidth={window.innerWidth / 3}
              urlEndpoint={homeData?.storageKey.urlEndpoint || ""}
              key={item + 2}
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

export default AlbumWedding;
