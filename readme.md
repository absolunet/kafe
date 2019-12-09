<p align="center">
	<a href="https://absolunet.github.io/kafe/">
		<img src="https://absolunet.github.io/kafe/assets/logo-kafe.svg" width="180" height="180" alt="kafe">
	</a>
</p>

# kafe
[![npm](https://img.shields.io/npm/v/@absolunet/kafe.svg)](https://www.npmjs.com/package/@absolunet/kafe)
[![npm dependencies](https://david-dm.org/absolunet/kafe/status.svg)](https://david-dm.org/absolunet/kafe)
[![npms](https://badges.npms.io/%40absolunet%2Fkafe.svg)](https://npms.io/search?q=%40absolunet%2Fkafe)
[![Travis CI](https://travis-ci.com/absolunet/kafe.svg?branch=master)](https://travis-ci.com/absolunet/kafe/builds)


#### Mixing javascript crops for a perfect flavour.
> /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.


## Dependencies
- [jQuery](https://jquery.com/)
- [Lodash](https://lodash.com/)
- [Modernizr](https://modernizr.com/)


## Install
```shell
$ npm install @absolunet/kafe



## Usage

### Grunt
Use [grunt-includes](https://www.npmjs.org/package/grunt-includes)
```js
options: {
    includeRegexp:  /^\s*\/\/\=\srequire\s'([^']+)'\s*/,
    duplicates:     false,
    filenameSuffix: '.js',
    includePath:    './'
}
```

### Gulp
Use [gulp-include](https://www.npmjs.org/package/gulp-include)
```js
.pipe( include({
	basePath: './',
	autoExtension: true
}) )
```

### Standalone
Use the `//= require 'FILENAME'` in the file header to know which files to include manually.

## Documentation
[Full documentation](https://absolunet.github.io/kafe/)

## Release history
See the [releases](https://github.com/absolunet/kafe/releases).

## Contributing
[Issues](https://github.com/absolunet/kafe/issues) | [Pull requests](https://github.com/absolunet/kafe/pulls)

## License
MIT © [Absolunet](https://absolunet.com)
