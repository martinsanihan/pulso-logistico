import { verifyEmailToken } from "@/app/lib/actions";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>; 
}) {
  const { token } = await searchParams;

  const result = await verifyEmailToken(token);    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {result.success ? (
        <div className="bg-green-50 border border-green-200 p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-green-700 mb-4">¡Correo Verificado!</h1>
          <p className="mb-6">Tu dirección ha sido confirmada con éxito.</p>
          <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
            Iniciar Sesión
          </Link>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error de Verificación</h1>
          <p className="mb-6">{result.error || "Algo salió mal."}</p>
          <Link href="/register" className="text-blue-600 underline">
            Intentar registrarse de nuevo
          </Link>
        </div>
      )}
    </div>
  );
}