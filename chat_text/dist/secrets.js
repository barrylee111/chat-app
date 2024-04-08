import { promises as fs } from 'fs';
export const fetchLocalSecrets = async () => {
    try {
        const secretsData = await fs.readFile('secrets.json', { encoding: 'utf-8' });
        const secrets = JSON.parse(secretsData);
        return secrets;
    }
    catch (error) {
        console.error('Error reading or parsing secrets file:', error);
        return null;
    }
};
