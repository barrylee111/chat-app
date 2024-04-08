import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { fetchLocalSecrets } from '../secrets';
import { mongoClient } from '../mongo';
// Configure JWT strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: await getJwtSecret() // Using await inside an async function
}, async (payload, done) => {
    try {
        // Check if user exists in the database using payload data (e.g., userId)
        const db = mongoClient.db('ChatApp');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: payload.userId });
        // Pass user data to the next middleware
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
    catch (error) {
        done(error, false);
    }
}));
export const authenticateJwt = passport.authenticate('jwt', { session: false });
async function getJwtSecret() {
    try {
        const secrets = await fetchLocalSecrets();
        if (!secrets) {
            throw new Error('Secrets not found');
        }
        return secrets.JWT_SECRET;
    }
    catch (error) {
        console.log('Secrets not found...');
        return 'default_jwt_secret'; // Provide a default secret or handle the error
    }
}
