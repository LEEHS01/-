import traceback
import mysql.connector


def connect_to_db(host, port, user, password, databas, logger):
    max_retries = 3
    retries = 0
    conn = None
    
    while retries < max_retries:
        try:
            conn = mysql.connector.connect(
                host = host,
                port = port,
                user = user,
                password = password,
                database = databas
            )
            
            if conn.is_connected():
                return conn
            
        except mysql.connector.Error as err:
            logger.error(f"DB connection error!!: {err}")
            
            retries += 1
            print(f"Retry {retries}/{max_retries}...")
            
    if conn is None:
        logger.error("DB connection failed!!")
        raise Exception("DB connection failed!!")
        
    return conn

