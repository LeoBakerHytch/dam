<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Validation\Validator;

final class Auth_User_RegisterValidator extends Validator
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
