'use client';

import { useState } from "react";
import { updateProduct, deleteProduct, createProduct, deleteContent } from "./actions";
import ContentManagerModal from "./ContentManagerModal";

export default function ProductTable({ productos, categorias }: { productos: any[], categorias: any[] }) {
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
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 mb-2"
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
                    Contenido por Membresía
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-xl w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir Nuevo Producto</h2>
          
          <form action={async (formData) => {
            await createProduct(formData);
            setIsAddModalOpen(false);
          }} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Reporte</label>
              <input name="nombre" placeholder="Ej: Barómetro Q1 2026" className="w-full border p-2 rounded-lg mt-1" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Precio</label>
                <input 
                  name="precio" 
                  type="number"
                  placeholder='Valor'
                  className="w-full border p-2 rounded mt-1" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500">Categoría</label>
                <select className="w-full border p-2 rounded mt-1">
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                  ))}
                  <option key={0} value={'N/A'}>N/A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500">Subir Archivo</label>
                <input 
                  name="file" 
                  type="file"
                  className="w-full border p-2 rounded mt-1 text-xs"
                  required
                />
                </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500">Descripción</label>
              <textarea
                name="descripcion"
                placeholder='Descripción del Producto'
                className="w-full border p-2 rounded mt-1"
                required

              />
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
          <div className="bg-white rounded-xl p-8 max-w-xl w-full shadow-2xl">
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

              <div className="grid grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-xs font-medium text-gray-500">Categoría</label>
                  <select name="categoria" className="w-full border p-2 rounded mt-1" defaultValue={selectedProduct.categoria || 'N/A'}>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                    <option key={0} value={'N/A'}>N/A</option>
                  </select>
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
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500">Descripción</label>
                <textarea
                  name="descripcion"
                  defaultValue={selectedProduct.desc}
                  className="w-full border p-2 rounded mt-1"
                  required

                />
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