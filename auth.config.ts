import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session;
        }
    },
    providers: []
} satisfies NextAuthConfig