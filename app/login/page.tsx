'use client';

// import { login } from './actions'
import Link from 'next/link'
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

export default function Login() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
            <div className='w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl'>
                <div className='text-center'>
                    <h2 className='text-3xl font-bold text-gray-900'>Bienvenido</h2>
                    <p className='mt-2 text-sm text-gray-600'>
                        Iniciar Sesión en Pulso Logístico
                    </p>
                </div>

                <form className='mt-8 space-y-4' action={formAction}>
                    <div className='space-y-4 rounded-md shadow-sm'>
                        <label htmlFor='email' className='sr-only'>E-mail</label>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            placeholder='correo@ejemplo.com'
                            autoComplete='email'
                            required
                            className='
                                relative block w-full rounded border border-gray-300 p-3 text-gray-900 focus:z-10 focus:border-blue-500
                                focus:outline-none focus:ring-blue-500 sm:text-sm
                            '
                        />
                    </div>
                    <div className='space-y-4 rounded-md shadow-sm'>
                        <label htmlFor='password' className='sr-only'>Contraseña</label>
                        <input
                            id='password'
                            name='password'
                            type='password'
                            placeholder='Contraseña'
                            autoComplete='current-password'
                            required
                            className='
                                relative block w-full rounded border border-gray-300 p-3 text-gray-900 focus:z-10 focus:border-blue-500
                                focus:outline-none focus:ring-blue-500 sm:text-sm
                            '
                        />
                    </div>

                    {errorMessage && (
                        <div className='rounded-md bg-red-50 p-4'>
                            <div className='flex'>
                                <div className='text-sm text-red-700 font-medium'>
                                    {errorMessage}
                                </div>
                            </div>
                        </div>
                    )}

                    <Link href='/login/signup'>
                        <div className='text-center mt-4 mb-4'>
                            <p className='mt-2 text-xs text-gray-400 hover:underline'>¿No tienes cuenta? Registrate Aquí</p>
                        </div>
                    </Link>

                    <div className='flex gap-4'>
                        <button
                            type='submit'
                            disabled={isPending}
                            // formAction={login}
                            className='group relative flex w-full justify-center rounded-md border border-transparent
                            bg-blue-600 px-4 py-2 text-sm font-medium text-white bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                            focus:ring-offset-2'
                        >
                            {isPending ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}