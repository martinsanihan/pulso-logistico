'use client';

import { useState } from 'react';
import { addContentToProduct, updateContent, deleteContent } from './actions';

export default function ContentManagerModal({ producto, onClose }: any) {
    const [editingBlock, setEditingBlock] = useState<any>(null); // Estado para el bloque en edición

    const resetForm = () => setEditingBlock(null);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl animate-in w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 overflow-y-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Bloques del Reporte</h2>
                    <div className="space-y-3">
                        {producto.contenidos?.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No hay contenido aún.</p>
                        ) : (
                            producto.contenidos.map((bloque: any) => (
                                <div key={bloque.id} className={`group p-3 rounded-2xl border transition-all ${editingBlock?.id === bloque.id ? 'bg-blue-50 border-accent-blue shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{bloque.titulo}</p>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingBlock(bloque)} className="p-1 hover:text-accent-blue">✏️</button>
                                            <button onClick={async () => { if(confirm("¿Eliminar este bloque?")) await deleteContent(bloque.id); }} className="p-1 hover:text-red-500">🗑️</button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Tier {bloque.tipoRequerido}</p>
                                </div>
                            ))
                        )}
                        <button onClick={resetForm} className="w-full mt-4 py-2 text-xs font-bold text-accent-blue border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                            + Añadir Nuevo Bloque
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                                {editingBlock ? 'Editar Bloque' : 'Nuevo Bloque'}
                            </h2>
                            <p className="text-sm font-black text-gray-500 mt-1">
                                {editingBlock ? `Modificando: ${editingBlock.titulo}` : 'Agrega información técnica al reporte'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-xl">✕</button>
                    </div>

                    <form action={async (formData) => {
                        const res = editingBlock ? await updateContent(formData) : await addContentToProduct(formData);
                        if (res.success) resetForm();
                    }} className="space-y-6">
                        {/* El ID oculto solo se envía si estamos editando */}
                        {editingBlock && <input type="hidden" name="id" value={editingBlock.id} />}
                        <input type="hidden" name="productoId" value={producto.id} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                                <input 
                                    name="titulo" 
                                    key={`tit-${editingBlock?.id || 'new'}`}
                                    defaultValue={editingBlock?.titulo || ""} 
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-accent-blue/10 transition-all font-medium" 
                                    required 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel de Acceso</label>
                                <select 
                                    name="tipoRequerido" 
                                    key={`tier-${editingBlock?.id || 'new'}`}
                                    defaultValue={editingBlock?.tipoRequerido || "0"} 
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3.5 border outline-none"
                                >
                                    <option value="0">Gratuito</option>
                                    <option value="1">Suscripción 1 (Bronce)</option>
                                    <option value="2">Suscripción 2 (Premium)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                                <select 
                                    name="tipo" 
                                    key={`tipo-${editingBlock?.id || 'new'}`}
                                    defaultValue={editingBlock?.tipo || "Parrafo"} 
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3.5 border outline-none"
                                >
                                    <option value="Parrafo">Parrafo</option>
                                    <option value="Visualización">Visualización</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Órden</label>
                                <input 
                                    name="orden" 
                                    key={`ord-${editingBlock?.id || 'new'}`}
                                    defaultValue={editingBlock?.orden || "0"} 
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-accent-blue/10 transition-all font-medium" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenido (Texto / HTML)</label>
                            <textarea 
                                name="cuerpo" 
                                rows={8}
                                key={`cuer-${editingBlock?.id || 'new'}`}
                                defaultValue={editingBlock?.cuerpo || ""}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 border font-mono text-sm outline-none focus:ring-2 focus:ring-accent-blue/10" 
                                required 
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-primary-deep text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-95">
                                {editingBlock ? 'Guardar Cambios' : 'Publicar Bloque'}
                            </button>
                            {editingBlock && (
                                <button type="button" onClick={resetForm} className="px-6 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                                    Descartar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}