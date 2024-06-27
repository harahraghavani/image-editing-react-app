import { createContext, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("themeColor")
      ? localStorage.getItem("themeColor")
      : null
  );

  const handleChangeThemeColor = (color) => {
    setSelectedColor(color);
    localStorage.setItem("themeColor", color);
  };

  const resetToDefault = () => {
    setSelectedColor(null);
    localStorage.removeItem("themeColor");
  };

  const values = {
    selectedColor,
    setSelectedColor,
    changeColor: handleChangeThemeColor,
    resetToDefault,
  };

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
