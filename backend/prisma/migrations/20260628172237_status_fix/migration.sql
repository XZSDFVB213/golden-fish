-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EnumOrderStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "EnumOrderStatus" ADD VALUE 'DELIVERY';
ALTER TYPE "EnumOrderStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "EnumOrderStatus" ADD VALUE 'CANCELED';
