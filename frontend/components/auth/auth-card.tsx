import { ReactNode } from 'react';

interface AuthCardProps {
  formChild: ReactNode;
  illustrationChild: ReactNode;
}

export function AuthCard({ formChild, illustrationChild }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="auth-form-side">
        {formChild}
      </div>
      <div className="auth-art-side">
        {illustrationChild}
      </div>
    </div>
  );
}
