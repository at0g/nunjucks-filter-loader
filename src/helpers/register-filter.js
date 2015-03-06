module.exports = function(results, env) {

    function throwErr(filter){
        throw new Error('Filter [' + filter + '] already exists');
    }

    return function(obj){

        var type = typeof( obj.value );
        if( type === 'function'){
            if(results[obj.key]){
                throwErr(obj.key);
            }

            env.addFilter(obj.key, obj.value);
            results[obj.key] = obj.value;
        }
        else if( type === 'object') {
            var keys = Object.keys(obj.value);

            keys.forEach(function(key){
                if( typeof(obj.value[key]) === 'function'){
                    if(results[key]){
                        throwErr(key);
                    }
                    env.addFilter(key, obj.value[key]);
                    results[key] = obj.value[key];  
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