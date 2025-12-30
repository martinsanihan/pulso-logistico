import Link from 'next/link';
import { size } from 'zod/v4';

interface ProductProps {
    id: string,
    nombre: string,
    precio: number,
    descripcion: string,
    categoria: string,
    archivo: string
}

export default function ProductCard({ id, nombre, precio, descripcion, categoria, archivo }: ProductProps) {
    const extension = archivo?.split('.').pop()?.toLowerCase();


    return (
        <div className='border rounded p-4 hover:shadow-lg transition-shadow bg-white border-gray-300'>
            <span className='text-xs uppercase text-black font-bold'>
                {categoria}
            </span>
            <h3 className='text-lg mt-2 font-semibold text-black'>
                {nombre}
            </h3>

            <div className='aspect-square bg-gray-100 mt-4 mb-4 text-center py-25 items-center'>
                <img src={extension === 'pdf' || extension === 'csv' ? `${extension}.svg` : 'nofile.svg'} width='150px' alt={extension} className='mx-auto'></img>
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
        </div>
    );
}