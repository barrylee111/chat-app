import { mongoClient } from '../mongo';
import { authenticateJwt } from '../middleware/auth';
export const createMessage = async (req, res) => {
    try {
        const { message, receiver, sender } = req.body;
        const db = mongoClient.db('ChatApp');
        const messageCollection = db.collection('messages');
        await messageCollection.insertOne({ message, receiver, sender });
        res.status(201).json({ success: true, message: 'Message created successfully' });
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
export const getMessages = async (req, res) => {
    try {
        // Get the current user's ID from the authenticated user
        const currentUserID = req.body.user._id;
        // Get the other user's ID from request query or params
        const otherUserID = req.query.otherUserID; // Assuming it's passed as a query parameter
        // Connect to the ChatApp database
        const db = mongoClient.db('ChatApp');
        // Get the messages collection
        const messageCollection = db.collection('messages');
        // Query messages where sender is either the current user or the other user,
        // and recipient is the other user or the current user, respectively
        const messages = await messageCollection.find({
            $or: [
                { sender: currentUserID, recipient: otherUserID },
                { sender: otherUserID, recipient: currentUserID }
            ]
        }).toArray();
        // Return the messages as a JSON response
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
// Apply authenticateJwt middleware to the route handler
export const getMessagesAuthenticated = [authenticateJwt, getMessages];
