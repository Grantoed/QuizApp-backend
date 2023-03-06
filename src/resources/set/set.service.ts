import { setModel } from './set.model';
import { Set } from './set.interface';

export class SetService {
	private set = setModel;

	public async create(title: string, description: string, cards: Set['cards']): Promise<Set> {
		try {
			const set = await this.set.create({ title, description, cards });
			return set;
		} catch (e) {
			throw new Error('Unable to create set');
		}
	}
}
