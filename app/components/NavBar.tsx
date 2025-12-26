import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default async function NavBar() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id || '' },
    });

    if (!session) {
        return (
            <nav className="bg-violet-950 flex justify-between text-xl font-bold px-5 py-5">
                <Link href="/">
                    <img src="https://www.conectalogistica.cl/content/uploads/2024/08/logo-light.png" alt="Logo Conecta Logística" width="150px"/>
                </Link>
                <ul className="flex justify-between items-center p-1 text-white space-x-10">
                    <li className=""><Link href="/">Inicio</Link></li>
                    <li className=""><Link href="/productos">Catálogo</Link></li>
                    <li className=""><Link href="/login">Iniciar Sesión</Link></li>

                </ul>

            </nav>
        );
    }
    else {
        return (
            <nav className="bg-violet-950 flex justify-between text-xl font-bold px-5 py-5">
                <Link href="/">
                    <img src="https://www.conectalogistica.cl/content/uploads/2024/08/logo-light.png" alt="Logo Conecta Logística" width="150px"/>
                </Link>
                <ul className="flex justify-between items-center p-1 text-white space-x-10">
                    <li className=""><Link href="/">Inicio</Link></li>
                    <li className=""><Link href="/productos">Catálogo</Link></li>
                    <li className=""><Link href="/dashboard">Panel de Usuario</Link></li>
                    <li className=""><Link href="/perfil">Perfil</Link></li>

                </ul>

            </nav>
        );
    }
    
}