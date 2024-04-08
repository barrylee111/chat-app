import express from 'express';
import { messageRouter } from './routes/messageRouter';
import { userRouter } from './routes/userRouter';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use('/messages', messageRouter);
app.use('/users', userRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
