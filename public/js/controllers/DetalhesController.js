function DetalhesController() {

    this.id = null;
    this.brand = null;
    this.car = null;
    this.year = null;

    this.otherCars = null;

    this.routeControl = function (isEnter, params, removeCache) {
        (function(self){

            if (!params || !params[1]) return window.location.replace(PREFIX + '/#/404');

            if (isEnter) {

                if (self.id != params[1] || removeCache || (params[2] && params[2] === 'updated'))
                    $.getJSON(PREFIX+"/carros/"+params[1], function (res) {

                        if (res.status.code != 200)
                            return displayAlert('danger', res.status.code, res.status.message, '#alert-container');

                        self.id    = res.data.id;
                        self.brand = res.data.brand;
                        self.car   = res.data.car;
                        self.year  = res.data.year;

                        self.loadCars();

                        var loc = (location.href).split('#')[0] + '#/detalhes/' + self.id;
                        if (loc !== location.href)
                            location.replace(loc);
                        else
                            dispatchEvent(new HashChangeEvent("hashchange", {oldURL:loc, newURL:loc}));
                    });
                else {
                    self.loadCars();
                }
            }
        })(this);

    };

    this.clearCache = function () {
        this.routeControl(true, ['', this.id], true);
    };

    this.loadCars = function() {
        if (this.otherCars === null)
            (function(self){
                $.getJSON(PREFIX + "/carros/", function (res) {
                    self.otherCars = res.data;
                    self.createCarsList();

                });
            })(this);
        else{
            this.createCarsList();
        }

    };

    this.createCarsList = function(){
        $('.details-car-list').remove();
        for (var i = 0; i < this.otherCars.length; i++){
            var item = this.otherCars[i];
            $('<a class="details-car-list"></a>')
                .attr('href', '#/detalhes/'+item.id)
                .html(item.id+' - '+item.car.name)
                .appendTo('#otherCars');
        }
    };

    this.init = (function(self){

        var hash = location.hash.split('/').splice(1);
        if (hash[0] === 'detalhes')
            self.routeControl(true, hash);

    })(this);

}
