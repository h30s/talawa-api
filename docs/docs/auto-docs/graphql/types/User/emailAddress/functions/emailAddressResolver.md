[API Docs](/)

***

# Function: emailAddressResolver()

> **emailAddressResolver**(`parent`, `_args`, `ctx`): `Promise`\<`string`\>

Defined in: [src/graphql/types/User/emailAddress.ts:22](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/User/emailAddress.ts#L22)

Resolver for the User.emailAddress field.

Authorization logic:
- Users can view their own email address
- Administrators can view any user's email address

The `authenticated` scope ensures the user is logged in.
Additional authorization logic checks if the user is viewing their own email
or is an administrator.

## Parameters

### parent

The user object for which the email address is being resolved.

#### addressLine1

`string` \| `null`

#### addressLine2

`string` \| `null`

#### avatarMimeType

`string` \| `null`

#### avatarName

`string` \| `null`

#### birthDate

`Date` \| `null`

#### city

`string` \| `null`

#### countryCode

`string` \| `null`

#### createdAt

`Date`

#### creatorId

`string` \| `null`

#### description

`string` \| `null`

#### educationGrade

`string` \| `null`

#### emailAddress

`string`

#### employmentStatus

`string` \| `null`

#### failedLoginAttempts

`number`

#### homePhoneNumber

`string` \| `null`

#### id

`string`

#### isEmailAddressVerified

`boolean`

#### lastFailedLoginAt

`Date` \| `null`

#### lockedUntil

`Date` \| `null`

#### maritalStatus

`string` \| `null`

#### mobilePhoneNumber

`string` \| `null`

#### name

`string`

#### natalSex

`string` \| `null`

#### naturalLanguageCode

`string` \| `null`

#### passwordHash

`string`

#### postalCode

`string` \| `null`

#### role

`string`

#### state

`string` \| `null`

#### updatedAt

`Date` \| `null`

#### updaterId

`string` \| `null`

#### workPhoneNumber

`string` \| `null`

### \_args

`Record`\<`string`, `never`\>

No arguments are expected for this resolver, so this is an empty object.

### ctx

[`GraphQLContext`](../../../../context/type-aliases/GraphQLContext.md)

The GraphQL context, which includes information about the current client and a logger for error handling.

## Returns

`Promise`\<`string`\>

The email address of the user if the requester is authorized, otherwise throws an error.
