const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_yceJzTokLI24@ep-holy-art-anv7hawq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
async function run() {
  await client.connect();
  try {
    await client.query('ALTER TABLE "dl_NewsAlert" ADD COLUMN "aiReport" TEXT;');
    console.log("Column added.");
  } catch(e) {
    console.log("Error:", e.message);
  }
  await client.end();
}
run();
