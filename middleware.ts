import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Expresión regular para decirle a Next.js dónde ejecutar el middleware
  // (Excluye archivos estáticos e imágenes para no hacerlo lento)
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};