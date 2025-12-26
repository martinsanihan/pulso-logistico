// import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from '@/auth'
import { handleSignOut } from "../lib/actions";
import { prisma } from '@/lib/prisma'
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Perfil() {

  const session = await auth();

  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      username: true
    }
  })
  
  if (!user) redirect('/login');

  const iniciales = [];
  if (user.name) iniciales.push(user.name[0]);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="bg-white shadow rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 mb-5">
        
        <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-md">
          {iniciales}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.name}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center text-gray-600">
            <span className="font-medium">{user?.username}</span>
            <span className="hidden md:inline">•</span>
            <span>{user?.email}</span>
          </div>

          <div className="pt-2">
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium'>
              {user?.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <Link href="/perfil/edit">
            <span
              className="px-5 py-2 items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors border border-blue-100 rounded-lg hover:bg-blue-50"
            >
              Editar Perfil
            </span>
          </Link>
        </div>

        <div className="mt-4 md:mt-0">
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>

        </div>

        

      </div>
      {user?.role === 'admin' ?
        <div className="flex items-center justify-center p-5">
          <Link href="/admin">
            <span className="bg-blue-600 py-4 px-7 text-white rounded-xl hover:bg-blue-700 text-lg font-semibold">
              Panel de Administración
            </span>
          </Link>
        </div> :
        <div>
        </div>
      }
      
    </div>
  )
}