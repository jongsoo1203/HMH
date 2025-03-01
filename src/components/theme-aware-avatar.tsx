"use client";

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
    ? { width: 120, height: 48 } 
    : { width: 40, height: 40 };
  
  const logoSize = size === "large" 
    ? { width: 80, height: 30 } 
    : { width: 24, height: 24 };
  
  const paddingSize = size === "large" ? "px-4 py-2" : "p-2";

  // Before mounting, show a placeholder
  if (!mounted) {
    return (
      <div 
        className="bg-transparent mx-auto"
        style={{ width: dimensions.width, height: dimensions.height }}
      />
    );
  }

  // Color based on theme
  const fillColor = resolvedTheme === "dark" ? "#FFFFFF" : "#1E40AF"; // white in dark mode, blue-600 in light mode

  // Avatar content based on theme with inline SVG
  return (
    <div 
      className={`flex items-center justify-center mx-auto rounded-full ${paddingSize} ${resolvedTheme === "dark" ? "bg-gray-700" : "bg-blue-100"}`}
      style={{ 
        width: size === "large" ? "auto" : dimensions.width,
        height: dimensions.height
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
        width={logoSize.width} 
        height={logoSize.height}
      >
        <text 
          x="50" 
          y="75" 
          fontSize="60" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill={fillColor}
        >
          HMH
        </text>
      </svg>
    </div>
  );
}