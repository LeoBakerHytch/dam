import { FragmentOf, ResultOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';

export const UserFragment = graphql(`
  fragment User on User {
    id
    name
    email
    avatarUrl
  }
`);

export type User = ResultOf<typeof UserFragment>;

export function readUserFragment(data: FragmentOf<typeof UserFragment>) {
  return readFragment(UserFragment, data);
}

export const SetAvatarMutation = graphql(
  `
    mutation User_SetAvatar($input: User_SetAvatar_Input!) {
      User_SetAvatar(input: $input) {
        user {
          ...User
        }
      }
    }
  `,
  [UserFragment],
);

export const UpdateProfileMutation = graphql(
  `
    mutation User_UpdateProfile($input: User_UpdateProfile_Input!) {
      User_UpdateProfile(input: $input) {
        user {
          ...User
        }
      }
    }
  `,
  [UserFragment],
);
