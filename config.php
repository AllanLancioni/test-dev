<?php


define('PREFIX', '/test-dev');


//HELPER CLASSES
function fatality($var, $dd = true) {
	echo '<pre>';
	print_r($var);
	echo '</pre>';
	if ($dd) die();
}

function jsonality($var, $dd = true) {
	print_r(json_encode($var));
	if ($dd) die();
}
function restfy($data, $code, $message) {

	return [
			'data' => $data,
			'status' => [
				'code'=>$code,
				'message'=>$message
			]
		];

}