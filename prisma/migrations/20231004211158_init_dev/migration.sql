/*
  Warnings:

  - The `typeUser` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "typeUser",
ADD COLUMN     "typeUser" TEXT NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
