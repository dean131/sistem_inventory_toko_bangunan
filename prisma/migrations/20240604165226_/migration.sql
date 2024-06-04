/*
  Warnings:

  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_supplierId_fkey`;

-- AlterTable
ALTER TABLE `product` MODIFY `supplierId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `supplier` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
