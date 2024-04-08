import express from 'express';
import { getUsers, login, signUp } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/signup', signUp);
router.post('/login', login);

export { router as userRouter };
