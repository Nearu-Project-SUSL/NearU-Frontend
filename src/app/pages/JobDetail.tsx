import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, MapPin, Users, Phone, Mail, Share2, 
  CheckCircle2, Calendar, DollarSign, Clock, 
  Briefcase, MessageCircle, Shield, Building2, GraduationCap
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';
import jobDetailImage from 'figma:asset/118505676d6f74a8cfee4cd2ea4276f52b6cd2a2.png';

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  fullAddress: string;
  salary: number;
  salaryPeriod: string;
  workers: number;
  availableFor: string;
  jobType: string;
  description: string;
  postedDate: string;
  duration: string;
  phone: string;
  email: string;
  category: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  companyDescription: string;
  contactPerson: string;
}

const mockJobDetails: Record<string, JobDetail> = {
  '1': {
    id: '1',
    title: 'Food Service Worker',
    company: 'Belihul Oya Resort',
    location: 'Belihuloya, Galagama',
    fullAddress: 'Belihul Oya Restaurant, Galagama Road, Belihuloya',
    salary: 3000,
    salaryPeriod: 'per day',
    workers: 3,
    availableFor: 'Boys',
    jobType: 'Part-Time',
    description: 'We are looking for energetic and friendly food service workers to join our team at Belihul Oya Resort. This is a great opportunity for students to earn money during their holidays while gaining valuable hospitality experience. You will be responsible for serving food to guests during day and night shifts.',
    postedDate: '2025-12-17',
    duration: '3 days service',
    phone: '+94 77 123 4567',
    email: 'jobs@belihuloyaresort.lk',
    category: 'Hospitality',
    requirements: [
      'Students from Sabaragamuwa University',
      'Good communication skills',
      'Friendly and energetic personality',
      'Available for 3 consecutive days',
      'Previous experience is a plus but not required'
    ],
    responsibilities: [
      'Serve food and beverages to guests',
      'Maintain cleanliness in dining area',
      'Assist in food preparation when needed',
      'Handle customer inquiries professionally',
      'Work both day and night shifts'
    ],
    benefits: [
      'LKR 3,000 per day',
      'Free meals during shifts',
      'Transportation provided',
      'Friendly work environment',
      'Certificate of completion'
    ],
    companyDescription: 'Belihul Oya Resort is a popular tourist destination known for its scenic beauty and excellent hospitality. We pride ourselves on providing exceptional service to our guests.',
    contactPerson: 'Mr. Kumara Silva'
  }
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const job = mockJobDetails[id || '1'] || mockJobDetails['1'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job at ${job.company} on NearU`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 animate-gradient pointer-events-none"></div>
      
      {/* Animated pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        animation: 'gridMove 30s linear infinite'
      }}></div>

      {/* Floating orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Sidebar */}
      <Sidebar activeSection="jobs" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Job Details</h1>
                <p className="text-yellow-400/70 text-sm">Find your perfect opportunity</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              <Link to="/profile" className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all group-hover:scale-110 duration-300">
                  <img 
                    src={userAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Jobs</span>
            </button>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Image and Header */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl overflow-hidden">
                  <div className="relative h-80 overflow-hidden group">
                    <img
                      src={jobDetailImage}
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={handleShare}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110 active:scale-95"
                      >
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Job Type Badge */}
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold">
                      {job.jobType}
                    </div>

                    {/* Company Name at Bottom */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-black" />
                        </div>
                        <div>
                          <h1 className="text-3xl text-white font-bold">{job.title}</h1>
                          <p className="text-yellow-400 text-lg">{job.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8">
                  {/* Location and Basic Info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                      <span>{job.fullAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <span>Posted on: {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-700">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Users className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-2xl text-white font-bold">{job.workers}</div>
                      <div className="text-gray-400 text-sm">Positions</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Clock className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-sm text-white font-bold">{job.duration}</div>
                      <div className="text-gray-400 text-sm">Duration</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <GraduationCap className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-sm text-white font-bold">{job.availableFor}</div>
                      <div className="text-gray-400 text-sm">Available For</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Briefcase className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-sm text-white font-bold">{job.category}</div>
                      <div className="text-gray-400 text-sm">Category</div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl text-white font-semibold mb-4">Job Description</h2>
                    <p className="text-gray-300 leading-relaxed">{job.description}</p>
                  </div>

                  {/* About Company */}
                  <div className="mb-8">
                    <h2 className="text-2xl text-white font-semibold mb-4">About the Company</h2>
                    <p className="text-gray-300 leading-relaxed">{job.companyDescription}</p>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h2 className="text-2xl text-white font-semibold mb-4">Requirements</h2>
                    <div className="space-y-3">
                      {job.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-8">
                    <h2 className="text-2xl text-white font-semibold mb-4">Responsibilities</h2>
                    <div className="space-y-3">
                      {job.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h2 className="text-2xl text-white font-semibold mb-4">Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-yellow-400/10 text-yellow-400 px-4 py-3 rounded-xl border border-yellow-400/20"
                        >
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Application Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-6 sticky top-24">
                  {/* Salary */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl text-yellow-400 font-bold">
                        LKR {job.salary.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-lg mb-1">{job.salaryPeriod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive salary</span>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <h3 className="text-white font-semibold mb-3">Contact Person</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-lg">
                            {job.contactPerson.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{job.contactPerson}</div>
                          <div className="text-gray-400 text-sm">Hiring Manager</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>Apply Now</span>
                    </button>

                    <a
                      href={`tel:${job.phone}`}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Now</span>
                    </a>

                    <a
                      href={`mailto:${job.email}`}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </a>
                  </div>

                  {/* Verified Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-yellow-400 font-semibold text-sm mb-1">
                            Verified Employer
                          </div>
                          <div className="text-gray-400 text-xs">
                            This job posting has been verified by NearU team
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border-2 border-yellow-400/20 animate-scaleIn">
            <h3 className="text-2xl text-white font-bold mb-6">Apply for this Job</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Phone</label>
                <input
                  type="tel"
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Why are you interested?</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
                  placeholder="Tell us why you're interested in this position..."
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Application submitted! The employer will contact you soon.');
                  setShowApplyModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
