import { promises as fs } from 'fs';

interface Secrets {
    MONGODB_URI: string;
    JWT_SECRET: string
}

export const fetchLocalSecrets = async (): Promise<Secrets | null> => {
    try {
        const secretsData = await fs.readFile('secrets.json', { encoding: 'utf-8' });
        const secrets = JSON.parse(secretsData) as Secrets;
        return secrets;
    } catch (error) {
        console.error('Error reading or parsing secrets file:', error);
        return null;
    }
}
