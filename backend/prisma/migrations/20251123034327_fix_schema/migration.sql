/*
  Warnings:

  - You are about to drop the column `userId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RoomBooking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomBooking" DROP CONSTRAINT "RoomBooking_userId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "RoomBooking" DROP COLUMN "userId";
