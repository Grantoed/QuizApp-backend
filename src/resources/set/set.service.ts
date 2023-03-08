import setModel from './set.model';
import Set from './set.interface';

class SetService {
    private set = setModel;

    public async get(): Promise<Set[] | []> {
        try {
            const sets = await this.set.find({});
            return sets;
        } catch (e) {
            throw new Error('Unable to get sets');
        }
    }

    public async create(title: string, description: string, cards: Set['cards']): Promise<Set> {
        try {
            const newSet = await this.set.create({ title, description, cards });
            return newSet;
        } catch (e) {
            throw new Error('Unable to create set');
        }
    }
}

export default SetService;
