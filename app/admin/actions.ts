'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const nombre = formData.get('nombre') as string;
  const precio = parseInt(formData.get('precio') as string);
  const stock = parseInt(formData.get('stock') as string);
  const categoria = formData.get('categoria') as string;

  await prisma.producto.update({
    where: { id },
    data: { nombre, precio, stock, categoria },
  });

  revalidatePath('/admin');
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
  const stock = parseInt(formData.get('stock') as string);
  const desc = formData.get('desc') as string;
  const categoria = formData.get('categoria') as string;

  try {
    await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock,
        desc,
        categoria,
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "No se pudo crear el producto" };
  }
}