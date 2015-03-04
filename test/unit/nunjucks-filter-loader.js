describe('nunjucks filter loader', function(){

    before(function(){
        this.src = require('../../src');
    });

    it('should export a configure function', function(){
        this.src.should.have.key('configure');
        this.src.configure.should.be.a.Function;
    });

    describe('options', function(){

        it('should require a paths option', function(){
            (function() {
                this.src.configure();
            }.bind(this)).should.Throw('A "paths" option is required');
        });

        it('should throw an error if options.paths is not an Array or a String', function(){
            (function(){
                this.src.configure({ paths: {} });
            }.bind(this)).should.throw('options.paths must be an Array or String');
        });

        it('should require an env option', function(){
            (function(){
                this.src.configure({ paths: __dirname })
            }.bind(this)).should.Throw('An "env" option is required')
        });

    });

});