import psycopg2

try:
    conn = psycopg2.connect("postgresql://neondb_owner:npg_jCf9YEm2JtAd@ep-patient-waterfall-a46u68r0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
    cur = conn.cursor()
    # Let's add youtubeUrl to Deal
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "youtubeUrl" text;')
    
    # Check if there are other columns missing in Deal, like discountRatio, affiliateUrl, productGroupId
    # Prisma schema:
    #   imageUrl      String?
    #   youtubeUrl    String?
    #   price         Float?
    #   originalPrice Float?
    #   discountRatio Float?
    #   couponCode    String?
    #   affiliateUrl  String
    #   productGroupId String?
    #   expirationDate DateTime?
    #   isActive      Boolean   @default(true)
    #   isFeatured    Boolean   @default(false)
    #   priorityScore Int       @default(0)
    
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "discountRatio" double precision;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "couponCode" text;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "affiliateUrl" text;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "productGroupId" text;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "expirationDate" timestamp(3) without time zone;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "isFeatured" boolean DEFAULT false;')
    cur.execute('ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "priorityScore" integer DEFAULT 0;')

    conn.commit()
    print("Columns added successfully!")
    conn.close()
except Exception as e:
    print("Error:", e)
