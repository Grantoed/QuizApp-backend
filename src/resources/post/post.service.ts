import postModel from './post.model';
import Post from '@/resources/post/post.interface';

class PostService {
	private post = postModel;

	/**
	 * Create a new post
	 */
	public async create(title: string, body: string): Promise<Post> {
		try {
			const post = await this.post.create({ title, body });
			return post;
		} catch (e) {
			throw new Error('Unable to create post');
		}
	}
}

export default PostService;
