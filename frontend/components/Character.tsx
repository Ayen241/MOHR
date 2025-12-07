'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CharacterProps {
  type: 'orange' | 'purple' | 'black' | 'yellow';
  mouseX?: number;
  mouseY?: number;
  emailFilled?: boolean;
  passwordFilled?: boolean;
  isLoginSuccess?: boolean;
}

export const Character: React.FC<CharacterProps> = ({
  type,
  mouseX = 0,
  mouseY = 0,
  emailFilled = false,
  passwordFilled = false,
  isLoginSuccess = false,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [eyeAngle, setEyeAngle] = useState(0);

  // Calculate eye rotation angle based on mouse position
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    setEyeAngle(angle);
  }, [mouseX, mouseY]);

  const getCharacterStyle = () => {
    switch (type) {
      case 'orange':
        return {
          body: '#FF6B35',
          accent: '#FFB366',
          dark: '#E55A25',
        };
      case 'purple':
        return {
          body: '#7C3AED',
          accent: '#A78BFA',
          dark: '#6D28D9',
        };
      case 'black':
        return {
          body: '#1F2937',
          accent: '#4B5563',
          dark: '#111827',
        };
      case 'yellow':
        return {
          body: '#FBBF24',
          accent: '#FCD34D',
          dark: '#D97706',
        };
    }
  };

  const style = getCharacterStyle();

  // Eye position based on angle
  const eyeOffsetX = Math.cos(eyeAngle) * 4;
  const eyeOffsetY = Math.sin(eyeAngle) * 4;

  // Determine character expression
  let eyeScale = 1;
  let mouthPath = '';
  let shouldSquint = false;

  if (isLoginSuccess) {
    // Celebrating - happy face with wide smile
    mouthPath = 'M 35 65 Q 50 75 65 65';
    eyeScale = 0.7; // Eyes squinting from laughing
    shouldSquint = true;
  } else if (passwordFilled) {
    // Shy - eyes mostly closed
    eyeScale = 0.3;
    mouthPath = 'M 35 65 L 65 65'; // Straight mouth
    shouldSquint = true;
  } else if (emailFilled) {
    // Happy - smile
    mouthPath = 'M 35 65 Q 50 72 65 65';
    eyeScale = 1;
  } else {
    // Neutral - just staring
    mouthPath = 'M 35 65 L 65 65'; // Straight mouth
    eyeScale = 1;
  }

  return (
    <svg
      ref={containerRef}
      width="160"
      height="200"
      viewBox="0 0 160 200"
      className={`transition-all duration-300 ${
        isLoginSuccess ? 'animate-bounce' : ''
      }`}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))' }}
    >
      <defs>
        <linearGradient id={`bodyGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={style.accent} stopOpacity="1" />
          <stop offset="100%" stopColor={style.body} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Shadow under character */}
      <ellipse cx="80" cy="185" rx="50" ry="8" fill="rgba(0,0,0,0.08)" />

      {/* Main body - rounded rectangle */}
      <rect
        x="30"
        y="50"
        width="100"
        height="120"
        rx="25"
        ry="25"
        fill={`url(#bodyGrad-${type})`}
      />

      {/* Shoulders/top accent */}
      <ellipse cx="80" cy="65" rx="55" ry="20" fill={style.accent} opacity="0.6" />

      {/* Left eye white */}
      {eyeScale > 0 && (
        <g>
          <ellipse
            cx={50 + eyeOffsetX * 0.5}
            cy={70 + eyeOffsetY * 0.5}
            rx={12 * eyeScale}
            ry={14 * eyeScale}
            fill="white"
          />
          {/* Left pupil */}
          <circle
            cx={50 + eyeOffsetX}
            cy={70 + eyeOffsetY}
            r={7 * eyeScale}
            fill="black"
          />
          {/* Left eye shine */}
          <circle cx={52 + eyeOffsetX} cy={68 + eyeOffsetY} r={2.5} fill="white" />
        </g>
      )}

      {/* Right eye white */}
      {eyeScale > 0 && (
        <g>
          <ellipse
            cx={110 + eyeOffsetX * 0.5}
            cy={70 + eyeOffsetY * 0.5}
            rx={12 * eyeScale}
            ry={14 * eyeScale}
            fill="white"
          />
          {/* Right pupil */}
          <circle
            cx={110 + eyeOffsetX}
            cy={70 + eyeOffsetY}
            r={7 * eyeScale}
            fill="black"
          />
          {/* Right eye shine */}
          <circle cx={112 + eyeOffsetX} cy={68 + eyeOffsetY} r={2.5} fill="white" />
        </g>
      )}

      {/* Closed eyes when squinting */}
      {shouldSquint && eyeScale < 0.5 && (
        <g>
          {/* Left closed eye */}
          <path
            d="M 40 70 Q 50 75 60 70"
            stroke="black"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right closed eye */}
          <path
            d="M 100 70 Q 110 75 120 70"
            stroke="black"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Mouth */}
      <path
        d={mouthPath}
        stroke="black"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cheeks for happy expression */}
      {emailFilled && !passwordFilled && (
        <>
          <circle cx="25" cy="85" r="6" fill="rgba(0,0,0,0.1)" />
          <circle cx="135" cy="85" r="6" fill="rgba(0,0,0,0.1)" />
        </>
      )}

      {/* Celebration confetti */}
      {isLoginSuccess && (
        <>
          <g className="animate-pulse">
            <circle cx="25" cy="30" r="4" fill="#FFD700" />
            <circle cx="135" cy="25" r="4" fill="#FF6B35" />
            <circle cx="60" cy="15" r="3" fill="#7C3AED" />
            <circle cx="100" cy="20" r="3" fill="#FBBF24" />
          </g>
        </>
      )}
    </svg>
  );
};
