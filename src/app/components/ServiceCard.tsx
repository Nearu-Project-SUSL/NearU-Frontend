import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  label: string;
  gradient: string;
  onClick?: () => void;
  delay?: string;
}

export function ServiceCard({ icon: Icon, label, gradient, onClick, delay = '0s' }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-8 ${gradient} border-2 border-white/20 hover:border-yellow-400/60 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/30 animate-slideUp`}
      style={{ animationDelay: delay }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Sparkle effect on hover */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Icon with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Icon className="w-16 h-16 text-yellow-400 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
        </div>
        
        {/* Label */}
        <span className="text-white text-xl group-hover:text-yellow-300 transition-colors duration-300">
          {label}
        </span>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/20 to-transparent rounded-tl-full transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
    </button>
  );
}
