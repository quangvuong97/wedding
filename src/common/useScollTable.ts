import { useState, useEffect } from "react";

function useScrollTable(fixedHeights: number) {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const calculateScrollY = () => {
      const viewportHeight = window.innerHeight;
      const scrollHeight = viewportHeight - fixedHeights;
      setScrollY(scrollHeight > 0 ? scrollHeight : 0);
    };

    calculateScrollY();

    window.addEventListener("resize", calculateScrollY);

    return () => {
      window.removeEventListener("resize", calculateScrollY);
    };
  }, [fixedHeights]);

  return scrollY;
}

export default useScrollTable;
