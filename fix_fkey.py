import psycopg2

conn = psycopg2.connect("postgresql://neondb_owner:npg_yceJzTokLI24@ep-holy-art-anv7hawq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require")
cursor = conn.cursor()

try:
    # Drop the existing foreign key constraint
    cursor.execute('ALTER TABLE "dl_Click" DROP CONSTRAINT "dl_Click_dealId_fkey";')
    print("Dropped old constraint")
except Exception as e:
    print("Drop error (might not exist):", e)
    conn.rollback()

try:
    # Add it back with ON DELETE CASCADE
    cursor.execute('ALTER TABLE "dl_Click" ADD CONSTRAINT "dl_Click_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "dl_Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;')
    conn.commit()
    print("Successfully added CASCADE constraint to dl_Click")
except Exception as e:
    print("Add error:", e)

conn.close()
