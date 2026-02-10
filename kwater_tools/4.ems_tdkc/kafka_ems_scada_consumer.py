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
        
        # Kafka로 전달된 EMS 데이터를 TB_DATA_RAW_TAG 테이블에 Insert
        params = (data['timestamp'], data['tagname'], data['value'], data['quality'])
        sql = f"insert ignore into {config['db_input_table']} (`ts`,`tagname`,`value`,`quality`) values (%s,%s,%s,%s)"
    
        cursor.execute(sql, params)
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


def get_target_tag_list(config, logger):
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
        # TB_TAG_MNG_EMS 테이블에서 Kafka Consumer에서 처리해야 할 태그정보를 Select
        cursor = conn.cursor(dictionary=True)
        sql = f"SELECT * FROM {config['target_tag_table']}"
        
        cursor.execute(sql)
        result = cursor.fetchall()
        logger.critical(f"result length = {len(result)}") # not critical, just to print always

        target_tag_list = []
        for x in result:
            if (x["PROC_CD"] == 'EMS'):
                target_tag_list.append(x["TAG_SN"])
                
        cursor.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    logger.critical(target_tag_list) # not critical, just to print always
    
    try:
        conn.close()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
    
    return target_tag_list


def consume_kafka_ems_scada(config, topic, logger):
    broker = config['kafka_brokers']
    group = config['kafka_group']
    logger.critical(f"@@@> [consume_kafka_ems_scada] TOPIC:{topic}, BROKER:{broker}, GROUP:{group}") # not critical, just to print always
    
    # TB_TAG_MNG_EMS 테이블에서 Kafka Consumer에서 처리해야 할 태그정보를 Select
    target_tags = get_target_tag_list(config, logger)

    if target_tags is None:
        logger.error("DB connection failed!!")
        raise Exception("DB connection failed!!")

    if len(target_tags) == 0:
        logger.error("Return!![target tag table size: 0]")
        return

    try:
        # Topic=CCAWGS1_data 또는 CCAWGS2_data, Broker=localhost:9092, Group=변경 가능
        mc = MessageConsumer(broker, topic, group)
        consumer = mc.get_consumer()

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
                
        raise Exception("Kafka MessageConsumer failed!!")

    try:
        # Kafka Message 수신 Loop
        for message in consumer:
            logger.debug(f"[{topic}]: {message.value}")
            # 수신된 Kafka Mesaage가 EMS Tag인 경우, TB_DATA_RAW_TAG 테이블에 Insert
            if (message.value['tagname'] in target_tags):
                put_db_data(message.value, config, logger)

    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)

        # raise Exception("consume_kafka_ems_scada Exceptopn!!") 
