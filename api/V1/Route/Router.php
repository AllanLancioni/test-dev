<?php

namespace Route;
use Controller;

class Router {
    
    private static $routes = array();
    private static $errorRoute = null;

    public static function route($httpVerb, $pattern, $callback) {

        $pattern = PREFIX . $pattern;
        $pattern = str_replace('@n', '(\d+)', $pattern);
        $pattern = str_replace('@w', '(\w+)', $pattern);

        $pattern = '/^' . str_replace('/', '\/', $pattern) . '$/';

        self::$routes[] = ['pattern'=>$pattern, 'httpVerb'=>$httpVerb,  'callback'=>$callback];
        
    }
    public static function execute($httpVerb, $url) {

        if ($httpVerb === 'PUT') parse_str(file_get_contents('php://input'), $GLOBALS['_PUT']);

        if (substr($url, -1) !== '/') $url .= '/';
        $callbackCalled = false;

        foreach (self::$routes as $index=>$config) {
    
            $params = [];
            if ( preg_match($config['pattern'], $url, $params) && ($httpVerb == $config['httpVerb']) ) {

                $callbackCalled = true;
                array_shift($params);

                if (is_string($config['callback'])) {
                    $func = explode('@', $config['callback']);

                    if ($func[0] == 'JSON') {
                        array_shift($func);

                        $func[0] = 'Controller\\'.$func[0];
                        return print_r(json_encode(forward_static_call_array($func, $params)));
                    } else{
                        $func[0] = 'Controller\\'.$func[0];
                        return forward_static_call_array($func, $params);
                    }
                } else {

                    if( count($params) === 0)
                        return call_user_func($config['callback']);
                    else
                        return call_user_func_array($config['callback'], array_values($params));
                }
            }        
        }
        if (!$callbackCalled) {
            return call_user_func(self::$errorRoute);
        }
    }

    public static function defineErrorRoute($callback) {
        self::$errorRoute = $callback;
    }

    public static function get($pattern, $callback) {
        self::route('GET', $pattern, $callback);
    }

    public static function post($pattern, $callback) {
        self::route('POST', $pattern, $callback);
    }

    public static function delete($pattern, $callback) {
        self::route('DELETE', $pattern, $callback);
    }

    public static function put($pattern, $callback) {
        self::route('PUT', $pattern, $callback);
    }

    public static function patch($pattern, $callback) {
        self::route('PATCH', $pattern, $callback);
    }


}