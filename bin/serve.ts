#! /usr/bin/env node


import shell from 'shelljs';
const yargs = require('yargs/yargs');
import { hideBin } from 'yargs/helpers';
import express = require('express');
import helmet from 'helmet';
import log4js from 'log4js';



const argv = yargs(hideBin(process.argv)).argv
const logger = log4js.getLogger("serve");


// if we have a loglevel
if (argv.loglevel) {
    logger.level = argv.loglevel;
} else {
    logger.level = "info";
}


const app = express();
const port = argv.port || 80;
logger.debug("Initialized Express server");

// if no path is specified, use current working directory. path is not an option, it comes directly after. "serve <path>"
const path = argv._[0] || process.cwd();
logger.debug('Serving ' + path);

logger.info('Starting HTTP server on port ' + port)

app.use((req, res, next) => {
    logger.debug(req.method + ' ' + req.url);
    next();
});


// use express.static in directory user is running command from
app.use(express.static(path));
if (argv.helmet) {
    app.use(helmet());
    logger.info('Helmet enabled');
}

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
    })
    .on('error', (err) => {
        logger.error(`Server error: ${err.message}`);
    });


