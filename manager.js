//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const manager = require('@absolunet/manager');

manager.singleScriptsRunner({
	tasks: {
		build: {
			postRun: ({ terminal }) => {
				terminal.run('grunt');
			}
		}
	}
});
