describe('helpers/file-filter.js', function(){

    before(function(){
        this.fn = require('../../src/helpers/file-filter');
    });

    it('should be a function', function(){
        this.fn.should.be.a.Function
    });

    it('should return false when called with **/index.js', function(){
        this.fn('some/path/to/index.js').should.equal(false);
        this.fn('index.js').should.equal(false);
    });

    it('should return false when called with no extension name', function(){
        this.fn('foo').should.equal(false);
    });

    it('should return true when called with foo.js', function(){
        this.fn('foo.js').should.equal(true);
    });

    it('should return true when called with path/to/foo.js', function(){
        this.fn('path/to/foo.js').should.equal(true);
    });

});