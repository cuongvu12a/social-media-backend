/*
  Warnings:

  - You are about to drop the column `filmId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_filmId_fkey`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `filmId`;
