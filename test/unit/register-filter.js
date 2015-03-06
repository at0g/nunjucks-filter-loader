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


    describe('register an object with a value of function', function(){

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

    });


    describe('register an object with a value of object', function(){

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

    });

    describe('register a number', function(){

        it('should return nothing', function(){
            should.not.exist( this.fn(1) );
        })
    });

});