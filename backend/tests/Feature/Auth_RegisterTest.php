<?php declare(strict_types=1);

namespace Tests\Feature;

use Tests\Support\GraphQLTestCase;

class Auth_RegisterTest extends GraphQLTestCase
{
    public function test_successful_registration(): void
    {
        $userData = [
            'name' => 'Max Mustermann',
            'email' => 'max@example.com',
            'password' => 'password123',
        ];

        $response = $this->graphQL('
            mutation AuthRegister($input: Auth_Register_Input!) {
                Auth_Register(input: $input) {
                    accessToken
                    user {
                        id
                        name
                        email
                    }
                }
            }
        ', ['input' => $userData]);

        $response->assertJson([
            'data' => [
                'Auth_Register' => [
                    'user' => [
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                    ]
                ]
            ]
        ]);

        $accessToken = $response->json('data.Auth_Register.accessToken');
        $this->assertNotEmpty($accessToken);

        $this->assertDatabaseHas('users', [
            'name' => $userData['name'],
            'email' => $userData['email'],
        ]);
    }
}
