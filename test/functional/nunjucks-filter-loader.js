var fn = require('../../src/index').configure;

describe('nunjucks filter loader', function(){

    beforeEach(function(){
        this.addFilter = sinon.spy();
        this.env = {
            addFilter: this.addFilter
        };
    });

    describe('loading files synchronously', function(){

        it('should resolve relative paths to process.cwd()', function(){
            var mapped = fn({ paths: 'test/filters/1', env: this.env});
            mapped.should.have.key('double').and.be.a.Function;
        });

        it('should use absolute paths as-is', function(){
            var mapped = fn({ paths: process.cwd() + '/test/filters/1', env: this.env});
            mapped.should.have.key('double').and.be.a.Function;
        });

        it('should load double from filters/1', function(){
            var mapped = fn({ paths: 'test/filters/1', env: this.env });
            mapped.should.have.key('double').and.be.a.Function;
            this.addFilter.should.have.been.calledOnce;
        });

        it('should not load index from filters/1', function(){
            var mapped = fn({ paths: 'test/filters/1', env: this.env });
            mapped.should.not.have.key('index');
        });

        it('should load exports from filters/2', function(){
            var mapped = fn({ paths: 'test/filters/2', env: this.env });
            mapped.should.have.all.keys('square', 'prepend');
            this.addFilter.should.have.been.calledTwice;
        });

        it('should load from double, square and prepend from filters/1 + filters/2', function(){
            var mapped = fn({
                paths: ['test/filters/1', 'test/filters/2'],
                env: this.env
            });

            mapped.should.have.all.keys('double', 'square', 'prepend');
            this.addFilter.should.have.been.calledThrice;
        });

    });

    describe('loading files (async)', function(){

        it('should load files asynchronously when a callback is provided', function(done){
            var callback = function(err, mapped){
                should.not.exist(err);
                mapped.should.have.all.keys('double', 'square', 'prepend');
                this.addFilter.should.have.been.calledThrice;
                done();
            }.bind(this);
            fn({ paths: ['test/filters/1', 'test/filters/2'], env: this.env}, callback);
        });

        it('should resolve relative paths to process.cwd()', function(done){
            fn({ paths: 'test/filters/1', env: this.env}, function(err, mapped){
                should.not.exist(err);
                mapped.should.have.key('double').and.be.a.Function;
                done();
            });

        });

        it('should use absolute paths as-is', function(done){
            fn({ paths: process.cwd() + '/test/filters/1', env: this.env}, function(err, mapped){
                should.not.exist(err);
                mapped.should.have.key('double').and.be.a.Function;
                done();
            });

        });

    });


});



