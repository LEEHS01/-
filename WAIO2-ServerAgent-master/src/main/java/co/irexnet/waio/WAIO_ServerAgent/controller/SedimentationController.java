package co.irexnet.waio.WAIO_ServerAgent.controller;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.*;
import co.irexnet.waio.WAIO_ServerAgent.dto.*;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@EnableSwagger2
@Slf4j
public class SedimentationController {
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 침전 공정 최근 데이터 조회
     * 
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/latest/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestSedimentation(@PathVariable int processStep) {
        log.debug("Recv getLatestSedimentation");
        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
        // get ai_sedimentation_realtime
        AiSedimentationRealtimeDTO aiSedimentationRealtime = databaseService
                .getLatestAiSedimentationRealtimeValue(processStep);
        log.debug("getLatestAiSedimentationRealtimeValue, result:[{}]", aiSedimentationRealtime != null ? 1 : 0);

        // get ai_sedimentation_init(e_operation_mode)
        AiProcessInitDTO aiSedimentationInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE,
                processStep);
        log.debug("getAiSedimentationInit, result:[{}]", aiSedimentationInit != null ? 1 : 0);

        // get ai_sedimentation_init
        List<AiProcessInitDTO> aiSedimentationInitList = databaseService.getAllAiSedimentationInit(processStep);
        log.debug("getAllAiSedimentationInit, result:[{}]", aiSedimentationInitList.size());

        // get sedimentation_realtime
        List<ProcessRealtimeDTO> sedimentationRealtime = databaseService
                .getLatestSedimentationRealtimeValue(strPartitionName, processStep);
        log.debug("getLatestSedimentationRealtimeValue, result:[{}]", sedimentationRealtime.size());

