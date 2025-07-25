import { expect, test, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
	it("should be able to register", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "jonhdoe@gmail.com",
			password: "12345678",
		});

		expect(user.id).toEqual(expect.any(String));
	});
	it("should hash user password upon registration", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "jonhdoe@gmail.com",
			password: "12345678",
		});
		const isPasswordCorrectlyHashed = await compare(
			"12345678",
			user.password_hash
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});
	it("should not be able to register with same email twice", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const email = "johndoe@gmail.com";

		await registerUseCase.execute({
			name: "John Doe",
			email: email,
			password: "12345678",
		});

		await expect(() =>
			registerUseCase.execute({
				name: "John Doe",
				email,
				password: "12345678",
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
