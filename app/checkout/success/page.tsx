import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: { productId: string } }) {
  const session = await auth();
  const productId = searchParams.productId;

  if (!session?.user?.id || !productId) redirect("/");

  // Buscamos el producto para obtener el precio real
  const producto = await prisma.producto.findUnique({ where: { id: productId } });

  if (producto) {
    // REGISTRAMOS LA COMPRA EN LA BASE DE DATOS
    await prisma.compra.create({
      data: {
        userId: session.user.id,
        productoId: producto.id,
        precioPagado: producto.precio,
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <span className="text-5xl">✅</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
      <p className="text-gray-600 mb-8">Tu reporte ya está disponible en tu panel de control.</p>
      <a 
        href="/dashboard" 
        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Ir a mis reportes
      </a>
    </div>
  );
}