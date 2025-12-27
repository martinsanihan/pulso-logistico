'use client';

import { updatePurchaseStatus } from "./actions";

export default function PurchaseTable({ compras }: { compras: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-6">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Producto</th>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Contacto / RUT</th>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Precio</th>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Estado</th>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {compras.map((compra) => (
            <tr key={compra.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2">
                <div className="font-bold text-gray-900">{compra.producto.nombre}</div>
                <div className="text-xs text-gray-400">{new Date(compra.createdAt).toLocaleDateString()}</div>
              </td>
              <td className="px-4 py-2">
                <div className="text-gray-700">{compra.emailContacto}</div>
                <div className="text-xs text-gray-500">{compra.rut} | {compra.telefono}</div>
              </td>
              <td className="px-4 py-2 text-gray-700 font-medium">
                ${compra.precioPagado.toLocaleString('es-CL')}
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  compra.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                  {compra.estado.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-2">
                {compra.estado === 'pendiente' && (
                  <button
                    onClick={async () => {
                      if(confirm("¿Confirmas que recibiste el pago para este reporte?")) {
                        await updatePurchaseStatus(compra.id, 'completada');
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition"
                  >
                    Marcar Pagada
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {compras.length === 0 && (
        <p className="text-center py-10 text-gray-400 italic">No hay solicitudes de compra pendientes.</p>
      )}
    </div>
  );
}