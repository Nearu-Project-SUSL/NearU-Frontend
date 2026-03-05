import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Bike, Store, User } from 'lucide-react';

export function RegistrationForm() {
  const [userType, setUserType] = useState<'student' | 'rider' | 'business'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl text-white mb-2">Create an Account</h2>
        <p className="text-gray-400 text-sm">Join the Community tailored to your needs</p>
      </div>

      {/* User Type Selection */}
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-3 text-center">I Am a...</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setUserType('student')}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
              userType === 'student'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50'
                : 'bg-black/40 border-white/20 hover:border-yellow-400/50'
            }`}
          >
            <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
              userType === 'student' ? 'text-black' : 'text-white'
            }`} />
            <p className={`text-xs font-medium ${
              userType === 'student' ? 'text-black' : 'text-white'
            }`}>Student</p>
          </button>

          <button
            onClick={() => setUserType('rider')}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
              userType === 'rider'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50'
                : 'bg-black/40 border-white/20 hover:border-yellow-400/50'
            }`}
          >
            <Bike className={`w-8 h-8 mx-auto mb-2 ${
              userType === 'rider' ? 'text-black' : 'text-white'
            }`} />
            <p className={`text-xs font-medium ${
              userType === 'rider' ? 'text-black' : 'text-white'
            }`}>Rider</p>
          </button>

          <button
            onClick={() => setUserType('business')}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
              userType === 'business'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50'
                : 'bg-black/40 border-white/20 hover:border-yellow-400/50'
            }`}
          >
            <Store className={`w-8 h-8 mx-auto mb-2 ${
              userType === 'business' ? 'text-black' : 'text-white'
            }`} />
            <p className={`text-xs font-medium ${
              userType === 'business' ? 'text-black' : 'text-white'
            }`}>Business</p>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-4">
        {/* Full Name and Email in a row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-300 text-xs block mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-white/95 rounded-lg px-4 py-2.5 text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="text-gray-300 text-xs block mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="JohnHoe@university"
              className="w-full bg-white/95 rounded-lg px-4 py-2.5 text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-300 text-xs block mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className="w-full bg-white/95 rounded-lg px-4 py-2.5 text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-gray-500 text-[10px] mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            Must be at least 8 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-gray-300 text-xs block mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your Password"
              className="w-full bg-white/95 rounded-lg px-4 py-2.5 text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20"
        >
          Register Now
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black px-3 text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="bg-white/95 hover:bg-white text-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-gray-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm">Google</span>
          </button>

          <button
            type="button"
            className="bg-white/95 hover:bg-white text-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-gray-300"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Continue as Guest</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-[10px] text-gray-500 mt-4">
          By Continuing, you agree to NearU's Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
}
