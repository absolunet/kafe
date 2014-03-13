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
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.6.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to compose bitmasks for wrapper metadata */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_FLAG = 4,
      CURRY_BOUND_FLAG = 8,
      PARTIAL_FLAG = 16,
      PARTIAL_RIGHT_FLAG = 32;

  /** Used as the semantic version number */
  var version = '2.4.1';

  /** Used as the property name for wrapper metadata */
  var expando = '__lodash@' + version + '__';

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g;

  /** Used to match template delimiters */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect hexadecimal string values */
  var reHexPrefix = /^0[xX]/;

  /** Used to match latin-1 supplement letters */
  var reLatin1 = /[\xC0-\xFF]/g;

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /**
   * Used to match RegExp special characters.
   * See this [article on RegExp characters](http://www.regular-expressions.info/characters.html#special)
   * for more details.
   */
  var reRegExpChars = /[.*+?^${}()|[\]\\]/g;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to match words to create compound words */
  var reWords = /[A-Z]{2,}|[a-zA-Z0-9][a-z0-9]*/g;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'Set', 'String', '_', 'clearTimeout', 'document', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout', 'TypeError', 'window', 'WinRTError'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object by `_.throttle` */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for wrapper metadata */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /**
   * Used to convert characters to HTML entities.
   *
   * Note: Though the ">" character is escaped for symmetry, characters like
   * ">", "`", and "/" don't require escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value.
   * See [Mathias' article](http://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to convert HTML entities to characters */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /**
   * Used to convert latin-1 supplement letters to basic latin (ASCII) letters.
   * See [Wikipedia](http://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
   * for more details.
   */
  var deburredLetters = {
    '\xC0': 'A',  '\xC1': 'A', '\xC2': 'A', '\xC3': 'A', '\xC4': 'A', '\xC5': 'A',
    '\xE0': 'a',  '\xE1': 'a', '\xE2': 'a', '\xE3': 'a', '\xE4': 'a', '\xE5': 'a',
    '\xC7': 'C',  '\xE7': 'c',
    '\xD0': 'D',  '\xF0': 'd',
    '\xC8': 'E',  '\xC9': 'E', '\xCA': 'E', '\xCB': 'E',
    '\xE8': 'e',  '\xE9': 'e', '\xEA': 'e', '\xEB': 'e',
    '\xCC': 'I',  '\xCD': 'I', '\xCE': 'I', '\xCF': 'I',
    '\xEC': 'i',  '\xED': 'i', '\xEE': 'i', '\xEF': 'i',
    '\xD1': 'N',  '\xF1': 'n',
    '\xD2': 'O',  '\xD3': 'O', '\xD4': 'O', '\xD5': 'O', '\xD6': 'O', '\xD8': 'O',
    '\xF2': 'o',  '\xF3': 'o', '\xF4': 'o', '\xF5': 'o', '\xF6': 'o', '\xF8': 'o',
    '\xD9': 'U',  '\xDA': 'U', '\xDB': 'U', '\xDC': 'U',
    '\xF9': 'u',  '\xFA': 'u', '\xFB': 'u', '\xFC': 'u',
    '\xDD': 'Y',  '\xFD': 'y', '\xFF': 'y',
    '\xC6': 'AE', '\xE6': 'ae',
    '\xDE': 'Th', '\xFE': 'th',
    '\xDF': 'ss', '\xD7': ' ', '\xF7': ' '
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /*--------------------------------------------------------------------------*/

  /**
   * Used by `_.defaults` to customize its `_.assign` use.
   *
   * @private
   * @param {*} objectValue The destination object property value.
   * @param {*} sourceValue The source object property value.
   * @returns {*} Returns the value to assign to the destination object.
   */
  function assignDefaults(objectValue, sourceValue) {
    return typeof objectValue == 'undefined' ? sourceValue : objectValue;
  }

  /**
   * The base implementation of `compareAscending` used to compare values and
   * sort them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} a The value to compare to `b`.
   * @param {*} b The value to compare to `a`.
   * @returns {number} Returns the sort order indicator for `a`.
   */
  function baseCompareAscending(a, b) {
    if (a !== b) {
      if (a > b || typeof a == 'undefined') {
        return 1;
      }
      if (a < b || typeof b == 'undefined') {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex | 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    return cache.has(value) ? 0 : -1;
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of the given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Gets the index of the first character of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length) {
      if (chars.indexOf(string.charAt(index)) < 0) {
        break;
      }
    }
    return index;
  }

  /**
   * Gets the index of the last character of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;
    while (index--) {
      if (chars.indexOf(string.charAt(index)) < 0) {
        break;
      }
    }
    return index;
  }

  /**
   * Used by `sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator for `a`.
   */
  function compareAscending(a, b) {
    return baseCompareAscending(a.criteria, b.criteria) || a.index - b.index;
  }

  /**
   * Used by `sortBy` to compare multiple properties of each element in a
   * collection and stable sort them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator for `a`.
   */
  function compareMultipleAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var result = baseCompareAscending(ac[index], bc[index]);
      if (result) {
        return result;
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provided the same value
    // for `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a function that produces compound words out of the words in a
   * given string.
   *
   * @private
   * @param {Function} callback The function called to combine each word.
   * @returns {Function} Returns the new compounder function.
   */
  function createCompounder(callback) {
    return function(string) {
      var index = -1,
          words = string != null && String(string).replace(reLatin1, deburrLetter).match(reWords),
          length = words ? words.length : 0,
          result = '';

      while (++index < length) {
        result = callback(result, words[index], index, words);
      }
      return result;
    };
  }

  /**
   * Used by `createCompounder` to convert latin-1 supplement letters to basic
   * latin (ASCII) letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * A fallback implementation of `trim` to remove leading and trailing
   * whitespace or specified characters from `string`.
   *
   * @private
   * @param {string} string The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @returns {string} Returns the trimmed string.
   */
  function shimTrim(string, chars) {
    string = string == null ? '' : String(string);
    if (!string) {
      return string;
    }
    if (chars == null) {
      return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
    }
    chars = String(chars);
    return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
  }

  /**
   * A fallback implementation of `trimLeft` to remove leading whitespace or
   * specified characters from `string`.
   *
   * @private
   * @param {string} string The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @returns {string} Returns the trimmed string.
   */
  function shimTrimLeft(string, chars) {
    string = string == null ? '' : String(string);
    if (!string) {
      return string;
    }
    if (chars == null) {
      return string.slice(trimmedLeftIndex(string))
    }
    chars = String(chars);
    return string.slice(charsLeftIndex(string, chars));
  }

  /**
   * A fallback implementation of `trimRight` to remove trailing whitespace or
   * specified characters from `string`.
   *
   * @private
   * @param {string} string The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @returns {string} Returns the trimmed string.
   */
  function shimTrimRight(string, chars) {
    string = string == null ? '' : String(string);
    if (!string) {
      return string;
    }
    if (chars == null) {
      return string.slice(0, trimmedRightIndex(string) + 1)
    }
    chars = String(chars);
    return string.slice(0, charsRightIndex(string, chars) + 1);
  }

  /**
   * Gets the index of the first non-whitespace character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length) {
      var c = string.charCodeAt(index);
      if (!((c <= 160 && (c >= 9 && c <= 13) || c == 32 || c == 160) || c == 5760 || c == 6158 ||
          (c >= 8192 && (c <= 8202 || c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288 || c == 65279)))) {
        break;
      }
    }
    return index;
  }

  /**
   * Gets the index of the last non-whitespace character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;
    while (index--) {
      var c = string.charCodeAt(index);
      if (!((c <= 160 && (c >= 9 && c <= 13) || c == 32 || c == 160) || c == 5760 || c == 6158 ||
          (c >= 8192 && (c <= 8202 || c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288 || c == 65279)))) {
        break;
      }
    }
    return index;
  }

  /**
   * Used by `unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references */
    var arrayRef = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to detect DOM support */
    var document = (document = context.window) && document.document;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      escapeRegExp(toString)
      .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        Set = isNative(Set = context.Set) && Set,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeContains = isNative(nativeContains = stringProto.contains) && nativeContains,
        nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = isNative(nativeNow = Date.now) && nativeNow,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeTrim = isNative(nativeTrim = stringProto.trim) && !nativeTrim.call(whitespace) && nativeTrim,
        nativeTrimLeft = isNative(nativeTrimLeft = stringProto.trimLeft) && !nativeTrimLeft.call(whitespace) && nativeTrimLeft,
        nativeTrimRight = isNative(nativeTrimRight = stringProto.trimRight) && !nativeTrimRight.call(whitespace) && nativeTrimRight;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `at`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `constant`, `countBy`, `create`, `createCallback`,
     * `curry`, `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`,
     * `flatten`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`,
     * `forOwnRight`, `functions`, `groupBy`, `indexBy`, `initial`, `intersection`,
     * `invert`, `invoke`, `keys`, `map`, `mapValues`, `matches`, `max`, `memoize`,
     * `merge`, `min`, `noop`, `object`, `omit`, `once`, `pairs`, `partial`,
     * `partialRight`, `pick`, `pluck`, `property`, `pull`, `push`, `range`,
     * `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`, `sortBy`,
     * `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`, `union`,
     * `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`, `xor`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `capitalize`, `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`,
     * `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`,
     * `identity`, `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`,
     * `isElement`, `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`,
     * `isNull`, `isNumber`, `isObject`, `isPlainObject`, `isRegExp`, `isString`,
     * `isUndefined`, `join`, `lastIndexOf`, `mixin`, `noConflict`, `now`,
     * `parseInt`, `pop`, `random`, `reduce`, `reduceRight`, `result`, `shift`,
     * `size`, `some`, `sortedIndex`, `runInContext`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first`, `last`, and `sample` return wrapped values
     * when `n` is provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} [chainAll=false] A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if the DOM is supported.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.dom = document.createDocumentFragment().nodeType === 11;
    } catch(e) {
      support.dom = false;
    }

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} data The metadata array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(data) {
      var func = data[0],
          thisArg = data[3],
          partialArgs = data[4],
          partialHolders = data[6];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object use disqualifying optimizations by
          // converting it to an array before passing it to `composeArgs`
          var index = -1,
              length = arguments.length,
              args = Array(length);

          while (++index < length) {
            args[index] = arguments[index];
          }
          args = composeArgs(partialArgs, partialHolders, args);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);

          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setData(bound, data);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = []);
        stackB || (stackB = []);

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? baseEach : baseForOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for environments without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns the new function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var data = func[expando];
      if (typeof data == 'undefined') {
        if (support.funcNames) {
          data = !func.name;
        }
        data = data || !support.funcDecomp;
        if (!data) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            data = !reFuncName.test(source);
          }
          if (!data) {
            // checks if `func` references the `this` keyword and stores the result
            data = reThis.test(source);
            setData(func, data);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (data === false || (data !== true && data[1] & BIND_FLAG)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} data The metadata array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(data) {
      var func = data[0],
          bitmask = data[1],
          arity = data[2],
          thisArg = data[3],
          partialArgs = data[4],
          partialRightArgs = data[5],
          partialHolders = data[6],
          partialRightHolders = data[7];

      var isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          key = func;

      function bound() {
        var index = -1,
            length = arguments.length,
            args = Array(length);

        while (++index < length) {
          args[index] = arguments[index];
        }
        if (partialArgs) {
          args = composeArgs(partialArgs, partialHolders, args);
        }
        if (partialRightArgs) {
          args = composeArgsRight(partialRightArgs, partialRightHolders, args);
        }
        if (isCurry && length < arity) {
          bitmask |= PARTIAL_FLAG;
          bitmask &= ~PARTIAL_RIGHT_FLAG
          if (!isCurryBound) {
            bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
          }
          var newArity = nativeMax(0, arity - length);
          return baseCreateWrapper([func, bitmask, newArity, thisArg, args, null, []]);
        }
        var thisBinding = isBind ? thisArg : this;
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setData(bound, data);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var index = -1,
          indexOf = getIndexOf(),
          prereq = indexOf === baseIndexOf,
          isLarge = prereq && createCache && values && values.length >= 200,
          isCommon = prereq && !isLarge,
          result = [],
          valuesLength = values ? values.length : 0;

      if (isLarge) {
        indexOf = cacheIndexOf;
        values = createCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} callback The function called per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    function baseEach(collection, callback) {
      var index = -1,
          iterable = collection,
          length = collection ? collection.length : 0;

      if (typeof length == 'number' && length > -1) {
        length |= 0;
        while (++index < length) {
          if (callback(iterable[index], index, collection) === false) {
            break;
          }
        }
      } else {
        baseForOwn(collection, callback);
      }
      return collection;
    }

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} callback The function called per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    function baseEachRight(collection, callback) {
      var iterable = collection,
          length = collection ? collection.length : 0;

      if (typeof length == 'number' && length > -1) {
        length = (length |= 0) < 0 ? 0 : length;
        while (length--) {
          if (callback(iterable[length], length, collection) === false) {
            break;
          }
        }
      } else {
        baseForOwnRight(collection, callback);
      }
      return collection;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex | 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` executing the callback
     * for each property. Callbacks may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} callback The function called per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    function baseFor(object, callback, keysFunc) {
      var index = -1,
          props = keysFunc(object),
          length = props.length;

      while (++index < length) {
        var key = props[index];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} callback The function called per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    function baseForRight(object, callback, keysFunc) {
      var index = -1,
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} callback The function called per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, callback) {
      return baseFor(object, callback, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} callback The function called per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, callback) {
      return baseFor(object, callback, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} callback The function called per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, callback) {
      return baseForRight(object, callback, keys);
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg`
     * binding, that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a && (a == null || b == null ||
          (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
        return false;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `-0` vs. `+0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        baseForIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          baseForIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? baseEach : baseForOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var index = -1,
          indexOf = getIndexOf(),
          prereq = !isSorted && indexOf === baseIndexOf,
          isLarge = prereq && createCache && length >= 200,
          isCommon = prereq && !isLarge,
          result = [];

      if (isLarge) {
        var seen = createCache();
        indexOf = cacheIndexOf;
      } else {
        seen = (callback && !isSorted) ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isCommon) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (callback) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (isSorted) {
          if (!index || seen !== computed) {
            seen = computed;
            result.push(value);
          }
        }
        else if (indexOf(seen, computed) < 0) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * returned by `keysFunc`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, keysFunc) {
      var index = -1,
          props = keysFunc(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} partialArg An array of arguments to prepend to those provided.
     * @param {Array} partialHolders An array of `partialArgs` placeholder indexes.
     * @param {Array|Object} args The provided arguments.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(partialArgs, partialHolders, args) {
      var holdersLength = partialHolders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partialArgs.length,
          result = Array(argsLength + leftLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partialArgs[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[partialHolders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} partialRightArg An array of arguments to append to those provided.
     * @param {Array} partialHolders An array of `partialRightArgs` placeholder indexes.
     * @param {Array|Object} args The provided arguments.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(partialRightArgs, partialRightHolders, args) {
      var holdersIndex = -1,
          holdersLength = partialRightHolders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partialRightArgs.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var pad = argsIndex;
      while (++rightIndex < rightLength) {
        result[pad + rightIndex] = partialRightArgs[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[pad + partialRightHolders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object or
     * array composed from the results of running each element in the collection
     * through a callback. The given setter function sets the keys and values of
     * the composed object or array.
     *
     * @private
     * @param {Function} setter The setter function.
     * @param {boolean} [retArray=false] A flag to indicate that the aggregator
     *  function should return an array.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, retArray) {
      return function(collection, callback, thisArg) {
        var result = retArray ? [[], []] : {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = (collection && collection.length) | 0;

        if (length > 0) {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [array=[]] The array to search.
     * @returns {Object} Returns the new cache object.
     */
    var createCache = Set && function(array) {
      var cache = new Set,
          length = array ? array.length : 0;

      cache.push = cache.add;
      while (length--) {
        cache.push(array[length]);
      }
      return cache;
    };

    /**
     * Creates the pad required for `string` based on the given padding length.
     * The `chars` string may be truncated if the number of padding characters
     * exceeds the padding length.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPad(string, length, chars) {
      var strLength = string.length;
      length |= 0;

      if (strLength >= length) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : String(chars);
      return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that either curries or invokes `func` with an optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1  - `_.bind`
     *  2  - `_.bindKey`
     *  4  - `_.curry`
     *  8  - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {number} [arity] The arity of `func`.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {Array} [partialHolders] An array of `partialArgs` placeholder indexes.
     * @param {Array} [partialRightHolders] An array of `partialRightArgs` placeholder indexes.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, arity, thisArg, partialArgs, partialRightArgs, partialHolders, partialRightHolders) {
      var isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isPartial = bitmask & PARTIAL_FLAG,
          isPartialRight = bitmask & PARTIAL_RIGHT_FLAG;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~PARTIAL_FLAG;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~PARTIAL_RIGHT_FLAG;
        isPartialRight = partialRightArgs = false;
      }
      var data = !isBindKey && func[expando];
      if (data && data !== true) {
        // shallow clone `data`
        data = slice(data);

        // clone partial left arguments
        if (data[4]) {
          data[4] = slice(data[4]);
        }
        // clone partial right arguments
        if (data[5]) {
          data[5] = slice(data[5]);
        }
        // set arity if provided
        if (typeof arity == 'number') {
          data[2] = arity;
        }
        // set `thisArg` if not previously bound
        var bound = data[1] & BIND_FLAG;
        if (isBind && !bound) {
          data[3] = thisArg;
        }
        // set if currying a bound function
        if (!isBind && bound) {
          bitmask |= CURRY_BOUND_FLAG;
        }
        // append partial left arguments
        if (isPartial) {
          if (data[4]) {
            push.apply(data[4], partialArgs);
          } else {
            data[4] = partialArgs;
          }
        }
        // prepend partial right arguments
        if (isPartialRight) {
          if (data[5]) {
            unshift.apply(data[5], partialRightArgs);
          } else {
            data[5] = partialRightArgs;
          }
        }
        // merge flags
        data[1] |= bitmask;
        return createWrapper.apply(null, data);
      }
      if (arity == null) {
        arity = isBindKey ? 0 : func.length;
      } else if (arity < 0) {
        arity = 0;
      }
      if (isPartial) {
        partialHolders = [];
      }
      if (isPartialRight) {
        partialRightHolders = [];
      }
      // fast path for `_.bind`
      data = [func, bitmask, arity, thisArg, partialArgs, partialRightArgs, partialHolders, partialRightHolders];
      return (bitmask == BIND_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG))
        ? baseBind(data)
        : baseCreateWrapper(data);
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(fnToString.call(value));
    }

    /**
     * Sets wrapper metadata on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, expando, descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if `value` is
     * an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and
     * that there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (!hasOwnProperty.call(value, 'constructor') &&
            (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var index = -1,
          props = keysIn(object),
          length = props.length,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [5, 2, 10]);
     * // => [1, 3]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3], 1);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    var drop = rest;

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3], 1);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    var dropRight = initial;

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements will be dropped until the predicate returns falsey. The predicate
     * is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per element.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'employer': 'slate' },
     *   { 'name': 'fred',    'employer': 'slate', 'blocked': true },
     *   { 'name': 'pebbles', 'employer': 'na',    'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.dropRightWhile(characters, 'blocked'), 'name');
     * // => ['barney']
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.dropRightWhile(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    var dropRightWhile = initial;

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements will be dropped until the predicate returns falsey. The predicate
     * is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per element.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'employer': 'slate', 'blocked': true },
     *   { 'name': 'fred',    'employer': 'slate' },
     *   { 'name': 'pebbles', 'employer': 'na',    'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.dropWhile(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.dropWhile(characters, { 'employer': 'slate' }), 'name');
     * // => ['pebbles']
     */
    var dropWhile = rest;

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element the predicate returns truthy for, instead of the element itself.
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, predicate, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a collection from right to left.
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, predicate, thisArg) {
      var length = array ? array.length : 0;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      while (length--) {
        if (predicate(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Arrays
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array, predicate, thisArg) {
      if (typeof predicate != 'number' && predicate != null) {
        var index = -1,
            length = array ? array.length : 0,
            n = 0;

        predicate = lodash.createCallback(predicate, thisArg, 3);
        while (++index < length && predicate(array[index], index, array)) {
          n++;
        }
      } else {
        n = predicate;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truthy, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback] The function called per iteration.
     *  If a property name or object is provided it will be used to create a "_.pluck"
     *  or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * // using `isShallow`
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      // juggle arguments
      var type = typeof isShallow;
      if (type != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = isShallow;
        isShallow = false;

        // enables use as a callback for functions like `_.map`
        if ((type == 'number' || type == 'string') && thisArg && thisArg[callback] === array) {
          callback = null;
        }
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) | 0;
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return (length && array[index] === value) ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array, predicate, thisArg) {
      var length = array ? array.length : 0;

      if (typeof predicate != 'number' && predicate != null) {
        var index = length,
            n = 0;

        predicate = lodash.createCallback(predicate, thisArg, 3);
        while (index-- && predicate(array[index], index, array)) {
          n++;
        }
      } else {
        n = (predicate == null || thisArg) ? 1 : predicate;
      }
      n = length - n;
      return slice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection(array) {
      if (!array) {
        return [];
      }
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = [],
          indexOf = getIndexOf(),
          prereq = createCache && indexOf === baseIndexOf,
          seen = [];

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(prereq && value.length >= 120 &&
            createCache(argsIndex ? value : seen));
        }
      }
      argsLength = args.length;
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array, predicate, thisArg) {
      var length = array ? array.length : 0;

      if (typeof predicate != 'number' && predicate != null) {
        var index = length,
            n = 0;

        predicate = lodash.createCallback(predicate, thisArg, 3);
        while (index-- && predicate(array[index], index, array)) {
          n++;
        }
      } else {
        n = predicate;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      n = length - n;
      return slice(array,  n < 0 ? 0 : n);
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If `fromIndex` is negative,
     * it is used as the offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        fromIndex |= 0;
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var argsIndex = 0,
          argsLength = arguments.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = arguments[argsIndex];

        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Removes all elements from an array that the predicate returns truthy for
     * and returns an array of removed elements. The predicate is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, predicate, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      predicate = lodash.createCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array, predicate, thisArg) {
      if (typeof predicate != 'number' && predicate != null) {
        var index = -1,
            length = array ? array.length : 0,
            n = 0;

        predicate = lodash.createCallback(predicate, thisArg, 3);
        while (++index < length && predicate(array[index], index, array)) {
          n++;
        }
      } else if (predicate == null || thisArg) {
        n = 1;
      } else {
        n = predicate < 0 ? 0 : predicate;
      }
      return slice(array, n);
    }

    /**
     * Slices `array` from the `start` index up to, but not including, the `end` index.
     *
     * Note: This function is used instead of `Array#slice` to support node lists
     * in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start index.
     * @param {number} [end=array.length] The end index.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var index = -1,
          length = array ? array.length : 0;

      start |= 0;
      if (start < 0) {
        start = nativeMax(length + start, 0);
      } else if (start > length) {
        start = length;
      }
      end = typeof end == 'undefined' ? length : (end | 0);
      if (end < 0) {
        end = nativeMax(length + end, 0);
      } else if (end > length) {
        end = length;
      }
      length = start > end ? 0 : (end - start);

      var result = Array(length);
      while (++index < length) {
        result[index] = array[start + index];
      }
      return result;
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * // using `callback`
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * // using `callback` with `thisArg`
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? (low = mid + 1)
          : (high = mid);
      }
      return low;
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3], 1);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    var take = first;

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3], 1);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    var takeRight = last;

    /**
     * Creates a slice of `array` with elements taken from the end. Elements will
     * be taken until the predicate returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per element.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'employer': 'slate' },
     *   { 'name': 'fred',    'employer': 'slate', 'blocked': true },
     *   { 'name': 'pebbles', 'employer': 'na',    'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.takeRightWhile(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.takeRightWhile(characters, { 'employer': 'na' }), 'name');
     * // => ['pebbles']
     */
    var takeRightWhile = last;

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * will be taken until the predicate returns falsey. The predicate is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per element.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'employer': 'slate', 'blocked': true },
     *   { 'name': 'fred',    'employer': 'slate' },
     *   { 'name': 'pebbles', 'employer': 'na',    'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.takeWhile(characters, 'blocked'), 'name');
     * // => ['barney']
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.takeWhile(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    var takeWhile = first;

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback] The function called per iteration.
     *  If a property name or object is provided it will be used to create a "_.pluck"
     *  or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * // using `callback`
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * // using `callback` with `thisArg`
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      // juggle arguments
      var type = typeof isSorted;
      if (type != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = isSorted;
        isSorted = false;

        // enables use as a callback for functions like `_.map`
        if ((type == 'number' || type == 'string') && thisArg && thisArg[callback] === array) {
          callback = null;
        }
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without() {
      return baseDifference(arguments[0], slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See [Wikipedia](http://en.wikipedia.org/wiki/Symmetric_difference) for
     * more details.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseDifference(result, array).concat(baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on. If a zipped value is provided its corresponding
     * unzipped value will be returned.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] The arrays to process.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip([['fred', 30, true], ['barney', 40, false]]);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the result of coercing the wrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes to retrieve,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection, guard) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = props.length,
          type = typeof guard;

      // enables use as a callback for functions like `_.map`
      if ((type == 'number' || type == 'string') && args[2] && args[2][guard] === collection) {
        length = 1;
      }
      var result = Array(length);
      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the target element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var length = collection ? collection.length : 0;
      fromIndex = (typeof fromIndex == 'number' && fromIndex) | 0;

      if (typeof length == 'number' && length > -1) {
        if (typeof collection == 'string' || !isArray(collection) && isString(collection)) {
          if (fromIndex >= length) {
            return false;
          }
          return nativeContains
            ? nativeContains.call(collection, target, fromIndex)
            : collection.indexOf(target, fromIndex) > -1;
        }
        var indexOf = getIndexOf();
        fromIndex = fromIndex < 0 ? nativeMax(0, (length | 0) + fromIndex) : fromIndex;
        return indexOf(collection, target, fromIndex) > -1;
      }
      var index = -1,
          result = false;

      baseEach(collection, function(value) {
        if (++index >= fromIndex) {
          return !(result = value === target);
        }
      });

      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the predicate returns truthy for **all** elements of a collection.
     * The predicate is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements passed the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var result = true;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      var index = -1,
          length = (collection && collection.length) | 0;

      if (length > 0) {
        while (++index < length) {
          if (!predicate(collection[index], index, collection)) {
            return false;
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          return (result = !!predicate(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection returning an array of all elements
     * the predicate returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4], function(num) { return num % 2 == 0; });
     * // => [2, 4]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36 }]
     */
    function filter(collection, predicate, thisArg) {
      var result = [];

      predicate = lodash.createCallback(predicate, thisArg, 3);
      var index = -1,
          length = (collection && collection.length) | 0;

      if (length > 0) {
        while (++index < length) {
          var value = collection[index];
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the predicate returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1 }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, predicate, thisArg) {
      var length = (collection && collection.length) | 0;
      if (length > 0) {
        var index = findIndex(collection, predicate, thisArg);
        return index > -1 ? collection[index] : undefined;
      }
      var key = findKey(collection, predicate, thisArg);
      return typeof key == 'string' ? collection[key] : undefined;
    }

    /**
     * This method is like `_.find` except that it iterates over elements of a
     * collection from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, predicate, thisArg) {
      var length = (collection && collection.length) | 0;
      if (length > 0) {
        var index = findLastIndex(collection, predicate, thisArg);
        return index > -1 ? collection[index] : undefined;
      }
      var key = findLastKey(collection, predicate, thisArg);
      return typeof key == 'string' ? collection[key] : undefined;
    }

    /**
     * Iterates over elements of a collection executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = (collection && collection.length) | 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (length > 0) {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        baseEach(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * a collection from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = (collection && collection.length) | 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (length > 0) {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        baseEachRight(collection, callback);
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) { return String.fromCharCode(object.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) { return this.fromCharCode(object.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] Arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = (collection && collection.length) | 0,
          result = Array(length < 0 ? 0 : length);

      baseEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = (collection && collection.length) | 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (length > 0) {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        baseEach(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback] The function called per iteration.
     *  If a property name or object is provided it will be used to create a "_.pluck"
     *  or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed,
          type = typeof callback;

      // enables use as a callback for functions like `_.map`
      if ((type == 'number' || type == 'string') && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        baseEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback] The function called per iteration.
     *  If a property name or object is provided it will be used to create a "_.pluck"
     *  or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed,
          type = typeof callback;

      // enables use as a callback for functions like `_.map`
      if ((type == 'number' || type == 'string') && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        baseEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements the predicate returns truthy for, while the second of which
     * contains elements the predicate returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(num) { return num % 2; });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(num) { return this.floor(num) % 2; }, Math);
     * // => [[1, 3], [2]]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.map(_.partition(characters, { 'age': 1 }), function(array) { return _.pluck(array, 'name'); });
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.partition(characters, 'blocked'), function(array) { return _.pluck(array, 'name'); });
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, true);

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} key The name of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = (collection && collection.length) | 0;

      if (length > 0) {
        if (noaccum && length) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of a
     * collection from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;

      callback = lodash.createCallback(callback, thisArg, 4);
      baseEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of a collection
     * the predicate does **not** return truthy for.
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4], function(num) { return num % 2 == 0; });
     * // => [1, 3]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36 }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, predicate, thisArg) {
      predicate = lodash.createCallback(predicate, thisArg, 3);
      return filter(collection, negate(predicate));
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        var length = (collection && collection.length) | 0;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See [Wikipedia](http://en.wikipedia.org/wiki/Fisher-Yates_shuffle)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = (collection && collection.length) | 0,
          result = Array(length < 0 ? 0 : length);

      baseEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });

      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' && length > -1 ? length : keys(collection).length;
    }

    /**
     * Checks if the predicate returns truthy for **any** element of a collection.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passed the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, predicate, thisArg) {
      var result;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      var index = -1,
          length = (collection && collection.length) | 0;

      if (length > 0) {
        while (++index < length) {
          if (predicate(collection[index], index, collection)) {
            return true;
          }
        }
      } else {
        baseEach(collection, function(value, index, collection) {
          return !(result = predicate(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function
     *  called per iteration. If a property name or object is provided it will
     *  be used to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          length = (collection && collection.length) | 0,
          multi = callback && isArray(callback),
          result = Array(length < 0 ? 0 : length);

      if (!multi) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      baseEach(collection, function(value, key, collection) {
        if (multi) {
          var length = callback.length,
              criteria = Array(length);

          while (length--) {
            criteria[length] = value[callback[length]];
          }
        } else {
          criteria = callback(value, key, collection);
        }
        result[++index] = { 'criteria': criteria, 'index': index, 'value': value };
      });

      length = result.length;
      result.sort(multi ? compareMultipleAscending : compareAscending);
      while (length--) {
        result[length] = result[length].value;
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      var length = collection && collection.length;
      if (typeof length == 'number' && length > -1) {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * `source` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} source The object of property values to filter by.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `bind` arguments to those provided to the bound
     * function.
     *
     * Note: Unlike native `Function#bind` this method does not set the `length`
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [args] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      if (arguments.length < 3) {
        return createWrapper(func, BIND_FLAG, null, thisArg);
      }
      if (func) {
        var arity = func[expando] ? func[expando][2] : func.length,
            partialArgs = slice(arguments, 2);

        arity -= partialArgs.length;
      }
      return createWrapper(func, BIND_FLAG | PARTIAL_FLAG, arity, thisArg, partialArgs);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * Note: This method does not set the `length` property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], BIND_FLAG, null, object);
      }
      return object;
    }

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `bindKey` arguments to those provided to the bound function.
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that will be redefined or don't yet exist.
     * See [Peter Michaux's article](http://michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [args] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length < 3
        ? createWrapper(key, BIND_FLAG | BIND_KEY_FLAG, null, object)
        : createWrapper(key, BIND_FLAG | BIND_KEY_FLAG | PARTIAL_FLAG, null, object, slice(arguments, 2));
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          funcsLength = funcs.length,
          length = funcsLength;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var length = funcsLength - 1,
            result = funcs[length].apply(this, arguments);

        while (length--) {
          result = funcs[length].call(this, result);
        }
        return result;
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * Note: This method does not set the `length` property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      if (typeof arity != 'number') {
        arity = +arity || (func ? func.length : 0);
      }
      return createWrapper(func, CURRY_FLAG, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = wait < 0 ? 0 : wait;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [args] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [args] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : '_' + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that negates the result of `func`. The `func` function
     * is executed with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(num) {
     *   return num % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        return !func.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with any additional `partial` arguments
     * prepended to those provided to the new function. This method is similar to
     * `_.bind` except it does **not** alter the `this` binding.
     *
     * Note: This method does not set the `length` property of partially applied
     * functions.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [args] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      if (func) {
        var arity = func[expando] ? func[expando][2] : func.length,
            partialArgs = slice(arguments, 1);

        arity -= partialArgs.length;
      }
      return createWrapper(func, PARTIAL_FLAG, arity, null, partialArgs);
    }

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * Note: This method does not set the `length` property of partially applied
     * functions.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [args] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      if (func) {
        var arity = func[expando] ? func[expando][2] : func.length,
            partialRightArgs = slice(arguments, 1);

        arity -= partialRightArgs.length;
      }
      return createWrapper(func, PARTIAL_RIGHT_FLAG, arity, null, null, partialRightArgs);
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = +wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, PARTIAL_FLAG, null, null, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * defaults({ 'name': 'barney' }, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    function assign(object, source, guard) {
      if (!object) {
        return object;
      }
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          type = typeof guard;

      // enables use as a callback for functions like `_.reduce`
      if ((type == 'number' || type == 'string') && args[3] && args[3][guard] === source) {
        argsLength = 2;
      }
      // juggle arguments
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        source = args[argsIndex];
        var index = -1,
            props = keys(source),
            length = props.length;

        while (++index < length) {
          var key = props[index];
          object[key] = callback ? callback(object[key], source[key]) : source[key];
        }
      }
      return object;
    }

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      var type = typeof isDeep;

      // juggle arguments
      if (type != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;

        // enables use as a callback for functions like `_.map`
        if ((type == 'number' || type == 'string') && thisArg && thisArg[callback] === value) {
          callback = null;
        }
      }
      callback = typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1);
      return baseClone(value, isDeep, callback);
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      callback = typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1);
      return baseClone(value, true, callback);
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.defaults({ 'name': 'barney' }, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    function defaults() {
      var args = slice(arguments);
      args.push(assignDefaults);
      return assign.apply(null, args);
    }

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element the predicate returns truthy for, instead of the element itself.
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': { 'age': 36 },
     *   'fred': { 'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1 }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, predicate, thisArg) {
      var result;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      baseForOwn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `predicate` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': { 'age': 36, 'blocked': true },
     *   'fred': { 'age': 40 },
     *   'pebbles': { 'age': 1, 'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate, thisArg) {
      var result;

      predicate = lodash.createCallback(predicate, thisArg, 3);
      baseForOwnRight(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object executing
     * the callback for each property. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, key, object). Callbacks may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'z' (property order is not guaranteed across environments)
     */
    function forIn(object, callback, thisArg) {
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      return baseFor(object, callback, keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over elements of a
     * collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'z', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'z'
     */
    function forInRight(object, callback, thisArg) {
      callback = baseCreateCallback(callback, thisArg, 3);
      return baseForRight(object, callback, keysIn);
    }

    /**
     * Iterates over own enumerable properties of an object executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    function forOwn(object, callback, thisArg) {
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      return baseForOwn(object, callback);
    }

    /**
     * This method is like `_.forOwn` except that it iterates over elements of a
     * collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      callback = baseCreateCallback(callback, thisArg, 3);
      return baseForRight(object, callback, keys);
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new sorted array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];

      baseForIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given
     * object. If the given object contains duplicate values, subsequent values
     * will overwrite property assignments of previous values unless `multiValue`
     * is `true`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue=false] Allow multiple values per key.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     *
     * // without `multiValue`
     * _.invert({ 'first': 'fred', 'second': 'barney', 'third': 'fred' });
     * // => { 'fred': 'third', 'barney': 'second' }
     *
     * // with `multiValue`
     * _.invert({ 'first': 'fred', 'second': 'barney', 'third': 'fred' }, true);
     * // => { 'fred': ['first', 'third'], 'barney': ['second'] }
     */
    function invert(object, multiValue) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })();
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Wed May 23 2012');
     * // => false
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return value && typeof value == 'object' && value.nodeType === 1 &&
        toString.call(value).indexOf('Element') > -1 || false;
    }
    // fallback for environments without DOM support
    if (!support.dom) {
      isElement = function(value) {
        return value && typeof value == 'object' && value.nodeType === 1 &&
          !isPlainObject(value) || false;
      };
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      baseForOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      callback = typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2);

      if (!callback) {
        // exit early for identical values
        if (a === b) {
          // treat `-0` vs. `+0` as not equal
          return a !== 0 || (1 / a == 1 / b);
        }
        var type = typeof a,
            otherType = typeof b;

        // exit early for unlike primitive values
        if (a === a && (a == null || b == null ||
            (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
          return false;
        }
      }
      return baseIsEqual(a, b, callback);
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This method is not the same as native `isFinite` which will return
     * `true` for booleans and empty strings. See the [ES5 spec](http://es5.github.io/#x15.1.2.5)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // https://code.google.com/p/v8/issues/detail?id=2291
      var type = typeof value;
      return value && (type == 'function' || type == 'object') || false;
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This method is not the same as native `isNaN` which will return `true`
     * for `undefined` and other non-numeric values. See the [ES5 spec](http://es5.github.io/#x15.1.2.4)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See the [ES5 spec](http://es5.github.io/#x8.5)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      var type = typeof value;
      return type == 'number' ||
        value && type == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.keys(new Shape);
     * // => ['x', 'y'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.keysIn(new Shape);
     * // => ['x', 'y', 'z'] (property order is not guaranteed across environments)
     */
    function keysIn(object) {
      var result = [];
      if (!isObject(object)) {
        return result;
      }
      for (var key in object) {
        result.push(key);
      }
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};

      callback = lodash.createCallback(callback, thisArg, 3);
      baseForOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object, source, guard) {
      if (!object) {
        return object;
      }
      var args = arguments,
          length = args.length,
          type = typeof guard;

      // enables use as a callback for functions like `_.reduce`
      if ((type == 'number' || type == 'string') && args[3] && args[3][guard] === source) {
        length = 2;
      }
      // juggle arguments
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(args, 1, length),
          index = -1,
          stackA = [],
          stackB = [];

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a predicate is provided it will be executed for each
     * property of `object` omitting the properties the predicate returns truthy
     * for. The predicate is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [predicate] The function called per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, predicate, thisArg) {
      if (typeof predicate == 'function') {
        predicate = lodash.createCallback(predicate, thisArg, 3);
        return pick(object, negate(predicate));
      }
      var omitProps = baseFlatten(arguments, true, false, 1),
          length = omitProps.length;

      while (length--) {
        omitProps[length] = String(omitProps[length]);
      }
      return pick(object, baseDifference(keysIn(object),  omitProps));
    }

    /**
     * Creates a two dimensional array of a given object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a predicate is provided it will be executed for each
     * property of `object` picking the properties the predicate returns truthy
     * for. The predicate is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [predicate] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, predicate, thisArg) {
      var result = {};

      if (typeof predicate != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        predicate = lodash.createCallback(predicate, thisArg, 3);
        baseForIn(object, function(value, key, object) {
          if (predicate(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? baseEach : baseForOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Shape(x, y) {
     *   this.x = x;
     *   this.y = y;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.values(new Shape(2, 1));
     * // => [2, 1] (property order is not guaranteed across environments)
     */
    function values(object) {
      return baseValues(object, keys);
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Shape(x, y) {
     *   this.x = x;
     *   this.y = y;
     * }
     *
     * Shape.prototype.z = 0;
     *
     * _.valuesIn(new Shape(2, 1));
     * // => [2, 1, 0] (property order is not guaranteed across environments)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Converts `string` to camel case.
     * See [Wikipedia](http://en.wikipedia.org/wiki/CamelCase) for more details.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to camel case.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Hello world');
     * // => 'helloWorld'
     *
     * _.camelCase('hello-world');
     * // => 'helloWorld'
     *
     * _.camelCase('hello_world');
     * // => 'helloWorld'
     */
    var camelCase = createCompounder(function(result, word, index) {
      return result + word.charAt(0)[index ? 'toUpperCase' : 'toLowerCase']() + word.slice(1);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      if (string == null) {
        return '';
      }
      string = String(string);
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Checks if `string` ends with a given target string.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if the given string ends with the
     *  target string, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = string == null ? '' : String(string);
      target = String(target);

      var length = string.length;
      position = (typeof position == 'number' ? nativeMin(nativeMax(position | 0, 0), length) : length) - target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to
     * their corresponding HTML entities.
     *
     * Note: No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](http://mths.be/he).
     *
     * When working with HTML you should always quote attribute values to reduce
     * XSS vectors. See [Ryan Grove's article](http://wonko.com/post/html-escaping)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * Escapes the RegExp special characters "\", "^", "$", ".", "|", "?", "*",
     * "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](http://lodash.com)');
     * // => '\[lodash\]\(http://lodash\.com\)'
     */
    function escapeRegExp(string) {
      return string == null ? '' : String(string).replace(reRegExpChars, '\\$&');
    }

    /**
     * Converts `string` to kebab case (a.k.a. spinal case).
     * See [Wikipedia](http://en.wikipedia.org/wiki/Letter_case#Computers) for
     * more details.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to kebab case.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Hello world');
     * // => 'hello-world'
     *
     * _.kebabCase('helloWorld');
     * // => 'hello-world'
     *
     * _.kebabCase('hello_world');
     * // => 'hello-world'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it is shorter then the given
     * padding length. The `chars` string may be truncated if the number of padding
     * characters can't be evenly divided by the padding length.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = string == null ? '' : String(string);
      length |= 0;

      var strLength = string.length;
      if (strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = floor(mid),
          rightLength = ceil(mid);

      chars = createPad('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it is shorter then the given padding
     * length. The `chars` string may be truncated if the number of padding
     * characters exceeds the padding length.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    function padLeft(string, length, chars) {
      string = string == null ? '' : String(string);
      return createPad(string, length, chars) + string;
    }

    /**
     * Pads `string` on the right side if it is shorter then the given padding
     * length. The `chars` string may be truncated if the number of padding
     * characters exceeds the padding length.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    function padRight(string, length, chars) {
      string = string == null ? '' : String(string);
      return string + createPad(string, length, chars);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      n |= 0;

      if (n < 1 || string == null) {
        return result;
      }
      string = String(string);
      do {
        if (n % 2) {
          result += string;
        }
        n = floor(n / 2);
        string += string;
      } while (n);
      return result;
    }

    /**
     * Converts `string` to snake case.
     * See [Wikipedia](http://en.wikipedia.org/wiki/Snake_case) for more details.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to snake case.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Hello world');
     * // => 'hello_world'
     *
     * _.snakeCase('hello-world');
     * // => 'hello_world'
     *
     * _.snakeCase('helloWorld');
     * // => 'hello_world'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Checks if `string` starts with a given target string.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if the given string starts with the
     *  target string, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = string == null ? '' : String(string);
      position = typeof position == 'number' ? nativeMin(nativeMax(position | 0, 0), string.length) : 0;
      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escaped interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. If
     * a data object is provided the interpolated template string will be returned.
     * Data properties may be accessed as free variables in the template. If a
     * settings object is provided it will override `_.templateSettings` for the
     * template.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier debugging.
     * See the [HTML5 Rocks article on sourcemaps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for more details.
     *
     * For more information on precompiling templates see
     * [Lo-Dash's custom builds documentation](http://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](http://developer.chrome.com/stable/extensions/sandboxingEval.html).
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The template string.
     * @param {Object} [data] The data object used to populate the template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @returns {Function|string} Returns the interpolated string if a data object
     *  is provided, else the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      options = defaults({}, options, settings);
      string = String(string == null ? '' : string);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  fred  ');
     * // => 'fred'
     *
     * _.trim('-_-fred-_-', '_-');
     * // => 'fred'
     */
    var trim = !nativeTrim ? shimTrim : function(string, chars) {
      if (string == null) {
        return '';
      }
      return chars == null ? nativeTrim.call(string) : shimTrim(string, chars);
    };

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  fred  ');
     * // => 'fred  '
     *
     * _.trimLeft('-_-fred-_-', '_-');
     * // => 'fred-_-'
     */
    var trimLeft = !nativeTrimLeft ? shimTrimLeft : function(string, chars) {
      if (string == null) {
        return '';
      }
      return chars == null ? nativeTrimLeft.call(string) : shimTrimLeft(string, chars);
    };

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  fred  ');
     * // => '  fred'
     *
     * _.trimRight('-_-fred-_-', '_-');
     * // => '-_-fred'
     */
    var trimRight = !nativeTrimRight ? shimTrimRight : function(string, chars) {
      if (string == null) {
        return '';
      }
      return chars == null ? nativeTrimRight.call(string) : shimTrimRight(string, chars);
    };

    /**
     * Truncates `string` if it is longer than the given maximum string length.
     * The last characters of the truncated string will be replaced with the
     * omission string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to trim.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string used to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', { 'length': 24, 'separator': ' ' });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', { 'length': 24, 'separator': /,? +/ });
     * //=> 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', { 'omission': ' [...]' });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = 30,
          omission = '...';

      if (options && isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? options.length | 0 : length;
        omission = 'omission' in options ? String(options.omission) : omission;
      }
      else if (options != null) {
        length = options | 0;
      }
      string = string == null ? '' : String(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * Note: No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](http://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category Strings
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney &amp; pebbles');
     * // => 'fred, barney & pebbles'
     */
    function unescape(string) {
      if (string == null) {
        return '';
      }
      string = String(string);
      return string.indexOf(';') < 0 ? string : string.replace(reEscapedHtml, unescapeHtmlChar);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Creates a function bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @alias callback
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function' || func == null) {
        return (typeof thisArg == 'undefined' || !('prototype' in func)) &&
          func || baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" and "_.where" style callback shorthands
      return type != 'object' ? property(func) : matches(func);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a "_.where" style predicate function which performs a deep comparison
     * between a given object and the `source` object, returning `true` if the given
     * object has equivalent property values, else `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var matchesAge = _.matches({ 'age': 36 });
     *
     * _.filter(characters, matchesAge);
     * // => [{ 'name': 'barney', 'age': 36 }]
     *
     * _.find(characters, matchesAge);
     * // => { 'name': 'barney', 'age': 36 }
     */
    function matches(source) {
      source || (source = {});
      var props = keys(source),
          propsLength = props.length,
          key = props[0],
          a = source[key];

      // fast path the common case of providing an object with a single
      // property containing a primitive value
      if (propsLength == 1 && a === a && !isObject(a)) {
        return function(object) {
          if (!hasOwnProperty.call(object, key)) {
            return false;
          }
          // treat `-0` vs. `+0` as not equal
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = propsLength,
            result = false;

        while (length--) {
          var key = props[length];
          if (!(result = hasOwnProperty.call(object, key) &&
              baseIsEqual(object[key], source[key], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var index = -1,
          isFunc = isFunction(object),
          length = methodNames ? methodNames.length : 0;

      while (++index < length) {
        var methodName = methodNames[index],
            func = object[methodName] = source[methodName];

        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__,
                  value = this.__wrapped__,
                  args = [value];

              push.apply(args, arguments);
              var result = func.apply(object, args);
              if (chain || chainAll) {
                if (value === result && isObject(result)) {
                  return this;
                }
                result = new object(result);
                result.__chain__ = chainAll;
              }
              return result;
            };
          }(func));
        }
      }
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /**
     * Converts `value` to an integer of the specified radix. If `radix` is
     * `undefined` or `0` a `radix` of `10` is used unless the `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See the [ES5 spec](http://es5.github.io/#E)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the converted integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow ES3  for `parseInt` and
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109
      value = trim(value);
      return nativeParseInt(value, +radix || (reHexPrefix.test(value) ? 16 : 10));
    };

    /**
     * Creates a "_.pluck" style function which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truthy or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result
     * returned, else the property value is returned. If `object` is `null` or
     * `undefined` then `undefined` is returned. If a default value is provided
     * it will be returned if the property value resolves to `undefined`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @param {*} [defaultValue] The value returned if the property value
     *  resolves to `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'age': function() {
     *     return 40;
     *   }
     * };
     *
     * _.result(object, 'name');
     * // => 'fred'
     *
     * _.result(object, 'age');
     * // => 40
     *
     * _.result(object, 'employer', 'slate');
     * // => 'slate'
     */
    function result(object, key, defaultValue) {
      var value = object == null ? undefined : object[key];
      if (typeof value == 'undefined') {
        return defaultValue;
      }
      return isFunction(value) ? object[key]() : value;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.callback = createCallback;
    lodash.collect = map;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(assign({}, lodash));

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.snakeCase = snakeCase;
    lodash.startsWith = startsWith;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;
    lodash.take = first;
    lodash.takeRight = last;
    lodash.takeRightWhile = last;
    lodash.takeWhile = first;

    // add aliases
    lodash.head = first;

    baseForOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = version;

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    baseEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    baseEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    baseEach(['concat', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });
    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // export Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

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

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

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
          }
          else { // positional argument (implicit)
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
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
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
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
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
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
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

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
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

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
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
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
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
  _s.toBool   = _s.toBoolean;

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

/*!
 * Modernizr v2.7.1
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
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
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

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

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

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


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   daneden.me/2011/12/putting-up-with-androids-bullshit/
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
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

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
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
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
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

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

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


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
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
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
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

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
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

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
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

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);


/**
* ### Version 2.0.0a
* Mixing javascript crops for a perfect flavour.
* /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.
* http://absolunet.github.io/kafe
*
* @module kafe
* @main kafe
*/
window.kafe = (function(window, undefined){

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
		* ### Version 2.0.0a
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
				'dependencies.jQuery':    window.kafejQuery().jquery,
				'dependencies.LoDash':    window._.VERSION,
				'dependencies.Modernizr': window.Modernizr._version
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
				jQuery: window.kafejQuery,

				/**
				* Lo-Dash defined under window._  
				* ref: [http://lodash.com/](http://lodash.com/)
				*
				* @property dependencies.LoDash 
				* @type Object
				**/
				LoDash: window._,

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
	_delete('window.kafejQuery');


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

})(window);





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
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe');


	test('dependencies', function() {
		ok( !_.isUndefined(kafe.dependencies.jQuery),        'jQuery - Loaded');
		ok( !_.isUndefined(kafe.dependencies.LoDash),        'LoDash - Loaded');
		ok( !_.isUndefined(kafe.dependencies.LoDash.string), 'underscore.string - Loaded');
		ok( !_.isUndefined(kafe.dependencies.Modernizr),     'modernizr - Loaded');
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
				r:  ['en ce moment','il y a moins d\'une minute','il y a environ une minute','il y a %n minutes','il y a environ une heure','il y a %n heures','hier','avant-hier','il y a %n jours','la semaine passée','il y a %n semaines','le mois passé','il y a %n mois']
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
	* @return {Boolean} If it is within a weekend or not.
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
		} else if (/^([0-9]{2,4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})$/gi.test(dtstring)) {
			dtstring += ':00';
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
		_         = kafe.dependencies.LoDash,
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
		parse('2013-01-01 00:00',               'ISO 8601 (standard)');
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
// **@import 'form'				// manual
// **@import 'geolocation'      // difficult to automate
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

	/**
	* Gets the float precision of a given number.
	*
	* @method getPrecision
	* @param {Number} number
	* @return {Number} Amount of numbers after the radix point.
	* @example
	*	kafe.number.getPrecision(5.458);
	*	// returns 3
	* @example
	*	kafe.number.getPrecision(11);
	*	// returns 0
	*/
	number.getPrecision = function(n) {
		var _precision = (n + '').split('.')[1];
		return !!_precision ? _precision.length : 0;
	};

	/**
	* Modifies, if needed, a number to only allow a miximum float precision.
	*
	* @method trimPrecision
	* @param {Number} number
	* @param {Number} precision Maximum amount of numbers after the radix point.
	* @return {Number} The modified number
	* @example
	*	kafe.number.trimPrecision(5.458, 2);
	*	// returns 5.45
	* @example
	*	kafe.number.trimPrecision(5.458, 0);
	*	// returns 5
	* @example
	*	kafe.number.trimPrecision(5.458, 6);
	*	// returns 5.458
	*/
	number.trimPrecision = function(n, precision) {
		return Math.floor(n * Math.pow(10, precision)) / Math.pow(10, precision);
	};

	/**
	* Multiply two numbers while avoiding the javascript multiplication irregularities.
	*
	* @method product
	* @param {Number} number
	* @param {Number} factor The factor causing the javascript calculation irregularity.
	* @return {Number} Product of the equation.
	* @example
	*	3 * 5.3
	*	// returns 15.8999999
	* @example
	*	kafe.number.product(3, 5.3);
	*	// returns 15.9
	*/
	number.product = function(n, factor) {
		var _power = Math.pow(10, number.getPrecision(factor));
		return (n * (factor * _power)) / _power;
	};


	return number;

})(window.kafe)});

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
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

	test('getPrecision()', function() {
		var getPrecision = function(number,expected) {
			strictEqual( kafe.number.getPrecision( number ), expected, number + ' = ' + expected );
		};
		getPrecision(5.458,	3);
		getPrecision(2,     0);
	});

	test('trimPrecision()', function() {
		var trimPrecision = function(number,precision,expected) {
			strictEqual( kafe.number.trimPrecision( number, precision ), expected, number + ' trimed to ' + precision + ' = ' + expected );
		};
		trimPrecision(5.458, 2, 5.45);
		trimPrecision(5.458, 0, 5);
		trimPrecision(5.458, 6, 5.458);
	});

	test('product()', function() {
		var product = function(number,factor,expected) {
			strictEqual( kafe.number.product( number, factor ), expected, number + ' * ' + factor + ' = ' + expected );
		};
		product(3, 5.3, 15.9);
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
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
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
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
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
				t.setTime(+t + days * 864e+5);
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
	'use strict';

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

}(jQuery));



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
					data = {},
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

(function(kafe,undefined){

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.LoDash,
		Modernizr = kafe.dependencies.Modernizr
	;

	module('kafe.storage');


	test('get/set/delete items', function() {

		/*- Persistent Items -*/

		// get/set
		kafe.storage.setPersistentItem('persistent', 'item');
		strictEqual( kafe.storage.getPersistentItem('persistent'), 'item', 'get/set an item (persistent)' );
		// delete
		kafe.storage.removePersistentItem('persistent');
		strictEqual( kafe.storage.getPersistentItem('persistent'), undefined, 'delete an item (persistent)' );

		// get expired
		var _pCookieName = 'persistent-expired-test';
		$.cookie(_pCookieName, 'init');
		kafe.storage.setPersistentItem('expire', 'item', { expires: _pCookieName });
		$.cookie(_pCookieName, 'changed');
		strictEqual( kafe.storage.getPersistentItem('expire'), undefined, 'get an expired item based on cookie (persistent)' );
		$.removeCookie(_pCookieName);
		kafe.storage.setPersistentItem('expire', 'item', { expires: -1 });
		strictEqual( kafe.storage.getPersistentItem('expire'), undefined, 'get an expired item based on time (persistent)' );

		// get - namespaces
		kafe.storage.setPersistentItem('test:first-key', 'first-value');
		kafe.storage.setPersistentItem('test:second-key', 'second-value');
		deepEqual( kafe.storage.getPersistentNamespaceKeys('test'), ['test:second-key', 'test:first-key'], 'get a namespace keys (persistent)' );
		deepEqual( kafe.storage.getPersistentNamespaceItems('test'), { 'test:second-key':'second-value', 'test:first-key':'first-value' }, 'get a namespace items (persistent)' );
		// delete - namespaces
		kafe.storage.removePersistentNamespace('test');
		deepEqual( kafe.storage.getPersistentNamespaceItems('test'), {}, 'delete a namespace (persistent)' );

		// get - All
		kafe.storage.setPersistentItem('test:first-key', 'first-value');
		kafe.storage.setPersistentItem('test:second-key', 'second-value');
		kafe.storage.setPersistentItem('user', 'my-username');
		deepEqual( kafe.storage.getAllPersistentKeys(), ['user', 'test:second-key', 'test:first-key'], 'get all keys (persistent)' );
		deepEqual( kafe.storage.getAllPersistentItems(), { 'test:first-key':'first-value', 'test:second-key':'second-value', 'user':'my-username' }, 'get all items (persistent)' );
		// delete - All
		kafe.storage.removeAllPersistent();
		deepEqual( kafe.storage.getAllPersistentItems(), {}, 'delete all items (persistent)' );

		/*- Session Items -*/

		// get/set
		kafe.storage.setSessionItem('session', 'item');
		strictEqual( kafe.storage.getSessionItem('session'), 'item', 'get/set an item (session)' );
		// delete
		kafe.storage.removeSessionItem('session');
		strictEqual( kafe.storage.getSessionItem('session'), undefined, 'delete an item (session)' );

		// get expired
		var _sCookieName = 'session-expired-test';
		$.cookie(_sCookieName, 'init');
		kafe.storage.setSessionItem('expire', 'item', { expires: _sCookieName });
		$.cookie(_sCookieName, 'changed');
		strictEqual( kafe.storage.getSessionItem('expire'), undefined, 'get an expired item based on cookie (session)' );
		$.removeCookie(_sCookieName);
		kafe.storage.setPersistentItem('expire', 'item', { expires: -1 });
		strictEqual( kafe.storage.getSessionItem('expire'), undefined, 'get an expired item based on time (session)' );

		// get - namespace
		kafe.storage.setSessionItem('test:first-key', 'first-value');
		kafe.storage.setSessionItem('test:second-key', 'second-value');
		deepEqual( kafe.storage.getSessionNamespaceKeys('test'), ['test:second-key', 'test:first-key'], 'get a namespace keys (session)' );
		deepEqual( kafe.storage.getSessionNamespaceItems('test'), { 'test:second-key':'second-value', 'test:first-key':'first-value' }, 'get a namespace items (session)' );
		// delete - namespace
		kafe.storage.removeSessionNamespace('test');
		deepEqual( kafe.storage.getSessionNamespaceItems('test'), {}, 'delete a namespace (session)' );

		// get - All
		kafe.storage.setSessionItem('test:first-key', 'first-value');
		kafe.storage.setSessionItem('test:second-key', 'second-value');
		kafe.storage.setSessionItem('user', 'my-username');
		deepEqual( kafe.storage.getAllSessionKeys(), ['user', 'test:second-key', 'test:first-key'], 'get all keys (session)' );
		deepEqual( kafe.storage.getAllSessionItems(), { 'test:first-key':'first-value', 'test:second-key':'second-value', 'user':'my-username' }, 'get all items (session)' );
		// delete - All
		kafe.storage.removeAllSession();
		deepEqual( kafe.storage.getAllSessionItems(), {}, 'delete all items (session)' );

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
		_         = kafe.dependencies.LoDash,
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
		_         = kafe.dependencies.LoDash,
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
		_         = kafe.dependencies.LoDash,
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
// **@import 'style'			// manual
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
		_         = kafe.dependencies.LoDash,
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
// **@import 'cms/drupal'
// **@import 'cms/magento'
// **@import 'cms/sitecore'		// manual
// **@import 'ext/addthis'
// **@import 'ext/bbq'
// **@import 'ext/colorbox'
// **@import 'ext/disqus'
// **@import 'ext/facebook'
// **@import 'ext/flickr'
// **@import 'ext/googlemaps'
// **@import 'ext/soundcloud'
// **@import 'ext/twitter'
// **@import 'ext/youtube'
// **@import 'plugin/carousel'  // manual
// **@import 'plugin/menu'		// manual
// **@import 'plugin/qrcode'	// manual
// **@import 'plugin/sticky'	// manual