import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Extend NextAuth types to include custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
      name?: string | null;
      image?: string | null;
      phone?: string | null;
      department?: string | null;
    };
  }
  interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    name?: string;
    image?: string | null;
    phone?: string;
    department?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    image?: string | null;
    phone?: string;
    department?: string;
  }
}

interface CustomUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    image?: string | null;
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Call backend API to verify credentials
        try {
          const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error('Backend auth failed:', res.status);
            return null;
          }

          const user = await res.json();
          
          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image || null;
        token.phone = user.phone;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image || null;
        session.user.phone = token.phone;
        session.user.department = token.department;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export const { auth, signIn, signOut } = handler;
export const GET = handler;
export const POST = handler;

// Export authOptions for use with getServerSession
export default authOptions;
