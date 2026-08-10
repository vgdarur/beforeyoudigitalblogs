import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

def curate_deals_with_claude(deals, max_picks=5):
    """
    Passes a list of deals to Claude and asks it to pick the best ones and write captions.
    Returns a list of dicts: [{'deal': <deal_obj>, 'caption': <string>}]
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("Warning: ANTHROPIC_API_KEY not found. Skipping curation.")
        return []

    client = Anthropic(api_key=api_key)
    
    # Prepare a minimal payload for Claude to save tokens
    deals_payload = []
    for deal in deals:
        deals_payload.append({
            "id": deal.get("id"),
            "title": deal.get("title"),
            "price": deal.get("price"),
            "originalPrice": deal.get("originalPrice"),
            "discount": deal.get("discountPercentage"),
            "merchant": deal.get("merchant", {}).get("name", "Unknown")
        })

    prompt = f"""
    You are an expert deal curator for a Telegram group.
    I will provide you with a JSON list of the latest deals.
    Your job is to select the top {max_picks} BEST deals from this list based on:
    - High discount percentage
    - Recognizable brand/merchant
    - Broad appeal (electronics, household essentials, etc.)

    For each selected deal, write a very short, punchy, exciting Telegram caption (1-3 sentences max).
    Use relevant emojis. Do not include hashtags. Do not include the link or the exact price in the caption text (I will format that separately).
    Just sell the item in a fun, urgent way.

    Deals data:
    {json.dumps(deals_payload, indent=2)}

    Return ONLY a raw JSON array of objects with this exact format:
    [
      {{
        "id": "deal_id_here",
        "caption": "Your punchy caption here 🔥"
      }}
    ]
    Do not output any markdown code blocks, just the raw JSON.
    """

    print("Sending deals to Claude for curation...")
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=0.7,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        raw_text = response.content[0].text.strip()
        
        # Strip markdown json block if Claude ignores instructions
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        selections = json.loads(raw_text.strip())
        
        # Map selections back to original deal objects
        deal_lookup = {d.get("id"): d for d in deals}
        
        curated_results = []
        for sel in selections:
            deal_id = sel.get("id")
            if deal_id in deal_lookup:
                curated_results.append({
                    "deal": deal_lookup[deal_id],
                    "caption": sel.get("caption")
                })
                
        print(f"Claude successfully curated {len(curated_results)} deals.")
        return curated_results

    except Exception as e:
        print(f"Error calling Claude: {e}")
        return []

if __name__ == "__main__":
    # Test script locally with dummy data
    dummy_deals = [
        {"id": "1", "title": "Sony WH-1000XM5 Noise Canceling Headphones", "price": 298.00, "originalPrice": 398.00, "merchant": {"name": "Amazon"}},
        {"id": "2", "title": "Boring Pack of Socks", "price": 9.99, "originalPrice": 12.99, "merchant": {"name": "Target"}},
    ]
    results = curate_deals_with_claude(dummy_deals, max_picks=1)
    print(json.dumps(results, indent=2))
