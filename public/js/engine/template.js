(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){

        if (str === 'undefined' || typeof str === 'undefined') return;

        var fn = ( !/\W/.test(str) ) ?
            cache[str] = cache[str] ||
            tmpl($('#'+str).html()) :

            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                    .replace(/&lt;/g,'<')
                    .replace(/&gt;/g, '>')
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1 || \"\",'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        return ( data ) ? fn( data, str ) : fn;

    };

})();