function CadastroController() {

    this.id     = null;
    this.car    = null;
    this.brand  = null;
    this.year   = null;

    //cache
    this.brands = [];
    this.cars   = [];

    //method
    this.action;

    this.save = function () {

        if ( (this.car === null) || (this.brand === null) || (this.year === null) ) {
            return displayAlert('danger', 'Erro!', 'Por favor preencha todos os campos!', '#alert-container');
        }
        else {
            (function (self) {

                if (self.action !== 'update' && self.action !== 'create') return;

                var creating = (self.action === 'create');

                $.ajax({
                    type: creating ? 'POST' : 'PUT',
                    dataType: 'json',
                    url: PREFIX + "/carros/" + (creating ? '' : self.id),
                    data: {id:self.id, brand: self.brand, car: self.car, year: self.year},
                    success: function (res) {

                        if (res.status.code === 200) {
                            self.reset();
                            if (!creating)
                                window.location.replace(PREFIX + '/#/detalhes/' + self.id + '/updated');
                            else
                                displayAlert('success', 'Sucesso!', 'Carro salvo com sucesso!', '#alert-container');
                        } else {
                            return displayAlert('danger',res.status.code, res.status.message, '#alert-container');
                        }
                    },
                    fail: function () {
                        return displayAlert('danger', 'STATUS 500', 'Falha no servidor', '#alert-container');
                    }
                });

            })(this);
        }
    };

    this.reset = function () {
        var selects = $('.select-brand, .select-car');
        selects.val(null).trigger('change');
        $('#year').val(null);

        this.car = this.brand = this.year = null;
        $('#brand').select2({placeholder:"Selecione uma marca..."})

        $('#car').select2({placeholder:"Selecione a marca primeiro...", disabled:true})
            .find('option').remove();

    };

    this.routeControl = function (isEnter, params) {
        (function(self){
            if (isEnter) {
                $('#cadastro-container').find('.select2').remove();
                self.loadPlugin(function () {
                    if (params && params[1]) self.update(params[1]);
                    else {
                        self.action = 'create';
                        $('.added-to-show').remove();
                    }
                });
                self.dataBindingYear();
            } else {
                self.reset();
            }
        })(this);

    };

    this.loadPlugin = function (callback) {

        (function(self) {
            setTimeout(function () {
                $("#brand").select2({
                    placeholder: "Selecione uma marca..."
                }).on('select2:select', function (e) {
                    self.brand = JSON.parse($(this).val());
                    self.loadCars();
                });

                $("#car").select2({
                    placeholder: "Selecione a marca primeiro...",
                    disabled: true
                }).on('select2:select', function (e) {
                    self.car = JSON.parse($(this).val());
                });
                if (typeof callback === 'function') callback();

                self.loadBrands(self);

            }, 500);
        })(this);

    };

    this.loadBrands = function (self) {

        if (self.brands.length < 1) {
            $.getJSON( PREFIX+"/fipe/marcas", function(data) {
                self.brands = data;
                self.setOption(data, '#brand');
            });
        } else {
            self.setOption(self.brands, '#brand');
        }
    };

    this.loadCars = function (callback) {

        $("#car").select2({disabled: false, placeholder: 'Carregando...'});

        (function (self) {

            if (typeof self.cars[self.brand.id] === 'undefined' || self.cars[self.brand.id] === null) {
                $.getJSON(PREFIX+"/fipe/carros/" + self.brand.id, function (data) {
                    console.log(data);
                    self.cars[self.brand.id] = data;
                    self.setOption(data, '#car');
                    $("#car").select2({placeholder: 'Selecione um carro...', disabled: false});

                    if (callback) callback();
                });
            } else {
                self.setOption(self.cars[self.brand.id], '#car');
                $("#car").select2({placeholder: 'Selecione um carro...', disabled: false});
                if (callback) callback();
            }

        })(this);
    };

    this.dataBindingYear = function(){

        var val = parseInt($('#year').val());
        if (isNaN(val)) val = null;
        else if (val < 1950 || val > 2018) {
            val = null;
            return;
        }
        this.year = val;
    };

    this.setOption = function(data, selector) {
        $(selector).find('option').remove();
        $('<option></option>').appendTo(selector);
        for (var i = 0; i < data.length; i++) {
            $('<option></option>').val('{"id":"' + data[i].id + '","name":"'+ data[i].name + '"}').html(data[i].name).appendTo(selector);
        }
    };

    this.update = function(id){
        (function(self){
            $.getJSON(PREFIX+"/carros/" + id, function (res) {

                if(res.status.code != 200)
                    return displayAlert('danger', res.status.code, res.status.message, '#alert-container');

                self.id    = res.data.id;
                self.brand = res.data.brand;
                self.car   = res.data.car;
                self.year  = res.data.year;

                self.action  = 'update';

                $("#brand").select2({placeholder:self.brand.name});

                self.loadCars(function(){
                    $("#car").val(self.brand.toString())
                        .select2({placeholder:self.car.name});
                });

                $('#year').val(self.year);

                $('.added-to-show').remove();
                $('<span class="added-to-nav">/</span>').appendTo('.show-nav');
                $('<a class="added-to-nav"></a>').html(self.id).appendTo('.show-nav');
            });

        })(this);
    };

    this.init = (function (self){

        self.routeControl(true);

    })(this);

}