(function (context) {

  function module(keypath, properties) {
    var object = module.modules,
        keys = (keypath || '').split(module.options.delimiter),
        key, previous;

    while (object && keys.length && keys[0]) {
      key = keys.shift();

      if (object.hasOwnProperty(key)) {
        previous = object;
        object   = object[key];

        if (keys.length === 0 && object !== undefined) {
          if (properties) {
            if (module.isObject(properties)) {
              module.extend(object, properties);
            } else {
              previous[key] = properties;
            }
            return module;
          }

          break;
        }
      } else {
        object = object[key] = {};
      }
    }

    return object;
  }

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

  module.modules = {};
  module.options = {
    arguments: [],
    delimiter: '.'
  };

  if (typeof context.exports !== 'undefined') {
    context.exports = module;
  } else {
    context.module = module;
  }

})(typeof module !== 'undefined' ? module : this);
