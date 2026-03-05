interface DealCardProps {
  title: string;
  description: string;
  discount?: string;
  image: string;
  delay?: string;
}

export function DealCard({ title, description, discount, image, delay = '0s' }: DealCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border-2 border-white/10 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp"
      style={{ animationDelay: delay }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-red-700 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <span className="font-bold text-sm">{discount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white text-lg mb-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 group-hover:scale-105">
          Get Deal
        </button>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
