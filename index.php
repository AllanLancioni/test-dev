<?php

spl_autoload_extensions('.php');
spl_autoload_register(function ($class) {
	$prefix = 'api/v1/';
    require_once(str_replace('\\', '/', $prefix.$class . '.php'));
});

require_once('config.php');
require_once('routes.php');