<?php

namespace ptlis\GrepDbCli\Command;

use ptlis\GrepDb\GrepDb;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Console command to perform a search and replace.
 */
final class ReplaceCommand extends Command
{
    /** Command arguments & options */
    const ARGUMENT_SEARCH = 'search';
    const ARGUMENT_REPLACE = 'replace';
    const OPTION_TABLE = 'table';

    /*
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('replace')
            ->setDescription('Search & replace')
            ->addOption(self::OPTION_TABLE, null, InputOption::VALUE_REQUIRED, '(optional) The table to search in')
            ->addArgument(self::ARGUMENT_SEARCH, InputArgument::REQUIRED)
            ->addArgument(self::ARGUMENT_REPLACE, InputArgument::REQUIRED);

        CommonOptions::setCommonOptions($this);
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $grepDb = new GrepDb(
            $input->getOption(CommonOptions::OPTION_USERNAME),
            $input->getOption(CommonOptions::OPTION_PASSWORD),
            $input->getOption(CommonOptions::OPTION_HOST),
            $input->getOption(CommonOptions::OPTION_DBNAME),
            $input->getOption(CommonOptions::OPTION_PORT)
        );

        $searchTerm = $input->getArgument(self::ARGUMENT_SEARCH);
        $replaceTerm = $input->getArgument(self::ARGUMENT_REPLACE);
        $tableName = $input->getOption(self::OPTION_TABLE);

        // If a table is specified then limit the search & replace to it, otherwise visit the whole database.
        if (strlen($tableName)) {
            $grepDb->replaceTable($tableName, $searchTerm, $replaceTerm);
        } else {
            $grepDb->replaceDatabase($searchTerm, $replaceTerm);
        }
    }
}
