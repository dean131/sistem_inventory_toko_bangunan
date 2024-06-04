import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createSupplierValidation, updateSupplierValidation } from "../validation/supplier-validation.js";

const generateRandomString = async () => {
	let randomString = "";
	while (true) {
		randomString = Math.random().toString(36).substring(2, 15);
		const countSupplier = await prismaClient.supplier.count({
			where: {
				id: randomString,
			},
		});
		if (countSupplier === 0) {
			break;
		}
	}
	return randomString;
};

const create = async (req, res, next) => {
	try {
		const supplier = validate(createSupplierValidation, req.body);

		const countSupplier = await prismaClient.supplier.count({
			where: {
				whatsapp: supplier.whatsapp,
			},
		});

		if (countSupplier > 0) {
			throw new ResponseError(400, "Whatsapp sudah digunakan");
		}

		supplier.id = await generateRandomString();

		const newSupplier = await prismaClient.supplier.create({
			data: supplier,
		});

		res.status(200).json({
			data: newSupplier,
		});
	} catch (e) {
		next(e);
	}
};

const update = async (req, res, next) => {
	try {
		const supplier = validate(updateSupplierValidation, req.body);

		const { name, contactPerson, whatsapp, address } = supplier;

		const supplierCount = await prismaClient.supplier.count({
			where: {
				id: req.params.id,
			},
		});

		if (supplierCount === 0) {
			throw new ResponseError(404, "Supplier not found");
		}

		const updatedSupplier = await prismaClient.supplier.update({
			where: {
				id: req.params.id,
			},
			data: {
				...(name && { name }),
				...(contactPerson && { contactPerson }),
				...(whatsapp && { whatsapp }),
				...(address && { address }),
			},
		});

		res.status(200).json({
			data: updatedSupplier,
		});
	} catch (e) {
		next(e);
	}
};

const get = async (req, res, next) => {
	try {
		const supplier = await prismaClient.supplier.findUnique({
			where: {
				id: req.params.id,
			},
		});

		if (!supplier) {
			throw new ResponseError(404, "Supplier not found");
		}

		res.status(200).json({
			data: supplier,
		});
	} catch (e) {
		next(e);
	}
};

const getMany = async (req, res, next) => {
	try {
		const suppliers = await prismaClient.supplier.findMany();

		res.status(200).json({
			data: suppliers,
		});
	} catch (e) {
		next(e);
	}
};

const destroy = async (req, res, next) => {
	try {
		const supplierCount = await prismaClient.supplier.count({
			where: {
				id: req.params.id,
			},
		});

		if (supplierCount === 0) {
			throw new ResponseError(404, "Supplier not found");
		}

		await prismaClient.supplier.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json({
			message: "Supplier deleted",
		});
	} catch (e) {
		next(e);
	}
};

export default { create, update, get, getMany, destroy };
