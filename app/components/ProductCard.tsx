import Link from 'next/link';

interface ProductProps {
    id: string,
    nombre: string,
    descripcion: string
    categoria: string,
    subcategoria: string,
    precio: number,
    stock: number
}

export default function ProductCard({ id, nombre, descripcion, categoria, subcategoria, precio, stock }: ProductProps) {
    return (
        <div className='border rounded p-4 hover:shadow-lg transition-shadow bg-white border-gray-300'>
            <span className='text-xs uppercase text-black font-bold'>
                {categoria}
            </span>
            <h3 className='text-lg mt-2 font-semibold text-black'>
                {nombre}
            </h3>

            <div className='aspect-square bg-gray-200 mt-4 mb-4 text-center py-20'>
                <span className='text-zinc-500'>
                    Vista Previa
                </span>
            </div>
            
            <div className='flex justify-between items-center'>
                <span className='text-lg font-bold text-blue-600'>
                    ${precio}
                </span>
                <Link href={`/producto?pid=${id}`}>
                    <button className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700'>
                        Ver
                    </button>
                </Link>
            </div>
            <span className='text-s text-gray-500'>
                Stock: {stock}
            </span>
        </div>
    );
}