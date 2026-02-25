package co.irexnet.waio.WAIO_ServerAgent.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiClearOperationBandDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiDisinfectionRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiMixingRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiReceivingRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonBSeriesInt;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonHLocationFloat;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDateSearchDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceOperationModeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceReceivingDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class ReceivingController {
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 착수 공정 최근 데이터 조회
     * 
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/receiving/latest/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestReceiving(@PathVariable int processStep) {
        log.debug("Recv getLatestReceiving");

        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
        // get ai_receiving_init(b_operation_mode)
        AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE,
                processStep);
        log.debug("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1 : 0);

        // get ai_receiving_int
        List<AiProcessInitDTO> aiReceivingInitList = databaseService.getAllAiReceivingInit(processStep);
        log.debug("getAllAiReceivingInit, result:[{}]", aiReceivingInitList.size());

        // get ai_receiving_realtime
        AiReceivingRealtimeDTO aiReceivingRealtime = databaseService.getLatestAiReceivingRealtimeValue(processStep);
        log.debug("getLatestAiReceivingValue, result:[{}]", aiReceivingRealtime != null ? 1 : 0);

        // get receiving_realtime
        List<ProcessRealtimeDTO> receivingRealtime = databaseService.getLatestReceivingRealtimeValue(strPartitionName,
                processStep);
        log.debug("getLatestReceivingRealtimeValue, result:[{}]", receivingRealtime.size());

        // get tag_manage
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_RECEIVING,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_RECEIVING, tagManageList.size());

        if (aiReceivingRealtime != null) {
            // JSON 처리를 위한 ObjectMapper 선언
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiReceivingInfo = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;

            // update_time
            aiReceivingInfo.put("upd_ti", aiReceivingRealtime.getUpd_ti());

            try {
                // operation_mode
                aiReceivingInfo.put("ai_opr", aiReceivingInit != null ? aiReceivingInit.getInit_val().intValue()
                        : aiReceivingRealtime.getAi_opr());
                // ems_mode
                aiReceivingInfo.put("ems_mode", aiReceivingRealtime.getEms_opr());
                aiReceivingInfo.put("b_out_fri", aiReceivingRealtime.getB_out_fri());
                aiReceivingInfo.put("b_lei", aiReceivingRealtime.getH_loc_le());
                aiReceivingInfo.put("b_pump_cnt_h1", aiReceivingRealtime.getB_pump_cnt_h1());
                aiReceivingInfo.put("b_pump_cnt_h2", aiReceivingRealtime.getB_pump_cnt_h2());

                // (현도1취) 펌프 호기별 작동상태
                if (aiReceivingRealtime.getB_pump_on_h1() != null) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getB_pump_on_h1(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    aiReceivingInfo.put("b_pump_on_h1", objectTemp);
                }
                // (현도2취) 펌프 호기별 작동상태
                if (aiReceivingRealtime.getB_pump_on_h2() != null) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getB_pump_on_h2(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    aiReceivingInfo.put("b_pump_on_h2", objectTemp);
                }

                if (aiReceivingRealtime.getAi_b_pump_cb_h1() != null) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_pump_cb_h1(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    aiReceivingInfo.put("ai_b_pump_cb_h1", objectTemp);
                }
                if (aiReceivingRealtime.getAi_b_pump_cb_h2() != null) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_pump_cb_h2(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    aiReceivingInfo.put("ai_b_pump_cb_h2", objectTemp);
                }

                // 펌프 총 가동 대수 예측
                aiReceivingInfo.put("ai_b_pump_cnt", aiReceivingRealtime.getAi_b_pump_cnt());

                for (AiProcessInitDTO dto : aiReceivingInitList) {
                    if (dto.getItm().equalsIgnoreCase("h_target_le_max") == true) {
                        // 정수지 최대 목표 수위
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    } else if (dto.getItm().equalsIgnoreCase("h_target_le_min") == true) {
                        // 정수지 최저 목표 수위
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    } else if (dto.getItm().equalsIgnoreCase("b_valve_max") == true) {
                        // 개도율 변화 최대값
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    } else if (dto.getItm().equalsIgnoreCase("b_valve_min") == true) {
                        // 개도율 변화 최소값
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                }

                // Realtime data from SCADA
                for (TagManageDTO tagManage : tagManageList) {
                    for (ProcessRealtimeDTO dto : receivingRealtime) {
                        if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 유입 유량 순시
                            aiReceivingInfo.put("b_in_fr_i", Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("h_location_le1") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #1 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("h_location_le2") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #2 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("h_location_le3") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #3 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("h_location_le4") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #4 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("h_out_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 유출 유량
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b1_vv_po") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 조절 밸브 개도
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b2_vv_po") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 조절 밸브 개도
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr1") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 현도(취) 취수 토출유량(1~#5)순시
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr2") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 현도(취) 취수 토출유량(6~#10)순시
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr3") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 현도2(취) 유출유량계_순시유량(통신)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr4") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 전동(가)1단계 유입유량(TAG_TO_TAG)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr5") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 전동(가)2단계 유입유량(TAG_TO_TAG)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr6") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 중부권유량(TAG_TO_TAG)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                    }
                }

                // 1단계공업 착수 사용중인 밸브개도
                aiReceivingInfo.put("b_vv_po",
                        Float.parseFloat(StringUtils.isEmpty(aiReceivingInfo.get("b1_vv_po")) ? "0"
                                : aiReceivingInfo.get("b1_vv_po").toString()) > Float
                                        .parseFloat(StringUtils.isEmpty(aiReceivingInfo.get("b2_vv_po")) ? "0"
                                                : aiReceivingInfo.get("b2_vv_po").toString()) ? "b1_vv_po"
                                                        : "b2_vv_po");

                // AI 원수 유입 유량 예측
                aiReceivingInfo.put("ai_b_in_fri", aiReceivingRealtime.getAi_b_in_fri());

                ArrayList<String> keyList;
                Object objectTemp;
                // AI 원수 조절 밸브 개도 예측
                // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                if (processStep == 1) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_vv_po(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    JsonBSeriesInt ai_b_vv_po = objectMapper.convertValue(objectTemp, JsonBSeriesInt.class);
                    aiReceivingInfo.put("ai_b1_vv_po", ai_b_vv_po.getSeries1());
                    aiReceivingInfo.put("ai_b2_vv_po", ai_b_vv_po.getSeries2());
                } else if (processStep == 2) {
                    // 2단계 밸브 개도 예측 로직 추가 FIXED
                    aiReceivingInfo.put("ai_b_vv_po", aiReceivingRealtime.getAi_b_vv_po());
                }

                // AI 원수 유입 유량 예측 트렌드
                // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_in_fri_trend(), LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));
                aiReceivingInfo.put("ai_b_in_fr_rtd", objectTemp);

                // 정수지 유출 유량
                if (aiReceivingRealtime.getAi_b_out_fri_trend() != null) {
                    mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_out_fri_trend(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    aiReceivingInfo.put("ai_b_out_fr_rtd", objectTemp);
                } else {
                    aiReceivingInfo.put("ai_b_out_fr_rtd", "");
                }

            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiReceivingInfo);

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
            // FIXME 실시간 데이터만 노출하기 위한 분기 처리. 추후 삭제 필요
            // JSON 처리를 위한 ObjectMapper 선언
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiReceivingInfo = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;

            // Realtime data from SCADA
            for (TagManageDTO tagManage : tagManageList) {
                for (ProcessRealtimeDTO dto : receivingRealtime) {
                    if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 유입 유량 순시
                        aiReceivingInfo.put("b_in_fr_i", Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("h_location_le1") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 #1 수위
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("h_location_le2") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 #2 수위
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("h_location_le3") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 #3 수위
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("h_location_le4") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 #4 수위
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("h_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 유출 유량
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("b1_vv_po") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 조절 밸브 개도
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    } else if (tagManage.getItm().equalsIgnoreCase("b2_vv_po") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 조절 밸브 개도
                        aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                    }
                }
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiReceivingInfo);

            String strBody = "";
            try {
                // ObjectMapper를 통해 JSON 값을 String으로 변환
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);

            // TODO AI테이블에 데이터 생성시 주석 해제
            // String strErrorBody = "{\"reason\":\"Empty ai_receiving\"}";
            // return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @deprecated 사용하지 않는 메서드 (24-11-15)
     * 착수정 유출 유량 측정 이력 조회
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/receiving/history/fr/out/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getOutFrHistoryReceiving(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep) {
        log.debug("getOutFrHistoryReceiving, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList = databaseService
                .getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());
        if (aiReceivingRealtimeList.size() > 0) {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> series2 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;

            ObjectMapper objectMapper = new ObjectMapper();

            // aiReceivingRealtimeList에서 착수정 유출 유량을 조회하여 각 계열별로 저장
            for (AiReceivingRealtimeDTO dto : aiReceivingRealtimeList) {
                // mapTemp = objectMapper.readValue(dto.getB_out_fri(), LinkedHashMap.class);
                // ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                // Object objectTemp = mapTemp.get(keyList.get(0));
                // JsonBSeriesInt b_out_fr = objectMapper.convertValue(objectTemp,
                // JsonBSeriesInt.class);
                //
                // String strDate = simpleDateFormat.format(dto.getUpd_ti());
                // series1.put(strDate, b_out_fr.getSeries1());
                // series2.put(strDate, b_out_fr.getSeries2());
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                series1.put(strDate, dto.getB_out_fri());

            }

            LinkedHashMap<String, Object> out_fr = new LinkedHashMap<>();
            out_fr.put("series1", series1);
            // out_fr.put("series2", series2);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("out_fr", out_fr);

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
            String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 정수지 유출 유량 측정 이력 조회
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/clear/history/fr/out/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getOutFrHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep) {
        log.debug("getOutFrHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList = databaseService
                .getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());
        if (aiReceivingRealtimeList.size() > 0) {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> h_out_fr = new LinkedHashMap<>();

            // aiReceivingRealtimeList에서 정수지 유출 유량을 조회하여 h_out_fr에 등록
            for (AiReceivingRealtimeDTO dto : aiReceivingRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                h_out_fr.put(strDate, dto.getH_out_fr());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("out_fr", h_out_fr);

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
            String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 정수지 수위 측정 이력 조회
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/clear/history/le/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getLeHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep) {
        log.debug("getLeHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList = databaseService
                .getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        List<AiClearOperationBandDTO> aiClearOperationBandList;
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());

        if (aiReceivingRealtimeList.size() > 0) {
            aiClearOperationBandList = databaseService.getAiClearOperationBandFromTimeIndex(dateSearchDTO, processStep);
            log.debug("getAiClearOperationBandFromTimeIndex, result:[{}]", aiClearOperationBandList.size());

            // Make Response Body
            // 그래프 처리를 위해 계열별 정수지 수위, 정수지 수위 up band, down band, wide up band, wide down
            // band를 별도의 변수로 저장
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> h_le = new LinkedHashMap<>();
            LinkedHashMap<String, Object> location1 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> location2 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> location3 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> upBand = new LinkedHashMap<>();
            LinkedHashMap<String, Object> downBand = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;

            ObjectMapper objectMapper = new ObjectMapper();
            List<String> keyList;
            Object objectTemp;
            String strDate;
            try {
                // 계열별 정수지 수위값 등록
                for (AiReceivingRealtimeDTO receivingDTO : aiReceivingRealtimeList) {
                    strDate = simpleDateFormat.format(receivingDTO.getUpd_ti());
                    if (processStep == 0) { // 펌프
                        location1.put(strDate, Float.parseFloat(receivingDTO.getH_loc_le()));
                    } else {
                        mapTemp = objectMapper.readValue(receivingDTO.getH_loc_le(), LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));
                        JsonHLocationFloat h_location_le = objectMapper.convertValue(objectTemp,
                                JsonHLocationFloat.class);
                        location1.put(strDate, h_location_le.getLocation1());
                        location2.put(strDate, h_location_le.getLocation2());
                        location3.put(strDate, h_location_le.getLocation3());
                    }
                }

                // 정수지 수위 밴드 값 등록
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(dateSearchDTO.getStart_time());
                for (AiClearOperationBandDTO operationBandDTO : aiClearOperationBandList) {
                    Calendar bandCalendar = Calendar.getInstance();
                    bandCalendar.setTime(operationBandDTO.getTi_seq());

                    calendar.set(Calendar.HOUR_OF_DAY, bandCalendar.get(Calendar.HOUR_OF_DAY));
                    calendar.set(Calendar.MINUTE, bandCalendar.get(Calendar.MINUTE));
                    calendar.set(Calendar.SECOND, bandCalendar.get(Calendar.SECOND));
                    strDate = simpleDateFormat.format(calendar.getTime());
                    upBand.put(strDate, operationBandDTO.getH_bnd_uplmt());
                    downBand.put(strDate, operationBandDTO.getH_bnd_lolmt());
                }
                h_le.put("location1", location1);
                h_le.put("location2", location2);
                h_le.put("location3", location3);
                h_le.put("h_bnd_uplmt", upBand);
                h_le.put("h_bnd_lolmt", downBand);

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("le", h_le);

                String strBody = "";
                try {
                    // ObjectMapper를 통해 JSON 값을 String으로 변환
                    strBody = objectMapper.writeValueAsString(responseBody);
                } catch (JsonProcessingException e) {
                    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return new ResponseEntity<>(strBody, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 정수지 잔류염소 측정 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/clear/history/cl/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getClHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getClHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList = databaseService
                .getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionIndex);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());

        if (aiDisinfectionRealtimeList.size() > 0) {
            // Make Response Body
            // 정수지 유입/유출 잔류염소를 별도로 저장하기 위한 변수 선언
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> h_cl = new LinkedHashMap<>();
            LinkedHashMap<String, Object> in = new LinkedHashMap<>();
            LinkedHashMap<String, Object> out = new LinkedHashMap<>();

            // aiDisinfectionRealtimeList에서 정수지 유입/유출 잔류염소 값을 조회 및 map에 등록
            for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                in.put(strDate, dto.getH_in_cl());
                out.put(strDate, dto.getH_out_cl());
            }
            h_cl.put("in", in);
            h_cl.put("out", out);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("h_cl", h_cl);

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
     * 혼화응집 원수 수온 측정 이력 조회
     * 
     * @param dateSearchDTO 전차염: 1, 중차염: 2, 후차염: 3
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/raw/history/te/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getTeHistoryRaw(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep) {
        log.debug("getTeHistoryRaw, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 혼화응집 공정 데이터 조회
        List<AiMixingRealtimeDTO> aiMixingRealtimeList = databaseService
                .getAiMixingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiMixingRealtimeValueFromUpdateTime, result:[{}]", aiMixingRealtimeList.size());

        if (aiMixingRealtimeList.size() > 0) {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> d_te = new LinkedHashMap<>();

            // aiMixingRealtimeList에서 원수 수온 값을 조회하여 map에 등록
            for (AiMixingRealtimeDTO dto : aiMixingRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                d_te.put(strDate, dto.getD_te());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("te", d_te);

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
            String strErrorBody = "{\"reason\":\"Empty ai_mixing_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 착수 공정 제어모드 변경
     * 
     * @param operationMode 제어모드
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/receiving/control/operation/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlReceiving(@RequestBody InterfaceOperationModeDTO operationMode,
            @PathVariable int processStep) {
        log.info("putOperationControlReceiving, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_receiving_init's operation_mode
        // log.debug("update aiReceivingOperationMode:[{}], mode:[{}]",
        // databaseService.modAiReceivingOperationMode(nOperationMode), nOperationMode);

        // update operation mode
        databaseService.modAiReceivingOperationMode(nOperationMode, processStep);
        
        // send control value to kafka ai_control(b_operation_mode)
        AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE,
                processStep);
        log.debug("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());
        String strProcessStep = processStep == 0 ? "_PUMP" : String.valueOf(processStep);
        try {
        	if(aiReceivingInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiReceivingInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 착수 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("b_operation_mode_a") == true
	                        && CommonValue.PROCESS_RECEIVING.concat(strProcessStep).equals(dto.getProc_cd())) {
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
        		log.error("Does not exist aiReceivingInit:[{}]", CommonValue.B_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /receiving/control/operation API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 착수 공정 정수지 목표 수위 , 개도율 변화 최대값 최소값 설정
     * 
     * @param clearLe     Front-end 착수 공정 정수지 목표 수위 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/receiving/control/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putLeControlReceiving(@RequestBody InterfaceReceivingDTO receivingDTO,
            @PathVariable int processStep) {
        log.debug("putReceivingControlReceiving, :[{}]", receivingDTO);

        // 잘못된 수위 값 검사
        if (receivingDTO.getH_target_le_max() < 0 || receivingDTO.getH_target_le_min() < 0) {
            log.error("Invalid Receiving Data:[{}]", receivingDTO);

            String strErrorBody = "{\"reason\":\"Invalid Receiving Data\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        boolean result = true;

        // 정수지 최대 목표 수위
        result = (databaseService.modAiReceivingInit("h_target_le_max", receivingDTO.getH_target_le_max(), processStep) == 1)
                && result;

        // 정수지 최저 목표 수위
        result = (databaseService.modAiReceivingInit("h_target_le_min", receivingDTO.getH_target_le_min(), processStep) == 1)
                && result;

        if(processStep != 0) {
        	// 개도율 변화 최대값
        	result = (databaseService.modAiReceivingInit("b_valve_max", receivingDTO.getB_valve_max(), processStep) == 1) && result;
        	
        	// 개도율 변화 최소값
        	result = (databaseService.modAiReceivingInit("b_valve_min", receivingDTO.getB_valve_min(), processStep) == 1) && result;
        }
        
        if (result == true) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_receiving_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

}
