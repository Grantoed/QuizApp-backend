import Joi from 'joi';

const createSet = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    cards: Joi.array()
        .items(
            Joi.object({
                term: Joi.string().required(),
                definition: Joi.string().required(),
            }),
        )
        .required(),
});

export default { createSet };
