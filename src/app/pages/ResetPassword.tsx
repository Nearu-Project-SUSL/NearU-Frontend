import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      currentPassword: !formData.currentPassword ? 'Current password is required' : '',
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-3xl p-8 max-w-md w-full text-center animate-slideIn">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-3">Success!</h2>
          <p className="text-gray-300 text-lg">
            Your password has been reset successfully
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/profile"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>

        {/* Reset Password Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-3xl p-8 shadow-2xl shadow-yellow-400/10 animate-slideIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/50">
              <KeyRound className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">Reset Password</h1>
            <p className="text-gray-400">Create a new secure password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-yellow-400">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-yellow-400/70" />
                </div>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border-2 ${
                    errors.currentPassword ? 'border-red-500' : 'border-yellow-400/30'
                  } rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400/70 hover:text-yellow-400 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>

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
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
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
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-yellow-400/70" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  Contains at least one number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
