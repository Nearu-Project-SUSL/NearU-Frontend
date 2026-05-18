import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Bike,
  BriefcaseBusiness,
  Gift,
  Hotel,
  MapPin,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  ChevronDown,
  Check,
  Search,
  MessageSquare,
  Share2,
  DollarSign,
  Award,
} from "lucide-react";

// Canvas Particle Starfield for resource-heavy premium background
function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const starsCount = 160;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      alphaSpeed: number;
      color: string;
    }> = [];

    const starColors = [
      "rgba(255, 255, 255, ",
      "rgba(46, 158, 191, ", // NearU Cyan tint
      "rgba(56, 189, 248, ", // Sky Blue tint
      "rgba(110, 231, 183, ", // Emerald tint
    ];

    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.08,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.015 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let scrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = currentScroll - scrollY;
      scrollY = currentScroll;

      stars.forEach((s) => {
        s.y -= diff * 0.15;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
      });
    };

    window.addEventListener("scroll", handleScroll);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        star.alpha += star.alphaSpeed;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let glowSize = star.size;

        if (dist < 200) {
          const force = (200 - dist) / 200;
          star.x += (dx / dist) * force * 0.5;
          star.y += (dy / dist) * force * 0.5;
          glowSize = star.size * (1 + force * 2.2);
        }

        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 1.5 && dist < 180) {
          ctx.fillStyle = `rgba(46, 158, 191, ${star.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" />;
}

// Spotlight cursor highlight effect
function CursorSpotlight() {
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,158,191,0.12)_0%,rgba(56,189,248,0.04)_40%,transparent_70%)] blur-[50px]"
      style={{
        left: mousePos.x,
        top: mousePos.y,
      }}
    />
  );
}

// 3D Perspective dashboard mockup
function AppDashboardPreview() {
  return (
    <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_80px_-15px_rgba(46,158,191,0.4)] backdrop-blur-3xl">
      <div className="absolute -inset-[1px] -z-10 rounded-2xl bg-gradient-to-r from-[#2E9EBF] via-[#0ea5e9] to-[#10b981] opacity-35 blur-sm" />
      
      {/* Tab bar header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs text-white/40 tracking-wider font-mono">nearu.app/home</span>
        </div>
        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1 text-xs text-white/60">
          <MapPin className="h-3.5 w-3.5 text-[#2E9EBF]" />
          <span>Sabaragamuwa Faculty Zone</span>
        </div>
      </div>

      {/* Mock dashboard contents */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="md:col-span-2 rounded-xl bg-black/45 border border-white/5 p-4 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(46,158,191,0.08),transparent_60%)]" />
          
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 30 50 C 150 120 220 30 380 180" fill="none" stroke="rgba(46,158,191,0.55)" strokeWidth="2.5" />
              <path d="M 120 180 Q 250 80 440 100" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeDasharray="3,3" />
            </svg>
          </div>

          <div className="relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#2E9EBF] font-bold font-mono">Live Transit & Delivery Map</span>
                <h4 className="text-lg font-bold mt-0.5 text-white">Campus Live Radar</h4>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                24 Active Riders
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] text-white/70 flex items-center gap-1">
                <Bike className="h-3 w-3 text-emerald-400" />
                <span>3 Foods delivering</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] text-white/70 flex items-center gap-1">
                <Users className="h-3 w-3 text-[#2E9EBF]" />
                <span>2 Shared rides moving</span>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/5 pt-3 flex justify-between items-center mt-4">
            <div className="flex -space-x-1.5">
              <div className="h-6 w-6 rounded-full border border-slate-950 bg-[#2E9EBF] flex items-center justify-center text-[8px] font-bold">K</div>
              <div className="h-6 w-6 rounded-full border border-slate-950 bg-sky-500 flex items-center justify-center text-[8px] font-bold">N</div>
              <div className="h-6 w-6 rounded-full border border-slate-950 bg-emerald-600 flex items-center justify-center text-[8px] font-bold">M</div>
            </div>
            <p className="text-[11px] text-slate-400">
              <span className="font-semibold text-white">52 new students</span> joined NearU today.
            </p>
          </div>
        </div>

        {/* Floating Sidebar status info */}
        <div className="rounded-xl bg-black/45 border border-white/5 p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-mono">My Active Wallet</span>
            <div className="flex items-baseline justify-between mt-1">
              <h4 className="text-xl font-bold text-white">$48.50</h4>
              <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-mono">+$18.00 today</span>
            </div>
          </div>

          <div className="my-3 border-t border-b border-white/5 py-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Hostel rent due</span>
              <span className="text-rose-400">in 4 days</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Canteen delivery status</span>
              <span className="text-[#2E9EBF] animate-pulse">Out for delivery</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-[#2E9EBF] to-sky-500 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <span>Open dashboard</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Bento Grid Component containing live visual updates
function BentoServices() {
  // Food Delivery order progress simulation
  const [foodProgress, setFoodProgress] = useState(25);
  useEffect(() => {
    const timer = setInterval(() => {
      setFoodProgress((prev) => (prev >= 100 ? 10 : prev + 15));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Selected Card gift order customization
  const [giftTemplate, setGiftTemplate] = useState("bouquets");

  // Direct Application count ticker
  const [jobsCount, setJobsCount] = useState(14);
  useEffect(() => {
    const timer = setInterval(() => {
      setJobsCount((prev) => (prev > 18 ? 14 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Jobs & Gigs (2-Columns on Mobile, 1 on Large) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[#2E9EBF]/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        
        <div className="mb-4 inline-flex rounded-xl bg-[#2E9EBF]/10 p-3 text-[#2E9EBF] group-hover:scale-110 transition-transform">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>
        
        <h3 className="text-xl font-bold text-white">Jobs & Gigs</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Find student-friendly roles posted directly by faculties or campus cafes. Earn money that fits your schedule.
        </p>

        {/* Live jobs ticker widget */}
        <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#2E9EBF] font-bold">Recent Opportunities</span>
            <span className="text-emerald-400 animate-pulse">{jobsCount} Live Posts</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-white/80">📚 Lab Assistant</span>
              <span className="text-[#2E9EBF] font-bold">$15.00/hr</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-white/80">💻 Web Design Help</span>
              <span className="text-sky-300 font-bold">$22.50/hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">☕ Cafe Barista</span>
              <span className="text-emerald-300 font-bold">$11.80/hr</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Food Delivery Live order tracking */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[#2E9EBF]/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        
        <div className="mb-4 inline-flex rounded-xl bg-[#2E9EBF]/10 p-3 text-[#2E9EBF] group-hover:scale-110 transition-transform">
          <ShoppingBag className="h-6 w-6" />
        </div>
        
        <h3 className="text-xl font-bold text-white">Food Delivery</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Order from surrounding food zones, track student riders live, and bypass cafeteria queues with ease.
        </p>

        {/* Live food progress tracker widget */}
        <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 text-left font-mono">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase tracking-widest text-[#2E9EBF] font-bold">Pizza Order Tracker</span>
            <span className="text-[10px] text-white/50">{foodProgress}% complete</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2E9EBF] to-sky-400 rounded-full"
              style={{ width: `${foodProgress}%` }}
              transition={{ ease: "easeInOut", duration: 0.6 }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/80">
            <span className={foodProgress >= 25 ? "text-[#2E9EBF] font-bold" : "text-white/40"}>Kitchen</span>
            <span className={foodProgress >= 50 ? "text-sky-400 font-bold" : "text-white/40"}>Transit</span>
            <span className={foodProgress >= 80 ? "text-emerald-400 font-bold" : "text-white/40"}>Arrived</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Accommodation with reviews */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: 0.2 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        
        <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400 group-hover:scale-110 transition-transform">
          <Hotel className="h-6 w-6" />
        </div>
        
        <h3 className="text-xl font-bold text-white">Accommodation</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Discover student-vetted boarding houses, hostels, and single rooms close to campus faculties with clean maps.
        </p>

        {/* Accommodation review widget */}
        <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-white">Oak Crest Boarding</p>
              <p className="text-[10px] text-slate-400 font-mono">180m to Engineering Block</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 font-mono">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="text-[9px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded font-mono">Verified Room</span>
            <span className="text-[9px] bg-sky-400/10 text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded font-mono">AC available</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Gift Customizer Flow (2-Cols wide on Large screens) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl md:col-span-2 text-left"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="mb-4 inline-flex rounded-xl bg-sky-500/10 p-3 text-sky-400 group-hover:scale-110 transition-transform">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Gift Shops</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Celebrate your university friends. Choose from custom bouquets, chocolate hampers, or congratulations cards and get them delivered straight to their hands.
            </p>
          </div>

          {/* Interactive ribbon selectors */}
          <div className="flex-1 w-full rounded-xl border border-white/5 bg-black/45 p-4 font-mono">
            <p className="text-[9px] uppercase tracking-widest text-sky-400 font-bold mb-3">Custom Gift Selection</p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setGiftTemplate("bouquets")}
                className={`flex-1 rounded py-1 px-1.5 text-[10px] text-center transition ${giftTemplate === "bouquets" ? "bg-[#2E9EBF] text-white font-bold" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                🌹 Bouquet
              </button>
              <button
                onClick={() => setGiftTemplate("chocolates")}
                className={`flex-1 rounded py-1 px-1.5 text-[10px] text-center transition ${giftTemplate === "chocolates" ? "bg-[#2E9EBF] text-white font-bold" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                🍫 Chocolate
              </button>
              <button
                onClick={() => setGiftTemplate("letters")}
                className={`flex-1 rounded py-1 px-1.5 text-[10px] text-center transition ${giftTemplate === "letters" ? "bg-[#2E9EBF] text-white font-bold" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                ✉️ Greeting
              </button>
            </div>
            
            <div className="rounded bg-white/5 p-2 text-[10px] text-white/80 border border-white/5">
              {giftTemplate === "bouquets" && <p>Premium Red Roses Combo • <span className="text-[#2E9EBF] font-bold">$18.90</span></p>}
              {giftTemplate === "chocolates" && <p>Dark Hazelnut Truffles Box • <span className="text-[#2E9EBF] font-bold">$14.50</span></p>}
              {giftTemplate === "letters" && <p>Custom Congratulatory Scroll • <span className="text-[#2E9EBF] font-bold">$4.90</span></p>}
              <div className="mt-2 flex justify-between items-center text-[8px] text-white/40 border-t border-white/5 pt-1.5">
                <span>Receiver: Sarah (Bio Faculty)</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to wrap
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. NearU Rides shared fare split */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        whileHover={{ y: -6 }}
        className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[#2E9EBF]/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        
        <div className="mb-4 inline-flex rounded-xl bg-[#2E9EBF]/10 p-3 text-[#2E9EBF] group-hover:scale-110 transition-transform">
          <Bike className="h-6 w-6" />
        </div>
        
        <h3 className="text-xl font-bold text-white">NearU Rides</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Request shared campus transit or split transport taxi costs cleanly with fellow university students going your way.
        </p>

        {/* Fare split visual */}
        <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 text-left font-mono">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase tracking-widest text-[#2E9EBF] font-bold">Fare Split (Campus Gate)</span>
            <span className="text-[10px] text-emerald-400 font-bold">Split active</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
            <span className="text-[10px] text-white/70">Total transit fare</span>
            <span className="text-xs text-white/90">$4.50</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-300">Your Split (3 riders)</span>
            <span className="text-xs text-emerald-400 font-bold">$1.50 each</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Our Process Active Visuals
const processSteps = [
  {
    step: "Step 01",
    title: "Browse & Search",
    desc: "Scan for student boarding rooms, campus part-time jobs, local canteen foods, or active campus ride coordinates instantly.",
    color: "from-[#2E9EBF] to-sky-600",
    glow: "rgba(46,158,191,0.25)"
  },
  {
    step: "Step 02",
    title: "Direct Connect",
    desc: "Communicate directly with cafeteria managers, boarding room hosts, or student drivers via our clean instant chat interface.",
    color: "from-sky-500 to-[#2E9EBF]",
    glow: "rgba(46,158,191,0.25)"
  },
  {
    step: "Step 03",
    title: "Pool & Split",
    desc: "Split taxi charges with peers traveling along your route or consolidate dining orders to bypass shipping fees entirely.",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.25)"
  },
  {
    step: "Step 04",
    title: "Secure Payouts",
    desc: "Receive fast payouts for gigs completed. Purchases are held safely in escrow until you confirm delivery.",
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.25)"
  }
];

function InteractiveProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-switch steps every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === processSteps.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Steps text on left */}
      <div className="flex flex-col gap-6 text-left">
        {processSteps.map((item, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(idx)}
              className={`cursor-pointer rounded-2xl border p-6 transition-all duration-350 ${isActive ? "border-white/15 bg-white/[0.04] shadow-lg" : "border-transparent hover:bg-white/[0.02]"}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-widest font-mono font-bold ${isActive ? "text-[#2E9EBF]" : "text-white/40"}`}>
                  {item.step}
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E9EBF] animate-pulse" />
                )}
              </div>
              <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Visual dashboard screen mockup on right */}
      <div className="relative h-[340px] rounded-2xl border border-white/10 bg-slate-950/80 p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_80px_rgba(46,158,191,0.18)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        
        {/* Dynamic Glowing background that shifts color matching the active step */}
        <div
          className={`absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] -z-10 transition-all duration-700`}
          style={{
            background: `radial-gradient(circle, ${processSteps[activeStep].glow} 0%, transparent 70%)`
          }}
        />

        {/* Visual panels depending on step */}
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="step-search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col justify-center gap-4 text-left font-mono"
            >
              <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-slate-300">
                <Search className="h-4 w-4 text-[#2E9EBF]" />
                <span className="border-r border-[#2E9EBF] animate-pulse pr-1 font-semibold text-white">boarding near main faculty...</span>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="rounded bg-white/5 border border-white/5 p-2 text-[10px] text-white flex items-center justify-between">
                  <span>🏡 Greenwood Rooms (Single)</span>
                  <span className="text-[#2E9EBF] font-bold">$75/mo</span>
                </div>
                <div className="rounded bg-white/5 border border-white/5 p-2 text-[10px] text-white flex items-center justify-between">
                  <span>🏡 Greenways Hostel (Shared)</span>
                  <span className="text-[#2E9EBF] font-bold">$40/mo</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              key="step-chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col justify-center gap-3 text-left font-mono"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-[10px] text-slate-400">
                <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                <span>Chatting with: Landlord Dave</span>
              </div>
              <div className="flex flex-col gap-2 text-[10px]">
                <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 max-w-[85%]">
                  <p className="text-slate-400 text-[8px] mb-0.5">Thimira • 12:44 PM</p>
                  <p className="text-white">Hello, is the single room near Engineering Block still open for viewings?</p>
                </div>
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-2.5 max-w-[85%] self-end">
                  <p className="text-sky-300 text-[8px] mb-0.5">Dave • 12:45 PM</p>
                  <p className="text-white">Yes, you can drop by tomorrow at 4 PM to check it out! 👍</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step-split"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col justify-center gap-3 text-left font-mono"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-[10px] text-slate-400">
                <Share2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Active Fare Splitter</span>
              </div>
              <div className="bg-black/35 rounded-lg border border-white/5 p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Main Gate to Hostel taxi</span>
                  <span className="text-white font-bold">$4.50</span>
                </div>
                <div className="flex -space-x-1.5 my-1">
                  <div className="h-6 w-6 rounded-full border border-slate-900 bg-amber-500 flex items-center justify-center text-[8px] font-bold">Y</div>
                  <div className="h-6 w-6 rounded-full border border-slate-900 bg-[#2E9EBF] flex items-center justify-center text-[8px] font-bold">K</div>
                  <div className="h-6 w-6 rounded-full border border-slate-900 bg-sky-500 flex items-center justify-center text-[8px] font-bold">L</div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold border-t border-white/5 pt-2">
                  <span>Fare Split Successful</span>
                  <span>$1.50 / rider</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              key="step-pay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col items-center justify-center gap-3 font-mono"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Check className="h-6 w-6 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white">Escrow Payment Released</p>
                <p className="text-[10px] text-slate-400 mt-1">Canteen Rider received payout</p>
              </div>
              <span className="text-[9px] bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded font-bold">
                +$12.50 Paid Out
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-white/50">
          <span>Active Demonstration</span>
          <span className="font-bold text-[#2E9EBF]">{processSteps[activeStep].step}</span>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "How does NearU campus food delivery work?",
    a: "NearU is a student-first delivery network. You can place orders from trusted local canteens, shops, and stores. Other students acting as campus riders pick up your order and deliver it directly to your faculty, lecture hall, or hostel door, minimizing delay."
  },
  {
    q: "Are the listed boarding accommodations verified?",
    a: "Yes! Every boarding house, hostel, and room listed on NearU is reviewed and verified by campus admins and has verified reviews from actual students. You can browse high-res photos, distances to faculties, and rent rates transparently."
  },
  {
    q: "How can I earn money through campus Gigs?",
    a: "Departments, campus vendors, and professors list flexible micro-gigs directly on the NearU jobs dashboard. You can easily apply within the app, complete your work, and get paid securely with zero commission taken by NearU."
  },
  {
    q: "How does the NearU Ride sharing work?",
    a: "Need a quick ride to the station or town? Request a ride or join an existing student pool. Shared riders split the transit fares automatically, offering a safe, cheap, and social way to travel back and forth."
  },
  {
    q: "Is NearU secure for transactions?",
    a: "Absolutely. All transactions (gigs payouts, accommodation deposits, food purchases) are fully encrypted and verified via secure campus payment gateways. Funds are released safely once delivery is confirmed."
  }
];

function FAQAccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all hover:border-[#2E9EBF]/30 text-left"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold md:text-lg text-white"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-[#2E9EBF]"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Testimonials items list
const testimonials = [
  {
    quote: "NearU transformed my campus life! I order lunches straight to my lab during heavy semesters, saving an hour every single day.",
    author: "Kanishka Fernando",
    role: "Engineering Student",
  },
  {
    quote: "Finding verified housing was a massive headache until NearU. Listed hostels have verified reviews from seniors so you know exactly what you get.",
    author: "Sanduni Perera",
    role: "Biological Sciences Student",
  },
  {
    quote: "I found a part-time laboratory assistant gig right on campus within a few clicks. Direct payouts are super fast and commission-free.",
    author: "Thilina Bandara",
    role: "Faculty Assistant",
  },
  {
    quote: "Sharing taxi rides to the campus station on Fridays saves me 60% of transport costs. Plus, I met awesome classmates in the ride pools!",
    author: "Sarah Dias",
    role: "Management Student",
  }
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Dashboard mock parallax scroll
  const dashboardY = useTransform(scrollYProgress, [0, 0.4], [60, -30]);
  const dashboardScale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const dashboardRotation = useTransform(scrollYProgress, [0, 0.4], [15, 0]);

  // Visual header pill rotation
  const [badgeText, setBadgeText] = useState("Zero Fees for Students");
  useEffect(() => {
    const texts = ["Zero Fees for Students", "Verified Campus Boardings", "Real-Time Food Tracking"];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setBadgeText(texts[idx]);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030307] text-white">
      {/* 1. Heavy Starfield canvas */}
      <InteractiveStarfield />
      
      {/* 2. Soft Cursor spotlight tracking */}
      <CursorSpotlight />

      {/* Top Scroll tracker indicator */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-[#2E9EBF] via-sky-400 to-emerald-500"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating abstract glowing blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Blob 1 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(46,158,191,0.38),rgba(3,3,7,1)_60%)]" />
        
        {/* Blob 2 with scroll parallax */}
        <motion.div
          className="absolute left-[15%] top-1/4 h-[600px] w-[600px] rounded-full bg-[#2E9EBF]/10 blur-[130px]"
          style={{ y: orbY }}
        />
        {/* Blob 3 */}
        <div className="absolute right-[5%] bottom-1/4 h-[500px] w-[500px] rounded-full bg-sky-500/5 blur-[120px]" />
        {/* Blob 4 */}
        <div className="absolute left-[35%] bottom-1/10 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E9EBF] to-sky-500 shadow-[0_0_24px_rgba(46,158,191,0.65)] group-hover:scale-105 transition-transform">
              <span className="text-xl">🎓</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Near<span className="bg-gradient-to-r from-sky-400 to-[#2E9EBF] bg-clip-text text-transparent">U</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 font-semibold md:flex">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#process" className="hover:text-white transition-colors">How it works</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
          </div>

          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-5 py-2.5 text-xs font-bold text-white tracking-wide shadow-[0_0_20px_rgba(46,158,191,0.3)] hover:shadow-[0_0_25px_rgba(46,158,191,0.5)] transition hover:scale-[1.03]"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="relative z-20">
        {/* HERO SECTION */}
        <motion.section
          id="home"
          className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 pt-24 pb-16 text-center md:px-10"
          style={{ y: heroY }}
        >
          {/* Animated Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2E9EBF]/20 bg-[#2E9EBF]/5 px-4 py-2 text-xs font-semibold text-sky-200"
          >
            <Sparkles className="h-4 w-4 text-[#2E9EBF] animate-spin-slow" />
            <span className="rounded-full bg-[#2E9EBF]/25 px-2.5 py-0.5 text-[10px] text-sky-300 border border-[#2E9EBF]/30 uppercase tracking-widest font-mono font-bold">New</span>
            <span className="font-mono min-w-[170px] text-left">{badgeText}</span>
          </motion.div>

          {/* Glowing character text header */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-8xl text-white"
          >
            Intelligent Campus Companion for
            <span className="block mt-2 bg-gradient-to-r from-white via-sky-200 to-[#2E9EBF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(46,158,191,0.25)]"> Modern Students.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 max-w-2xl text-base text-slate-400 md:text-xl leading-relaxed"
          >
            NearU unites jobs, food delivery, rides, accommodation, and gift delivery into a single premium network tailored for university life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(46,158,191,0.35)] hover:shadow-[0_0_40px_rgba(46,158,191,0.55)] transition hover:scale-[1.03]"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#services"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-bold text-white/90 hover:border-white/30 hover:bg-white/[0.06] transition"
            >
              Explore services
            </a>
          </motion.div>

          {/* 3D Tilting dashboard display */}
          <motion.div
            style={{
              y: dashboardY,
              scale: dashboardScale,
              rotateX: dashboardRotation,
              transformStyle: "preserve-3d",
              perspective: 1200
            }}
            className="mt-20 w-full flex justify-center"
          >
            <AppDashboardPreview />
          </motion.div>
        </motion.section>

        {/* SERVICES BENTO SECTION */}
        <section id="services" className="mx-auto max-w-7xl px-6 py-28 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#2E9EBF] font-mono">Our Campus Services</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl text-white">
              A comprehensive student ecosystem
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 md:text-base leading-relaxed">
              Every tool is engineered to save time, secure housing, split transit, or help you secure extra income commission-free.
            </p>
          </motion.div>

          <BentoServices />
        </section>

        {/* PROCESS FLOW TIMELINE SECTION */}
        <section id="process" className="mx-auto max-w-7xl px-6 py-28 md:px-10 border-t border-white/[0.04]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-20 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#2E9EBF] font-mono">How it works</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl text-white">
              Your Campus, Streamlined
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 md:text-base leading-relaxed">
              Four steps from searching boardings or placing food orders to secure direct handovers.
            </p>
          </motion.div>

          <InteractiveProcessSection />
        </section>

        {/* REVIEWS & TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 border-t border-white/[0.04]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-emerald-400 font-mono">Student Pulse</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl text-white">
              Why students love NearU
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((test, index) => (
              <motion.div
                key={test.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-left backdrop-blur-md"
              >
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{test.quote}"
                </p>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <p className="text-xs font-bold text-white">{test.author}</p>
                  <p className="text-[10px] text-[#2E9EBF] font-mono mt-0.5">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section id="faqs" className="mx-auto max-w-4xl px-6 py-28 md:px-10 border-t border-white/[0.04]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#2E9EBF] font-mono">Help Center</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl text-white">
              Answers to your questions
            </h2>
          </motion.div>

          <div className="mt-8">
            {faqs.map((faq, index) => (
              <FAQAccordionItem key={faq.q} q={faq.q} a={faq.a} index={index} />
            ))}
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="mx-auto max-w-7xl px-6 pb-28 md:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-3xl border border-[#2E9EBF]/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-10 text-center backdrop-blur-2xl md:p-16 shadow-[0_0_80px_rgba(46,158,191,0.18)]"
          >
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(46,158,191,0.15),transparent_60%)]" />
            
            <h2 className="text-3xl font-extrabold md:text-5xl text-white">
              Ready to elevate campus life?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 md:text-base leading-relaxed">
              Join thousands of fellow students today. Order meals, share rides, find verified boarding rooms, and discover local earning opportunities.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.03] transition"
              >
                Sign up for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Login to my account
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Floating fixed widgets */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden flex-col gap-3 lg:flex">
        <Link
          to="/register"
          className="pointer-events-auto rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-6 py-3.5 text-xs font-bold text-white shadow-[0_8px_30px_rgba(46,158,191,0.4)] tracking-wide hover:scale-105 transition"
        >
          Sign Up Free
        </Link>
        <Link
          to="/login"
          className="pointer-events-auto rounded-xl border border-white/10 bg-black/75 px-6 py-3.5 text-xs font-semibold text-white/90 backdrop-blur-md hover:bg-black/90 transition"
        >
          Login Account
        </Link>
        <span className="rounded-xl bg-white px-5 py-2.5 text-center text-xs font-bold text-slate-950 flex items-center gap-1.5 shadow-lg">
          <Award className="h-4 w-4 text-[#2E9EBF]" />
          NearU Campus App
        </span>
      </div>

      <footer className="relative z-20 border-t border-white/5 bg-black/60 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-500 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} NearU Platform. Engineered for active university ecosystems.</p>
          <div className="flex gap-6 font-semibold">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#faqs" className="hover:text-white transition">FAQs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
