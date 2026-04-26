/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DormListing` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `DormListing` table. All the data in the column will be lost.
  - You are about to drop the column `inquiries` on the `DormListing` table. All the data in the column will be lost.
  - You are about to drop the column `posterEmail` on the `DormListing` table. All the data in the column will be lost.
  - You are about to drop the column `posterName` on the `DormListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DormListing" DROP COLUMN "createdAt",
DROP COLUMN "gender",
DROP COLUMN "inquiries",
DROP COLUMN "posterEmail",
DROP COLUMN "posterName",
ADD COLUMN     "datePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "genderPreference" TEXT NOT NULL DEFAULT 'any';
