import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import SetController from './resources/set/set.controller';
import UserController from './resources/user/user.controller';

validateEnv();

const app = new App([new SetController(), new UserController()], Number(process.env.PORT));

app.listen();
