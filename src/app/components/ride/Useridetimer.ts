import { useEffect, useState } from "react";

export function useRideTimer(expiresAt?: string){
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if(!expiresAt) return;

    const calc = () => {
      setSecondsLeft(
        Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      );
    };

    calc();

    const id = setInterval(calc, 1000);

    return () => clearInterval(id);
  }, [expiresAt]);

  return {
    secondsLeft,

    minutes: String(Math.floor(secondsLeft / 60)).padStart(2, '0'),
    seconds: String(secondsLeft % 60).padStart(2, '0'),
    isExpired: secondsLeft === 0 && !!expiresAt,
  };
}