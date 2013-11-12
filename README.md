<img align="right" src="http://absolunet.github.io/kafe/assets/logo-kafe.png" width="160" height="256" />
### kafe v2.0.0a
#### Mixing javascript crops for a perfect flavour.
> /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.

<br>

## Quick start

#### Requirements
A jQuery instance that will be copied in kafe.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script>window.kafejQuery = window.jQuery.noConflict()</script>
```

#### With [Grunt](http://gruntjs.com/)
- Take the files under [builds](https://github.com/absolunet/kafe/tree/master/builds) folder and put them in a `libs` folder next to your `gruntfile.js`.
- Use [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs) with a setup looking like this:

```js
config.requirejs.core = {
	options: {
		baseUrl:                 './',
		name:                    'libs/kafe/kafe',
		include:                 ['libs/kafe/date','libs/kafe/string'],
		out:                     'js/kafe-build.js',
		optimize:                'uglify',
		preserveLicenseComments: false,
		skipModuleInsertion:     true,
		findNestedDependencies:  true,
		pragmasOnSave:           { excludeRequire: true }
	}
};
```

#### Standalone
- Take the files under [builds](https://github.com/absolunet/kafe/tree/master/builds) folder and put them in your project.
- Remove the `require()` in the files header and include them manually.



## Documentation
Visit the [http://absolunet.github.io/kafe](http://absolunet.github.io/kafe) website for all the things.


## Release history
See the [CHANGELOG](https://github.com/absolunet/kafe/tree/master/CHANGELOG).
