import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        PORT: port({ default: 3000 }),
        MONGO_URL: str(),
        JWT_SECRET: str(),
        JWT_REFRESH_SECRET: str(),
        AWS_BUCKET_NAME: str(),
        AWS_BUCKET_REGION: str(),
        AWS_ACCESS_KEY: str(),
        AWS_SECRET_KEY: str(),
        GOOGLE_CLIENT_ID: str(),
        GOOGLE_CLIENT_SECRET: str(),
        SESSION_SECRET: str(),
    });
}

export default validateEnv;
