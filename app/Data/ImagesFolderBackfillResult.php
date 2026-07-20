<?php

namespace App\Data;

final readonly class ImagesFolderBackfillResult
{
    /**
     * @param  list<int>  $unresolvedWorldIds
     */
    public function __construct(
        public int $marked,
        public int $wouldMark,
        public int $alreadyCorrect,
        public array $unresolvedWorldIds,
    ) {}
}
