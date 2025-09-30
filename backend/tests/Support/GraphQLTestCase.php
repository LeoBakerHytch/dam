<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;

abstract class GraphQLTestCase extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;

    protected function authenticatedGraphQL(
        string $query,
        array $variables = [],
        string $token = '',
        array $extraHeaders = []
    ): TestResponse {
        $headers = array_merge([
            'Authorization' => "Bearer {$token}",
        ], $extraHeaders);

        return $this->graphQL($query, $variables, $headers);
    }

    protected function assertGraphQLHasErrors($response): void
    {
        $response->assertJsonStructure(['errors']);
        $this->assertNotEmpty($response->json('errors'));
    }

    protected function assertGraphQLHasError($response, string $expectedMessage): void
    {
        $response->assertJsonStructure(['errors']);

        $errors = $response->json('errors');
        $errorMessages = array_column($errors, 'message');

        $this->assertContains($expectedMessage, $errorMessages,
            "Expected error message '{$expectedMessage}' not found in: ".implode(', ', $errorMessages));
    }
}
