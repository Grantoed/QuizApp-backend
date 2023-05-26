import { Types } from 'mongoose';
import User from '@/resources/user/user.interface';
import session from 'express-session';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
        // interface User {
        //     _id: Types.ObjectId;
        //     googleId: string;
        // }
    }
}

declare module 'express-session' {
    export interface SessionData {
        passport: any;
    }
}

// The declare global keyword tells TypeScript that we are adding to a global namespace rather than a module or class.

// The namespace Express creates a new namespace within the global namespace for the Express library.

// The export interface Request statement augments the Request interface in the Express namespace.
// This is the interface that represents an HTTP request in an Express application.

// Finally, the user: User statement adds a new property to the Request interface called user of type User.
// This User type is imported at the beginning of the file and likely represents some kind of user data that will be attached to the request object during authentication or authorization.

// So essentially, this code is extending the Request interface of the Express namespace to include a new property called user that is of type User.
// This makes it easy to attach user data to an HTTP request in an Express application and access it from any middleware or route handler that has access to the Request object.
