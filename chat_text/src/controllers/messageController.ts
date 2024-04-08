import { Request, Response } from 'express';
import { mongoClient } from '../mongo';
import { authenticateJwt } from '../middleware/auth';

interface User {
  _id: string;
}

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { message, receiver, sender } = req.body;
    const db = mongoClient.db('ChatApp');
    const messageCollection = db.collection('messages');
    await messageCollection.insertOne({ message, receiver, sender });

    res.status(201).json({ success: true, message: 'Message created successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const currentUserID = req.body.currentUserId;
    const selectedUserID = req.body.selectedUserId;

    const db = mongoClient.db('ChatApp');
    const messageCollection = db.collection('messages');

    // Query the messages collection based on the current user ID and selected user ID
    const messages = await messageCollection.find({
      $or: [
        { sender: currentUserID, receiver: selectedUserID },
        { sender: selectedUserID, receiver: currentUserID }
      ]
    }).toArray();

    // Return the messages as a JSON response
    res.json(messages);
    res.status(200).send();
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Apply authenticateJwt middleware to the route handler
export const getMessagesAuthenticated = [authenticateJwt, getMessages];
