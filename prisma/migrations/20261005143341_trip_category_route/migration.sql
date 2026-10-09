-- CreateEnum
CREATE TYPE "TripCategory" AS ENUM ('LEISURE', 'RELIGIOUS');

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "category" "TripCategory" NOT NULL DEFAULT 'LEISURE',
ADD COLUMN     "route" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Package_category_idx" ON "Package"("category");
