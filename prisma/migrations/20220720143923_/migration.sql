/*
  Warnings:

  - A unique constraint covering the columns `[filmId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `filmId` VARCHAR(191) NULL,
    MODIFY `fileCategory` ENUM('THUMBNAIL_BOOK', 'EBOOK', 'MEDIA', 'MAIN_PHOTO', 'FILM', 'TRAILER') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `File_filmId_key` ON `File`(`filmId`);

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `Film`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
