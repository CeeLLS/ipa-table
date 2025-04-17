import React from "react";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
  };

  return (
    <div className="theme-switch">
      <button onClick={toggleTheme}>
        {isDark ? (
          <>
            <span>☀️</span> Light
          </>
        ) : (
          <>
            <span>🌙</span> Dark
          </>
        )}
      </button>
    </div>
  );
};

export default ThemeSwitch;