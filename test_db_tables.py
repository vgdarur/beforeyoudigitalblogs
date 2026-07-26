import psycopg2
try:
    conn = psycopg2.connect("postgresql://neondb_owner:npg_jCf9YEm2JtAd@ep-patient-waterfall-a46u68r0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
    tables = cur.fetchall()
    print("Tables:", tables)
    conn.close()
except Exception as e:
    print("Error:", e)
