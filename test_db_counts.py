import psycopg2
try:
    conn = psycopg2.connect("postgresql://neondb_owner:npg_jCf9YEm2JtAd@ep-patient-waterfall-a46u68r0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
    cur = conn.cursor()
    cur.execute('SELECT count(*) FROM "Deal";')
    print("Deal count:", cur.fetchone()[0])
    cur.execute('SELECT count(*) FROM "dl_Deal";')
    print("dl_Deal count:", cur.fetchone()[0])
    conn.close()
except Exception as e:
    print("Error:", e)
