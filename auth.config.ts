import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Si no está logueado, lo mandamos aquí
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/admin'); // Protegemos /admin
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirigir a login
      }
      return true;
    },
    // Añadimos el ROL y el ID a la sesión para usarlos en el Frontend
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore // Ignoramos error de tipado temporalmente
        session.user.role = token.role; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    }
  },
  providers: [], // Aquí se añaden los proveedores (lo haremos en auth.ts)
} satisfies NextAuthConfig;