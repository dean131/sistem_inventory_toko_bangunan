import Joi from "joi";
// model Supplier {
// 	id             Int       @id @default(autoincrement())
// 	name           String
// 	contactPerson  String?
// 	whatsapp       String?
// 	address        String?
// 	products       Product[]
//   }

const createSupplierValidation = Joi.object({
	name: Joi.string().max(100).required(),
	contactPerson: Joi.string().max(100).required(),
	whatsapp: Joi.string().max(100).required(),
	address: Joi.string().max(255).required(),
});

const updateSupplierValidation = Joi.object({
	name: Joi.string().max(100).optional(),
	contactPerson: Joi.string().max(100).optional(),
	whatsapp: Joi.string().max(100).optional(),
	address: Joi.string().max(255).optional(),
});

export { createSupplierValidation, updateSupplierValidation };
