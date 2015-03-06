var factory = require('../../src/helpers/register-filter');

describe('helpers/register-filter.js', function(){

    beforeEach(function(){
        this.addFilter = sinon.spy();
        this.env = { addFilter: this.addFilter };
        this.results = {};
        this.fn = factory(this.results, this.env);
    });

    it('should be a function', function(){
        factory.should.be.a.Function;
    });

    it('should return a function', function(){
        this.fn.should.be.a.Function;
    });


    describe('register a function', function(){

        before(function(){
            this.double = {
                key: 'double',
                value: sinon.spy()
            };
        });

        it('should register double', function(){
            this.fn(this.double);
            this.addFilter.should.have.been.calledWith('double', this.results.double);
        });

        it('should add double to this.results', function(){
            this.fn(this.double);
            this.results.should.have.key('double');
            this.results.double.should.equal(this.double.value);
        });

        it('should throw an error when adding a duplicate filter name', function(){
            this.fn(this.double);
            this.results.should.have.key('double');

            (function(){
                this.fn(this.double);
            }.bind(this)).should.throw('Filter [double] already exists');
        });


        describe('mapping param', function(){
            it('should register double as an async filter', function(){
                var mapping = {
                    double: { async: true }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.double);
                this.addFilter.should.be.calledWithExactly('double', this.double.value, true);
            });

            it('should alias double to times2', function(){
                var mapping = {
                    double: { alias: 'times2' }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.double);
                this.results.times2.should.equal(this.results.double);
                this.addFilter.should.be.calledTwice;
            });

            it('should alias double to foo and bar', function(){
                var mapping = {
                    double: {
                        alias: ['foo', 'bar']
                    }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.double);
                this.results.foo.should.equal(this.results.double);
                this.results.bar.should.equal(this.results.double);
                this.addFilter.should.be.calledThrice;
            });

            it('should ignore an alias that is not a string or Array', function(){
                var mapping = {
                    double: { alias: {} }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.double);
                this.addFilter.should.be.calledOnce;
            });

            it('should throw an error when adding an alias name exists', function(){
                var results = { 'times2': null };
                var mapping = {
                    double: { alias: 'times2' }
                };
                var fn = factory(results, this.env, mapping);
                (function(){
                    fn(this.double);
                }.bind(this)).should.throw('Filter [times2] already exists');

            });

            it('should register the return value of closure', function(){
                var mapping = {
                    closure: {
                        apply: { scope: this, params: ['!'] }
                    }
                };
                var fn = factory(this.results, this.env, mapping);
                var obj = {
                    key: 'closure',
                    value: function(val){
                        return function(input){
                            return input + val;
                        };
                    }
                };
                fn(obj);
                this.results.closure.should.be.a.Function;
                this.results.closure('Test').should.equal('Test!');
                this.addFilter.should.be.calledOnce;
            });

        });


    });


    describe('register an object', function(){

        before(function(){
            this.obj = {
                key: 'exports',
                value: require(process.cwd() + '/test/filters/2/exports')
            };
        });

        it('should register square and prepend', function(){
            this.fn(this.obj);
            this.addFilter.should.have.been.calledTwice;
        });

        it('should add square and prepend to results', function(){
            this.fn(this.obj);
            this.results.should.have.keys('square', 'prepend');
        });

        it('should throw an error when adding a duplicate filter name', function(){
            this.fn(this.obj);
            this.results.should.have.keys('square', 'prepend');

            (function(){
                this.fn(this.obj);
            }.bind(this)).should.throw('Filter [square] already exists');
        });

        it('should ignore keys that are not functions', function(){
            this.fn({
                key: 'a-module',
                value: {
                    fn: function(){},
                    notafunction: {}
                }
            });
            this.results.should.have.keys('fn');
        });

        describe('mapping param', function(){
            it('should register square as an async filter', function(){
                var mapping = {
                    square: { async: true }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.obj);
                this.addFilter.should.be.calledTwice;
                this.addFilter.should.be.calledWithExactly('square', this.obj.value.square, true);
                this.addFilter.should.be.calledWithExactly('prepend', this.obj.value.prepend, false);
            });

            it('should alias square to foo', function(){
                var mapping = {
                    square: { alias: 'foo' }
                };
                var fn = factory(this.results, this.env, mapping);
                fn(this.obj);
                this.results.foo.should.equal(this.results.square);
                this.addFilter.should.be.calledThrice;
            });

        });

    });

    describe('invalid input', function(){

        it('should return nothing when called with a number', function(){
            should.not.exist( this.fn(1) );
        });
    });

});