import { prisma } from "@/lib/prisma";
import { PrismaUsersRespositorie } from "@/repositories/prisma-users-repositorie";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export async function registerUseCase({
	name,
	email,
	password,
}: RegisterUseCaseRequest) {
	const password_hash = await hash(password, 6);

	const userWithSameEmail = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (userWithSameEmail) {
		throw new Error("Email already exists.");
	}

	const prismaUsersRepository = new PrismaUsersRespositorie();

	await prismaUsersRepository.create({
		name,
		email,
		password_hash,
	});
}
