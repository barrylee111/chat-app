import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController';

const router = express.Router();

router.post('/', getMessages);
router.post('/create', createMessage);

export { router as messageRouter };
