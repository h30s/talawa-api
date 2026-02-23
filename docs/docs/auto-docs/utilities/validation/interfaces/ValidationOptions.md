[API Docs](/)

***

# Interface: ValidationOptions\<TInput, TContext\>

Defined in: [src/utilities/validation.ts:11](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L11)

Validation wrapper utility for GraphQL resolvers
Provides consistent validation and error handling

## Type Parameters

### TInput

`TInput` = `unknown`

### TContext

`TContext` = [`GraphQLContext`](../../../graphql/context/type-aliases/GraphQLContext.md)

## Properties

### schema?

> `optional` **schema**: `ZodType`\<`TInput`, `unknown`, `$ZodTypeInternals`\<`TInput`, `unknown`\>\>

Defined in: [src/utilities/validation.ts:16](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L16)

***

### transform()?

> `optional` **transform**: (`input`) => `TInput` \| `Promise`\<`TInput`\>

Defined in: [src/utilities/validation.ts:20](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L20)

#### Parameters

##### input

`TInput`

#### Returns

`TInput` \| `Promise`\<`TInput`\>

***

### validate()?

> `optional` **validate**: (`input`, `ctx`) => `void` \| `Promise`\<`void`\>

Defined in: [src/utilities/validation.ts:18](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/validation.ts#L18)

#### Parameters

##### input

`TInput`

##### ctx

`TContext`

#### Returns

`void` \| `Promise`\<`void`\>
