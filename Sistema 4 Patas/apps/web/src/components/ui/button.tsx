import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    let variantStyles = 'bg-indigo-600 text-white hover:bg-indigo-700';
    if (variant === 'outline') variantStyles = 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900';
    if (variant === 'ghost') variantStyles = 'bg-transparent hover:bg-gray-100 text-gray-900';
    if (variant === 'destructive') variantStyles = 'bg-red-500 text-white hover:bg-red-600';
    if (variant === 'link') variantStyles = 'text-indigo-600 hover:underline bg-transparent';

    let sizeStyles = 'h-10 px-4 py-2';
    if (size === 'sm') sizeStyles = 'h-9 px-3 text-sm';
    if (size === 'lg') sizeStyles = 'h-11 px-8';
    if (size === 'icon') sizeStyles = 'h-10 w-10 flex items-center justify-center';

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50 ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
