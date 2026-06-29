"use client";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        document.body.classList.add("dark");
        setIsDark(true);
      }
    };
    load();
  }, []);

  const toggle = () => {
    if (isDark) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-card text-card-foreground border hover:bg-foreground hover:text-background transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};

export default ThemeToggle;
