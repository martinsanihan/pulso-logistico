'use client';

import Link from 'next/link'
import { useActionState } from 'react'
import { authenticate } from '@/app/lib/actions'
import { useSearchParams } from 'next/navigation'

export default function Login() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const success = searchParams.get('success');
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

                    {success === 'account-created' && (
                        <div className='rounded-md bg-green-50 p-4 mb-4 border border-green-200'>
                            <p className='text-sm text-green-800 font-medium text-center'>
                                Cuenta creada con éxito, espera a ser aprobado por un administrador para ingresar.
                            </p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className='rounded-md bg-transparent p-4'>
                            <div className='flex'>
                                <div className='text-sm text-red-700 font-medium'>
                                    {errorMessage}
                                </div>
                            </div>
                        </div>
                    )}

                    <Link href='/signup'>
                        <div className='text-center mt-4 mb-4'>
                            <p className='mt-2 text-xs text-gray-400 hover:underline'>¿No tienes cuenta? Registrate Aquí</p>
                        </div>
                    </Link>

                    <div className='flex gap-4'>
                        <input type="hidden" name="redirectTo" value={callbackUrl} />
                        <button
                            type='submit'
                            disabled={isPending}
                            className={`group relative flex w-full justify-center rounded-md border border-transparent
                            px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                            focus:ring-offset-2 ${isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                        >
                            {isPending ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}