import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createOrderItemValidation } from "../validation/ordetitem-validation.js";
import { generateOrderId, generateOrderItemId } from "../utils/generate-id.js";

const create = async (req, res, next) => {
	try {
		const orderItem = validate(createOrderItemValidation, req.body);

		const { productId, quantity } = orderItem;

		// find order by userId
		let order = await prismaClient.order.findFirst({
			where: {
				userId: req.user.id,
				isCheckedOut: null,
			},
		});

		// if no order found, create new order
		if (!order) {
			order = await prismaClient.order.create({
				data: {
					id: await generateOrderId(),
					userId: req.user.id,
				},
			});
		}

		const productCount = await prismaClient.product.count({
			where: {
				id: productId,
			},
		});

		if (productCount === 0) {
			throw new ResponseError(404, "Product not found");
		}

		const product = await prismaClient.product.findUnique({
			where: {
				id: productId,
			},
		});

		let createOrUpdateOrderItem = await prismaClient.orderItem.findFirst({
			where: {
				orderId: order.id,
				productId: productId,
			},
		});

		if (createOrUpdateOrderItem) {
			createOrUpdateOrderItem = await prismaClient.orderItem.update({
				where: {
					id: createOrUpdateOrderItem.id,
				},
				data: {
					quantity: quantity,
					price: product.price * quantity,
				},
			});
		} else {
			createOrUpdateOrderItem = await prismaClient.orderItem.create({
				data: {
					id: await generateOrderItemId(),
					orderId: order.id,
					productId: productId,
					quantity: quantity,
					price: product.price * quantity,
				},
			});
		}

		res.status(200).json({
			data: createOrUpdateOrderItem,
		});
	} catch (e) {
		next(e);
	}
};

export default { create };
