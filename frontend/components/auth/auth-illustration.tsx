interface AuthIllustrationProps {
  type: 'login' | 'register';
}

export function AuthIllustration({ type }: AuthIllustrationProps) {
  return (
    <div className="auth-illustration">
      <div className="illustration-bg">
        <div className="floating-leaf leaf-1"></div>
        <div className="floating-leaf leaf-2"></div>
        <div className="floating-leaf leaf-3"></div>
      </div>
      <div className="illustration-content">
        {type === 'login' ? (
          <>
            <div className="illustration-title">Welcome Back</div>
            <div className="illustration-subtitle">
              Manage your HR efficiently with our modern system. Your workspace awaits.
            </div>
          </>
        ) : (
          <>
            <div className="illustration-title">Join Our Growth</div>
            <div className="illustration-subtitle">
              Start your journey with us. Simple, secure, and seamless onboarding awaits.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
