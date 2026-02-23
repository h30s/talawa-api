[API Docs](/)

***

# Function: validateInput()

> **validateInput**\<`T`, `TResult`, `TContext`\>(`schema`, `resolver`): (`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

Defined in: [src/utilities/validation.ts:101](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L101)

Convenience function for basic input validation with Zod schema

## Type Parameters

### T

`T`

### TResult

`TResult` = `unknown`

### TContext

`TContext` = [`GraphQLContext`](../../../graphql/context/type-aliases/GraphQLContext.md)

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema to validate against

### resolver

(`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

The resolver function to wrap

## Returns

Wrapped resolver with schema validation

> (`parent`, `args`, `ctx`): `Promise`\<`TResult`\>

### Parameters

#### parent

`TParent`

#### args

`T`

#### ctx

`TContext`

### Returns

`Promise`\<`TResult`\>
