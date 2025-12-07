-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'MoHR Systems',
    "companyEmail" TEXT NOT NULL DEFAULT 'admin@mohr.com',
    "companyAddress" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "sessionTimeout" INTEGER NOT NULL DEFAULT 30,
    "require2FA" BOOLEAN NOT NULL DEFAULT false,
    "ipWhitelist" BOOLEAN NOT NULL DEFAULT false,
    "notifyLeaveRequests" BOOLEAN NOT NULL DEFAULT true,
    "notifyAttendanceAlert" BOOLEAN NOT NULL DEFAULT true,
    "notifySystemUpdates" BOOLEAN NOT NULL DEFAULT true,
    "notifyBirthdays" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
