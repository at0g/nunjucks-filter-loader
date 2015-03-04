describe('helpers/index.js', function(){

    before(function(){
        this.helpers = require('../../src/helpers');
    });

    it('should export fileFilter', function(){
        this.helpers.fileFilter.should.equal( require('../../src/helpers/file-filter') );
    });

    it('should export fileMap', function(){
        this.helpers.fileMap.should.equal( require('../../src/helpers/file-map') );
    });

    it('should export loaddir', function(){
        this.helpers.loaddir.should.equal( require('../../src/helpers/loaddir') );
    });

    it('should export registerFilter', function(){
        this.helpers.registerFilter.should.equal( require('../../src/helpers/register-filter') );
    });
});