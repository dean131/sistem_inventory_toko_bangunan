import { validate } from "../validation/validation.js";
import { loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const generateRandomString = async () => {
	let randomString = "";
	while (true) {
		randomString = Math.random().toString(36).substring(2, 15);
		const countUser = await prismaClient.user.count({
			where: {
				id: randomString,
			},
		});
		if (countUser === 0) {
			break;
		}
	}
	return randomString;
};

const register = async (req, res, next) => {
	try {
		const user = validate(registerUserValidation, req.body);

		const countUser = await prismaClient.user.count({
			where: {
				whatsapp: user.whatsapp,
			},
		});

		if (countUser > 0) {
			throw new ResponseError(400, "Whatsapp sudah digunakan");
		}

		user.password = await bcrypt.hash(user.password, 10);

		user.id = await generateRandomString();

		const newUser = await prismaClient.user.create({
			data: user,
			select: {
				id: true,
				whatsapp: true,
				name: true,
			},
		});

		res.status(200).json({
			data: newUser,
		});
	} catch (e) {
		next(e);
	}
};

const login = async (req, res, next) => {
	try {
		const loginRequest = validate(loginUserValidation, req.body);

		const user = await prismaClient.user.findUnique({
			where: {
				whatsapp: loginRequest.whatsapp,
			},
			select: {
				id: true,
				whatsapp: true,
				password: true,
			},
		});

		if (!user) {
			throw new ResponseError(401, "Username or password wrong");
		}

		const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
		if (!isPasswordValid) {
			throw new ResponseError(401, "Username or password wrong");
		}

		const token = uuid().toString();
		const updatedUser = await prismaClient.user.update({
			data: {
				token: token,
			},
			where: {
				id: user.id,
			},
			select: {
				id: true,
				name: true,
				whatsapp: true,
				token: true,
			},
		});

		res.status(200).json({
			data: updatedUser,
		});
	} catch (e) {
		next(e);
	}
};

const get = async (req, res, next) => {
	try {
		const user = await prismaClient.user.findUnique({
			where: {
				id: req.user.id,
			},
			select: {
				id: true,
				whatsapp: true,
				name: true,
			},
		});

		if (!user) {
			throw new ResponseError(404, "user is not found");
		}

		res.status(200).json({
			data: user,
		});
	} catch (e) {
		next(e);
	}
};

const update = async (req, res, next) => {
	try {
		const user = validate(updateUserValidation, req.body);

		const { name, whatsapp, password } = user;

		const totalUserInDatabase = await prismaClient.user.count({
			where: {
				id: user.id,
			},
		});

		if (totalUserInDatabase === 0) {
			throw new ResponseError(404, "user is not found");
		}

		let hashedPassword;
		if (password) {
			const saltRounds = 10;
			hashedPassword = await bcrypt.hash(password, saltRounds);
		}

		const updatedUser = await prismaClient.user.update({
			where: { id: req.user.id },
			data: {
				...(name && { name }),
				...(whatsapp && { whatsapp }),
				...(password && { password: hashedPassword }),
			},
			select: {
				id: true,
				whatsapp: true,
				name: true,
			},
		});

		res.status(200).json({
			data: updatedUser,
		});
	} catch (e) {
		next(e);
	}
};

const logout = async (req, res, next) => {
	try {
		const user = await prismaClient.user.findUnique({
			where: {
				id: req.user.id,
			},
		});

		if (!user) {
			throw new ResponseError(404, "user is not found");
		}

		await prismaClient.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				token: null,
			},
		});

		res.status(200).json({
			data: "OK",
		});
	} catch (e) {
		next(e);
	}
};

export default {
	register,
	login,
	get,
	update,
	logout,
};
