var path = require('path');

exports = module.exports = function(dir){
    return function(file){
        // map the file name without the extension
        var key = path.basename(file, path.extname(file));
        var value = require(path.join(dir, file));

        return {
            key: key,
            value: value
        };
    }
};