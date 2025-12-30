import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {

  // Crear o actualizar Usuario Admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@pulsologistico.cl' },
    update: {
      password: hashedPassword,
      role: 'admin',
      status: 'aprobado'
    },
    create: {
      email: 'admin@pulsologistico.cl',
      name: 'Administrador Pulso',
      password: hashedPassword,
      role: 'admin',
      status: 'aprobado',
      username: 'admin_pulso'
    },
  })

  // Crear Productos
  const productsData = [
    {
      id: '9a0d6c5f-400d-48aa-b153-03e5c12fb978',
      nombre: 'Barómetro Logístico Q4 2025',
      desc: 'Análisis detallado de costos de transporte y tendencias de fin de año.',
      precio: 45000,
      categoria: 'Reportes',
      archivo: 'images.jpeg'
    },
    {
      id: '9d2c11a6-3c9d-42f8-9397-0648386b9350',
      nombre: 'Planilla de Optimización de Rutas',
      desc: 'Herramienta en Excel con macros para cálculo de rutas eficientes.',
      precio: 25000,
      categoria: 'Herramientas',
      archivo: 'images.jpeg'
    },
    {
      id: 'd3829e2c-0674-4c63-877c-576266b817ef',
      nombre: 'Informe: Impacto del E-commerce en Bodegaje',
      desc: 'Estudio sobre la demanda de espacios de última milla en Santiago.',
      precio: 32000,
      categoria: 'Reportes',
      archivo: 'images.jpeg'
    },
    {
      id: '2b947c5a-ab0a-4a5c-b8bc-f23a39b0d831',
      nombre: 'Base de Datos: Operadores Logísticos 2025',
      desc: 'Directorio actualizado con más de 200 contactos del sector.',
      precio: 55000,
      categoria: 'Data',
      archivo: 'images.jpeg'
    },
    {
      id: 'df963540-fa97-4a6b-9842-90ab7f844e45',
      nombre: 'Guía de Buenas Prácticas: Almacenamiento Frío',
      desc: 'Normativas y estándares para la cadena de frío en Chile.',
      precio: 18000,
      categoria: 'Guías',
      archivo: 'images.jpeg'
    }
  ]

  for (const p of productsData) {
    await prisma.producto.upsert({
      where: { id: p.id },
      update: p,
      create: p

    })
  }

  // Crear Compras
  const userAdmin = await prisma.user.findUnique({
    where: { email: 'admin@pulsologistico.cl' }
  });

  const allProducts = await prisma.producto.findMany();

  if (userAdmin && allProducts.length >= 3) {

    const comprasData = [
      {
        id: 'fba39769-824f-457f-bf84-654ab8f0dc04',
        userId: userAdmin.id,
        productoId: allProducts[0].id,
        precioPagado: allProducts[0].precio,
        estado: 'pendiente',
        emailContacto: 'ihansanmartin.m@gmail.com'
      },
      {
        id: 'eeff762e-9363-4093-825a-e51e30de85a8',
        userId: userAdmin.id,
        productoId: allProducts[1].id,
        precioPagado: allProducts[1].precio,
        estado: 'pendiente',
        emailContacto: 'ihansanmartin.m@gmail.com'
      },
      {
        id: '5d69dfda-5e39-4b90-9077-8c74a5b53841',
        userId: userAdmin.id,
        productoId: allProducts[3].id,
        precioPagado: allProducts[3].precio,
        estado: 'completado',
        emailContacto: 'ihansanmartin.m@gmail.com'
      }
    ];


    for (const compra of comprasData) {
      await prisma.compra.upsert({
        where: { id: compra.id },
        update: compra,
        create: compra
      })
    }
  } else {
    console.warn('No se pudieron insertar compras: falta el usuario o productos.');
  }


  // Crear Auspiciadores

  await prisma.auspiciador.upsert({
    where: { web: 'https://www.conectalogistica.cl/' },
    update: {
      nombre: 'Conecta Logística',
      logo: 'https://www.conectalogistica.cl/content/uploads/2024/08/logo-dark.png',
      tipo: 'Afiliado',
      desc: 'Fundación Conecta Logística',
      web: 'https://www.conectalogistica.cl/'
    },
    create: {
      nombre: 'Conecta Logística',
      logo: 'https://www.conectalogistica.cl/content/uploads/2024/08/logo-dark.png',
      tipo: 'Afiliado',
      desc: 'Fundación Conecta Logística',
      web: 'https://www.conectalogistica.cl/'
    }
  })

  // Crear Categorías
  const categorias = await prisma.producto.findMany({
    distinct: ['categoria'],
    where: { categoria: { not: null } }
  })

  for (const c of categorias) {
    if (c.categoria) {
      await prisma.categoria.upsert({
        where: { nombre: c.categoria },
        update: {
          nombre: c.categoria
        },
        create: {
          nombre: c.categoria
        }
      })
    }
  }

  
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  