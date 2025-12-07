'use client';

interface HeroBackgroundProps {
  type: 'login' | 'register';
}

export function HeroBackground({ type }: HeroBackgroundProps) {
  return (
    <div className="hero-background">
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
    </div>
  );
}
