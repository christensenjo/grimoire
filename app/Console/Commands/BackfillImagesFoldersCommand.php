<?php

namespace App\Console\Commands;

use App\Actions\BackfillImagesFolders;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('worlds:backfill-images-folders {--apply : Mark folders after auditing each world}')]
#[Description('Audit or backfill the system images folder marker for existing worlds')]
class BackfillImagesFoldersCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(BackfillImagesFolders $backfillImagesFolders): int
    {
        $apply = (bool) $this->option('apply');
        $result = $backfillImagesFolders($apply);

        if ($apply) {
            $this->info("{$result->marked} marked; {$result->alreadyCorrect} already correct.");
        } else {
            $this->info("Audit only: {$result->wouldMark} would be marked; {$result->alreadyCorrect} already correct.");
        }

        if ($result->unresolvedWorldIds !== []) {
            $worldIds = implode(', ', $result->unresolvedWorldIds);
            $this->error("Unresolved world IDs: {$worldIds}");

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
