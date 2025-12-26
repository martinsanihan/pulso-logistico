import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getHistorialUsuario() {
    const session = await auth();

    if(!session?.user?.id) return null;

    const compras = await prisma.compra.findMany({
        where: {userId: session.user.id},
        include: {
            producto: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const productos = await prisma.compra.findMany({
        where: { userId: session.user.id },
        include: { producto: true },
        orderBy: { createdAt: 'desc' },
        distinct: ['productoId']
    });

    return { productos: productos, compras: compras };
}