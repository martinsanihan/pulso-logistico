'use client';

import { useActionState } from "react";
import { updateProfile } from "@/app/lib/actions";

export default function EditForm({user}: {user:any}) {
    const [errorMessage, formAction, isPending] = useActionState(
        updateProfile,
        undefined
    );

    return (
        <form className="mt-8 space-y-4" action={formAction}>
            <div className="space-y-4 rounded-md shadow-sm">
                <label htmlFor='name' className="sr-only">Name</label>
                <p className="text-sm">Nombre</p>
                <input
                    id='name'
                    name='name'
                    type='text'
                    defaultValue={user.name || ''}
                    required
                    className="relative block w-full rounded border border-gray-300 p-3 text-gray-900 focus:z-10 focus:border-blue-500
                    focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
            </div>
            <div className="space-y-4 rounded-md shadow-sm">
                <label htmlFor='email' className="sr-only">E-mail</label>
                <p className="text-sm">E-mail</p>
                <input
                    id='email'
                    name='email'
                    type='email'
                    defaultValue={user.email || ''}
                    required
                    className="relative block w-full rounded border border-gray-300 p-3 text-gray-900 focus:z-10 focus:border-blue-500
                    focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
            </div>
            <div className="space-y-4 rounded-md shadow-sm">
                <label htmlFor='username' className="sr-only">username</label>
                <p className="text-sm">Nombre de Usuario</p>
                <input
                    id='username'
                    name='username'
                    type='text'
                    defaultValue={user.username || ''}
                    required
                    className="relative block w-full rounded border border-gray-300 p-3 text-gray-900 focus:z-10 focus:border-blue-500
                    focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
            </div>

            {errorMessage && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    className='group relative flex w-full justify-center rounded-md border border-transparent
                    px-4 py-2 text-sm font-medium text-white bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                    focus:ring-offset-2'
                >
                    Aplicar Cambios
                </button>
            </div>
        </form>
    );
}