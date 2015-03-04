describe('helpers/file-map.js', function(){
    before(function(){
        this.factory = require('../../src/helpers/file-map');
        this.fn = this.factory(process.cwd() + '/test/filters/1');
        this.result = this.fn( 'double.js' );
    });

    it('should be a function', function(){
        this.factory.should.be.a.Function;
    });

    it('should return a function', function(){
        this.fn.should.be.a.Function;
    });

    it('should return an object with key and value properties', function(){
        this.result.should.be.an.Object;
        this.result.should.have.keys('key', 'value');
    });

    it('should require the file as value', function(){
        this.result.value.should.be.a.Function;
        this.result.value(2).should.equal(4);
    });

});