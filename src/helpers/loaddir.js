var fs = require('fs');
var fileFilter = require('./file-filter');
var fileMap = require('./file-map');
var registerFilter = require('./register-filter');

exports.sync = function(dir, map, env){
    fs.readdirSync(dir)
        .filter( fileFilter )
        .map( fileMap(dir) )
        .forEach( registerFilter(map, env) )
    ;
    return map;
};

exports.async = function(dir, map, env, callback) {
    fs.readdir(dir, function(err, files){
        if(err){
            return callback(err);
        }
        files
            .filter( fileFilter)
            .map( fileMap(dir) )
            .forEach( registerFilter(map, env) )
        ;

        callback(err, map);
    });
};