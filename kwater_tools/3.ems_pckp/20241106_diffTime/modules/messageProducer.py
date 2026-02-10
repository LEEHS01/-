import json
from kafka import KafkaProducer

class MessageProducer:
    def __init__(self, broker, topic):
        self.broker = broker
        self.topic = topic
        self.producer = KafkaProducer(
            bootstrap_servers=self.broker,
            value_serializer=lambda x: json.dumps(x).encode("utf-8"),
            # acks=0,
            acks=1,
            api_version=(2, 5, 0),
            retries=3,
        )

    def send_message(self, msg, auto_close=True):
        try:
            future = self.producer.send(self.topic, msg)
            self.producer.flush() 
            if auto_close:
                self.producer.close()
            future.get(timeout=2)
            return {"status_code": 200, "error": None}
        except Exception as e:
            print("error:::::",e)
            return e
        
    def close(self):
        try:
            self.producer.close()
        except Exception as e:
            print("error:::::",e)
            return e
