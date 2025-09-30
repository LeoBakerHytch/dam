<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Tests\Support\GraphQLTestCase;

class Auth_RefreshTokenTest extends GraphQLTestCase
{
    public function test_successful_token_refresh(): void
    {
        $password = 'password123';
        $user = User::factory()->withPassword($password)->create();

        $loginResponse = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                }
            }
        ', [
            'input' => [
                'email' => $user->email,
                'password' => $password,
            ],
        ]);

        $originalToken = $loginResponse->json('data.Auth_IssueToken.accessToken');

        $response = $this->authenticatedGraphQL('
            mutation {
                Auth_RefreshToken {
                    accessToken
                }
            }
        ', [], $originalToken);

        $newAccessToken = $response->json('data.Auth_RefreshToken.accessToken');
        $this->assertNotEmpty($newAccessToken);
        $this->assertNotEquals($originalToken, $newAccessToken);
    }

    public function test_refresh_without_authorization_header(): void
    {
        $response = $this->graphQL('
            mutation {
                Auth_RefreshToken {
                    accessToken
                }
            }
        ');

        $this->assertGraphQLHasErrors($response);
    }

    public function test_refreshed_token_works_for_authenticated_requests(): void
    {
        $password = 'password123';
        $user = User::factory()->withPassword($password)->create();

        $loginResponse = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                }
            }
        ', [
            'input' => [
                'email' => $user->email,
                'password' => $password,
            ],
        ]);

        $originalToken = $loginResponse->json('data.Auth_IssueToken.accessToken');

        $refreshResponse = $this->authenticatedGraphQL('
            mutation {
                Auth_RefreshToken {
                    accessToken
                }
            }
        ', [], $originalToken);

        $newToken = $refreshResponse->json('data.Auth_RefreshToken.accessToken');

        $authenticatedResponse = $this->authenticatedGraphQL('
            query {
                currentUser {
                    email
                }
            }
        ', [], $newToken);

        $authenticatedResponse->assertJsonPath('data.currentUser.email', $user->email);
    }
}
