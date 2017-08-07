<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(-1);

require __DIR__ . '/../vendor/autoload.php';

use ptlis\GrepDb\GrepDb;


// Only listen on POST
$expectedKeys = [
    'user',
    'password',
    'host',
    'port',
    'dbname',
    'tables',
    'search_terms'
    // TODO: Driver
];


$result = [];
$errors = [];

// Only accept POST requests
if ('POST' !== $_SERVER['REQUEST_METHOD']) {
    $errors[] = 'Requests must use the POST method';

// Ensure required parameters were passed
} else {
    foreach ($expectedKeys as $key) {
        if (!array_key_exists($key, $_POST)) {
            $errors[] = '"' . $key . '" must be provided';
        }
    }
}


// Get the list of databases that this user can view
if (!count($errors)) {
    try {
        $rowCount = 0;

        $grepDb = new GrepDb($_POST['user'], $_POST['password'], $_POST['host'], $_POST['port']);

        foreach ($_POST['tables'] as $tableName) {
            $tableResult = $grepDb->searchTable($_POST['dbname'], $tableName, $_POST['search_terms']);
            $matchingRowCount = $tableResult->getMatchingCount();

            if ($matchingRowCount > 0) {
                $result[$tableName] = $matchingRowCount;
            }
        }

    } catch (\Exception $e) {
        $errors[] = $e->getMessage();
    }
}


// Build response
header('Content-Type: application/json');
if (!$errors) {
    http_response_code(200);

    $json = json_encode($result);
    if (false !== $json) {
        echo $json;
    } else {
        var_dump(json_last_error());
    }
} else {
    http_response_code(400);
    echo json_encode($errors);
}
