import { type ResultOf, type VariablesOf } from 'gql.tada';

import { graphql } from './graphql';
import { UserFragment } from './user';

export const RegisterMutation = graphql(
  `
    mutation Auth_Register($input: Auth_Register_Input!) {
      Auth_Register(input: $input) {
        accessToken
        user {
          ...User
        }
      }
    }
  `,
  [UserFragment],
);

export type RegisterMutationVariables = VariablesOf<typeof RegisterMutation>;
export type RegisterMutationResult = ResultOf<typeof RegisterMutation>;

export const LoginMutation = graphql(
  `
    mutation Auth_IssueToken($input: Auth_IssueToken_Input!) {
      Auth_IssueToken(input: $input) {
        accessToken
        user {
          ...User
        }
      }
    }
  `,
  [UserFragment],
);

export type LoginMutationVariables = VariablesOf<typeof LoginMutation>;
export type LoginMutationResult = ResultOf<typeof LoginMutation>;

export const RefreshTokenMutation = graphql(`
  mutation Auth_RefreshToken {
    Auth_RefreshToken {
      accessToken
    }
  }
`);

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
