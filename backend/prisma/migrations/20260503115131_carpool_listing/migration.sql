/*
  Warnings:

  - You are about to drop the column `endDate` on the `CarpoolListing` table. All the data in the column will be lost.
  - Made the column `returnTime` on table `CarpoolListing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CarpoolListing" DROP COLUMN "endDate",
ALTER COLUMN "returnTime" SET NOT NULL;
