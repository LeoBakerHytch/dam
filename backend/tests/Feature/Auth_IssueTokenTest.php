<?php declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Tests\Support\GraphQLTestCase;

class Auth_IssueTokenTest extends GraphQLTestCase
{
    public function test_successful_login(): void
    {
        $password = 'password';
        $user = User::factory()
            ->withPassword($password)
            ->create();

        $response = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                    user {
                        id
                        email
                    }
                }
            }
        ', [
            'input' => [
                'email' => $user->email,
                'password' => $password,
            ]
        ]);

        $accessToken = $response->json('data.Auth_IssueToken.accessToken');
        $this->assertNotEmpty($accessToken);

        $email = $response->json('data.Auth_IssueToken.user.email');
        $this->assertEquals($user->email, $email);
    }

    public function test_login_with_invalid_email(): void
    {
        User::factory()->create(['email' => 'user@example.com']);

        $response = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                }
            }
        ', [
            'input' => [
                'email' => 'nonexistent@example.com',
                'password' => 'password',
            ],
        ]);

        $this->assertGraphQLHasError($response, 'Invalid credentials');
    }

    public function test_login_with_invalid_password(): void
    {
        $user = User::factory()
            ->withPassword('correct_password')
            ->create();

        $response = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                }
            }
        ', [
            'input' => [
                'email' => $user->email,
                'password' => 'wrong_password',
            ],
        ]);

        $this->assertGraphQLHasError($response, 'Invalid credentials');
    }

    public function test_login_with_non_existent_user(): void
    {
        $response = $this->graphQL('
            mutation AuthIssueToken($input: Auth_IssueToken_Input!) {
                Auth_IssueToken(input: $input) {
                    accessToken
                }
            }
        ', [
            'input' => [
                'email' => 'nonexistent@example.com',
                'password' => 'password',
            ],
        ]);

        $this->assertGraphQLHasError($response, 'Invalid credentials');
    }

    public function test_issued_token_works_for_authenticated_requests(): void
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

        $accessToken = $loginResponse->json('data.Auth_IssueToken.accessToken');

        $authenticatedResponse = $this->authenticatedGraphQL('
            query {
                currentUser {
                    email
                }
            }
        ', [], $accessToken);

        $authenticatedResponse->assertJsonPath('data.currentUser.email', $user->email);;
    }
}
