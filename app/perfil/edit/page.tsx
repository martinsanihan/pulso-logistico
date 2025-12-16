import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditForm from "./editForm";

export default async function Edit() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id || ''
        },
        select: {
            name: true,
            email: true,
            username: true
        }
    })

    if (!user) return <div>Usuario no encontrado</div>;
    

    return (
        <div className="flex min-h-screen itemas-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Editar Perfil</h2>
                </div>

                <EditForm user={user} />
            </div>
        </div>
    );
}