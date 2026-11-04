'use client';

import React from 'react';

/**
 * CampusSignal — Signal Atlas Button
 * Owner: Abhinandana S
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#B84C3A] hover:bg-[#A03D2D] text-white focus:ring-[#B84C3A] border border-transparent shadow-xs',
    secondary: 'bg-white dark:bg-[#171D27] hover:bg-[#F3F6F8] dark:hover:bg-[#1F2734] text-[#242B38] dark:text-[#E8EDF3] border border-[#E4E8EC] dark:border-[#273140] focus:ring-[#B84C3A]',
    ghost: 'bg-transparent hover:bg-[#F3F6F8] dark:hover:bg-[#1A222F] text-[#242B38] dark:text-[#E8EDF3] border border-transparent focus:ring-[#B84C3A]',
    outline: 'bg-transparent border border-[#B84C3A] text-[#B84C3A] hover:bg-[#FBF0EE] dark:hover:bg-[rgba(184,76,58,0.15)] focus:ring-[#B84C3A]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
