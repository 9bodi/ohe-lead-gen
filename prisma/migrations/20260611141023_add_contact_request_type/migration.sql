-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN     "requestType" TEXT,
ALTER COLUMN "company" DROP NOT NULL;
