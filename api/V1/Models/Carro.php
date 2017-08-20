<?php

namespace Models;
use JsonDB\DB;


class Carro {

	public $id = '';
	public $brand = '';
	public $car = '';
	public $year = '';

	public function __construct(Array $params = null) {
		if (!is_null($params)){
			foreach ($params as $param=>$value) {
				if (isset($this->$param))
					$this->$param = $value;
			}
		}
	}

	public function save() {
		return DB::getInstance()->create('carros', get_object_vars($this));
	}

	public function update() {
		return DB::getInstance()->update('carros', get_object_vars($this));
	}

}