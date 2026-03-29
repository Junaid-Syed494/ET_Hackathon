import os
import feedparser
import uuid # <-- NEW: Import the UUID library
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Force Python to read the .env file in the current folder
load_dotenv()

# Grab the keys
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("❌ ERROR: Missing SUPABASE_URL or SUPABASE_KEY in .env file")
    exit(1)

# Connect to Supabase
supabase: Client = create_client(url, key)

# The Economic Times RSS Feeds
FEEDS = [
    "https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms",
    "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
    "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms"
]

def fetch_and_store_news():
    print("🚀 Starting ET News Ingestion...")
    articles_added = 0

    for feed_url in FEEDS:
        print(f"📡 Fetching: {feed_url}")
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:10]:  # Grab top 10 from each feed
            try:
                # Format the date for Supabase (PostgreSQL)
                pub_date = datetime(*entry.published_parsed[:6]).isoformat()
                
                # Check if article already exists to prevent duplicates
                existing = supabase.table("Article").select("id").eq("link", entry.link).execute()
                
                if not existing.data:
                    # Insert new article WITH a Python-generated ID!
                    supabase.table("Article").insert({
                        "id": str(uuid.uuid4()), # <-- FIX: Generate a random unique ID
                        "title": entry.title,
                        "summary": entry.summary,
                        "link": entry.link,
                        "published_at": pub_date,
                        "topic_tag": "Business"
                    }).execute()
                    articles_added += 1
                    print(f"✅ Added: {entry.title[:40]}...")
            
            except Exception as e:
                # Updated error print to give us the EXACT database rejection reason
                print(f"⚠️ Failed to process article: {repr(e)}")

    print(f"🎉 Ingestion complete! Added {articles_added} new articles to Supabase.")

if __name__ == "__main__":
    fetch_and_store_news()