import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Navigation, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type PermissionState = 'prompt' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export default function LocationPermission() {
  const navigate = useNavigate();
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [locationInfo, setLocationInfo] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Check if permission was already granted
    const hasPermission = localStorage.getItem('location_permission');
    if (hasPermission === 'granted') {
      navigate('/landing');
    }
  }, [navigate]);

  const requestLocation = () => {
    setPermissionState('requesting');
    setErrorMessage('');

    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      setPermissionState('unavailable');
      setErrorMessage('Geolocation is not supported by this browser');
      setTimeout(() => {
        localStorage.setItem('location_permission', 'unavailable');
        navigate('/landing');
      }, 3000);
      return;
    }

    // Request current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', { latitude, longitude });
        setLocationInfo({ lat: latitude, lng: longitude });
        setPermissionState('granted');
        
        // Store permission and location data
        localStorage.setItem('location_permission', 'granted');
        localStorage.setItem('user_location', JSON.stringify({ lat: latitude, lng: longitude }));
        
        // Navigate to landing page after short delay
        setTimeout(() => {
          navigate('/landing');
        }, 1500);
      },
      (error) => {
        // Error callback
        console.error('Location error code:', error.code);
        console.error('Location error message:', error.message);
        
        let errorMsg = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out';
            break;
          default:
            errorMsg = 'An unknown error occurred';
            break;
        }
        
        setErrorMessage(errorMsg);
        setPermissionState('denied');
        localStorage.setItem('location_permission', 'denied');
        
        // Still allow access after 3 seconds
        setTimeout(() => {
          navigate('/landing');
        }, 3000);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const skipPermission = () => {
    localStorage.setItem('location_permission', 'skipped');
    navigate('/landing');
  };

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
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-2xl mx-auto">
        {/* Icon based on state */}
        <div className="relative">
          {permissionState === 'prompt' && (
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse">
              <MapPin className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
          )}
          
          {permissionState === 'requesting' && (
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-spin">
              <Navigation className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
          )}
          
          {permissionState === 'granted' && (
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-scaleIn">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          )}
          
          {permissionState === 'denied' && (
            <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 animate-scaleIn">
              <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          )}
          
          {permissionState === 'unavailable' && (
            <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-scaleIn">
              <AlertCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="text-center space-y-4">
          {permissionState === 'prompt' && (
            <>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider animate-fadeIn">
                Enable <span className="text-yellow-400">Location</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-md mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                Near<span className="text-yellow-400">U</span> uses your location to show nearby services, shops, and transport options at Sabaragamuwa University
              </p>
            </>
          )}
          
          {permissionState === 'requesting' && (
            <>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider animate-fadeIn">
                Getting Your <span className="text-yellow-400">Location</span>
              </h1>
              <p className="text-gray-300 text-lg animate-fadeIn">
                Please allow access when prompted...
              </p>
            </>
          )}
          
          {permissionState === 'granted' && (
            <>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider animate-fadeIn">
                Location <span className="text-green-400">Enabled</span>!
              </h1>
              <p className="text-gray-300 text-lg animate-fadeIn">
                Perfect! You'll get personalized service recommendations
              </p>
              {locationInfo && (
                <p className="text-yellow-400/60 text-sm animate-fadeIn">
                  Lat: {locationInfo.lat.toFixed(4)}, Lng: {locationInfo.lng.toFixed(4)}
                </p>
              )}
            </>
          )}
          
          {permissionState === 'denied' && (
            <>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider animate-fadeIn">
                Location <span className="text-red-400">Denied</span>
              </h1>
              <p className="text-gray-300 text-lg animate-fadeIn">
                No worries! You can still explore Near<span className="text-yellow-400">U</span> services
              </p>
              <p className="text-gray-400 text-sm animate-fadeIn">
                You can enable location later in your browser settings
              </p>
              {errorMessage && (
                <p className="text-red-400 text-sm animate-fadeIn">
                  {errorMessage}
                </p>
              )}
            </>
          )}
          
          {permissionState === 'unavailable' && (
            <>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider animate-fadeIn">
                Location <span className="text-orange-400">Unavailable</span>
              </h1>
              <p className="text-gray-300 text-lg animate-fadeIn">
                Your browser doesn't support location services
              </p>
              {errorMessage && (
                <p className="text-red-400 text-sm animate-fadeIn">
                  {errorMessage}
                </p>
              )}
            </>
          )}
        </div>

        {/* Buttons */}
        {permissionState === 'prompt' && (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={requestLocation}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <MapPin className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-semibold">Enable Location</span>
            </button>
            
            <button
              onClick={skipPermission}
              className="flex-1 bg-gray-800/50 backdrop-blur-sm text-gray-300 px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Skip for Now
            </button>
          </div>
        )}

        {/* Benefits list */}
        {permissionState === 'prompt' && (
          <div className="mt-8 space-y-3 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <p className="text-yellow-400/60 text-sm text-center mb-4">Why we need your location:</p>
            <div className="grid gap-3 text-left">
              <div className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Find nearby food vendors and restaurants</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Get accurate transport options (tuk-tuks, buses, trains)</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Discover local shops and services near you</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Receive personalized recommendations</span>
              </div>
            </div>
          </div>
        )}

        {/* Auto-redirect message */}
        {(permissionState === 'denied' || permissionState === 'unavailable') && (
          <div className="flex items-center gap-2 text-gray-400 text-sm animate-fadeIn">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>Redirecting to Near<span className="text-yellow-400">U</span>...</span>
          </div>
        )}
      </div>
    </div>
  );
}