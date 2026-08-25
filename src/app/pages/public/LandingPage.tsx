import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";

// ─── Burst Particles Data (Glowing Electric Cyan Dust Motes) ────────────────────

const BURST_PARTICLES = Array.from({ length: 36 }).map((_, i) => {
  // Angle with organic jitter
  const baseAngle = (i / 36) * 2 * Math.PI;
  const angleJitter = ((i % 5) - 2) * 0.08;
  const angle = baseAngle + angleJitter;

  // Organic radial distance dispersion (80px - 250px)
  const radius = 90 + ((i * 17) % 160);

  // Upward buoyancy float drift (-15px to -50px)
  const driftY = -15 - ((i * 11) % 35);

  // Varying duration (1100ms - 1750ms) for lively asynchronous dispersion
  const dur = 1100 + ((i * 37) % 650);

  // Cyan dust color shades (electric cyan, sky cyan, ice cyan, translucent cyan)
  const colors = ["#38bdf8", "#7dd3fc", "#0ea5e9", "#67e8f9", "#38bdf8cc"];
  const color = colors[i % colors.length];

  // Tiny dust mote sizes
  const sizes = [
    "h-0.5 w-0.5 shadow-[0_0_4px_#38bdf8]",
    "h-1 w-1 shadow-[0_0_6px_#38bdf8]",
    "h-1.5 w-1.5 shadow-[0_0_8px_#38bdf8]",
    "h-1 w-1 blur-[0.5px] shadow-[0_0_5px_#7dd3fc]",
  ];

  return {
    id: i,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    driftY,
    dur,
    color,
    sizeClass: sizes[i % sizes.length],
  };
});

// ─── NearU Animated SVG Logo Component ───────────────────────────────────────

