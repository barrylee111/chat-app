import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import WebSocket from 'ws'; // Import the ws package

import { messageRouter } from './routes/messageRouter';
import { userRouter } from './routes/userRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/messages', messageRouter);
app.use('/users', userRouter);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Create a WebSocket server

// WebSocket connection event handler
wss.on('connection', (ws) => {
  // console.log('A user connected');

  // WebSocket message event handler
  ws.on('message', (message) => {
    console.log('Received: ' + message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message); // Broadcast the message to all clients except the sender
      }
    });
  });

  // WebSocket close event handler
  ws.on('close', () => {
    // console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
