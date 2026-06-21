import { useState, useEffect, useRef } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

interface AnimatedMarkerProps {
  position: [number, number];
  icon?: L.DivIcon | L.Icon;
  duration?: number; // duration of animation in ms
}

export default function AnimatedMarker({
  position,
  icon,
  duration = 1000
}: AnimatedMarkerProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(position);
  const animationRef = useRef<number | null>(null);
  
  // Track previous position to animate from
  const prevPositionRef = useRef<[number, number]>(position);

  useEffect(() => {
    // If position is the same, do nothing
    if (
      prevPositionRef.current[0] === position[0] &&
      prevPositionRef.current[1] === position[1]
    ) {
      return;
    }

    const startLat = prevPositionRef.current[0];
    const startLng = prevPositionRef.current[1];
    const endLat = position[0];
    const endLng = position[1];
    const startTime = performance.now();

    // Cancel any ongoing animation frame
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Linear interpolation (LERP) formula
      const nextLat = startLat + (endLat - startLat) * progress;
      const nextLng = startLng + (endLng - startLng) * progress;

      setCurrentPosition([nextLat, nextLng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevPositionRef.current = position;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position, duration]);

  return <Marker position={currentPosition} icon={icon} />;
}
