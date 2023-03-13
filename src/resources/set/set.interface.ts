import { Document } from 'mongoose';

export interface Card extends Document {
    term: string;
    definition: string;
}

export default interface Set extends Document {
    title: string;
    description: string;
    cards: Card[];
}
