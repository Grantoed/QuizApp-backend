import Joi from 'joi';

export const createPost = Joi.object({
	title: Joi.string().required(),
	body: Joi.string().required(),
});
