import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import SetController from './resources/set/set.controller';
import UserController from './resources/user/user.controller';
import FilesController from './resources/file/file.controller';

validateEnv();

const app = new App(
    [new SetController(), new UserController(), new FilesController()],
    Number(process.env.PORT),
);

app.listen();
