(function (context) {

  function module(keypath, mod) {
    var object = module.modules,
        keys = (keypath || '').split(module.options.delimiter),
        key;

    while (object && keys.length) {
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
  }

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
