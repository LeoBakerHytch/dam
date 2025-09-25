<?php declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;

final class RegisterUserValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.name' => ['required', 'string', 'max:255'],
            'input.email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'input.password' => ['required', 'string', 'min:8'],
        ];
    }
}
