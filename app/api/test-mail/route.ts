import { sendMail } from "@/app/lib/mail"; // Asegúrate de que la ruta sea correcta
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Iniciando prueba de envío de correo...");

    await sendMail({
      to: "ihancamilo.sm@gmail.com", // Envíatelo a ti mismo para probar
      subject: "🚀 Prueba de Conexión - Pulso Logístico",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #2563eb;">¡Conexión Exitosa!</h1>
          <p>Este es un correo de prueba enviado desde <b>Next.js</b> usando <b>Google OAuth2</b>.</p>
          <p>Fecha y hora: ${new Date().toLocaleString()}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Proyecto: Pulso Logístico</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Correo enviado correctamente. Revisa tu bandeja de entrada (y la carpeta de spam)." 
    });

  } catch (error: any) {
    console.error("Error en la ruta de prueba:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Error desconocido al enviar el correo" 
    }, { status: 500 });
  }
}