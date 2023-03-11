import { Types } from 'mongoose';

interface Token extends Object {
    id: Types.ObjectId;
    expiresIn: number;
}

export default Token;
