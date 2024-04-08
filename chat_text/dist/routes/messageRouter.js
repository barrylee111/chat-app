import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController';
const router = express.Router();
router.post('/createMessage', createMessage);
router.get('/getMessages', getMessages);
export { router as messageRouter };
