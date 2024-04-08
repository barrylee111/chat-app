import { MongoClient } from 'mongodb';
import { fetchLocalSecrets } from './secrets';
let mongoClient;
let secrets;
// Wrap the code in an async function to use await
(async () => {
    try {
        secrets = await fetchLocalSecrets();
        if (!secrets) {
            throw new Error('Secrets not found');
        }
        const mongoUri = secrets.MONGODB_URI;
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
})();
// Export the mongoClient instance
export { mongoClient };
