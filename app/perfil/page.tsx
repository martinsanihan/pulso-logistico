// import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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
      <div className="bg-white shadow rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
        
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

      </div>
    </div>
  )
}