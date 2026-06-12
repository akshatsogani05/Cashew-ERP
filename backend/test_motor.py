import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient(
        "mongodb+srv://akshatsogani05:Akshat%4023@cluster0.liskelo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )

    db = client.test

    print(await db.command("ping"))

asyncio.run(main())