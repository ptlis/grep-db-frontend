<?php

namespace ptlis\GrepDbCli\Command;

use ptlis\GrepDb\GrepDb;
use ptlis\GrepDb\Search\Result\DatabaseResultGateway;
use ptlis\GrepDb\Search\Result\TableResultGateway;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Console command to perform a search.
 */
final class SearchCommand extends Command
{
    /** Command arguments & options */
    const ARGUMENT_SEARCH = 'search';
    const OPTION_TABLE = 'table';

    /*
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('search')
            ->setDescription('Search')
            ->addOption(self::OPTION_TABLE, null, InputOption::VALUE_REQUIRED, '(optional) The table to search in')
            ->addArgument(self::ARGUMENT_SEARCH, InputArgument::REQUIRED);

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
        $tableName = $input->getOption(self::OPTION_TABLE);


        if (strlen($tableName)) {
            $tableResults = $grepDb->searchTable($tableName, $searchTerm);
            $this->displayTableResults($output, $tableResults);

        } else {
            $databaseResults = $grepDb->searchDatabase($searchTerm);
            $this->displayDatabaseResults($output, $databaseResults);
        }
    }

    /**
     * Output results of a whole-database search.
     *
     * @param OutputInterface $output
     * @param DatabaseResultGateway $databaseResults
     */
    private function displayDatabaseResults(
        OutputInterface $output,
        DatabaseResultGateway $databaseResults
    ) {
        $output->writeln('Found ' . $databaseResults->getMatchingTableCount() . ' matching tables');
        $output->writeln('Found ' . $databaseResults->getMatchingRowCount() . ' matching rows across all tables');

        foreach ($databaseResults->getMatchingTables() as $tableResults) {
            $this->displayTableResults($output, $tableResults);
        }
    }

    /**
     * Output results of a single-table search.
     *
     * @param OutputInterface $output
     * @param TableResultGateway $tableResults
     */
    private function displayTableResults(
        OutputInterface $output,
        TableResultGateway $tableResults
    ) {
        $output->writeln($tableResults->getMetadata()->getName() . ':');

        foreach ($tableResults->getMatchingRows() as $rowResult) {
            $output->writeln('Table: ' . $tableResults->getMetadata()->getName());

            if ($rowResult->hasPrimaryKey()) {
                $output->writeln('  Primary Key: ' . $rowResult->getPrimaryKeyColumn()->getName() . ', ' . $rowResult->getPrimaryKeyValue());
            }

            foreach ($rowResult->getMatchingColumns() as $columnResult) {
                $output->writeln('    Column: ' . $columnResult->getMetadata()->getName());
                $output->writeln('    Value: ' . $columnResult->getValue());
            }

            $output->writeln('');
        }

        $output->writeln('Found ' . $tableResults->getMatchingCount() . ' results in "' . $tableResults->getMetadata()->getName() . '"');
    }
}
