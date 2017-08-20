var $view = null;

function route (path, templateId, Controller) {
    routes[path] = {templateId: templateId, controller: new Controller() };
}

function router (hashChangeEvent) {

    $view = $view || document.getElementById('view');

    var urlArr = (location.hash && location.hash.length > 0) ? location.hash.split('/').splice(1) : [''];
    var url = '/' + (urlArr [0] || '');
    var route = routes[url];
    var e = (!hashChangeEvent) ? null : hashChangeEvent.originalEvent;


    if (!$view || !route || !route.controller) window.location.replace(PREFIX + '/#/404');

    $view.innerHTML = tmpl(route.templateId, route.controller);

    $('.controller').remove();
    $('<script type="text/javascript" class="controller">var controller = routes["'+url+'"].controller;</script>').appendTo('#view');

    if (typeof route.controller.routeControl === 'function') route.controller.routeControl(true, urlArr);

    if (e) {
        oldUrlArr = e.oldURL.substr(e.oldURL.indexOf("#/") + 1).split('/').splice(1);
        var oldController = routes['/' + oldUrlArr[0]].controller;
        if (typeof oldController.routeControl === 'function') oldController.routeControl(false, oldUrlArr);
    }


}

(function viewsImport (){

    var successCount = 0;

    console.log(views.length)

    for (var i = 0; i < views.length; i++) {

        var script = $('<script type="text/html"></script>')
            .attr('id', views[i])
            .load(viewPath + views[i] + '.html', function(){

                successCount ++;
                if ( successCount === views.length ) {
                    router();
                }
            }).appendTo('body');
    }

})();

$(window).on('hashchange', function(e) {router(e);});

