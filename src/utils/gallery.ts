export function gallery({
  divRef,
  rowHeight = 220,
  space = 4,
  selector = ".album-image",
}: {
  divRef: React.RefObject<HTMLDivElement | null>;
  rowHeight?: number;
  space?: number;
  selector?: string;
}) {
  const container = divRef.current;
  if (!container) return;

  container.style.boxSizing = "border-box";
  container.style.fontSize = "0";

  const getAlbumDivs = () =>
    Array.from(container.querySelectorAll(selector)) as HTMLElement[];

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
      div.style.marginRight = i < row.length - 1 ? space + "px" : "0";
      div.style.marginBottom = space + "px";
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
        rowWidth + space * (row.length - 1) >= containerWidth ||
        i === imagesData.length - 1
      ) {
        const totalMargin = space * (row.length - 1);
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
}
