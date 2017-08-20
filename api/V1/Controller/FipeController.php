<?php
/**
 * Created by PhpStorm.
 * User: monst
 * Date: 15/08/2017
 * Time: 13:55
 */

namespace Controller;
use Models\Fipe;


class FipeController
{

    public static function getBrands() {
        echo Fipe::getBrands();
    }

    public static function getCars($brandId) {
        echo Fipe::getCars($brandId);
    }

}