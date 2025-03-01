"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeAwareAvatar({ size = "normal" }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Size configurations
  const dimensions = size === "large" 
    ? { width: 140, height: 50 } 
    : { width: 40, height: 40 };

  // Before mounting, show a placeholder
  if (!mounted) {
    return (
      <div 
        className="bg-transparent mx-auto" 
        style={{ width: dimensions.width, height: dimensions.height }}
      />
    );
  }

  // Avatar content based on theme
  return (
    <div 
      className={`flex items-center justify-center rounded-full ${resolvedTheme === "dark" ? "bg-gray-700" : "bg-blue-100"}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <span className={`${size === "large" ? "text-2xl" : "text-sm"} font-medium ${resolvedTheme === "dark" ? "text-white" : "text-blue-600"}`}>
        HMH
      </span>
    </div>
  );
}