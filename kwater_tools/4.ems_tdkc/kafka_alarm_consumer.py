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

        # Kafka로 전달된 알람 데이터를 TB_EMS_ALARM 테이블에 Insert
        sql = f"INSERT IGNORE INTO {config['db_input_table']} (`ALARM_ID`,`TIME`,`MSG`,`LINK`,`FLAG`) values (%s,%s,%s,%s,%s)"        
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


def consume_kafka_alarm(config, topic, logger):
    broker = config['kafka_brokers']
    group = config['kafka_group']
    logger.critical(f"@@@> [consume_kafka_alarm] TOPIC:{topic}, BROKER:{broker}, GROUP:{group}") # not critical, just to print always

    try:
        # Topic=ai_popup, Broker=localhost:9092, Group=변경 가능
        mc = MessageConsumer(broker, topic, group)
        consumer = mc.get_consumer()
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
                
        raise Exception("Kafka MessageConsumer failed!!")

    try:
        # Kafka Message 수신 Loop
        for message in consumer:
            # 수신된 Kafka Mesaage에서 Alarm ID, Time, Message, Link 추출
            ALARM_ID = str(message.value['alarm_id'])
            TIME = message.value['time']
            MSG = message.value['message']
            LINK = message.value['url']
            if (ALARM_ID is None) or (TIME is None) or (MSG is None) or (LINK is None):
                logger.error(f"DATA ERROR: ALARM_ID={ALARM_ID}, TIME={TIME}, MSG={MSG}, LINK={LINK}")
                continue
            if ALARM_ID[0]=='2': # ems_alarm pass
                logger.debug(f"[{topic}]: {ALARM_ID}: Pass EMS Alarm!")            
                continue
            
            data = (ALARM_ID, TIME, MSG, LINK, '2')
            
            logger.debug(f"[{topic}]: {message.value}")            
            # 추출된 Alarm ID, Time, Message, Link를 TB_EMS_ALARM 테이블에 Insert
            put_db_data(data, config, logger)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        
        # raise Exception("consume_kafka_alarm Exceptopn!!") 

