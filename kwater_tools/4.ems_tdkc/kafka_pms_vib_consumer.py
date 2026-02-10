import traceback
from modules.utils import connect_to_db
from modules.messageConsumer import MessageConsumer


def put_db_data(data, config, logger):
    try:
        # Configuration 파일에 설정된 DB에 연결
        conn = connect_to_db(config['db_host'], 
                        config['db_port'], 
                        config['db_user'], 
                        config['db_password'], 
                        config['database'], 
                        logger)

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        return

    try:
        cursor = conn.cursor()

        # Kafka로 전달된 진동 데이터를 TB_PM 테이블에 Insert
        sql = f"INSERT IGNORE INTO {config['db_input_table']} (EQ_ID, PM_ID, CH_ID, ACQ_TI, DT_ARY, PROC_STT, IPC_LOC) VALUES (%s, %s, %s, %s, %s, %s, %s)"

        cursor.execute(sql, data)
        conn.commit()    
        
        cursor.close()    
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    try:
        conn.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)


def consume_kafka_pms_vib(config, topic, logger):
    broker = config['kafka_brokers']
    group = config['kafka_group']
    logger.critical(f"@@@> [consume_kafka_pms_vib] TOPIC:{topic}, BROKER:{broker}, GROUP:{group}") # not critical, just to print always

    try:
        # Topic=PMS_VIB_CA, Broker=localhost:9092, Group=변경 가능
        mc = MessageConsumer(broker, topic, group)
        consumer = mc.get_consumer()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        
        raise Exception("Kafka MessageConsumer failed!!") 

    try:
        # Kafka Message 수신 Loop
        for message in consumer:
            logger.debug(f"[{topic}]: {message.value[0]}")

            # 수신된 Kafka Mesaage를 진동 데이터로 TB_PM 테이블에 Insert
            put_db_data(message.value, config, logger)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        
        # raise Exception("consume_kafka_pms_vib Exceptopn!!") 

