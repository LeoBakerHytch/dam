import { type FragmentOf, type ResultOf, type VariablesOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';

export const UserFragment = graphql(`
  fragment User on User {
    id
    name
    email
    avatarUrl
  }
`);

export function readUserFragment(data: FragmentOf<typeof UserFragment>) {
  return readFragment(UserFragment, data);
}

export type User = ResultOf<typeof UserFragment>;

export const CurrentUserQuery = graphql(
  `
    query CurrentUser {
      currentUser {
        ...User
      }
    }
  `,
  [UserFragment],
);

export type CurrentUserQueryResult = ResultOf<typeof CurrentUserQuery>;

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

export type SetAvatarMutationVariables = VariablesOf<typeof SetAvatarMutation>;
export type SetAvatarMutationResult = ResultOf<typeof SetAvatarMutation>;

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

export type UpdateProfileMutationVariables = VariablesOf<typeof UpdateProfileMutation>;
export type UpdateProfileMutationResult = ResultOf<typeof UpdateProfileMutation>;
