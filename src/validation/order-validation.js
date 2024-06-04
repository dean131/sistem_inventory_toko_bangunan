import Joi from "joi";
// model Order {
//     id              String      @id
//     user            User        @relation(fields: [userId], references: [id])
//     userId          String
//     createdAt       DateTime    @default(now())
//     isCheckedOut    DateTime?
//     customerName    String?
//     customerPhone   String?
//     customerAddress String?
//     totalPrice      Float?
//     items           OrderItem[]
//   }
const checkoutOrderValidation = Joi.object({
	customerName: Joi.string().required(),
	customerPhone: Joi.string().required(),
	customerAddress: Joi.string().required(),
});

export { checkoutOrderValidation };
