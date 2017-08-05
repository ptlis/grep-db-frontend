<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(-1);

require __DIR__ . '/../vendor/autoload.php';

use Doctrine\DBAL\DriverManager;


// Only listen on POST
$expectedKeys = [
    'user',
    'password',
    'host',
    'port',
    'dbname'
    // TODO: Driver
];


$result = [];
$errors = [];


// Only accept POST requests
if ('POST' !== $_SERVER['REQUEST_METHOD']) {
    $errors[] = 'Requests must use the POST method';

// Ensure keys were sent
} else {
    foreach ($expectedKeys as $key) {
        if (!array_key_exists($key, $_POST)) {
            $errors[] = '"' . $key . '" must be provided';
        }
    }
}


if (!count($errors)) {
    try {
        $connection = DriverManager::getConnection([
            'dbname' => $_POST['dbname'],
            'user' => $_POST['user'],
            'password' => $_POST['password'],
            'host' => $_POST['host'],
            'port' => $_POST['port'],
            'driver' => 'pdo_mysql' // TODO: Allow selection
        ]);

        $statement = $connection->query('SHOW TABLES');
        while ($table = $statement->fetchColumn(0)) {
            $result[] = $table;
        }

    } catch (\Exception $e) {
        $errors[] = $e->getMessage();
    }
}


header('Content-Type: application/json');
if (!$errors) {
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode($errors);
}
