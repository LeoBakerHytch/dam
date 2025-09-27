import { FragmentOf, ResultOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';
import { UserFragment } from './user';

export const AccessTokenFragment = graphql(`
  fragment AccessToken on AccessToken {
    jwt
    tokenType
    expiresIn
  }
`);

export type AccessToken = ResultOf<typeof AccessTokenFragment>;

export function AccessToken(data: FragmentOf<typeof AccessTokenFragment>) {
  return readFragment(AccessTokenFragment, data);
}

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
