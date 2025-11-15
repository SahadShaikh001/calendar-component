import React, { useEffect } from "react";
import useDarkMode from "@/hooks/useDarkMode";

interface Props {
  children: React.ReactNode;
}

const ResponsiveWrapper: React.FC<Props> = ({ children }) => {
  const { isDark, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        isDark ? "bg-neutral-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          aria-pressed={isDark}
          className="bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg"
        >
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <main className="flex flex-col items-center p-4 sm:p-8">{children}</main>
    </div>
  );
};

export default ResponsiveWrapper;
