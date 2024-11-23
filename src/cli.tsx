#!/usr/bin/env node
import { withFullScreen } from 'fullscreen-ink'
import React from 'react'
import meow from 'meow';
import App from './app.js'
import { join } from 'node:path';

const cli = meow(
	`
	Usage
	  $ files

	Options
		--path  The default path, if not provided uses working directory
		-p  Alias for --path

	Examples
	  $ files -p ./dir
`,
	{
		importMeta: import.meta,
		flags: {
			path: {
				type: 'string',
			},
			p: {
				type: 'string',
			},
		},
	},
);

let defaultPath = process.cwd().replaceAll('\\', '/')
if (cli.flags.path || cli.flags.p)
	defaultPath = join(process.cwd(), cli.flags.p ?? cli.flags.path ?? '').replaceAll('\\', '/')

withFullScreen(<App defaultPath={defaultPath} />).start()
