import traceback
from modules.utils import connect_to_db
from modules.messageConsumer import MessageConsumer


def put_db_data(data, key_data, config, logger):
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
    
        # Kafka로 전달된 PMS 데이터를 TB_PUMP_SCADA 테이블에 Insert
        if key_data['TAG_TARGET'] == 'EQ_ON':
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `eq_on`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE eq_on = %s"
        elif key_data['TAG_TARGET'] == 'FREQUENCY':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `frequency`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE frequency = %s"
        elif key_data['TAG_TARGET'] == 'FLOW_RATE':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `flow_rate`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE flow_rate = %s"
        elif key_data['TAG_TARGET'] == 'PRESSURE':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `pressure`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE pressure = %s"
        elif key_data['TAG_TARGET'] == 'PROC_STAT':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `proc_stat`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE proc_stat = %s"
        elif key_data['TAG_TARGET'] == 'R_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `r_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE r_temp = %s"
        elif key_data['TAG_TARGET'] == 'S_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `s_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE s_temp = %s"
        elif key_data['TAG_TARGET'] == 'T_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `t_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE t_temp = %s"
        elif key_data['TAG_TARGET'] == 'BRG_MOTOR_DE_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `brg_motor_de_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE brg_motor_de_temp = %s"
        elif key_data['TAG_TARGET'] == 'BRG_MOTOR_NDE_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `brg_motor_nde_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE brg_motor_nde_temp = %s"
        elif key_data['TAG_TARGET'] == 'BRG_PUMP_DE_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `brg_pump_de_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE brg_pump_de_temp = %s"
        elif key_data['TAG_TARGET'] == 'BRG_PUMP_NDE_TEMP':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `brg_pump_nde_temp`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE brg_pump_nde_temp = %s"
        elif key_data['TAG_TARGET'] == 'DISCHARGE_PRESSURE':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `discharge_pressure`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE discharge_pressure = %s"
        elif key_data['TAG_TARGET'] == 'SUCTION_PRESSURE':                
            params = (key_data['PM_SCADA_ID'], key_data['IPC_LOC'], data['timestamp'], data['value'], data['value'])
            sql = f"INSERT INTO {config['db_input_table']} (`pump_scada_id`, `center_id`, `acq_date`, `suction_pressure`) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE suction_pressure = %s"
        else:
            logger.error(f"Unsupported Tag!{key_data['TAG_TARGET']}")
    
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
        # TB_TAG_MNG_PMS 테이블에서 Kafka Consumer에서 처리해야 할 태그정보를 Select
        cursor = conn.cursor(dictionary=True)
        sql = f"SELECT * FROM {config['target_tag_table']}"
        
        cursor.execute(sql)
        result = cursor.fetchall()
        logger.critical(f"result length = {len(result)}") # not critical, just to print always

        target_tag_list = {}
        for x in result:
            target_tag_list[x["TAG_ID"]] = {
                'TAG_TARGET':x["TAG_TARGET"], 
                'PM_SCADA_ID':x["PM_SCADA_ID"], 
                'IPC_LOC':x["IPC_LOC"]
            }
            
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


def consume_kafka_pms_scada(config, topic, logger):
    broker = config['kafka_brokers']
    group = config['kafka_group']
    logger.critical(f"@@@> [consume_kafka_pms_scada] TOPIC:{topic}, BROKER:{broker}, GROUP:{group}") # not critical, just to print always
    
    # TB_TAG_MNG_PMS 테이블에서 Kafka Consumer에서 처리해야 할 태그정보를 Select
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
    
            # 수신된 Kafka Mesaage가 PMS Tag인 경우, TB_PUMP_SCCADA 테이블에 Insert
            for key in target_tags.keys():
                if (message.value['tagname'] == key):
                    put_db_data(message.value, target_tags[key], config, logger)
    except:
        traceback_message = traceback.format_exc()
        logger.error(traceback_message)
        
        # raise Exception("consume_kafka_pms_scada Exceptopn!!") 


