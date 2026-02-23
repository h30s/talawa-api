import SchemaBuilder from "@pothos/core";
import ComplexityPlugin from "@pothos/plugin-complexity";
import relayPlugin from "@pothos/plugin-relay";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import type { GraphQLContext } from "~/src/graphql/context";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "../utilities/graphqLimits";
import type { CustomScalars } from "./scalars/index";

/**
 * Auth scopes available for declarative authorization.
 * These map to user roles and permissions in the system.
 */
export type AuthScopes = {
	/** User must be authenticated */
	authenticated: boolean;
	/** User must have administrator role */
	administrator: boolean;
};

/**
 * This is the pothos schema builder used for talawa api's code first graphql implementation.
 */
export const builder = new SchemaBuilder<{
	AuthScopes: AuthScopes;
	Context: GraphQLContext;
	Scalars: CustomScalars;
}>({
	plugins: [relayPlugin, ComplexityPlugin, ScopeAuthPlugin],
	complexity: {
		defaultComplexity: envConfig.API_GRAPHQL_SCALAR_FIELD_COST, // default cost for scalar fields
		defaultListMultiplier: 0,
	},
	relay: {},
	scopeAuth: {
		// Define auth scopes that map to user roles and permissions
		authScopes: async (context: GraphQLContext) => {
			// Check if user is authenticated
			const isAuthenticated =
				context.currentClient.isAuthenticated &&
				context.currentClient.user !== undefined;

			if (!isAuthenticated) {
				return {
					authenticated: false,
					administrator: false,
				};
			}

			return {
				authenticated: true,
				administrator: async () => {
					const currentUserId = context.currentClient.user?.id;
					if (!currentUserId) return false;

					// Get full user details including role
					const currentUser =
						await context.drizzleClient.query.usersTable.findFirst({
							columns: {
								role: true,
							},
							where: (fields, operators) => {
								return operators.eq(fields.id, currentUserId);
							},
						});

					return currentUser?.role === "administrator";
				},
			};
		},
		// Configure error handling to throw TalawaGraphQLError
		unauthorizedError: () => {
			return new TalawaGraphQLError({
				extensions: {
					code: "unauthorized_action",
				},
			});
		},
	},
});
