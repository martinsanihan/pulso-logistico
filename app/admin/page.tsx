import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import UserTable from '@/app/admin/UserTable';
import ProductTable from "@/app/admin/ProductTable";

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
                { NOT: { id: session?.user?.id } },
                { NOT: { status: 'removed' } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    const productos = await prisma.producto.findMany({
        distinct: ['id'],
        where: { activo: true }
    });

    console.log("usuarios y productos", users, productos);

    return (
        <div className="p-8 space-y-10">
            <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
            <UserTable users={users} />

            <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
            <ProductTable productos={productos} />
        </div>
        
    );

}