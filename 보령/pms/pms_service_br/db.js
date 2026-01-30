const logger = require('./logger').logger;
const mariadb = require('mariadb')
require('dotenv').config()

try {
	  const pms_db = mariadb.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		acquireTimeout: Number(process.env.DB_TIMEOUT),
		connectTimeout: Number(process.env.DB_TIMEOUT),
		multipleStatements: true,
		typeCast: function (field, next) {
			if (field.type == 'VAR_STRING') {
				return field.string();
			}
			return next();
		}
	})

	module.exports = {
		pms_db
	}
} catch(err) {
	logger.error('Failed to connect to database!')
	logger.error(err)
}