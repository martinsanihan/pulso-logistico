import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  const formData = await request.formData();
  const productId = formData.get("productId") as string;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // AQUÍ ES DONDE SE LLAMA AL SDK DE TRANSBANK O FLOW
  // const response = await transbank.initTransaction(amount, buyOrder, returnUrl);
  
  // POR AHORA: Simularemos que la pasarela nos devuelve una URL de éxito
  // En producción, aquí rediriges a la URL que te dé el medio de pago.
  console.log(`Iniciando compra de producto ${productId} para usuario ${session.user?.email}`);

  // Redirigimos a una página de "Procesando" o directamente al éxito para pruebas
  return NextResponse.redirect(new URL(`/checkout/success?productId=${productId}`, request.url));
}