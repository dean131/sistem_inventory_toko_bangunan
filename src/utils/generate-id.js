import { prismaClient } from "../application/database.js";

const generateOrderItemId = async () => {
	let randomString = "";
	while (true) {
		randomString = Math.random().toString(36).substring(2, 15);
		const countOrderItem = await prismaClient.orderItem.count({
			where: {
				id: randomString,
			},
		});
		if (countOrderItem === 0) {
			break;
		}
	}
	return randomString;
};

const generateOrderId = async () => {
	let randomString = "";
	while (true) {
		randomString = Math.random().toString(36).substring(2, 15);
		const countOrder = await prismaClient.order.count({
			where: {
				id: randomString,
			},
		});
		if (countOrder === 0) {
			break;
		}
	}
	return randomString;
};

export { generateOrderItemId, generateOrderId };
