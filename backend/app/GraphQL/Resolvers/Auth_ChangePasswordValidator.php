<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Illuminate\Validation\Rules;
use Nuwave\Lighthouse\Validation\Validator;

final class Auth_ChangePasswordValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.newPassword' => [Rules\Password::defaults()],
        ];
    }
}
