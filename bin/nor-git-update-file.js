#!/usr/bin/env node
/* $filename: nor-git-update-file.js $ */

"use strict";
var debug = require('nor-debug');
var fs = require('nor-fs');
var argv = require('optimist').boolean('v').argv;

var verbose_level = 1;

if(argv.q || argv.quiet) {
	verbose_level = 0;
}

if(argv.v || argv.verbose) {
	verbose_level = parseInt(argv.v || argv.verbose, 10) || 1;
}

try {

	argv._.forEach(function(file) {

		if(verbose_level >= 3) {
			debug.log(''+ file + ': checking file...');
		}

		debug.assert(file).is('string');
		var filename = require('path').basename(file);
		var changed = false;
		var data = fs.sync.readFile(file, {'encoding':'utf8'});
		debug.assert(data).is('string');

		data = data.replace(/\$filename:([^$]*$]+)\$/g, function() {
			changed = true;
			return '$'+'filename: '+ filename + ' $'; 
		});
		
		if(changed) {
			fs.sync.writeFile(file+'.new', data, {'encoding':'utf8'});
			fs.sync.rename(file, file+'.bak');
			fs.sync.rename(file+'.new', file);
			fs.sync.unlink(file+'.bak');
			if(verbose_level >= 1) {
				console.log(''+ file + ': Successfully changed');
			}
		} else {
			if(verbose_level >= 2) {
				console.log(''+ file + ': Nothing to change');
			}
		}

	});

} catch(e) {
	debug.error(e);
}

/* EOF */
