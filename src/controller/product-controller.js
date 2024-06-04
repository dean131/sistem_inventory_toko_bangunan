import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createProductValidation, updateProductValidation } from "../validation/product-validation.js";

const generateRandomString = async () => {
	let randomString = "";
	while (true) {
		randomString = Math.random().toString(36).substring(2, 15);
		const countProduct = await prismaClient.product.count({
			where: {
				id: randomString,
			},
		});
		if (countProduct === 0) {
			break;
		}
	}
	return randomString;
};

const create = async (req, res, next) => {
	try {
		const product = validate(createProductValidation, req.body);

		const { supplierId } = product;

		const supplierCount = await prismaClient.supplier.count({
			where: {
				id: supplierId,
			},
		});

		if (supplierCount === 0) {
			throw new ResponseError(404, "Supplier not found");
		}

		product.id = await generateRandomString();

		const newProduct = await prismaClient.product.create({
			data: product,
		});

		res.status(200).json({
			data: newProduct,
		});
	} catch (e) {
		next(e);
	}
};

const get = async (req, res, next) => {
	try {
		const product = await prismaClient.product.findUnique({
			where: {
				id: req.params.id,
			},
		});

		if (!product) {
			throw new ResponseError(404, "Product not found");
		}

		res.status(200).json({
			data: product,
		});
	} catch (e) {
		next(e);
	}
};

const getMany = async (req, res, next) => {
	try {
		const name = req.query.name;

		let query = {};
		if (name) {
			query = {
				where: {
					name: {
						contains: name,
					},
				},
			};
		} else {
			query = {};
		}

		const products = await prismaClient.product.findMany(query);

		res.status(200).json({
			data: products,
		});
	} catch (e) {
		next(e);
	}
};

const update = async (req, res, next) => {
	try {
		const product = validate(updateProductValidation, req.body);

		const { supplierId, name, price, stock, minStock } = product;

		const supplierCount = await prismaClient.supplier.count({
			where: {
				id: supplierId,
			},
		});

		if (supplierCount === 0) {
			throw new ResponseError(404, "Supplier not found");
		}

		const updatedProduct = await prismaClient.product.update({
			where: {
				id: req.params.id,
			},
			data: {
				...(name && { name }),
				...(price && { price }),
				...(stock && { stock }),
				...(minStock && { minStock }),
				...(supplierId && { supplierId }),
			},
		});

		res.status(200).json({
			data: updatedProduct,
		});
	} catch (e) {
		next(e);
	}
};

const destroy = async (req, res, next) => {
	try {
		const productCount = await prismaClient.product.count({
			where: {
				id: req.params.id,
			},
		});

		if (productCount === 0) {
			throw new ResponseError(404, "Product not found");
		}

		await prismaClient.product.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json({
			message: "Product deleted",
		});
	} catch (e) {
		next(e);
	}
};

export default { create, get, getMany, update, destroy };
