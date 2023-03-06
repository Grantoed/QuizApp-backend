import { Schema, model } from 'mongoose';
import { Post } from './post.interface';

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},

		body: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

export const postModel = model<Post>('Post', postSchema);
// export default model<Post>('Post', postSchema);
