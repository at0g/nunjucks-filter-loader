var path = require('path');

module.exports = function(file){
    // Only return .js files, excluding index.js
    return path.extname(file) === '.js' && path.basename(file, '.js') !== 'index';
};