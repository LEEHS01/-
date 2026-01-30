const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, label, printf } = winston.format;

require('dotenv').config();

const logDir = `logs`;
const logFormat = printf(({ level, message, label, timestamp }) => {
   return `${timestamp} [${label}] ${level}: ${message}`; 
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
   format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      label({ label: 'EMS' }),
      logFormat,
   ),
   
   transports: [
      new winstonDaily({
         level: process.env.LOG_LEVEL,
         datePattern: 'YYYY-MM-DD',
         dirname: logDir,
         filename: `%DATE%.log`,
         maxFiles: 30,
         zippedArchive: true,
      }),
      new winstonDaily({
         level: 'error',
         datePattern: 'YYYY-MM-DD',
         dirname: logDir + '/error',
         filename: `%DATE%.error.log`,
         maxFiles: 30,
         zippedArchive: true,
      }),
   ],

   exceptionHandlers: [
      new winstonDaily({
         level: 'error',
         datePattern: 'YYYY-MM-DD',
         dirname: logDir,
         filename: `%DATE%.exception.log`,
         maxFiles: 30,
         zippedArchive: true,
      }),
   ],   
});

if (process.env.RUN_ENV === 'dev') {
   logger.add(
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.colorize(),
            logFormat
         ),
         level: process.env.LOG_LEVEL,
         handleExceptions: true,
      }),
   );
}

wrap = {};

wrap.error = logger.error.bind(logger);
wrap.error = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");
   logger.log.apply(logger, ["error", str]);
};

wrap.warn = logger.warn.bind(logger);
wrap.warn = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");

   logger.log.apply(logger, ["warn", str]);
};

wrap.info = logger.info.bind(logger);
wrap.info = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");

   logger.log.apply(logger, ["info", str]);
};

wrap.verbose = logger.verbose.bind(logger);
wrap.verbose = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");

   logger.log.apply(logger, ["verbose", str]);
};

wrap.debug = logger.debug.bind(logger);
wrap.debug = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");

   logger.log.apply(logger, ["debug", str]);
};

wrap.silly = logger.silly.bind(logger);
wrap.silly = function () {
   let args = Array.prototype.slice.call(arguments);
   args = args.map(x => {
      return ((x instanceof Object) ? JSON.stringify(x) : x);
   })
   let str = args.join(" ");

   logger.log.apply(logger, ["silly", str]);
};

module.exports = {
   logger: wrap
}