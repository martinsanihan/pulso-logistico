import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ProductCard from "../components/ProductCard";

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Catálogo</h1>
        <p className="mt-4 text-lg text-gray-600">
          Adquiere los ... más recientes del sector logístico nacional.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((producto) => (
          <ProductCard
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            descripcion={producto.desc || "sin descripción"}
            categoria={producto.categoria || "sin categoria"}
            precio={producto.precio}
          />
        ))}
      </div>
    </div>
  );
}