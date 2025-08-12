/*
  Warnings:

  - Added the required column `name` to the `candidats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidats" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "photo_profile" TEXT;
