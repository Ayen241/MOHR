import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedSettings() {
  try {
    // Check if settings already exist
    const existingSettings = await prisma.settings.findFirst();

    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          companyName: 'MoHR Systems',
          companyEmail: 'admin@mohr.com',
          companyAddress: '',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          sessionTimeout: 30,
          require2FA: false,
          ipWhitelist: false,
          notifyLeaveRequests: true,
          notifyAttendanceAlert: true,
          notifySystemUpdates: true,
          notifyBirthdays: true,
        },
      });
      console.log('✅ Default settings created successfully');
    } else {
      console.log('ℹ️  Settings already exist, skipping...');
    }
  } catch (error) {
    console.error('Error seeding settings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSettings()
  .then(() => {
    console.log('Settings seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Settings seed failed:', error);
    process.exit(1);
  });
