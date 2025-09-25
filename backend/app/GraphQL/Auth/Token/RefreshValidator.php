<?php

namespace App\GraphQL\Auth\Token;

use Nuwave\Lighthouse\Validation\Validator;

final class RefreshValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.refresh_token' => ['required', 'string'],
        ];
    }
}
