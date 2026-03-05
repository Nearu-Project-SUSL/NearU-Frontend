import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ isFavorite, onClick, className = '', size = 'md' }: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5 w-8 h-8',
    md: 'p-2 w-10 h-10',
    lg: 'p-3 w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all hover:scale-110 ${sizeClasses[size]} ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isFavorite 
            ? 'fill-red-500 stroke-red-500' 
            : 'fill-none stroke-red-500 hover:fill-red-500/30'
        }`}
      />
    </button>
  );
}
