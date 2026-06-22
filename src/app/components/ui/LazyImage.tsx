import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, ShieldAlert } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClass?: string;
  style?: React.CSSProperties;
}

export default function LazyImage({
  src,
  alt,
  className = "",
  placeholderClass = "",
  style
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
    setHasError(false);

    if (!src) {
      setHasError(true);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setHasError(true);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`} style={style}>
      <AnimatePresence>
        {/* Shimmer/Pulse Placeholder */}
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-slate-950/40 backdrop-blur-md border border-white/5 animate-pulse flex items-center justify-center ${placeholderClass}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <ImageIcon className="h-6 w-6 text-slate-700" />
          </motion.div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-1.5 p-3"
          >
            <ShieldAlert className="h-5 w-5 text-amber-500/70" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600">
              Failed to load
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Image */}
      {src && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full h-full object-cover ${className}`}
        />
      )}
    </div>
  );
}
