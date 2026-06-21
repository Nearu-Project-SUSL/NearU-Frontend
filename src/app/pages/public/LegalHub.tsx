import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Printer,
  ArrowLeft,
  Shield,
  FileText,
  Mail,
  Scale,
  MapPin,
  Clock,
  Eye,
  Info,
  ChevronRight,
  AlertTriangle,
  Lock,
  DollarSign
} from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  keywords: string[];
}

export default function LegalHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "terms" ? "terms" : "privacy";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const setTab = (tab: "privacy" | "terms") => {
    setSearchParams({ tab });
    setSearchQuery("");
  };

  // Modern Privacy Policy Sections (Relevant to NearU SUSL)
  const privacySections: LegalSection[] = useMemo(() => [
    {
      id: "privacy-intro",
      title: "1. Introduction & Scope",
      icon: <Info className="h-5 w-5 text-sky-400" />,
      keywords: ["introduction", "scope", "nearu", "sab", "susl", "welcome", "platform"],
      content: (
        <div className="space-y-4">
          <p>
            Welcome to <strong>NearU</strong>. This Privacy Policy describes how the NearU Student Developer Team of Sabaragamuwa University of Sri Lanka ("we", "us", or "our") collects, uses, processes, and shares your information when you use our web application and campus services.
          </p>
          <p>
            NearU is specifically engineered as a campus-life companion for the Sabaragamuwa University of Sri Lanka (SUSL) ecosystem. It facilitates the discovery and matching of local campus services, including transport pooling, student canteens/food vendor deliveries, custom gift listings, student boardings/hostel accommodations, and flexible departmental/campus Gigs.
          </p>
          <p>
            By accessing or using NearU, you consent to the collection and use of your information in accordance with this Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: "privacy-collection",
      title: "2. Information We Collect",
      icon: <FileText className="h-5 w-5 text-sky-400" />,
      keywords: ["collect", "data", "profile", "phone", "email", "student id", "faculty", "name", "vehicle", "license"],
      content: (
        <div className="space-y-4">
          <p>We collect information you provide directly to us when creating an account or posting listings. This includes:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>All Users (Profiles):</strong> Full name, university/personal email address, phone number, physical address, and profile photo.</li>
            <li><strong>Students:</strong> University Student ID number, enrolled Faculty (e.g., Computing, Engineering, Management), year of study, and date of birth.</li>
            <li><strong>Riders:</strong> Vehicle type (e.g., Tuk Tuk, Motorcycle, Car), vehicle registration plate number, driving license details, and administrative approval documents.</li>
            <li><strong>Business Owners & Landlords:</strong> Business listings, canteen menu items, pricing details, hostel/boarding room photographs, facilities description, and rates.</li>
          </ul>
        </div>
      )
    },
    {
      id: "privacy-location",
      title: "3. Precise Geolocation Data",
      icon: <MapPin className="h-5 w-5 text-sky-400" />,
      keywords: ["location", "gps", "tracking", "map", "rides", "rider", "deliveries", "real-time"],
      content: (
        <div className="space-y-4">
          <p>
            To deliver key campus services such as ride-sharing pools and canteen food deliveries, NearU requires access to your device's precise location services.
          </p>
          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 text-sm space-y-2">
            <p className="font-semibold text-sky-300">How Geolocation is Utilized:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Riders:</strong> Your real-time GPS coordinates are tracked in the background when your status is set to "Active" to display your location to students awaiting delivery or transport.</li>
              <li><strong>Students/Customers:</strong> Location details are accessed when requesting rides or pins for delivery coordinates on the Map View.</li>
            </ul>
          </div>
          <p>
            You can grant or revoke location permissions at any time through your device settings. However, disabling location services will prevent you from requesting rides, tracking deliveries, or acting as an active campus rider.
          </p>
        </div>
      )
    },
    {
      id: "privacy-use",
      title: "4. How We Use Your Data",
      icon: <Eye className="h-5 w-5 text-sky-400" />,
      keywords: ["use", "processing", "purpose", "matching", "security", "verification"],
      content: (
        <div className="space-y-4">
          <p>We process your personal information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Service Matching:</strong> Connecting student ride-poolers with campus riders, and buyers with canteen deliveries or gift shops.</li>
            <li><strong>Identity Verification:</strong> Ensuring only registered SUSL students access student-exclusive deals and verifying that riders hold valid licenses.</li>
            <li><strong>Listing Verification:</strong> Enabling admins to vet hostel accommodation posts and business listings before publishing.</li>
            <li><strong>Communication:</strong> Facilitating direct peer-to-peer contact (via phone calls or in-app triggers) to coordinate pick-ups.</li>
          </ul>
        </div>
      )
    },
    {
      id: "privacy-p2p",
      title: "5. P2P Payment Transparency",
      icon: <DollarSign className="h-5 w-5 text-sky-400" />,
      keywords: ["payment", "commission", "escrow", "fees", "bank", "cash", "credit card", "finance"],
      content: (
        <div className="space-y-4">
          <p>
            NearU operates strictly as an information directory and matchmaking board. All payments (e.g., transport fares, canteen order costs, room rental deposits) are settled <strong>peer-to-peer (P2P) directly</strong>.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm">
            <span className="font-bold text-amber-400 block mb-1">Payment Policy:</span>
            NearU does not collect, process, store, or transmit any banking credentials, credit card numbers, or online financial assets. We charge zero commission. Users are advised to settle payments using cash, direct bank transfer, or mutually agreed mobile wallet methods upon physical service delivery.
          </div>
        </div>
      )
    },
    {
      id: "privacy-sharing",
      title: "6. Information Sharing & Disclosure",
      icon: <Scale className="h-5 w-5 text-sky-400" />,
      keywords: ["sharing", "disclosure", "third party", "google", "leaflet", "partners"],
      content: (
        <div className="space-y-4">
          <p>
            We do not sell, rent, or trade your personal information. To fulfill matches, your details are shared only with the matching counterpart:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>When you request a ride, your name, phone number, and location are shown to the accepted Rider.</li>
            <li>When you order food, your delivery address/location pin and contact phone are shared with the vendor and rider.</li>
            <li><strong>Third-Party Integrations:</strong> We utilize Google OAuth for social sign-on, and Leaflet Maps API for map rendering. These partners collect metadata subject to their own policies.</li>
          </ul>
        </div>
      )
    },
    {
      id: "privacy-deletion",
      title: "7. Data Deletion & Rights",
      icon: <Lock className="h-5 w-5 text-sky-400" />,
      keywords: ["delete", "remove", "account", "rights", "request", "access", "erase"],
      content: (
        <div className="space-y-4">
          <p>
            We respect your rights regarding your data. At any time, you can request access to the information we hold about you or request its total deletion.
          </p>
          <p>
            To request account termination and permanent erasure of all associated profile data, listings, and ride histories from our PostgreSQL database, please contact our support team at <a href="mailto:admin@nearusab.me" className="text-sky-400 hover:underline">admin@nearusab.me</a>. Requests are processed within five (5) business days.
          </p>
        </div>
      )
    },
    {
      id: "privacy-contact",
      title: "8. Policy Updates & Contact",
      icon: <Mail className="h-5 w-5 text-sky-400" />,
      keywords: ["contact", "support", "email", "inquiry", "updates", "changes"],
      content: (
        <div className="space-y-4">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date.
          </p>
          <p className="mt-4">
            For questions, legal issues, or privacy inquiries, please contact:
          </p>
          <div className="mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-sm space-y-1">
            <p className="text-white">NearU Student Developer Team</p>
            <p>Sabaragamuwa University of Sri Lanka (SUSL)</p>
            <p>Pambahinna, Sri Lanka</p>
            <p>Email: <a href="mailto:admin@nearusab.me" className="text-[#2E9EBF] hover:underline">admin@nearusab.me</a></p>
          </div>
        </div>
      )
    }
  ], []);

  // Modern Terms & Conditions Sections (Relevant to NearU SUSL)
  const termsSections: LegalSection[] = useMemo(() => [
    {
      id: "terms-acceptance",
      title: "1. Acceptance of Terms",
      icon: <Scale className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["agreement", "acceptance", "terms", "conditions", "agree", "susl", "students"],
      content: (
        <div className="space-y-4">
          <p>
            By creating an account, logging in, or using the NearU platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately cease using the platform.
          </p>
          <p>
            These Terms govern your access to transport pools, local canteen delivery matching, gift shops, hostels/boarding discovery boards, and gig boards.
          </p>
        </div>
      )
    },
    {
      id: "terms-eligibility",
      title: "2. Eligibility & Roles",
      icon: <Shield className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["eligibility", "student", "rider", "business", "roles", "verification", "id"],
      content: (
        <div className="space-y-4">
          <p>NearU supports four primary roles, each subject to specific requirements:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Students:</strong> Must be actively enrolled at Sabaragamuwa University of Sri Lanka. Accounts require valid Student ID details.</li>
            <li><strong>Riders:</strong> Must possess a valid Sri Lankan driving license, up-to-date vehicle registration/insurance, and receive administrative clearance from NearU.</li>
            <li><strong>Business Owners:</strong> Must operate legitimate shops or canteens servicing the university area, subject to campus admin verification.</li>
            <li><strong>Gigs/Job Posters:</strong> Are solely responsible for providing true employment scopes and processing agreed payouts.</li>
          </ul>
        </div>
      )
    },
    {
      id: "terms-p2p",
      title: "3. Direct P2P Transactions Disclaimer",
      icon: <DollarSign className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["payment", "peer to peer", "disclaimer", "direct", "cash", "bank", "fees", "commission", "liability"],
      content: (
        <div className="space-y-4">
          <p>
            NearU operates solely as a matching portal and information directory. <strong>We do not act as an escrow agent, broker, or financial mediator.</strong>
          </p>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm space-y-2 text-slate-200">
            <p className="font-bold text-amber-400">Important Transaction Notice:</p>
            <p>
              Users negotiate and execute all financial settlements directly (e.g. paying cash directly to riders, sending bank transfers to canteen vendors, or depositing rent directly to landlords).
            </p>
            <p>
              NearU is not a party to any contract between users and is entirely free of liability regarding transaction failures, missing payments, or payment disputes.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "terms-responsibilities",
      title: "4. User Listing Responsibilities",
      icon: <AlertTriangle className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["responsibility", "listings", "hostel", "boarding", "food", "fake", "spam", "reviews"],
      content: (
        <div className="space-y-4">
          <p>Users must ensure all published listings and communications comply with community standards:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Landlords:</strong> Boarding rooms and hostels listed must be accurate in location, rent, facilities description, and photographs. Bait-and-switch listings are strictly banned.</li>
            <li><strong>Vendors:</strong> Food listings must represent actual available stock and adhere to local health and sanitation regulations.</li>
            <li><strong>Riders:</strong> Ride schedules and availability must be kept up to date. Misleading ride listings or frequent last-minute cancellations may result in account termination.</li>
          </ul>
        </div>
      )
    },
    {
      id: "terms-liability",
      title: "5. Limitation of Liability",
      icon: <Scale className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["liability", "accident", "safety", "damage", "indemnity", "disclaimer", "quality"],
      content: (
        <div className="space-y-4">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE NEARU DEVELOPER TEAM AND SABARAGAMUWA UNIVERSITY OF SRI LANKA SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING OUT OF YOUR USE OF THE SERVICES.
          </p>
          <p>This includes, but is not limited to:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Physical accidents, injuries, or transit delays arising during shared rides arranged via the platform.</li>
            <li>Food safety issues, illnesses, or quality deficits regarding canteen orders.</li>
            <li>Landlord-tenant disputes, deposits retention issues, or boarding accommodation conditions.</li>
            <li>Loss of income or disputes regarding Gigs listed on the platform.</li>
          </ul>
          <p>
            All matches and engagements are taken at your own discretion and risk.
          </p>
        </div>
      )
    },
    {
      id: "terms-termination",
      title: "6. Suspension & Termination",
      icon: <Lock className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["termination", "suspension", "ban", "delete account", "block", "rules"],
      content: (
        <div className="space-y-4">
          <p>
            We reserve the right, without notice and at our sole discretion, to suspend or terminate your account and block your access to NearU if we determine that you have violated these Terms.
          </p>
          <p>
            Reasons for suspension include, but are not limited to, posting fraudulent listings, operating vehicles without valid licenses (for Riders), harassing other campus community members, or submitting fake feedback reviews.
          </p>
        </div>
      )
    },
    {
      id: "terms-governing",
      title: "7. Governing Law & Dispute Resolution",
      icon: <Clock className="h-5 w-5 text-[#2E9EBF]" />,
      keywords: ["governing law", "jurisdiction", "dispute", "court", "sri lanka", "sabaragamuwa"],
      content: (
        <div className="space-y-4">
          <p>
            These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.
          </p>
          <p>
            Any disputes arising out of or related to these Terms, or your use of the NearU platform, shall be subject to the exclusive jurisdiction of the competent courts of Balangoda or Ratnapura in the Sabaragamuwa Province, Sri Lanka.
          </p>
        </div>
      )
    }
  ], []);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    const activeSectionsList = activeTab === "privacy" ? privacySections : termsSections;
    if (!searchQuery.trim()) return activeSectionsList;
    const query = searchQuery.toLowerCase().trim();
    return activeSectionsList.filter(section =>
      section.title.toLowerCase().includes(query) ||
      section.keywords.some(kw => kw.includes(query))
    );
  }, [activeTab, searchQuery, privacySections, termsSections]);

  // Set up active section observer for sticky TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    const activeList = activeTab === "privacy" ? privacySections : termsSections;
    activeList.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeTab, privacySections, termsSections, filteredSections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Adjust for header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-[#030307] text-white overflow-x-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#2E9EBF]/5 blur-[120px]" />
        <div className="absolute right-[10%] bottom-[15%] h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-[100px]" />
      </div>

      {/* Embedded Print Styling */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, aside, button, input, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-container {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }
          .section-card {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin-bottom: 2rem !important;
            page-break-inside: avoid;
            color: black !important;
          }
          p, ul, li {
            color: #333 !important;
          }
          h1, h2, h3, strong {
            color: black !important;
          }
        }
      `}</style>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-2xl no-print">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white border border-white/10 rounded-lg px-3 py-2 bg-white/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/NearU Logo.svg"
              alt="NearU Logo"
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-black tracking-tight text-white">
              Near<span className="bg-gradient-to-r from-sky-400 to-[#2E9EBF] bg-clip-text text-transparent">U</span>
            </span>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 relative z-10">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 no-print">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#2E9EBF]/20 bg-[#2E9EBF]/5 px-3 py-1.5 text-xs font-semibold text-sky-200 mb-6"
          >
            <Shield className="h-4 w-4 text-[#2E9EBF]" />
            <span className="font-mono uppercase tracking-wider font-bold">NearU Legal Center</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-black md:text-5xl leading-tight text-white mb-6"
          >
            Trust & Transparency
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            We build tools to make student life at Sabaragamuwa University simpler and safer. 
            Review our documentation to understand how we protect your data and the rules that keep our community reliable.
          </motion.p>
        </div>

        {/* Legal Document Navigation & Controls */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 backdrop-blur-md no-print">
          {/* Document Tabs Switch */}
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setTab("privacy")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "privacy"
                  ? "bg-gradient-to-r from-[#2E9EBF] to-sky-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="h-4 w-4" />
              Privacy Policy
            </button>
            <button
              onClick={() => setTab("terms")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "terms"
                  ? "bg-gradient-to-r from-[#2E9EBF] to-sky-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              Terms of Service
            </button>
          </div>

          {/* Search bar & Print actions */}
          <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2E9EBF]/50 focus:ring-1 focus:ring-[#2E9EBF]/30 transition-all"
              />
            </div>
            <button
              onClick={handlePrint}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              title="Print / Save PDF"
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar TOC + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table of Contents - Sticky (Desktop only) */}
          <aside className="lg:col-span-3 sticky top-28 hidden lg:block no-print bg-white/[0.01] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-wider font-mono font-bold text-[#2E9EBF] mb-4">Table of Contents</p>
            <div className="flex flex-col gap-1.5">
              {(activeTab === "privacy" ? privacySections : termsSections).map((section) => {
                const isFilteredOut = searchQuery.trim() !== "" && !filteredSections.some(s => s.id === section.id);
                return (
                  <button
                    key={section.id}
                    disabled={isFilteredOut}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between group ${
                      activeSection === section.id
                        ? "bg-[#2E9EBF]/10 text-[#2E9EBF] font-semibold border-l-2 border-[#2E9EBF] pl-2.5"
                        : isFilteredOut
                          ? "opacity-30 cursor-not-allowed"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="truncate">{section.title}</span>
                    <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                      activeSection === section.id ? "opacity-100 text-[#2E9EBF]" : "text-slate-500"
                    }`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Core Content Area */}
          <div className="lg:col-span-9 space-y-6 print-container">
            {/* Header info for printed document */}
            <div className="hidden print:block mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-tight">
                {activeTab === "privacy" ? "NearU Privacy Policy" : "NearU Terms and Conditions"}
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Governing Entity: NearU Student Developer Team of Sabaragamuwa University of Sri Lanka (SUSL)
              </p>
              <p className="text-sm text-slate-500">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <hr className="my-4 border-slate-300" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (searchQuery ? "-search" : "")}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                    <div
                      key={section.id}
                      id={section.id}
                      ref={(el) => { sectionsRef.current[section.id] = el; }}
                      className="section-card group p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                        <span className="p-2 rounded-xl bg-white/5 text-[#2E9EBF] group-hover:scale-110 transition-transform">
                          {section.icon}
                        </span>
                        <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-[#2E9EBF] transition-colors">
                          {section.title}
                        </h2>
                      </div>
                      <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-normal">
                        {section.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl backdrop-blur-sm no-print">
                    <AlertTriangle className="h-10 w-10 text-amber-500/80 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-lg font-bold text-white mb-2">No clauses found</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                      No legal clauses match your keyword "{searchQuery}". Try searching for something else or clear the search.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-xs font-bold text-[#2E9EBF] hover:underline"
                    >
                      Clear Search Query
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom info banner */}
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-xs text-slate-500 mt-10 no-print">
              <p>Last Updated: June 20, 2026</p>
              <p className="mt-1">
                NearU legal documents are subject to change. Accessing the platform constitutes approval of active policies.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Global Simple Footer */}
      <footer className="border-t border-white/5 bg-black/60 py-8 mt-20 no-print">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-600 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} NearU Platform. Created for active university ecosystems.</p>
          <div className="flex gap-4">
            <Link to="/home" className="hover:text-white transition">Dashboard</Link>
            <Link to="/" className="hover:text-white transition">Landing Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
