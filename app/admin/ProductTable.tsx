'use client';

import { useState } from "react";
import { updateProduct, deleteProduct, createProduct, deleteContent } from "./actions";
import ContentManagerModal from "./ContentManagerModla";

export default function ProductTable({ productos }: { productos: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedContentProduct, setSelectedContentProduct] = useState<any>(null);

  const openEditModal = (producto: any) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>+</span> Nuevo Producto
      </button>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-900">Nombre</th>
              <th className="px-4 py-2 font-medium text-gray-900">Precio</th>
              <th className="px-4 py-2 font-medium text-gray-900">Categoria</th>
              <th className="px-4 py-2 font-medium text-gray-900">Fecha de Creación</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="px-4 py-2 text-gray-700">{producto.nombre || 'Sin nombre'}</td>
                <td className="px-4 py-2 text-gray-700">${producto.precio?.toLocaleString('es-CL')}</td>
                <td className="px-4 py-2 text-gray-700">{producto.categoria || 'N/A'}</td>
                <td className="px-4 py-2 text-gray-700">
                  {new Date(producto.createdAt).toLocaleString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(producto)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setSelectedContentProduct(producto)}
                    className="text-violet-700 font-bold hover:text-violet-900"
                  >
                    + Contenido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir Nuevo Producto</h2>
          
          <form action={async (formData) => {
            await createProduct(formData);
            setIsAddModalOpen(false);
          }} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Reporte</label>
              <input name="nombre" placeholder="Ej: Barómetro Q1 2026" className="w-full border p-2 rounded-lg mt-1" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción Corta</label>
              <textarea name="desc" className="w-full border p-2 rounded-lg mt-1" rows={3} placeholder="Breve resumen del contenido..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                <input name="precio" type="number" placeholder="45000" className="w-full border p-2 rounded-lg mt-1" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select name="categoria" className="w-full border p-2 rounded-lg mt-1">
                <option value="Reportes">Reportes</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Data">Data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subir Archivo</label>
              <input name="file" className="w-full border p-2 rounded-lg mt-1 text-xs" type="file"></input>
            </div>

            <div className="flex gap-3 pt-6">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                Crear Producto
              </button>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            
            <form action={async (formData) => {
              await updateProduct(formData);
              closeModal();
            }} className="space-y-4">
              <input type="hidden" name="id" value={selectedProduct.id} />
              
              <div>
                <label className="block text-xs font-medium text-gray-500">Nombre del Producto</label>
                <input 
                  name="nombre" 
                  defaultValue={selectedProduct.nombre}
                  className="w-full border p-2 rounded mt-1" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Precio</label>
                  <input 
                    name="precio" 
                    type="number"
                    defaultValue={selectedProduct.precio}
                    className="w-full border p-2 rounded mt-1" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500">Actualizar Archivo (Opcional)</label>
                <input 
                  name="file" 
                  type="file"
                  className="w-full border p-2 rounded mt-1 text-xs"
                />
                {selectedProduct.archivo && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    Archivo actual: {selectedProduct.archivo}
                  </p>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                  Bloques de Contenido
                </h3>
                
                {selectedProduct?.contenidos && selectedProduct.contenidos.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedProduct.contenidos.map((bloque: any) => (
                      <li key={bloque.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700">{bloque.titulo}</span>
                          <span className="text-[10px] text-violet-600 font-bold uppercase">Tier {bloque.tipoRequerido}</span>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if(confirm(`¿Estás seguro de eliminar el bloque "${bloque.titulo}"?`)) {
                              await deleteContent(bloque.id);
                              closeModal();
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Eliminar bloque"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar Bloque
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded text-center">
                    Este producto no tiene bloques de contenido aún.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
                
                {/* Botón Eliminar dentro del Pop-up */}
                <button 
                  type="button"
                  onClick={async () => {
                    if(confirm("¿Estás seguro de eliminar este producto?")) {
                      await deleteProduct(selectedProduct.id);
                      closeModal();
                    }
                  }}
                  className="bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100"
                >
                  Eliminar Producto
                </button>

                <button 
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 text-sm hover:underline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedContentProduct && (
        <ContentManagerModal 
            producto={selectedContentProduct} 
            onClose={() => setSelectedContentProduct(null)} 
        />
    )}
        </div>
  );
}