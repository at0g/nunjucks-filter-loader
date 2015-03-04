describe('helpers/loaddir.js', function(){

    before(function(){
        this.loaddir = require('../../src/helpers').loaddir;
    });

    beforeEach(function(){
        this.map = {};
        this.dir = process.cwd() + '/test/filters/1';
        this.addFilter = sinon.spy();
        this.env = {
            addFilter: this.addFilter
        };
    });

    it('should export sync', function(){
        this.loaddir.sync.should.be.a.Function;
    });

    it('should export async', function(){
        this.loaddir.async.should.be.a.Function;
    });

    it('should load files in dir synchronously', function(){
        this.loaddir.sync(this.dir, this.map, this.env);
        this.map.should.have.keys('double');
        this.addFilter.should.have.been.calledOnce;
    });

    it('should load file in dir asynchronously', function(done){

        this.loaddir.async(this.dir, this.map, this.env, function(err, map){
            should.not.exist(err);
            map.should.equal(this.map);
            map.should.have.keys('double');
            this.addFilter.should.have.been.calledOnce;
            done();
        }.bind(this));
    });

    it('should return an error in callback if dir does not exist', function(done){
        var fakeDir = __dirname + '/not/a/real/path';
        this.loaddir.async(fakeDir, this.map, this.env, function(err, map){
            err.should.be.a.Error;
            done();
        });
    });

});