/*
  Warnings:

  - You are about to drop the column `review` on the `RoommateFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `respondedAt` on the `RoommateRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoommateFeedback" DROP COLUMN "review";

-- AlterTable
ALTER TABLE "RoommateRequest" DROP COLUMN "respondedAt";
