/*
  Warnings:

  - You are about to drop the column `canvas` on the `Note` table. All the data in the column will be lost.
  - Made the column `content` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Note` DROP COLUMN `canvas`,
    MODIFY `content` VARCHAR(191) NOT NULL;
