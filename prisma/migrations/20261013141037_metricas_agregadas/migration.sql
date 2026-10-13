-- CreateTable
CREATE TABLE "MetricDaily" (
    "day" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MetricDaily_pkey" PRIMARY KEY ("day","event","key")
);
