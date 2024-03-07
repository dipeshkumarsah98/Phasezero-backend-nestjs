/*
  Warnings:

  - You are about to drop the column `productName` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `discount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productName",
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DATA TYPE INTEGER,
ALTER COLUMN "discount" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
