<?php

namespace JsonDB;

class DB {   

	private $path = '';
	private $database = [];
	private static $instance;

	private function __construct () {

		$this->path = $_SERVER['DOCUMENT_ROOT'].'/test-dev/data/';

		$this->database = [
			'carros'=>[
				'config_path'=> $this->path.'carros.config.json',
				'config'=> $this->readJson($this->path.'carros.config.json'),
				'data_path'=> $this->path.'carros.json',
				'data'  => $this->readJson($this->path.'carros.json')
			],
			'marcas'=>[
				'data'  => $this->readJson($this->path.'marcas.json')
			]
		];

	}

	public static function getInstance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;

	}

	private function readJson($path){
		if(!file_exists($path)) return null;
		$file = file_get_contents($path, "r");// or die("Não foi possível abrir arquivo JSON!");
		return json_decode($file);
	}
	private function saveJson($path, $data){
		if ( file_put_contents($path, $data) ){
			return true;
		} die("Não foi possível salvar arquivo JSON!");
	}


	public function selectAllData($table) {

		return isset($this->database[$table]) && isset($this->database[$table]['data'] ) ?
			restfy($this->database[$table]['data'], 200, 'OK!'):
			restfy('', 400, 'Bad request! Tabela '.$table.' não encontrada.');

	}

	public function selectDataById($table, $id) {

		$res = null;
		$res_data = self::selectAllData($table);
		$data_table = $res_data['data'];

		if ($data_table) {
			foreach ($data_table as $index=>$item) {
				if ($item->id == $id) {
					$res = restfy($item, 200, 'OK!');
					break;
				} else if ($index == count($data_table) - 1)
					$res = restfy('{}', 204, 'Nenhum item encontrado.');
			}
		} else {
			$res = restfy('', 400, 'Bad request! Tabela '.$table.' não encontrada.');
		}
		return $res;
	}

	public function delete($table, $id) {

		$res_data = self::selectAllData($table);

		if (!$res_data) return restfy(null, 400, 'Bad request! Tabela '.$table.' não encontrada.');

		$data_table = $res_data['data'];

		$new_json = [];
		$removed = null;

		if ($data_table) {
			foreach ($data_table as $index=>$item) {
				if ($item->id != $id) $new_json[] = $item;
				else $removed = $item;
			}
		}

		if (!$removed) {
			return restfy($new_json, 204, 'Nenhum item encontrado.');
		}

		return (self::saveJson($this->database[$table]['data_path'], json_encode($new_json))) ?
			$status = restfy($new_json, 200, 'OK') :
			$status = restfy($new_json, 500, 'Erro no servidor.') ;

	}

	public function create($table, $params) {

		$id =  ++$this->database[$table]['config']->lastId;
		if(!$id) return $status = restfy(null, 500, 'Erro no servidor.') ;

		$params['id'] = $id;

		$this->database[$table]['data'][] = $params;

		return ( $this->saveJson( $this->database[$table]['data_path'], json_encode($this->database[$table]['data']))
			  && $this->saveJson( $this->database[$table]['config_path'], json_encode($this->database[$table]['config'])))
			? restfy(null, 200, 'OK')
		  	: restfy(null, 500, 'Erro no servidor.') ;

	}

	public function update($table, $params) {
		$res = null;
		$res_data = self::selectAllData($table);
		$data_table = $res_data['data'];

		if ($data_table) {
			foreach ($data_table as $index=>$item) {
				if ($item->id == $params['id']) {

					$data_table[$index] = $params;

					break;
				} else if ($index == count($data_table) - 1)
					$res = restfy('{}', 204, 'Nenhum item encontrado.');
			}
		} else {
			$res = restfy('', 400, 'Bad request! Tabela '.$table.' não encontrada.');
		}

		if ($res) return $res;


		return ( $this->saveJson( $this->database[$table]['data_path'], json_encode($data_table)))
			? restfy($params, 200, 'OK')
		  	: restfy(null, 500, 'Erro no servidor.');

	}


}

