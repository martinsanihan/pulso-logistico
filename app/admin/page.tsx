import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import UserTable from '@/app/admin/UserTable';

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
            NOT: { id: session?.user?.id }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
            <UserTable users={users} />
        </div>
    );

}