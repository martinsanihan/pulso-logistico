import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SolicitarCompraModal from "./solicitarCompraModal";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ pid?: string }>;
}

export default async function Producto({ searchParams }: PageProps ) {
    const { pid } = await searchParams;

    if (!pid) {
        return "producto no encontrado";
    }

    const infoProducto = await prisma.producto.findUnique({
        where: { id: pid }
    });

    if (!infoProducto) {
        return "producto no encontrado";
    }

    const extension = infoProducto.archivo?.split('.').pop()?.toLowerCase();

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
            <Link 
                href="/productos" 
                className="text-sm text-blue-600 hover:underline mb-8 inline-block"
            >
                ← Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                {/* Columna Izquierda: Imagen/Vista Previa */}
                <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border border-gray-100 p-5">
                    <img src={extension === 'csv' || extension === 'pdf' ? `${extension}.svg` : 'nofile.svg'} width='150px' alt={extension} className="mx-auto"></img>
                </div>

                {/* Columna Derecha: Información y Compra */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
                        {infoProducto.categoria || 'Reporte General'}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        {infoProducto.nombre}
                    </h1>
                    
                    <p className="text-gray-600 mt-6 leading-relaxed">
                        {infoProducto.desc || 'No hay descripción disponible para este producto.'}
                    </p>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium">Precio</p>
                                <p className="text-3xl font-black text-gray-900">
                                    ${infoProducto.precio.toLocaleString('es-CL')}
                                </p>
                            </div>
                        </div>

                        <SolicitarCompraModal 
                            productoId={infoProducto.id}
                            nombreProducto={infoProducto.nombre}
                        />

                        <p className="text-md my-2 text-center text-neutral-500">ó</p>

                        <Link href='/membresías'>
                            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                Mejorar Membresía
                            </button>
                        </Link>
                        
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Pago seguro procesado por Pulso Logístico. Entrega inmediata tras la confirmación.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );


}