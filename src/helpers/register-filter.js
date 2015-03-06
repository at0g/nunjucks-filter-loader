module.exports = function(results, env, mapping) {

    mapping = mapping || {};

    function throwErr(filter){
        throw new Error('Filter [' + filter + '] already exists');
    }

    function addFilter(key, value, async){
        if(results.hasOwnProperty(key)){
            throwErr(key);
        }

        async = async || false;
        var fn = value;

        if(mapping.hasOwnProperty(key)){
            var map = mapping[key];
            if(map.apply && map.apply.scope && map.apply.params){
                fn = fn.apply( map.apply.scope, map.apply.params);
            }

            if(map.async === true){
                async = map.async;
            }

            if(map.alias){
                if(typeof(map.alias) == 'string'){
                    addFilter(map.alias, fn, async);
                }
                else if( Array.isArray(map.alias) ){
                    map.alias.forEach(function(alias){
                        addFilter(alias, fn, async);
                    });
                }
            }
        }

        env.addFilter(key, fn, async);
        results[key] = fn;
    }


    return function(obj){

        var type = typeof( obj.value );
        var value = obj.value;
        var key = obj.key;


        if( type === 'function'){
            addFilter(key, value);
        }
        else if( type === 'object') {
            var keys = Object.keys(value);

            keys.forEach(function(key){
                if( typeof(value[key]) === 'function'){
                    addFilter(key, value[key]);
                }
                else {
                    return false;
                }
            })
        }
        else {
            return;
        }
        
    };

};