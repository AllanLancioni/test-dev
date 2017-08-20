<?php

namespace Models;

class Fipe {

    private static $urlBase = "http://fipeapi.appspot.com/api/1/carros/";
    private static $urlBrands  = "marcas";
    private static $urlCarName = "veiculos/";
    private static $urlExtension = ".json";
    private static $brands  = null;
    private static $cars  = [];

    public static function getBrands() {

        return ( !is_null(self::$brands) ) ? self::$brands : self::execute( self::$urlBase . self::$urlBrands . self::$urlExtension );

    }

    public static function getCars($brandId) {

        return ( isset(self::$cars[$brandId]) ) ? self::$cars[$brandId] : self::execute( self::$urlBase . self::$urlCarName . $brandId . self::$urlExtension );

    }

    private static function execute($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL,$url);
        $result=curl_exec($ch);
        curl_close($ch);

        return $result;
    }

}