import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface ServiceCardProps {
  image: string;
  label: string;
  description: string;
  gradient: string;
  iconBg: string;
  count: string;
  delay?: string;
}

export function EnhancedServiceCard({ image, label, description, gradient, iconBg, count, delay = '0s' }: ServiceCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Route to the appropriate page based on the service label
    switch (label) {
      case 'Food Delivery':
        navigate('/food');
        break;
      case 'Campus Rides':
        navigate('/rides');
        break;
      case 'Accommodation':
        navigate('/accommodation');
        break;
      case 'Part-Time Jobs':
        navigate('/jobs');
        break;
      case 'Custom Gifts':
        navigate('/gifts');
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: parseFloat(delay) }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      style={{ animationDelay: delay }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.3) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }}></div>

      {/* Animated glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Image container */}
        <div className="relative mb-6">
          {/* Glow ring */}
          <div className={`absolute inset-0 ${iconBg} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`}></div>
          
          {/* Image */}
          <div className={`relative w-20 h-20 ${iconBg} rounded-2xl overflow-hidden group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
            <img src={image} alt={label} className="w-full h-full object-cover" />
          </div>

          {/* Count badge */}
          {count && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
              <span className="text-black text-xs">{count}</span>
            </div>
          )}
        </div>
        
        {/* Text */}
        <div className="text-left space-y-2">
          <h3 className="text-white text-2xl group-hover:text-yellow-300 transition-colors duration-300">
            {label}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="mt-6 flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
          <span className="text-sm">Explore</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </motion.div>
  );
}