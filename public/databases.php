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
        $grepDb = new GrepDb($_POST['user'], $_POST['password'], $_POST['host'], $_POST['port']);
        $result = $grepDb
            ->getServerMetadata()
            ->getDatabaseNames();
    } catch (\Exception $e) {
        $errors[] = $e->getMessage();
    }
}


// Build response
header('Content-Type: application/json');
if (!$errors) {
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode($errors);
}
