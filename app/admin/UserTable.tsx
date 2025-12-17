'use client';

import { updateUserStatus, deleteUser } from "@/app/lib/actions";

export default function UserTable({ users }: { users: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-900">Nombre</th>
            <th className="px-4 py-2 font-medium text-gray-900">Email</th>
            <th className="px-4 py-2 font-medium text-gray-900">Estado</th>
            <th className="px-4 py-2 font-medium text-gray-900">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 text-gray-700">{user.name || 'Sin nombre'}</td>
              <td className="px-4 py-2 text-gray-700">{user.email}</td>
              <td className="px-4 py-2">
                <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 ${
                  user.status === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-2 space-x-2">
                {user.status === 'pendiente' ? (
                  <button
                    onClick={() => updateUserStatus(user.id, 'aprobado')}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Aprobar
                  </button>
                ) : (
                  <button
                    onClick={() => updateUserStatus(user.id, 'pendiente')}
                    className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                  >
                    Suspender
                  </button>
                )}

                <button
                    onClick={async () => {
                    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.email}? Esta acción no se puede deshacer.`)) {
                        const result = await deleteUser(user.id);
                        if (result?.error) alert(result.error);
                    }
                    }}
                    className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                >
                    Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}