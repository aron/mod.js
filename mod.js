(function (context) {

  function module(keypath, properties) {
    var object = module.get(keypath), key;
    if (properties) {
      for (key in properties) {
        if (properties.hasOwnProperty(key)) {
          object[key] = properties[key];
        }
      }
    }
    return object;
  }

  module.get = function (keypath) {
    var object = module.modules,
        keys = (keypath || '').split(module.options.delimiter),
        key;

    while (object && keys.length && keys[0]) {
      key = keys.shift();

      if (object.hasOwnProperty(key)) {
        object = object[key];

        if (keys.length === 0 && object !== undefined) {
          break;
        }
      } else {
        object = object[key] = {};
      }
    }

    return object;
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
