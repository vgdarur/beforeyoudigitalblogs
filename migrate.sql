-- CreateTable
CREATE TABLE "dl_User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "dl_Network" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "apiKey" TEXT,
    "trackingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Deal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION,
    "originalPrice" DOUBLE PRECISION,
    "discountRatio" DOUBLE PRECISION,
    "couponCode" TEXT,
    "affiliateUrl" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "merchantId" TEXT NOT NULL,
    "networkId" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Click" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "device" TEXT,
    "dealId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "networkId" TEXT,

    CONSTRAINT "dl_Click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_FeedSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'CSV',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dl_FeedSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_FeedImportJob" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "itemsImported" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "feedSourceId" TEXT NOT NULL,

    CONSTRAINT "dl_FeedImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dl_Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dl_ZipcodeLog" (
    "id" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dl_ZipcodeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dl_User_email_key" ON "dl_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Session_sessionToken_key" ON "dl_Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "dl_VerificationToken_token_key" ON "dl_VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "dl_VerificationToken_identifier_token_key" ON "dl_VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Network_name_key" ON "dl_Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Network_slug_key" ON "dl_Network"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Merchant_name_key" ON "dl_Merchant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Merchant_slug_key" ON "dl_Merchant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Category_name_key" ON "dl_Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Category_slug_key" ON "dl_Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Deal_slug_key" ON "dl_Deal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "dl_Subscriber_email_key" ON "dl_Subscriber"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dl_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Session" ADD CONSTRAINT "dl_Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dl_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Deal" ADD CONSTRAINT "dl_Deal_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "dl_Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Deal" ADD CONSTRAINT "dl_Deal_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "dl_Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Deal" ADD CONSTRAINT "dl_Deal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "dl_Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Click" ADD CONSTRAINT "dl_Click_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "dl_Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Click" ADD CONSTRAINT "dl_Click_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "dl_Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_Click" ADD CONSTRAINT "dl_Click_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "dl_Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dl_FeedImportJob" ADD CONSTRAINT "dl_FeedImportJob_feedSourceId_fkey" FOREIGN KEY ("feedSourceId") REFERENCES "dl_FeedSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