        // get tag_manage
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_SEDIMENTATION,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_SEDIMENTATION, tagManageList.size());

        if (aiSedimentationRealtime != null) {
            // JSON 처리를 위한 ObjectMapper 선언
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiSedimentationInfo = new LinkedHashMap<>();

            // update_time
            aiSedimentationInfo.put("upd_ti", aiSedimentationRealtime.getUpd_ti());

            // operation mode
            aiSedimentationInfo.put("ai_opr", aiSedimentationInit != null ? aiSedimentationInit.getInit_val().intValue()
                    : aiSedimentationRealtime.getAi_opr());
            for (AiProcessInitDTO dto : aiSedimentationInitList) {
                if (dto.getItm().equalsIgnoreCase("e_sc_set_sludge_q") == true) {
                    // 슬러지 수집기 운행 기준 적산 슬러지 양
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set_max_wait") == true) {
                    // 슬러지 수집기 운행 대기 최대 일
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e_set_lt") == true) {
                    // 슬러지 수집기 편도 운전 거리
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set_ti") == true) {
                    // 슬러지 수집기 운전 시간
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e_low_hour") == true) {
                    // 대차 운전주기 최소기준시간
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set1") == true) {
                    // 1지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set2") == true) {
                    // 2지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set3") == true) {
                    // 3지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set4") == true) {
                    // 4지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set5") == true) {
                    // 5지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set6") == true) {
                    // 6지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set7") == true) {
                    // 7지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set8") == true) {
                    // 8지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set9") == true) {
                    // 9지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                } else if (dto.getItm().equalsIgnoreCase("e_sc_set10") == true) {
                    // 10지 AI 운영모드
                    aiSedimentationInfo.put(dto.getItm(), dto.getInit_val().intValue());
                }
            }

            // Realtime data from SCADA
            Float mm_fr = 0.0f;
            Float c1_cf = 0.0f;
            Float c2_cf = 0.0f;
            Float c_cf = 0.0f;
            Float b_in_fr = 0.0f;

            // tag_manage에 정의한 태그명을 통해 실시간 데이터를 가져와 aiSedimenationInfo에 등록
            for (TagManageDTO tagManage : tagManageList) {
                for (ProcessRealtimeDTO dto : sedimentationRealtime) {
                    if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 유입 유량
                        b_in_fr = Float.parseFloat(dto.getTag_val());
                    } else if (tagManage.getItm().equalsIgnoreCase("b_tb") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 탁도
                        aiSedimentationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("c1_cf") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 약품 사용량 계산식 활용 데이터
                        c1_cf = Float.parseFloat(dto.getTag_val());
                    } else if (tagManage.getItm().equalsIgnoreCase("c2_cf") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        c2_cf = Float.parseFloat(dto.getTag_val());
                    } else if (tagManage.getItm().equalsIgnoreCase("c_mm_fr_etc") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        aiSedimentationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    }
                }
            }
            aiSedimentationInfo.put("b_in_fr", b_in_fr);
            // 약품 종류
            Map<String, Object> c_cf_coagulant = databaseService.selectUsrMng("c" + processStep + "_cf_coagulant");
            aiSedimentationInfo.put("c_cf_coagulant", c_cf_coagulant.get("init_val"));

            // 약품 사용량 계산식 (약품 사용률 계산식 활용함)
            c_cf = c1_cf != 0 ? c1_cf : c2_cf; // c1_cf, c2_cf중 값이 있는 값으로 대입
            mm_fr = c_cf * b_in_fr / 1000; // 약품 주입량 = 약품투입률 * 원수 유입유량 / 1000 (약품에있는 공식 활용 - 확인필요)

            // 계열별 혼화기 약품 종류
            // aiSedimentationInfo.put("d1_mm_coagulant", d1_mm_fr_apac > d1_mm_fr_polymax ?
            // "APAC" : "POLYMAX");
            // aiSedimentationInfo.put("d2_mm_coagulant", d2_mm_fr_apac > d2_mm_fr_polymax ?
            // "APAC" : "POLYMAX");

            // 계열별 혼화기 유량
            // aiSedimentationInfo.put("d1_mm_fr", d1_mm_fr_apac > d1_mm_fr_polymax ?
            // d1_mm_fr_apac : d1_mm_fr_polymax);
            // aiSedimentationInfo.put("d2_mm_fr", d2_mm_fr_apac > d2_mm_fr_polymax ?
            // d2_mm_fr_apac : d2_mm_fr_polymax);
            // aiSedimentationInfo.put("c_mm_fr", aiSedimentationRealtime.getC_mm_fr1() +
            // aiSedimentationRealtime.getC_mm_fr2());//약품사용량 = 약품1사용량 + 약품2사용량
            aiSedimentationInfo.put("c_mm_fr", mm_fr);
            // aiSedimentationInfo.put("c_mm_fr_etc",
            // aiSedimentationRealtime.getC_mm_fr_etc()); // 보조약품 주입률

            // AI 슬러지 발생량 예측
            aiSedimentationInfo.put("ai_e1_sludge", aiSedimentationRealtime.getAIE_5300());

            // 계열별 계면계 수위
            // aiSedimentationInfo.put("e1_interface_le",
            // aiSedimentationRealtime.getAIE_9901());
            // aiSedimentationInfo.put("e2_interface_le",
            // aiSedimentationRealtime.getAIE_9902());

            try {
                // AI 총 슬러지 발생량 예측
                LinkedHashMap<String, Object> aiSludgeMapJson = objectMapper
                        .readValue(aiSedimentationRealtime.getAIE_5200(), LinkedHashMap.class);
                ArrayList<String> aiSludgeMapKeyList = new ArrayList<>(aiSludgeMapJson.keySet());
                Object aiSludgeMapJsonTemp = aiSludgeMapJson.get(aiSludgeMapKeyList.get(0));
                LinkedHashMap<String, Float> aiSludgeMap = objectMapper.convertValue(aiSludgeMapJsonTemp,
                        LinkedHashMap.class);
                LinkedHashMap<String, Float> sludgeByLocation = new LinkedHashMap<>();
                LinkedHashMap<String, Float> elapsedTimeByLocation = new LinkedHashMap<>();
                aiSedimentationInfo.put("ai_e_total_sludge", aiSludgeMap);

                // 1지 데이터를 추출하여 location1Dto에 저장
                // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                String strTemp = aiSedimentationRealtime.getAIE_9001();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                LinkedHashMap<String, Object> mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                Object objectTemp = mapTemp.get(keyList.get(0));

                List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();

                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation1RealtimeDTO location1Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation1RealtimeDTO.class);

                // 1지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv1_1", location1Dto.getE_drn_vv1().getE_drn_vv1_1());
                aiSedimentationInfo.put("e_drawing_vv1_2", location1Dto.getE_drn_vv1().getE_drn_vv1_2());
                aiSedimentationInfo.put("e_drawing_vv1_3", location1Dto.getE_drn_vv1().getE_drn_vv1_3());
                aiSedimentationInfo.put("e_drawing_vv1_4", location1Dto.getE_drn_vv1().getE_drn_vv1_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv1_5", location1Dto.getE_drn_vv1().getE_drn_vv1_5());
                    aiSedimentationInfo.put("e_drawing_vv1_6", location1Dto.getE_drn_vv1().getE_drn_vv1_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_1", location1Dto.getE_operation_mode());

                // 1지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc1_f", location1Dto.getE_loc_sc_1().getF());
                aiSedimentationInfo.put("e_sc1_b", location1Dto.getE_loc_sc_1().getB());

                // 1지 수집기 운영 스케쥴
                Map<String, String> scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location1Dto.getAIE_6001().getLatest());
                scScheduleMap.put("start", location1Dto.getAIE_6001().getStart());
                scScheduleMap.put("stop", location1Dto.getAIE_6001().getStop());
                scScheduleMap.put("next_start", location1Dto.getAIE_6001().getNext_start());
                scScheduleMap.put("next_end", location1Dto.getAIE_6001().getNext_end());
                scScheduleMap.put("inbal", location1Dto.getAIE_6001().getInbal());
                aiSedimentationInfo.put("e_sc1_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("1지",location1Dto.getAIE_5001());
                //지별 경과시간
                elapsedTimeByLocation.put("1지", location1Dto.getAIE_5011());
                
                // 2지 데이터를 추출하여 location2Dto에 저장
                // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                strTemp = aiSedimentationRealtime.getAIE_9002();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();

                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation2RealtimeDTO location2Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation2RealtimeDTO.class);

                // 2지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv2_1", location2Dto.getE_drn_vv2().getE_drn_vv2_1());
                aiSedimentationInfo.put("e_drawing_vv2_2", location2Dto.getE_drn_vv2().getE_drn_vv2_2());
                aiSedimentationInfo.put("e_drawing_vv2_3", location2Dto.getE_drn_vv2().getE_drn_vv2_3());
                aiSedimentationInfo.put("e_drawing_vv2_4", location2Dto.getE_drn_vv2().getE_drn_vv2_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv2_5", location2Dto.getE_drn_vv2().getE_drn_vv2_5());
                    aiSedimentationInfo.put("e_drawing_vv2_6", location2Dto.getE_drn_vv2().getE_drn_vv2_6());
                }

                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_2", location2Dto.getE_operation_mode());

                // 2지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc2_f", location2Dto.getE_loc_sc_2().getF());
                aiSedimentationInfo.put("e_sc2_b", location2Dto.getE_loc_sc_2().getB());

                // 2지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location2Dto.getAIE_6002().getLatest());
                scScheduleMap.put("start", location2Dto.getAIE_6002().getStart());
                scScheduleMap.put("stop", location2Dto.getAIE_6002().getStop());
                scScheduleMap.put("next_start", location2Dto.getAIE_6002().getNext_start());
                scScheduleMap.put("next_end", location2Dto.getAIE_6002().getNext_end());
                scScheduleMap.put("inbal", location2Dto.getAIE_6002().getInbal());
                aiSedimentationInfo.put("e_sc2_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("2지",location2Dto.getAIE_5002());
                //지별 경과시간
                elapsedTimeByLocation.put("2지", location2Dto.getAIE_5012());
                
                // 3지 데이터를 추출하여 location3Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9003();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation3RealtimeDTO location3Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation3RealtimeDTO.class);

                // 3지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv3_1", location3Dto.getE_drn_vv3().getE_drn_vv3_1());
                aiSedimentationInfo.put("e_drawing_vv3_2", location3Dto.getE_drn_vv3().getE_drn_vv3_2());
                aiSedimentationInfo.put("e_drawing_vv3_3", location3Dto.getE_drn_vv3().getE_drn_vv3_3());
                aiSedimentationInfo.put("e_drawing_vv3_4", location3Dto.getE_drn_vv3().getE_drn_vv3_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv3_5", location3Dto.getE_drn_vv3().getE_drn_vv3_5());
                    aiSedimentationInfo.put("e_drawing_vv3_6", location3Dto.getE_drn_vv3().getE_drn_vv3_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_3", location3Dto.getE_operation_mode());

                // 3지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc3_f", location3Dto.getE_loc_sc_3().getF());
                aiSedimentationInfo.put("e_sc3_b", location3Dto.getE_loc_sc_3().getB());

                // 3지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location3Dto.getAIE_6003().getLatest());
                scScheduleMap.put("start", location3Dto.getAIE_6003().getStart());
                scScheduleMap.put("stop", location3Dto.getAIE_6003().getStop());
                scScheduleMap.put("next_start", location3Dto.getAIE_6003().getNext_start());
                scScheduleMap.put("next_end", location3Dto.getAIE_6003().getNext_end());
                scScheduleMap.put("inbal", location3Dto.getAIE_6003().getInbal());
                aiSedimentationInfo.put("e_sc3_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("3지", location3Dto.getAIE_5003());
                //지별 경과시간
                elapsedTimeByLocation.put("3지", location3Dto.getAIE_5013());
                
                // 4지 데이터를 추출하여 location4Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9004();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation4RealtimeDTO location4Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation4RealtimeDTO.class);

                // 4지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv4_1", location4Dto.getE_drn_vv4().getE_drn_vv4_1());
                aiSedimentationInfo.put("e_drawing_vv4_2", location4Dto.getE_drn_vv4().getE_drn_vv4_2());
                aiSedimentationInfo.put("e_drawing_vv4_3", location4Dto.getE_drn_vv4().getE_drn_vv4_3());
                aiSedimentationInfo.put("e_drawing_vv4_4", location4Dto.getE_drn_vv4().getE_drn_vv4_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv4_5", location4Dto.getE_drn_vv4().getE_drn_vv4_5());
                    aiSedimentationInfo.put("e_drawing_vv4_6", location4Dto.getE_drn_vv4().getE_drn_vv4_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_4", location4Dto.getE_operation_mode());

                // 4지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc4_f", location4Dto.getE_loc_sc_4().getF());
                aiSedimentationInfo.put("e_sc4_b", location4Dto.getE_loc_sc_4().getB());

                // 4지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location4Dto.getAIE_6004().getLatest());
                scScheduleMap.put("start", location4Dto.getAIE_6004().getStart());
                scScheduleMap.put("stop", location4Dto.getAIE_6004().getStop());
                scScheduleMap.put("next_start", location4Dto.getAIE_6004().getNext_start());
                scScheduleMap.put("next_end", location4Dto.getAIE_6004().getNext_end());
                scScheduleMap.put("inbal", location4Dto.getAIE_6004().getInbal());
                aiSedimentationInfo.put("e_sc4_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("4지", location4Dto.getAIE_5004());
                //지별 경과시간
                elapsedTimeByLocation.put("4지", location4Dto.getAIE_5014());
                
                
                // 5지 데이터를 추출하여 location5Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9005();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation5RealtimeDTO location5Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation5RealtimeDTO.class);

                // 5지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv5_1", location5Dto.getE_drn_vv5().getE_drn_vv5_1());
                aiSedimentationInfo.put("e_drawing_vv5_2", location5Dto.getE_drn_vv5().getE_drn_vv5_2());
                aiSedimentationInfo.put("e_drawing_vv5_3", location5Dto.getE_drn_vv5().getE_drn_vv5_3());
                aiSedimentationInfo.put("e_drawing_vv5_4", location5Dto.getE_drn_vv5().getE_drn_vv5_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv5_5", location5Dto.getE_drn_vv5().getE_drn_vv5_5());
                    aiSedimentationInfo.put("e_drawing_vv5_6", location5Dto.getE_drn_vv5().getE_drn_vv5_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_5", location5Dto.getE_operation_mode());

                // 5지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc5_f", location5Dto.getE_loc_sc_5().getF());
                aiSedimentationInfo.put("e_sc5_b", location5Dto.getE_loc_sc_5().getB());

                // 5지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location5Dto.getAIE_6005().getLatest());
                scScheduleMap.put("start", location5Dto.getAIE_6005().getStart());
                scScheduleMap.put("stop", location5Dto.getAIE_6005().getStop());
                scScheduleMap.put("next_start", location5Dto.getAIE_6005().getNext_start());
                scScheduleMap.put("next_end", location5Dto.getAIE_6005().getNext_end());
                scScheduleMap.put("inbal", location5Dto.getAIE_6005().getInbal());
                aiSedimentationInfo.put("e_sc5_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("5지", location5Dto.getAIE_5005());
                //지별 경과시간
                elapsedTimeByLocation.put("5지", location5Dto.getAIE_5015());
                
                
                // 6지 데이터를 추출하여 location6Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9006();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation6RealtimeDTO location6Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation6RealtimeDTO.class);

                // 6지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv6_1", location6Dto.getE_drn_vv6().getE_drn_vv6_1());
                aiSedimentationInfo.put("e_drawing_vv6_2", location6Dto.getE_drn_vv6().getE_drn_vv6_2());
                aiSedimentationInfo.put("e_drawing_vv6_3", location6Dto.getE_drn_vv6().getE_drn_vv6_3());
                aiSedimentationInfo.put("e_drawing_vv6_4", location6Dto.getE_drn_vv6().getE_drn_vv6_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv6_5", location6Dto.getE_drn_vv6().getE_drn_vv6_5());
                    aiSedimentationInfo.put("e_drawing_vv6_6", location6Dto.getE_drn_vv6().getE_drn_vv6_6());
                }

                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_6", location6Dto.getE_operation_mode());

                // 6지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc6_f", location6Dto.getE_loc_sc_6().getF());
                aiSedimentationInfo.put("e_sc6_b", location6Dto.getE_loc_sc_6().getB());

                // 6지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location6Dto.getAIE_6006().getLatest());
                scScheduleMap.put("start", location6Dto.getAIE_6006().getStart());
                scScheduleMap.put("stop", location6Dto.getAIE_6006().getStop());
                scScheduleMap.put("next_start", location6Dto.getAIE_6006().getNext_start());
                scScheduleMap.put("next_end", location6Dto.getAIE_6006().getNext_end());
                scScheduleMap.put("inbal", location6Dto.getAIE_6006().getInbal());
                aiSedimentationInfo.put("e_sc6_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("6지", location6Dto.getAIE_5006());
                //지별 경과시간
                elapsedTimeByLocation.put("6지", location6Dto.getAIE_5016());
                
                
                // 7지 데이터를 추출하여 location7Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9007();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation7RealtimeDTO location7Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation7RealtimeDTO.class);

                // 7지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv7_1", location7Dto.getE_drn_vv7().getE_drn_vv7_1());
                aiSedimentationInfo.put("e_drawing_vv7_2", location7Dto.getE_drn_vv7().getE_drn_vv7_2());
                aiSedimentationInfo.put("e_drawing_vv7_3", location7Dto.getE_drn_vv7().getE_drn_vv7_3());
                aiSedimentationInfo.put("e_drawing_vv7_4", location7Dto.getE_drn_vv7().getE_drn_vv7_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv7_5", location7Dto.getE_drn_vv7().getE_drn_vv7_5());
                    aiSedimentationInfo.put("e_drawing_vv7_6", location7Dto.getE_drn_vv7().getE_drn_vv7_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_7", location7Dto.getE_operation_mode());

                // 7지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc7_f", location7Dto.getE_loc_sc_7().getF());
                aiSedimentationInfo.put("e_sc7_b", location7Dto.getE_loc_sc_7().getB());

                // 7지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location7Dto.getAIE_6007().getLatest());
                scScheduleMap.put("start", location7Dto.getAIE_6007().getStart());
                scScheduleMap.put("stop", location7Dto.getAIE_6007().getStop());
                scScheduleMap.put("next_start", location7Dto.getAIE_6007().getNext_start());
                scScheduleMap.put("next_end", location7Dto.getAIE_6007().getNext_end());
                scScheduleMap.put("inbal", location7Dto.getAIE_6007().getInbal());
                aiSedimentationInfo.put("e_sc7_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("7지", location7Dto.getAIE_5007());
                //지별 경과시간
                elapsedTimeByLocation.put("7지", location7Dto.getAIE_5017());
                
                
                // 8지 데이터를 추출하여 location8Dto에 저장
                strTemp = aiSedimentationRealtime.getAIE_9008();
                strTemp = strTemp.replaceAll("NaN", "\"\"");
                mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));

                locationMap = objectMapper.convertValue(objectTemp,
                        new TypeReference<List<LinkedHashMap<String, Object>>>() {
                        });
                mapTemp.clear();
                for (Map<String, Object> map : locationMap) {
                    mapTemp.putAll(map);
                }
                AiSedimentationLocation8RealtimeDTO location8Dto = objectMapper.convertValue(mapTemp,
                        AiSedimentationLocation8RealtimeDTO.class);

                // 8지 인발밸브 상태
                aiSedimentationInfo.put("e_drawing_vv8_1", location8Dto.getE_drn_vv8().getE_drn_vv8_1());
                aiSedimentationInfo.put("e_drawing_vv8_2", location8Dto.getE_drn_vv8().getE_drn_vv8_2());
                aiSedimentationInfo.put("e_drawing_vv8_3", location8Dto.getE_drn_vv8().getE_drn_vv8_3());
                aiSedimentationInfo.put("e_drawing_vv8_4", location8Dto.getE_drn_vv8().getE_drn_vv8_4());
                if (processStep == 2) { // 2단계 생활 침전인 경우 각 지별 당 밸브가 6개 까지 존재
                    aiSedimentationInfo.put("e_drawing_vv8_5", location8Dto.getE_drn_vv8().getE_drn_vv8_5());
                    aiSedimentationInfo.put("e_drawing_vv8_6", location8Dto.getE_drn_vv8().getE_drn_vv8_6());
                }
                // 지별 운영모드
                aiSedimentationInfo.put("e_operation_mode_8", location8Dto.getE_operation_mode());

                // 8지 수집기 대차 위치
                aiSedimentationInfo.put("e_sc8_f", location8Dto.getE_loc_sc_8().getF());
                aiSedimentationInfo.put("e_sc8_b", location8Dto.getE_loc_sc_8().getB());

                // 8지 수집기 운영 스케쥴
                scScheduleMap = new HashMap<>();
                scScheduleMap.put("latest", location8Dto.getAIE_6008().getLatest());
                scScheduleMap.put("start", location8Dto.getAIE_6008().getStart());
                scScheduleMap.put("stop", location8Dto.getAIE_6008().getStop());
                scScheduleMap.put("next_start", location8Dto.getAIE_6008().getNext_start());
                scScheduleMap.put("next_end", location8Dto.getAIE_6008().getNext_end());
                scScheduleMap.put("inbal", location8Dto.getAIE_6008().getInbal());
                aiSedimentationInfo.put("e_sc8_schedule", scScheduleMap);

                //지별 슬러지 데이터
                sludgeByLocation.put("8지", location8Dto.getAIE_5008());
                //지별 경과시간
                elapsedTimeByLocation.put("8지", location8Dto.getAIE_5018());
                
                
                if (processStep == 2) {
                    // 9지 데이터를 추출하여 location8Dto에 저장
                    strTemp = aiSedimentationRealtime.getAIE_9009();
                    strTemp = strTemp.replaceAll("NaN", "\"\"");
                    mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));

                    locationMap = objectMapper.convertValue(objectTemp,
                            new TypeReference<List<LinkedHashMap<String, Object>>>() {
                            });
                    mapTemp.clear();
                    for (Map<String, Object> map : locationMap) {
                        mapTemp.putAll(map);
                    }
                    AiSedimentationLocation9RealtimeDTO location9Dto = objectMapper.convertValue(mapTemp,
                            AiSedimentationLocation9RealtimeDTO.class);

                    // 9지 인발밸브 상태
                    aiSedimentationInfo.put("e_drawing_vv9_1", location9Dto.getE_drn_vv9().getE_drn_vv9_1());
                    aiSedimentationInfo.put("e_drawing_vv9_2", location9Dto.getE_drn_vv9().getE_drn_vv9_2());
                    aiSedimentationInfo.put("e_drawing_vv9_3", location9Dto.getE_drn_vv9().getE_drn_vv9_3());
                    aiSedimentationInfo.put("e_drawing_vv9_4", location9Dto.getE_drn_vv9().getE_drn_vv9_4());
                    aiSedimentationInfo.put("e_drawing_vv9_5", location9Dto.getE_drn_vv9().getE_drn_vv9_5());
                    aiSedimentationInfo.put("e_drawing_vv9_6", location9Dto.getE_drn_vv9().getE_drn_vv9_6());
                    // 지별 운영모드
                    aiSedimentationInfo.put("e_operation_mode_9", location9Dto.getE_operation_mode());

                    // 9지 수집기 대차 위치
                    aiSedimentationInfo.put("e_sc9_f", location9Dto.getE_loc_sc_9().getF());
                    aiSedimentationInfo.put("e_sc9_b", location9Dto.getE_loc_sc_9().getB());

                    // 9지 수집기 운영 스케쥴
                    scScheduleMap = new HashMap<>();
                    scScheduleMap.put("latest", location9Dto.getAIE_6009().getLatest());
                    scScheduleMap.put("start", location9Dto.getAIE_6009().getStart());
                    scScheduleMap.put("stop", location9Dto.getAIE_6009().getStop());
                    scScheduleMap.put("next_start", location9Dto.getAIE_6009().getNext_start());
                    scScheduleMap.put("next_end", location9Dto.getAIE_6009().getNext_end());
                    scScheduleMap.put("inbal", location9Dto.getAIE_6009().getInbal());
                    aiSedimentationInfo.put("e_sc9_schedule", scScheduleMap);

	                //지별 슬러지 데이터
	                sludgeByLocation.put("9지", location9Dto.getAIE_5009());
	                //지별 경과시간
	                elapsedTimeByLocation.put("9지", location9Dto.getAIE_5019());
	                
                    
                    // 10지 데이터를 추출하여 location8Dto에 저장
                    strTemp = aiSedimentationRealtime.getAIE_9010();
                    strTemp = strTemp.replaceAll("NaN", "\"\"");
                    mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));

                    locationMap = objectMapper.convertValue(objectTemp,
                            new TypeReference<List<LinkedHashMap<String, Object>>>() {
                            });
                    mapTemp.clear();
                    for (Map<String, Object> map : locationMap) {
                        mapTemp.putAll(map);
                    }
                    AiSedimentationLocation10RealtimeDTO location10Dto = objectMapper.convertValue(mapTemp,
                            AiSedimentationLocation10RealtimeDTO.class);

                    // 10지 인발밸브 상태
                    aiSedimentationInfo.put("e_drawing_vv10_1", location10Dto.getE_drn_vv10().getE_drn_vv10_1());
                    aiSedimentationInfo.put("e_drawing_vv10_2", location10Dto.getE_drn_vv10().getE_drn_vv10_2());
                    aiSedimentationInfo.put("e_drawing_vv10_3", location10Dto.getE_drn_vv10().getE_drn_vv10_3());
                    aiSedimentationInfo.put("e_drawing_vv10_4", location10Dto.getE_drn_vv10().getE_drn_vv10_4());
                    aiSedimentationInfo.put("e_drawing_vv10_5", location10Dto.getE_drn_vv10().getE_drn_vv10_5());
                    aiSedimentationInfo.put("e_drawing_vv10_6", location10Dto.getE_drn_vv10().getE_drn_vv10_6());
                    // 지별 운영모드
                    aiSedimentationInfo.put("e_operation_mode_10", location10Dto.getE_operation_mode());

                    // 10지 수집기 대차 위치
                    aiSedimentationInfo.put("e_sc10_f", location10Dto.getE_loc_sc_10().getF());
                    aiSedimentationInfo.put("e_sc10_b", location10Dto.getE_loc_sc_10().getB());

                    // 10지 수집기 운영 스케쥴
                    scScheduleMap = new HashMap<>();
                    scScheduleMap.put("latest", location10Dto.getAIE_6010().getLatest());
                    scScheduleMap.put("start", location10Dto.getAIE_6010().getStart());
                    scScheduleMap.put("stop", location10Dto.getAIE_6010().getStop());
                    scScheduleMap.put("next_start", location10Dto.getAIE_6010().getNext_start());
                    scScheduleMap.put("next_end", location10Dto.getAIE_6010().getNext_end());
                    scScheduleMap.put("inbal", location10Dto.getAIE_6010().getInbal());
                    aiSedimentationInfo.put("e_sc10_schedule", scScheduleMap);
                    
	                //지별 슬러지 데이터
	                sludgeByLocation.put("10지", location10Dto.getAIE_5010());
	                //지별 경과시간
	                elapsedTimeByLocation.put("10지", location10Dto.getAIE_50110());
	                
                }

                aiSedimentationInfo.put("sludgeByLocation", sludgeByLocation);
                aiSedimentationInfo.put("elapsedTimeByLocation", elapsedTimeByLocation);
            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiSedimentationInfo);

            String strBody = "";
            try {
                // ObjectMapper를 통해 JSON 값을 String으로 변환
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_sedimentation\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 실시간 침전 공정 지별 세부 항목 조회
     * 
     * @param locationNumber 선택한 지
     * @param processStep    공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/location/{locationNumber}/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLocationSedimentation(@PathVariable int locationNumber,
            @PathVariable int processStep) {
        log.debug("getLocationSedimentation, locationNumber:[{}]", locationNumber);

        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_SEDIMENTATION,
                processStep);
        if (tagManageList.size() > 0) {
            // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
            Calendar calendarToday = Calendar.getInstance();
            calendarToday.set(Calendar.MINUTE, 0);
            calendarToday.set(Calendar.SECOND, 0);
            calendarToday.set(Calendar.HOUR_OF_DAY, 0);
            SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
            String strPartitionName = partitionNameFormat.format(calendarToday.getTime());

            // get sedimentation_realtime
            List<ProcessRealtimeDTO> sedimentationRealtime = databaseService
                    .getLatestSedimentationRealtimeValue(strPartitionName, processStep);
            log.debug("getLatestSedimentationRealtimeValue, result:[{}]", sedimentationRealtime.size());

            /*
             * TODO: Series Number에 대한 조건 주석 처리 영향도 없는지 확인 필요. (TO-BE 에서는 SER을 사용하지 않음)
             * // Get series number
             * // Front-end로부터 전달받은 지 번호가 tag_manage에 등록되었는지 검사
             * int nSeriesNumber = 0;
             * for(TagManageDTO dto : tagManageList)
             * {
             * if(dto.getLoc() == locationNumber)
             * {
             * nSeriesNumber = dto.getSer();
             * break;
             * }
             * }
             * 
             * // 등록되지 않은 지 번호는 에러처리
             * if(nSeriesNumber == 0)
             * {
             * String strErrorBody = "{\"reason\":\"Invalid location number.\"}";
             * return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
             * }
             */
            // Get ai_sedimentation_realtime
            AiSedimentationRealtimeDTO aiSedimentationRealtime = databaseService
                    .getLatestAiSedimentationRealtimeValue(processStep);
            log.debug("getLatestAiSedimentationRealtimeValue, result:[{}]", aiSedimentationRealtime != null ? 1 : 0);
            if (aiSedimentationRealtime != null) {
                // JSON 처리를 위한 ObjectMapper 선언
                ObjectMapper objectMapper = new ObjectMapper();

                // Make ResponseBody
                LinkedHashMap<String, Object> aiSedimentationLocationInfo = new LinkedHashMap<>();

                // update_time
                aiSedimentationLocationInfo.put("upd_ti", aiSedimentationRealtime.getUpd_ti());

                // 원수 유입 유량
                // aiSedimentationLocationInfo.put("b_in_fr",
                // aiSedimentationRealtime.getB_in_fr());

                // 원수 탁도
                // aiSedimentationLocationInfo.put("b_tb", aiSedimentationRealtime.getB_tb());

                // tag_manage에 정의한 태그명을 통해 실시간 데이터를 가져와 aiSedimenationInfo에 등록

                // Realtime data from SCADA
                Float mm_fr = 0.0f;
                Float c1_cf = 0.0f;
                Float c2_cf = 0.0f;
                Float c_cf = 0.0f;
                Float b_in_fr = 0.0f;

                for (TagManageDTO tagManage : tagManageList) {
                    for (ProcessRealtimeDTO dto : sedimentationRealtime) {
                        if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 유입 유량
                            b_in_fr = Float.parseFloat(dto.getTag_val());
                        } else if (tagManage.getItm().equalsIgnoreCase("b_tb") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 탁도
                            aiSedimentationLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("c1_cf") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 약품 사용량 계산식 활용 데이터
                            c1_cf = Float.parseFloat(dto.getTag_val());
                        } else if (tagManage.getItm().equalsIgnoreCase("c2_cf") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            c2_cf = Float.parseFloat(dto.getTag_val());
                        } else if (tagManage.getItm().equalsIgnoreCase("c_mm_fr_etc") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            aiSedimentationLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                    }
                }
                aiSedimentationLocationInfo.put("b_in_fr", b_in_fr);
                // 약품 종류
                Map<String, Object> c_cf_coagulant = databaseService.selectUsrMng("c" + processStep + "_cf_coagulant");
                aiSedimentationLocationInfo.put("c_cf_coagulant", c_cf_coagulant.get("init_val"));

                // 약품 사용량 계산식 (약품 사용률 계산식 활용함)
                c_cf = c1_cf != 0 ? c1_cf : c2_cf; // c1_cf, c2_cf중 값이 있는 값으로 대입
                mm_fr = c_cf * b_in_fr / 1000; // 약품 주입량 = 약품투입률 * 원수 유입유량 / 1000 (약품에있는 공식 활용 - 확인필요)
                aiSedimentationLocationInfo.put("c_mm_fr", mm_fr);
                /*
                 * TODO: Series Number에 대한 조건 주석 처리 영향도 없는지 확인 필요. (TO-BE 에서는 SER을 사용하지 않음)
                 * // 지별 데이터 추출
                 * if(nSeriesNumber == 1)
                 * {
                 * // 혼화기 약품 종류
                 * aiSedimentationLocationInfo.put("d_mm_coagulant",
                 * aiSedimentationRealtime.getFRI_2053() > aiSedimentationRealtime.getFRI_2055()
                 * ? "APAC" : "POLYMAX");
                 * 
                 * // 혼화기 유량
                 * aiSedimentationLocationInfo.put("d_mm_fr",
                 * aiSedimentationRealtime.getFRI_2053() > aiSedimentationRealtime.getFRI_2055()
                 * ? aiSedimentationRealtime.getFRI_2053() :
                 * aiSedimentationRealtime.getFRI_2055());
                 * 
                 * // 계면계 수위
                 * aiSedimentationLocationInfo.put("e_interface_le",
                 * aiSedimentationRealtime.getAIE_9901());
                 * 
                 * // 침전지 전탁도
                 * aiSedimentationLocationInfo.put("e_tb_f",
                 * aiSedimentationRealtime.getAIE_9903());
                 * 
                 * // 침전지 후탁도
                 * aiSedimentationLocationInfo.put("e_ser_tb_b",
                 * aiSedimentationRealtime.getTBI_2001());
                 * }
                 * else
                 * {
                 */
                // // 혼화기 유량
                // aiSedimentationLocationInfo.put("d_mm_fr",
                // aiSedimentationRealtime.getC_mm_fr1() +
                // aiSedimentationRealtime.getC_mm_fr2());

                // 계면계 수위
                // aiSedimentationLocationInfo.put("e_interface_le",
                // aiSedimentationRealtime.getAIE_9902());

                // 침전지 전탁도
                // aiSedimentationLocationInfo.put("e_tb_f",
                // aiSedimentationRealtime.getAIE_9904());

                // 침전지 후탁도
                // aiSedimentationLocationInfo.put("e_ser_tb_b",
                // aiSedimentationRealtime.getTBI_2002());
                // }

                // 지별 데이터
                String strTemp;
                LinkedHashMap<String, Object> mapTemp;
                ArrayList<String> keyList;
                Object objectTemp;
                try {
                    if (locationNumber == 1) {
                        // 1지 데이터를 추출하여 location2Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9001();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation1RealtimeDTO location1Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation1RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location1Dto.getAIE_5001());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location1Dto.getE_loc_sc_1().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location1Dto.getE_loc_sc_1().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location1Dto.getAIE_6001().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location1Dto.getAIE_6001().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location1Dto.getE_drn_vv1().getE_drn_vv1_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location1Dto.getE_drn_vv1().getE_drn_vv1_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location1Dto.getE_drn_vv1().getE_drn_vv1_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location1Dto.getE_drn_vv1().getE_drn_vv1_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location1Dto.getE_drn_vv1().getE_drn_vv1_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location1Dto.getE_drn_vv1().getE_drn_vv1_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location1Dto.getAIE_5101();
                        LinkedHashMap<String, Float> location1SludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", location1SludgeMap);
                    } else if (locationNumber == 2) {
                        // 2지 데이터를 추출하여 location2Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9002();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation2RealtimeDTO location2Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation2RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location2Dto.getAIE_5002());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location2Dto.getE_loc_sc_2().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location2Dto.getE_loc_sc_2().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location2Dto.getAIE_6002().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location2Dto.getAIE_6002().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location2Dto.getE_drn_vv2().getE_drn_vv2_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location2Dto.getE_drn_vv2().getE_drn_vv2_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location2Dto.getE_drn_vv2().getE_drn_vv2_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location2Dto.getE_drn_vv2().getE_drn_vv2_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location2Dto.getE_drn_vv2().getE_drn_vv2_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location2Dto.getE_drn_vv2().getE_drn_vv2_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location2Dto.getAIE_5102();
                        LinkedHashMap<String, Float> location2SludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", location2SludgeMap);
                    } else if (locationNumber == 3) {
                        // 3지 데이터를 추출하여 location3Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9003();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation3RealtimeDTO location3Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation3RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location3Dto.getAIE_5003());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location3Dto.getE_loc_sc_3().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location3Dto.getE_loc_sc_3().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location3Dto.getAIE_6003().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location3Dto.getAIE_6003().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location3Dto.getE_drn_vv3().getE_drn_vv3_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location3Dto.getE_drn_vv3().getE_drn_vv3_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location3Dto.getE_drn_vv3().getE_drn_vv3_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location3Dto.getE_drn_vv3().getE_drn_vv3_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location3Dto.getE_drn_vv3().getE_drn_vv3_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location3Dto.getE_drn_vv3().getE_drn_vv3_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location3Dto.getAIE_5103();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    } else if (locationNumber == 4) {
                        // 4지 데이터를 추출하여 location4Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9004();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation4RealtimeDTO location4Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation4RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location4Dto.getAIE_5004());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location4Dto.getE_loc_sc_4().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location4Dto.getE_loc_sc_4().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location4Dto.getAIE_6004().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location4Dto.getAIE_6004().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location4Dto.getE_drn_vv4().getE_drn_vv4_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location4Dto.getE_drn_vv4().getE_drn_vv4_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location4Dto.getE_drn_vv4().getE_drn_vv4_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location4Dto.getE_drn_vv4().getE_drn_vv4_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location4Dto.getE_drn_vv4().getE_drn_vv4_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location4Dto.getE_drn_vv4().getE_drn_vv4_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location4Dto.getAIE_5104();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    } else if (locationNumber == 5) {
                        // 5지 데이터를 추출하여 location5Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9005();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation5RealtimeDTO location5Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation5RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location5Dto.getAIE_5005());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location5Dto.getE_loc_sc_5().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location5Dto.getE_loc_sc_5().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location5Dto.getAIE_6005().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location5Dto.getAIE_6005().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location5Dto.getE_drn_vv5().getE_drn_vv5_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location5Dto.getE_drn_vv5().getE_drn_vv5_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location5Dto.getE_drn_vv5().getE_drn_vv5_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location5Dto.getE_drn_vv5().getE_drn_vv5_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location5Dto.getE_drn_vv5().getE_drn_vv5_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location5Dto.getE_drn_vv5().getE_drn_vv5_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location5Dto.getAIE_5105();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    } else if (locationNumber == 6) {
                        // 6지 데이터를 추출하여 location6Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9006();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation6RealtimeDTO location6Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation6RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location6Dto.getAIE_5006());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location6Dto.getE_loc_sc_6().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location6Dto.getE_loc_sc_6().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location6Dto.getAIE_6006().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location6Dto.getAIE_6006().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location6Dto.getE_drn_vv6().getE_drn_vv6_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location6Dto.getE_drn_vv6().getE_drn_vv6_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location6Dto.getE_drn_vv6().getE_drn_vv6_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location6Dto.getE_drn_vv6().getE_drn_vv6_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location6Dto.getE_drn_vv6().getE_drn_vv6_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location6Dto.getE_drn_vv6().getE_drn_vv6_6());
                        // 슬러지 발생량 트렌드
                        objectTemp = location6Dto.getAIE_5106();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    } else if (locationNumber == 7) {
                        // 7지 데이터를 추출하여 location7Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9007();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation7RealtimeDTO location7Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation7RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location7Dto.getAIE_5007());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location7Dto.getE_loc_sc_7().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location7Dto.getE_loc_sc_7().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location7Dto.getAIE_6007().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location7Dto.getAIE_6007().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location7Dto.getE_drn_vv7().getE_drn_vv7_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location7Dto.getE_drn_vv7().getE_drn_vv7_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location7Dto.getE_drn_vv7().getE_drn_vv7_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location7Dto.getE_drn_vv7().getE_drn_vv7_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location7Dto.getE_drn_vv7().getE_drn_vv7_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location7Dto.getE_drn_vv7().getE_drn_vv7_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location7Dto.getAIE_5107();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    } else if (locationNumber == 8) {
                        // 8지 데이터를 추출하여 location8Dto에 저장
                        // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                        strTemp = aiSedimentationRealtime.getAIE_9008();
                        strTemp = strTemp.replaceAll("NaN", "\"\"");
                        mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                });
                        mapTemp.clear();
                        for (Map<String, Object> map : locationMap) {
                            mapTemp.putAll(map);
                        }
                        AiSedimentationLocation8RealtimeDTO location8Dto = objectMapper.convertValue(mapTemp,
                                AiSedimentationLocation8RealtimeDTO.class);

                        // 슬러지 발생량
                        aiSedimentationLocationInfo.put("e_location_sludge", location8Dto.getAIE_5008());

                        // 수집기 위치
                        aiSedimentationLocationInfo.put("e_sc_f", location8Dto.getE_loc_sc_8().getF());
                        aiSedimentationLocationInfo.put("e_sc_b", location8Dto.getE_loc_sc_8().getB());

                        // 이전 대차 시작 시간
                        aiSedimentationLocationInfo.put("e_sc_latest", location8Dto.getAIE_6008().getStart());

                        // AI 다음 대차 시작 시간 예측
                        aiSedimentationLocationInfo.put("ai_e_sc_next", location8Dto.getAIE_6008().getNext_start());

                        // 인발밸브 상태
                        aiSedimentationLocationInfo.put("e_drawing_vv_1", location8Dto.getE_drn_vv8().getE_drn_vv8_1());
                        aiSedimentationLocationInfo.put("e_drawing_vv_2", location8Dto.getE_drn_vv8().getE_drn_vv8_2());
                        aiSedimentationLocationInfo.put("e_drawing_vv_3", location8Dto.getE_drn_vv8().getE_drn_vv8_3());
                        aiSedimentationLocationInfo.put("e_drawing_vv_4", location8Dto.getE_drn_vv8().getE_drn_vv8_4());
                        aiSedimentationLocationInfo.put("e_drawing_vv_5", location8Dto.getE_drn_vv8().getE_drn_vv8_5());
                        aiSedimentationLocationInfo.put("e_drawing_vv_6", location8Dto.getE_drn_vv8().getE_drn_vv8_6());

                        // 슬러지 발생량 트렌드
                        objectTemp = location8Dto.getAIE_5108();
                        LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                LinkedHashMap.class);
                        aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                    }

                    if (processStep == 2) {
                        if (locationNumber == 9) {
                            // 9지 데이터를 추출하여 location8Dto에 저장
                            // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                            strTemp = aiSedimentationRealtime.getAIE_9009();
                            strTemp = strTemp.replaceAll("NaN", "\"\"");
                            mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                            keyList = new ArrayList<>(mapTemp.keySet());
                            objectTemp = mapTemp.get(keyList.get(0));

                            List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                    new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                    });
                            mapTemp.clear();
                            for (Map<String, Object> map : locationMap) {
                                mapTemp.putAll(map);
                            }
                            AiSedimentationLocation9RealtimeDTO location9Dto = objectMapper.convertValue(mapTemp,
                                    AiSedimentationLocation9RealtimeDTO.class);

                            // 슬러지 발생량
                            aiSedimentationLocationInfo.put("e_location_sludge", location9Dto.getAIE_5009());

                            // 수집기 위치
                            aiSedimentationLocationInfo.put("e_sc_f", location9Dto.getE_loc_sc_9().getF());
                            aiSedimentationLocationInfo.put("e_sc_b", location9Dto.getE_loc_sc_9().getB());

                            // 이전 대차 시작 시간
                            aiSedimentationLocationInfo.put("e_sc_latest", location9Dto.getAIE_6009().getStart());

                            // AI 다음 대차 시작 시간 예측
                            aiSedimentationLocationInfo.put("ai_e_sc_next", location9Dto.getAIE_6009().getNext_start());

                            // 인발밸브 상태
                            aiSedimentationLocationInfo.put("e_drawing_vv_1",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_1());
                            aiSedimentationLocationInfo.put("e_drawing_vv_2",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_2());
                            aiSedimentationLocationInfo.put("e_drawing_vv_3",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_3());
                            aiSedimentationLocationInfo.put("e_drawing_vv_4",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_4());
                            aiSedimentationLocationInfo.put("e_drawing_vv_5",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_5());
                            aiSedimentationLocationInfo.put("e_drawing_vv_6",
                                    location9Dto.getE_drn_vv9().getE_drn_vv9_6());

                            // 슬러지 발생량 트렌드
                            objectTemp = location9Dto.getAIE_5109();
                            LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                    LinkedHashMap.class);
                            aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                        }

                        if (locationNumber == 10) {
                            // 10지 데이터를 추출하여 location8Dto에 저장
                            // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                            strTemp = aiSedimentationRealtime.getAIE_9010();
                            strTemp = strTemp.replaceAll("NaN", "\"\"");
                            mapTemp = objectMapper.readValue(strTemp, LinkedHashMap.class);
                            keyList = new ArrayList<>(mapTemp.keySet());
                            objectTemp = mapTemp.get(keyList.get(0));

                            List<LinkedHashMap<String, Object>> locationMap = objectMapper.convertValue(objectTemp,
                                    new TypeReference<List<LinkedHashMap<String, Object>>>() {
                                    });
                            mapTemp.clear();
                            for (Map<String, Object> map : locationMap) {
                                mapTemp.putAll(map);
                            }
                            AiSedimentationLocation10RealtimeDTO location10Dto = objectMapper.convertValue(mapTemp,
                                    AiSedimentationLocation10RealtimeDTO.class);

                            // 슬러지 발생량
                            aiSedimentationLocationInfo.put("e_location_sludge", location10Dto.getAIE_5010());

                            // 수집기 위치
                            aiSedimentationLocationInfo.put("e_sc_f", location10Dto.getE_loc_sc_10().getF());
                            aiSedimentationLocationInfo.put("e_sc_b", location10Dto.getE_loc_sc_10().getB());

                            // 이전 대차 시작 시간
                            aiSedimentationLocationInfo.put("e_sc_latest", location10Dto.getAIE_6010().getStart());

                            // AI 다음 대차 시작 시간 예측
                            aiSedimentationLocationInfo.put("ai_e_sc_next",
                                    location10Dto.getAIE_6010().getNext_start());

                            // 인발밸브 상태
                            aiSedimentationLocationInfo.put("e_drawing_vv_1",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_1());
                            aiSedimentationLocationInfo.put("e_drawing_vv_2",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_2());
                            aiSedimentationLocationInfo.put("e_drawing_vv_3",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_3());
                            aiSedimentationLocationInfo.put("e_drawing_vv_4",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_4());
                            aiSedimentationLocationInfo.put("e_drawing_vv_5",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_5());
                            aiSedimentationLocationInfo.put("e_drawing_vv_6",
                                    location10Dto.getE_drn_vv10().getE_drn_vv10_6());

                            // 슬러지 발생량 트렌드
                            objectTemp = location10Dto.getAIE_5110();
                            LinkedHashMap<String, Float> locationSludgeMap = objectMapper.convertValue(objectTemp,
                                    LinkedHashMap.class);
                            aiSedimentationLocationInfo.put("e_location_sludge_trend", locationSludgeMap);
                        }
                    }

                } catch (JsonProcessingException e) {
                    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("location", aiSedimentationLocationInfo);

                String strBody;
                try {
                    // ObjectMapper를 통해 JSON 값을 String으로 변환
                    strBody = objectMapper.writeValueAsString(responseBody);
                } catch (JsonProcessingException e) {
                    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return new ResponseEntity<>(strBody, HttpStatus.OK);
            } else {
                String strErrorBody = "{\"reason\":\"Empty ai_sedimentation\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            }

        } else {
            String strErrorBody = "{\"reason\":\"Empty tag_manage\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 침전 공정 계면계 측정 이력 조회
     * 
     * @return ResponseEntity<String> 메시지
     */
    //
    // locationNumber가 0일 경우 전체 조회
    // @RequestMapping(value =
    // "/sedimentation/history/interface/{locationNumber}/{processStep}", method =
    // RequestMethod.PUT)
    // public ResponseEntity<String> getInterfaceHistorySedimentation(
    // @PathVariable int locationNumber, @RequestBody InterfaceDateSearchDTO
    // dateSearchDTO, @PathVariable int processStep)
    // {
    // log.debug("getInterfaceHistorySedimentation, location:[{}], start:[{}],
    // end:[{}]",
    // locationNumber, dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
    //
    // // 침전 공정 데이터 조회
    // List<AiSedimentationInterfaceRealtimeDTO>
    // aiSedimentationInterfaceRealtimeList =
    // databaseService.getAiSedimentationInterfaceRealtimeValueFromUpdateTime(dateSearchDTO,
    // processStep);
    // log.debug("getAiSedimentationInterfaceRealtimeValueFromUpdateTime,
    // result:[{}]", aiSedimentationInterfaceRealtimeList.size());
    // if(aiSedimentationInterfaceRealtimeList.size() > 0)
    // {
    // // Make Response Body
    // LinkedHashMap<String, Object> seriesInterfaceInfo = new LinkedHashMap<>();
    // SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd
    // HH:mm:ss");
    // String strDate;
    //
    // // 계열별 계면계 측정 이력 정보를 분리 저장하기 위한 변수 선언
    // LinkedHashMap<String, Float> series1InterfaceMap = new LinkedHashMap<>();
    // LinkedHashMap<String, Float> series2InterfaceMap = new LinkedHashMap<>();
    // for(AiSedimentationInterfaceRealtimeDTO dto :
    // aiSedimentationInterfaceRealtimeList)
    // {
    // strDate = simpleDateFormat.format(dto.getUpdate_time());
    // series1InterfaceMap.put(strDate, dto.getAIE_9901());
    // series2InterfaceMap.put(strDate, dto.getAIE_9902());
    // }
    //
    // // Whole sedimentation interface history
    // if(locationNumber == 0)
    // {
    // seriesInterfaceInfo.put("series1", series1InterfaceMap);
    // seriesInterfaceInfo.put("series2", series2InterfaceMap);
    // }
    // else
    // {
    // List<TagManageDTO> tagManageList =
    // databaseService.getTagManageFromCode(CommonValue.PROCESS_SEDIMENTATION,
    // processStep);
    // if(tagManageList.size() > 0)
    // {
    // // Get series number
    // int nSeriesNumber = 0;
    // for(TagManageDTO dto : tagManageList)
    // {
    // if(dto.getLoc() == locationNumber)
    // {
    // nSeriesNumber = dto.getSer();
    // break;
    // }
    // }
    //
    // if(nSeriesNumber == 1)
    // {
    // seriesInterfaceInfo.put("series1", series1InterfaceMap);
    // }
    // else if(nSeriesNumber == 2)
    // {
    // seriesInterfaceInfo.put("series2", series2InterfaceMap);
    // }
    // else
    // {
    // String strErrorBody = "{\"reason\":\"Invalid location number.\"}";
    // return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
    // }
    // }
    // else
    // {
    // String strErrorBody = "{\"reason\":\"Empty tag_manage\"}";
    // return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
    // }
    // }
    //
    // Map<String, Object> responseBody = new HashMap<>();
    // responseBody.put("interface", seriesInterfaceInfo);
    //
    // ObjectMapper objectMapper = new ObjectMapper();
    // String strBody;
    // try
    // {
    // // ObjectMapper를 통해 JSON 값을 String으로 변환
    // strBody = objectMapper.writeValueAsString(responseBody);
    // }
    // catch(JsonProcessingException e)
    // {
    // String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
    // return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // return new ResponseEntity<>(strBody, HttpStatus.OK);
    // }
    // else
    // {
    // String strErrorBody = "{\"reason\":\"Empty ai_sedimentation_realtime\"}";
    // return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
    // }
    // }

    /**
     * 침전수 잔류염소 측정 이력 조회
     * 
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @param processStep       공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/history/cl/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getClHistorySedimentation(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getClHistorySedimentation, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList = databaseService
                .getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionIndex);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        if (aiDisinfectionRealtimeList.size() > 0) {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> series2 = new LinkedHashMap<>();

            // aiDisinfectionRealtimeList에서 계열별 침전지 잔류염소 를 조회하여 계열별 map에 저장
            if(disinfectionIndex == 1 && processStep == 1) {
                for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                    String strDate = simpleDateFormat.format(dto.getUpd_ti());
                    series1.put(strDate, dto.getE1_cl());
                }
            }else {
            	for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
            		String strDate = simpleDateFormat.format(dto.getUpd_ti());
            		series1.put(strDate, dto.getG_e_1_residual_cl());
            		series2.put(strDate, dto.getG_e_2_residual_cl());
            	}            	
            }

            LinkedHashMap<String, Object> seriesClInfo = new LinkedHashMap<>();
            seriesClInfo.put("series1", series1);
            seriesClInfo.put("series2", series2);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("cl", seriesClInfo);

            ObjectMapper objectMapper = new ObjectMapper();
            String strBody;
            try {
                // ObjectMapper를 통해 JSON 값을 String으로 변환
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 침전수 탁도 측정 이력 조회
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/history/tb/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getTbHistorySedimentation(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep) {
        log.debug("getTbHistorySedimentation, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 약품 공정 데이터 조회
        List<AiCoagulantRealtimeDTO> aiCoagulantRealtimeList = databaseService
                .getAiCoagulantRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiCoagulantRealtimeValueFromUpdateTime, result:[{}]", aiCoagulantRealtimeList.size());
        if (aiCoagulantRealtimeList.size() > 0) {
            // Make Response Body
            // 계열별 데이터를 분리 저장하기 위한 변수 선언
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> series2 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;
            ObjectMapper objectMapper = new ObjectMapper();

            try {
                // aiCoagulantRealtimeList에서 침전지 탁도 정보를 조회하여 계열별 map에 등록
                for (AiCoagulantRealtimeDTO dto : aiCoagulantRealtimeList) {
                    String strDate = simpleDateFormat.format(dto.getUpd_ti());

                    // 1호기 데이터만 put
                    series1.put(strDate, dto.getCTbE());

                    // mapTemp = objectMapper.readValue(dto.getC_tb(), LinkedHashMap.class);
                    // ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    // Object objectTemp = mapTemp.get(keyList.get(0));
                    //
                    // JsonCSeriesFloat e_ser_tb_b = objectMapper.convertValue(objectTemp,
                    // JsonCSeriesFloat.class);
                    // series1.put(strDate, e_ser_tb_b.getSeries1());
                    // series2.put(strDate, e_ser_tb_b.getSeries2());

                }

                LinkedHashMap<String, Object> seriesTbInfo = new LinkedHashMap<>();
                seriesTbInfo.put("series1", series1);
                seriesTbInfo.put("series2", series2);

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("tb", seriesTbInfo);

                // ObjectMapper를 통해 JSON 값을 String으로 변환
                String strBody = objectMapper.writeValueAsString(responseBody);
                return new ResponseEntity<>(strBody, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                log.error("JsonProcessingException Occurred in /sedimentation/history/tb API");
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_coagulant_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 침전지 탁도 정규분포 데이터 조회
     * 
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/distribution/tb/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getTbDistributionSedimentation(@PathVariable int processStep) {
        // Use coagulant_realtime table
        log.debug("Recv getTbDistributionSedimentation");

        // get tag_manage
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_COAGULANT,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_COAGULANT, tagManageList.size());

        // Get start_time(before seven days)
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -7);

        Date startTime = calendar.getTime();

        // Make Response Body
        int nTotalSize = 0;
        LinkedHashMap<String, Object> seriesTbInfo = new LinkedHashMap<>();
        for (TagManageDTO tagManage : tagManageList) {
            if (tagManage.getItm().equalsIgnoreCase("e1_tb_b") == true) {
                // 1계열 침전지 탁도 정규분포 데이터를 조회하여 series1에 저장
                List<FrequencyDTO> frequencyList = databaseService.getCoagulantDistribution(startTime,
                        tagManage.getTag_sn(), processStep);
                nTotalSize += frequencyList.size();

                Map<String, Integer> countBody = new LinkedHashMap<>();
                for (FrequencyDTO dto : frequencyList) {
                    if (dto.getValue() == null) {
                        continue;
                    }
                    countBody.put(dto.getValue(), dto.getCount());
                }
                seriesTbInfo.put("series1", countBody.isEmpty() == true ? null : countBody);
            } else if (tagManage.getItm().equalsIgnoreCase("e2_tb_b") == true) {
                // 2계열 침전지 탁도 정규분포 데이터를 조회하여 series2에 저장
                List<FrequencyDTO> frequencyList = databaseService.getCoagulantDistribution(startTime,
                        tagManage.getTag_sn(), processStep);
                nTotalSize += frequencyList.size();

                Map<String, Integer> countBody = new LinkedHashMap<>();
                for (FrequencyDTO dto : frequencyList) {
                    if (dto.getValue() == null) {
                        continue;
                    }
                    countBody.put(dto.getValue(), dto.getCount());
                }
                seriesTbInfo.put("series2", countBody.isEmpty() == true ? null : countBody);
            }
        }

        if (nTotalSize == 0) {
            String strErrorBody = "{\"reason\":\"Empty TB Trend\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("tb", seriesTbInfo);

        String strBody = "";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // ObjectMapper를 통해 JSON 값을 String으로 변환
            strBody = objectMapper.writeValueAsString(responseBody);
        } catch (JsonProcessingException e) {
            String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(strBody, HttpStatus.OK);
    }

    /**
     * 침전 공정 제어모드 변경
     * 
     * @param operationMode 제어모드
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/control/operation/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlSedimentation(@RequestBody InterfaceOperationModeDTO operationMode,
            @PathVariable int processStep) {
        log.info("putOperationControlSedimentation, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_sedimentation_init's operation_mode
        // log.debug("update aiSedimentationOperationMode:[{}], mode:[{}]",
        // databaseService.modAiSedimentationOperationMode(nOperationMode),
        // nOperationMode);
        
        // update operation mode
        databaseService.modAiSedimentationOperationMode(nOperationMode, processStep);

        // send control value to kafka ai_control(e_operation_mode)
        AiProcessInitDTO aiSedimentationInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE,
                processStep);
        log.debug("getAiSedimentationInit, result:[{}]", aiSedimentationInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiSedimentationInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiSedimentationInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 침전 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("e_operation_mode_a") == true && CommonValue.PROCESS_SEDIMENTATION
	                        .concat(String.valueOf(processStep)).equals(dto.getProc_cd())) {
	                    // Kafka에 전송할 값 정의
	                    controlMap = new LinkedHashMap<>();
	                    controlMap.put("tag", dto.getTag_sn());
	                    controlMap.put("value", nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true);
	                    controlMap.put("time", strDate);
	
	                    // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	                    objectMapper = new ObjectMapper();
	                    strBody = objectMapper.writeValueAsString(controlMap);
	                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	
	                    break;
	                }
	            }
        	}else {
        		log.error("Does not exist aiSedimentationInit:[{}]", CommonValue.E_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /sedimentation/control/operation API");
        }
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 침전 알고리즘 설정값 변경
     * 
     * @param sedimentationSc Front-end 침전 공정 알고리즘 설정값을 저장하기 위한 DTO
     * @param processStep     공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/control/sc/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putScControlSedimentation(@RequestBody InterfaceSedimentationScDTO sedimentationSc,
            @PathVariable int processStep) {
        log.debug("putScControlSedimentation, sc:[{}]", sedimentationSc);

        boolean result = true;

        // update 슬러지 수집기 운행 기준 적산 슬러지 양
        result = (databaseService.modAiSedimentationInit("e_sc_set_sludge_q", sedimentationSc.getE_sc_set_sludge_q(),
                processStep) == 1) && result;
        // update 슬러지 수집기 운행 대기 최대 일
        result = (databaseService.modAiSedimentationInit("e_sc_set_max_wait", sedimentationSc.getE_sc_set_max_wait(),
                processStep) == 1) && result;
        // update 슬러지 수집기 편도 운전 거리
        result = (databaseService.modAiSedimentationInit("e_set_lt", sedimentationSc.getE_set_lt(), processStep) == 1)
                && result;
        // update 슬러지 수집기 운전 시간
        result = (databaseService.modAiSedimentationInit("e_sc_set_ti", sedimentationSc.getE_sc_set_ti(),
                processStep) == 1) && result;
        // update 대차 운전주기 최소기준시간
        result = (databaseService.modAiSedimentationInit("e_low_hour", sedimentationSc.getE_low_hour(),
                processStep) == 1) && result;

        if (result == true) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_sedimentation_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 침전 공정 지별 AI 모드 변경
     * 
     * @param locationNumber 선택한 지
     * @param aiOnOff        Front-end 지별 AI ON/OFF 명령을 저장하기 위한 DTO
     * @param processStep    공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/sedimentation/control/location/{locationNumber}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putLocationControlSedimentation(@PathVariable int locationNumber,
            @RequestBody InterfaceAiOnOffDTO aiOnOff, @PathVariable int processStep) {
        log.debug("putLocationControlSedimentation, location:[{}], AI:[{}]", locationNumber, aiOnOff.getAi());

        // get location number(지 번호)
        TagManageRangeDTO sedimentationRange = databaseService.getTagManageRange(CommonValue.PROCESS_SEDIMENTATION,
                processStep);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_SEDIMENTATION,
                sedimentationRange != null ? 1 : 0);

        int nLocationMin = 0, nLocationMax = 0;
        if (sedimentationRange != null) {
            nLocationMin = sedimentationRange.getMin();
            nLocationMax = sedimentationRange.getMax();
        }

        // 지 번호 검사
        if (locationNumber < nLocationMin || locationNumber > nLocationMax) {
            log.debug("invalid location number:[{}]", locationNumber);
            String strErrorBody = "{\"reason\":\"invalid location number\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // ON/OFF 값 검사
        if (aiOnOff.getAi() < CommonValue.AI_OFF || aiOnOff.getAi() > CommonValue.AI_ON) {
            log.debug("invalid AI on/off:[{}]", aiOnOff.getAi());
            String strErrorBody = "{\"reason\":\"invalid on/off value\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // 지별 AI 모드 업데이트
        if (databaseService.modAiSedimentationInit("e_sc_set" + locationNumber, aiOnOff.getAi(), processStep) == 1) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_sedimentation_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}