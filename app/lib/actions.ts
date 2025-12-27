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
import { sendMail } from './mail'
import crypto from 'crypto'
import { signOut } from '@/auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user || !user.password) {
        return "Credenciales Invalidas";
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return "Credenciales Invalidas";
    }

    try {
        await sendMail({
            to: email,
            subject: 'Nuevo Inicio de Sesión - Pulso Logístico',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #2563eb;">Hola, ${user.name}</h1>
                    <p>Te informamos que se ha iniciado sesión en tu cuenta de <strong>Pulso Logístico</strong>.</p>
                    <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-CL')}</p>
                    <p>Si no fuiste tú, te recomendamos cambiar tu contraseña inmediatamente.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666;">Este es un mensaje automático de seguridad.</p>
                </div>
            `
        });

    } catch (mailError) {
        console.error("Error al enviar correo de inicio de sesión", mailError);
    }

    const redirectTo = user.role === 'admin' ?  '/admin' : '/perfil';

    try {
        await signIn(
            'credentials', {
                email,
                password,
                redirectTo
            }
        );
    } catch(error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales Invalidas'
                default:
                    return 'Algo Salió Mal'
            }
        }
        throw error;
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
            select: { id: true, status: true, email: true }
        });

        const hashPass = await bcrypt.hash(password, 10);

        if (exists && exists.status === 'removed') {
            await prisma.user.update({
                where: { email: `${exists.email}` },
                data: {
                    name,
                    email,
                    password: hashPass,
                    username,
                    role: 'user',
                    status: 'pendiente'
                }
            })
        }
        else if (exists && (exists.status === 'aprobado' || exists.status === 'pendiente')) {
            return "Ya existe un usuario con este E-mail";
        }
        else {
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
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600*3600);

        await prisma.verificationToken.create({
            data: { email, token, expires }
        });

        const verifUrl = `http://localhost:3000/verify-email?token=${token}`;

        await sendMail({
            to: email,
            subject: 'Verifica tu correo - Pulso Logístico',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h1 style="color: #2563eb;">Bienvenido, ${name}</h1>
                    <p>Para activar tu cuenta, haz clic en el siguiente botón:</p>
                    <a href="${verifUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Verificar mi Correo
                    </a>
                    <p>Este enlace expirará en 1 hora.</p>
                </div>
            `
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
  const actualUser = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true }
  });
  const updateUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });
  
  if (actualUser?.role !== 'admin') {
    throw new Error("No autorizado");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });
    
    revalidatePath('/admin/users');

    await sendMail({
        to: `${updateUser?.email}`,
        subject: 'Estado de Cuenta Actualizado por un Administrador - Pulso Logístico',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h1 style="color: #2563eb;">${newStatus === 'aprobado' ? '¡Su Cuenta ha Sido Aprobada!' : 'Su Cuenta ha Sido Suspendida'}</h1>
                <p>${newStatus === 'aprobado' ? 'Felicidades! su cuenta de Pulso Logístico ha sido aprobada, inicia sesión en https://pulsologistico.cl' : 'Lamentamos informarle que su cuenta fue suspendida por un administrador y no puede volver a iniciar sesión en la plataforma'}</p>
                <p>Fecha y hora: ${new Date().toLocaleString()}</p>
                <hr />
                <p style="font-size: 12px; color: #666;">Proyecto: Pulso Logístico</p>
            </div>
        `
    })

    return { success: true };
  } catch (error) {
    return { error: "No se pudo actualizar el estado" };
  }
}

export async function deleteUser(userId: String) {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: userId.toString() },
        select: { id: true, email: true }
    });

    try {
        await prisma.user.update({
            where: { id: userId.toString() },
            data: {
                status: 'removed'
            }
        });
        revalidatePath('/admin');
        await sendMail({
            to: `${user?.email}`,
            subject: 'Cuenta Eliminada - Pulso Logístico',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h1 style="color: #2563eb;">Cuenta Eliminada del Sistema - Pulso Logístico</h1>
                    <p>Estimado usuario, lamentamos informarle que su cuenta fue borrada de la plataforma, para volver a crear su cuenta dirigase a la web de Pulso Logístico</p>
                    <p>Fecha y hora: ${new Date().toLocaleString()}</p>
                    <hr />
                    <p style="font-size: 12px; color: #666;">Proyecto: Pulso Logístico</p>
                </div>
            `

        })

        return { success: true };

    } catch (error) {
        console.error("error al eliminar usuario", error);
        return { error: "No se pudo eliminar el usuario, intentelo de nuevo." }
    }
}

export async function verifyEmailToken(token: string) {
    try {
        const storedToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        if (!storedToken || storedToken.expires < new Date()) {
            return { error: "Token inválido o expirado." }
        }

        await prisma.user.update({
            where: { email: storedToken.email },
            data: {
                emailVerified: new Date()
            }
        });

        await prisma.verificationToken.delete({
            where: { token }
        });

        return { success: true }
    } catch (error) {
        return { error: "error en el proceso de validación de E-mail" }
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/login' });
}

export async function solicitarCompra(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Debes iniciar sesión" };


    const productoId = formData.get('productoId') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const rut = formData.get('rut') as string;
    const mensaje = formData.get('mensaje') as string;

    try {
        const producto = await prisma.producto.findUnique({
            where: { id: productoId }
        });

        if (!producto) return { error: "Producto no encontrado." };

        await sendMail({
            to: process.env.EMAIL_USER as string,
            subject: `Nueva Solicitud de Compra ${producto.nombre}`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #1e1b4b;">Nueva Intención de Compra</h2>
                    <p>El usuario <strong>${session.user.name}</strong> desea adquirir un producto.</p>
                    <hr />
                    <p><strong>Producto:</strong> ${producto.nombre}</p>
                    <p><strong>Precio:</strong> $${producto.precio.toLocaleString('es-CL')}</p>
                    <p><strong>Datos de Contacto:</strong></p>
                    <ul>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Teléfono:</strong> ${telefono}</li>
                        <li><strong>RUT:</strong> ${rut}</li>
                    </ul>
                    <p><strong>Mensaje adicional:</strong> ${mensaje || 'Sin mensaje'}</p>
                </div>
            `
        });

        await sendMail({
            to: email,
            subject: `Confirmación de Solicitud: ${producto.nombre} - Pulso Logístico`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #2563eb;">¡Hola ${session.user.name}!</h1>
                    <p>Hemos recibido correctamente tu solicitud para adquirir <strong>${producto.nombre}</strong>.</p>
                    <p>Un ejecutivo de nuestro equipo de <strong>Pulso Logístico</strong> se pondrá en contacto contigo a través de los datos proporcionados para concretar el pago y la entrega.</p>
                    <p>Gracias por preferirnos.</p>
                </div>
            `
        });

        await prisma.compra.create({
            data: {
                userId: session.user.id,
                productoId: producto.id,
                precioPagado: producto.precio,
                emailContacto: email,
                telefono,
                rut,
                mensaje
            }
        })

        return { success: true };
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return { error: "No se pudo procesar la solicitud, intenta nuevamente." };
    }
}