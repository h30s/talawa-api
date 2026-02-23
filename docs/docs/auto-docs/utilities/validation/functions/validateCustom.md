[API Docs](/)

***

# Function: validateCustom()

> **validateCustom**\<`TArgs`, `TResult`, `TContext`\>(`validateFn`, `resolver`): (`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

Defined in: [src/utilities/validation.ts:118](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L118)

Convenience function for custom validation logic

## Type Parameters

### TArgs

`TArgs` = `unknown`

### TResult

`TResult` = `unknown`

### TContext

`TContext` = [`GraphQLContext`](../../../graphql/context/type-aliases/GraphQLContext.md)

## Parameters

### validateFn

(`input`, `ctx`) => `void` \| `Promise`\<`void`\>

Custom validation function

### resolver

(`parent`, `args`, `ctx`) => `Promise`\<`TResult`\>

The resolver function to wrap

## Returns

Wrapped resolver with custom validation

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
