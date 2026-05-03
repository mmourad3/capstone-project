-- CreateEnum
CREATE TYPE "Role" AS ENUM ('dorm_seeker', 'dorm_provider', 'carpool');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "RoommateRequestStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Cancelled');

-- CreateEnum
CREATE TYPE "RoommateRelationshipStatus" AS ENUM ('Active', 'Ended');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "university" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT,
    "profilePicture" TEXT,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleepSchedule" TEXT NOT NULL,
    "wakeUpTime" TEXT NOT NULL,
    "sleepTime" TEXT NOT NULL,
    "cleanliness" TEXT NOT NULL,
    "organizationLevel" TEXT NOT NULL,
    "socialLevel" TEXT NOT NULL,
    "guestFrequency" TEXT NOT NULL,
    "sharedSpaces" TEXT NOT NULL,
    "smoking" TEXT NOT NULL,
    "drinking" TEXT NOT NULL,
    "pets" TEXT NOT NULL,
    "dietaryPreferences" TEXT,
    "studyTime" TEXT NOT NULL,
    "noiseLevel" TEXT NOT NULL,
    "musicWhileStudying" TEXT NOT NULL,
    "temperaturePreference" TEXT NOT NULL,
    "sharingItems" TEXT NOT NULL,
    "allergies" TEXT,
    "interests" TEXT NOT NULL,
    "personalQualities" TEXT NOT NULL,
    "importantQualities" TEXT NOT NULL,
    "dealBreakers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompatibilityScore" (
    "id" TEXT NOT NULL,
    "seekerId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "matchReasons" TEXT NOT NULL,
    "potentialConflicts" TEXT NOT NULL,
    "dealBreakerViolations" TEXT NOT NULL,
    "categoryScores" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompatibilityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassScheduleBlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DormListing" (
    "id" TEXT NOT NULL,
    "posterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "price" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "genderPreference" TEXT NOT NULL DEFAULT 'any',
    "description" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "datePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivatedAt" TIMESTAMP(3),

    CONSTRAINT "DormListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteDorm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteDorm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoommateRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "status" "RoommateRequestStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoommateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoommateRelationship" (
    "id" TEXT NOT NULL,
    "seekerId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "status" "RoommateRelationshipStatus" NOT NULL DEFAULT 'Active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "RoommateRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoommateFeedback" (
    "id" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "roommateId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "endReason" TEXT NOT NULL,
    "conflictType" TEXT,
    "importantFactor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoommateFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarpoolListing" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "pickupSpot" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "endDate" TEXT,
    "time" TEXT NOT NULL,
    "returnTime" TEXT,
    "driverSchedule" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 0,
    "totalSeats" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "genderPreference" TEXT NOT NULL DEFAULT 'both',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarpoolListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarpoolPassenger" (
    "id" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "carpoolId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarpoolPassenger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_university_idx" ON "User"("university");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_userId_key" ON "Questionnaire"("userId");

-- CreateIndex
CREATE INDEX "Questionnaire_userId_idx" ON "Questionnaire"("userId");

-- CreateIndex
CREATE INDEX "CompatibilityScore_seekerId_idx" ON "CompatibilityScore"("seekerId");

-- CreateIndex
CREATE INDEX "CompatibilityScore_providerId_idx" ON "CompatibilityScore"("providerId");

-- CreateIndex
CREATE INDEX "CompatibilityScore_score_idx" ON "CompatibilityScore"("score");

-- CreateIndex
CREATE UNIQUE INDEX "CompatibilityScore_seekerId_providerId_key" ON "CompatibilityScore"("seekerId", "providerId");

-- CreateIndex
CREATE INDEX "ClassScheduleBlock_userId_idx" ON "ClassScheduleBlock"("userId");

-- CreateIndex
CREATE INDEX "DormListing_posterId_idx" ON "DormListing"("posterId");

-- CreateIndex
CREATE INDEX "DormListing_status_idx" ON "DormListing"("status");

-- CreateIndex
CREATE INDEX "DormListing_latitude_longitude_idx" ON "DormListing"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "FavoriteDorm_userId_idx" ON "FavoriteDorm"("userId");

-- CreateIndex
CREATE INDEX "FavoriteDorm_dormId_idx" ON "FavoriteDorm"("dormId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteDorm_userId_dormId_key" ON "FavoriteDorm"("userId", "dormId");

-- CreateIndex
CREATE INDEX "RoommateRequest_senderId_idx" ON "RoommateRequest"("senderId");

-- CreateIndex
CREATE INDEX "RoommateRequest_recipientId_idx" ON "RoommateRequest"("recipientId");

-- CreateIndex
CREATE INDEX "RoommateRequest_dormId_idx" ON "RoommateRequest"("dormId");

-- CreateIndex
CREATE INDEX "RoommateRequest_status_idx" ON "RoommateRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RoommateRequest_senderId_dormId_key" ON "RoommateRequest"("senderId", "dormId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_seekerId_idx" ON "RoommateRelationship"("seekerId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_providerId_idx" ON "RoommateRelationship"("providerId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_dormId_idx" ON "RoommateRelationship"("dormId");

-- CreateIndex
CREATE INDEX "RoommateRelationship_status_idx" ON "RoommateRelationship"("status");

-- CreateIndex
CREATE INDEX "RoommateFeedback_relationshipId_idx" ON "RoommateFeedback"("relationshipId");

-- CreateIndex
CREATE INDEX "RoommateFeedback_reviewerId_idx" ON "RoommateFeedback"("reviewerId");

-- CreateIndex
CREATE INDEX "RoommateFeedback_roommateId_idx" ON "RoommateFeedback"("roommateId");

-- CreateIndex
CREATE UNIQUE INDEX "RoommateFeedback_relationshipId_reviewerId_key" ON "RoommateFeedback"("relationshipId", "reviewerId");

-- CreateIndex
CREATE INDEX "CarpoolListing_driverId_idx" ON "CarpoolListing"("driverId");

-- CreateIndex
CREATE INDEX "CarpoolListing_university_region_status_idx" ON "CarpoolListing"("university", "region", "status");

-- CreateIndex
CREATE INDEX "CarpoolListing_date_idx" ON "CarpoolListing"("date");

-- CreateIndex
CREATE INDEX "CarpoolPassenger_passengerId_idx" ON "CarpoolPassenger"("passengerId");

-- CreateIndex
CREATE INDEX "CarpoolPassenger_carpoolId_idx" ON "CarpoolPassenger"("carpoolId");

-- CreateIndex
CREATE UNIQUE INDEX "CarpoolPassenger_passengerId_carpoolId_key" ON "CarpoolPassenger"("passengerId", "carpoolId");

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassScheduleBlock" ADD CONSTRAINT "ClassScheduleBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DormListing" ADD CONSTRAINT "DormListing_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDorm" ADD CONSTRAINT "FavoriteDorm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDorm" ADD CONSTRAINT "FavoriteDorm_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRequest" ADD CONSTRAINT "RoommateRequest_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateRelationship" ADD CONSTRAINT "RoommateRelationship_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "RoommateRelationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoommateFeedback" ADD CONSTRAINT "RoommateFeedback_roommateId_fkey" FOREIGN KEY ("roommateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolListing" ADD CONSTRAINT "CarpoolListing_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolPassenger" ADD CONSTRAINT "CarpoolPassenger_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolPassenger" ADD CONSTRAINT "CarpoolPassenger_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "CarpoolListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
