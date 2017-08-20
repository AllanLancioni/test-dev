function ListagemController() {

    this.data = [];

    this.itemToDeleteId = null;


    this.getData = function(removingCache){

        if (this.data.length < 1 || removingCache) {

            (function(self){
                $.getJSON(PREFIX+'/carros', function(res){
                    if (res.status.code == 200) {
                        self.data = res.data;
                        self.createRow();
                    }
                })
            })(this);

        } else {

            this.createRow();

        }
    };

    this.createRow = function() {

        $('.listagem-item').remove();

        if (this.data.length < 1) {

            $('<td colspan="6" class="listagem-item" ><h1>Nenhum item cadastrado</h1></td>').appendTo('#listagem-table');


        } else {

            for (i = 0; i < this.data.length; i++) {

                var data = this.data[i];
                var tr = $('<tr class="listagem-item"></tr>').attr('id', 'item-' + data.id).attr('data-reference', data.id).appendTo('#listagem-table');

                $('<td></td>').html(data.id).appendTo(tr);
                $('<td></td>').html(data.brand.name).appendTo(tr);
                $('<td></td>').html(data.car.name).appendTo(tr);
                $('<td></td>').html(data.year).appendTo(tr);

                var update = $('<td></td>').appendTo(tr);
                var updateP = $('<p data-placement="top" data-toggle="tooltip" title="Edit"></p>').appendTo(update);
                $('<a class="btn btn-primary btn-xs" data-role="update-item" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></a>').attr('href', '#/cadastro/' + data.id).appendTo(updateP);

                var remove = $('<td></td>').appendTo(tr);
                var removeP = $('<p data-placement="top" data-toggle="tooltip" title="Delete"></p>').appendTo(remove);
                $('<button class="btn btn-danger btn-xs" data-role="delete-item" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button>').appendTo(removeP);
            }
        }

        this.setEvents();
    };

    this.setEvents = function() {

        (function (self) {

            var $alert = $('#alert-container');

            $('[data-role=delete-item]').on('click', function(e) {
                self.itemToDeleteId = $(this).closest('.listagem-item').attr('data-reference');
            });

            $('[data-role=update-item]').on('click', function(e) {
                window.location.replace(PREFIX+'/#/cadastro/'+$(this).attr('data-reference'));
            });

            $('[data-role=confirm-delete]').on('click', function(e) {
                $.ajax({
                    url: PREFIX + '/carros/' + self.itemToDeleteId,
                    type: 'DELETE',
                    dataType: 'JSON',
                    success: function(res) {
                        if (res.status.code === 200) {

                            displayAlert ('success', 'OK!', 'Deletado com sucesso!', $alert);
                            $('#item-'+self.itemToDeleteId).remove();

                        } else displayAlert ('danger', 'status' + res.status.code, res.status.message, $alert);
                    },
                    fail: function(res){
                        displayAlert ('danger', 'status' + res.status.code, res.status.message, $alert);
                    }
                }).done(function () {
                    $('[data-role=cancel-delete]').click();
                });
            });

            $('[data-role=cancel-delete]').on('click', function(){ self.itemToDeleteId = null });

            $('.listagem-item').on('click', function (e) {

                if ($(e.target).prop('tagName') !== 'TD') return;
                window.location.replace(PREFIX+'/#/detalhes/'+$(this).attr('data-reference'));

            });

        })(this)
    };

    this.routeControl = function(){

        this.getData();
    };

    this.init = (function(self) {

        self.getData();
    })(this);

}