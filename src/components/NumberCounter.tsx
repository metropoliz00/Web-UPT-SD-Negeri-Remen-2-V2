import React, { useState, useEffect, useRef } from 'react';

interface NumberCounterProps {
  value: number | string;
}

export default function NumberCounter({ value }: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState('');
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse the value to find digits, formatting, prefixes, and suffixes
  const parseVal = (val: string | number) => {
    if (typeof val === 'number') {
      return { targetNum: val, prefix: '', suffix: '', formatWithCommas: false };
    }
    
    // Look for commas or dots representing thousands separators
    // e.g., "3,500+" -> targetWithCommas = "3,500", targetNumVal = 3500
    const commaMatch = val.match(/([\d,.]+)/);
    if (commaMatch) {
      const targetWithCommas = commaMatch[1];
      // Clean commas and dots to get raw integer value
      const targetNumVal = parseInt(targetWithCommas.replace(/[,.]/g, ''), 10);
      const splitIdx = val.indexOf(targetWithCommas);
      const valPrefix = val.substring(0, splitIdx);
      const valSuffix = val.substring(splitIdx + targetWithCommas.length);
      const isComma = targetWithCommas.includes(',');
      const isDot = targetWithCommas.includes('.');
      
      return {
        targetNum: targetNumVal,
        prefix: valPrefix,
        suffix: valSuffix,
        formatWithCommas: isComma,
        formatWithDots: isDot
      };
    }
    
    return { targetNum: 0, prefix: '', suffix: val, formatWithCommas: false, formatWithDots: false };
  };

  const { targetNum, prefix, suffix, formatWithCommas, formatWithDots } = parseVal(value);

  useEffect(() => {
    if (!elementRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    const formatNumber = (num: number) => {
      if (formatWithCommas) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      if (formatWithDots) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return num.toString();
    };

    if (!hasAnimated) {
      // Show 0 initially
      setDisplayValue(`${prefix}${formatNumber(0)}${suffix}`);
      return;
    }

    let start = 0;
    const end = targetNum;
    if (start === end) {
      setDisplayValue(`${prefix}${formatNumber(end)}${suffix}`);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    let animationFrameId: number;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.round(start + easeProgress * (end - start));
      
      setDisplayValue(`${prefix}${formatNumber(current)}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasAnimated, targetNum, prefix, suffix, formatWithCommas, formatWithDots]);

  return <span ref={elementRef}>{displayValue}</span>;
}
