route('/404', views[0], function(){});

route('/', views[1], function () {

    this.routeControl = function () {
        $('.added-to-nav').remove();
    };
});

route('/listagem', views[2], ListagemController);

route('/detalhes', views[3], DetalhesController);

route('/cadastro', views[4], CadastroController);

