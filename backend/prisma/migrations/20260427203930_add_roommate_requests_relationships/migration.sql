/*
  Warnings:

  - You are about to drop the column `userAId` on the `RoommateRelationship` table. All the data in the column will be lost.
  - You are about to drop the column `userBId` on the `RoommateRelationship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,dormId]` on the table `RoommateRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `RoommateRelationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seekerId` to the `RoommateRelationship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoommateRelationship" DROP CONSTRAINT "RoommateRelationship_userAId_fkey";

-- DropForeignKey
ALTER TABLE "RoommateRelationship" DROP CONSTRAINT "RoommateRelationship_userBId_fkey";

-- DropIndex
DROP INDEX "RoommateRelationship_userAId_idx";

-- DropIndex
DROP INDEX "RoommateRelationship_userBId_idx";

-- DropIndex
DROP INDEX "RoommateRequest_senderId_recipientId_dormId_key";

-- AlterTable
ALTER TABLE "RoommateRelationship" DROP COLUMN "userAId",
DROP COLUMN "userBId",
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "seekerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoommateFeedback" (
    "id" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "roommateId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "endReason" TEXT NOT NULL,
    "conflictType" TEXT,
    "importantFactor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoommateFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoommateFeedback_relationshipId_idx" ON "RoommateFeedback"("relationshipId");

-- CreateIndex
CREATE INDEX "RoommateFeedback_reviewerId_idx" ON "RoommateFeedback"("reviewerId");

-- CreateIndex
CREATE INDEX "RoommateFeedback_roommateId_idx" ON "RoommateFeedback"("roommateId");

-- CreateIndex
CREATE UNIQUE INDEX "RoommateFeedback_relationshipId_reviewerId_key" ON "RoommateFeedback"("relationshipId", "reviewerId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_seekerId_idx" ON "RoommateRelationship"("seekerId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_providerId_idx" ON "RoommateRelationship"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "RoommateRequest_senderId_dormId_key" ON "RoommateRequest"("senderId", "dormId");

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "RoommateRelationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_roommateId_fkey" FOREIGN KEY ("roommateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
