CREATE TABLE "dl_Blog" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "dl_Blog_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "dl_Blog_slug_key" ON "dl_Blog"("slug");
