const mariadb = require('mariadb');

// MariaDB 연결 설정

try {
    const ems_db = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        acquireTimeout: Number(process.env.DB_TIMEOUT),
        connectTimeout: Number(process.env.DB_TIMEOUT)
    });
    
    module.exports = {
        ems_db
    }
}
catch(err) {
    console.error('Failed to connect to database: ')
    console.error(err)
}
