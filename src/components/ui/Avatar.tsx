import React from 'react';

interface AvatarProps {
  initials: string;
  isStacked?: boolean;
  isOverflow?: boolean;
  bgColorClass?: string; 
}

export const Avatar: React.FC<AvatarProps> = ({ 
  initials, 
  isStacked = false, 
  isOverflow = false,
  bgColorClass = 'bg-blue-600'
}) => {
  return (
    <div
      className={`
        flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold border-2 border-white
        ${isStacked ? '-ml-2' : ''} 
        ${isOverflow ? 'bg-gray-500 text-gray-100' : bgColorClass}
      `}
      title={isOverflow ? `+${initials} more` : initials}
    >
      {isOverflow ? `+${initials}` : initials}
    </div>
  );
};