import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod'; // NextAuth usa Zod para validar inputs
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';

// Esquema de validación simple
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma), // Conectamos con tu DB
  session: { strategy: 'jwt' }, // Usamos Tokens JWT (más rápido y compatible con Edge)
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("🔍 Intento de Login con:", credentials?.email); // LOG 1

        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 1. Buscamos al usuario
          const user = await prisma.user.findUnique({ where: { email } });
          console.log("👤 Usuario encontrado en DB:", user ? "SÍ" : "NO"); // LOG 2
          
          if (!user) return null;
          
          // Verificamos si tiene password (si entró con Google, no tendrá)
          if (!user.password) {
             console.log("❌ El usuario no tiene contraseña (quizás es OAuth)"); 
             return null;
          }

          // 2. Comparamos contraseña
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("wn Contraseña coincide:", passwordsMatch ? "SÍ" : "NO"); // LOG 3

          if (passwordsMatch) {
            const { password: _, ...userWithoutPassword } = user;
            console.log('inicio correcto')
            return userWithoutPassword;
          }
        } else {
            console.log("⚠️ Falló la validación Zod:", parsedCredentials.error); // LOG ZOD
        }

        console.log('⛔ Credenciales inválidas al final del proceso');
        return null;
      },
    }),
  ],
});