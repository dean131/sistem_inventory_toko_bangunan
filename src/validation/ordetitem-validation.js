import Joi from "joi";
// model OrderItem {
//     id        Int      @id @default(autoincrement())
//     order     Order    @relation(fields: [orderId], references: [id])
//     orderId   Int
//     product   Product  @relation(fields: [productId], references: [id])
//     productId String
//     quantity  Int
//     price     Float
//   }

const createOrderItemValidation = Joi.object({
	productId: Joi.string().required(),
	quantity: Joi.number().required(),
});

export { createOrderItemValidation };
