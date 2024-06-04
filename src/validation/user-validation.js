import Joi from "joi";

const registerUserValidation = Joi.object({
	whatsapp: Joi.string().max(15).required(),
	password: Joi.string().max(100).required(),
	name: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
	whatsapp: Joi.string().max(100).required(),
	password: Joi.string().max(100).required(),
});

const updateUserValidation = Joi.object({
	whatsapp: Joi.string().max(100).optional(),
	password: Joi.string().max(100).optional(),
	name: Joi.string().max(100).optional(),
});

export { registerUserValidation, loginUserValidation, updateUserValidation };
