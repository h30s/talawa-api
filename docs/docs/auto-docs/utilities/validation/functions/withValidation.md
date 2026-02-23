[API Docs](/)

***

# Function: withValidation()

> **withValidation**\<`TArgs`, `TResult`, `TParent`, `TContext`\>(`options`, `resolver`): (`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

Defined in: [src/utilities/validation.ts:29](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L29)

Higher-order function that wraps resolvers with validation logic

## Type Parameters

### TArgs

`TArgs` = `unknown`

### TResult

`TResult` = `unknown`

### TParent

`TParent` = `unknown`

### TContext

`TContext` = [`GraphQLContext`](../../../graphql/context/type-aliases/GraphQLContext.md)

## Parameters

### options

[`ValidationOptions`](../interfaces/ValidationOptions.md)\<`TArgs`, `TContext`\>

Validation configuration

### resolver

(`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

The actual resolver function

## Returns

Wrapped resolver with validation applied

> (`parent`, `args`, `ctx`): `Promise`\<`TResult`\>

### Parameters

#### parent

`TParent`

#### args

`TArgs`

#### ctx

`TContext`

### Returns

`Promise`\<`TResult`\>
