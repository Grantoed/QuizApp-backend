import { Schema } from 'mongoose';
import HttpException from '@/utils/exceptions/http.exception';
import setModel from './set.model';
import Set from './set.interface';

class SetService {
    private set = setModel;

    public async getCount(): Promise<number> {
        try {
            const count = await this.set.countDocuments();
            return count;
        } catch (e) {
            throw new HttpException(500, `Unable to count sets`);
        }
    }

    public async getCountByUser(userId: Schema.Types.ObjectId): Promise<number> {
        try {
            const count = await this.set.countDocuments({ owner: userId });
            return count;
        } catch (e) {
            throw new HttpException(500, `Unable to count user sets`);
        }
    }

    public async getAll(
        query: string | undefined = undefined,
        page: number,
        limit: number,
    ): Promise<Set[] | []> {
        try {
            let searchQuery = {};
            if (query) {
                const regex = new RegExp(query, 'i');
                searchQuery = {
                    $or: [{ title: regex }, { description: regex }],
                };
            }
            const sets = await this.set
                .find(searchQuery)
                .skip((page - 1) * limit)
                .limit(limit);
            return sets;
        } catch (e) {
            throw new HttpException(500, `Unable to get all sets`);
        }
    }

    public async getByUser(
        page: number,
        limit: number,
        userId: Schema.Types.ObjectId,
    ): Promise<Set[] | []> {
        try {
            const sets = await this.set
                .find({ owner: userId })
                .skip((page - 1) * limit)
                .limit(limit);
            return sets;
        } catch (e) {
            throw new HttpException(500, `Unable to get user sets`);
        }
    }

    public async getById(setId: string): Promise<Set> {
        try {
            const id = new Schema.Types.ObjectId(setId);
            const set = await this.set.findOne({ _id: id });
            if (!set) {
                throw new Error(`Set with id ${setId} doesn't exist`);
            }
            return set;
        } catch (e) {
            throw new HttpException(500, `Unable to get set by id`);
        }
    }

    public async create(
        title: string,
        description: string,
        cards: Set['cards'],
        userId: Schema.Types.ObjectId,
    ): Promise<Set> {
        try {
            const newSet = await this.set.create({ title, description, cards, owner: userId });
            return newSet;
        } catch (e) {
            throw new HttpException(500, `Unable to create set`);
        }
    }

    public async delete(setId: string, userId: Schema.Types.ObjectId): Promise<Set> {
        try {
            const id = new Schema.Types.ObjectId(setId);
            const set = await this.set.findOneAndDelete({ _id: id, userId });
            if (!set) {
                throw new HttpException(404, `Set with id ${setId} doesn't exist`);
            }
            return set;
        } catch (e) {
            throw new HttpException(500, `Unable to delete set`);
        }
    }

    public async updateSet(
        setId: string,
        {
            title,
            description,
        }: {
            title?: string;
            description?: string;
        },
        userId: Schema.Types.ObjectId,
    ): Promise<Response | void> {
        try {
            const id = new Schema.Types.ObjectId(setId);
            const updatedSet = await this.set.findOneAndUpdate(
                { _id: id, owner: userId },
                {
                    $set: {
                        title: title,
                        description: description,
                    },
                },
                { new: true },
            );
            if (!updatedSet) {
                throw new HttpException(404, `Set not found`);
            }
        } catch (e) {
            throw new HttpException(500, `Unable to update set`);
        }
    }
}

export default SetService;