function NearUAnimatedSVG() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={svgRef}
      version="1.1"
      viewBox="0 0 1536 1536"
      className="h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 object-contain drop-shadow-[0_0_55px_rgba(46,158,191,0.65)]"
    >
      <defs>
        {/* Single NearU Electric Cyan Gradient */}
        <linearGradient id="logoGradSingle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2E9EBF" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <g>
        {/* Outer Path - Single Electric Cyan */}
        <path
          className="logo-path-coral"
          fill="url(#logoGradSingle)"
          stroke="#38bdf8"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 714.5,1268.3073 c -20.67295,-1.0125 -49.33903,-5.5744 -71,-11.2989 -92.44397,-24.4309 -171.22099,-88.6316 -214.43496,-174.7573 -16.41811,-32.7214 -27.12545,-67.1162 -32.76545,-105.2511 -1.53071,-10.34998 -1.73616,-26.85024 -2.05445,-165 -0.25449,-110.46033 -0.037,-155.71221 0.77576,-161.38981 4.71499,-32.93778 26.90879,-64.18744 56.70129,-79.83745 16.40251,-8.61624 30.98273,-12.15106 50.27781,-12.18933 14.2418,-0.0282 20.46924,0.92379 33.5,5.1214 39.30928,12.6627 68.19599,48.39949 73.39144,90.79519 0.75565,6.16614 1.10508,53.23972 1.10976,149.5 0.007,149.82867 -0.0428,148.12266 4.84204,165 5.47182,18.90547 15.34658,35.3017 30.11282,50 22.55851,22.4546 48.41864,33.3898 82.04394,34.693 36.88681,1.4297 65.97778,-8.8539 90.58141,-32.0201 12.27744,-11.5602 18.23591,-19.566 25.43367,-34.1729 11.7304,-23.80526 12.96573,-32.40683 12.99734,-90.5 0.0255,-46.94735 0.5639,-54.80993 5.08759,-74.30359 6.25084,-26.93634 21.86579,-57.90243 41.01517,-81.33737 7.50185,-9.18073 17.71148,-19.5175 45.22499,-45.78813 56.06753,-53.53478 95.22013,-103.54392 118.27473,-151.07091 18.2385,-37.59855 22.0639,-64.08094 14.3907,-99.62366 -8.1078,-37.55539 -31.4047,-71.28847 -64.5205,-93.42329 -25.91738,-17.32337 -52.96427,-25.5743 -83.9851,-25.62053 -54.50566,-0.0812 -103.87226,28.08773 -131.95179,75.29267 -16.85203,28.33022 -24.89095,69.01838 -19.13993,96.87481 6.00856,29.10392 22.5299,62.92116 48.51537,99.30527 18.48851,25.88709 39.27236,50.66038 62.45748,74.44618 l 12.9168,13.25144 -11.41783,11.24856 c -6.27981,6.1867 -15.23113,15.91689 -19.89183,21.62263 l -8.47399,10.37408 -10.80265,-11.37408 C 768.7359,627.40339 726.99985,556.77733 719.9372,490.5 c -2.40597,-22.5781 1.89436,-53.49527 11.26643,-81 14.42882,-42.34506 45.13854,-81.45915 84.62316,-107.78211 47.83886,-31.89243 111.13613,-42.33434 168.49047,-27.79525 77.10904,19.54681 138.38294,83.99371 154.09764,162.07736 7.7519,38.51746 5.3568,70.62967 -7.9569,106.68203 -4.804,13.00871 -18.539,41.22483 -26.4409,54.31797 -30.606,50.71318 -68.5843,96.17222 -124.5739,149.11172 -12.68124,11.99041 -26.01048,25.30794 -29.62053,29.59451 -13.43817,15.95645 -24.31588,35.55043 -29.29222,52.76395 -5.06634,17.52486 -5.52209,23.46717 -5.52643,72.05605 -0.004,45.90923 -0.47353,54.02728 -4.16189,71.97377 -7.41762,36.092 -27.10697,70.2169 -54.84213,95.0507 -23.53353,21.0717 -55.33343,36.5604 -87.5,42.6185 -15.99888,3.0131 -52.55034,3.3082 -67.5,0.5449 -35.7798,-6.6135 -62.21283,-18.545 -87.14455,-39.3359 -26.58313,-22.168 -48.67949,-56.3721 -56.81651,-87.94916 C 551.35799,961.38312 551.7223,972.05832 551.05204,808 550.55728,686.90017 550.16947,655.69736 549.1194,652.5 542.13279,631.22665 523.38555,617 502.33912,617 c -21.78166,0 -38.75895,12.06105 -46.45123,33 L 453.5,656.5 v 148 c 0,160.70258 -0.1082,157.12828 5.59297,184.75962 11.67527,56.58548 42.98032,110.96208 85.78795,149.01298 42.97742,38.2018 91.50035,60.408 150.61908,68.93 14.30843,2.0626 65.1582,1.75 79,-0.4857 60.38404,-9.7528 107.21616,-32.49 151.44386,-73.5266 40.02381,-37.136 69.17826,-89.2745 80.08924,-143.22788 5.7416,-28.39156 5.9467,-32.94117 5.9573,-132.11837 l 0.01,-90.65595 13.1303,-12.84405 c 7.2216,-7.06423 20.3394,-20.49405 29.1506,-29.84405 8.8113,-9.35 16.409,-17.15213 16.884,-17.33807 1.1723,-0.45894 1.0133,216.27884 -0.1767,240.83807 -2.3912,49.35315 -12.4131,89.1044 -32.9576,130.7247 -47.9274,97.0941 -135.15519,163.4609 -242.0306,184.1477 -26.4694,5.1234 -52.46531,6.8569 -81.5,5.4349 z M 922.19286,550.92754 c -30.9241,-4.01483 -56.325,-26.50277 -63.73686,-56.42754 -2.30163,-9.29262 -2.28738,-24.80447 0.0312,-34 6.75465,-26.78871 26.50643,-47.0951 53.20345,-54.69736 10.91158,-3.10719 27.56588,-3.07934 38.75273,0.0648 22.82368,6.41476 41.4102,22.99023 50.02282,44.61034 5.2256,13.11788 6.6191,26.6739 4.097,39.85568 -5.13195,26.82221 -23.91502,48.55604 -49.42155,57.18551 -5.70185,1.92907 -22.36791,4.75731 -25.64168,4.3514 -0.55,-0.0682 -3.83821,-0.49247 -7.30714,-0.94284 z"
        />
        {/* Inner Path - Single Electric Cyan */}
        <path
          className="logo-path-cyan"
          fill="url(#logoGradSingle)"
          stroke="#38bdf8"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 714.5,1268.3073 c -20.67295,-1.0125 -49.33903,-5.5744 -71,-11.2989 -92.44397,-24.4309 -171.22099,-88.6316 -214.43496,-174.7573 -16.41811,-32.7214 -27.12545,-67.1162 -32.76545,-105.2511 -1.53071,-10.34998 -1.73616,-26.85024 -2.05445,-165 -0.25449,-110.46033 -0.037,-155.71221 0.77576,-161.38981 4.71499,-32.93778 26.90879,-64.18744 56.70129,-79.83745 16.40251,-8.61624 30.98273,-12.15106 50.27781,-12.18933 14.2418,-0.0282 20.46924,0.92379 33.5,5.1214 39.30928,12.6627 68.19599,48.39949 73.39144,90.79519 0.75565,6.16614 1.10508,53.23972 1.10976,149.5 0.007,149.82867 -0.0428,148.12266 4.84204,165 5.47182,18.90547 15.34658,35.3017 30.11282,50 22.55851,22.4546 48.41864,33.3898 82.04394,34.693 36.88681,1.4297 65.97778,-8.8539 90.58141,-32.0201 12.27744,-11.5602 18.23591,-19.566 25.43367,-34.1729 11.7304,-23.80526 12.96573,-32.40683 12.99734,-90.5 0.0255,-46.94735 0.5639,-54.80993 5.08759,-74.30359 6.25084,-26.93634 21.86579,-57.90243 41.01517,-81.33737 7.50185,-9.18073 17.71148,-19.5175 45.22499,-45.78813 56.06753,-53.53478 95.22013,-103.54392 118.27473,-151.07091 18.2385,-37.59855 22.0639,-64.08094 14.3907,-99.62366 -8.1078,-37.55539 -31.4047,-71.28847 -64.5205,-93.42329 -25.91738,-17.32337 -52.96427,-25.5743 -83.9851,-25.62053 -54.50566,-0.0812 -103.87226,28.08773 -131.95179,75.29267 -16.85203,28.33022 -24.89095,69.01838 -19.13993,96.87481 6.00856,29.10392 22.5299,62.92116 48.51537,99.30527 18.48851,25.88709 39.27236,50.66038 62.45748,74.44618 l 12.9168,13.25144 -11.41783,11.24856 c -6.27981,6.1867 -15.23113,15.91689 -19.89183,21.62263 l -8.47399,10.37408 -10.80265,-11.37408 C 768.7359,627.40339 726.99985,556.77733 719.9372,490.5 c -2.40597,-22.5781 1.89436,-53.49527 11.26643,-81 14.42882,-42.34506 45.13854,-81.45915 84.62316,-107.78211 47.83886,-31.89243 111.13613,-42.33434 168.49047,-27.79525 77.10904,19.54681 138.38294,83.99371 154.09764,162.07736 7.7519,38.51746 5.3568,70.62967 -7.9569,106.68203 -4.804,13.00871 -18.539,41.22483 -26.4409,54.31797 -30.606,50.71318 -68.5843,96.17222 -124.5739,149.11172 -12.68124,11.99041 -26.01048,25.30794 -29.62053,29.59451 -13.43817,15.95645 -24.31588,35.55043 -29.29222,52.76395 -5.06634,17.52486 -5.52209,23.46717 -5.52643,72.05605 -0.004,45.90923 -0.47353,54.02728 -4.16189,71.97377 -7.41762,36.092 -27.10697,70.2169 -54.84213,95.0507 -23.53353,21.0717 -55.33343,36.5604 -87.5,42.6185 -15.99888,3.0131 -52.55034,3.3082 -67.5,0.5449 -35.7798,-6.6135 -62.21283,-18.545 -87.14455,-39.3359 -26.58313,-22.168 -48.67949,-56.3721 -56.81651,-87.94916 C 551.35799,961.38312 551.7223,972.05832 551.05204,808 550.55728,686.90017 550.16947,655.69736 549.1194,652.5 542.13279,631.22665 523.38555,617 502.33912,617 c -21.78166,0 -38.75895,12.06105 -46.45123,33 L 453.5,656.5 v 148 c 0,160.70258 -0.1082,157.12828 5.59297,184.75962 11.67527,56.58548 42.98032,110.96208 85.78795,149.01298 42.97742,38.2018 91.50035,60.408 150.61908,68.93 14.30843,2.0626 65.1582,1.75 79,-0.4857 60.38404,-9.7528 107.21616,-32.49 151.44386,-73.5266 40.02381,-37.136 69.17826,-89.2745 80.08924,-143.22788 5.7416,-28.39156 5.9467,-32.94117 5.9573,-132.11837 l 0.01,-90.65595 13.1303,-12.84405 c 7.2216,-7.06423 20.3394,-20.49405 29.1506,-29.84405 8.8113,-9.35 16.409,-17.15213 16.884,-17.33807 1.1723,-0.45894 1.0133,216.27884 -0.1767,240.83807 -2.3912,49.35315 -12.4131,89.1044 -32.9576,130.7247 -47.9274,97.0941 -135.15519,163.4609 -242.0306,184.1477 -26.4694,5.1234 -52.46531,6.8569 -81.5,5.4349 z M 922.19286,550.92754 c -30.9241,-4.01483 -56.325,-26.50277 -63.73686,-56.42754 -2.30163,-9.29262 -2.28738,-24.80447 0.0312,-34 6.75465,-26.78871 26.50643,-47.0951 53.20345,-54.69736 10.91158,-3.10719 27.56588,-3.07934 38.75273,0.0648 22.82368,6.41476 41.4102,22.99023 50.02282,44.61034 5.2256,13.11788 6.6191,26.6739 4.097,39.85568 -5.13195,26.82221 -23.91502,48.55604 -49.42155,57.18551 -5.70185,1.92907 -22.36791,4.75731 -25.64168,4.3514 -0.55,-0.0682 -3.83821,-0.49247 -7.30714,-0.94284 z"
        />
      </g>
    </svg>
  );
}

