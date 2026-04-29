-- CreateEnum
CREATE TYPE "RoommateRelationshipStatus" AS ENUM ('Active', 'Ended');

-- CreateTable
CREATE TABLE "RoommateRelationship" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "status" "RoommateRelationshipStatus" NOT NULL DEFAULT 'Active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "RoommateRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoommateRelationship_userAId_idx" ON "RoommateRelationship"("userAId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_userBId_idx" ON "RoommateRelationship"("userBId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_dormId_idx" ON "RoommateRelationship"("dormId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_status_idx" ON "RoommateRelationship"("status");

-- CreateIndex
CREATE INDEX "RoommateRequest_senderId_idx" ON "RoommateRequest"("senderId");

-- CreateIndex
CREATE INDEX "RoommateRequest_recipientId_idx" ON "RoommateRequest"("recipientId");

-- CreateIndex
CREATE INDEX "RoommateRequest_dormId_idx" ON "RoommateRequest"("dormId");

-- CreateIndex
CREATE INDEX "RoommateRequest_status_idx" ON "RoommateRequest"("status");

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
