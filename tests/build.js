
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  //use the faster Date.now if available.
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = value == null ? _.identity : lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : getTime();
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = getTime();
      var later = function() {
        var last = getTime() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.0'

!function(root, String){
  

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          } else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            } else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          } else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        } else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      return String(str).replace(/(?:^|\s)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', '
      lastSeparator = lastSeparator || ' and '
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæćęèéëêìíïîłńòóöôõøśùúüûñçżź",
          to    = "aaaaaaaaceeeeeiiiilnoooooosuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str) {
      return _s.surround(str, '"');
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.2',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  = document.createElement('input')  ,

    smile = ':)',

    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    } else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };



    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };


    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };



    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
            setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
                setCss('background:url(https://),url(https://),red url(https://)');

            return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };



    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
                setCssAll('opacity:.55');

                    return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
                       (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                       prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

                        if ( ret && 'webkitPerspective' in docElement.style ) {

                      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

            try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                            bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                                                    bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };


    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
                                            Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                                  attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
                            Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                                                    if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                                        bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                                  (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                                                                                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                                        bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;

    ;(function(window, document) {
        var options = window.html5 || {};

        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        var supportsHtml5Styles;

        var expando = '_html5shiv';

        var expanID = 0;

        var expandoData = {};

        var supportsUnknownElements;

      (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
                    supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                        (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
        } catch(e) {
          supportsHtml5Styles = true;
          supportsUnknownElements = true;
        }

      }());        function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
      }

        function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
      }

          function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
      }

        function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

                                    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
      }

        function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
      }

        function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
              return data.createElem(nodeName);
          }
          return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
          'var n=f.cloneNode(),c=n.createElement;' +
          'h.shivMethods&&(' +
                    getElements().join().replace(/\w+/g, function(nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
        )(html5, data.frag);
      }        function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
          data.hasCSS = !!addStyleSheet(ownerDocument,
                    'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
                    'mark{background:#FF0;color:#000}'
          );
        }
        if (!supportsUnknownElements) {
          shivMethods(ownerDocument, data);
        }
        return ownerDocument;
      }        var html5 = {

            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

            'shivCSS': (options.shivCSS !== false),

            'supportsUnknownElements': supportsUnknownElements,

            'shivMethods': (options.shivMethods !== false),

            'type': 'default',

            'shivDocument': shivDocument,

            createElement: createElement,

            createDocumentFragment: createDocumentFragment
      };        window.html5 = html5;

        shivDocument(document);

    }(this, document));

    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
            return testPropsAll(prop, obj, elem);
      }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;
/*                                                    
                +-`-:::::::::::::::::/::::::.          
          `::::/:-`                       `.:///      
          o.                                   /:     
        `o`                                     /-    
      -:/.                                       .:/- 
     :/    ``...-------:///+yyysyyssso++++++/:----.-s`
    /mhhddsoo+++++///::---..`````````````....-:+dmdhho
    .-::om`                                     d+.`` 
        .d`                                    `m-    
         -h`                                   y+     
          so `````......---://///////////::--./m      
          ydoooooooooooo+///-------:::://///+ohN`     
          hy.``                               /N      
           m`                                 +d      
           `m                                .N-      
            :`                               sy       
             d-                             :m`       
             m+                             +m        
             `h/                           .N-        
              :d.                          hs         
               m+                         .d:         
               -sdoossso+++-//+++oossooohy:.          
                `d-````.--:/::--..```` `y/            
                 d/                    `d:            
                 -d`                   /y             
                 `d-                  +h              
                  `y:                 os               
                   +h                h/               
                    so               os                
                    `+ssooossosososs/:.                 
*/


/**
* ### Version 2.0.0a
* kafe /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.
* https://github.com/absolunet/kafe
*
* @module kafe
* @main kafe
*/
window.kafe = (function(undefined){

	var
		// check if module imported
		_exists = function(name) {
			try {
				return eval("("+name+" != undefined)");
			} catch(e) {
				return false;
			}
		},

		// delete var (try/catch for ie8)
		_delete = function(name) {
			try {
				eval("delete "+name+";");
			} catch(e) {
				eval(name+" = undefined;");
			}
		},

		// ie version
		_ie = (function(){
			var
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i')
			;
			while ((
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			));

			return v > 4 ? v : undefined;
		}),

		// jquery methods
		_jQueryMethods = {},


		/**
		* kafe core
		*
		* @module kafe
		* @class kafe
		*/
		core = {

			/**
			* kafe version
			*
			* @property _vesyon 
			* @type String
			**/
			_vesyon: '2.0.0a',

			/**
			* kafe author
			*
			* @property _griyaj 
			* @type String
			**/
			_griyaj: 'absolunet.com',

			/**
			* Versions of dependencies / kafe modules
			*
			* @property _chaje 
			* @type Object
			**/
			_chaje: {
				'dependencies.jQuery':     window.kafejQuery().jquery,
				'dependencies.underscore': window._.VERSION,
				'dependencies.Modernizr':  window.Modernizr._version
			},

			// isolate core dependencies
			dependencies: {

				/**
				* jQuery defined under window.kafejQuery  
				* ref: [http://jquery.com/](http://jquery.com/)
				*
				* @property dependencies.jQuery 
				* @type Object
				**/
				jQuery: window.kafejQuery.noConflict(true),

				/**
				* underscore.js defined under window._  
				* ref: [http://underscorejs.org/](http://underscorejs.org/)
				*
				* @property dependencies.underscore 
				* @type Object
				**/
				underscore: window._.noConflict(),

				/**
				* Modernizr defined under window.Modernizr  
				* ref: [http://modernizr.com/](http://modernizr.com/)
				*
				* @property dependencies.Modernizr 
				* @type Object
				**/
				Modernizr: window.Modernizr
			},

			cms:    {},
			ext:    {},
			plugin: {}
		}
	;
	_delete('window.Modernizr');


	// add flags for ie9 and less
	if (_ie && _ie < 10) {
		var classes = ['is-ie'+_ie];

		for (var i=6; i<10; ++i) {
			if (_ie < i) { classes.push('lt-ie'+_ie); }
			if (_ie > i) { classes.push('gt-ie'+_ie); }
		}

		$(function() { $('html').addClass(classes.join(' ')); });
	}


	// miscellaneous core functions
	core.fn = {

		/**
		* Create a instantiable object  
		* By John Resig (MIT Licensed)  
		* ref: [http://ejohn.org/blog/simple-class-instantiation/](http://ejohn.org/blog/simple-class-instantiation/)
		*
		* @method fn.createInstantiableObject
		* @return {Object} The instantiable object
		*/
		createInstantiableObject: function() {
			return function(args){
				if (this instanceof arguments.callee) {
					if (typeof this.__constructor == 'function') {
						this.__ = {};
						this.__constructor.apply(this, (args.callee) ? args : arguments);
					}
				} else {
					return new arguments.callee(arguments);
				}
			};
		},


		/**
		* Return the language if available or else 'en'
		*
		* @method fn.lang
		* @param {Object} dict The dictionary to check against
		* @param {String} lang The language to check
		* @return {String} The available language
		*/
		lang: function(dict, lang) {
			lang = (!!lang) ? lang : core.env('lang');
			return (!!dict[lang]) ? lang : 'en';
		},


		/**
		* Delete the variable (patch for ie8)
		*
		* @method fn.deleteVar
		* @param {String} name Name of the variable to delete
		*/
		deleteVar: function(name) {
			_delete(name);
		},


		/**
		* Add method as jQuery plugin
		*
		* @method fn.plugIntojQuery
		* @param {String} name The jQuery plugin name
		* @param {Object[Function]} methods Action:Method hash
		*/
		plugIntojQuery: function(name, methods) {
			var
				$  = core.dependencies.jQuery,
				id = 'kafe'+name
			;
			name = name || 'CORE';

			if ($.fn[id] === undefined) {
				_jQueryMethods[name] = {};

				$.fn[id] = function() {
					var args = $.makeArray(arguments);
					return this.each(function() {
						_jQueryMethods[name][args.shift()]( this, args );
					});
				};
			}

			$.extend(_jQueryMethods[name], methods);
		}
	};



	/**
	* Environment constants
	*
	* @method env
	* @param {String} name The constant to get/set
	* @param {String} [value] The value to set
	* @return {String} The value of the environment constant
	*/
	core.env = (function(){

		// base vals
		var _data = {
			culture: '',
			lang:    '',
			page:    '',
			tmpl:    '',
			ie:      _ie
		};

		// grab kafe env
		_data.culture = document.documentElement.id.toLowerCase()   || '';
		_data.lang    = document.documentElement.lang.toLowerCase() || '';
		_data.page    = document.documentElement.getAttribute('data-kafe-page') || '';
		_data.tmpl    = document.documentElement.getAttribute('data-kafe-tmpl') || '';
		_data.tmpl    = _data.tmpl.split(' ');

		// public method
		return function(name, value) {
			var updatable = '';

			if (value !== undefined) {

				// if not already set 
				if (!(_data[name] !== undefined && updatable.search(new RegExp(':'+name+':')) == -1)) {
					_data[name] = value;

				// throw error
				} else {
					throw core.error(new Error("kafe.env > property '"+name+"' already defined"));
				}
			}

			return _data[name];
		};
	})();


	/**
	* Add module to core
	*
	* @method bonify
	* @param {Object} options The options
	*	@param {String} options.name The module name
	*	@param {String} options.version The module version
	*	@param {Object} options.obj The module itself
	*/
	core.bonify = function(options) {

		// if not already extended
		if (!_exists('core.'+options.name)) {

			core._chaje[options.name] = options.version;
			eval('this.'+options.name+' = arguments[0].obj;');

		// throw error
		} else {
			throw core.error('kafe.'+options.name+' already exists');
		}
	};


	/**
	* Throw kafe errors
	*
	* @method error
	* @param {Error} error The error with description
	* @return {Error} error The error
	* @example
	*	kafe.error(new Error('barf'));
	*/
	core.error = function(e) {
		var msg = ((!!e.description) ? e.description : e.message);
		e.description = e.message = '<kafe:erè> : '+ ((!!msg) ? msg : 'anonim');
		return (_ie && _ie == 8) ? new Error(e) : e;
	};


	return core;

})();





