import psycopg2

try:
    conn = psycopg2.connect("postgresql://neondb_owner:npg_jCf9YEm2JtAd@ep-patient-waterfall-a46u68r0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
    cur = conn.cursor()
    
    cur.execute('ALTER TABLE "Merchant" ADD COLUMN IF NOT EXISTS "logoUrl" text;')
    cur.execute('ALTER TABLE "Merchant" ADD COLUMN IF NOT EXISTS "affiliateUrl" text;')
    
    cur.execute('ALTER TABLE "Network" ADD COLUMN IF NOT EXISTS "apiKey" text;')
    cur.execute('ALTER TABLE "Network" ADD COLUMN IF NOT EXISTS "trackingId" text;')
    
    cur.execute('ALTER TABLE "Click" ADD COLUMN IF NOT EXISTS "referrer" text;')
    cur.execute('ALTER TABLE "Click" ADD COLUMN IF NOT EXISTS "device" text;')
    
    conn.commit()
    print("Other columns added successfully!")
    conn.close()
except Exception as e:
    print("Error:", e)
