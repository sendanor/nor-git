#!/usr/bin/env node
"use strict";
var debug = require('nor-debug');
var fs = require('nor-fs');
var argv = require('optimist').boolean('v').argv;

try {

	argv._.forEach(function(file) {
		debug.assert(file).is('string');
		var filename = require('path').basename(file);
		var data = fs.sync.readFile(file, {'encoding':'utf8'});
		debug.assert(data).is('string');
		data = data.replace(/\$filename:[^$]+\$/g, '$filename: '+filename+'$');
		fs.sync.writeFile(file+'.new', data, {'encoding':'utf8'});
		fs.sync.move(file, file+'.bak');
		fs.sync.move(file+'.new', file);
		fs.sync.unlink(file+'.bak');
	});

} catch(e) {
	debug.error(e);
}

/* EOF */
