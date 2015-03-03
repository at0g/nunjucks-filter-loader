var should = require('chai').should();
var nunjucks = require('nunjucks');
var fn = require('../').configure;

describe('nunjucks filter loader', function(){

    it('should export a configure function', function(){
        fn.should.be.a.Function;
    });

    describe('options', function(){

        it('should require a paths option', function(){
            (function() {
                fn();
            }).should.Throw('A "paths" option is required');
        });

        it('should throw an error if options.paths is not an Array or a String', function(){
            (function(){
                fn({ paths: {} });
            }).should.throw('options.paths must be an Array or String');
        });

        it('should require an env option', function(){
            (function(){
                fn({ paths: __dirname })
            }).should.Throw('An "env" option is required')
        });

    });

    describe('loading files', function(){

        before(function(){
            this.env = nunjucks.configure();
        });

        it('should resolve relative paths to process.cwd()', function(){
            var mapped = fn({ paths: 'test/filters/1', env: this.env});
            mapped.should.have.key('double').and.be.a.Function;
        });

        it('should load double from filters/1', function(){
            var mapped = fn({ paths: __dirname + '/filters/1', env: this.env });

            mapped.should.have.key('double').and.be.a.Function;
            this.env.getFilter('double')(2).should.equal(4);
        });

        it('should not load index from filters/1', function(){
            var mapped = fn({ paths: __dirname + '/filters/1', env: this.env });
            mapped.should.not.have.key('index');
        });

        it('should load exports from filters/2', function(){
            var mapped = fn({ paths: __dirname + '/filters/2', env: this.env });
            mapped.should.have.all.keys('square', 'prepend');

            this.env.getFilter('square')(5).should.equal(25);
            this.env.getFilter('prepend')('bar', 'foo ').should.equal('foo bar');
        });

        it('should load from filters/1 and filters/2', function(){
            var mapped = fn({
                paths: [__dirname + '/filters/1', __dirname + '/filters/2'],
                env: this.env
            });

            mapped.should.have.all.keys('double', 'square', 'prepend');
            this.env.getFilter('double')(2).should.equal(4);
            this.env.getFilter('square')(5).should.equal(25);
            this.env.getFilter('prepend')('bar', 'foo ').should.equal('foo bar');
        });

    });


});