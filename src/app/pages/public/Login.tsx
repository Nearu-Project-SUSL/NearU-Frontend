import { Link } from 'react-router';
import { Eye, EyeOff, GraduationCap, Bike, Store, Mail, Lock } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 lg:px-12 py-6 bg-black/30 backdrop-blur-sm border-b border-yellow-400/20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
            <span className="text-black text-2xl">🎓</span>
          </div>
          <span className="text-white text-2xl">NearU</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">New to NearU?</span>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all backdrop-blur-sm hover:scale-105 duration-300"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 animate-fadeIn">
            {/* Illustration */}
            <div className="relative w-full max-w-md">
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Central hub */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="relative w-64 h-64 bg-gradient-to-br from-gray-800 to-black rounded-3xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 p-8">
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <GraduationCap className="w-10 h-10 text-black" />
                  </div>

                  {/* Orbiting icons */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float">
                    <Store className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '1s' }}>
                    <Bike className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '2s' }}>
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '3s' }}>
                    <Lock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-4xl text-white">
                Connecting Your Campus<br />
                <span className="text-yellow-400">One Click Away.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Discover local businesses, uni riders, and part-time jobs tailored for university students. Join the NearU community today.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto animate-slideUp">
            <div className="bg-gradient-to-br from-yellow-400/5 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/20 p-8 lg:p-10 shadow-2xl shadow-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Please Enter your Details to Sign in.</p>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Email */}
                <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                  <label className="text-gray-300 text-sm block mb-2">Enter your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Studentatuniversity@sab.lk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <label className="text-gray-300 text-sm block mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link to="/forgot-password" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 hover:scale-105 duration-300 animate-slideUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  Login
                </button>

                {/* Divider */}
                <div className="relative my-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-yellow-400/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-black/50 px-4 text-gray-400">OR COUNTINUE WITH</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                  <button
                    type="button"
                    className="bg-black/40 hover:bg-black/60 border-2 border-yellow-400/20 hover:border-yellow-400/40 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 duration-300"
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
                    className="bg-black/40 hover:bg-black/60 border-2 border-yellow-400/20 hover:border-yellow-400/40 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 duration-300"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-sm">Guest</span>
                  </button>
                </div>

                {/* Terms */}
                <p className="text-center text-xs text-gray-500 mt-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                  By Continuing, you agree to NearU's Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 text-center py-6 text-gray-500 text-sm">
        2025 NearU. All rights Reserved
      </footer>
    </div>
  );
}