'use strict';
require('../'); // Load the module
var nodePath = require('path');
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var MockOptimizerContext = require('./MockOptimizerContext');

require('../'); // Load this module just to make sure it works


describe('raptor-optimizer-require/dependency-commonjs-run' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should generate the correct code for an installed module', function(done) {

        var defDependency = require('../lib/dependency-commonjs-def');
        defDependency.run = true;
        defDependency.path = '/';
        defDependency._file = nodePath.join(__dirname, 'test-project/node_modules/foo/lib/index.js');
        var code = '';
        defDependency.read(new MockOptimizerContext())
            .on('data', function(data) {
                code += data;
            })
            .on('end', function() {
                expect(code).to.equal('$rmod.run("/", function(require, exports, module, __filename, __dirname) { exports.foo = "1.0.0";\nvar target = "baz";\nrequire(target);\n});');
                done();
            })
            .on('error', done)
            .resume();
    });


});

