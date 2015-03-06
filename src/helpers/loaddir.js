var fs = require('fs');
var fileFilter = require('./file-filter');
var fileMap = require('./file-map');
var registerFilter = require('./register-filter');

exports.sync = function(dir, results, env, mapping){
    fs.readdirSync(dir)
        .filter( fileFilter )
        .map( fileMap(dir) )
        .forEach( registerFilter(results, env, mapping) )
    ;
    return results;
};

exports.async = function(dir, results, env, mapping, callback) {

    if(arguments.length === 4){
        callback = arguments[3];
    }

    fs.readdir(dir, function(err, files){
        if(err){
            return callback(err);
        }
        files
            .filter( fileFilter)
            .map( fileMap(dir) )
            .forEach( registerFilter(results, env, mapping) )
        ;

        callback(err, results);
    });
};