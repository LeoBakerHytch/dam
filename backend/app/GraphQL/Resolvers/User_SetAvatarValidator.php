<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Validation\Validator;

final class User_SetAvatarValidator extends Validator
{
    public function rules(): array
    {
        return [
            'avatar' => [
                'required',
                'file',
                'image',
                'max:2048', // 2MB in kilobytes
                'mimes:jpeg,jpg,png,gif,webp',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'An avatar image is required',
            'avatar.file' => 'Avatar must be a valid file',
            'avatar.image' => 'Avatar must be an image file',
            'avatar.max' => 'Avatar image must not exceed 2MB',
            'avatar.mimes' => 'Avatar must be a JPEG, PNG, GIF, or WebP image',
        ];
    }
}