package co.irexnet.waio.WAIO_ServerAgent.kafka;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import co.irexnet.waio.WAIO_ServerAgent.dto.SystemConfigDTO;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;

@EnableKafka
@Configuration
@Slf4j
public class KafkaConsumerConfig
{
    @Autowired
    DatabaseServiceImpl databaseService;
    
    // private String groupId = "operation1";
    // private String groupId = "collector";
    private String groupId = CommonValue.KAFKA_GROUP_ID;

    @Bean
    public ConsumerFactory<String, String> consumerFactory()
    {
//        SystemConfigDTO systemConfig = databaseService.getSystemConfig();
//        String strBootstrapServers = systemConfig.getKfk_addr();
    	String strBootstrapServers = "localhost:9092";
    	// String strBootstrapServers = "192.168.100.126:9092,192.168.100.127:9092,192.168.100.127:9093"; //로컬 개발용
    	// String strBootstrapServers = address1 + address2 + address3; //로컬 개발용
    	//String strBootstrapServers = "10.63.3.212:9092,10.63.3.213:9092,10.63.3.213:9093"; //정수장 배포용
        log.debug("Database Bootstrap Server : {}", strBootstrapServers);
        Map<String, Object> properties = new HashMap<>();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, strBootstrapServers);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 10000);
        properties.put(ConsumerConfig.FETCH_MIN_BYTES_CONFIG, 1024*1024);
        properties.put(ConsumerConfig.FETCH_MAX_WAIT_MS_CONFIG, 1000);
        return new DefaultKafkaConsumerFactory<>(properties);
    }

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory()
    {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setBatchListener(true);
        return factory;
    }
}
