import Joi from "joi";
// model Product {
//     id         Int        @id @default(autoincrement())
//     name       String
//     price      Float
//     imageUrl   String?
//     stock      Int
//     minStock   Int
//     supplier   Supplier   @relation(fields: [supplierId], references: [id])
//     supplierId Int
//     orderItems OrderItem[]
//   }

const createProductValidation = Joi.object({
	name: Joi.string().max(100).required(),
	price: Joi.number().required(),
	stock: Joi.number().required(),
	minStock: Joi.number().required(),
	supplierId: Joi.string().max(100).required(),
	// image: Joi.binary().optional(),
});

const updateProductValidation = Joi.object({
	name: Joi.string().max(100).optional(),
	price: Joi.number().optional(),
	stock: Joi.number().optional(),
	minStock: Joi.number().optional(),
	supplierId: Joi.string().max(100).optional(),
	// image: Joi.binary().optional(),
});

export { createProductValidation, updateProductValidation };
