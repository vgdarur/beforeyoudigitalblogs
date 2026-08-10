import os
import requests
from dotenv import load_dotenv

load_dotenv()

DEALS_API_URL = os.getenv("DEALS_API_URL", "https://aidealsofamerica.com/api/deals")

def fetch_latest_deals(limit=50):
    """
    Fetches the latest deals from the aidealsofamerica API.
    """
    print(f"Fetching latest {limit} deals from {DEALS_API_URL}...")
    try:
        # Use sortBy=createdAt and sortOrder=desc to get the newest deals
        url = f"{DEALS_API_URL}?limit={limit}&sortBy=createdAt&sortOrder=desc"
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        deals = data.get("deals", [])
        
        print(f"Successfully fetched {len(deals)} deals.")
        return deals
    except Exception as e:
        print(f"Error fetching deals: {e}")
        return []

if __name__ == "__main__":
    # Test script locally
    deals = fetch_latest_deals(5)
    for deal in deals:
        print(f"- {deal.get('title')} (${deal.get('price')})")
