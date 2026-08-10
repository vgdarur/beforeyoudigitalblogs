import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

DB_FILE = "posted_deals.json"

def load_posted_deals():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_posted_deals(posted_list):
    with open(DB_FILE, "w") as f:
        json.dump(posted_list, f)

def post_to_telegram(curated_deals, dry_run=False):
    """
    Posts a list of curated deals to Telegram and tracks them to avoid duplicates.
    """
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    
    if not dry_run and (not bot_token or not chat_id):
        print("Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Skipping posting.")
        return

    posted_ids = load_posted_deals()
    newly_posted = 0

    for item in curated_deals:
        deal = item["deal"]
        caption = item["caption"]
        deal_id = deal["id"]
        
        if deal_id in posted_ids:
            print(f"Deal {deal_id} already posted. Skipping.")
            continue
            
        # Build the final message
        title = deal.get("title")
        price = deal.get("price")
        original_price = deal.get("originalPrice")
        merchant = deal.get("merchant", {}).get("name", "Store")
        
        # Link construction (use detailUrl if available, otherwise fallback)
        deal_url = deal.get("detailUrl", f"https://aidealsofamerica.com/deals/{deal.get('slug', deal_id)}")
        
        # Format the text with HTML markdown for Telegram
        message = f"<b>{title}</b>\n\n"
        message += f"{caption}\n\n"
        message += f"💰 <b>Price:</b> ${price:.2f}"
        if original_price and original_price > price:
            message += f" <i>(was ${original_price:.2f})</i>"
        message += f"\n🏪 <b>Store:</b> {merchant}\n\n"
        message += f"🛒 <b><a href='{deal_url}'>Click here to grab the deal!</a></b>"

        if dry_run:
            print("\n--- DRY RUN: WOULD POST ---")
            print(message)
            print("---------------------------\n")
            posted_ids.append(deal_id)
            newly_posted += 1
            continue
            
        # Actual Telegram API Call
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML",
            "disable_web_page_preview": False
        }
        
        try:
            resp = requests.post(url, json=payload)
            resp.raise_for_status()
            print(f"Successfully posted deal: {title[:30]}...")
            posted_ids.append(deal_id)
            newly_posted += 1
        except Exception as e:
            print(f"Failed to post deal {deal_id}: {e}")
            if resp is not None:
                print(f"Response: {resp.text}")

    # Save state
    save_posted_deals(posted_ids)
    print(f"Finished. Posted {newly_posted} new deals.")

if __name__ == "__main__":
    # Test script locally
    pass
