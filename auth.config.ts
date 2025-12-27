import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnPerfil = nextUrl.pathname.startsWith('/perfil')

            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === 'admin') return true;
                return false;
            }

            if (isOnPerfil) {
                if (isLoggedIn) return true;
                return false;
            }

            if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/perfil', nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.type = (user as any).type;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as string;
                session.user.type = token.type as string;
            }
            return session;
        }
    },
    providers: []
} satisfies NextAuthConfig