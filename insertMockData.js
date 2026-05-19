const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_yceJzTokLI24@ep-holy-art-anv7hawq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
async function run() {
  await client.connect();
  try {
    const aiReport = `
Here are the top trending shopping searches on Google right now:

### 1. 🎧 Sony WH-1000XM5 Headphones
* **Why it's trending:** A massive flash sale just dropped across major retailers.
* **Discount:** Up to 35% off original price.
* **Verdict:** Best time to buy if you're looking for premium noise cancellation.

### 2. 💻 Apple MacBook Air M3
* **Why it's trending:** Student discounts have been unexpectedly doubled for the weekend.
* **Discount:** Extra $200 off education pricing.

### 3. ☕ Breville Barista Express
* **Why it's trending:** Home espresso machines are surging in search volume ahead of Mother's Day.
* **Discount:** Lowest price seen since Black Friday ($549).

*These trends were analyzed using live Google Search Grounding data.*
    `;
    const message = "🚨 Trending in USA Today: Massive flash sales on Sony Headphones and MacBooks!";
    const query = `
      INSERT INTO "dl_NewsAlert" (id, message, "aiReport", "isActive", "createdAt") 
      VALUES (gen_random_uuid(), $1, $2, true, now())
    `;
    await client.query(query, [message, aiReport]);
    console.log("Mock data inserted.");
  } catch(e) {
    console.log("Error:", e.message);
  }
  await client.end();
}
run();
