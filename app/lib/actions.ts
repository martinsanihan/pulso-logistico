'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'; // <--- Importamos esto

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 1. Intentamos loguear con redirect: false
    // Esto significa: "Si sale bien, no hagas nada. Si sale mal, lanza error".
    await signIn('credentials', formData);
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas.';
        default:
          return 'Algo salió mal.';
      }
    }
    // Si el error NO es de Auth (ej: problema de base de datos), lo relanzamos
    throw error;
  }

  // 2. Si llegamos aquí, es porque signIn no lanzó error (Login Exitoso)
  // Así que forzamos nosotros la redirección al inicio.
  console.log('redirigiendo');
  redirect('/');
}