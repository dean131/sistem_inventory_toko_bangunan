import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createOrderItemValidation } from "../validation/ordetitem-validation.js";
import { generateOrderId, generateOrderItemId } from "../utils/generate-id.js";
import { v4 as uuid } from "uuid";

const create = async (req, res, next) => {
	try {
		const orderItem = validate(createOrderItemValidation, req.body);
		const { productId, quantity } = orderItem;

		// Find or create order by userId
		let order = await prismaClient.order.findFirst({
			where: {
				userId: req.user.id,
				isCheckedOut: null,
			},
		});

		if (!order) {
			order = await prismaClient.order.create({
				data: {
					id: uuid(),
					userId: req.user.id,
				},
			});
		}

		const product = await prismaClient.product.findUnique({
			where: { id: productId },
		});

		if (!product) {
			throw new ResponseError(404, "Product not found");
		}

		// check stock by quantity
		if (product.stock < quantity) {
			throw new ResponseError(400, "Stock is not enough");
		}

		// Find or create order item
		let createOrUpdateOrderItem = await prismaClient.orderItem.findFirst({
			where: {
				orderId: order.id,
				productId: productId,
			},
		});

		if (createOrUpdateOrderItem) {
			createOrUpdateOrderItem = await prismaClient.orderItem.update({
				where: { id: createOrUpdateOrderItem.id },
				data: {
					quantity: quantity,
					price: product.price * quantity,
				},
			});
		} else {
			createOrUpdateOrderItem = await prismaClient.orderItem.create({
				data: {
					id: uuid(),
					orderId: order.id,
					productId: productId,
					quantity: quantity,
					price: product.price * quantity,
				},
			});
		}

		if (quantity === 0) {
			await prismaClient.orderItem.delete({
				where: {
					id: createOrUpdateOrderItem.id,
				},
			});
		}

		// update total price in order
		const orderItems = await prismaClient.orderItem.findMany({
			where: {
				orderId: order.id,
			},
		});

		const totalPrice = orderItems.reduce((acc, item) => {
			return acc + item.price;
		}, 0);

		await prismaClient.order.update({
			where: { id: order.id },
			data: {
				totalPrice: totalPrice,
			},
		});

		res.status(200).json({ data: createOrUpdateOrderItem });
	} catch (e) {
		next(e);
	}
};

export default { create };
