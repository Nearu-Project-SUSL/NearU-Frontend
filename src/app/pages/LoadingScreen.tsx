import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/location-permission'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.5) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(250, 204, 21, 0.5) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }}></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-8">
        {/* Logo Animation */}
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 w-48 h-48 rounded-full border-4 border-yellow-400/20 animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 w-40 h-40 rounded-full border-4 border-yellow-400/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          
          {/* Logo */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
              <span className="text-6xl">🎓</span>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl text-white tracking-wider animate-fadeIn">
            Near<span className="text-yellow-400">U</span>
          </h1>
          <p className="text-yellow-400/80 text-lg animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            Your Campus. Your Community.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 space-y-3 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-center text-yellow-400/60 text-sm">
            Loading {progress}%
          </p>
        </div>

        {/* Loading text */}
        <div className="flex gap-2 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}