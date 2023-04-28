import './auth/oauth';
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from './utils/interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import helmet from 'helmet';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_URL } = process.env;

        mongoose.set('strictQuery', true);
        mongoose.connect(`${MONGO_URL}`);
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(
            session({
                secret: process.env.SESSION_SECRET!,
                resave: false,
                saveUninitialized: true,
            }),
        );
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
