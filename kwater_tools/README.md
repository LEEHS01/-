# tools
EMS/PMS용 Kafka Consumer &amp; Producer, DB Event Scheduler 등  시각화와 AI 모듈을 제외한 프로그램 모음

[ 1.ems_dbes: DB Event Scheduler 프로그램 ]
* 주기적으로 SQL을 실행하여 DB 데이터를 복사하거나 삭제
* 피크 이벤트 생성을 위한 주기적인 SQL 실행

[ 2.ems_mdkp: Kafka Producer 프로그램 ]
* EMS/PMS HMI 화면 표출에 필요한 DB Data를 전송하는 Kafka Producder
* 시각화에서 팝업으로 표출된 EMS 알람 이벤트를 자율운영에서도 공유할 수 있도록 전송하는 Kafka Producer

[ 3.ems_pckp: 펌프제어 Tag 전송 프로그램 ]
* EMS AI 모듈에서 도출된 펌프 제어 Tag를 전송하는 Kafka Producer

[4.ems_tdkc: 여러 개의 Kafka Consumer를 하나의 도커에서 실행하는 프로그램]
* epms_kafka_consumer.py: 각각의 Kafka Consumer 모듈을 BlockingScheduler의 job으로 실행(현재 자율운영의 이벤트를 처리하는 kaf-ka_alarm_consumer는 Comment out되어 있음)
* kaf-ka_ems_scada_consumer.py: SCADA에서 전달되는 EMS 관련 Tag 데이터를 TB_DATA_RAW_TAG에 적재하는 Kafka Consumer
* kaf-ka_pms_scada_consumer.py: SCADA에서 전달되는 PMS 관련 Tag 데이터를 TB_PUMP_SCADA에 적재하는 Kafka Consumer
* kafka_pms_vib_consumer.py: IPC에서 전달된 PMS 진동데이터를 TB_PM에 적재하는 Kafka Consumer
* kafka_alarm_consumer.py: 자율운영에서 전달하는 이벤트를 TB_EMS_ALARM에 적재하는 Kafka Consumer

[ 5.pms_delete_vib_data: PMS 진동 데이터 삭제 프로그램 ]
* IPC에서 생성되는 PMS 진동 데이터를 주기적으로 삭제: Kafka 전송 오류로 진동데이터가 Backup 폴더로 이동되지 못할 경우 1시간 이전 데이터는 삭제
* IPC에서 생성되어 PMS 진동 데이터 수집용 Kafka 프로그램을 통해 AI 플랫폼으로 전송 완료된 후 Backup 폴더로 이동된 진동 데이터를 주기적으로 삭제: 7일 이전 데이터 삭제

[ 6.pms_kafka_producer_ipc: PMS 진동 데이터 수집용 Kafka 프로그램 ]
* IPC에 설치된 PMS 진동데이터 수집용 프로그램으로 DAQ에서 생성된 펌프모터 진동데이터를 AI 플랫폼으로 전송하는 Kafka Producer
