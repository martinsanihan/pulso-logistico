import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import UserTable from '@/app/admin/UserTable';
import ProductTable from "@/app/admin/ProductTable";
import PurchaseTable from "./PurchaseTable";

export default async function Admin() {
    const session = await auth();

    if (!session) {
        redirect('/');
    }

    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true }
    })

    if (user?.role !== 'admin') {
        redirect('/');
    }

    const users = await prisma.user.findMany({
        where: {
            AND: [
                { NOT: { status: 'removed' } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    const productos = await prisma.producto.findMany({
        distinct: ['id'],
        where: { activo: true },
        include: { contenidos: true },
        orderBy: { createdAt: 'desc' }
    });

    const compras = await prisma.compra.findMany({
        where: { estado: 'pendiente' },
        include: { producto: true },
        orderBy: { createdAt: 'desc' }
    });

    const categorias = await prisma.categoria.findMany();

    return (
        <div className="p-8 space-y-10">
            <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
            <UserTable users={users} />

            <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
            <ProductTable productos={productos} categorias={categorias}/>
            
            <h1 className="text-2xl font-bold mb-6">Compras Pendientes</h1>
            <PurchaseTable compras={compras}/>
        </div>
        
    );

}