from pymongo import MongoClient

uri = "mongodb+srv://archanaparmar419:8QQhgSOkKZuMRltq@cluster0.m4pwktg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ MongoDB Atlas connected successfully!")
except Exception as e:
    print("❌ Connection failed:", e)
