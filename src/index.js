var path = require('path');
var helpers = require('./helpers');
var step = require('step');

exports.configure = function(options){

    options = options || {};

    if (!options.paths)
        throw new Error('A "paths" option is required');

    if (!Array.isArray(options.paths) && typeof(options.paths) !== 'string')
        throw new Error('options.paths must be an Array or String');

    if (!options.env)
        throw new Error('An "env" option is required');

    var callback = arguments.length > 1 ? arguments[1] : null;
    var env = options.env;
    var map = {};
    var paths = Array.isArray(options.paths) ? options.paths : [options.paths];


    if (!callback) {
        paths.forEach(function(dir){
            if( !path.isAbsolute(dir) ) {
                dir = path.resolve(process.cwd(), dir);
            }
            helpers.loaddir.sync(dir, map, env);
        });

        return map;
    } else {

        step(
            function(){
                var group = this.group();

                paths.forEach(function(dir){
                    if( !path.isAbsolute(dir) ) {
                        dir = path.resolve(process.cwd(), dir);
                    }
                    helpers.loaddir.async(dir, map, env, group());
                });
            },

            function(err, maps){
                callback(err, maps[0]);
            }
        );


    }


    return map;
};