// Avoid `console` errors in browsers that lack a console.
// (c) HTML5 Boilerplate
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe');


	test('dependencies', function() {
		ok( !_.isUndefined(kafe.dependencies.jQuery),            'jQuery - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore),        'underscore - Loaded');
		ok( !_.isUndefined(kafe.dependencies.underscore.string), 'underscore.string - Loaded');
		ok( !_.isUndefined(kafe.dependencies.Modernizr),         'modernizr - Loaded');
	});


	test('internal functions', function() {
		var nb = 0;

		ok( _.isFunction( kafe.fn.createInstantiableObject() ), 'createInstantiableObject() - Returns object'); ++nb;

		strictEqual( kafe.fn.lang({}),            'en', 'lang() - Not in dict / Default lang'); ++nb;
		strictEqual( kafe.fn.lang({es:[]}, 'es'), 'es', 'lang() - In dictionary / Specified lang'); ++nb;

		window.TEST = true;
		kafe.fn.deleteVar('window.TEST');
		ok( _.isUndefined(window.TEST), 'deleteVar() - Variable deleted'); ++nb;

		kafe.fn.plugIntojQuery('TEST', {test: function() { ok(true, 'plugIntojQuery() - Plugged into jQuery'); }}); ++nb;
		$('html').kafeTEST('test');

		expect(nb);
	});


	test('environment', function() {
		strictEqual( kafe.env('culture'), 'fr-ca',          'culture');
		strictEqual( kafe.env('lang'),    'fr',             'lang');
		strictEqual( kafe.env('page'),    'SpecialContent', 'page');
		deepEqual(   kafe.env('tmpl'),    ['Content'],      'tmpl');
	});


	test('modules', function() {
		kafe.bonify({name:'TEST', version:'X', obj:{test:true}});
		strictEqual( kafe.TEST.test, true, 'bonify() - Bonified kafe');
	});


})(window.kafe);
window.kafe.bonify({name:'date', version:'1.2', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	var
		// dictionary
		_dict = {
			fr: {
				m:  ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
				m3: [0,0,0,0,0,'Jun','Jul'],
				w:  ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
				d:  ['1er'],
				r:  ['en ce moment',"il y a moins d'une minute",'il y a environ une minute','il y a %n minutes','il y a environ une heure','il y a %n heures','hier','avant-hier','il y a %n jours','la semaine passée','il y a %n semaines','le mois passé','il y a %n mois']
			},
			en: {
				m:  ['January','February','March','April','May','June','July','August','September','October','November','December'],
				w:  ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
				d:  ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st'],
				r:  ['now','less than a minute ago','about a minute ago','%n minutes ago','about an hour ago','%n hours ago','yesterday','day before yesterday','%n days ago','last week','%n weeks ago','last month','%n months ago']
			},
			multi: {
				m2: ['Ja','Fe','Mr','Al','Ma','Jn','Jl','Au','Se','Oc','No','De']
			}
		},

		// get a valid lang
		_lang = function(lang) {
			return kafe.fn.lang(_dict,lang);
		},

		// get the 3-char month abbreviation
		_m3 = function(month, lang) {
			var d = _dict[_lang(lang)];
			return (d.m3 && d.m3[month]) ? d.m3[month] : d.m[month].toString().substring(0,3);
		},

		// get the 3-char weekday abbreviation
		_w3 = function(weekday, lang) {
			var d = _dict[_lang(lang)];
			return (d.w3 && d.w3[weekday]) ? d.w3[weekday] : d.w[weekday].toString().substring(0,3);
		},

		// trim every element of the array
		_trim = function(list, nb) {
			var d = [];
			for (var i in list) {
				d.push(list[i].toString().substr(0,nb));
			}
			return d;
		}
	;



	/**
	* ### Version 1.2
	* Additionnal methods for date manipulation
	*
	* @module kafe
	* @class kafe.date 
	*/
	var date = {

		/**
		* Number of milliseconds in a second (1000 ms per second)
		*
		* @property SECOND 
		* @type Number
		**/
		SECOND:1000,

		/**
		* Number of milliseconds in a minute (60 seconds per minute)
		*
		* @property MINUTE 
		* @type Number
		**/
		MINUTE:60000,

		/**
		* Number of milliseconds in an hour (60 minutes per hour)
		*
		* @property HOUR 
		* @type Number
		**/
		HOUR:3600000,

		/**
		* Number of milliseconds in a day (24 hours per day)
		*
		* @property DAY 
		* @type Number
		**/
		DAY:86400000,

		/**
		* Number of milliseconds in a week (7 days per week)
		*
		* @property WEEK 
		* @type Number
		**/
		WEEK:604800000,

		/**
		* Number of milliseconds in a month (4.348121428571429 weeks per month)
		*
		* @property MONTH 
		* @type Number
		**/
		MONTH:2629743840,

		/**
		* Number of milliseconds in a year (365.2422 days per year)
		*
		* @property YEAR 
		* @type Number
		**/
		YEAR:31556926080
	};


	/**
	* Get the day number out of the full year (365 days).
	*
	* @method getDayYear
	* @param {Date} d The date
	* @return {Number} The day of the year
	* @example
	*	kafe.date.getDayYear(new Date('2013-07-17'));
	*	// returns 198
	*/
	date.getDayYear = function(d) {
		var
			max = this.getMaxMonth(d.getFullYear()),
			m   = d.getMonth(),
			total = 0
		;

		for (var i=0; i<m; ++i) {
			total += max[i];
		}

		return total+d.getDate();
	};


	/**
	* Returns whether the date is within a leap year or not.
	*
	* @method isLeapYear
	* @param {Number} year The year.
	* @return {Boolean} If it is a leap year or not.
	* @example
	*	kafe.date.isLeapYear(2013);
	*	// returns false
	* @example
	*	kafe.date.isLeapYear(2004);
	*	// returns true
	*/
	date.isLeapYear = function(year) {
		return ((year%4 === 0 && year%400 !== 0) || year == 2000);
	};


	/**
	* Get the number of days for all the months of a given year.
	*
	* @method getMaxMonth
	* @param {Number} year The year.
	* @return {Array(Number)} An ordered array of day counts for each months of the given year.
	* @example
	*	kafe.date.getMaxMonth(2013);
	*	// returns [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	* @example
	*	kafe.date.getMaxMonth(2013)[3];
	*	// returns 30
	*/
	date.getMaxMonth = function(year) {
		return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	};


	/**
	* Get the full name of the months of the year.
	*
	* @method getMonthNames
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of month names.
	* @example
	*	kafe.date.getMonthNames('en');
	*	// returns ["January", "February", "March", "April", "May", "June", ... ]
	* @example
	*	kafe.date.getMonthNames('en')[3];
	*	// returns "April"
	*/
	date.getMonthNames = function(lang) {
		return _dict[_lang(lang)].m;
	};


	/**
	* Get the 1-char abbreviations of the months of the year.
	*
	* @method getMonth1Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 1-char month abbreviations.
	* @example
	*	kafe.date.getMonth1Names('en');
	*	// returns ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
	* @example
	*	kafe.date.getMonth1Names('en')[3];
	*	// returns "A"
	*/
	date.getMonth1Names = function(lang) {
		return _trim(_dict[_lang(lang)].m,1);
	};


	/**
	* Get the 2-char abbreviations of the months of the year.
	*
	* @method getMonth2Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 2-char month abbreviations.
	* @example
	*	kafe.date.getMonth2Names('en');
	*	// returns ["Ja", "Fe", "Mr", "Al", "Ma", "Jn", "Jl", "Au", "Se", "Oc", "No", "De"]
	* @example
	*	kafe.date.getMonth2Names('en')[3];
	*	// returns "Al"
	*/
	date.getMonth2Names = function(lang) {
		lang = _lang(lang);
		return (_dict[lang].m2) ? _dict[lang].m2 : _dict.multi.m2;
	};


	/**
	* Get the 3-char abbreviations of the months of the year.
	*
	* @method getMonth3Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 3-char month abbreviations.
	* @example
	*	kafe.date.getMonth3Names('en');
	*	// returns ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	* @example
	*	kafe.date.getMonth3Names('en')[3];
	*	// returns "Apr"
	*/
	date.getMonth3Names = function(lang) {
		var d = [];
		for (var i=0; i<12; ++i) {
			d.push(_m3(i, lang));
		}
		return d;
	};


	/**
	* Returns whether the date is within a weekend.
	*
	* @method isWeekend
	* @param {Date} d The date
	* @return {Boolen} If it is within a weekend or not.
	* @example
	*	kafe.date.isWeekend(new Date('2013-07-17'));
	*	// returns false
	* @example
	*	kafe.date.isWeekend(new Date('2013-07-20'));
	*	// returns true
	*/
	date.isWeekend = function(date) {
		var weekday = date.getDay();
		return (weekday === 0 || weekday === 6);
	};


	/**
	* Get the full name of the days of the week.
	*
	* @method getWeekdayNames
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of weekday names.
	* @example
	*	kafe.date.getWeekdayNames('en');
	*	// returns ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	* @example
	*	kafe.date.getWeekdayNames('en')[3];
	*	// returns "Wednesday"
	*/
	date.getWeekdayNames = function(lang) {
		return _dict[_lang(lang)].w;
	};


	/**
	* Get the 1-char abbreviations of the days of the week.
	*
	* @method getWeekday1Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 1-char weekday abbreviations.
	* @example
	*	kafe.date.getWeekday1Names('en');
	*	// returns ["S", "M", "T", "W", "T", "F", "S"]
	* @example
	*	kafe.date.getWeekday1Names('en')[3];
	*	// returns "W"
	*/
	date.getWeekday1Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,1);
	};


	/**
	* Get the 2-char abbreviations of the days of the week.
	*
	* @method getWeekday2Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 2-char weekday abbreviations.
	* @example
	*	kafe.date.getWeekday2Names('en');
	*	// returns ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
	* @example
	*	kafe.date.getWeekday2Names('en')[3];
	*	// returns "We"
	*/
	date.getWeekday2Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,2);
	};


	/**
	* Get the 3-char abbreviations of the days of the week.
	*
	* @method getWeekday3Names
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of 3-char weekday abbreviations.
	* @example
	*	kafe.date.getWeekday3Names('en');
	*	// returns ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	* @example
	*	kafe.date.getWeekday3Names('en')[3];
	*	// returns "Wed"
	*/
	date.getWeekday3Names = function(lang) {
		var d = [];
		for (var i=0; i<7; ++i) {
			d.push(_w3(i, lang));
		}
		return d;
	};


	/**
	* Get a clean representation for all possible days of a month.
	*
	* @method getDayNames
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {Array(String)} An ordered array of clean representations for all possible days of a month.
	* @example
	*	kafe.date.getDayNames('en');
	*	// returns ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", ... ]
	* @example
	*	kafe.date.getDayNames('en')[3];
	*	// returns "4th"
	*/
	date.getDayNames = function(lang) {
		var
			d = _dict[_lang(lang)].d,
			l = d.length
		;
		for (var i=l; i<31; ++i) {
			d[i] = (i+1).toString();
		}
		return d;
	};


	/**
	* Flexible formatting a given date object.
	*
	* @method format
	* @param {String} format A custom format composed of %- tokens. Characters that are not part of a token will be rendered literally.
	*	@param {Token} format.%Y,%y Year variants: [2011, 11]
	*	@param {Token} format.%M,%m,%A,%a,%B,%b,%C,%c Month variants: [01, 1, January, january, Jan, jan, JA, Ja]
	*	@param {Token} format.%D,%d,%e Day variants: [02, 2, 2nd]
	*	@param {Token} format.%W,%w,%X,%x,%Z,%z Weekday variants: [Sunday, sunday, Sun, sun, Su, su]
	*	@param {Token} format.%H,%h,%K,%k,%p Hour variants [15, 15, 03, 3, pm]
	*	@param {Token} format.%I,%i Minute variants [04, 4]
	*	@param {Token} format.%S,%s Second variants [05, 5]
	* @param {Date} [date=NOW] A date to be formatted.
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {String} The formatted date.
	* @example
	*	kafe.date.format('%W, %A %e, %Y', new Date('2013-07-17'), 'en');
	*	// returns "Tuesday, July 16th, 2013"
	* @example
	*	kafe.date.format('%W, %d %a, %Y', new Date('2013-07-17'), 'fr');
	*	// returns "Mardi, 16 juillet, 2013"
	*/
	date.format = function(format, date, lang) {
		date = (date) ? date : new Date();
		lang = _lang(lang);

		var
			pad  = function() { return ('0'+arguments[0].toString()).slice(-2); },
			d    = _dict[lang],

			year      = date.getFullYear(),
			month     = date.getMonth()+1,
			day       = date.getDate(),
			weekday   = date.getDay(),
			hours     = date.getHours(),
			minutes   = date.getMinutes(),
			seconds   = date.getSeconds(),
			hours12   = ((hours % 12) === 0) ? 12 : (hours % 12),
			hoursAmPm = Math.floor(hours/12),

			//                                                                 2011-01-02 15:04:05
			data = {                                                        // -------------------
				Y: year,                                                    // year           2011
				y: year.toString().substring(2),                            // year             11
				M: pad(month),                                              // month            01
				m: month,                                                   // month             1
				A: d.m[month-1],                                            // month       January
				a: d.m[month-1].toLowerCase(),                              // month       january
				B: this.getMonth3Names(lang)[month-1],                      // month           Jan
				b: this.getMonth3Names(lang)[month-1].toLowerCase(),        // month           jan
				C: this.getMonth2Names(lang)[month-1].toUpperCase(),        // month            JA
				c: this.getMonth2Names(lang)[month-1],                      // month            Ja
				D: pad(day),                                                // day              02
				d: day,                                                     // day               2
				e: this.getDayNames(lang)[day-1],                           // day             2nd
				W: d.w[weekday],                                            // weekday      Sunday
				w: d.w[weekday].toLowerCase(),                              // weekday      sunday
				X: this.getWeekday3Names(lang)[weekday],                    // weekday         Sun
				x: this.getWeekday3Names(lang)[weekday].toLowerCase(),      // weekday         sun
				Z: this.getWeekday2Names(lang)[weekday],                    // weekday          Su
				z: this.getWeekday2Names(lang)[weekday].toLowerCase(),      // weekday          su
				H: pad(hours),                                              // hour             15
				h: hours,                                                   // hour             15
				K: pad(hours12),                                            // hour             03 
				k: hours12,                                                 // hour              3
				p: (hoursAmPm) ? 'pm' : 'am',                               // hour             pm
				I: pad(minutes),                                            // minute           04
				i: minutes,                                                 // minute            4
				S: pad(seconds),                                            // second           05
				s: seconds                                                  // second            5
			}
		;

		for (var i in data) {
			format = format.replace(new RegExp('%'+i,'g'),data[i]);
		}

		return format;
	};


	/**
	* Get a relative time expression from a specific datetime.
	*
	* @method formatRelative
	* @param {Date} time Specific datetime object.
	* @param {Date} [now=NOW] Comparative datetime object to calculate the time difference.
	* @param {String} [lang=CURRENT_ENV_LANG] A two character language code.
	* @return {String} The relative time expression
	* @example
	*	kafe.date.formatRelative(new Date('2013-07-19 6:00:00'), new Date('2013-07-19 20:00:00'), 'en');
	*	// returns "14 hours ago"
	* @example
	*	kafe.date.formatRelative(new Date('2013-05-19'), new Date('2013-07-19'), 'en');
	*	// returns "2 months ago"
	*/
	date.formatRelative = function(time, now, lang) {
		now = (now) ? now : new Date();

		var
			d     = _dict[_lang(lang)].r,
			delta = now.getTime() - time.getTime()
		;

		if (delta <= 0) {
			return d[0];
		} else if (delta < date.MINUTE) {
			return d[1];
		} else if(delta < 2*date.MINUTE) {
			return d[2];
		} else if(delta < date.HOUR) {
			return d[3].replace('%n', Math.floor(delta/date.MINUTE));
		} else if(delta < 2*date.HOUR) {
			return d[4];
		} else if(delta < date.DAY) {
			return d[5].replace('%n', Math.floor(delta/date.HOUR));
		} else if(delta < 2*date.DAY) {
			return d[6];
		} else if(delta < 3*date.DAY) {
			return d[7];
		} else if(delta < date.WEEK) {
			return d[8].replace('%n', Math.floor(delta/date.DAY));
		} else if(delta < 2*date.WEEK) {
			return d[9];
		} else if(delta < date.MONTH) {
			return d[10].replace('%n', Math.floor(delta/date.WEEK));
		} else if(delta < 2*date.MONTH) {
			return d[11];
		} else {
			return d[12].replace('%n', Math.floor(delta/date.MONTH));
		}
	};


	/**
	* Parses a given datetime string into a standard datetime object.
	*
	* @method parse
	* @param {String} dtstring Custom datetime string
	* @return {Date} The date object
	* @example
	*	kafe.date.parse('2012-08-08T12:18:00.000-04:00');
	*	// returns Wed Aug 08 2012 12:18:00 GMT-0400 (EDT)
	* @example
	*	kafe.date.parse('June 3, 2013');
	*	// returns Mon Jun 03 2013 00:00:00 GMT-0400 (EDT)
	*/
	date.parse = function(dtstring) {
		if (/^([0-9]{2,4})-([0-9]{2})-([0-9]{2})$/gi.test(dtstring)) {
			dtstring += ' 00:00:00';
		}

		var ts = Date.parse(dtstring);

		if (isNaN(ts)) {

			var
				y2y4 = function(year) {
					if (year > 69 && year < 100) {
						return Number(year) + 1900;
					} else if (year < 69) {
						return Number(year) + 2000;
					} else {
						return year;
					}
				},
				m = date.getMonth3Names('en'),
				year, month, day, hour, minute, second, delta, e, d
			;

			// ISO 8601 / 2011-03-08 09:25:15 (useless for chrome)
			if ((e = new RegExp('^([0-9]{2,4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$','gi').exec(dtstring))) {
				year   = y2y4(e[1]);
				month  = e[2];
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];

			// RFC 822 (rss) / Sat, 30 Oct 10 13:51:32 +0000
			} else if ((e = new RegExp('^([a-z]{3}), ([0-9]{2}) ([a-z]{3}) ([0-9]{2,4}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([+-][0-9]{4})$','gi').exec(dtstring))) {
				year   = y2y4(e[4]);
				month  = $.inArray(e[3], m)+1;
				day    = e[2];
				hour   = e[5];
				minute = e[6];
				second = e[7];
				delta  = e[8]/100;

			// (twitter) / Mon Nov 01 01:49:22 +0000 2010
			} else if ((e = new RegExp('^([a-z]{3}) ([a-z]{3}) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([+-][0-9]{4}) ([0-9]{2,4})$','gi').exec(dtstring))) {
				year   = y2y4(e[8]);
				month  = $.inArray(e[2], m)+1;
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];
				delta  = e[7]/100;

			// ISO 8601 / 2012-08-08T12:18:00.000-04:00 (useless for chrome/safari)
			} else if ((e = new RegExp('^([0-9]{2,4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\\.([0-9]{3})([+-])([0-9]{2}):([0-9]{2})$','gi').exec(dtstring))) {
				year   = y2y4(e[1]);
				month  = e[2];
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];
				delta  = (Number(e[9]) + (Number(e[10])/60)) * ((e[8] == '-') ? -1 : 1);
			}

			d = new Date(year, month-1, day, hour, minute, second, 0);
			return (delta !== undefined) ? new Date(d - ( (d.getTimezoneOffset() + (Number(delta)*60) ) * 60 * 1000)) : d;

		} else {
			return new Date(ts);
		}
	};


	/**
	* Refreshes a dropdown containing the days of a given year/month combination.
	*
	* @method refreshSelectDays
	* @param {DOMElement} obj The &lt;select&gt; element
	* @param {Number} month The month 
	* @param {Number} year The year
	* @example
	*	$('.select-month').on('change', function(e) {
	*		kafe.date.refreshSelectDays('.select-day', $(this).val(), $('.select-year').val());
	*	})
	*/
	date.refreshSelectDays = function(obj, month, year) {

		// if a title in the dropdown
		var
			dp = (Number(obj.options[0].value)) ? 0 : 1,
			dn = -dp,
			nb = this.getMaxMonth(year)[month-1]
		;

		// if there are less day in the new month
		if (obj.length+dn > nb) {

			// if a impossible day for the new days is selected
			if (obj.selectedIndex+1 > nb+dn) {
				obj.selectedIndex = nb-1+dp;
			}
			obj.length = nb+dp;

		// if there are more days in the new month
		} else if ( obj.length+dn < nb ) {

			var curr = obj.length;
			obj.length = nb+dp;

			// rebuild the new days
			for (var i=curr; i<nb+dp; ++i) {
				obj.options[i].text = i+1+dn;
				obj.options[i].value = i+1+dn;
			}
		}
	};


	/**
	* Creates an html table calendar for a given month/year combination. You can also provide specific dates with destination url to be included in the rendered source.
	*
	* @method makeMonthCalendar
	* @param {Number} year The year
	* @param {Number} month The month 
	* @param {Object} [links] The links by date
	*	@param {Array} links.YYYY-MM-DD The links
	* @return {String} The rendered HTML
	* @example
	*	kafe.date.makeMonthCalendar(2013, 4, {'2013-04-03':'http://mybirthday.com/'});
	*	// returns "<table data-month="2013-04"><caption>Avril 2013</caption><thead><tr><th>Dim</th><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th></thead><tbody><tr><td>&nbsp;</td><td data-date="2013-04-01"><span>1</span></td><td data-date="2013-04-02"><span>2</span></td><td data-date="2013-04-03"><a href="http://mybirthday.com/">3</a></td><td data-date="2013-04-04"><span>4</span></td><td data-date="2013-04-05"><span>5</span></td><td data-date="2013-04-06"><span>6</span></td></tr><tr><td data-date="2013-04-07"><span>7</span></td><td data-date="2013-04-08"><span>8</span></td><td data-date="2013-04-09"><span>9</span></td><td data-date="2013-04-10"><span>10</span></td><td data-date="2013-04-11"><span>11</span></td><td data-date="2013-04-12"><span>12</span></td><td data-date="2013-04-13"><span>13</span></td></tr><tr><td data-date="2013-04-14"><span>14</span></td><td data-date="2013-04-15"><span>15</span></td><td data-date="2013-04-16"><span>16</span></td><td data-date="2013-04-17"><span>17</span></td><td data-date="2013-04-18"><span>18</span></td><td data-date="2013-04-19"><span>19</span></td><td data-date="2013-04-20"><span>20</span></td></tr><tr><td data-date="2013-04-21"><span>21</span></td><td data-date="2013-04-22"><span>22</span></td><td data-date="2013-04-23"><span>23</span></td><td data-date="2013-04-24"><span>24</span></td><td data-date="2013-04-25"><span>25</span></td><td data-date="2013-04-26"><span>26</span></td><td data-date="2013-04-27"><span>27</span></td></tr><tr><td data-date="2013-04-28"><span>28</span></td><td data-date="2013-04-29"><span>29</span></td><td data-date="2013-04-30"><span>30</span></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>"
	*/
	date.makeMonthCalendar = function(year, month, links) {
		links = links || {};
		--m;

		var
			i,
			weekdays = date.getWeekday3Names(),
			max      = date.getMaxMonth(year)[month],
			firstDay = new Date(year,month,1).getDay(),
			week     = 0,
			today    = date.format('%Y-%M-%D', new Date()),
			html     = '<table data-month="'+date.format('%Y-%M', new Date(year,month,1))+'"><caption>'+date.getMonthNames()[month]+' '+year+'</caption><thead><tr>'
		;

		// weekdays
		for (i in weekdays) {
			html += '<th>'+weekdays[i]+'</th>';
		}

		html += '</thead><tbody><tr>';

		// start padding
		for (i=0; i<firstDay; ++i) {
			html += '<td>&nbsp;</td>';
			++week;
		}

		// days
		for (i=1; i<=max; ++i) {
			if (week == 7) {
				html += '</tr><tr>';
				week = 0;
			}

			var thisDate = date.format('%Y-%M-%D', new Date(year,month,i));
			html += '<td data-date="'+thisDate+'"'+((thisDate == today) ? ' class="Today"' : '')+'>' + ((links[thisDate]) ? '<a href="'+links[thisDate]+'">'+i+'</a>' : '<span>'+i+'</span>') + '</td>';
			++week;
		}

		// end padding
		for (i=week; i<7; ++i) {
			html += '<td>&nbsp;</td>';
		}

		return html+'</tr></tbody></table>';
	};


	return date;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.date');


	test('getDayYear()', function() {
		var getDayYear = function(date,expected,comment) {
			strictEqual( kafe.date.getDayYear( kafe.date.parse(date) ), expected, comment );
		};
		getDayYear('2013-01-01', 1,   'First day');
		getDayYear('2013-07-17', 198, 'Random day');
		getDayYear('2013-12-31', 365, 'Last day');
		getDayYear('2016-12-31', 366, 'Last day / Leap year');
		
	});


	test('isLeapYear()', function() {
		var isLeapYear = function(year,expected) {
			strictEqual( kafe.date.isLeapYear(year), expected, year );
		};
		isLeapYear(1980, true);
		isLeapYear(2000, true);
		isLeapYear(2010, false);
		isLeapYear(2400, false);
	});


	test('isWeekend()', function() {
		var isWeekend = function(date,expected,comment) {
			strictEqual( kafe.date.isWeekend( kafe.date.parse(date) ), expected, comment );
		};
		isWeekend('2013-07-17', false, 'Wednesday');
		isWeekend('2013-07-20', true,  'Saturday');
		isWeekend('2013-07-21', true,  'Sunday');
	});


	test('getMaxMonth()', function() {
		var getMaxMonth = function(year,month,expected,comment) {
			strictEqual( kafe.date.getMaxMonth(year)[month-1], expected, comment );
		};
		getMaxMonth(2013, 2, 28, 'February');
		getMaxMonth(2016, 2, 29, 'February / Leap year');
		getMaxMonth(2013, 7, 31, 'July');
	});


	test('getMonthNames()', function() {
		var getMonthNames = function(month,expected,comment) {
			strictEqual( kafe.date.getMonthNames(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonthNames('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonthNames(2, ['Février','February'], 'February');
	});


	test('getMonth1Names()', function() {
		var getMonth1Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth1Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth1Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth1Names(2, ['F','F'], 'February');
	});


	test('getMonth2Names()', function() {
		var getMonth2Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth2Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth2Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth2Names(2, ['Fe','Fe'], 'February');
	});


	test('getMonth3Names()', function() {
		var getMonth3Names = function(month,expected,comment) {
			strictEqual( kafe.date.getMonth3Names(    )[month-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getMonth3Names('en')[month-1], expected[1], comment + ' / Specified lang' );
		};
		getMonth3Names(2, ['Fév','Feb'], 'February');
	});


	test('getWeekdayNames()', function() {
		var getWeekdayNames = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekdayNames(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekdayNames('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekdayNames(1, ['Lundi','Monday'], 'Monday');
	});


	test('getWeekday1Names()', function() {
		var getWeekday1Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday1Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday1Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday1Names(1, ['L','M'], 'Monday');
	});


	test('getWeekday2Names()', function() {
		var getWeekday2Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday2Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday2Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday2Names(1, ['Lu','Mo'], 'Monday');
	});


	test('getWeekday3Names()', function() {
		var getWeekday3Names = function(weekday,expected,comment) {
			strictEqual( kafe.date.getWeekday3Names(    )[weekday], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getWeekday3Names('en')[weekday], expected[1], comment + ' / Specified lang' );
		};
		getWeekday3Names(1, ['Lun','Mon'], 'Monday');
	});


	test('getDayNames()', function() {
		var getDayNames = function(day,expected,comment) {
			strictEqual( kafe.date.getDayNames(    )[day-1], expected[0], comment + ' / Default lang' );
			strictEqual( kafe.date.getDayNames('en')[day-1], expected[1], comment + ' / Specified lang' );
		};
		getDayNames(1, ['1er','1st'], 'First');
		getDayNames(2, ['2',  '2nd'], 'Second');
	});


	test('format()', function() {
		var format = function(format,date,lang,expected,comment) {
			strictEqual( kafe.date.format(format, kafe.date.parse('2013-'+date), ((lang) ? lang : undefined)), expected, comment);
		};
		format('%Y | %y',                               '01-01 00:00:00', '',   '2013 | 13',                                         'Years');
		format('%M | %m | %A | %a | %B | %b | %C | %c', '04-01 00:00:00', '',   '04 | 4 | Avril | avril | Avr | avr | AL | Al',      'Months / Default lang / 1 digit');
		format('%M | %m | %A | %a | %B | %b | %C | %c', '10-01 00:00:00', 'en', '10 | 10 | October | october | Oct | oct | OC | Oc', 'Months / Specified lang / 2 digits');
		format('%D | %d | %e',                          '01-10 00:00:00', '',   '10 | 10 | 10',                                      'Days / Default lang / 2 digits');
		format('%D | %d | %e',                          '01-06 00:00:00', 'en', '06 | 6 | 6th',                                      'Days / Specified lang / 1 digit');
		format('%W | %w | %X | %x | %Z | %z',           '01-01 00:00:00', '',   'Mardi | mardi | Mar | mar | Ma | ma',               'Weekdays / Default lang');
		format('%W | %w | %X | %x | %Z | %z',           '01-06 00:00:00', 'en', 'Sunday | sunday | Sun | sun | Su | su',             'Weekdays / Specified lang');
		format('%H | %h | %K | %k | %p',                '01-01 01:00:00', '',   '01 | 1 | 01 | 1 | am',                              'Hours / 1 digit / AM');
		format('%H | %h | %K | %k | %p',                '01-01 22:00:00', '',   '22 | 22 | 10 | 10 | pm',                            'Hours / 2 digits / PM');
		format('%I | %i',                               '01-01 00:01:00', '',   '01 | 1',                                            'Minutes / 1 digit');
		format('%I | %i',                               '01-01 00:10:00', '',   '10 | 10',                                           'Minutes / 2 digits');
		format('%S | %s',                               '01-01 00:00:01', '',   '01 | 1',                                            'Seconds / 1 digit');
		format('%S | %s',                               '01-01 00:00:10', '',   '10 | 10',                                           'Seconds / 2 digits');
	});


	test('formatRelative()', function() {
		var formatRelative = function(date,expected,comment) {
			strictEqual( kafe.date.formatRelative(kafe.date.parse('2013-01-01 00:00:00'), kafe.date.parse('2013-'+date)),       expected[0], comment+' / Default lang');
			strictEqual( kafe.date.formatRelative(kafe.date.parse('2013-01-01 00:00:00'), kafe.date.parse('2013-'+date), 'en'), expected[1], comment+' / Specified lang');
		};
		formatRelative('01-01 00:00:00', ['en ce moment',              'now'                   ], 'now');
		formatRelative('01-01 00:00:30', ["il y a moins d'une minute", 'less than a minute ago'], '1 second');
		formatRelative('01-01 00:01:00', ['il y a environ une minute', 'about a minute ago'    ], '1 minute');
		formatRelative('01-01 00:02:00', ['il y a 2 minutes',          '2 minutes ago'         ], '2 minutes');
		formatRelative('01-01 01:00:00', ['il y a environ une heure',  'about an hour ago'     ], '1 hour');
		formatRelative('01-01 02:00:00', ['il y a 2 heures',           '2 hours ago'           ], '2 hours');
		formatRelative('01-02 00:00:00', ['hier',                      'yesterday'             ], '1 day');
		formatRelative('01-03 00:00:00', ['avant-hier',                'day before yesterday'  ], '2 days');
		formatRelative('01-04 00:00:00', ['il y a 3 jours',            '3 days ago'            ], '3 days');
		formatRelative('01-08 00:00:00', ['la semaine passée',         'last week'             ], '1 week');
		formatRelative('01-15 00:00:00', ['il y a 2 semaines',         '2 weeks ago'           ], '2 weeks');
		formatRelative('02-01 00:00:00', ['le mois passé',             'last month'            ], '1 month');
		formatRelative('03-15 00:00:00', ['il y a 2 mois',             '2 months ago'          ], '2 months');
	});


	test('parse()', function() {
		var parse = function(date,comment) {
			strictEqual( kafe.date.parse(date).getTime(), new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)').getTime(), comment+' / '+date);
		};

		parse('January 1, 2013',                'US human readable');
		parse('2013-01-01',                     'ISO 8601 (standard)');
		parse('2013-01-01 00:00:00',            'ISO 8601 (standard)');
		parse('2013-01-01T01:00:00-04:00',      'ISO 8601 (standard)');
		parse('2013-01-01T05:00:00+00:00',      'ISO 8601 (standard)');
		parse('2013-01-01T09:00:00+04:00',      'ISO 8601 (standard)');
		parse('2013-01-01T05:00:00.000+00:00',  'ISO 8601 (standard)');
		parse('Tue, 01 Jan 13 04:00:00 -0100',  'RFC 822 (rss)');
		parse('Tue, 01 Jan 13 05:00:00 +0000',  'RFC 822 (rss)');
		parse('Tue, 01 Jan 13 06:00:00 +0100',  'RFC 822 (rss)');
		parse('Tue Jan 01 04:00:00 -0100 2013', '(twitter)');
		parse('Tue Jan 01 05:00:00 +0000 2013', '(twitter)');
		parse('Tue Jan 01 06:00:00 +0100 2013', '(twitter)');
	});

	/*
	
	TODO


	test('refreshSelectDays()', function() {
	});


	test('makeMonthCalendar()', function() {
	});

	*/

})(window.kafe);
window.kafe.bonify({name:'number', version:'1.0', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.0
	* Additionnal manipulation methods for numbers.
	*
	* @module kafe
	* @class kafe.number 
	*/
	var number = {};

	/**
	* Converts a number to its roman numeral value.
	*
	* @method toRoman
	* @param {Number} number
	* @return {String} The roman numeral value.
	* @example
	*	kafe.number.toRoman(1954);
	*	// returns "MCMLIV"
	*/
	number.toRoman = function(n) {

		var
			// repeat string n times
			repeat = function (s,nb) {
				return new Array(Number(nb)+1).join(s);
			},

			data   = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
			result = ''
		;

		// transform to int
		n = parseInt(n,10);

		// foreach numeral
		for (var i in data) {
			var matches = parseInt(n / data[i], 10);
			if (!!matches) {
				result += repeat(i, matches);
				n = n % data[i];
			}
		}
		return result;
	};


	return number;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.number');


	test('toRoman()', function() {
		var toRoman = function(number,expected) {
			strictEqual( kafe.number.toRoman( number ), expected, number );
		};
		toRoman(1,    'I');
		toRoman(2,    'II');
		toRoman(3,    'III');
		toRoman(4,    'IV');
		toRoman(5,    'V');
		toRoman(6,    'VI');
		toRoman(7,    'VII');
		toRoman(8,    'VIII');
		toRoman(9,    'IX');
		toRoman(10,   'X');
		toRoman(14,   'XIV');
		toRoman(15,   'XV');
		toRoman(16,   'XVI');
		toRoman(23,   'XXIII');
		toRoman(44,   'XLIV');
		toRoman(53,   'LIII');
		toRoman(99,   'XCIX');
		toRoman(101,  'CI');
		toRoman(477,  'CDLXXVII');
		toRoman(956,  'CMLVI');
		toRoman(1111, 'MCXI');
		toRoman(1982, 'MCMLXXXII');
		toRoman(1999, 'MCMXCIX');
		toRoman(2013, 'MMXIII');
	});

})(window.kafe);
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	/* <kafe replacement> */ if (false) { var x=false; /* </kafe replacement> */} else {
		// Browser globals.
		factory(window.kafe.dependencies.jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
/**
 * jQuery JSON plugin 2.4.0
 *
 * @author Brantley Harris, 2009-2011
 * @author Timo Tijhof, 2011-2012
 * @source This plugin is heavily influenced by MochiKit's serializeJSON, which is
 *         copyrighted 2005 by Bob Ippolito.
 * @source Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 *         website's http://www.json.org/json2.js, which proclaims:
 *         "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 *         I uphold.
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function ($) {
	

	var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		hasOwn = Object.prototype.hasOwnProperty;

	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON representation.
	 *
	 * @param o {Mixed} The json-serializable *thing* to be converted
	 *
	 * If an object has a toJSON prototype, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
		if (o === null) {
			return 'null';
		}

		var pairs, k, name, val,
			type = $.type(o);

		if (type === 'undefined') {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1,
				day = o.getUTCDate(),
				year = o.getUTCFullYear(),
				hours = o.getUTCHours(),
				minutes = o.getUTCMinutes(),
				seconds = o.getUTCSeconds(),
				milli = o.getUTCMilliseconds();

			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' +
				hours + ':' + minutes + ':' + seconds +
				'.' + milli + 'Z"';
		}

		pairs = [];

		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if (typeof o === 'object') {
			for (k in o) {
				// Only include own properties,
				// Filter out inherited prototypes
				if (hasOwn.call(o, k)) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given json string.
	 *
	 * @param str {String}
	 */
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		/*jshint evil: true */
		return eval('(' + str + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param str {String}
	 */
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		var filtered =
			str
			.replace(/\\["\\\/bfnrtu]/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) {
			/*jshint evil: true */
			return eval('(' + str + ')');
		}
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	$.quoteString = function (str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};

}(window.kafe.dependencies.jQuery));

window.kafe.bonify({name:'string', version:'1.2', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.2
	* Additionnal methods for string manipulation and generation.
	*
	* @module kafe
	* @class kafe.string
	*/
	var string = {};

	/**
	* Removes accented charaters from a string.
	*
	* @method removeAccent
	* @param {String} string
	* @return {String} The unaccented string.
	* @example
	*	kafe.string.removeAccent('Kafe signifie café en créole.');
	*	// returns "Kafe signifie cafe en creole."
	*/
	string.removeAccent = function() {
		return arguments[0]
			.replace(/[àáâãäå]/g, 'a') .replace(/[ÀÁÂÃÄÅ]/g, 'A')
			.replace(/æ/g, 'ae')       .replace(/Æ/g, 'AE')
			.replace(/ç/g, 'c')        .replace(/Ç/g, 'C')
			.replace(/[èéêë]/g, 'e')   .replace(/[ÈÉÊË]/g, 'E')
			.replace(/[ìíîï]/g, 'i')   .replace(/[ÌÍÎÏ]/g, 'I')
			.replace(/ñ/g, 'n')        .replace(/Ñ/g, 'N')
			.replace(/[òóôõö]/g, 'o')  .replace(/[ÒÓÔÕÖ]/g, 'O')
			.replace(/œ/g, 'oe')       .replace(/Œ/g, 'OE')
			.replace(/[ùúûü]/g, 'u')   .replace(/[ÙÚÛÜ]/g, 'U')
			.replace(/[ýÿ]/g, 'y')     .replace(/[ÝŸ]/g, 'Y')
		;
	};


	/**
	* Transforms a JSON string into a javascript object.
	*
	* @method toObject
	* @param {String} string A JSON string.
	* @return {Object} A valid javascript object.
	* @example
	*	kafe.string.toObject('{"UserId":"456","Items":["first", "second", "last"],"State":true,"TotalAmount":52,"Taxes":[]}');
	*	// returns Object {UserId: "456", Items: Array[3], State: true, TotalAmount: 52, Taxes: Array[0]}
	*/
	string.toObject = function(s) {

		var cast = function(o) {
			for (var i in o) {
				// object
				if (typeof(o[i]) == 'object') {
					o[i] = cast(o[i]);

				// date
				} else if (/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(o[i])) {
					o[i] = new Date(o[i]);
				}
			}
			return o;
		};

		return cast($.evalJSON(s));
	};


	/**
	* Generates a .NET random GUID/UUID. (Version 4, random)
	*
	* @method generateGuid
	* @return {String} A random valid GUID/UUID.
	* @example
	*	kafe.string.generateGuid();
	*	// returns "c573f4f3-982a-4046-818a-083757f98804"
	*/
	string.generateGuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};


	return string;

})(window.kafe)});

window.kafe.bonify({name:'storage', version:'1.1', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	var
		Modernizr = kafe.dependencies.Modernizr,

		LOCAL   = 1,
		SESSION = 2,


		// if storage type is available
		_isAvailable = function() {
			return (arguments[0] == LOCAL) ? Modernizr.localstorage : Modernizr.sessionstorage;
		},


		// get storage obj
		_getStorageObj = function() {
			return (arguments[0] == LOCAL) ? localStorage : sessionStorage;
		},



		// get data from storage
		_get = function(type, key) {
			if (_isAvailable(type)) {
				var
					sData = _getStorageObj(type).getItem(key),
					data = (sData) ? kafe.string.toObject(sData) : undefined
				;
				if (!!data) {

					if (!!data.expires && _.isDate(data.expires) && data.expires < new Date()) {
						_remove(type,key);

					} else if (!!data.expires && _.isString(data.expires)) {

						if (data.cookie != $.cookie(data.expires)) {
							_remove(type,key);

						} else {
							return data.data;
						}
					} else {
						return data.data;
					}
				}
			}
			return undefined;
		},


		// set data in storage
		_set = function(type,key,value,options) {
			if (_isAvailable(type)) {
				options = options || {};
				var data = {
					//modified: new Date(),
					data: value
				};

				if (!!options.expires) {
					if (_.isString(options.expires)) {
						data.cookie = $.cookie(options.expires);
						data.expires = options.expires;
					} else {
						data.expires = new Date( new Date().getTime()+(options.expires * 1000) );
					}
				}

				_getStorageObj(type).setItem(key, $.toJSON(data));
			}
		},



		// remove data from storage
		_remove = function(type,key) {
			if (_isAvailable(type)) {
				_getStorageObj(type).removeItem(key);
			}
		},


		// get namespace keys from storage
		_getNamespaceKeys = function(type,name) {
			if (_isAvailable(type)) {
				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;

				if (root !== undefined) {
					data.push(name);
				}

				for (var i in s) {
					if (r.test(i)) {
						if (_get(type,i) !== undefined) {
							data.push(i);
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// get namespace data from storage
		_getNamespaceItems = function(type,name) {
			if (_isAvailable(type)) {

				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;
				if (root !== undefined) {
					data[name] = root;
				}

				for (var i in s) {
					if (r.test(i)) {
						var d = _get(type,i);
						if (d !== undefined) {
							data[i] = d;
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// remove namespace data from storage
		_removeNamespace = function(type,name) {
			if (_isAvailable(type)) {

				_remove(type,name);

				var
					s = _getStorageObj(type),
					r = new RegExp('^'+name+':')
				;
				for (var i in s) {
					if (r.test(i)) {
						_remove(type,i);
					}
				}
			}
		},




		// get all keys from storage
		_getAllKeys = function(type) {
			if (_isAvailable(type)) {
				var
					data = [],
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					if (_get(type,i) !== undefined) {
						data.push(i);
					}
				}

				return data;
			}
			return undefined;
		},


		// get all data from storage
		_getAllItems = function(type) {
			if (_isAvailable(type)) {
				var
					data = {},
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					var d = _get(type,i);
					if (d !== undefined) {
						data[i] = d;
					}
				}

				return data;
			}
			return undefined;
		},


		// remove all data from storage
		_removeAll = function(type) {
			if (_isAvailable(type)) {
				_getStorageObj(type).clear();
			}
		}
	;




	/**
	* ### Version 1.1
	* Easily access, sort and manipulate local and session storage values.
	*
	* @module kafe
	* @class kafe.storage 
	*/
	var storage = {};

	/**
	* Returns the local value for a specific key.
	*
	* @method getPersistentItem
	* @param {String} key
	* @return {String} If not expiration flag was trigged (cookie or datetime), returns the local storage value. Otherwise, returns *undefined*.
	* @example
	*	kafe.storage.getPersistentItem('history:last-visit');
	*/
	storage.getPersistentItem = function(key) {
		return _get(LOCAL,key);
	};


	/**
	* Returns the session value for a specific key.
	*
	* @method getSessionItem
	* @param {String} key
	* @return {String} If not expiration flag was trigged (cookie or datetime), returns the session storage value. Otherwise, returns *undefined*.
	* @example
	*	kafe.storage.getSessionItem('user:first-name');
	*/
	storage.getSessionItem = function(key) {
		return _get(SESSION,key);
	};


	/**
	* Sets the local value for a specific key with or without an expiration flag. Namespacing can be defined by using the ':' character.
	*
	* @method setPersistentItem
	* @param {String} key
	* @param {String} value
	* @param {Object} [options] Expiration parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will flag the local storage value for the provided key as expired.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the local storage value for the provided key will be flagged as expired.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21', { expires: 3600 });
	*	// The local storage value will return undefined in one hour.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21', { expires: 'last-visit-cookie' });
	*	// The local storage value will return undefined if the value of the cookie 'last-visit-cookie' is changed.
	*/
	storage.setPersistentItem = function(key,value,options) {
		_set(LOCAL,key,value,options);
	};


	/**
	* Sets the session value for a specific key with or without an expiration flag. Namespacing can be defined by using the ':' character.
	*
	* @method setSessionItem
	* @param {String} key
	* @param {String} value
	* @param {Object} [options] Expiration parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will flag the session storage value for the provided key as expired.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the session storage value for the provided key will be flagged as expired.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John', { expires: 3600 });
	*	// The session storage value will return undefined in one hour.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John', { expires: 'logged-user' });
	*	// The session storage value will return undefined if the value of the cookie 'logged-user' is changed.
	*/
	storage.setSessionItem = function(key,value,options) {
		_set(SESSION,key,value,options);
	};


	/**
	* Removes the local storage value for a specific key.
	*
	* @method removePersistentItem
	* @param {String} key
	* @example
	*	kafe.storage.removePersistentItem('history:last-visit');
	*/
	storage.removePersistentItem = function(key) {
		_remove(LOCAL,key);
	};


	/**
	* Removes the session storage value for a specific key.
	*
	* @method removeSessionItem
	* @param {String} key
	* @example
	*	kafe.storage.removeSessionItem('user:first-name');
	*/
	storage.removeSessionItem = function(key) {
		_remove(SESSION,key);
	};


	/**
	* Returns an array of local storage keys for a specific namespace.
	*
	* @method getPersistentNamespaceKeys
	* @param {String} namespace
	* @return {Array(String)} A list of keys.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21');
	*	kafe.storage.setPersistentItem('history:last-page', '/about-us');
	*	
	*	kafe.storage.getPersistentNamespaceKeys('history');
	*	// returns ["history:last-page", "history:last-visit"]
	*/
	storage.getPersistentNamespaceKeys = function(name) {
		return _getNamespaceKeys(LOCAL,name);
	};


	/**
	* Returns an array of session storage keys for a specific namespace.
	*
	* @method getSessionNamespaceKeys
	* @param {String} namespace
	* @return {Array(String)} A list of keys.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John');
	*	kafe.storage.setSessionItem('user:last-name', 'Doe');
	*	
	*	kafe.storage.getSessionNamespaceKeys('user');
	*	// returns ["user:first-name", "user:last-name"]
	*/
	storage.getSessionNamespaceKeys = function(name) {
		return _getNamespaceKeys(SESSION,name);
	};


	/**
	* Returns all local storage key values for a specific namespace.
	*
	* @method getPersistentNamespaceItems
	* @param {String} namespace
	* @return {Object} An object containing all local key/value combinations for the namespace.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21');
	*	kafe.storage.setPersistentItem('history:last-page', '/about-us');
	*	
	*	kafe.storage.getPersistentNamespaceItems('history');
	*	// returns { "history:last-page": "/about-us", "history:last-visit": "2013-07-21" }
	*/
	storage.getPersistentNamespaceItems = function(name) {
		return _getNamespaceItems(LOCAL,name);
	};


	/**
	* Returns all session storage key values for a specific namespace.
	*
	* @method getSessionNamespaceItems
	* @param {String} namespace
	* @return {Object} An object containing all session key/value combinations for the namespace.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John');
	*	kafe.storage.setSessionItem('user:last-name', 'Doe');
	*	
	*	kafe.storage.getSessionNamespaceItems('user');
	*	// returns { "user:first-name": "John", "user:last-name": "Doe" }
	*/
	storage.getSessionNamespaceItems = function(name) {
		return _getNamespaceItems(SESSION,name);
	};


	/**
	* Removes all local storage keys of a specific namespace.
	*
	* @method removePersistentNamespace
	* @param {String} namespace
	* @example
	*	kafe.storage.removePersistentNamespace('history');
	*/
	storage.removePersistentNamespace = function(name) {
		_removeNamespace(LOCAL,name);
	};


	/**
	* Removes all session storage keys of a specific namespace.
	*
	* @method removeSessionNamespace
	* @param {String} namespace
	* @example
	*	kafe.storage.removeSessionNamespace('user');
	*/
	storage.removeSessionNamespace = function(name) {
		_removeNamespace(SESSION,name);
	};


	/**
	* Returns an array of all local storage keys.
	*
	* @method getAllPersistentKeys
	* @return {Array(String)} A list of keys.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21');
	*	kafe.storage.setPersistentItem('website:show-ads', 'true');
	*	
	*	kafe.storage.getAllPersistentKeys();
	*	// returns ["history:last-visit", "website:show-ads"]
	*/
	storage.getAllPersistentKeys = function() {
		return _getAllKeys(LOCAL);
	};


	/**
	* Returns an array of all session storage keys.
	*
	* @method getAllSessionKeys
	* @return {Array(String)} A list of keys.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John');
	*	kafe.storage.setSessionItem('preferences:tutorials', 'false');
	*	
	*	kafe.storage.getAllSessionKeys();
	*	// returns ["user:first-name", "preferences:tutorials"]
	*/
	storage.getAllSessionKeys = function() {
		return _getAllKeys(SESSION);
	};


	/**
	* Returns all local storage key values.
	*
	* @method getAllPersistentItems
	* @return {Object} An object containing all local key/value combinations.
	* @example
	*	kafe.storage.setPersistentItem('history:last-visit', '2013-07-21');
	*	kafe.storage.setPersistentItem('website:show-ads', 'true');
	*	
	*	kafe.storage.getAllPersistentItems();
	*	// returns { "history:last-visit": "2013-07-21", "settings:show-ads": "true" }
	*/
	storage.getAllPersistentItems = function() {
		return _getAllItems(LOCAL);
	};


	/**
	* Returns all session storage key values.
	*
	* @method getAllSessionItems
	* @return {Object} An object containing all session key/value combinations.
	* @example
	*	kafe.storage.setSessionItem('user:first-name', 'John');
	*	kafe.storage.setSessionItem('preferences:tutorials', 'false');
	*	
	*	kafe.storage.getAllSessionItems();
	*	// returns { "preferences:tutorials": "false", "user:first-name": "John" }
	*/
	storage.getAllSessionItems = function() {
		return _getAllItems(SESSION);
	};


	/**
	* Removes all local storage keys.
	*
	* @method removeAllPersistent
	* @example
	*	kafe.storage.removeAllPersistent();
	*/
	storage.removeAllPersistent = function() {
		_removeAll(LOCAL);
	};


	/**
	* Removes all session storage keys.
	*
	* @method removeAllSession
	* @example
	*	kafe.storage.removeAllSession();
	*/
	storage.removeAllSession = function() {
		_removeAll(SESSION);
	};


	/**
	* Get the JSON response of a webservice and keep it in the session storage with or without an expiration flag. Use this shorthand method to prevent unnecessary communication with the server on ajax heavy websites. All session keys used with this method are part of the *kafestorage-getJSON* namespace.
	*
	* @method getJSON
	* @param {String} url URL address of the webservice.
	* @param {Object} [options] Other parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will force a new call to the webservice on the next use.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the next use will call the webservice instead of using the session storage.
	*	@param {Function} [options.callback] Callback triggered if the response is successful or a session stored value exists. The response (or stored value) is passed as the first argument.
	* @example
	*	kafe.storage.getJSON('/UserServices/GetUserInfos?username=john_doe', { expires: 3600 });
	*	// Using this same line will use the session stored value instead of calling the service unless one hour has passed.
	*/
	storage.getJSON = function() {
		if (_isAvailable(SESSION)) {
			var
				url      = arguments[0],
				options  = (typeof(arguments[1]) != 'function') ? arguments[1] : {expires:600},
				callback = (typeof(arguments[1]) != 'function') ? arguments[2] : arguments[1],
				key      = 'kafestorage-getJSON:'+url.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				cache    = storage.getSessionItem(key)
			;

			if (cache !== undefined) {
				callback(cache);
			} else {
				$.getJSON(url, function(data) {
					storage.setSessionItem(key, data, options);
					callback(data);
				});
			}
		}
	};


	return storage;

})(window.kafe)});
/*
* jQuery Mobile v1.3.2
* http://jquerymobile.com
*
* Copyright 2010, 2013 jQuery Foundation, Inc. and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/

(function ( root, doc, factory ) {
	/* <kafe replacement> */ if (false) { var x=false; /* </kafe replacement> */} else {
		// Browser globals
		factory( window.kafe.dependencies.jQuery, root, doc );
	}
}( this, document, function ( jQuery, window, document, undefined ) {
// Script: jQuery hashchange event
// 
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function( $, window, undefined ) {
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function() {
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function( val ) { return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    window.attachEvent && !window.addEventListener && !supports_onhashchange && (function() {
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function() {
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function() {
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function() {
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})(jQuery,this);

(function( $ ) {
	$.mobile = {};
}( jQuery ));
(function( $, window, undefined ) {
	var nsNormalizeDict = {};

	// jQuery.mobile configurable options
	$.mobile = $.extend($.mobile, {

		// Version of the jQuery Mobile Framework
		version: "1.3.2",

		// Namespace used framework-wide for data-attrs. Default is no namespace
		ns: "",

		// Define the url parameter used for referencing widget-generated sub-pages.
		// Translates to to example.html&ui-page=subpageIdentifier
		// hash segment before &ui-page= is used to make Ajax request
		subPageUrlKey: "ui-page",

		// Class assigned to page currently in view, and during transitions
		activePageClass: "ui-page-active",

		// Class used for "active" button state, from CSS framework
		activeBtnClass: "ui-btn-active",

		// Class used for "focus" form element state, from CSS framework
		focusClass: "ui-focus",

		// Automatically handle clicks and form submissions through Ajax, when same-domain
		ajaxEnabled: true,

		// Automatically load and show pages based on location.hash
		hashListeningEnabled: true,

		// disable to prevent jquery from bothering with links
		linkBindingEnabled: true,

		// Set default page transition - 'none' for no transitions
		defaultPageTransition: "fade",

		// Set maximum window width for transitions to apply - 'false' for no limit
		maxTransitionWidth: false,

		// Minimum scroll distance that will be remembered when returning to a page
		minScrollBack: 250,

		// DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
		touchOverflowEnabled: false,

		// Set default dialog transition - 'none' for no transitions
		defaultDialogTransition: "pop",

		// Error response message - appears when an Ajax page request fails
		pageLoadErrorMessage: "Error Loading Page",

		// For error messages, which theme does the box uses?
		pageLoadErrorMessageTheme: "e",

		// replace calls to window.history.back with phonegaps navigation helper
		// where it is provided on the window object
		phonegapNavigationEnabled: false,

		//automatically initialize the DOM when it's ready
		autoInitializePage: true,

		pushStateEnabled: true,

		// allows users to opt in to ignoring content by marking a parent element as
		// data-ignored
		ignoreContentEnabled: false,

		// turn of binding to the native orientationchange due to android orientation behavior
		orientationChangeEnabled: true,

		buttonMarkup: {
			hoverDelay: 200
		},

		// define the window and the document objects
		window: $( window ),
		document: $( document ),

		// TODO might be useful upstream in jquery itself ?
		keyCode: {
			ALT: 18,
			BACKSPACE: 8,
			CAPS_LOCK: 20,
			COMMA: 188,
			COMMAND: 91,
			COMMAND_LEFT: 91, // COMMAND
			COMMAND_RIGHT: 93,
			CONTROL: 17,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			INSERT: 45,
			LEFT: 37,
			MENU: 93, // COMMAND_RIGHT
			NUMPAD_ADD: 107,
			NUMPAD_DECIMAL: 110,
			NUMPAD_DIVIDE: 111,
			NUMPAD_ENTER: 108,
			NUMPAD_MULTIPLY: 106,
			NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SHIFT: 16,
			SPACE: 32,
			TAB: 9,
			UP: 38,
			WINDOWS: 91 // COMMAND
		},

		// Place to store various widget extensions
		behaviors: {},

		// Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
		silentScroll: function( ypos ) {
			if ( $.type( ypos ) !== "number" ) {
				ypos = $.mobile.defaultHomeScroll;
			}

			// prevent scrollstart and scrollstop events
			$.event.special.scrollstart.enabled = false;

			setTimeout( function() {
				window.scrollTo( 0, ypos );
				$.mobile.document.trigger( "silentscroll", { x: 0, y: ypos });
			}, 20 );

			setTimeout( function() {
				$.event.special.scrollstart.enabled = true;
			}, 150 );
		},

		// Expose our cache for testing purposes.
		nsNormalizeDict: nsNormalizeDict,

		// Take a data attribute property, prepend the namespace
		// and then camel case the attribute string. Add the result
		// to our nsNormalizeDict so we don't have to do this again.
		nsNormalize: function( prop ) {
			if ( !prop ) {
				return;
			}

			return nsNormalizeDict[ prop ] || ( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
		},

		// Find the closest parent with a theme class on it. Note that
		// we are not using $.fn.closest() on purpose here because this
		// method gets called quite a bit and we need it to be as fast
		// as possible.
		getInheritedTheme: function( el, defaultTheme ) {
			var e = el[ 0 ],
				ltr = "",
				re = /ui-(bar|body|overlay)-([a-z])\b/,
				c, m;

			while ( e ) {
				c = e.className || "";
				if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
					// We found a parent with a theme class
					// on it so bail from this loop.
					break;
				}

				e = e.parentNode;
			}

			// Return the theme letter we found, if none, return the
			// specified default.

			return ltr || defaultTheme || "a";
		},

		// TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
		//
		// Find the closest javascript page element to gather settings data jsperf test
		// http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
		// possibly naive, but it shows that the parsing overhead for *just* the page selector vs
		// the page and dialog selector is negligable. This could probably be speed up by
		// doing a similar parent node traversal to the one found in the inherited theme code above
		closestPageData: function( $target ) {
			return $target
				.closest( ':jqmData(role="page"), :jqmData(role="dialog")' )
				.data( "mobile-page" );
		},

		enhanceable: function( $set ) {
			return this.haveParents( $set, "enhance" );
		},

		hijackable: function( $set ) {
			return this.haveParents( $set, "ajax" );
		},

		haveParents: function( $set, attr ) {
			if ( !$.mobile.ignoreContentEnabled ) {
				return $set;
			}

			var count = $set.length,
				$newSet = $(),
				e, $element, excluded;

			for ( var i = 0; i < count; i++ ) {
				$element = $set.eq( i );
				excluded = false;
				e = $set[ i ];

				while ( e ) {
					var c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

					if ( c === "false" ) {
						excluded = true;
						break;
					}

					e = e.parentNode;
				}

				if ( !excluded ) {
					$newSet = $newSet.add( $element );
				}
			}

			return $newSet;
		},

		getScreenHeight: function() {
			// Native innerHeight returns more accurate value for this across platforms,
			// jQuery version is here as a normalized fallback for platforms like Symbian
			return window.innerHeight || $.mobile.window.height();
		}
	}, $.mobile );

	// Mobile version of data and removeData and hasData methods
	// ensures all data is set and retrieved using jQuery Mobile's data namespace
	$.fn.jqmData = function( prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			if ( prop ) {
				prop = $.mobile.nsNormalize( prop );
			}

			// undefined is permitted as an explicit input for the second param
			// in this case it returns the value and does not set it to undefined
			if( arguments.length < 2 || value === undefined ){
				result = this.data( prop );
			} else {
				result = this.data( prop, value );
			}
		}
		return result;
	};

	$.jqmData = function( elem, prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
		}
		return result;
	};

	$.fn.jqmRemoveData = function( prop ) {
		return this.removeData( $.mobile.nsNormalize( prop ) );
	};

	$.jqmRemoveData = function( elem, prop ) {
		return $.removeData( elem, $.mobile.nsNormalize( prop ) );
	};

	$.fn.removeWithDependents = function() {
		$.removeWithDependents( this );
	};

	$.removeWithDependents = function( elem ) {
		var $elem = $( elem );

		( $elem.jqmData( 'dependents' ) || $() ).remove();
		$elem.remove();
	};

	$.fn.addDependents = function( newDependents ) {
		$.addDependents( $( this ), newDependents );
	};

	$.addDependents = function( elem, newDependents ) {
		var dependents = $( elem ).jqmData( 'dependents' ) || $();

		$( elem ).jqmData( 'dependents', $.merge( dependents, newDependents ) );
	};

	// note that this helper doesn't attempt to handle the callback
	// or setting of an html element's text, its only purpose is
	// to return the html encoded version of the text in all cases. (thus the name)
	$.fn.getEncodedText = function() {
		return $( "<div/>" ).text( $( this ).text() ).html();
	};

	// fluent helper function for the mobile namespaced equivalent
	$.fn.jqmEnhanceable = function() {
		return $.mobile.enhanceable( this );
	};

	$.fn.jqmHijackable = function() {
		return $.mobile.hijackable( this );
	};

	// Monkey-patching Sizzle to filter the :jqmData selector
	var oldFind = $.find,
		jqmDataRE = /:jqmData\(([^)]*)\)/g;

	$.find = function( selector, context, ret, extra ) {
		selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );

		return oldFind.call( this, selector, context, ret, extra );
	};

	$.extend( $.find, oldFind );

	$.find.matches = function( expr, set ) {
		return $.find( expr, null, null, set );
	};

	$.find.matchesSelector = function( node, expr ) {
		return $.find( expr, null, null, [ node ] ).length > 0;
	};
})( jQuery, this );


(function( $, undefined ) {

	/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
	window.matchMedia = window.matchMedia || (function( doc, undefined ) {

		

		var bool,
			docElem = doc.documentElement,
			refNode = docElem.firstElementChild || docElem.firstChild,
			// fakeBody required for <FF4 when executed in <head>
			fakeBody = doc.createElement( "body" ),
			div = doc.createElement( "div" );

		div.id = "mq-test-1";
		div.style.cssText = "position:absolute;top:-100em";
		fakeBody.style.background = "none";
		fakeBody.appendChild(div);

		return function(q){

			div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

			docElem.insertBefore( fakeBody, refNode );
			bool = div.offsetWidth === 42;
			docElem.removeChild( fakeBody );

			return {
				matches: bool,
				media: q
			};

		};

	}( document ));

	// $.mobile.media uses matchMedia to return a boolean.
	$.mobile.media = function( q ) {
		return window.matchMedia( q ).matches;
	};

})(jQuery);

	(function( $, undefined ) {
		var support = {
			touch: "ontouchend" in document
		};

		$.mobile.support = $.mobile.support || {};
		$.extend( $.support, support );
		$.extend( $.mobile.support, support );
	}( jQuery ));

	(function( $, undefined ) {
		$.extend( $.support, {
			orientation: "orientation" in window && "onorientationchange" in window
		});
	}( jQuery ));

(function( $, undefined ) {

// thx Modernizr
function propExists( prop ) {
	var uc_prop = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
		props = ( prop + " " + vendors.join( uc_prop + " " ) + uc_prop ).split( " " );

	for ( var v in props ) {
		if ( fbCSS[ props[ v ] ] !== undefined ) {
			return true;
		}
	}
}

var fakeBody = $( "<body>" ).prependTo( "html" ),
	fbCSS = fakeBody[ 0 ].style,
	vendors = [ "Webkit", "Moz", "O" ],
	webos = "palmGetResource" in window, //only used to rule out scrollTop
	opera = window.opera,
	operamini = window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]",
	bb = window.blackberry && !propExists( "-webkit-transform" ); //only used to rule out box shadow, as it's filled opaque on BB 5 and lower


function validStyle( prop, value, check_vend ) {
	var div = document.createElement( 'div' ),
		uc = function( txt ) {
			return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 );
		},
		vend_pref = function( vend ) {
			if( vend === "" ) {
				return "";
			} else {
				return  "-" + vend.charAt( 0 ).toLowerCase() + vend.substr( 1 ) + "-";
			}
		},
		check_style = function( vend ) {
			var vend_prop = vend_pref( vend ) + prop + ": " + value + ";",
				uc_vend = uc( vend ),
				propStyle = uc_vend + ( uc_vend === "" ? prop : uc( prop ) );

			div.setAttribute( "style", vend_prop );

			if ( !!div.style[ propStyle ] ) {
				ret = true;
			}
		},
		check_vends = check_vend ? check_vend : vendors,
		ret;

	for( var i = 0; i < check_vends.length; i++ ) {
		check_style( check_vends[i] );
	}
	return !!ret;
}

function transform3dTest() {
	var mqProp = "transform-3d",
		// Because the `translate3d` test below throws false positives in Android:
		ret = $.mobile.media( "(-" + vendors.join( "-" + mqProp + "),(-" ) + "-" + mqProp + "),(" + mqProp + ")" );

	if( ret ) {
		return !!ret;
	}

	var el = document.createElement( "div" ),
		transforms = {
			// We’re omitting Opera for the time being; MS uses unprefixed.
			'MozTransform':'-moz-transform',
			'transform':'transform'
		};

	fakeBody.append( el );

	for ( var t in transforms ) {
		if( el.style[ t ] !== undefined ){
			el.style[ t ] = 'translate3d( 100px, 1px, 1px )';
			ret = window.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
		}
	}
	return ( !!ret && ret !== "none" );
}

// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
function baseTagTest() {
	var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
		base = $( "head base" ),
		fauxEle = null,
		href = "",
		link, rebase;

	if ( !base.length ) {
		base = fauxEle = $( "<base>", { "href": fauxBase }).appendTo( "head" );
	} else {
		href = base.attr( "href" );
	}

	link = $( "<a href='testurl' />" ).prependTo( fakeBody );
	rebase = link[ 0 ].href;
	base[ 0 ].href = href || location.pathname;

	if ( fauxEle ) {
		fauxEle.remove();
	}
	return rebase.indexOf( fauxBase ) === 0;
}

// Thanks Modernizr
function cssPointerEventsTest() {
	var element = document.createElement( 'x' ),
		documentElement = document.documentElement,
		getComputedStyle = window.getComputedStyle,
		supports;

	if ( !( 'pointerEvents' in element.style ) ) {
		return false;
	}

	element.style.pointerEvents = 'auto';
	element.style.pointerEvents = 'x';
	documentElement.appendChild( element );
	supports = getComputedStyle &&
	getComputedStyle( element, '' ).pointerEvents === 'auto';
	documentElement.removeChild( element );
	return !!supports;
}

function boundingRect() {
	var div = document.createElement( "div" );
	return typeof div.getBoundingClientRect !== "undefined";
}

// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
// allows for inclusion of IE 6+, including Windows Mobile 7
$.extend( $.mobile, { browser: {} } );
$.mobile.browser.oldIE = (function() {
	var v = 3,
		div = document.createElement( "div" ),
		a = div.all || [];

	do {
		div.innerHTML = "<!--[if gt IE " + ( ++v ) + "]><br><![endif]-->";
	} while( a[0] );

	return v > 4 ? v : !v;
})();

function fixedPosition() {
	var w = window,
		ua = navigator.userAgent,
		platform = navigator.platform,
		// Rendering engine is Webkit, and capture major version
		wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
		wkversion = !!wkmatch && wkmatch[ 1 ],
		ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
		ffversion = !!ffmatch && ffmatch[ 1 ],
		operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
		omversion = !!operammobilematch && operammobilematch[ 1 ];

	if(
		// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
		( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 ) ||
		// Opera Mini
		( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" ) ||
		( operammobilematch && omversion < 7458 )	||
		//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
		( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 ) ||
		// Firefox Mobile before 6.0 -
		( ffversion && ffversion < 6 ) ||
		// WebOS less than 3
		( "palmGetResource" in window && wkversion && wkversion < 534 )	||
		// MeeGo
		( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 ) ) {
		return false;
	}

	return true;
}

$.extend( $.support, {
	cssTransitions: "WebKitTransitionEvent" in window ||
		validStyle( 'transition', 'height 100ms linear', [ "Webkit", "Moz", "" ] ) &&
		!$.mobile.browser.oldIE && !opera,

	// Note, Chrome for iOS has an extremely quirky implementation of popstate.
	// We've chosen to take the shortest path to a bug fix here for issue #5426
	// See the following link for information about the regex chosen
	// https://developers.google.com/chrome/mobile/docs/user-agent#chrome_for_ios_user-agent
	pushState: "pushState" in history &&
		"replaceState" in history &&
		// When running inside a FF iframe, calling replaceState causes an error
		!( window.navigator.userAgent.indexOf( "Firefox" ) >= 0 && window.top !== window ) &&
		( window.navigator.userAgent.search(/CriOS/) === -1 ),

	mediaquery: $.mobile.media( "only all" ),
	cssPseudoElement: !!propExists( "content" ),
	touchOverflow: !!propExists( "overflowScrolling" ),
	cssTransform3d: transform3dTest(),
	boxShadow: !!propExists( "boxShadow" ) && !bb,
	fixedPosition: fixedPosition(),
	scrollTop: ("pageXOffset" in window ||
		"scrollTop" in document.documentElement ||
		"scrollTop" in fakeBody[ 0 ]) && !webos && !operamini,

	dynamicBaseTag: baseTagTest(),
	cssPointerEvents: cssPointerEventsTest(),
	boundingRect: boundingRect()
});

fakeBody.remove();


// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
// Note: This detection below is used as a last resort.
// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
var nokiaLTE7_3 = (function() {

	var ua = window.navigator.userAgent;

	//The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
	return ua.indexOf( "Nokia" ) > -1 &&
			( ua.indexOf( "Symbian/3" ) > -1 || ua.indexOf( "Series60/5" ) > -1 ) &&
			ua.indexOf( "AppleWebKit" ) > -1 &&
			ua.match( /(BrowserNG|NokiaBrowser)\/7\.[0-3]/ );
})();

// Support conditions that must be met in order to proceed
// default enhanced qualifications are media query support OR IE 7+

$.mobile.gradeA = function() {
	return ( $.support.mediaquery || $.mobile.browser.oldIE && $.mobile.browser.oldIE >= 7 ) && ( $.support.boundingRect || $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null );
};

$.mobile.ajaxBlacklist =
			// BlackBerry browsers, pre-webkit
			window.blackberry && !window.WebKitPoint ||
			// Opera Mini
			operamini ||
			// Symbian webkits pre 7.3
			nokiaLTE7_3;

// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
// This simply reappends the CSS in place, which for some reason makes it apply
if ( nokiaLTE7_3 ) {
	$(function() {
		$( "head link[rel='stylesheet']" ).attr( "rel", "alternate stylesheet" ).attr( "rel", "stylesheet" );
	});
}

// For ruling out shadows via css
if ( !$.support.boxShadow ) {
	$( "html" ).addClass( "ui-mobile-nosupport-boxshadow" );
}

})( jQuery );


(function( $, undefined ) {
	var $win = $.mobile.window, self, history;

	$.event.special.navigate = self = {
		bound: false,

		pushStateEnabled: true,

		originalEventName: undefined,

		// If pushstate support is present and push state support is defined to
		// be true on the mobile namespace.
		isPushStateEnabled: function() {
			return $.support.pushState &&
				$.mobile.pushStateEnabled === true &&
				this.isHashChangeEnabled();
		},

		// !! assumes mobile namespace is present
		isHashChangeEnabled: function() {
			return $.mobile.hashListeningEnabled === true;
		},

		// TODO a lot of duplication between popstate and hashchange
		popstate: function( event ) {
			var newEvent = new $.Event( "navigate" ),
				beforeNavigate = new $.Event( "beforenavigate" ),
				state = event.originalEvent.state || {},
				href = location.href;

			$win.trigger( beforeNavigate );

			if( beforeNavigate.isDefaultPrevented() ){
				return;
			}

			if( event.historyState ){
				$.extend(state, event.historyState);
			}

			// Make sure the original event is tracked for the end
			// user to inspect incase they want to do something special
			newEvent.originalEvent = event;

			// NOTE we let the current stack unwind because any assignment to
			//      location.hash will stop the world and run this event handler. By
			//      doing this we create a similar behavior to hashchange on hash
			//      assignment
			setTimeout(function() {
				$win.trigger( newEvent, {
					state: state
				});
			}, 0);
		},

		hashchange: function( event, data ) {
			var newEvent = new $.Event( "navigate" ),
				beforeNavigate = new $.Event( "beforenavigate" );

			$win.trigger( beforeNavigate );

			if( beforeNavigate.isDefaultPrevented() ){
				return;
			}

			// Make sure the original event is tracked for the end
			// user to inspect incase they want to do something special
			newEvent.originalEvent = event;

			// Trigger the hashchange with state provided by the user
			// that altered the hash
			$win.trigger( newEvent, {
				// Users that want to fully normalize the two events
				// will need to do history management down the stack and
				// add the state to the event before this binding is fired
				// TODO consider allowing for the explicit addition of callbacks
				//      to be fired before this value is set to avoid event timing issues
				state: event.hashchangeState || {}
			});
		},

		// TODO We really only want to set this up once
		//      but I'm not clear if there's a beter way to achieve
		//      this with the jQuery special event structure
		setup: function( data, namespaces ) {
			if( self.bound ) {
				return;
			}

			self.bound = true;

			if( self.isPushStateEnabled() ) {
				self.originalEventName = "popstate";
				$win.bind( "popstate.navigate", self.popstate );
			} else if ( self.isHashChangeEnabled() ){
				self.originalEventName = "hashchange";
				$win.bind( "hashchange.navigate", self.hashchange );
			}
		}
	};
})( jQuery );



	// throttled resize event
	(function( $ ) {
		$.event.special.throttledresize = {
			setup: function() {
				$( this ).bind( "resize", handler );
			},
			teardown: function() {
				$( this ).unbind( "resize", handler );
			}
		};

		var throttle = 250,
			handler = function() {
				curr = ( new Date() ).getTime();
				diff = curr - lastCall;

				if ( diff >= throttle ) {

					lastCall = curr;
					$( this ).trigger( "throttledresize" );

				} else {

					if ( heldCall ) {
						clearTimeout( heldCall );
					}

					// Promise a held call will still execute
					heldCall = setTimeout( handler, throttle - diff );
				}
			},
			lastCall = 0,
			heldCall,
			curr,
			diff;
	})( jQuery );

(function( $, window ) {
	var win = $( window ),
		event_name = "orientationchange",
		special_event,
		get_orientation,
		last_orientation,
		initial_orientation_is_landscape,
		initial_orientation_is_default,
		portrait_map = { "0": true, "180": true };

	// It seems that some device/browser vendors use window.orientation values 0 and 180 to
	// denote the "default" orientation. For iOS devices, and most other smart-phones tested,
	// the default orientation is always "portrait", but in some Android and RIM based tablets,
	// the default orientation is "landscape". The following code attempts to use the window
	// dimensions to figure out what the current orientation is, and then makes adjustments
	// to the to the portrait_map if necessary, so that we can properly decode the
	// window.orientation value whenever get_orientation() is called.
	//
	// Note that we used to use a media query to figure out what the orientation the browser
	// thinks it is in:
	//
	//     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
	//
	// but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
	// where the browser *ALWAYS* applied the landscape media query. This bug does not
	// happen on iPad.

	if ( $.support.orientation ) {

		// Check the window width and height to figure out what the current orientation
		// of the device is at this moment. Note that we've initialized the portrait map
		// values to 0 and 180, *AND* we purposely check for landscape so that if we guess
		// wrong, , we default to the assumption that portrait is the default orientation.
		// We use a threshold check below because on some platforms like iOS, the iPhone
		// form-factor can report a larger width than height if the user turns on the
		// developer console. The actual threshold value is somewhat arbitrary, we just
		// need to make sure it is large enough to exclude the developer console case.

		var ww = window.innerWidth || win.width(),
			wh = window.innerHeight || win.height(),
			landscape_threshold = 50;

		initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


		// Now check to see if the current window.orientation is 0 or 180.
		initial_orientation_is_default = portrait_map[ window.orientation ];

		// If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
		// if the initial orientation is portrait, but window.orientation reports 90 or -90, we
		// need to flip our portrait_map values because landscape is the default orientation for
		// this device/browser.
		if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
			portrait_map = { "-90": true, "90": true };
		}
	}

	$.event.special.orientationchange = $.extend( {}, $.event.special.orientationchange, {
		setup: function() {
			// If the event is supported natively, return false so that jQuery
			// will bind to the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Get the current orientation to avoid initial double-triggering.
			last_orientation = get_orientation();

			// Because the orientationchange event doesn't exist, simulate the
			// event by testing window dimensions on resize.
			win.bind( "throttledresize", handler );
		},
		teardown: function() {
			// If the event is not supported natively, return false so that
			// jQuery will unbind the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Because the orientationchange event doesn't exist, unbind the
			// resize event handler.
			win.unbind( "throttledresize", handler );
		},
		add: function( handleObj ) {
			// Save a reference to the bound event handler.
			var old_handler = handleObj.handler;


			handleObj.handler = function( event ) {
				// Modify event object, adding the .orientation property.
				event.orientation = get_orientation();

				// Call the originally-bound event handler and return its result.
				return old_handler.apply( this, arguments );
			};
		}
	});

	// If the event is not supported natively, this handler will be bound to
	// the window resize event to simulate the orientationchange event.
	function handler() {
		// Get the current orientation.
		var orientation = get_orientation();

		if ( orientation !== last_orientation ) {
			// The orientation has changed, so trigger the orientationchange event.
			last_orientation = orientation;
			win.trigger( event_name );
		}
	}

	// Get the current page orientation. This method is exposed publicly, should it
	// be needed, as jQuery.event.special.orientationchange.orientation()
	$.event.special.orientationchange.orientation = get_orientation = function() {
		var isPortrait = true, elem = document.documentElement;

		// prefer window orientation to the calculation based on screensize as
		// the actual screen resize takes place before or after the orientation change event
		// has been fired depending on implementation (eg android 2.3 is before, iphone after).
		// More testing is required to determine if a more reliable method of determining the new screensize
		// is possible when orientationchange is fired. (eg, use media queries + element + opacity)
		if ( $.support.orientation ) {
			// if the window orientation registers as 0 or 180 degrees report
			// portrait, otherwise landscape
			isPortrait = portrait_map[ window.orientation ];
		} else {
			isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		}

		return isPortrait ? "portrait" : "landscape";
	};

	$.fn[ event_name ] = function( fn ) {
		return fn ? this.bind( event_name, fn ) : this.trigger( event_name );
	};

	// jQuery < 1.8
	if ( $.attrFn ) {
		$.attrFn[ event_name ] = true;
	}

}( jQuery, this ));


// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

(function( $, window, document, undefined ) {

var dataPropertyName = "virtualMouseBindings",
	touchTargetPropertyName = "virtualTouchID",
	virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
	touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
	mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
	mouseEventProps = $.event.props.concat( mouseHookProps ),
	activeDocHandlers = {},
	resetTimerID = 0,
	startX = 0,
	startY = 0,
	didScroll = false,
	clickBlockList = [],
	blockMouseTriggers = false,
	blockTouchTriggers = false,
	eventCaptureSupported = "addEventListener" in document,
	$document = $( document ),
	nextTouchID = 1,
	lastTouchID = 0, threshold;

$.vmouse = {
	moveDistanceThreshold: 10,
	clickDistanceThreshold: 10,
	resetTimerDuration: 1500
};

function getNativeEvent( event ) {

	while ( event && typeof event.originalEvent !== "undefined" ) {
		event = event.originalEvent;
	}
	return event;
}

function createVirtualEvent( event, eventType ) {

	var t = event.type,
		oe, props, ne, prop, ct, touch, i, j, len;

	event = $.Event( event );
	event.type = eventType;

	oe = event.originalEvent;
	props = $.event.props;

	// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
	// https://github.com/jquery/jquery-mobile/issues/3280
	if ( t.search( /^(mouse|click)/ ) > -1 ) {
		props = mouseEventProps;
	}

	// copy original event properties over to the new event
	// this would happen if we could call $.event.fix instead of $.Event
	// but we don't have a way to force an event to be fixed multiple times
	if ( oe ) {
		for ( i = props.length, prop; i; ) {
			prop = props[ --i ];
			event[ prop ] = oe[ prop ];
		}
	}

	// make sure that if the mouse and click virtual events are generated
	// without a .which one is defined
	if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ) {
		event.which = 1;
	}

	if ( t.search(/^touch/) !== -1 ) {
		ne = getNativeEvent( oe );
		t = ne.touches;
		ct = ne.changedTouches;
		touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

		if ( touch ) {
			for ( j = 0, len = touchEventProps.length; j < len; j++) {
				prop = touchEventProps[ j ];
				event[ prop ] = touch[ prop ];
			}
		}
	}

	return event;
}

function getVirtualBindingFlags( element ) {

	var flags = {},
		b, k;

	while ( element ) {

		b = $.data( element, dataPropertyName );

		for (  k in b ) {
			if ( b[ k ] ) {
				flags[ k ] = flags.hasVirtualBinding = true;
			}
		}
		element = element.parentNode;
	}
	return flags;
}

function getClosestElementWithVirtualBinding( element, eventType ) {
	var b;
	while ( element ) {

		b = $.data( element, dataPropertyName );

		if ( b && ( !eventType || b[ eventType ] ) ) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

function enableTouchBindings() {
	blockTouchTriggers = false;
}

function disableTouchBindings() {
	blockTouchTriggers = true;
}

function enableMouseBindings() {
	lastTouchID = 0;
	clickBlockList.length = 0;
	blockMouseTriggers = false;

	// When mouse bindings are enabled, our
	// touch bindings are disabled.
	disableTouchBindings();
}

function disableMouseBindings() {
	// When mouse bindings are disabled, our
	// touch bindings are enabled.
	enableTouchBindings();
}

function startResetTimer() {
	clearResetTimer();
	resetTimerID = setTimeout( function() {
		resetTimerID = 0;
		enableMouseBindings();
	}, $.vmouse.resetTimerDuration );
}

function clearResetTimer() {
	if ( resetTimerID ) {
		clearTimeout( resetTimerID );
		resetTimerID = 0;
	}
}

function triggerVirtualEvent( eventType, event, flags ) {
	var ve;

	if ( ( flags && flags[ eventType ] ) ||
				( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

		ve = createVirtualEvent( event, eventType );

		$( event.target).trigger( ve );
	}

	return ve;
}

function mouseEventCallback( event ) {
	var touchID = $.data( event.target, touchTargetPropertyName );

	if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ) {
		var ve = triggerVirtualEvent( "v" + event.type, event );
		if ( ve ) {
			if ( ve.isDefaultPrevented() ) {
				event.preventDefault();
			}
			if ( ve.isPropagationStopped() ) {
				event.stopPropagation();
			}
			if ( ve.isImmediatePropagationStopped() ) {
				event.stopImmediatePropagation();
			}
		}
	}
}

function handleTouchStart( event ) {

	var touches = getNativeEvent( event ).touches,
		target, flags;

	if ( touches && touches.length === 1 ) {

		target = event.target;
		flags = getVirtualBindingFlags( target );

		if ( flags.hasVirtualBinding ) {

			lastTouchID = nextTouchID++;
			$.data( target, touchTargetPropertyName, lastTouchID );

			clearResetTimer();

			disableMouseBindings();
			didScroll = false;

			var t = getNativeEvent( event ).touches[ 0 ];
			startX = t.pageX;
			startY = t.pageY;

			triggerVirtualEvent( "vmouseover", event, flags );
			triggerVirtualEvent( "vmousedown", event, flags );
		}
	}
}

function handleScroll( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	if ( !didScroll ) {
		triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
	}

	didScroll = true;
	startResetTimer();
}

function handleTouchMove( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	var t = getNativeEvent( event ).touches[ 0 ],
		didCancel = didScroll,
		moveThreshold = $.vmouse.moveDistanceThreshold,
		flags = getVirtualBindingFlags( event.target );

		didScroll = didScroll ||
			( Math.abs( t.pageX - startX ) > moveThreshold ||
				Math.abs( t.pageY - startY ) > moveThreshold );


	if ( didScroll && !didCancel ) {
		triggerVirtualEvent( "vmousecancel", event, flags );
	}

	triggerVirtualEvent( "vmousemove", event, flags );
	startResetTimer();
}

function handleTouchEnd( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	disableTouchBindings();

	var flags = getVirtualBindingFlags( event.target ),
		t;
	triggerVirtualEvent( "vmouseup", event, flags );

	if ( !didScroll ) {
		var ve = triggerVirtualEvent( "vclick", event, flags );
		if ( ve && ve.isDefaultPrevented() ) {
			// The target of the mouse events that follow the touchend
			// event don't necessarily match the target used during the
			// touch. This means we need to rely on coordinates for blocking
			// any click that is generated.
			t = getNativeEvent( event ).changedTouches[ 0 ];
			clickBlockList.push({
				touchID: lastTouchID,
				x: t.clientX,
				y: t.clientY
			});

			// Prevent any mouse events that follow from triggering
			// virtual event notifications.
			blockMouseTriggers = true;
		}
	}
	triggerVirtualEvent( "vmouseout", event, flags);
	didScroll = false;

	startResetTimer();
}

function hasVirtualBindings( ele ) {
	var bindings = $.data( ele, dataPropertyName ),
		k;

	if ( bindings ) {
		for ( k in bindings ) {
			if ( bindings[ k ] ) {
				return true;
			}
		}
	}
	return false;
}

function dummyMouseHandler() {}

function getSpecialEventObject( eventType ) {
	var realType = eventType.substr( 1 );

	return {
		setup: function( data, namespace ) {
			// If this is the first virtual mouse binding for this element,
			// add a bindings object to its data.

			if ( !hasVirtualBindings( this ) ) {
				$.data( this, dataPropertyName, {} );
			}

			// If setup is called, we know it is the first binding for this
			// eventType, so initialize the count for the eventType to zero.
			var bindings = $.data( this, dataPropertyName );
			bindings[ eventType ] = true;

			// If this is the first virtual mouse event for this type,
			// register a global handler on the document.

			activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

			if ( activeDocHandlers[ eventType ] === 1 ) {
				$document.bind( realType, mouseEventCallback );
			}

			// Some browsers, like Opera Mini, won't dispatch mouse/click events
			// for elements unless they actually have handlers registered on them.
			// To get around this, we register dummy handlers on the elements.

			$( this ).bind( realType, dummyMouseHandler );

			// For now, if event capture is not supported, we rely on mouse handlers.
			if ( eventCaptureSupported ) {
				// If this is the first virtual mouse binding for the document,
				// register our touchstart handler on the document.

				activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

				if ( activeDocHandlers[ "touchstart" ] === 1 ) {
					$document.bind( "touchstart", handleTouchStart )
						.bind( "touchend", handleTouchEnd )

						// On touch platforms, touching the screen and then dragging your finger
						// causes the window content to scroll after some distance threshold is
						// exceeded. On these platforms, a scroll prevents a click event from being
						// dispatched, and on some platforms, even the touchend is suppressed. To
						// mimic the suppression of the click event, we need to watch for a scroll
						// event. Unfortunately, some platforms like iOS don't dispatch scroll
						// events until *AFTER* the user lifts their finger (touchend). This means
						// we need to watch both scroll and touchmove events to figure out whether
						// or not a scroll happenens before the touchend event is fired.

						.bind( "touchmove", handleTouchMove )
						.bind( "scroll", handleScroll );
				}
			}
		},

		teardown: function( data, namespace ) {
			// If this is the last virtual binding for this eventType,
			// remove its global handler from the document.

			--activeDocHandlers[ eventType ];

			if ( !activeDocHandlers[ eventType ] ) {
				$document.unbind( realType, mouseEventCallback );
			}

			if ( eventCaptureSupported ) {
				// If this is the last virtual mouse binding in existence,
				// remove our document touchstart listener.

				--activeDocHandlers[ "touchstart" ];

				if ( !activeDocHandlers[ "touchstart" ] ) {
					$document.unbind( "touchstart", handleTouchStart )
						.unbind( "touchmove", handleTouchMove )
						.unbind( "touchend", handleTouchEnd )
						.unbind( "scroll", handleScroll );
				}
			}

			var $this = $( this ),
				bindings = $.data( this, dataPropertyName );

			// teardown may be called when an element was
			// removed from the DOM. If this is the case,
			// jQuery core may have already stripped the element
			// of any data bindings so we need to check it before
			// using it.
			if ( bindings ) {
				bindings[ eventType ] = false;
			}

			// Unregister the dummy event handler.

			$this.unbind( realType, dummyMouseHandler );

			// If this is the last virtual mouse binding on the
			// element, remove the binding data from the element.

			if ( !hasVirtualBindings( this ) ) {
				$this.removeData( dataPropertyName );
			}
		}
	};
}

// Expose our custom events to the jQuery bind/unbind mechanism.

for ( var i = 0; i < virtualEventNames.length; i++ ) {
	$.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
}

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
if ( eventCaptureSupported ) {
	document.addEventListener( "click", function( e ) {
		var cnt = clickBlockList.length,
			target = e.target,
			x, y, ele, i, o, touchID;

		if ( cnt ) {
			x = e.clientX;
			y = e.clientY;
			threshold = $.vmouse.clickDistanceThreshold;

			// The idea here is to run through the clickBlockList to see if
			// the current click event is in the proximity of one of our
			// vclick events that had preventDefault() called on it. If we find
			// one, then we block the click.
			//
			// Why do we have to rely on proximity?
			//
			// Because the target of the touch event that triggered the vclick
			// can be different from the target of the click event synthesized
			// by the browser. The target of a mouse/click event that is syntehsized
			// from a touch event seems to be implementation specific. For example,
			// some browsers will fire mouse/click events for a link that is near
			// a touch event, even though the target of the touchstart/touchend event
			// says the user touched outside the link. Also, it seems that with most
			// browsers, the target of the mouse/click event is not calculated until the
			// time it is dispatched, so if you replace an element that you touched
			// with another element, the target of the mouse/click will be the new
			// element underneath that point.
			//
			// Aside from proximity, we also check to see if the target and any
			// of its ancestors were the ones that blocked a click. This is necessary
			// because of the strange mouse/click target calculation done in the
			// Android 2.1 browser, where if you click on an element, and there is a
			// mouse/click handler on one of its ancestors, the target will be the
			// innermost child of the touched element, even if that child is no where
			// near the point of touch.

			ele = target;

			while ( ele ) {
				for ( i = 0; i < cnt; i++ ) {
					o = clickBlockList[ i ];
					touchID = 0;

					if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
								$.data( ele, touchTargetPropertyName ) === o.touchID ) {
						// XXX: We may want to consider removing matches from the block list
						//      instead of waiting for the reset timer to fire.
						e.preventDefault();
						e.stopPropagation();
						return;
					}
				}
				ele = ele.parentNode;
			}
		}
	}, true);
}
})( jQuery, window, document );


(function( $, window, undefined ) {
	var $document = $( document );

	// add new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"tap taphold " +
		"swipe swipeleft swiperight " +
		"scrollstart scrollstop" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	var supportTouch = $.mobile.support.touch,
		scrollEvent = "touchmove scroll",
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

	function triggerCustomEvent( obj, eventType, event ) {
		var originalType = event.type;
		event.type = eventType;
		$.event.dispatch.call( obj, event );
		event.type = originalType;
	}

	// also handles scrollstop
	$.event.special.scrollstart = {

		enabled: true,

		setup: function() {

			var thisObject = this,
				$this = $( thisObject ),
				scrolling,
				timer;

			function trigger( event, state ) {
				scrolling = state;
				triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind( scrollEvent, function( event ) {

				if ( !$.event.special.scrollstart.enabled ) {
					return;
				}

				if ( !scrolling ) {
					trigger( event, true );
				}

				clearTimeout( timer );
				timer = setTimeout( function() {
					trigger( event, false );
				}, 50 );
			});
		}
	};

	// also handles taphold
	$.event.special.tap = {
		tapholdThreshold: 750,

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( "vmousedown", function( event ) {

				if ( event.which && event.which !== 1 ) {
					return false;
				}

				var origTarget = event.target,
					origEvent = event.originalEvent,
					timer;

				function clearTapTimer() {
					clearTimeout( timer );
				}

				function clearTapHandlers() {
					clearTapTimer();

					$this.unbind( "vclick", clickHandler )
						.unbind( "vmouseup", clearTapTimer );
					$document.unbind( "vmousecancel", clearTapHandlers );
				}

				function clickHandler( event ) {
					clearTapHandlers();

					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if ( origTarget === event.target ) {
						triggerCustomEvent( thisObject, "tap", event );
					}
				}

				$this.bind( "vmouseup", clearTapTimer )
					.bind( "vclick", clickHandler );
				$document.bind( "vmousecancel", clearTapHandlers );

				timer = setTimeout( function() {
					triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
				}, $.event.special.tap.tapholdThreshold );
			});
		}
	};

	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

		durationThreshold: 1000, // More time than this, and it isn't a swipe.

		horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

		verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ]
					};
		},

		handleSwipe: function( start, stop ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

				start.origin.trigger( "swipe" )
					.trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
			}
		},

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( touchStartEvent, function( event ) {
				var start = $.event.special.swipe.start( event ),
					stop;

				function moveHandler( event ) {
					if ( !start ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );

					// prevent scrolling
					if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
						event.preventDefault();
					}
				}

				$this.bind( touchMoveEvent, moveHandler )
					.one( touchStopEvent, function() {
						$this.unbind( touchMoveEvent, moveHandler );

						if ( start && stop ) {
							$.event.special.swipe.handleSwipe( start, stop );
						}
						start = stop = undefined;
					});
			});
		}
	};
	$.each({
		scrollstop: "scrollstart",
		taphold: "tap",
		swipeleft: "swipe",
		swiperight: "swipe"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			}
		};
	});

})( jQuery, this );


}));


