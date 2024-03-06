/*
  Warnings:

  - You are about to drop the column `name` on the `colors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[color]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[size]` on the table `sizes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "colors" DROP COLUMN "name",
ADD COLUMN     "color" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "colors_color_key" ON "colors"("color");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_size_key" ON "sizes"("size");
