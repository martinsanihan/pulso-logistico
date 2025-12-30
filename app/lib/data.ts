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

    const productosAdquiridos = await prisma.compra.findMany({
        where: { userId: session.user.id, estado: 'completado' },
        include: { producto: true },
        orderBy: { createdAt: 'desc' },
        distinct: ['productoId']
    });

    const usuario = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if(!usuario) return null;

    const tier = usuario?.type;

    const contenidoAccesible = await prisma.producto.findMany({
        where: {
            activo: true,
            contenidos: {
                some: {
                    tipoRequerido: {lte: tier}
                }
            }
        },
        include: {
            contenidos: {
                where: { tipoRequerido: { lte: tier } },
                orderBy: { orden: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return { productos: productosAdquiridos, compras: compras, usuario: usuario, productosMembresia: contenidoAccesible };
}