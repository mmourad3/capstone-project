/*
  Warnings:

  - You are about to drop the `DormApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoommateRequestStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Cancelled');

-- DropForeignKey
ALTER TABLE "DormApplication" DROP CONSTRAINT "DormApplication_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "DormApplication" DROP CONSTRAINT "DormApplication_dormId_fkey";

-- DropForeignKey
ALTER TABLE "DormApplication" DROP CONSTRAINT "DormApplication_ownerId_fkey";

-- DropTable
DROP TABLE "DormApplication";

-- CreateTable
CREATE TABLE "RoommateRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "status" "RoommateRequestStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "RoommateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoommateRequest_senderId_recipientId_dormId_key" ON "RoommateRequest"("senderId", "recipientId", "dormId");

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
