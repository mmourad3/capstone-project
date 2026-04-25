-- CreateEnum
CREATE TYPE "Role" AS ENUM ('dorm_seeker', 'dorm_provider', 'carpool');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "university" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT,
    "profilePicture" TEXT,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "courseName" TEXT,
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
    "posterName" TEXT NOT NULL,
    "posterEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "price" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "inquiries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DormListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DormApplication" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "DormApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarpoolListing" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverEmail" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "driverProfilePicture" TEXT,
    "driverGender" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
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
    "passengerName" TEXT NOT NULL,
    "passengerEmail" TEXT NOT NULL,
    "passengerPhone" TEXT NOT NULL,
    "passengerProfilePicture" TEXT,
    "passengerGender" TEXT NOT NULL,
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
CREATE INDEX "DormApplication_applicantId_idx" ON "DormApplication"("applicantId");

-- CreateIndex
CREATE INDEX "DormApplication_dormId_idx" ON "DormApplication"("dormId");

-- CreateIndex
CREATE INDEX "DormApplication_ownerId_idx" ON "DormApplication"("ownerId");

-- CreateIndex
CREATE INDEX "DormApplication_status_idx" ON "DormApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DormApplication_applicantId_dormId_key" ON "DormApplication"("applicantId", "dormId");

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
ALTER TABLE "DormApplication" ADD CONSTRAINT "DormApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DormApplication" ADD CONSTRAINT "DormApplication_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DormApplication" ADD CONSTRAINT "DormApplication_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolListing" ADD CONSTRAINT "CarpoolListing_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolPassenger" ADD CONSTRAINT "CarpoolPassenger_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolPassenger" ADD CONSTRAINT "CarpoolPassenger_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "CarpoolListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
