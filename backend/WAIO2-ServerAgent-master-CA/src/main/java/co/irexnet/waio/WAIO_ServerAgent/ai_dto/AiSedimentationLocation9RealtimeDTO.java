package co.irexnet.waio.WAIO_ServerAgent.ai_dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// 침전지 9지 세부현황
public class AiSedimentationLocation9RealtimeDTO
{
    // 대차 위치
    @JsonProperty("e_loc_sc_9")
    private AiSedimentationSludgeCollectorPosition e_loc_sc_9;

    // 슬러지 양
    @JsonProperty("AIE-5009")
    private Float AIE_5009;

    // 대차 스케쥴
    @JsonProperty("AIE-6009")
    private AiSedimentationSludgeCollectorSchedule AIE_6009;

    // 인발밸브 상태
    private AiSedimentation9drnvv e_drn_vv9;

    // 슬러지 양 트렌드
    @JsonProperty("AIE-5109")
    private Object AIE_5109;

    // 대차 시작 제어
    @JsonProperty("AIE-7009")
    private Integer AIE_7009;

    // 시작 시 제어
    @JsonProperty("AIE-8009")
    private Integer AIE_8009;

    // 시작 분 제어
    @JsonProperty("AIE-8109")
    private Integer AIE_8109;

    // 운영 상태
    @JsonProperty("e_operation_mode")
    private Integer e_operation_mode;
    
    // 슬러지 경과시간
    @JsonProperty("AIE-5019")
    private Float AIE_5019;
}
