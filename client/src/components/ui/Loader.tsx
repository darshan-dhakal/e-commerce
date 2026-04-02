import React from "react";
import { clsx } from "clsx";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "white";
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorMap = {
    primary: "border-primary-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  const spinner = (
    <div
      className={clsx(
        "rounded-full animate-spin",
        sizeMap[size],
        colorMap[variant],
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
