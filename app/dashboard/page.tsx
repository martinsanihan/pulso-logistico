import { getHistorialUsuario } from "@/app/lib/data";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const historial = await getHistorialUsuario();
  if (!historial) redirect("/login");

  const compras = historial?.compras;
  const productosComprados = historial?.productos;
  const productosMembresia = historial?.productosMembresia
  const usuario = historial?.usuario;


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Usuario</h1>
        <p className="text-gray-500">Bienvenido a Pulso Logístico. Aquí están tus reportes y herramientas.</p>
      </header>

      {productosMembresia.length > 0 && (
        <section>
          <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold mb-4">Acceso por tu membresía: Tier {usuario.type}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosMembresia.map((p) => (
              <div key={p.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
                {/* Contenido de la tarjeta similar a tus ProductCards */}
                <h3 className="text-lg font-bold mt-1">{p.nombre}</h3>
                <p className="text-xs text-slate-500 mt-2">Incluye {p.contenidos.length} bloques exclusivos para tu membresía.</p>
                <Link href={`/producto/contenido?productoId=${p.id}`} className="block mt-6">
                    <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                        Ver Contenido
                    </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sección 1: Mis Productos Adquiridos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mis Productos Adquiridos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosComprados?.length === 0 ? (
            <p className="text-gray-400 italic">Aún no has adquirido ningún producto.</p>
          ) : (
            productosComprados?.map((c) => (
              <div key={c.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bold text-blue-600 uppercase">{c.producto.categoria}</span>
                <h3 className="text-lg font-bold mt-1">{c.producto.nombre}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{c.producto.desc}</p>

                {c.producto.archivo && (
                  <a
                    href={`/uploads/productos/${c.producto.archivo}`}
                    download
                    className="block w-full mt-2 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition text-center"
                  >
                    Descargar {c.producto.archivo.split('.').pop()?.toUpperCase()}
                  </a>
                )}
                
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sección 2: Historial Detallado */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Historial de Compras</h2>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Precio Pagado</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {compras?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.producto.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    ${c.precioPagado.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium ${c.estado === 'pendiente' ? 'bg-amber-50 text-amber-400' : 'bg-green-100 text-green-700'} rounded-full`}>
                      {c.estado === 'pendiente' ? 'Pendiente' : 'Completado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}