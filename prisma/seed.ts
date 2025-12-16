import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Encriptar la contraseña "123456"
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 2. Crear el usuario Admin
  await prisma.user.upsert({
    where: { email: 'admin@pulso.cl' },
    update: {}, // Si ya existe, no hace nada
    create: {
      email: 'admin@pulso.cl',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'admin',
      status: 'aprobado',
      username: 'adminpulsologis'
    },
  })
  
  console.log('✅ Usuario Admin creado: admin@pulso.cl / 123456')
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