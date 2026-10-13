-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "coalition" TEXT,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "runningMate" TEXT;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "keyPoints" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "sourceLocator" TEXT;
