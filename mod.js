(function (context) {

  function module(keypath, properties) {
    var object = module.modules,
        keys = (keypath || '').split(module.options.delimiter),
        key, previous;

    while (object && keys.length && keys[0]) {
      key = keys.shift();

      previous = object;
      if (object.hasOwnProperty(key)) {
        object = object[key];

        if (keys.length === 0 && object !== undefined) {
          break;
        }
      } else {
        object = object[key] = {};
      }
    }

    if (properties) {
      if (typeof properties === 'function') {
        properties = module.run(properties, arguments);
      }

      if (module.isObject(properties)) {
        module.extend(object, properties);
      } else {
        previous[key] = properties;
      }
      return module;
    }

    return object;
  }

  module.run = function (fn, args) {
    args = Array.prototype.slice.call(args, 2).concat(module.options.arguments);
    return fn.apply(module.options.context, args);
  };

  module.isObject = function (object) {
    return typeof object === 'object'
        && object !== null
        && Object.prototype.toString.call(object) !== '[object Array]';
  };

  module.extend = function (target, object) {
    var key;
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        target[key] = object[key];
      }
    }
    return target;
  };

  module.setup = function (options) {
    options = options || {};
    if (options.modules) {
      module.modules = options.modules;
    }

    delete options.modules;
    module.extend(module.options, options);
    return module;
  };

  module.modules  = {};
  module.defaults = {
    context: null,
    arguments: [],
    delimiter: '.'
  };
  module.options = module.extend({}, module.defaults);

  if (typeof context.exports !== 'undefined') {
    context.exports = module;
  } else {
    context.module = module;
  }

})(typeof module !== 'undefined' ? module : this);
