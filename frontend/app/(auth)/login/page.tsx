import { AuthHeroLayout } from '@/components/auth/auth-hero-layout';
import { LoginForm } from '@/components/auth/login-form';
import { HeroBackground } from '@/components/auth/hero-background';

export const metadata = {
  title: 'Sign In | MoHR',
  description: 'Sign in to your MoHR account',
};

export default function LoginPage() {
  return (
    <AuthHeroLayout
      formChild={<LoginForm />}
      illustrationChild={<HeroBackground type="login" />}
    />
  );
}
