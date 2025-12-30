import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProductoPage({ searchParams }: any) {
    const { productoId } = await searchParams;
    const session = await auth();

    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id }
    })

    const userType = user?.type || 0;

    const producto = await prisma.producto.findUnique({
        where: { id: productoId },
        include: { contenidos: { orderBy: { orden: 'asc' } } }
    });

    if (!producto) return <div>Producto no encontrado</div>;


    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">{producto.nombre}</h1>
            
            <div className="space-y-8">
                {producto.contenidos.map((bloque) => {
                    const tieneAcceso = userType >= bloque.tipoRequerido;
                    console.log(bloque.cuerpo)
                    return (
                        <div key={bloque.id} className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                {bloque.titulo}
                                {!tieneAcceso && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Tier {bloque.tipoRequerido}</span>}
                            </h2>

                            {tieneAcceso ? (
                                <div className="prose max-w-none justify-evenly">
                                    {/* Aquí renderizas según el tipo (texto o indicadores) */}
                                    {bloque.tipo === 'Parrafo' && <p>{bloque.cuerpo}</p>}
                                    {bloque.tipo === 'Visualización' && <div className="bg-gray-50 flex justify-center"  dangerouslySetInnerHTML={{ __html: bloque.cuerpo }}></div>}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center">
                                    <p className="text-gray-500 mb-4">Este contenido es exclusivo para usuarios de Tier {bloque.tipoRequerido}.</p>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold">Mejorar Plan</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}