/*  Mod.js - v0.1.0
 *  Copyright 2012, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/mod.js
 */
(function (context) {
  var _module = context.module;

  /* Public: Returns the object under the provided namespace, if it does
   * not exist then creates one.
   *
   * The value of the object can also be set by passing the value argument.
   * This can take a basic value or a factory function that should then return
   * the actual value to be used.
   *
   * Additional arguments passed into the function will be provided as
   * arguments to the factory function. This can be used in the same way as
   * you would a wrapping a script in a closure e.g. passing in jQuery to
   * create the $ shorthand.
   *
   * keypath - The keypath for the module to return.
   * value   - The value to set the module to.
   *
   * Examples
   *
   *   // Get a module.
   *   module('app.views.list'); //=> {}
   *
   *   // Create a module.
   *   module('app.config', {setting: 'a'});
   *   module('app.config'); //=> {setting: 'a'}
   *
   *   // Create a module with a function. Extra arguments are passed into
   *   // the factory function.
   *   module('app.views.list, function ($, window, undefined) {
   *     return function ListView() {};
   *   }, jQuery, window);
   *
   * Returns the module if called with a single argument otherwise returns
   * the module() function.
   */
  function module(keypath, value) {
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

    if (value) {
      if (typeof value === 'function') {
        value = module.run(value, [].slice.call(arguments, 2));
      }

      if (module.isObject(value)) {
        module.extend(object, value);
      } else {
        previous[key] = value;
      }
      return module;
    }

    return object;
  }

  /* Helper function that calls the factory function with the correct context
   * and arguments and returns the result.
   *
   * fn   - The function to be called.
   * args - The intial arguments to call the function with.
   *
   * Returns the result of the function call.
   */
  module.run = function (fn, args) {
    args = args.concat(module.options.arguments);
    return fn.apply(module.options.context, args);
  };

  /* Checks to see whether the object passed is an object literal.
   *
   * object - The object to test.
   *
   * Examples
   *
   *   module.isObject({});     // true
   *   module.isObject([]);     // false
   *   module.isObject(window); // false
   *
   * Returns true if the object is a simple object.
   */
  module.isObject = function (object) {
    return typeof object === 'object'
        && object !== null
        && object.constructor === Object;
  };

  /* Simple extend function that copies the properties of object onto target.
   *
   * target - The receiver object.
   * object - The object of key/value pairs.
   *
   * Returns the target object.
   */
  module.extend = function (target, object) {
    var key;
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        target[key] = object[key];
      }
    }
    return target;
  };

  /* Public: Override the default options by passing in an object.
   *
   * options - An object literal of options.
   *           modules:   The object to extend with new modules.
   *           context:   The context for the factory function (default: []).
   *           arguments: Default arguments for the factory function (default: null).
   *           delimiter: The keypath delimiter (default: ".")
   *
   * Examples
   *
   *   module.setup({
   *     context: window,
   *     arguments: [jQuery, _],
   *     delimiter: '/'
   *   });
   *
   *   module('views/list', function (jQuery, _) {
   *     return new View();
   *   });
   *
   * Returns the module() function.
   */
  module.setup = function (options) {
    options = options || {};
    if (options.modules) {
      module.modules = options.modules;
    }

    delete options.modules;
    module.extend(module.options, options);
    return module;
  };

  /* Public: Restores the previous value of the module() property in the
   * global scope. This method only applies to the browser.
   *
   * options - An optional options object to save calling .setup().
   *
   * Examples
   *
   *   // Create your application namespace.
   *   var MyApp = {};
   *
   *   // Assign module to the namespace.
   *   MyApp.module = module.noConflict();
   *
   *   // Assign module to the namespace and use MyApp as the module store.
   *   MyApp.module = module.noConflict({modules: MyApp});
   *
   *   MyApp.module('router', new Router());
   *   MyApp.module('router') === MyApp.router; // true
   *
   * Returns the module() function.
   */
  module.noConflict = function (options) {
    context.module = _module;
    return module.setup(options);
  };

  /* Default object that holds the registered modules. This can be
   * overridden using the setup method.
   */
  module.modules  = {};

  /* Default options to be used by the module function. */
  module.defaults = {
    context: null,
    arguments: [],
    delimiter: '.'
  };

  /* Holds the options used by the module function. */
  module.options = module.extend({}, module.defaults);

  if (typeof context.exports !== 'undefined') {
    context.exports = module;
  } else {
    context.module = module;
  }

})(typeof module !== 'undefined' ? module : this);
