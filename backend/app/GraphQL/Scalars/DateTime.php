<?php declare(strict_types=1);

namespace App\GraphQL\Scalars;

use Carbon\Carbon;
use Nuwave\Lighthouse\Schema\Types\Scalars\DateTime as BaseDateTime;

final class DateTime extends BaseDateTime
{
    protected function format(Carbon $carbon): string
    {
        return $carbon->utc()->format('Y-m-d\TH:i:s\Z');
    }
}
