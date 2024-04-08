import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VoiceChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'voice_chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive message from WebSocket

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'voice_chat_message',
                'message': text_data
            }
        )

    async def voice_chat_message(self, event):
        # Receive message from room group
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
