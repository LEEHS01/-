[여러 개의 Kafka Consumer를 하나의 도커에서 실행하는 프로그램]
1. epms_kafka_consumer.py: 각각의 Kafka Consumer 모듈을 BlockingScheduler의 job으로 실행(현재 자율운영의 이벤트를 처리하는 kaf-ka_alarm_consumer는 Comment out되어 있음)
2. kaf-ka_ems_scada_consumer.py: SCADA에서 전달되는 EMS 관련 Tag 데이터를 TB_DATA_RAW_TAG에 적재하는 Kafka Consumer
3. kaf-ka_pms_scada_consumer.py: SCADA에서 전달되는 PMS 관련 Tag 데이터를 TB_PUMP_SCADA에 적재하는 Kafka Consumer
4. kafka_pms_vib_consumer.py: IPC에서 전달된 PMS 진동데이터를 TB_PM에 적재하는 Kafka Consumer
5. kafka_alarm_consumer.py: 자율운영에서 전달하는 이벤트를 TB_EMS_ALARM에 적재하는 Kafka Consumer
