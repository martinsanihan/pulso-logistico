'use client';

import { updateUserStatus, deleteUser } from "@/app/lib/actions";
import { switchRole, updateUserTier } from "./actions";

export default function UserTable({ users }: { users: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-900">Nombre</th>
            <th className="px-4 py-2 font-medium text-gray-900">Email</th>
            <th className="px-4 py-2 font-medium text-gray-900">Estado</th>
            <th className="px-4 py-2 font-medium text-gray-900">Rol</th>
            <th className="px-4 py-4 font-medium text-gray-900">Membresía</th>
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
              <td className="px-4 py-2 text-gray-700">
                {user.role}
              </td>
              <td className="px-4 py-2">
                <select
                  value={user.type}
                  onChange={async (e) => {
                    const newTier = parseInt(e.target.value);
                    const result = await updateUserTier(user.id, newTier);
                    if (result.error) alert(result.error);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                >
                  <option value={0}>Free</option>
                  <option value={1}>Tier 1</option>
                  <option value={2}>Tier 2</option>
                </select>
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

                {user.role !== 'admin' && (
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
                )}

                {user.role === 'admin' ? (
                  <button
                    onClick={async () => {
                      if (confirm(`Confirmar cambio de rol al admin ${user.name}`)) {
                        const result = await switchRole(user.id, 'user');
                        if (result?.error) alert(result.error);
                      }
                    }}
                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cambiar a usuario
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (confirm(`Confirmar cambio de rol al usuario ${user.name}`)) {
                        const result = await switchRole(user.id, 'admin');
                        if (result?.error) alert(result.error);
                      }
                    }}
                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cambiar a admin
                  </button>
                )

                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}