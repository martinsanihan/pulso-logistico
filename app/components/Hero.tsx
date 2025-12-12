import Link from 'next/link';

export default function Hero() {
    return (
        <div className='bg-violet-600 text-white py-20'>
            <div className='mx-auto px-4 text-center'>
                <h1 className='font-bold text-5xl'>
                    Pulso Logístico
                </h1>
                <p className='py-4 mb-8'>
                    Una Iniciativa de Conecta Logística
                </p>
                <Link href="/catalogo"
                className='bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors'>
                    Ver Productos
                </Link>
            </div>
        </div>
    );
}