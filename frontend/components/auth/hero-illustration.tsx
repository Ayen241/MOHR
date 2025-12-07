'use client';

interface HeroIllustrationProps {
  type: 'login' | 'register';
}

export function HeroIllustration({ type }: HeroIllustrationProps) {
  return (
    <div className="hero-illustration-container">
      <svg
        className="hero-svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" stopOpacity="1" />
            <stop offset="100%" stopColor="#2b5743" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="moss1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9caf88" />
            <stop offset="100%" stopColor="#7cc4b0" />
          </linearGradient>

          <linearGradient id="moss2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8d9c8" />
            <stop offset="100%" stopColor="#7cc4b0" />
          </linearGradient>

          <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4eae0" />
            <stop offset="100%" stopColor="#9caf88" />
          </linearGradient>

          <filter id="softShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Background */}
        <rect width="800" height="600" fill="url(#bgGradient)" />

        {/* Bottom Moss Shapes - Base Layer */}
        <ellipse cx="100" cy="550" rx="120" ry="80" fill="#3d6847" opacity="0.6" />
        <ellipse cx="700" cy="520" rx="150" ry="100" fill="#3d6847" opacity="0.6" />
        <ellipse cx="400" cy="580" rx="250" ry="60" fill="#2b5743" opacity="0.7" />

        {/* Large Moss Plants - Back Layer */}
        {/* Left moss cluster */}
        <g opacity="0.9">
          <path
            d="M 150 480 Q 140 450 155 420 Q 165 400 180 420 Q 170 450 160 480 Z"
            fill="url(#moss1)"
          />
          <path
            d="M 120 500 Q 110 470 130 440 Q 145 420 160 445 Q 140 475 125 500 Z"
            fill="url(#moss2)"
          />
          <circle cx="135" cy="520" r="35" fill="#9caf88" opacity="0.8" />
          <circle cx="110" cy="530" r="28" fill="#a8d9c8" opacity="0.7" />
        </g>

        {/* Right moss cluster */}
        <g opacity="0.9">
          <path
            d="M 700 490 Q 710 460 690 430 Q 675 410 660 430 Q 680 460 690 490 Z"
            fill="url(#moss1)"
          />
          <path
            d="M 730 510 Q 745 475 720 445 Q 700 420 685 450 Q 710 480 725 510 Z"
            fill="url(#moss2)"
          />
          <circle cx="715" cy="535" r="38" fill="#9caf88" opacity="0.8" />
          <circle cx="750" cy="545" r="32" fill="#a8d9c8" opacity="0.7" />
        </g>

        {/* Center moss formation */}
        <g opacity="0.85">
          <ellipse cx="400" cy="520" rx="100" ry="50" fill="url(#moss1)" />
          <circle cx="380" cy="510" r="45" fill="#9caf88" opacity="0.8" />
          <circle cx="420" cy="515" r="40" fill="#a8d9c8" opacity="0.7" />
          <circle cx="400" cy="540" r="35" fill="#7cc4b0" opacity="0.9" />
        </g>

        {/* Mid-layer moss elements */}
        <g opacity="0.8">
          <circle cx="200" cy="420" r="40" fill="#a8d9c8" />
          <circle cx="600" cy="400" r="45" fill="#9caf88" />
          <ellipse cx="350" cy="380" rx="50" ry="35" fill="url(#moss2)" />
        </g>

        {/* Floating Leaves - Animated */}
        <g>
          {/* Leaf 1 - Top Left */}
          <g className="floating-element" style={{ animationDelay: '0s' }}>
            <ellipse
              cx="250"
              cy="200"
              rx="15"
              ry="25"
              fill="url(#leaf)"
              opacity="0.7"
              transform="rotate(-25 250 200)"
            />
          </g>

          {/* Leaf 2 - Top Right */}
          <g className="floating-element" style={{ animationDelay: '1s' }}>
            <ellipse
              cx="600"
              cy="180"
              rx="12"
              ry="22"
              fill="#d4eae0"
              opacity="0.6"
              transform="rotate(35 600 180)"
            />
          </g>

          {/* Leaf 3 - Center */}
          <g className="floating-element" style={{ animationDelay: '2s' }}>
            <ellipse
              cx="150"
              cy="280"
              rx="14"
              ry="24"
              fill="url(#leaf)"
              opacity="0.65"
              transform="rotate(-15 150 280)"
            />
          </g>

          {/* Leaf 4 - Center Right */}
          <g className="floating-element" style={{ animationDelay: '1.5s' }}>
            <ellipse
              cx="650"
              cy="300"
              rx="13"
              ry="23"
              fill="#d4eae0"
              opacity="0.6"
              transform="rotate(20 650 300)"
            />
          </g>
        </g>

        {/* Top Light Elements */}
        <g opacity="0.3">
          <circle cx="100" cy="100" r="60" fill="#d4eae0" />
          <circle cx="700" cy="80" r="70" fill="#d4eae0" />
        </g>

        {/* Subtle decorative shapes */}
        <g opacity="0.15">
          <path d="M 0 0 Q 200 100 400 0" stroke="#f5f3f0" strokeWidth="2" fill="none" />
          <path d="M 400 0 Q 600 100 800 0" stroke="#f5f3f0" strokeWidth="2" fill="none" />
        </g>
      </svg>

      {/* Overlay Text */}
      <div className="hero-overlay">
        {type === 'login' ? (
          <>
            <div className="hero-title">Welcome Back</div>
            <div className="hero-subtitle">
              Manage your HR efficiently with our modern system designed for growth.
            </div>
          </>
        ) : (
          <>
            <div className="hero-title">Join Our Growth</div>
            <div className="hero-subtitle">
              Start your journey with us. Simple, secure, and seamless HR management.
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
