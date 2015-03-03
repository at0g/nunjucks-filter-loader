var fs = require('fs');
var path = require('path');


exports.configure = function(options){

    if (!options || !options.paths)
        throw new Error('A "paths" option is required');

    if (!Array.isArray(options.paths) && typeof(options.paths) !== 'string')
        throw new Error('options.paths must be an Array or String');

    if (!options.env)
        throw new Error('An "env" option is required');

    var env = options.env;
    var map = {};
    var paths = Array.isArray(options.paths) ? options.paths : [options.paths];

    paths.forEach(function(dir){
        if( !path.isAbsolute(dir) ) {
            dir = path.resolve(process.cwd(), dir);
        }
        loadDirSync(dir, map, env);
    });

    return map;

};


function loadDirSync(dir, map, env){

    fs.readdirSync(dir)
        .filter(function(file){
            // Only return .js files, excluding index.js
            return path.extname(file) === '.js' && path.basename(file, '.js') !== 'index';
        })
        .map(function(file){
            return path.basename(file, '.js');
        })
        .forEach(function(name){
            var f = require(path.join(dir, name));

            if(typeof(f) === 'function'){
                env.addFilter(name, f);
                map[name] = f;
            }
            else if(typeof(f) === 'object') {
                var keys = Object.keys(f);
                keys.forEach(function(key){
                    if( typeof(f[key]) === 'function'){
                        env.addFilter(key, f[key]);
                        map[key] = f[key];
                    }
                })
            }
        })
    ;

}