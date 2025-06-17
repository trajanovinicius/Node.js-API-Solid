import { expect, test, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
	it("should be able to authenticate", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "jonh Doe",
			email: "jonhdoe@gmail.com",
			password_hash: await hash("12345678", 6),
		});

		const { user } = await sut.execute({
			email: "jonhdoe@gmail.com",
			password: "12345678",
		});

		expect(user.id).toEqual(expect.any(String));
	});
	it("should not be able to authenticate with wrong email", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		expect(() =>
			sut.execute({
				email: "jonhdoe@gmail.com",
				password: "12345678",
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
	it("should not be able to authenticate with wrong password", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "jonh Doe",
			email: "jonhdoe@gmail.com",
			password_hash: await hash("12345678", 6),
		});

		expect(() =>
			sut.execute({
				email: "jonhdoe@gmail.com",
				password: "123123",
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
