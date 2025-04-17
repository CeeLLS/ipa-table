import React from "react";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = React.useState(() => {
    const saved = window.localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  React.useEffect(() => {
    const newTheme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    window.localStorage.setItem("theme", newTheme);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
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
