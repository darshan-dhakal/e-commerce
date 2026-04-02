import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 active:scale-95 focus:ring-primary-300",
      secondary:
        "bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50 active:scale-95 focus:ring-primary-300",
      ghost:
        "bg-transparent text-primary-500 hover:bg-primary-50 active:scale-95 focus:ring-primary-300",
      danger:
        "bg-red-500 text-white hover:bg-red-600 active:scale-95 focus:ring-red-300",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          "flex items-center justify-center gap-2",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
