<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Validation\Validator;

final class User_UpdateProfileValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.name' => ['string', 'max:255'],
            'input.email' => ['email', 'max:255', 'unique:users,email'],
        ];
    }
}
