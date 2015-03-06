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
            var results = fn({ paths: 'test/filters/1', env: this.env});
            results.should.have.key('double').and.be.a.Function;
        });

        it('should use absolute paths as-is', function(){
            var results = fn({ paths: process.cwd() + '/test/filters/1', env: this.env});
            results.should.have.key('double').and.be.a.Function;
        });

        it('should load double from filters/1', function(){
            var results = fn({ paths: 'test/filters/1', env: this.env });
            results.should.have.key('double').and.be.a.Function;
            this.addFilter.should.have.been.calledOnce;
        });

        it('should not load index from filters/1', function(){
            var results = fn({ paths: 'test/filters/1', env: this.env });
            results.should.not.have.key('index');
        });

        it('should load exports from filters/2', function(){
            var results = fn({ paths: 'test/filters/2', env: this.env });
            results.should.have.all.keys('square', 'prepend');
            this.addFilter.should.have.been.calledTwice;
        });

        it('should load from double, square and prepend from filters/1 + filters/2', function(){
            var results = fn({
                paths: ['test/filters/1', 'test/filters/2'],
                env: this.env
            });

            results.should.have.all.keys('double', 'square', 'prepend');
            this.addFilter.should.have.been.calledThrice;
        });

        it('should apply options.mapping', function(){
            var results = fn({
                paths: ['test/filters/1', 'test/filters/2'],
                env: this.env,
                mapping: {
                    'double': { alias: 'times2' },
                    'prepend': { async: true }                }
            });

            results.should.have.all.keys('double', 'square', 'prepend', 'times2');
            this.addFilter.should.have.been.calledWithExactly('prepend', require('../filters/2/exports').prepend, true);
        });

    });

    describe('loading files (async)', function(){

        it('should load files asynchronously when a callback is provided', function(done){
            var callback = function(err, results){
                should.not.exist(err);
                results.should.have.all.keys('double', 'square', 'prepend');
                this.addFilter.should.have.been.calledThrice;
                done();
            }.bind(this);
            fn({ paths: ['test/filters/1', 'test/filters/2'], env: this.env}, callback);
        });

        it('should resolve relative paths to process.cwd()', function(done){
            fn({ paths: 'test/filters/1', env: this.env}, function(err, results){
                should.not.exist(err);
                results.should.have.key('double').and.be.a.Function;
                done();
            });

        });

        it('should use absolute paths as-is', function(done){
            fn({ paths: process.cwd() + '/test/filters/1', env: this.env}, function(err, results){
                should.not.exist(err);
                results.should.have.key('double').and.be.a.Function;
                done();
            });

        });

        it('should apply options.mapping', function(done){
            fn({
                paths: ['test/filters/1', 'test/filters/2'],
                env: this.env,
                mapping: {
                    'double': { alias: 'times2' },
                    'prepend': { async: true }                }
            }, function(err, results){
                should.not.exist(err);
                results.should.have.all.keys('double', 'square', 'prepend', 'times2');
                this.addFilter.should.have.been.calledWithExactly('prepend', require('../filters/2/exports').prepend, true);
                done();
            }.bind(this));


        });

    });


});



