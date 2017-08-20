
var PREFIX = '/test-dev';
var viewPath = 'public/views/';
var routes = [];
var views = [
    'error404',
    'home',
    'listagem_carros',
    'detalhes_carro',
    'cadastro_carro',
];

function displayAlert (type, strong, message, container) {
    var alert = $('<div class="alert alert-dismissible" role="alert"></div>').addClass('alert-'+type).appendTo(container);
    $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo(alert);
    $('<strong></strong>').html(strong + ' ').appendTo(alert);
    $('<span></span>').html(message).appendTo(alert);
}