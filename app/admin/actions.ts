'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from 'fs/promises';
import path from 'path';
import { sendMail } from "../lib/mail";

export async function updatePurchaseStatus(purchaseId: string, newStatus: string) {
    try {
      const compra = await prisma.compra.findUnique({
        where: { id: purchaseId },
        select: { userId: true, productoId: true }
      });

      const comprador = await prisma.user.findUnique({
        where: { id: compra?.userId },
        select: { email: true }
      });

      const productoComprado = await prisma.producto.findUnique({
        where: { id: compra?.productoId },
        select: { nombre: true }
      });

      await prisma.compra.update({
          where: { id: purchaseId },
          data: { estado: newStatus }
      });

      sendMail({
        to: `${comprador?.email}`,
        subject: `Tu pago por la compra de ${productoComprado?.nombre} ha sido aprobado! - Pulso Logístico`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #2563eb;">Su compra ha sido aprobada por un administrador!</h1>
            <p>Producto: ${productoComprado?.nombre}</p>
            <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-CL')}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Este es un mensaje automático.</p>
          </div>
        `
      });

      sendMail({
        to: `${process.env.EMAIL_USER}`,
        subject: `La compra del usuario ${comprador?.email} ha sido aprobada`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #2563eb;">Una compra ha sido confirmada y aprobada por un admin</h1>
            <p>Producto: ${productoComprado?.nombre}</p>
            <p>Usuario: ${comprador?.email}</p>
            <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-CL')}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Este es un mensaje automático.</p>
          </div>
        `
      });
      
      revalidatePath('/admin');
      return { success: true };
    } catch (error) {
        console.error("Error al actualizar compra:", error);
        return { error: "No se pudo actualizar el estado de la compra." };
    }
}

export async function updateUserTier(userId: string, newTier: number) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { type: newTier }
        });
        
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar membresía:", error);
        return { error: "No se pudo actualizar el nivel de acceso." };
    }
}

export async function deleteContent(contentId: string) {
  try {
    await prisma.contenido.delete({
      where: { id: contentId },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo eliminar el bloque de contenido" };
  }
}

export async function addContentToProduct(formData: FormData) {
    const productoId = formData.get('productoId') as string;
    const titulo = formData.get('titulo') as string;
    const cuerpo = formData.get('cuerpo') as string;
    const tipo = formData.get('tipo') as string;
    const tipoRequerido = parseInt(formData.get('tipoRequerido') as string);
    const orden = parseInt(formData.get('orden') as string || '0');

    try {
        await prisma.contenido.create({
            data: {
                productoId,
                titulo,
                cuerpo,
                tipo,
                tipoRequerido,
                orden
            }
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error al añadir contenido:", error);
        return { error: "No se pudo añadir el contenido al producto" };
    }
}

export async function updateContent(formData: FormData) {
  const id = formData.get('id') as string;
  const titulo = formData.get('titulo') as string;
  const cuerpo = formData.get('cuerpo') as string;
  const tipo = formData.get('tipo') as string;
  const tipoRequerido = parseInt(formData.get('tipoRequerido') as string);
  const orden = parseInt(formData.get('orden') as string);

  try {
    await prisma.contenido.update({
      where: { id: id },
      data: {
        titulo, cuerpo, tipo, tipoRequerido, orden
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch(error) {
    console.error(error);
    return { error: "No se pudo actualizar el bloque" };
  }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const nombre = formData.get('nombre') as string;
  const precio = parseInt(formData.get('precio') as string);
  const desc = formData.get('descripcion') as string;
  const categoria = formData.get('categoria') as string;
  const file = formData.get('file') as File;

  try {
    const productoActual = await prisma.producto.findUnique({
        where: { id },
        select: { archivo: true }
    });

    const dataToUpdate: any = {
      nombre,
      precio,
      desc,
      categoria
    }

    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads/productos')
      const filePath = path.join(process.cwd(), 'public/uploads/productos', fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      dataToUpdate.archivo = fileName;

      if (productoActual?.archivo) {
        const oldPath = path.join(uploadDir, productoActual.archivo);
        try {
          await fs.access(oldPath);
          await fs.unlink(oldPath);
          console.log(`Archivo anterior eliminado: ${productoActual.archivo}`);
        } catch (error) {
          console.error("No se puede borrar el archivo.", error);
        }
      }
    }

    await prisma.producto.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/admin');
    return { success: true };
  } catch(error) {
    console.error("error al actualizar el producto", error);
    return { error: "no se pudo actualizar el producto" };
  }
}

export async function deleteProduct(id: string) {
  await prisma.producto.update({
    where: { id },
    data: { activo: false }
  });

  revalidatePath('/admin');
}

export async function createProduct(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio = parseInt(formData.get('precio') as string);
  const desc = formData.get('desc') as string;
  const categoria = formData.get('categoria') as string;
  const file = formData.get('file') as File;

  let fileName = '';
  if (file && file.size > 0) {
    fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads/productos', fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
  }

  try {
    await prisma.producto.create({
      data: {
        nombre,
        precio,
        desc,
        categoria,
        archivo: fileName
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo crear el producto" };
  }
}

export async function switchRole(userId: string, newRole: string) {

  try {
    const usuario = await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole
      },
      select: { email: true }
    });

    sendMail({
      to: `${usuario.email}`,
      subject: `Su rol ha sido cambiado a ${newRole} - Pulso Logístico`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #2563eb;">Su rol ha sido cambiado en la plataforma</h1>
          <p>Tu nuevo rol es ${newRole}</p>
          <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-CL')}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Este es un mensaje automático.</p>
        </div>
      `
    })

    revalidatePath('/admin');
    return { success: true };
  } catch(error) {
    console.error("no se pudo cambiar rol de usuario", error)
    return { error: "no se pudo cambiar rol de usuario" }
  }   
}