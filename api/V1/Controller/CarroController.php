<?php

namespace Controller;
use \JsonDB\DB;
use Models\Carro;

class CarroController {

    public static function getAll()
    {
        return DB::getInstance()->selectAllData('carros');
    }

    public static function get($id)
    {
        return DB::getInstance()->selectDataById('carros', $id);
    }

    public static function delete($id)
    {
        return DB::getInstance()->delete('carros', $id);
    }

    public static function create()
    {
        $carro = new Carro(['car' => $_POST['car'], 'brand' => $_POST['brand'], 'year' => $_POST['year']]);
        return $carro->save();

    }

    public static function update()
    {
        $_PUT = $GLOBALS['_PUT'];
        $carro = new Carro(['id' => $_PUT['id'], 'car' => $_PUT['car'], 'brand' => $_PUT['brand'], 'year' => $_PUT['year']]);
        return $carro->update();
    }

}