import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  delay?: string;
}

export function ReviewCard({ name, avatar, rating, review, date, delay = '0s' }: ReviewCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-2 border-white/10 hover:border-yellow-400/40 p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 animate-slideUp"
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src={avatar} 
            alt={name}
            className="relative w-14 h-14 rounded-full object-cover border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all"
          />
        </div>

        {/* Name and Rating */}
        <div className="flex-1">
          <h4 className="text-white text-lg group-hover:text-yellow-400 transition-colors">
            {name}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Date */}
        <span className="text-gray-500 text-xs">
          {date}
        </span>
      </div>

      {/* Review Text */}
      <p className="text-gray-400 text-sm leading-relaxed">
        {review}
      </p>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}
