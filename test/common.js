var chai = require('chai');
global.sinon = require('sinon');

global.should = chai.should();
chai.use( require('sinon-chai'));

global.fs = require('fs');
global.path = require('path');