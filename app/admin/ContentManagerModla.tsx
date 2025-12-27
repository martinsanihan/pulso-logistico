'use client';

import { useState } from 'react';
import { addContentToProduct } from './actions';

interface Props {
    producto: any;
    onClose: () => void;
}

export default function ContentManagerModal({ producto, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestionar Contenido</h2>
                        <p className="text-sm text-gray-500">Producto: {producto.nombre}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form action={async (formData) => {
                    const res = await addContentToProduct(formData);
                    if (res.success) onClose();
                }} className="space-y-6">
                    <input type="hidden" name="productoId" value={producto.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Título del Bloque</label>
                            <input name="titulo" placeholder="Ej: Resumen Trimestral" className="w-full border-gray-300 rounded-lg p-2.5 border mt-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Nivel de Acceso Requerido</label>
                            <select name="tipoRequerido" className="w-full border-gray-300 rounded-lg p-2.5 border mt-1">
                                <option value="0">Gratuito (Free)</option>
                                <option value="1">Intermedio (Tier 1)</option>
                                <option value="2">Completo (Tier 2)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Tipo de Contenido</label>
                            <select name="tipo" className="w-full border-gray-300 rounded-lg p-2.5 border mt-1">
                                <option value="texto">Texto / Artículo</option>
                                <option value="indicador">Indicador (KPI)</option>
                                <option value="grafico">Visualización / Gráfico</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Orden de Aparición</label>
                            <input name="orden" type="number" defaultValue="0" className="w-full border-gray-300 rounded-lg p-2.5 border mt-1" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Contenido (Cuerpo)</label>
                        <textarea 
                            name="cuerpo" 
                            rows={6} 
                            placeholder="Escribe el contenido o pega el código del indicador aquí..." 
                            className="w-full border-gray-300 rounded-lg p-2.5 border mt-1 font-mono text-sm" 
                            required 
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 bg-violet-950 text-white py-3 rounded-xl font-bold hover:bg-violet-900 transition">
                            Guardar Bloque de Contenido
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}