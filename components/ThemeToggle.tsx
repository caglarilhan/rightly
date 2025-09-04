// components/ThemeToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
      title={`Current theme: ${getThemeLabel()}. Click to switch.`}
    >
      {getThemeIcon()}
    </Button>
  );
}
