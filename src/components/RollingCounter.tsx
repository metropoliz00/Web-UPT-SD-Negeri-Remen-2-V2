import React, { useEffect, useState } from 'react';

interface RollingCounterProps {
  value: number;
  duration?: number; // duration in ms
}

export function RollingCounter({ value, duration = 2000 }: RollingCounterProps) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 1;
    const endValue = value;

    if (endValue <= startValue) {
      setCount(endValue);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out quad formula: f(t) = t * (2 - t)
      const easeProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easeProgress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}
