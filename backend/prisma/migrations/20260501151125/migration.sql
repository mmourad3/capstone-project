/*
  Warnings:

  - Added the required column `updatedAt` to the `CarpoolPassenger` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `passengerGender` on the `CarpoolPassenger` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CarpoolPassenger" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "passengerGender",
ADD COLUMN     "passengerGender" "Gender" NOT NULL;

-- CreateIndex
CREATE INDEX "CarpoolListing_genderPreference_idx" ON "CarpoolListing"("genderPreference");

-- CreateIndex
CREATE INDEX "CarpoolPassenger_passengerId_status_idx" ON "CarpoolPassenger"("passengerId", "status");

-- CreateIndex
CREATE INDEX "User_role_university_region_idx" ON "User"("role", "university", "region");

-- CreateIndex
CREATE INDEX "User_role_gender_idx" ON "User"("role", "gender");
