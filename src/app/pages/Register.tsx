import { useState } from 'react';
import { Link } from 'react-router';
import { User, Mail, Lock, Phone, MapPin, Building2, FileText, Briefcase, Bike, CreditCard, ChevronRight, ChevronLeft, CheckCircle, ArrowRight, Eye, EyeOff, GraduationCap, Store } from 'lucide-react';

type UserType = 'student' | 'business' | 'rider';
type StudentStep = 1 | 2 | 3;

export default function Register() {
  const [userType, setUserType] = useState<UserType>('student');
  const [studentStep, setStudentStep] = useState<StudentStep>(1);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Personal Details
    studentId: '',
    faculty: '',
    year: '',
    phone: '',
    // Step 3: Additional Info
    address: '',
    city: '',
    dateOfBirth: '',
    emergencyContact: ''
  });

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessType: 'Food Vendor',
    address: '',
    description: '',
    registrationNumber: '',
    taxId: ''
  });

  // Rider form state
  const [riderForm, setRiderForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicleType: 'Tuk Tuk',
    vehicleNumber: '',
    licenseNumber: '',
    address: '',
    emergencyContact: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const faculties = ['Computing', 'Engineering', 'Management', 'Social Sciences', 'Applied Sciences'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const businessTypes = ['Food Vendor', 'Accommodation', 'Transport', 'Retail Shop', 'Services'];
  const vehicleTypes = ['Tuk Tuk', 'Motorcycle', 'Bicycle', 'Car'];

  const handleStudentStepNext = () => {
    if (studentStep < 3) setStudentStep((studentStep + 1) as StudentStep);
  };

  const handleStudentStepBack = () => {
    if (studentStep > 1) setStudentStep((studentStep - 1) as StudentStep);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentForm.password !== studentForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Student registration:', studentForm);
    alert('Student registration submitted successfully!');
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessForm.password !== businessForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Business registration:', businessForm);
    alert('Business registration submitted! Your application will be reviewed by admins.');
  };

  const handleRiderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (riderForm.password !== riderForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Rider registration:', riderForm);
    alert('Rider registration submitted! Your application will be reviewed by admins.');
  };

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
          <span className="text-gray-400 text-sm">Already have an account?</span>
          <Link 
            to="/login" 
            className="px-6 py-2.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all backdrop-blur-sm hover:scale-105 duration-300"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration & Info */}
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
                    <User className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '1s' }}>
                    <Bike className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '2s' }}>
                    <Store className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '3s' }}>
                    <Building2 className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-4xl text-white">
                Join the NearU<br />
                <span className="text-yellow-400">Community Today.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Connect with campus services, discover local businesses, and find part-time opportunities at Sabaragamuwa University.
              </p>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto animate-slideUp">
            <div className="bg-gradient-to-br from-yellow-400/5 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/20 p-8 lg:p-10 shadow-2xl shadow-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl lg:text-4xl text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Join the Sabaragamuwa University community</p>
              </div>

              {/* User Type Selector */}
              <div className="grid grid-cols-3 gap-3 mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <button
                  onClick={() => setUserType('student')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                    userType === 'student'
                      ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-black/40 border-yellow-400/20 hover:border-yellow-400/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto transition-all ${
                    userType === 'student' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110' : 'bg-gray-800 group-hover:scale-105'
                  }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">Student</p>
                </button>

                <button
                  onClick={() => setUserType('business')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                    userType === 'business'
                      ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-black/40 border-yellow-400/20 hover:border-yellow-400/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto transition-all ${
                    userType === 'business' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110' : 'bg-gray-800 group-hover:scale-105'
                  }`}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">Business</p>
                </button>

                <button
                  onClick={() => setUserType('rider')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                    userType === 'rider'
                      ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-black/40 border-yellow-400/20 hover:border-yellow-400/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto transition-all ${
                    userType === 'rider' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110' : 'bg-gray-800 group-hover:scale-105'
                  }`}>
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">Rider</p>
                </button>
              </div>

              {/* Student Registration */}
              {userType === 'student' && (
                <div className="animate-fadeIn">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                        studentStep >= 1 ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {studentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                      </div>
                      <div className={`flex-1 h-0.5 rounded ${studentStep > 1 ? 'bg-yellow-400' : 'bg-gray-800'}`}></div>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                        studentStep >= 2 ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {studentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                      </div>
                      <div className={`flex-1 h-0.5 rounded ${studentStep > 2 ? 'bg-yellow-400' : 'bg-gray-800'}`}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                        studentStep >= 3 ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-500'
                      }`}>
                        3
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleStudentSubmit}>
                    {/* Step 1: Basic Information */}
                    {studentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="text-center mb-4">
                          <h3 className="text-xl text-white mb-1">Basic Information</h3>
                          <p className="text-gray-400 text-sm">Let's start with your basic details</p>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={studentForm.fullName}
                              onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={studentForm.email}
                              onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="your.email@student.sab.ac.lk"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={studentForm.password}
                              onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="Create a strong password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              value={studentForm.confirmPassword}
                              onChange={(e) => setStudentForm({...studentForm, confirmPassword: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleStudentStepNext}
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3.5 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 hover:scale-105 duration-300 flex items-center justify-center gap-2 mt-6"
                        >
                          Next Step
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* Step 2: Personal Details */}
                    {studentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="text-center mb-4">
                          <h3 className="text-xl text-white mb-1">Personal Details</h3>
                          <p className="text-gray-400 text-sm">Tell us more about yourself</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Student ID</label>
                            <input
                              type="text"
                              required
                              value={studentForm.studentId}
                              onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="SAB/2024/001"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={studentForm.phone}
                              onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="+94 77 123 4567"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Faculty</label>
                            <select
                              required
                              value={studentForm.faculty}
                              onChange={(e) => setStudentForm({...studentForm, faculty: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300"
                            >
                              <option value="">Select faculty</option>
                              {faculties.map(faculty => (
                                <option key={faculty} value={faculty}>{faculty}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Year</label>
                            <select
                              required
                              value={studentForm.year}
                              onChange={(e) => setStudentForm({...studentForm, year: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300"
                            >
                              <option value="">Select year</option>
                              {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handleStudentStepBack}
                            className="flex-1 bg-black/40 hover:bg-black/60 border-2 border-yellow-400/20 hover:border-yellow-400/40 text-white py-3 rounded-xl transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2"
                          >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleStudentStepNext}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 hover:scale-105 duration-300 flex items-center justify-center gap-2"
                          >
                            Next Step
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Additional Information */}
                    {studentStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="text-center mb-4">
                          <h3 className="text-xl text-white mb-1">Additional Information</h3>
                          <p className="text-gray-400 text-sm">Just a few more details</p>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              required
                              value={studentForm.address}
                              onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
                              rows={2}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 resize-none"
                              placeholder="Enter your full address"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">City</label>
                            <input
                              type="text"
                              required
                              value={studentForm.city}
                              onChange={(e) => setStudentForm({...studentForm, city: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="Colombo"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Date of Birth</label>
                            <input
                              type="date"
                              required
                              value={studentForm.dateOfBirth}
                              onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Emergency Contact</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={studentForm.emergencyContact}
                              onChange={(e) => setStudentForm({...studentForm, emergencyContact: e.target.value})}
                              className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                              placeholder="+94 77 123 4567"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handleStudentStepBack}
                            className="flex-1 bg-black/40 hover:bg-black/60 border-2 border-yellow-400/20 hover:border-yellow-400/40 text-white py-3 rounded-xl transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2"
                          >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border-2 border-black/20 hover:scale-105 duration-300 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Complete Registration
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Business Registration */}
              {userType === 'business' && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-4">
                    <h3 className="text-xl text-white mb-1">Business Registration</h3>
                    <p className="text-gray-400 text-sm">Your application will be reviewed by admins</p>
                  </div>

                  <form onSubmit={handleBusinessSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Business Name</label>
                        <input
                          type="text"
                          required
                          value={businessForm.businessName}
                          onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Business name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Owner Name</label>
                        <input
                          type="text"
                          required
                          value={businessForm.ownerName}
                          onChange={(e) => setBusinessForm({...businessForm, ownerName: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Owner name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={businessForm.email}
                          onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="business@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={businessForm.phone}
                          onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={businessForm.password}
                            onChange={(e) => setBusinessForm({...businessForm, password: e.target.value})}
                            className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 pr-10 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={businessForm.confirmPassword}
                            onChange={(e) => setBusinessForm({...businessForm, confirmPassword: e.target.value})}
                            className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 pr-10 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Business Type</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          required
                          value={businessForm.businessType}
                          onChange={(e) => setBusinessForm({...businessForm, businessType: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl pl-12 pr-4 py-2.5 text-white focus:outline-none transition-all duration-300"
                        >
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Business Address</label>
                      <textarea
                        required
                        value={businessForm.address}
                        onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                        rows={2}
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Business address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Business Description</label>
                      <textarea
                        required
                        value={businessForm.description}
                        onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                        rows={2}
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Describe your business"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Registration No.</label>
                        <input
                          type="text"
                          required
                          value={businessForm.registrationNumber}
                          onChange={(e) => setBusinessForm({...businessForm, registrationNumber: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Registration no."
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Tax ID (Optional)</label>
                        <input
                          type="text"
                          value={businessForm.taxId}
                          onChange={(e) => setBusinessForm({...businessForm, taxId: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Tax ID"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 mt-4">
                      <p className="text-yellow-400 text-xs">
                        <strong>Note:</strong> Your application will be reviewed by our admin team. You'll receive an email notification once approved.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 hover:scale-105 duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      Submit for Review
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}

              {/* Rider Registration */}
              {userType === 'rider' && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-4">
                    <h3 className="text-xl text-white mb-1">Rider Registration</h3>
                    <p className="text-gray-400 text-sm">Your application will be reviewed by admins</p>
                  </div>

                  <form onSubmit={handleRiderSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={riderForm.fullName}
                          onChange={(e) => setRiderForm({...riderForm, fullName: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={riderForm.phone}
                          onChange={(e) => setRiderForm({...riderForm, phone: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={riderForm.email}
                          onChange={(e) => setRiderForm({...riderForm, email: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Emergency Contact</label>
                        <input
                          type="tel"
                          required
                          value={riderForm.emergencyContact}
                          onChange={(e) => setRiderForm({...riderForm, emergencyContact: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={riderForm.password}
                            onChange={(e) => setRiderForm({...riderForm, password: e.target.value})}
                            className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 pr-10 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={riderForm.confirmPassword}
                            onChange={(e) => setRiderForm({...riderForm, confirmPassword: e.target.value})}
                            className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 pr-10 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Vehicle Type</label>
                        <select
                          required
                          value={riderForm.vehicleType}
                          onChange={(e) => setRiderForm({...riderForm, vehicleType: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white focus:outline-none transition-all duration-300"
                        >
                          {vehicleTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Vehicle Number</label>
                        <input
                          type="text"
                          required
                          value={riderForm.vehicleNumber}
                          onChange={(e) => setRiderForm({...riderForm, vehicleNumber: e.target.value})}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="CAB-1234"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Driving License Number</label>
                      <input
                        type="text"
                        required
                        value={riderForm.licenseNumber}
                        onChange={(e) => setRiderForm({...riderForm, licenseNumber: e.target.value})}
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                        placeholder="DL-123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Address</label>
                      <textarea
                        required
                        value={riderForm.address}
                        onChange={(e) => setRiderForm({...riderForm, address: e.target.value})}
                        rows={2}
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Enter your full address"
                      />
                    </div>

                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 mt-4">
                      <p className="text-yellow-400 text-xs">
                        <strong>Note:</strong> Your application will be reviewed by our admin team. You'll need to provide additional documents for verification.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 hover:scale-105 duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      Submit for Review
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}

              {/* Terms */}
              <p className="text-center text-xs text-gray-500 mt-6 animate-fadeIn">
                By Continuing, you agree to NearU's Terms of Service and Privacy Policy.
              </p>
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
