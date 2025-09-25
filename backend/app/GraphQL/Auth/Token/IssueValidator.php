<?php

namespace App\GraphQL\Auth\Token;

use Nuwave\Lighthouse\Validation\Validator;

final class IssueValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.email' => ['required', 'email'],
            'input.password' => ['required', 'string'],
        ];
    }
}
