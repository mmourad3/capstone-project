-- CreateTable
CREATE TABLE "FavoriteDorm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dormId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteDorm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteDorm_userId_idx" ON "FavoriteDorm"("userId");

-- CreateIndex
CREATE INDEX "FavoriteDorm_dormId_idx" ON "FavoriteDorm"("dormId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteDorm_userId_dormId_key" ON "FavoriteDorm"("userId", "dormId");

-- AddForeignKey
ALTER TABLE "FavoriteDorm" ADD CONSTRAINT "FavoriteDorm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDorm" ADD CONSTRAINT "FavoriteDorm_dormId_fkey" FOREIGN KEY ("dormId") REFERENCES "DormListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
