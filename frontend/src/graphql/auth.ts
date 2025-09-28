import { type FragmentOf, type ResultOf, type VariablesOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';
import { UserFragment } from './user';

export const AccessTokenFragment = graphql(`
  fragment AccessToken on AccessToken {
    jwt
    tokenType
    expiresIn
  }
`);

export function readAccessTokenFragment(data: FragmentOf<typeof AccessTokenFragment>) {
  return readFragment(AccessTokenFragment, data);
}

export type AccessToken = ResultOf<typeof AccessTokenFragment>;

export const RegisterMutation = graphql(
  `
    mutation Auth_Register($input: Auth_Register_Input!) {
      Auth_Register(input: $input) {
        accessToken {
          ...AccessToken
        }
        user {
          ...User
        }
      }
    }
  `,
  [AccessTokenFragment, UserFragment],
);

export type RegisterMutationVariables = VariablesOf<typeof RegisterMutation>;
export type RegisterMutationResult = ResultOf<typeof RegisterMutation>;

export const LoginMutation = graphql(
  `
    mutation Auth_IssueToken($input: Auth_IssueToken_Input!) {
      Auth_IssueToken(input: $input) {
        accessToken {
          ...AccessToken
        }
        user {
          ...User
        }
      }
    }
  `,
  [AccessTokenFragment, UserFragment],
);

export type LoginMutationVariables = VariablesOf<typeof LoginMutation>;
export type LoginMutationResult = ResultOf<typeof LoginMutation>;

// TODO: Set this up!
export const RefreshTokenMutation = graphql(
  `
    mutation Auth_RefreshToken {
      Auth_RefreshToken {
        accessToken {
          ...AccessToken
        }
      }
    }
  `,
  [AccessTokenFragment],
);

export type RefreshTokenMutationVariables = VariablesOf<typeof RefreshTokenMutation>;
export type RefreshTokenMutationResult = ResultOf<typeof RefreshTokenMutation>;

export const ChangePasswordMutation = graphql(
  `
    mutation Auth_ChangePassword($input: Auth_ChangePassword_Input!) {
      Auth_ChangePassword(input: $input) {
        user {
          ...User
        }
      }
    }
  `,
  [UserFragment],
);

export type ChangePasswordMutationVariables = VariablesOf<typeof ChangePasswordMutation>;
export type ChangePasswordMutationResult = ResultOf<typeof ChangePasswordMutation>;
