const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Super Admin
  const adminEmail = 'admin@roadmate.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        adminProfile: {
          create: {
            name: 'Super Admin',
          }
        }
      }
    });
    console.log('Super Admin created:', admin.email);
  } else {
    console.log('Super Admin already exists.');
  }

  // 2. Create Service Categories
  const categories = [
    'Garage',
    'Car Wash',
    'Towing',
    'PUC Center',
    'Denting and Painting',
    'Service Center',
    'Showroom',
    'Driver Service'
  ];

  for (const cat of categories) {
    const exists = await prisma.serviceCategory.findUnique({ where: { name: cat } });
    if (!exists) {
      await prisma.serviceCategory.create({
        data: { name: cat }
      });
      console.log(`Category created: ${cat}`);
    } else {
      console.log(`Category exists: ${cat}`);
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
