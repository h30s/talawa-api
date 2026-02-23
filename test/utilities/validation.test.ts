import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import {
	validateCustom,
	validateInput,
	withValidation,
} from "~/src/utilities/validation";

describe("validation utilities", () => {
	describe("withValidation", () => {
		it("should validate input using Zod schema and call resolver", async () => {
			const schema = z.object({
				name: z.string().min(1),
				age: z.number().min(18),
			});

			const resolver = vi.fn(async (_parent, args, _ctx) => {
				return `Hello ${args.name}, age ${args.age}`;
			});

			const wrappedResolver = withValidation({ schema }, resolver);

			const result = await wrappedResolver({}, { name: "John", age: 25 }, {});

			expect(result).toBe("Hello John, age 25");
			expect(resolver).toHaveBeenCalledWith({}, { name: "John", age: 25 }, {});
		});

		it("should throw TalawaGraphQLError for invalid Zod schema validation", async () => {
			const schema = z.object({
				name: z.string().min(1),
				age: z.number().min(18),
			});

			const resolver = vi.fn();
			const wrappedResolver = withValidation({ schema }, resolver);

			await expect(
				wrappedResolver({}, { name: "", age: 15 }, {}),
			).rejects.toThrow(TalawaGraphQLError);

			expect(resolver).not.toHaveBeenCalled();
		});

		it("should call custom validation function", async () => {
			const customValidate = vi.fn(
				async (args: { email: string }, _ctx: Record<string, never>) => {
					if (args.email === "taken@example.com") {
						throw new TalawaGraphQLError({
							extensions: {
								code: "invalid_arguments",
								issues: [
									{
										argumentPath: ["email"],
										message: "Email already taken",
									},
								],
							},
						});
					}
				},
			);

			const resolver = vi.fn(
				async (
					_parent: Record<string, never>,
					args: { email: string },
					_ctx: Record<string, never>,
				) => {
					return `Email: ${args.email}`;
				},
			);

			const wrappedResolver = withValidation(
				{ validate: customValidate },
				resolver,
			);

			// Valid case
			const result = await wrappedResolver(
				{},
				{ email: "new@example.com" },
				{},
			);
			expect(result).toBe("Email: new@example.com");
			expect(customValidate).toHaveBeenCalled();

			// Invalid case
			await expect(
				wrappedResolver({}, { email: "taken@example.com" }, {}),
			).rejects.toThrow(TalawaGraphQLError);
		});

		it("should apply transform function to validated input", async () => {
			const schema = z.object({
				name: z.string(),
			});

			const transform = vi.fn(async (args: { name: string }) => ({
				...args,
				name: args.name.toUpperCase(),
			}));

			const resolver = vi.fn(
				async (
					_parent: Record<string, never>,
					args: { name: string },
					_ctx: Record<string, never>,
				) => {
					return { name: args.name }; // Return object to match transform output
				},
			);

			const wrappedResolver = withValidation({ schema, transform }, resolver);

			const result = await wrappedResolver({}, { name: "john" }, {});

			expect(result).toEqual({ name: "JOHN" });
			expect(transform).toHaveBeenCalledWith({ name: "john" });
		});

		it("should re-throw TalawaGraphQLError as-is", async () => {
			const customValidate = async () => {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthorized_action",
					},
				});
			};

			const resolver = vi.fn();
			const wrappedResolver = withValidation(
				{ validate: customValidate },
				resolver,
			);

			await expect(wrappedResolver({}, {}, {})).rejects.toThrow(
				TalawaGraphQLError,
			);
		});

		it("should handle non-TalawaGraphQLError exceptions", async () => {
			const customValidate = async () => {
				throw new Error("Unexpected error");
			};

			const resolver = vi.fn();
			const wrappedResolver = withValidation(
				{ validate: customValidate },
				resolver,
			);

			const err = await wrappedResolver({}, {}, {}).catch((e) => e);
			expect(err).toBeInstanceOf(TalawaGraphQLError);
			expect((err as TalawaGraphQLError).extensions.code).toBe(
				"internal_server_error",
			);
		});

		it("should handle non-Error exceptions (e.g. throwing a string)", async () => {
			const customValidate = async () => {
				throw "A raw string error";
			};

			const resolver = vi.fn();
			const wrappedResolver = withValidation(
				{ validate: customValidate },
				resolver,
			);

			const err = await wrappedResolver({}, {}, {}).catch((e) => e);
			expect(err).toBeInstanceOf(TalawaGraphQLError);
			expect((err as TalawaGraphQLError).extensions.code).toBe(
				"internal_server_error",
			);
		});

		it("should handle both schema and validate correctly", async () => {
			const schema = z.object({
				name: z.string().min(1),
			});

			const customValidate = vi.fn(
				async (args: { name: string }, _ctx: Record<string, never>) => {
					if (args.name === "admin") {
						throw new Error("Cannot be admin");
					}
				},
			);

			const resolver = vi.fn(
				async (
					_parent: Record<string, never>,
					args: { name: string },
					_ctx: Record<string, never>,
				) => {
					return `Hello ${args.name}`;
				},
			);

			const wrappedResolver = withValidation(
				{ schema, validate: customValidate },
				resolver,
			);

			// Valid case
			const result = await wrappedResolver({}, { name: "User" }, {});
			expect(result).toBe("Hello User");

			// Schema fail case
			await expect(wrappedResolver({}, { name: "" }, {})).rejects.toThrow(
				TalawaGraphQLError,
			);

			// Validate fail case
			const err = await wrappedResolver({}, { name: "admin" }, {}).catch(
				(e) => e,
			);
			expect(err).toBeInstanceOf(TalawaGraphQLError);
			expect((err as TalawaGraphQLError).extensions.code).toBe(
				"internal_server_error",
			);
		});
	});

	describe("validateInput", () => {
		it("should be a convenience wrapper for schema validation", async () => {
			const schema = z.object({
				username: z.string().min(3),
			});

			const resolver = vi.fn(
				async (
					_parent: Record<string, never>,
					args: { username: string },
					_ctx: Record<string, never>,
				) => {
					return `User: ${args.username}`;
				},
			);

			const wrappedResolver = validateInput(schema, resolver);

			const result = await wrappedResolver({}, { username: "john" }, {});

			expect(result).toBe("User: john");
			expect(resolver).toHaveBeenCalled();
		});
	});

	describe("validateCustom", () => {
		it("should be a convenience wrapper for custom validation", async () => {
			const customValidate = vi.fn(async (args: { value: number }) => {
				if (args.value < 0) {
					throw new Error("Value must be positive");
				}
			});

			const resolver = vi.fn(
				async (
					_parent: Record<string, never>,
					args: { value: number },
					_ctx: Record<string, never>,
				) => {
					return args.value * 2;
				},
			);

			const wrappedResolver = validateCustom(customValidate, resolver);

			const result = await wrappedResolver({}, { value: 5 }, {});

			expect(result).toBe(10);
			expect(customValidate).toHaveBeenCalled();
		});

		it("should successfully throw TalawaGraphQLError when customvalidation fails", async () => {
			const customValidate = vi.fn(async (args: { value: number }) => {
				if (args.value < 0) {
					throw new Error("Value must be positive");
				}
			});

			const resolver = vi.fn();
			const wrappedResolver = validateCustom(customValidate, resolver);

			const err = await wrappedResolver({}, { value: -5 }, {}).catch((e) => e);
			expect(err).toBeInstanceOf(TalawaGraphQLError);
			expect((err as TalawaGraphQLError).extensions.code).toBe(
				"internal_server_error",
			);
		});
	});
});
