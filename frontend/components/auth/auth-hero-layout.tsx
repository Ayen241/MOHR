import { ReactNode } from 'react';

interface AuthHeroLayoutProps {
  formChild: ReactNode;
  illustrationChild: ReactNode;
}

export function AuthHeroLayout({ formChild, illustrationChild }: AuthHeroLayoutProps) {
  return (
    <div className="auth-hero-layout">
      <div className="auth-hero-left">
        {illustrationChild}
      </div>
      <div className="auth-hero-right">
        <div className="auth-form-container">
          {formChild}
        </div>
      </div>
    </div>
  );
}
