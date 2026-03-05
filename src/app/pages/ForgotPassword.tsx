import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft, Send, ShieldCheck } from 'lucide-react';

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ ...errors, email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email' });
      return;
    }

    // Simulate sending email
    setTimeout(() => {
      setStep('verify');
    }, 1000);
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setErrors({ ...errors, verificationCode: 'Please enter the complete code' });
      return;
    }

    // Simulate verification
    setTimeout(() => {
      setStep('reset');
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      email: '',
      verificationCode: '',
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : '',
    };

    setErrors(newErrors);

    if (newErrors.newPassword || newErrors.confirmPassword) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1000);
  };

  // Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-yellow-400/20 animate-slideUp">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/50 animate-bounce">
            <CheckCircle2 className="w-14 h-14 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-3">Password Reset!</h2>
          <p className="text-gray-300 text-lg mb-2">
            Your password has been reset successfully
          </p>
          <p className="text-gray-400 text-sm">
            Redirecting you to login...
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-all group animate-fadeIn"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-3xl p-8 shadow-2xl shadow-yellow-400/10 animate-slideUp">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full transition-all ${step === 'email' ? 'bg-yellow-400 w-8' : 'bg-yellow-400/30'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-all ${step === 'verify' ? 'bg-yellow-400 w-8' : 'bg-yellow-400/30'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-all ${step === 'reset' ? 'bg-yellow-400 w-8' : 'bg-yellow-400/30'}`}></div>
          </div>

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/50 animate-pulse">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-yellow-400 mb-2">Forgot Password?</h1>
                <p className="text-gray-400">Don't worry! Enter your email and we'll send you a reset code</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-yellow-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-yellow-400/70" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full bg-black/50 border-2 ${
                        errors.email ? 'border-red-500' : 'border-yellow-400/30'
                      } rounded-xl px-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all`}
                      placeholder="student@sab.lk"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3.5 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Reset Code
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {step === 'verify' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/50 animate-pulse">
                  <ShieldCheck className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-yellow-400 mb-2">Check Your Email</h1>
                <p className="text-gray-400">We've sent a 6-digit code to</p>
                <p className="text-yellow-400 font-semibold mt-1">{email}</p>
              </div>

              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-yellow-400 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleVerificationChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            const prevInput = document.getElementById(`code-${index - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        className="w-12 h-14 bg-black/50 border-2 border-yellow-400/30 rounded-xl text-white text-center text-xl font-bold focus:outline-none focus:border-yellow-400 transition-all"
                      />
                    ))}
                  </div>
                  {errors.verificationCode && (
                    <p className="text-red-500 text-sm text-center">{errors.verificationCode}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3.5 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
                >
                  Verify Code
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                  >
                    Didn't receive the code? <span className="text-yellow-400 font-semibold">Resend</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/50 animate-pulse">
                  <KeyRound className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-yellow-400 mb-2">Create New Password</h1>
                <p className="text-gray-400">Your new password must be different from previous passwords</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-yellow-400">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-yellow-400/70" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, newPassword: e.target.value });
                        setErrors({ ...errors, newPassword: '' });
                      }}
                      className={`w-full bg-black/50 border-2 ${
                        errors.newPassword ? 'border-red-500' : 'border-yellow-400/30'
                      } rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400/70 hover:text-yellow-400 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-yellow-400/70" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className={`w-full bg-black/50 border-2 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-yellow-400/30'
                      } rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400/70 hover:text-yellow-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm font-semibold mb-2">Password Requirements:</p>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      Contains uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      Contains at least one number
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3.5 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
                >
                  Reset Password
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6 animate-fadeIn">
          Need help? <Link to="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
