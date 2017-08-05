<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(-1);

require __DIR__ . '/../vendor/autoload.php';


$loader = new Twig_Loader_Filesystem('../template');
$twig = new Twig_Environment($loader);
echo $twig->render('index.html.twig', array('name' => 'Fabien'));
