import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credetenials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { User } from '@/app/lib/definitions'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        Credetenials({
            async authorize(credentials) {
                const parsedCredentials = loginSchema.safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data

                    const user = await prisma.user.findUnique({ where: { email } })
                    if (!user || !user.password) return null

                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if (passwordMatch) {
                        const { password: _password, ...userWithoutPass } = user
                        return userWithoutPass
                    }
                }
                return null
            }
        })
    ]
})