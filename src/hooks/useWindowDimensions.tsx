import { useState, useEffect } from "react";

type Dimensions = {
  width: number | null;
  height: number | null;
};

const getWindowDimensions = (): Dimensions | null => {
  if (typeof window === "undefined") return null;

  const { innerWidth: width, innerHeight: height } = window;

  return { width, height };
};

const useWindowDimensions = (
  dimension?: "width" | "height"
): Partial<Dimensions> | number | null => {
  const [windowDimensions, setWindowDimensions] = useState<Dimensions | null>(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowDimensions === null) return null;

  if (dimension === "width") return windowDimensions.width;
  if (dimension === "height") return windowDimensions.height;
  return windowDimensions;
};

export default useWindowDimensions;
