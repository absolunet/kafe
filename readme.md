<p align="center">
	<a href="https://absolunet.github.io/kafe/">
		<img src="https://absolunet.github.io/kafe/assets/logo-kafe.svg" width="180" height="180" alt="kafe">
	</a>
</p>

# kafe ![bower](https://img.shields.io/bower/v/kafe.svg)
#### Mixing javascript crops for a perfect flavour.
> /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.

## Installation
```bash
bower install kafe
```

## Dependencies
- [jQuery](http://jquery.com/)
- [Lodash](http://lodash.com/)
- [Modernizr](http://modernizr.com/)


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