// ─── Anime.js Animated Hero Section ──────────────────────────────────────────

function AnimeLogoHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. Setup SVG path stroke drawing lengths for dual paths
    const coralPath = containerRef.current?.querySelector<SVGPathElement>(".logo-path-coral");
    const cyanPath = containerRef.current?.querySelector<SVGPathElement>(".logo-path-cyan");

    if (coralPath && cyanPath) {
      [coralPath, cyanPath].forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.fillOpacity = "0";
      });
    }

    // 1. Orchestrated Entrance Timeline using Anime.js v4
    const tl = createTimeline({
      defaults: {
        ease: "outExpo",
      },
    });

    // Orbit Ring Entrance
    tl.add(
      ".anime-orbit-ring",
      {
        scale: [0.2, 1],
        opacity: [0, 0.7],
        duration: 600,
        ease: "outCubic",
      }
    )
      // Logo Badge Spring Reveal
      .add(
        ".anime-logo-badge",
        {
          scale: [0.2, 1],
          rotate: [-18, 0],
          opacity: [0, 1],
          ease: "spring(1, 85, 14, 0)",
          duration: 700,
        },
        "-=500"
      );

    // Staggered Line Drawing (Snappy 1000ms Laser Strokes)
    if (coralPath && cyanPath) {
      tl.add(
        coralPath,
        {
          strokeDashoffset: 0,
          duration: 1000,
          ease: "inOutQuart",
        },
        "-=600"
      )
        .add(
          cyanPath,
          {
            strokeDashoffset: 0,
            duration: 1000,
            ease: "inOutQuart",
          },
          "-=850"
        )
        .add(
          [coralPath, cyanPath],
          {
            fillOpacity: 1,
            duration: 450,
            ease: "outCubic",
          },
          "-=250"
        );
    }

    // 360-Degree Lively Dust Motes Burst on SVG Drawing Completion
    tl.add(
      ".burst-particle",
      {
        translateX: (el: HTMLElement) => parseFloat(el.getAttribute("data-tx") || "0"),
        translateY: (el: HTMLElement) => [
          0,
          parseFloat(el.getAttribute("data-ty") || "0") +
            parseFloat(el.getAttribute("data-drift") || "0"),
        ],
        scale: [0, 1.8, 0.4, 0],
        opacity: [0, 1, 0.7, 0],
        duration: (el: HTMLElement) => parseFloat(el.getAttribute("data-dur") || "1400") * 0.65,
        delay: stagger(8, { start: 0, ease: "outQuad" }),
        ease: "outQuint",
      },
      "-=350"
    );

    // Staggered Title Reveal
    tl.add(
      ".anime-title-word",
      {
        translateY: [25, 0],
        opacity: [0, 1],
        delay: stagger(45),
        duration: 550,
        ease: "outCubic",
      },
      "-=450"
    )
      // Subtext Reveal
      .add(
        ".anime-hero-subtext",
        {
          translateY: [15, 0],
          opacity: [0, 1],
          duration: 450,
          ease: "outQuad",
        },
        "-=350"
      )
      // Action Buttons Spring Reveal
      .add(
        ".anime-hero-btn",
        {
          scale: [0.9, 1],
          translateY: [10, 0],
          opacity: [0, 1],
          delay: stagger(60),
          ease: "spring(1, 90, 12, 0)",
          duration: 600,
        },
        "-=400"
      );

    // 2. Ambient Continuous Animations
    // Logo Gentle Bobbing
    const floatAnim = animate(".anime-logo-float", {
      translateY: [-7, 7],
      duration: 3400,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Backlight Aura Breathing
    const auraAnim = animate(".anime-aura-pulse", {
      scale: [0.92, 1.15],
      opacity: [0.3, 0.7],
      duration: 2900,
      alternate: true,
      loop: true,
      ease: "inOutQuad",
    });

    // Orbit Ring Smooth Rotation
    const orbitAnim = animate(".anime-orbit-rotate", {
      rotate: 360,
      duration: 24000,
      loop: true,
      ease: "linear",
    });

    return () => {
      tl.pause();
      floatAnim.pause();
      auraAnim.pause();
      orbitAnim.pause();
    };
  }, []);

  // 3. Interactive Mouse Parallax / 3D Tilt on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    animate(".anime-logo-tilt", {
      rotateX: -y * 0.1,
      rotateY: x * 0.1,
      duration: 400,
      ease: "outQuad",
    });
  };

  const handleMouseLeave = () => {
    animate(".anime-logo-tilt", {
      rotateX: 0,
      rotateY: 0,
      duration: 700,
      ease: "outElastic(1, .5)",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mx-auto flex min-h-[calc(100dvh-73px)] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center md:px-10"
      aria-labelledby="hero-heading"
    >
      {/* ── Logo Display Container with Anime.js Orbits & SVG Path Drawing ── */}
      <div className="relative mb-12 flex items-center justify-center">
        {/* Pulsing Ambient Backlight */}
        <div className="anime-aura-pulse pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(46,158,191,0.6)_0%,rgba(14,165,233,0.18)_60%,transparent_80%)] blur-3xl sm:h-80 sm:w-80 md:h-[420px] md:w-[420px]" />

        {/* Orbit Ring with Satellites */}
        <div className="anime-orbit-ring pointer-events-none absolute flex items-center justify-center opacity-0">
          <div className="anime-orbit-rotate relative h-64 w-64 rounded-full border border-dashed border-[#2E9EBF]/30 sm:h-80 sm:w-80 md:h-[400px] md:w-[400px]">
            {/* Satellite Particles */}
            <span className="absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#2E9EBF] shadow-[0_0_16px_#2E9EBF]" />
            <span className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
            <span className="absolute top-1/2 -left-2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
          </div>
        </div>

        {/* 3D Interactive Logo Container (No background square) */}
        <div className="anime-logo-tilt cursor-pointer relative">
          {/* Particle Burst Overlay Elements */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {BURST_PARTICLES.map((p) => (
              <span
                key={p.id}
                data-tx={p.x}
                data-ty={p.y}
                data-drift={p.driftY}
                data-dur={p.dur}
                className={`burst-particle absolute rounded-full ${p.sizeClass} opacity-0`}
                style={{
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>

          <div className="anime-logo-float anime-logo-badge relative flex items-center justify-center opacity-0">
            <NearUAnimatedSVG />
          </div>
        </div>
      </div>

      {/* ── Headline ── */}
      <h1
        id="hero-heading"
        className="max-w-4xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {"Your Campus,".split(" ").map((word, i) => (
          <span key={i} className="anime-title-word inline-block mr-3 opacity-0">
            {word}
          </span>
        ))}
        <span className="block mt-1 sm:mt-2">
          {"All in One Place".split(" ").map((word, i) => (
            <span
              key={i}
              className="anime-title-word inline-block mr-3 opacity-0 bg-gradient-to-r from-sky-300 via-[#2E9EBF] to-cyan-400 bg-clip-text text-transparent"
            >
              {word}
            </span>
          ))}
        </span>
      </h1>

      {/* ── Subtext ── */}
      <p className="anime-hero-subtext mt-6 max-w-2xl text-base leading-relaxed text-slate-300 opacity-0 sm:text-lg md:text-xl">
        NearU connects university students to food delivery, accommodation,
        rides, jobs, and gift shops — all built around your campus life.
      </p>

      {/* ── CTAs ── */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register"
          className="anime-hero-btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-7 py-3.5 text-sm font-bold text-white opacity-0 shadow-[0_0_28px_rgba(46,158,191,0.32)] transition duration-200 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(46,158,191,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030307]"
        >
          Get Started for Free
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to="/login"
          className="anime-hero-btn rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-bold text-white/90 opacity-0 transition duration-200 hover:border-white/25 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030307]"
        >
          Login to My Account
        </Link>
      </div>
    </div>
  );
}

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "How does NearU campus food delivery work?",
    a: "NearU is a student-first delivery network. You can place orders from trusted local canteens, shops, and stores. Other students acting as campus riders pick up your order and deliver it directly to your faculty, lecture hall, or hostel door, minimizing delay.",
  },
  {
    q: "Are the listed boarding accommodations verified?",
    a: "Yes! Every boarding house, hostel, and room listed on NearU is reviewed and verified by campus admins and has verified reviews from actual students. You can browse high-res photos, distances to faculties, and rent rates transparently.",
  },
  {
    q: "How can I earn money through campus Gigs?",
    a: "Departments, campus vendors, and professors list flexible micro-gigs directly on the NearU jobs dashboard. You can easily apply within the app, complete your work, and get paid securely with zero commission taken by NearU.",
  },
  {
    q: "How does the NearU Ride sharing work?",
    a: "Need a quick ride to the station or town? Request a ride or join an existing student pool. Shared riders split the transit fares automatically, offering a safe, cheap, and social way to travel back and forth.",
  },
  {
    q: "Is NearU secure for transactions?",
    a: "Absolutely. All transactions (gigs payouts, accommodation deposits, food purchases) are fully encrypted and verified via secure campus payment gateways. Funds are released safely once delivery is confirmed.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-[#2E9EBF]/30"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030307]"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="ml-4 shrink-0 text-[#2E9EBF]"
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <p className="border-t border-white/5 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-300">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-x-0 top-[72px] z-50 border-b border-white/10 bg-black/90 backdrop-blur-2xl md:hidden"
    >
      <div className="flex flex-col gap-3 px-6 py-6">
        <Link
          to="/register"
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-6 py-3 text-center text-sm font-bold text-white"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          onClick={onClose}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white"
        >
          Login
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030307] text-white">
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(46,158,191,0.28),rgba(3,3,7,1)_55%)]" />
        <div className="absolute left-[10%] top-1/3 h-[500px] w-[500px] rounded-full bg-[#2E9EBF]/[0.06] blur-[140px]" />
        <div className="absolute right-[8%] bottom-1/4 h-[400px] w-[400px] rounded-full bg-sky-500/[0.04] blur-[120px]" />
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="NearU home">
            <img
              src="/NearU Logo.svg"
              alt="NearU Logo"
              className="h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-105"
              width={48}
              height={48}
            />
            <span className="text-xl font-black tracking-tight text-white">
              Near<span className="bg-gradient-to-r from-sky-400 to-[#2E9EBF] bg-clip-text text-transparent">U</span>
            </span>
          </Link>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-slate-200 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2E9EBF] to-sky-600 px-5 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(46,158,191,0.28)] transition duration-150 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(46,158,191,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030307]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E9EBF]"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <main id="main-content">
        {/* ── Anime.js Animated Hero Section ── */}
        <section id="home">
          <AnimeLogoHero />
        </section>

        {/* ── FAQ ── */}
        <section
          id="faqs"
          className="mx-auto max-w-3xl border-t border-white/[0.05] px-6 py-24 md:px-10"
          aria-labelledby="faq-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="mb-12 text-center"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#2E9EBF]">
              Help Center
            </p>
            <h2
              id="faq-heading"
              className="mt-3 text-3xl font-black text-white md:text-4xl"
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-20 border-t border-white/5 bg-black/50 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="NearU home">
              <img
                src="/NearU Logo.svg"
                alt="NearU Logo"
                className="h-8 w-8 object-contain transition-opacity group-hover:opacity-80"
                width={32}
                height={32}
              />
              <span className="text-base font-black tracking-tight text-white">
                Near<span className="bg-gradient-to-r from-sky-400 to-[#2E9EBF] bg-clip-text text-transparent">U</span>
              </span>
            </Link>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-5 text-xs font-medium text-slate-500">
              <Link
                to="/privacy-policy"
                className="rounded transition-colors duration-150 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E9EBF]"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="rounded transition-colors duration-150 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E9EBF]"
              >
                Terms &amp; Conditions
              </Link>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NearU on GitHub"
                className="rounded text-slate-600 transition-colors duration-150 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E9EBF]"
              >
                <Github className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NearU on Instagram"
                className="rounded text-slate-600 transition-colors duration-150 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E9EBF]"
              >
                <Instagram className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NearU on LinkedIn"
                className="rounded text-slate-600 transition-colors duration-150 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E9EBF]"
              >
                <Linkedin className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} NearU Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
