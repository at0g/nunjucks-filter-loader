module.exports = function(map, env) {

    function throwErr(filter){
        throw new Error('Filter [' + filter + '] already exists');
    }

    return function(obj){

        var type = typeof( obj.value );
        if( type === 'function'){
            if(map[obj.key]){
                throwErr(obj.key);
            }

            env.addFilter(obj.key, obj.value);
            map[obj.key] = obj.value;
        }
        else if( type === 'object') {
            var keys = Object.keys(obj.value);

            keys.forEach(function(key){
                if( typeof(obj.value[key]) === 'function'){
                    if(map[key]){
                        throwErr(key);
                    }
                    env.addFilter(key, obj.value[key]);
                    map[key] = obj.value[key];
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