(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.storage');


	test('get/set/delete item', function() {




		kafe.storage.setPersistentItem('TEST', 'alpha');
		strictEqual( kafe.storage.getPersistentItem('TEST'), 'alpha', 'get/set PersistentItem' );
		kafe.storage.removePersistentItem('TEST');
		strictEqual( kafe.storage.getPersistentItem('TEST'), undefined, 'delete PersistentItem' );

	});


	/*
	storage.getPersistentItem
	storage.getSessionItem

	storage.setPersistentItem
	storage.setSessionItem

	storage.removePersistentItem
	storage.removeSessionItem



	storage.getPersistentNamespaceKeys
	storage.getSessionNamespaceKeys

	storage.getPersistentNamespaceItems
	storage.getSessionNamespaceItems

	storage.removePersistentNamespace
	storage.removeSessionNamespace

	storage.getAllPersistentKeys
	storage.getAllSessionKeys



	storage.getAllPersistentItems
	storage.getAllSessionItems

	storage.removeAllPersistent
	storage.removeAllSession

	storage.getJSON = function() {
	*/

})(window.kafe);

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string');


	test('removeAccent()', function() {
		var removeAccent = function(string,expected) {
			strictEqual( kafe.string.removeAccent( string ), expected, string );
		};
		removeAccent("Maman li pas là l'allée la rivière / Papa li pas là l'allé pêcher l'crab",                 "Maman li pas la l'allee la riviere / Papa li pas la l'alle pecher l'crab");
		removeAccent("Des sapins bleus / Des érables mouillés / Ont pleuré tous ces gens / Qui s'aimèrent tant", "Des sapins bleus / Des erables mouilles / Ont pleure tous ces gens / Qui s'aimerent tant");
		removeAccent("Traverser le présent en s'excusant déjà de n'être pas plus loin",                          "Traverser le present en s'excusant deja de n'etre pas plus loin");
		removeAccent("Quand un trophée est plus facile à gagner qu'à soulever, il y a un problème.",             "Quand un trophee est plus facile a gagner qu'a soulever, il y a un probleme.");
		removeAccent("Tacîtié bibéndum nullä mié Frînglilia nullä, àc congés aptenté namé",                      "Tacitie bibendum nulla mie Fringlilia nulla, ac conges aptente name");
		removeAccent("àáâãäåÀÁÂÃÄÅæÆçÇèéêëÈÉÊËìíîïÌÍÎÏñÑòóôõöÒÓÔÕÖœŒùúûüÙÚÛÜýÿÝŸ",                               "aaaaaaAAAAAAaeAEcCeeeeEEEEiiiiIIIInNoooooOOOOOoeOEuuuuUUUUyyYY");
	});


	test('toObject()', function() {
		var toObject = function(string,expected) {
			deepEqual( kafe.string.toObject( string ), expected, string );
		};

		toObject(
			'{'+
				'"str1":"lorem ipsum",'+
				'"str2":"123456",'+
				'"bool1":true,'+
				'"bool2":false,'+
				'"num1":11,'+
				'"num2":11.11,'+
				'"obj":{"a":1,"b":2,"c":{"d":4,"e":5,"f":6}},'+
				'"date":"2013-01-01T05:00:00.000Z",'+
				'"arr":["alpha","beta","gamma",1,2,3.33,"2013-01-01T05:00:00.000Z",true,false,{"a":1,"b":2,"c":3}]'+
			'}',
			{
				str1: 'lorem ipsum',
				str2: '123456',
				bool1: true,
				bool2: false,
				num1:  11,
				num2:  11.11,
				obj:   { a:1, b:2, c:{ d:4, e:5, f:6 } },
				date:  new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)'),
				arr:   ['alpha', 'beta', 'gamma', 1, 2, 3.33, new Date('Tue Jan 01 2013 00:00:00 GMT-0500 (EST)'), true, false, { a:1, b:2, c:3 }]
			}
		);
	});


	test('generateGuid()', function() {
		var generateGuid = function() {
			var guid = kafe.string.generateGuid();
			ok( /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-(:?[89ab])[a-f0-9]{3}-[a-f0-9]{12}/.test(guid), guid );
		};

		for (var i=0; i<10; ++i) {
			generateGuid();
		}
	});

})(window.kafe);

