import { Types } from 'mongoose';
import HttpException from '@/utils/exceptions/http.exception';
import setModel from './set.model';
import Set, { Card } from './set.interface';

class SetService {
    private set = setModel;

    public async getCount(): Promise<number> {
        const count = await this.set.countDocuments();
        return count;
    }

    public async getCountByUser(userId: Types.ObjectId): Promise<number> {
        const count = await this.set.countDocuments({ owner: userId });
        return count;
    }

    public async getAll(
        query: string | undefined = undefined,
        page: number,
        limit: number,
    ): Promise<Set[] | []> {
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
    }

    public async getByUser(
        page: number,
        limit: number,
        userId: Types.ObjectId,
    ): Promise<Set[] | []> {
        const sets = await this.set
            .find({ owner: userId })
            .skip((page - 1) * limit)
            .limit(limit);
        return sets;
    }

    public async getById(setId: string): Promise<Set> {
        const setObjectId = new Types.ObjectId(setId);
        const set = await this.set.findOne({ _id: setObjectId });
        if (!set) {
            throw new Error(`Set with id ${setId} doesn't exist`);
        }
        return set;
    }

    public async create(
        title: string,
        description: string,
        cards: Set['cards'],
        userId: Types.ObjectId,
    ): Promise<Set> {
        const newSet = await this.set.create({ title, description, cards, owner: userId });
        return newSet;
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
        userId: Types.ObjectId,
    ): Promise<Set | void> {
        const setObjectId = new Types.ObjectId(setId);
        const updatedSet = await this.set.findOneAndUpdate(
            { _id: setObjectId, owner: userId },
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
        return updatedSet;
    }

    public async updateCard(
        cardId: string,
        {
            term,
            definition,
        }: {
            term?: string;
            definition?: string;
        },
        userId: Types.ObjectId,
    ): Promise<Card | void> {
        const cardObjectId = new Types.ObjectId(cardId);
        const searchedSet = await this.set.findOneAndUpdate(
            {
                owner: userId,
                'cards._id': cardObjectId,
            },
            {
                $set: {
                    'cards.$[card].term': term,
                    'cards.$[card].definition': definition,
                },
            },
            {
                arrayFilters: [{ 'card._id': cardObjectId }],
                projection: {
                    'cards.$': 1,
                    _id: 0,
                },
            },
        );
        if (!searchedSet) {
            throw new HttpException(404, `Card not found`);
        }
        return searchedSet.cards[0];
    }

    public async delete(setId: string, userId: Types.ObjectId): Promise<Set | void> {
        const setObjectId = new Types.ObjectId(setId);
        const set = await this.set.findOneAndDelete({ _id: setObjectId, userId });
        if (!set) {
            throw new HttpException(404, `Set with id ${setId} doesn't exist`);
        }
        return set;
    }

    public async deleteCard(cardId: string, userId: Types.ObjectId): Promise<Card | void> {
        const cardObjectId = new Types.ObjectId(cardId);
        const searchedSet = await this.set.findOneAndUpdate(
            {
                owner: userId,
                'cards._id': cardObjectId,
            },
            {
                $pull: { cards: { _id: cardObjectId } },
            },
            {
                arrayFilters: [{ 'card._id': cardObjectId }],
                projection: {
                    'cards.$': 1,
                    _id: 0,
                },
            },
        );

        if (!searchedSet) {
            throw new HttpException(404, `Set not found`);
        }

        const deletedCard = searchedSet.cards.find(card => card._id.equals(cardObjectId));
        if (!deletedCard) {
            throw new HttpException(404, `Card not found`);
        }
        return deletedCard;
    }
}

export default SetService;
