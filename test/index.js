//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const tester = require('@absolunet/tester');


const EXCLUDE = [
	`!dist/**`,
	`!docs/**`,
	`!src/**`
];


tester.npmPackage.validate({
	js:           tester.all.js.concat(EXCLUDE),
	editorconfig: tester.all.editorconfig.concat(EXCLUDE)
});
