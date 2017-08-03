<?php

namespace ptlis\GrepDbCli\Command;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;

/**
 * Commonly used arguments & options.
 */
final class CommonOptions
{
    /* Option names */
    const OPTION_HOST = 'host';
    const OPTION_USERNAME = 'username';
    const OPTION_PASSWORD = 'password';
    const OPTION_DBNAME = 'dbname';
    const OPTION_PORT = 'port';


    /**
     * Set commonly used options for a command.
     *
     * @param Command $command
     */
    public static function setCommonOptions(
        Command $command
    ) {
        $command
            ->addOption(self::OPTION_HOST, null, InputOption::VALUE_REQUIRED, 'Hostname')
            ->addOption(self::OPTION_USERNAME, null, InputOption::VALUE_REQUIRED, 'Username')
            ->addOption(self::OPTION_PASSWORD, null, InputOption::VALUE_REQUIRED, 'Password')
            ->addOption(self::OPTION_DBNAME, null, InputOption::VALUE_REQUIRED, 'The database to search in')
            ->addOption(self::OPTION_PORT, null, InputOption::VALUE_REQUIRED, 'Port');
    }
}
