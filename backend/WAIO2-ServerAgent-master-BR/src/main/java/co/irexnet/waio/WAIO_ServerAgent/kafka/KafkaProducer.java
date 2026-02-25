package co.irexnet.waio.WAIO_ServerAgent.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer
{
	private final KafkaTemplate<String, String> localKafkaTemplate;
    private final KafkaTemplate<String, String> vipKafkaTemplate;
    private final KafkaTemplate<String, String> bdKafkaTemplate;

//     public void sendMessage(String topic, String payload)
//     {
// //        log.debug("send payload = '{}' top topic='{}'", payload, topic);

//         ListenableFuture<SendResult<String, String>> listenable = kafkaTemplate.send(topic, payload);
//     }

    public void sendMessageToLocal(String topic, String payload){
        ListenableFuture<SendResult<String, String>> listenable = localKafkaTemplate.send(topic, payload);
    }

    public void sendMessageToVip(String topic, String payload){
        ListenableFuture<SendResult<String, String>> listenable = vipKafkaTemplate.send(topic, payload);
    }

    // 260206 이현수 보령정수장 irdc 요청사항 호출부만 주석처리 현재 아래 메서드는 죽은 코드 다른곳에서 사용 안함
    public void sendMessageToBd(String topic, String payload)
    {
//        log.debug("send payload = '{}' top topic='{}'", payload, topic);

        ListenableFuture<SendResult<String, String>> listenable = bdKafkaTemplate.send(topic, payload);
    }
}
