import { Types } from 'mongoose';
import UserService from '../user/user.service';

class FileService {
    private UserService = new UserService();

    public async updateAvatar(avatarURL: string, userId: Types.ObjectId): Promise<string | void> {
        const user = await this.UserService.current(userId);
        user.avatarURL = avatarURL;

        user.save();

        return user.avatarURL;
    }
}

export default FileService;
