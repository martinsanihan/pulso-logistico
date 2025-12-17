'use server'

import { auth, signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { userAgent } from 'next/server'
import { routeModule } from 'next/dist/build/templates/pages'

export async function authenticate(
    prevState: String | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData, { redirect: false });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return error.code || 'Credenciales Invalidas'
                default:
                    return 'Algo Salió Mal'
            }
        }
        throw error
    }

    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true }
    })

    if (user?.role === 'admin') {
        redirect('/admin')
    }
    else if (user?.role === 'user') {
        redirect('/perfil')
    }
}

const profileSchema = z.object({
    name: z.string().min(1, "Nombre Obligatorio"),
    email: z.string().email("Correo Invalido"),
    username: z.string().min(3, "Usuario debe ser al menos de 3 carácteres")
})

export async function updateProfile(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return "No tienes permiso para realizar esta acción"
        }

        const data = Object.fromEntries(formData.entries());
        const parsed = profileSchema.safeParse(data);

        if (!parsed.success) {
            return "Datos invalidos" + parsed.error.issues[0].message;
        }

        const { name, email, username } = parsed.data;

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email,
                username
            }
        });

        revalidatePath('/perfil');
    } catch (error) {
        console.error(error);
        return "error al actualizar datos"
    }

    redirect('/perfil');
}

const registerSchema = z.object({
    name: z.string().min(1, "Nombre es obligatorio"),
    email: z.string().email("Correo invalido"),
    password: z.string().min(6, "Contraseña mínimo 6 caracteres"),
    username: z.string().min(1, "Nombre de usuario obligatorio")
})

export async function signUp(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsed = registerSchema.safeParse(data);

        if (!parsed.success) {
            return "datos invalidos" + parsed.error.issues[0].message;
        }

        const { name, email, password, username } = parsed.data;

        const exists = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true }
        });

        if (exists) {
            return "Ya existe un usuario con este E-mail";
        }

        const hashPass = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPass,
                username,
                role: 'user',
                status: 'pendiente'
            }
        });

    } catch (error) {
        console.error(error);
        return "Error al registrar usuario."
    }

    // redirect('/perfil');

    redirect('/login?success=account-created')
}

export async function updateUserStatus(userId: string, newStatus: string) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  })
  
  if (user?.role !== 'admin') {
    throw new Error("No autorizado");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo actualizar el estado" };
  }
}

export async function deleteUser(userId: String) {
    const session = await auth();
    // const user = await prisma.user.findUnique({
    //     where: { id: userId },
    //     select: { id: true }
    // });

    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("error al eliminar usuario", error);
        return { error: "No se pudo eliminar el usuario, intentelo de nuevo." }
    }
}