import { Schema, model } from 'mongoose';
import Set from './set.interface';

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
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { timestamps: true },
);

const setModel = model<Set>('Set', setSchema);

export default setModel;