window.kafe.bonify({name:'string.encrypt', version:'1.0', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.0
	* String encryption tools.
	*
	* @module kafe
	* @class kafe.string.encrypt
	* @extensionfor kafe.string
	*/
	var encrypt = {};

	/**
	* Encrypts a given string to md5.
	*
	* @method md5
	* @param {String} string
	* @return {String} The encrypted value.
	* @example
	*	kafe.string.encrypt.md5('kafe is awesome.');
	*	// returns "1fc5f96ff478b0c37baaf27506063603"
	*/
	encrypt.md5 = function (string) {

		// http://www.webtoolkit.info/
		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		}

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp='',lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = '0' + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,'\n');
			var utftext = '';

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		}

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	};


	return encrypt;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string.encrypt');


	test('md5()', function() {
		var md5 = function(string,expected) {
			strictEqual( kafe.string.encrypt.md5( string ), expected, string );
		};
		md5("Do you mean this horny creep / Set upon weary feet / Who looks in need of sleep / That doesn't come",  'b0ec2ff6ccd86b5a274e477e73e9a546');
		md5("Wir werden beobachtet / Und wir spuhren unserem Puls / Wir sind Schaufensterpuppen",                   '84c3f8f7966c917ec38c3ad21888fde0');
		md5("I am just a shadow of a shadow of a shadow / Always trying to catch up with myself",                   'f811a12e02455baa18562f245efe7ea2');
		md5("Nunc auctor iaculis magna, eu aliquam augue posuere nec, ellentesque bibendum enim nec ligula mattis", '4f655a9f744877676118ddcd40f5dafe');
	});


})(window.kafe);

