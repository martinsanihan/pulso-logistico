'use client';

import { useState } from 'react';
import { solicitarCompra } from '@/app/lib/actions';

export default function SolicitarCompraModal({ productoId, nombreProducto }: { productoId: string, nombreProducto: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (status === 'success') {
        return (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-800 text-center">
                <p className="font-bold">¡Solicitud Enviada!</p>
                <p className="text-sm">Revisa tu correo para más detalles.</p>
            </div>
        );
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
                Solicitar Adquisición
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completar Solicitud</h2>
                        <p className="text-sm text-gray-500 mb-6">Estás solicitando: {nombreProducto}</p>

                        <form action={async (formData) => {
                            setStatus('loading');
                            const res = await solicitarCompra(formData);
                            if (res.success) setStatus('success');
                            else {
                                alert(res.error);
                                setStatus('idle');
                            }
                        }} className="space-y-4">
                            <input type="hidden" name="productoId" value={productoId} />
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Email de Contacto</label>
                                <input name="email" type="email" required className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none transition" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                                    <input name="telefono" type="tel" required className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">RUT</label>
                                    <input name="rut" placeholder="12.345.678-9" required className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none transition" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Mensaje (Opcional)</label>
                                <textarea name="mensaje" rows={2} className="w-full border-b-2 border-gray-100 p-2 focus:border-blue-500 outline-none transition resize-none" />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    disabled={status === 'loading'}
                                    type="submit" 
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {status === 'loading' ? 'Enviando...' : 'Confirmar Solicitud'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}