<?php

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;

final class LoginValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.email' => ['required', 'email'],
            'input.password' => ['required', 'string'],
        ];
    }
}
