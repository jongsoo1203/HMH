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

  // When in dark mode, show text alternative
  if (resolvedTheme === "dark") {
    return (
      <div 
        className="flex items-center justify-center text-white mx-auto"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <span className={size === "large" ? "text-2xl font-bold" : "text-sm font-medium"}>
          HMH
        </span>
      </div>
    );
  }

  // In light mode, show the logo image
  return (
    <Image 
      src="/HMH-logo.svg" 
      width={dimensions.width} 
      height={dimensions.height} 
      alt="Health Mapping Hub logo"
      className="mx-auto" 
      priority
    />
  );
}