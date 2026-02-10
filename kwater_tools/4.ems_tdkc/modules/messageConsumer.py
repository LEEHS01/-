from json import loads
from kafka import KafkaConsumer

class MessageConsumer:
    def __init__(self, broker, topic, group):
        self.broker = broker
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=self.broker,
            value_deserializer=lambda x: loads(x.decode('utf-8')),
            # value_deserializer=lambda x: x.decode(
            #     "utf-8"
            # ),  # Decode message value as utf-8
            group_id=group,
            # auto_offset_reset="earliest",  # Start consuming from earliest available message
            auto_offset_reset="latest",
            enable_auto_commit=True,  # Commit offsets automatically
        )

    def get_consumer(self):
        return self.consumer
