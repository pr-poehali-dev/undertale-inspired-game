import { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function PixelButton({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}: PixelButtonProps) {
  const bgColor = variant === 'primary' ? 'bg-[#FFD700]' : 'bg-[#8B4513]';
  const textColor = variant === 'primary' ? 'text-black' : 'text-[#FFD700]';
  
  return (
    <button
      className={`
        ${bgColor} 
        ${textColor}
        px-6 py-3 
        border-4 border-black 
        text-pixelated 
        text-sm
        hover:scale-105 
        active:scale-95 
        transition-transform 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
