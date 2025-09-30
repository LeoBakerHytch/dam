<?php

declare(strict_types=1);

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;

/**
 * Marks a field that is backed by an Attribute accessor on the model.
 *
 * This is a documentation-only directive that indicates the field doesn't need
 *
 * @rename because an accessor with the field's name exists on the model.
 */
final class AccessorDirective extends BaseDirective
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Indicates this field is backed by an Attribute accessor on the model.
No @rename needed because the accessor name matches the field name.
"""
directive @accessor on FIELD_DEFINITION
GRAPHQL;
    }
}
