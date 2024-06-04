/*
  Warnings:

  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `productId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