window.kafe.bonify({name:'string.validate', version:'1.0', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	/**
	* ### Version 1.0
	* String validation tools.
	*
	* @module kafe
	* @class kafe.string.validate
	* @extensionfor kafe.string
	*/
	var validate = {};

	/**
	* Checks if a string is numeric.
	*
	* @method isNum
	* @param {String} string
	* @return {Boolean} If true, the string could be converted to a number.
	* @example
	*	kafe.string.validate.isNum('k4f3');
	*	// returns false
	* @example
	*	kafe.string.validate.isNum('43');
	*	// returns true
	*/
	validate.isNum = function(str) {
		return (str === Number(str).toString());
	};


	/**
	* Checks if a string is a valid email address.
	*
	* @method isEmail
	* @param {String} string
	* @return {Boolean} If true, the string is a valid email address.
	* @example
	*	kafe.string.validate.isEmail('mailbox@mailaddress');
	*	// returns false
	* @example
	*	kafe.string.validate.isEmail('kafe.feedback@absolunet.com');
	*	// returns true
	*/
	validate.isEmail = function(str) {
		str = str.replace(/^\s*|\s*$/g, '');
		str = str.replace(/^\t*|\t*$/g, '');
		return (/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str));
	};


	/**
	* Checks if a string is a valid or part of a valid Canadian postal code.
	*
	* @method isPostalCode
	* @param {String} string
	* @param {String} [format] Validation pattern (Regular expression). Default pattern is *([a-z][0-9]){3}*. Can also be set to *A1A 1A1* for a single precise value or as *A1A* and *1A1* when divided into two values.
	* @return {Boolean} If true, the string matches the validation format.
	* @example
	*	kafe.string.validate.isPostalCode('KAF123');
	*	// returns false
	* @example
	*	kafe.string.validate.isPostalCode('K4F 3F3', 'A1A 1A1');
	*	// returns true
	*/
	validate.isPostalCode = function(str,format) {
		switch (format) {
			case 'A1A 1A1': format='[a-z][0-9][a-z] [0-9][a-z][0-9]'; break;
			case 'A1A':     format='[a-z][0-9][a-z]';                 break;
			case '1A1':     format='[0-9][a-z][0-9]';                 break;
			default:        format='([a-z][0-9]){3}';                 break;
		}
		return new RegExp('^'+format+'$','i').test(str);
	};


	/**
	* Checks if a string passes the Luhn algorithm.
	*
	* Source: [https://gist.github.com/2134376](https://gist.github.com/2134376)
	* Source: [http://jsperf.com/credit-card-validator/7](http://jsperf.com/credit-card-validator/7)
	*
	* @method isLuhnAlgorithm
	* @param {String} string
	* @return {Boolean} If true, the string passes the Luhn algorithm.
	* @example
	*	kafe.string.validate.isLuhn('79927398713');
	*	// returns true
	*/
	validate.isLuhnAlgorithm = function(str) {
		var
			len     = str.length,
			mul     = 0,
			prodArr = [[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],
			sum     = 0
		;

		while (len--) {
			sum += prodArr[mul][parseInt(str.charAt(len), 10)];
			mul ^= 1;
		}

		return sum % 10 === 0 && sum > 0;
	};


	/**
	* Checks if a string is a valid credit card number and fits a specific brand pattern.
	* 
	* Source: [http://www.regular-expressions.info/creditcard.html](http://www.regular-expressions.info/creditcard.html)
	*
	* @method isCreditCard
	* @param {String} string
	* @param {String} creditcard A credit card brand abbreviation. Possible values are **visa**, **mastercard**, **americanexpress**, **dinersclub**, **discover**, **jcb**.
	* @return {Boolean} If true, the string is a valid credit card number.
	* @example
	*	kafe.string.validate.isCreditCard('k789 kafe 3789', 'mc');
	*	// returns false
	* @example
	*	kafe.string.validate.isCreditCard('1234 5678 1234 5678', 'vi');
	*	// returns true
	*/
	validate.isCreditCard = function(str,cc) {
		str = str.replace(/[\s\-]/g, '');

		var pattern = {
			visa:            '4[0-9]{12}([0-9]{3})?',
			mastercard:      '5[1-5][0-9]{14}',
			americanexpress: '3[47][0-9]{13}',
			dinersclub:      '3(?:0[0-5]|[68][0-9])[0-9]{11}',
			discover:        '6(?:011|5[0-9]{2})[0-9]{12}'
		};

		return validate.isLuhnAlgorithm(str) && new RegExp('^'+pattern[cc]+'$','i').test(str);
	};


	return validate;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.string.validate');


	test('isNum()', function() {
		var isNum = function(string,expected) {
			strictEqual( kafe.string.validate.isNum( string ), expected, string );
		};
		isNum('0',     true);
		isNum('1',     true);
		isNum('-1',    true);
		isNum('33.33', true);
		isNum('33,33', false);
		isNum('4a4',   false);
		isNum('z',     false);
		isNum('0x8',   false);
	});


	test('isEmail()', function() {
		var isEmail = function(string,expected) {
			strictEqual( kafe.string.validate.isEmail( string ), expected, string );
		};
		isEmail('me@example.com',         true);
		isEmail('a.nonymous@example.com', true);
		isEmail('name+tag@example.com',   true);
		isEmail('a.name+tag@example.com', true);
		isEmail('me@',                    false);
		isEmail('@example.com',           false);
		isEmail('me.@example.com',        false);
		isEmail('.me@example.com',        false);
		isEmail('me@example..com',        false);
		isEmail('me.example@com',         false);
	});


	test('isPostalCode()', function() {
		var isPostalCode = function(string,expected) {
			for (var i in expected) {
				strictEqual( kafe.string.validate.isPostalCode( string, i ), expected[i], string+' / '+i );
			}
		};
		isPostalCode('Z9Z 9Z9', {'A1A 1A1':true,  'A1A':false, '1A1':false, 'default':false});
		isPostalCode('9Z9 Z9Z', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('ZZZ ZZZ', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999 999', {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('Z9Z9Z9',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':true });
		isPostalCode('9Z9Z9Z',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('ZZZZZZ',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999999',  {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('Z9Z',     {'A1A 1A1':false, 'A1A':true,  '1A1':false, 'default':false});
		isPostalCode('9Z9',     {'A1A 1A1':false, 'A1A':false, '1A1':true,  'default':false});
		isPostalCode('ZZZ',     {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
		isPostalCode('999',     {'A1A 1A1':false, 'A1A':false, '1A1':false, 'default':false});
	});


	test('isLuhnAlgorithm()', function() {
		var isLuhnAlgorithm = function(string,expected) {
			strictEqual( kafe.string.validate.isLuhnAlgorithm( string ), expected, string );
		};
		isLuhnAlgorithm('79927398713',      true);
		isLuhnAlgorithm('4818071690396457', true);
		isLuhnAlgorithm('370197397289881',  true);
		isLuhnAlgorithm('7992739871',       false);
		isLuhnAlgorithm('481807169039645',  false);
		isLuhnAlgorithm('37019739728988',   false);
	});


	test('isCreditCard()', function() {
		var isCreditCard = function(string,cc) {
			ok( kafe.string.validate.isCreditCard( string, cc ), string+' / '+cc );
		};

		isCreditCard('40-24 00-71 12-58 93-52', 'visa');

		isCreditCard('4348777735457539', 'visa');
		isCreditCard('4539714067819',    'visa');
		isCreditCard('4122853720464129', 'visa');
		isCreditCard('4716473808464',    'visa');
		isCreditCard('4916918495155069', 'visa');
		isCreditCard('4716473808464',    'visa');

		isCreditCard('5114000761374752', 'mastercard');
		isCreditCard('5411928162908648', 'mastercard');
		isCreditCard('5470472264268674', 'mastercard');
		isCreditCard('5581229236487709', 'mastercard');
		isCreditCard('5260877406810312', 'mastercard');
		isCreditCard('5157155621837790', 'mastercard');

		isCreditCard('347584604671607', 'americanexpress');
		isCreditCard('370455448657203', 'americanexpress');
		isCreditCard('371730591569697', 'americanexpress');
		isCreditCard('379096961119477', 'americanexpress');
		isCreditCard('372089802856891', 'americanexpress');
		isCreditCard('344746586751979', 'americanexpress');

		isCreditCard('30109992783525', 'dinersclub');
		isCreditCard('36514055375362', 'dinersclub');
		isCreditCard('30269487993300', 'dinersclub');
		isCreditCard('30269487993300', 'dinersclub');
		isCreditCard('38136707585285', 'dinersclub');
		isCreditCard('30143446918445', 'dinersclub');

		isCreditCard('6011330290543144', 'discover');
		isCreditCard('6011085862588535', 'discover');
		isCreditCard('6011099399595855', 'discover');
		isCreditCard('6011350784362959', 'discover');
		isCreditCard('6011814358443644', 'discover');
		isCreditCard('6011444663853442', 'discover');
	});

})(window.kafe);
window.kafe.bonify({name:'url', version:'1.0', obj:(function(kafe,undefined){

	var $ = kafe.dependencies.jQuery;

	var
		// parse url
		_parseIt = function(str,type) {
			switch (type) {
				case 'params':
					var
						data  = {},
						pairs = str.toString().split('&')
					;
					for (var i in pairs) {
						var e = pairs[i].toString().split('=');
						data[e[0]] = decodeURI(e[1]);
					}
					return data;

				case 'path':
					return str.toString().split('/');
			}
		}
	;


	/**
	* ### Version 1.0
	* Manipulation tools for route-based urls.
	*
	* @module kafe
	* @class kafe.url
	*/
	var url = {};

	/**
	* Parses a querystring as a key/value list and creates a javascript object.
	*
	* @method parseSearchParams
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Object} An object represention of the querystring.
	* @example
	*	kafe.url.parseSearchParams('?group=players&team=blue&ranking=3');
	*	// returns Object {group: "players", team: "blue", ranking: "3"}
	*/
	url.parseSearchParams = function(s) {
		s = (s) ? s : window.location.search;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a querystring as a path and creates an ordered array.
	*
	* @method parseSearchPath
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Array(String)} An array represention of the querystring path.
	* @example
	*	kafe.url.parseSearchPath('?/Players/Teams/Blue');
	*	// returns ["Players", "Teams", "Blue"]
	*/
	url.parseSearchPath = function(s) {
		s = (s) ? s : window.location.search;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hash string as a key/value list and creates a javascript object.
	*
	* @method parseHashParams
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hash string.
	* @example
	*	kafe.url.parseHashParams('#color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseHashParams = function(s) {
		s = (s) ? s : window.location.hash;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a hash string as a path and creates an ordered array.
	*
	* @method parseHashPath
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hash path.
	* @example
	*	kafe.url.parseHashPath('#/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseHashPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hashbang (#!) as a key/value list and creates a javascript object.
	*
	* @method parseAjaxParams
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hashbang.
	* @example
	*	kafe.url.parseAjaxParams('#!color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseAjaxParams = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,2) == '!') ? _parseIt(s.toString().substring(2), 'params') : {};
	};


	/**
	* Parses a hashbang (#!) as a path and creates an ordered array.
	*
	* @method parseAjaxPath
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hashbang path.
	* @example
	*	kafe.url.parseAjaxPath('#!/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseAjaxPath = function(s) {
		s = (s) ? s : window.location.hash;
		return (s.toString().substring(1,3) == '!/') ? _parseIt(s.toString().substring(3), 'path') : [];
	};


	return url;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.url');


	test('parseSearchParams()', function() {
		var parseSearchParams = function(string,expected) {
			deepEqual( kafe.url.parseSearchParams( string ), expected, string );
		};
		parseSearchParams('?group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseSearchPath()', function() {
		var parseSearchPath = function(string,expected) {
			deepEqual( kafe.url.parseSearchPath( string ), expected, string );
		};
		parseSearchPath('?/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


	test('parseHashParams()', function() {
		var parseHashParams = function(string,expected) {
			deepEqual( kafe.url.parseHashParams( string ), expected, string );
		};
		parseHashParams('#group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseHashPath()', function() {
		var parseHashPath = function(string,expected) {
			deepEqual( kafe.url.parseHashPath( string ), expected, string );
		};
		parseHashPath('#/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


	test('parseAjaxParams()', function() {
		var parseAjaxParams = function(string,expected) {
			deepEqual( kafe.url.parseAjaxParams( string ), expected, string );
		};
		parseAjaxParams('#!group=players&team=blue&ranking=3', {group:'players', team:'blue', ranking:'3'});
	});


	test('parseAjaxPath()', function() {
		var parseAjaxPath = function(string,expected) {
			deepEqual( kafe.url.parseAjaxPath( string ), expected, string );
		};
		parseAjaxPath('#!/Players/Teams/Blue', ['Players', 'Teams', 'Blue']);
	});


})(window.kafe);