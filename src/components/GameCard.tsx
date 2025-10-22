import { ReactNode } from 'react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'purple' | 'brown';
}

export default function GameCard({ children, className = '', variant = 'purple' }: GameCardProps) {
  const bgColor = variant === 'purple' ? 'bg-[#FF6B6B]' : 'bg-[#8B4513]';
  
  return (
    <div className={`relative ${className}`}>
      <div className={`${bgColor} h-3 border-4 border-black`}></div>
      
      <div className="bg-[#FFFEF5] border-x-4 border-black px-6 py-4">
        {children}
      </div>
      
      <div className={`${bgColor} h-3 border-4 border-t-0 border-black`}></div>
      
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#FFD700] border-2 border-black rounded-full"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] border-2 border-black rounded-full"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#FFD700] border-2 border-black rounded-full"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FFD700] border-2 border-black rounded-full"></div>
    </div>
  );
}
