import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { fetchLocalSecrets } from '../secrets';
import { mongoClient } from '../mongo';

// Define the JWT strategy configuration function
async function configureJwtStrategy() {
  try {
    const jwtSecret = await getJwtSecret();
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    }, async (payload, done) => {
      try {
        const db = mongoClient.db('ChatApp');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: payload.userId });
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }));
  } catch (error) {
    console.error('Failed to configure JWT strategy:', error);
  }
}

// Immediately invoke the configuration function
configureJwtStrategy();

// Export the authentication middleware
export const authenticateJwt = passport.authenticate('jwt', { session: false });

// Define the function to get the JWT secret
async function getJwtSecret() {
  try {
    const secrets = await fetchLocalSecrets();
    if (!secrets) {
      throw new Error('Secrets not found');
    }
    return secrets.JWT_SECRET;
  } catch (error: any) {
    console.log('Secrets not found...');
    return 'default_jwt_secret';
  }
}
