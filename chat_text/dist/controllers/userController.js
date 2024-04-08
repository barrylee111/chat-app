// userController.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mongoClient } from './mongo';
import { fetchLocalSecrets } from './secrets';
const saltRounds = 10; // Number of salt rounds for bcrypt hashing
secrets = await fetchLocalSecrets();
if (!secrets)
    throw new Error('Secrets not found');
const jwtSecret = secrets.JWT_SECRET;
export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Save the user to the database
        const db = mongoClient.db('ChatApp');
        const usersCollection = db.collection('users');
        await usersCollection.insertOne({ username, email, password: hashedPassword });
        res.status(201).json({ success: true, message: 'User signed up successfully' });
    }
    catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const db = mongoClient.db('ChatApp');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret);
        // Return JWT token
        res.json({ success: true, token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
