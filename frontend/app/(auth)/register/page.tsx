import { AuthHeroLayout } from '@/components/auth/auth-hero-layout';
import { RegisterForm } from '@/components/auth/register-form';
import { HeroBackground } from '@/components/auth/hero-background';

export const metadata = {
  title: 'Create Account | MoHR',
  description: 'Create a new MoHR account',
};

export default function RegisterPage() {
  return (
    <AuthHeroLayout
      formChild={<RegisterForm />}
      illustrationChild={<HeroBackground type="register" />}
    />
  );
}
