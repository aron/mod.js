var assert = require('chai').assert,
    module = require('./mod');

describe('module(keypath)', function () {
  it('should return an object matching the keypath', function () {
    module.modules = {key: {}};
    assert.equal(module('key'), module.modules.key);
  });
  it('should create an object if one does not exist', function () {
    var target = module('missing');
    assert.isObject(target);
    assert.equal(target, module.modules.missing);
  });
  it('should traverse nested keypaths', function () {
    module.modules = {a: {b: {c: {}}}};
    assert.equal(module('a.b.c'), module.modules.a.b.c);
  });
  it('should create the path if element do not exist', function () {
    var target = module('d.e.f');
    assert.isObject(target);
    assert.equal(target, module.modules.d.e.f);
  });
  it('should use the module.options.delimiter', function () {
    module.options.delimiter = '/';
    module.modules = {a: {b: {c: {}}}};
    assert.equal(module('a/b/c'), module.modules.a.b.c);
  });
});

describe('module(keypath, object)', function () {
  it('should extend the module with the key/values of the second argument');
});

describe('module(keypath, function)', function () {
  it('should execute the function if provided');
  it('should extend the module with the results of the function');
  it('should pass any subsequent arguments into the called function');
  it('should append any default arguments');
});

describe('module.setup(options)', function () {
  it('should override the module.options object');
  it('should allow the module.modules object to be overidden');
  it('should allow the delimiter to be overidden');
  it('should allow default arguments to be provided');
});

describe('module.noConflict(options)', function () {
  it('should return the module object');
  it('should restore the original module varaible');
  it('should accept an options object and call .configure()');
});
