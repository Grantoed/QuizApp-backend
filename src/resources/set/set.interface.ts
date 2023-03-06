import { Document } from 'mongoose';

interface Cards {
	term: string;
	definition: string;
}

export interface Set extends Document {
	title: string;
	description: string;
	cards: Cards[];
}
