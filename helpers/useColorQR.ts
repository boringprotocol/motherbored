import { useEffect, useState } from "react";

const useColorQR = (): { primaryColor: string; bgColor: string } => {
  const [colors, setColors] = useState<{
    primaryColor: string;
    bgColor: string;
  }>({
    primaryColor: "",
    bgColor: "",
  });

  useEffect(() => {
    const updateColors = () => {
      const primaryColorElement = window.document.createElement("div");
      primaryColorElement.style.display = "none";
      primaryColorElement.style.backgroundColor = "var(--color-primary)";

      const bgColorElement = window.document.createElement("div");
      bgColorElement.style.display = "none";
      bgColorElement.style.backgroundColor =
        "hsla(var(--b1) / var(--tw-bg-opacity, 1))";

      window.document.body.appendChild(primaryColorElement);
      window.document.body.appendChild(bgColorElement);

      const computedPrimaryColor = window
        .getComputedStyle(primaryColorElement)
        .getPropertyValue("background-color");
      const primaryColor = parseColorToHex(computedPrimaryColor);

      const computedBgColor = window
        .getComputedStyle(bgColorElement)
        .getPropertyValue("background-color");
      const bgColor = parseColorToHex(computedBgColor);

      setColors({ primaryColor, bgColor });

      primaryColorElement.remove();
      bgColorElement.remove();
    };

    updateColors();

    window.addEventListener("themeChanged", updateColors);

    return () => {
      window.removeEventListener("themeChanged", updateColors);
    };
  }, []);

  const parseColorToHex = (color: string): string => {
    const rgb = color.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return rgb && rgb.length === 4
      ? "#" +
          ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
      : "";
  };

  return colors;
};

export default useColorQR;
