from pydantic import BaseModel
from datetime import datetime
from typing import Dict
import asyncio
from fastapi import FastAPI, HTTPException
import asyncio

from fastapi.middleware.cors import CORSMiddleware




class Message(BaseModel):
    sender_id: str
    recipient_id: str
    content: str



class PollingManager:
    def __init__(self):
        # Dictionary to store queues for each user
        self.waiting_clients: Dict[str, asyncio.Queue] = {}

    async def wait_for_message(self, user_id: str) -> Message:
        # Get or create an asyncio.Queue for the user
        queue = self.waiting_clients.setdefault(user_id, asyncio.Queue())
        # Wait until a new message is available in the queue
        message = await queue.get()
        return message

    async def send_message(self, message: Message):
        # Check if recipient has a queue (is waiting)
        queue = self.waiting_clients.get(message.recipient_id)
        if queue:
            # Put the new message in the recipient's queue
            await queue.put(message)



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
polling_manager = PollingManager()

@app.post("/sendMessage")
async def send_message(message: Message):
    # Send the message to the recipient's queue
    await polling_manager.send_message(message)
    return {"status": "Message sent"}

@app.get("/getMessages/{user_id}")
async def get_messages(user_id: str):
    try:
        # Wait for a new message for this user
        message = await asyncio.wait_for(polling_manager.wait_for_message(user_id), timeout=1.0)
        return message
    except asyncio.TimeoutError:
        # If no message received within 60 seconds, return a timeout response
        raise HTTPException(status_code=204, detail="No new messages")