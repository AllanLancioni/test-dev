<?php

use \Route\Router;
use \Models\Carro;

//RAIZ
Router::get('/', function() {

	$app = new DOMDocument();
	$app->loadHTMLFile('app.html');
	echo $app->saveHTML();
//	header('Location: '.PREFIX.'/#');

});

Router::get('/carros/', 'JSON@CarroController@getAll');
Router::get('/carros/@n/', 'JSON@CarroController@get');

Router::delete('/carros/@n/', 'JSON@CarroController@delete');

Router::post('/carros/', 'JSON@CarroController@create');

Router::put('/carros/@n/', 'JSON@CarroController@update');

Router::get('/fipe/marcas/', 'FipeController@getBrands');

Router::get('/fipe/carros/@n/', 'FipeController@getCars');


//ERRO
Router::defineErrorRoute( function() {
	$status = ['code'=>404, 'message'=>'O caminho '.$_SERVER['DOCUMENT_ROOT'].$_SERVER['REQUEST_URI'].' não foi encontrado em nosso servidor.. :('];
	$data = '';
	echo json_encode([ 'data'=>$data, 'status'=>$status]);
});

Route\Router::execute( $_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);