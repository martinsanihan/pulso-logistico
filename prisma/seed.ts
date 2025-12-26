import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando el sembrado de datos (Pulso Logístico)...')

  // 1. Crear o actualizar Usuario Admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
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

  console.log('✅ Usuario Admin configurado (Role: admin, Status: aprobado)')

  // 2. Crear Productos
  const productsData = [
    {
      nombre: 'Barómetro Logístico Q4 2025',
      desc: 'Análisis detallado de costos de transporte y tendencias de fin de año.',
      precio: 45000,
      stock: 20,
      categoria: 'Reportes'
    },
    {
      nombre: 'Planilla de Optimización de Rutas',
      desc: 'Herramienta en Excel con macros para cálculo de rutas eficientes.',
      precio: 25000,
      stock: 15,
      categoria: 'Herramientas'
    },
    {
      nombre: 'Informe: Impacto del E-commerce en Bodegaje',
      desc: 'Estudio sobre la demanda de espacios de última milla en Santiago.',
      precio: 32000,
      stock: 10,
      categoria: 'Reportes'
    },
    {
      nombre: 'Base de Datos: Operadores Logísticos 2025',
      desc: 'Directorio actualizado con más de 200 contactos del sector.',
      precio: 55000,
      stock: 30,
      categoria: 'Data'
    },
    {
      nombre: 'Guía de Buenas Prácticas: Almacenamiento Frío',
      desc: 'Normativas y estándares para la cadena de frío en Chile.',
      precio: 18000,
      stock: 18,
      categoria: 'Guías'
    }
  ]

  console.log('📦 Sembrando productos...')

  for (const p of productsData) {
    // Como 'nombre' no es @unique en tu esquema, 
    // primero verificamos si existe para evitar duplicados en cada ejecución del seed.
    const existente = await prisma.producto.findFirst({
      where: { nombre: p.nombre }
    })

    if (!existente) {
      await prisma.producto.create({
        data: p
      })
    }
  }

  console.log('✅ 5 Productos verificados/creados.')
  console.log('✨ Proceso de seed finalizado con éxito.')

  // ... (código anterior de creación de Admin y Productos)

  console.log('🛒 Generando historial de compras para el Dashboard...');

  // 1. Buscamos al admin y los productos que acabamos de asegurar
  const userAdmin = await prisma.user.findUnique({
    where: { email: 'admin@pulsologistico.cl' }
  });

  const allProducts = await prisma.producto.findMany();

  if (userAdmin && allProducts.length >= 3) {
    // Definimos compras ficticias usando los productos reales
    const comprasPrueba = [
      {
        userId: userAdmin.id,
        productoId: allProducts[0].id, // Barómetro Logístico Q4
        precioPagado: allProducts[0].precio,
      },
      {
        userId: userAdmin.id,
        productoId: allProducts[1].id, // Planilla de Optimización
        precioPagado: allProducts[1].precio,
      },
      {
        userId: userAdmin.id,
        productoId: allProducts[3].id, // Base de Datos Operadores
        precioPagado: allProducts[3].precio,
      }
    ];

    for (const dataCompra of comprasPrueba) {
      // Usamos 'create' directamente porque no hay un campo único en Compra
      // para identificar duplicados fácilmente en un seed simple
      await prisma.compra.create({
        data: dataCompra
      });
    }
    console.log('✅ 3 Compras de prueba insertadas con éxito.');
  } else {
    console.warn('⚠️ No se pudieron insertar compras: falta el usuario o productos.');
  }

  const auspiciadores = await prisma.auspiciador.findMany({
    select: { nombre: true }
  });

  if (!auspiciadores) {
    await prisma.auspiciador.create({
      data: {
        id: 'ausp-001',
        nombre: 'Conecta Logística',
        logo: 'https://www.conectalogistica.cl/content/uploads/2024/08/logo-light.png',
        tipo: 'Afiliado',
        "desc": 'Fundación Conecta Logística',
        web: 'https://www.conectalogistica.cl/',
      }
    });
  }
  else {
    console.warn('ya existen auspiciadores en la base de datos');
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

  