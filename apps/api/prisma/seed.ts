import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PW = 'Motanaqil@2026';

async function main() {
  const hash = await bcrypt.hash(PW, 10);

  const city = await prisma.city.upsert({
    where: { slug: 'riyadh' },
    update: {},
    create: { nameAr: 'الرياض', slug: 'riyadh' },
  });

  const services = [
    { nameAr: 'نقل عفش كامل', slug: 'full-move', basePrice: 500, description: 'نقل شامل مع فك وتركيب' },
    { nameAr: 'فك وتركيب', slug: 'assembly', basePrice: 200, description: 'فك وتركيب الأثاث' },
    { nameAr: 'تغليف أثاث', slug: 'packing', basePrice: 300, description: 'تغليف احترافي' },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, cityId: city.id },
    });
  }

  const users = [
    { email: 'admin@motanaqil.com', phone: '+966500000001', role: UserRole.ADMIN, firstName: 'محمد', lastName: 'الإدارة' },
    { email: 'customer@motanaqil.com', phone: '+966500000002', role: UserRole.CUSTOMER, firstName: 'أحمد', lastName: 'العميل' },
    { email: 'driver@motanaqil.com', phone: '+966500000003', role: UserRole.DRIVER, firstName: 'خالد', lastName: 'السائق' },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: hash, cityId: city.id },
    });
  }

  console.log('✅ Seed complete. Password for all:', PW);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
