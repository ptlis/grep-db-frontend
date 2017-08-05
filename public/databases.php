<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(-1);

require __DIR__ . '/../vendor/autoload.php';

use Doctrine\DBAL\DriverManager;


// Only listen on POST
$keys = [
    'user',
    'password',
    'host',
    'port',
    // TODO: Driver
];


$result = [];
$errors = [];


// Only accept POST requests
if ('POST' !== $_SERVER['REQUEST_METHOD']) {
    $errors[] = 'Requests must use the POST method';

// Ensure keys were sent
} else {
    foreach ($keys as $key) {
        if (!array_key_exists($key, $_POST)) {
            $errors[] = '"' . $key . '" must be provided';
        }
    }
}

// Internal mySQL database to ignore
$excludeDatabases = [
    'information_schema',
    'performance_schema',
    'sys',
    'mysql'
];

if (!count($errors)) {
    try {
        $connection = DriverManager::getConnection([
            'user' => $_POST['user'],
            'password' => $_POST['password'],
            'host' => $_POST['host'],
            'port' => $_POST['port'],
            'driver' => 'pdo_mysql' // TODO: Allow selection
        ]);

        foreach ($connection->query('SHOW DATABASES')->fetchAll(\PDO::FETCH_ASSOC) as $database) {
            if (!in_array($database['Database'], $excludeDatabases)) {
                $result[] = $database['Database'];
            }
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
