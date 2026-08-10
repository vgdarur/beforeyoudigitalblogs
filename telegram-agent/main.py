import argparse
from scraper import fetch_latest_deals
from llm_picker import curate_deals_with_claude
from telegram_poster import post_to_telegram

def main():
    parser = argparse.ArgumentParser(description="Run the Telegram Deals Agent")
    parser.add_argument("--dry-run", action="store_true", help="Run without actually posting to Telegram")
    args = parser.parse_args()

    print("=== Starting Deals Agent ===")
    
    if args.dry_run:
        print(">>> RUNNING IN DRY RUN MODE <<<")

    # Step 1: Scrape
    deals = fetch_latest_deals(limit=50)
    if not deals:
        print("No deals found or error occurred. Exiting.")
        return

    # Step 2: Curate with Claude
    # Let's pick top 3 deals per run to avoid spamming the channel
    curated = curate_deals_with_claude(deals, max_picks=3)
    if not curated:
        print("Claude returned no curated deals. Exiting.")
        return
        
    # Step 3: Post to Telegram
    post_to_telegram(curated, dry_run=args.dry_run)
    
    print("=== Finished ===")

if __name__ == "__main__":
    main()
