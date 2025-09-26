<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Validation\Validator;

final class Auth_Token_IssueValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.email' => ['required', 'email'],
            'input.password' => ['required', 'string'],
        ];
    }
}
