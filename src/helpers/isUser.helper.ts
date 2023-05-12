import User from '@/resources/user/user.interface';

function isUser(user: any): user is User {
    return user && user.name && user.email && user.password && user.role && user.avatarURL;
}

export default isUser;
