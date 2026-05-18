import { Link } from "react-router";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
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
} from "lucide-react";

const serviceCards = [
  {
    title: "Jobs & Gigs",
    description: "Find part-time opportunities around campus and apply instantly.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Food Delivery",
    description: "Order from nearby shops and track riders in real time.",
    icon: ShoppingBag,
  },
  {
    title: "Accommodation",
    description: "Explore student-friendly places to stay near your faculty.",
    icon: Hotel,
  },
  {
    title: "Gift Shops",
    description: "Send gifts to friends and celebrate moments on campus.",
    icon: Gift,
  },
];

const platformStats = [
  { label: "Active Students", value: "10k+" },
  { label: "Campus Zones", value: "32" },
  { label: "Monthly Orders", value: "48k" },
  { label: "Jobs Posted", value: "5.2k" },
];

const stars = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 59) % 100}%`,
  duration: 2 + (index % 5),
  delay: (index % 6) * 0.4,
}));

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 280]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060b] text-white">
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-500"
        style={{ scaleX: smoothProgress }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(150,80,255,0.35),rgba(8,8,12,0.9)_45%)]" />
        <motion.div
          className="absolute left-1/2 top-14 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-violet-500/35 blur-[120px]"
          style={{ y: orbY }}
        />
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/60"
            style={{ left: star.left, top: star.top }}
            animate={{ opacity: [0.2, 0.85, 0.2], scale: [1, 1.9, 1] }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_28px_rgba(160,91,255,0.55)]">
              <span className="text-xl">🎓</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight">
              Near<span className="text-violet-300">U</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-white/80 md:flex">
            <a href="#home" className="transition hover:text-white">Home</a>
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>

          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03]"
          >
            Book a call
          </Link>
        </nav>
      </header>

      <main>
        <motion.section
          id="home"
          className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:px-10"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-black/35 px-4 py-2 text-sm text-violet-200"
          >
            <Sparkles className="h-4 w-4" />
            <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">New</span>
            Campus automation platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-7xl"
          >
            Intelligent Campus Services for
            <span className="bg-gradient-to-r from-violet-200 to-fuchsia-300 bg-clip-text text-transparent"> Modern Students.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-slate-300 md:text-xl"
          >
            NearU brings jobs, food delivery, accommodation, and gifts into one smooth platform built for university life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 text-base font-semibold text-white transition hover:scale-[1.03]"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#services"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base text-white/90 transition hover:border-white/40 hover:bg-white/10"
            >
              View services
            </a>
          </motion.div>
        </motion.section>

        <section id="about" className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl md:p-10"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-violet-200/85">Platform Pulse</p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Every scroll reveals how NearU keeps your campus life moving.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-black/35 p-5"
                >
                  <p className="text-3xl font-semibold text-violet-200">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-violet-200/85">What you get</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">A living ecosystem built for students</h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-violet-400/15 p-2.5 text-violet-200 transition group-hover:bg-violet-400/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm text-violet-200">
                    Explore
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 pb-28 md:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
            className="rounded-3xl border border-violet-300/25 bg-gradient-to-r from-violet-600/35 to-fuchsia-600/25 p-9 text-center backdrop-blur-xl md:p-12"
          >
            <h2 className="text-3xl font-semibold md:text-5xl">Make your first move with NearU</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">
              Whether you are finding work, ordering food, or searching for a place to stay, NearU keeps everything one tap away.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
              >
                Use for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/40 px-6 py-3 text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden flex-col gap-3 lg:flex">
        <Link
          to="/register"
          className="pointer-events-auto rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-[0_8px_30px_rgba(128,90,255,0.35)]"
        >
          Use For Free
        </Link>
        <Link
          to="/login"
          className="pointer-events-auto rounded-xl border border-white/20 bg-black/55 px-6 py-3 text-white/90 backdrop-blur-md"
        >
          Existing Account
        </Link>
        <span className="rounded-xl bg-white px-5 py-2.5 text-center font-medium text-black">
          Made in NearU
        </span>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#05060b] to-transparent" />
      <div className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 text-xs text-white/80 xl:flex">
        <div className="flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1.5">
          <Users className="h-3.5 w-3.5 text-violet-200" />
          Community-led
        </div>
        <div className="flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1.5">
          <MapPin className="h-3.5 w-3.5 text-violet-200" />
          Campus-first
        </div>
        <div className="flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1.5">
          <Bike className="h-3.5 w-3.5 text-violet-200" />
          Fast local flow
        </div>
        <div className="flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1.5">
          <Star className="h-3.5 w-3.5 text-violet-200" />
          Trusted experience
        </div>
      </div>
    </div>
  );
}
