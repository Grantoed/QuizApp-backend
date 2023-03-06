import { Schema, model } from 'mongoose';
import { Set } from './set.interface';

const setSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		cards: {
			type: [
				{
					term: {
						type: String,
						required: true,
					},
					definition: {
						type: String,
						required: true,
					},
				},
			],
			required: true,
		},
	},
	{ timestamps: true },
);

export const setModel = model<Set>('Set', setSchema);
// export default model<Set>('Set', setSchema);
