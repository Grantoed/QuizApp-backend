import passport from 'passport';
import { Types } from 'mongoose';
import { OAuth2Strategy as GoogleStrategy, VerifyFunction } from 'passport-google-oauth';
import HttpException from '@/utils/exceptions/http.exception';
import userModel from '@/resources/user/user.model';

const user = userModel;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: 'http://localhost:3000/api/users/google/callback',
        },
        async (accessToken, refreshToken, profile, done: VerifyFunction) => {
            try {
                // Try to find the user in MongoDB by their Google ID
                const existingUser = await user.findOne({ googleId: profile.id });

                if (existingUser) {
                    // If the user already exists, return it
                    done(null, existingUser);
                } else {
                    const newUser = await user.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails ? profile.emails[0].value : null,
                        avatarURL: profile.photos?.[0].value,
                        accessToken,
                        refreshToken,
                    });
                    done(null, newUser);
                }
            } catch (e) {
                done(e);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const userObjectId = new Types.ObjectId(id);
        const serializedUser = await user.findOne({ _id: userObjectId });
        if (!serializedUser) {
            throw new HttpException(404, `User not found`);
        }
        done(null, serializedUser);
    } catch (e) {
        done(e);
    }
});
