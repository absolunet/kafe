<img align="right" src="<%= HOMEPAGE %>/assets/logo-<%= PACKAGE %>.png" width="160" height="256" />
### <%= PACKAGE %> v<%= VERSION %>
#### <%= DESCRIPTION %>
> <%= DEFINITION %>

<br>

## Quick start

#### Requirements
A jQuery instance that will be copied in <%= PACKAGE %>.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script>window.<%= PACKAGE %>jQuery = window.jQuery.noConflict()</script>
```

#### With [Grunt](http://gruntjs.com/)
- Take the files under [builds](<%= REPO %>/builds) folder and put them in a `libs` folder next to your `gruntfile.js`.
- Use [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs) with a setup looking like this:

```js
config.requirejs.core = {
	options: {
		baseUrl:                 './',
		name:                    'libs/<%= PACKAGE %>/<%= PACKAGE %>',
		include:                 ['libs/<%= PACKAGE %>/date','libs/<%= PACKAGE %>/string'],
		out:                     'js/<%= PACKAGE %>-build.js',
		optimize:                'uglify',
		preserveLicenseComments: false,
		skipModuleInsertion:     true,
		findNestedDependencies:  true,
		pragmasOnSave:           { excludeRequire: true }
	}
};
```

#### Standalone
- Take the files under [builds](<%= REPO %>/builds) folder and put them in your project.
- Remove the `require()` in the files header and include them manually.


{{EXCLUDE}}
## Documentation
Visit the [<%= HOMEPAGE %>](<%= HOMEPAGE %>) website for all the things.
{{/EXCLUDE}}

## Release history
See the [CHANGELOG](<%= REPO %>/CHANGELOG).
