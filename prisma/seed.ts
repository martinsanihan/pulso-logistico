import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs' // <--- Importante: Importamos el encriptador

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Comenzando la siembra de datos...')

  // 1. Encriptamos la contraseña "123456"
  // El número 10 es el "costo" de encriptación (estándar seguro)
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 2. Crear (o actualizar) el Usuario Admin
  // Usamos 'upsert' para que no falle si corres el script 2 veces
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pulso.cl' }, // Buscamos por este email
    update: {}, // Si existe, no hacemos nada
    create: {
      email: 'admin@pulso.cl',
      name: 'Super Admin',
      password: hashedPassword, // ¡Guardamos la versión segura!
      role: 'admin',
      status: 'aprobado',
      username: 'admin_master'
    },
  })

  console.log('👤 Usuario Admin creado:', admin.email)

  // --- (Aquí abajo puedes dejar tus productos y auspiciadores si quieres) ---
  // ...
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })