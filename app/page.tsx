import Link from "next/link"
import Hero from "./components/Hero"
import ProductCard from "./components/ProductCard"
import { prisma } from "@/lib/prisma"
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth()
  console.log("estado de la sesión", session)

  const productos = await prisma.producto.findMany()
  const auspiciadores = await prisma.auspiciador.findMany();

  console.log(productos, auspiciadores)

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Artículos</h2>
          <span className="text-sm text-gray-500">Mostrando {productos.length} resultados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((prod) => (
            <ProductCard
              key={prod.id}
              nombre={prod.nombre}
              descripcion={prod.desc || "sin descripción"}
              categoria={prod.categoria || "sin categoria"}
              subcategoria={prod.subcategoria || "sin subcategoria"}
              precio={prod.precio}
              stock={prod.stock}
            />
          ))}
        </div>
      </div>

      <div className="m-4">
        <h2 className="text-md font-bold text-gray-400 text-center">Nuestros Auspiciadores</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-12 grayscale hover:grayscale-0 transition-all duration-500 mt-10 items-center">
        {auspiciadores.map((ausp) => (
          <div key={ausp.id} className="relative h-16 w-32 flex items-center justify-between p-2">
            {ausp.logo ? (
              <Link href={'https://'+ausp.web || 'https://www.google.com'} className="relative h-16 w-32">
                <img
                  src={ausp.logo}
                  alt={ausp.nombre}
                  className="max-h-full max-w-full object-contain opacity-60 hover:opacity-100 transition opacity"
                />
              </Link>
            ) : (
              <span className="text-xl font-bold text-gray-300">{ausp.nombre}</span>
            )}
          </div>
        ))}

      </div>

    </main>

  )
}
