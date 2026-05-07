import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function LoadingScreen({ isSplashScreen = false }: { isSplashScreen?: boolean }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSplashScreen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/login'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [navigate, isSplashScreen]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)' }}>

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(46, 158, 191, 0.6) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(46, 158, 191, 0.6) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }}></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
        style={{ background: 'rgba(46, 158, 191, 0.15)' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float"
        style={{ background: 'rgba(46, 158, 191, 0.10)', animationDelay: '2s' }}></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-8">

        {/* Logo Animation */}
        <div className="relative">
          {/* Spinning rings */}
          <div className="absolute inset-0 w-48 h-48 rounded-full animate-spin"
            style={{ border: '3px solid rgba(46, 158, 191, 0.25)', animationDuration: '3s' }}></div>
          <div className="absolute inset-4 w-40 h-40 rounded-full animate-spin"
            style={{ border: '3px solid rgba(46, 158, 191, 0.4)', animationDuration: '2s', animationDirection: 'reverse' }}></div>

          {/* Logo */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse"
              style={{ background: 'linear-gradient(135deg, #2E9EBF, #1a7a9a)', boxShadow: '0 0 60px rgba(46,158,191,0.5)' }}>
              <span className="text-6xl">🎓</span>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl text-white tracking-wider animate-fadeIn font-light">
            Near<span style={{ color: '#2E9EBF', fontWeight: 700 }}>U</span>
          </h1>
          <p className="text-lg animate-fadeIn" style={{ color: 'rgba(46, 158, 191, 0.85)', animationDelay: '0.3s' }}>
            Your Campus. Your Community.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 space-y-3 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out ${!isSplashScreen ? 'animate-pulse w-full' : ''}`}
              style={{
                ...(isSplashScreen ? { width: `${progress}%` } : {}),
                background: 'linear-gradient(90deg, #2E9EBF, #52c8e8)',
                boxShadow: '0 0 12px rgba(46,158,191,0.6)',
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-center text-sm" style={{ color: 'rgba(46, 158, 191, 0.6)' }}>
            {isSplashScreen ? `Loading ${progress}%` : 'Loading...'}
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-2 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: '#2E9EBF', animationDelay: `${delay}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}