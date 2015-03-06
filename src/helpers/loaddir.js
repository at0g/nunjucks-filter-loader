var fs = require('fs');
var fileFilter = require('./file-filter');
var fileMap = require('./file-map');
var registerFilter = require('./register-filter');

exports.sync = function(dir, results, env){
    fs.readdirSync(dir)
        .filter( fileFilter )
        .map( fileMap(dir) )
        .forEach( registerFilter(results, env) )
    ;
    return results;
};

exports.async = function(dir, results, env, callback) {
    fs.readdir(dir, function(err, files){
        if(err){
            return callback(err);
        }
        files
            .filter( fileFilter)
            .map( fileMap(dir) )
            .forEach( registerFilter(results, env) )
        ;

        callback(err, results);
    });
};