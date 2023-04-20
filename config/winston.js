const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

//can add check for environment if nessesary
const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.File({ filename })
    ]
});

if(process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'development') {
    logger.add(new transports.Console({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }))
} else {
    logger.add(new transports.Console({
        level: 'info',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        )
    }))
}

// logger.info('hello world');
// logger.debug('debug test');

module.exports = logger;