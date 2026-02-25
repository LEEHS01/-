package co.irexnet.waio.WAIO_ServerAgent.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiFilterRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceAiOnOffDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceFilterDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceOperationModeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageRangeDTO;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class FilterController {
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 여과 공정 최근 데이터 조회
     * 
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/filter/latest/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestFilter(@PathVariable int processStep) {
        log.debug("Recv getLatestFilter");

        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());

        // get ai_filter_init(f_operation_mode)
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, processStep);
        log.debug("getAiFilterInit(operation_mode), result:[{}]", aiFilterInit != null ? 1 : 0);

        // get all ai_filter_init
        List<AiProcessInitDTO> aiFilterInitList = databaseService.getAllAiFilterInit(processStep);
        log.debug("getAiFilterInitList, result:[{}]", aiFilterInitList.size());

        // get ai_filter_realtime
        AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue(processStep);
        log.debug("getLatestAiFilterRealtimeValue, result: [{}]", aiFilterRealtime != null ? 1 : 0);

        // get filter_realtime
        List<ProcessRealtimeDTO> filterRealtime = databaseService.getLatestFilterRealtimeValue(strPartitionName,
                processStep);
        log.debug("getLatestFilterRealtimeValue, result:[{}]", filterRealtime.size());

        // get tag_manage(filter)
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_FILTER,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_FILTER, tagManageList.size());

        // get location number(지 번호)
        TagManageRangeDTO filterRange = databaseService.getTagManageRange(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_FILTER, filterRange != null ? 1 : 0);

        int nLocationMin = 0, nLocationMax = 0;
        if (filterRange != null) {
            nLocationMin = filterRange.getMin();
            nLocationMax = filterRange.getMax();
        }

        if (aiFilterRealtime != null) {
            // JSON 처리를 위한 ObjectMapper 선언
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiFilterInfo = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;

            // update_time
            aiFilterInfo.put("upd_ti", aiFilterRealtime.getUpd_ti());
            // operation_mode
            aiFilterInfo.put("ai_opr",
                    aiFilterInit != null ? aiFilterInit.getInit_val().intValue() : aiFilterRealtime.getAi_opr());
            // peak_mode
            aiFilterInfo.put("peak_mode", aiFilterRealtime.getF_peak_mode());

            // 지별 각 상태 플래그 값
            LinkedHashMap<String, Object> locationStateMap = new LinkedHashMap<>();
            
            //f_operation_mode map / pattern
            LinkedHashMap<String, Object> locationOprMap = new LinkedHashMap<>();
            Pattern pattern = Pattern.compile("f_operation_ji(\\d+)");
            
            //init list
            for(AiProcessInitDTO dto : aiFilterInitList) {
            	//최대 여과 지속시간
            	if(dto.getItm().equalsIgnoreCase(CommonValue.F_LOCATION_TI_SET_MAX)) {
            		if(dto.getInit_val() != null) {
            			aiFilterInfo.put("f_location_ti_set_max", dto.getInit_val().intValue());            			
            		}else {
                        aiFilterInfo.put("f_location_ti_set_max", null);
            		}
            	// 최대 한계 수위
            	}else if(dto.getItm().equalsIgnoreCase("f_location_wl_max")) {
            		if(dto.getInit_val() != null) {
            			aiFilterInfo.put("f_location_wl_max", dto.getInit_val());            			
            		}else {
                        aiFilterInfo.put("f_location_wl_max", null);
            		}
            	// 역세수조 기준수위 (1단계)
            	}else if(dto.getItm().equalsIgnoreCase("f_bw_tank_le")) {
            		if(dto.getInit_val() != null) {
            			aiFilterInfo.put("f_bw_tank_le", dto.getInit_val());            			
            		}else {
                        aiFilterInfo.put("f_bw_tank_le", null);
            		}
                // (1단계) 회수조 기준수위 / (2단계) 배출수지 기준수위
            	}else if(dto.getItm().equalsIgnoreCase("f_back_le")) {
            		if(dto.getInit_val() != null) {
            			aiFilterInfo.put("f_back_le", dto.getInit_val());            			
            		}else {
                        aiFilterInfo.put("f_back_le", null);
            		}
            	// 정수지 기준수위(2단계)
            	}else if(dto.getItm().equalsIgnoreCase("f_h_le")) {
            		if(dto.getInit_val() != null) {
            			aiFilterInfo.put("f_h_le", dto.getInit_val());            			
            		}else {
                        aiFilterInfo.put("f_h_le", null);
            		}
            	}else if(dto.getItm().equalsIgnoreCase(CommonValue.F_OPERATION_MODE)){
            		continue;
            	//지별 운영모드
            	}else {
                    Matcher matcher = pattern.matcher(dto.getItm());
                    if(matcher.matches()) {
                    	int nLocation = Integer.parseInt(matcher.group(1));
                    	locationOprMap.put("location"+nLocation, dto.getInit_val().intValue());
                    }
            	}
            }
            
            aiFilterInfo.put("f_loc_operation_mode", locationOprMap);

            // Realtime data from SCADA
            for (TagManageDTO tagManage : tagManageList) {
                for (ProcessRealtimeDTO dto : filterRealtime) {
                    if (tagManage.getItm().equalsIgnoreCase("d1_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 혼화지 유입 유량
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("e1_tb_b") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 침전지 후탁도
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("f_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 여과지 유출 유량
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                }
            }

            // 지별 수위, 지별 탁도, 지별 여과 지속 시간, 운영 지수, 지별 상태를 저장하기 위한 변수 선언
            LinkedHashMap<String, Object> locationLeMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationTbMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationTiMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationFriOutMap = new LinkedHashMap<>();

            int[] notRuningJi = { 7, 8, 9, 10, 11, 12 };
            List<int[]> notRuningJiList = Arrays.asList(notRuningJi);

            for (int i = nLocationMin; i <= nLocationMax; i++) {

                int nOperationCount = 0;
                int nLocationTi = 0; // 지별 여과 지속 시간을 계산하기 위한 변수
                int nLocationState = 0; // 지별 현재 상태를 저장하기 위한 변수

                // 1단계 여과의 경우 여과지 7~12지를 사용하지 않는다
                if (processStep == 1) {
                    if (notRuningJiList.contains(i)) {
                        continue;
                    }
                }

                try {
                    // mapTemp = objectMapper.readValue(aiFilterRealtime.getF_fil_ready(),
                    // LinkedHashMap.class);
                    // ArrayList<String>keyList = new ArrayList<>(mapTemp.keySet());
                    // Object objectTemp = mapTemp.get(keyList.get(0));
                    // mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    // keyList = new ArrayList<>(mapTemp.keySet());

                    // for(String key : keyList) {
                    // int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                    // if(status == 1) {
                    // nLocationState = CommonValue.FILTER_STATE_READY;
                    // locationStateMap.put(key, nLocationState);
                    // }
                    // }

                    // 여과중
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getF_fil_ing(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));
                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for (String key : keyList) {
                        int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                        if (status == 1) {
                            nLocationState = CommonValue.FILTER_STATE_ING;
                            locationStateMap.put(key, nLocationState);
                            nOperationCount++;
                        }
                    }

                    // 역세대기중
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getF_bw_wait(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for (String key : keyList) {
                        int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                        if (status == 1) {
                            nLocationState = CommonValue.FILTER_STATE_BW_WAIT;
                            locationStateMap.put(key, nLocationState);
                        }
                    }

                    // 역세중
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getF_bw_ing(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for (String key : keyList) {
                        int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                        if (status == 1) {
                            nLocationState = CommonValue.FILTER_STATE_BW_ING;
                            locationStateMap.put(key, nLocationState);
                        }
                    }

                    // 여과대기중
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getF_fil_wait(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for (String key : keyList) {
                        int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                        if (status == 1) {
                            nLocationState = CommonValue.FILTER_STATE_WAIT;
                            locationStateMap.put(key, nLocationState);
                        }
                    }

                    // 시동방수중
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getF_dr_ing(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));
                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for (String key : keyList) {
                        int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                        if (status == 1) {
                            nLocationState = CommonValue.FILTER_STATE_DR_ING;
                            locationStateMap.put(key, nLocationState);
                        }
                    }

                    // 운휴중
                    if (aiFilterRealtime.getF_rest() != null) {
                        mapTemp = objectMapper.readValue(aiFilterRealtime.getF_rest(), LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));
                        mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());

                        for (String key : keyList) {
                            int status = objectMapper.convertValue(mapTemp.get(key), Integer.class);

                            if (status == 1) {
                                nLocationState = CommonValue.FILTER_STATE_REST;
                                locationStateMap.put(key, nLocationState);
                            }
                        }
                    }
                    aiFilterInfo.put("f_loc_stt", locationStateMap);
                    // 현재 운영지 수
                    aiFilterInfo.put("f_opr_cnt", nOperationCount);

                } catch (JsonMappingException e1) {
                    log.error("JsonMappingException in Get location State of Ji");
                } catch (JsonProcessingException e1) {
                    log.error("JsonProcessingException in Get location State of Ji");
                }

                String strLeName = "f_loc_le" + i; // 각 지별 수위
                String strTbName = "f_loc_tb" + i; // 각 지별 탁도
                String strTiHName = "f_location_ti_h" + i; // 각 지별 여과시간 (시)
                String strTiMName = "f_location_ti_m" + i; // 각 지별 여과시간 (분)
                String strFriOutName = "f_fri_out" + i; // 각 지별 유출유량 값

                for (TagManageDTO tagManage : tagManageList) {
                    for (ProcessRealtimeDTO dto : filterRealtime) {
                        if (tagManage.getItm().equalsIgnoreCase(strLeName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 지별 수위 값 등록
                            locationLeMap.put("location" + i, Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTbName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 지별 탁도 값 등록
                            locationTbMap.put("location" + i, Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTiHName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 지별 여과 지속 시간 계산(시)
                            nLocationTi += (int) Float.parseFloat(dto.getTag_val()) * 60;
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTiMName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 지별 여과 지속 시간 계산(분)
                            nLocationTi += (int) Float.parseFloat(dto.getTag_val());
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strFriOutName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            locationFriOutMap.put("location" + i, Float.parseFloat(dto.getTag_val()));
                            break;
                        }
                    }
                }
                locationTiMap.put("location" + i, nLocationTi);
            }

            try {
                // ---------------- 실시간 데이터 정보 Setting for Response Start ----------------
                aiFilterInfo.put("f_loc_le", locationLeMap); // 실시간 지별 수위
                aiFilterInfo.put("f_loc_tb", locationTbMap); // 실시간 지별 탁도
                aiFilterInfo.put("f_loc_ti", locationTiMap); // 실시간 지별 여과 지속시간
                aiFilterInfo.put("f_loc_out_fr", locationFriOutMap);// 실시간 지별 유출유량
                // ---------------- 실시간 데이터 정보 Setting for Response End ----------------

                // ---------------- AI 실시간 데이터 정보 Setting for Response Start ----------------
                aiFilterInfo.put("f_sp", aiFilterRealtime.getF_sp()); // TB_AI_F_RT : IN_VAL 데이터로부터 '여과속도' 조회

                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_opr_cnt(), LinkedHashMap.class);
                ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                Object objectTemp = mapTemp.get(keyList.get(0));

                mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));
                aiFilterInfo.put("ai_f_opr_cnt", objectTemp);

                // aiFilterInfo.put("ai_f_opr_cnt", aiFilterRealtime.getAi_f_opr_cnt()); // AI
                // 운영지 수 예측
                aiFilterInfo.put("ai_f_loc_le",
                        objectMapper.readValue(aiFilterRealtime.getAi_f_wl(), LinkedHashMap.class)); // AI 지별 수위 예측
                                                                                                     // (JSON데이터 -> Map)

                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_time(), LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));
                aiFilterInfo.put("ai_f_loc_ti", objectTemp);

                // AI 지별 역세 시작 시점 예측
                // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_loc_bw_ti(), LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));
                aiFilterInfo.put("ai_f_loc_bw_ti", objectTemp);

                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_location_operation(), LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                objectTemp = mapTemp.get(keyList.get(0));
                aiFilterInfo.put("ai_f_location_schedule", objectTemp);
                // ---------------- AI 실시간 데이터 정보 Setting for Response End ----------------

            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (NumberFormatException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error, Number Format Exception\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiFilterInfo);

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
            String strErrorBody = "{\"reason\":\"Empty ai_filter\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 실시간 여과 공정 지별 세부 항목 조회
     * 
     * @param locationNumber 선택한 지
     * @param processStep    공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/filter/location/{locationNumber}/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLocationFilter(@PathVariable int locationNumber, @PathVariable int processStep) {
        log.debug("getLocationFilter, locationNumber:[{}]", locationNumber);

        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_FILTER,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_FILTER, tagManageList.size());
        if (tagManageList.size() > 0) {
            // Front-end로부터 전달받은 지 번호가 tag_manage에 등록되었는지 검사
            int nLocNumber = 0;
            for (TagManageDTO dto : tagManageList) {
                if (dto.getLoc() == locationNumber) {
                    nLocNumber = dto.getLoc();
                    break;
                }
            }

            // 등록되지 않은 지 번호는 에러처리
            if (nLocNumber == 0) {
                String strErrorBody = "{\"reason\":\"Invalid location number.\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            }

            // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
            Calendar calendarToday = Calendar.getInstance();
            calendarToday.set(Calendar.MINUTE, 0);
            calendarToday.set(Calendar.SECOND, 0);
            calendarToday.set(Calendar.HOUR_OF_DAY, 0);
            SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
            String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
            // get ai_filter_realtime
            AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue(processStep);
            log.debug("getLatestAiFilterRealtimeValue, result:[{}]", aiFilterRealtime != null ? 1 : 0);

            // get filter_realtime
            List<ProcessRealtimeDTO> filterRealtime = databaseService.getLatestFilterRealtimeValue(strPartitionName,
                    processStep);
            log.debug("getLatestFilterRealtimeValue, result:[{}]", filterRealtime.size());
            if (aiFilterRealtime != null) {
                // JSON 처리를 위한 ObjectMapper 선언
                ObjectMapper objectMapper = new ObjectMapper();

                // Make Response Body
                LinkedHashMap<String, Object> aiFilterLocationInfo = new LinkedHashMap<>();
                LinkedHashMap<String, Object> mapTemp;

                // update_time
                aiFilterLocationInfo.put("upd_ti", aiFilterRealtime.getUpd_ti());

                // 수위, 탁도, 여과 지속 시간, 역세 후 대기 시간/분을 저장하기 위한 변수 선언
                String strLeName = "f_loc_le" + locationNumber;
                String strTbName = "f_loc_tb" + locationNumber;
                String strTiHName = "f_location_ti_h" + locationNumber;
                String strTiMName = "f_location_ti_m" + locationNumber;
                String strBwWaitTiHName = "f_location_bw_wait_ti_h" + locationNumber;
                String strBwWaitTiMName = "f_location_bw_wait_ti_m" + locationNumber;

                int nLocationTi = 0; // 여과 지속 시간을 계산하기 위한 변수
                int nLocationBwWaitTi = 0; // 역세 후 대기 시간을 계산하기 위한 변수

                // Realtime data from SCADA
                // tag_manage에 정의한 태그명을 통해 실시간 데이터를 가져와 aiFilterLocationInfo에 등록
                for (TagManageDTO tagManage : tagManageList) {
                    for (ProcessRealtimeDTO dto : filterRealtime) {
                        if (tagManage.getItm().equalsIgnoreCase("d1_in_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 혼화지 유입 유량
                            aiFilterLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase("f_out_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 여과지 유출 유량
                            aiFilterLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strLeName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 여과지 수위
                            aiFilterLocationInfo.put("f_loc_le", Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTbName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 여과지 탁도
                            aiFilterLocationInfo.put("f_loc_tb", Float.parseFloat(dto.getTag_val()));
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTiHName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 여과 지속 시간 계산(시)
                            nLocationTi += (int) Float.parseFloat(dto.getTag_val()) * 60;
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strTiMName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 여과 지속 시간 계산(분)
                            nLocationTi += (int) Float.parseFloat(dto.getTag_val());
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strBwWaitTiHName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 역세 후 대기 시간 계산(시)
                            nLocationBwWaitTi += (int) Float.parseFloat(dto.getTag_val()) * 60;
                            break;
                        } else if (tagManage.getItm().equalsIgnoreCase(strBwWaitTiMName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 역세 후 대기 시간 계산(분)
                            nLocationBwWaitTi += (int) Float.parseFloat(dto.getTag_val());
                            break;
                        }
                    }
                }

                aiFilterLocationInfo.put("f_loc_ti", nLocationTi);
                aiFilterLocationInfo.put("f_loc_bw_wt_ti", nLocationBwWaitTi);

                try {
                    // AI 수위 예측
                    // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_wl(), LinkedHashMap.class);
                    ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));

                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_loc_le", mapTemp.get("location" + locationNumber));

                    // AI 여과 지속 시간 예측
                    // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_time(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));

                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    Integer ai_f_loc_ti = Integer.parseInt(mapTemp.get("location" + locationNumber).toString());
                    aiFilterLocationInfo.put("ai_f_loc_ti", ai_f_loc_ti);

                    // AI 역세 시작 시간 예측
                    // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_loc_bw_ti(), LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));

                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_loc_bw_ti", mapTemp.get("location" + locationNumber));

                    // AI 여과 종료 시간 예측(AI 여과 지속 시간 예측 - 현재 여과 지속 시간)
                    aiFilterLocationInfo.put("ai_f_location_end_ti", ai_f_loc_ti - nLocationTi);

                    // 여과 속도
                    aiFilterLocationInfo.put("f_sp", aiFilterRealtime.getF_sp());

                    // 역세 후 대기 시간
                    // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                    if (aiFilterRealtime.getF_time_bw_per() != null) {
                        mapTemp = objectMapper.readValue(aiFilterRealtime.getF_time_bw_per(), LinkedHashMap.class);
                        keyList = new ArrayList<>(mapTemp.keySet());
                        objectTemp = mapTemp.get(keyList.get(0));

                        mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                        aiFilterLocationInfo.put("f_time_bw_per", mapTemp.get("location" + locationNumber));
                    }

                    // AI 운영 스케쥴 예측
                    // 데이터 값이 JSON으로 저장되어 있으므로 JSON 처리
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_location_operation(),
                            LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());
                    objectTemp = mapTemp.get(keyList.get(0));

                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_location_schedule", mapTemp.get("location" + locationNumber));
                } catch (JsonProcessingException e) {
                    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("location", aiFilterLocationInfo);

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
                String strErrorBody = "{\"reason\":\"Empty ai_filter\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            }
        } else {
            String strErrorBody = "{\"reason\":\"Empty tag_manage\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 여과 공정 제어모드 변경
     * 
     * @param putOperationControlFilter Front-end AI 운영 모드를 저장하기 위한 DTO
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/filter/control/operation/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlFilter(@RequestBody InterfaceOperationModeDTO operationMode,
            @PathVariable int processStep) {
        log.info("putOperationControlFilter, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_filter_init's operation_mode
        // log.debug("update aiFilterOperationMode:[{}], mode:[{}]",
        // databaseService.modAiFilterOperationMode(nOperationMode), nOperationMode);

        // update operation mode
        databaseService.modAiFilterOperationMode(nOperationMode, processStep);
        
        // send control value to kafka ai_control(f_operation_mode)
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, processStep);
        log.debug("getAiFilterInit, result:[{}]", aiFilterInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiFilterInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiFilterInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 여과 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("f_operation_mode_a") == true
	                        && CommonValue.PROCESS_FILTER.concat(String.valueOf(processStep)).equals(dto.getProc_cd())) {
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
        		log.error("Does not exist aiFilterInit:[{}]", CommonValue.F_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /filter/control/operation API");
        }
        return new ResponseEntity<>("", HttpStatus.OK);
    }


    /**
     * 여과 공정 최대 여과 지속 시간 및 한계 수위 설정
     * @param filterDto
     * @param processStep
     * @return
     */
    @RequestMapping(value = "/filter/control/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putControlFilter(@RequestBody InterfaceFilterDTO filterDto, @PathVariable int processStep)
    {
        int nTi = filterDto.getF_location_ti_set_max();        
        float wl = filterDto.getF_location_wl_max();
        float fBwTankLe = filterDto.getF_bw_tank_le();
        float fBackLe = filterDto.getF_back_le();
        float fHLe = filterDto.getF_h_le();
        log.info("putControlFilter, filterDto:[{}], ", filterDto);
        
        // 잘못된 값 검사
        if(nTi < 0 )
        {
            log.error("Invalid ti:[{}]", nTi);
            String strErrorBody = "{\"reason\":\"Invalid ti\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        boolean result = true;
        
        result = (databaseService.modAiFilterInitTi(nTi, processStep) == 1 ) && result;
        result = (databaseService.modAiFilterInit("f_location_wl_max", wl, processStep) == 1 ) && result;
        if(processStep == 1) {
        	result = (databaseService.modAiFilterInit("f_bw_tank_le", fBwTankLe, processStep) == 1 ) && result;        	
        }else {
        	result =  (databaseService.modAiFilterInit("f_h_le", fHLe, processStep) == 1 ) && result; 
        }
        result = (databaseService.modAiFilterInit("f_back_le", fBackLe, processStep) == 1 ) && result;
        log.debug("modAiFilterInit, result:[{}]", result);

        if(result)
        {
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else
        {
            String strErrorBody = "{\"reason\":\"ai_filter_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * 여과 지별 공정 운영모드 변경
     * @param processStep
     * @param locationNumber
     * @param aiOnOff
     * @return
     */
    @RequestMapping(value= "/filter/control/location/{processStep}/{locationNumber}")
    public ResponseEntity<String> putLocationControlFilter(@PathVariable int processStep, @PathVariable int locationNumber, @RequestBody InterfaceAiOnOffDTO aiOnOff)
    {
        log.debug("putLocationControlFilter, location:[{}], AI:[{}]", locationNumber, aiOnOff.getAi());
        
        // ON/OFF 값 검사
        if(aiOnOff.getAi() < CommonValue.AI_OFF || aiOnOff.getAi() > CommonValue.AI_ON)
        {
        log.debug("invalid AI on/off:[{}]", aiOnOff.getAi());
            String strErrorBody = "{\"reason\":\"invalid on/off value\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        // 지별 AI 모드 업데이트
        if(databaseService.modAiFilterInit("f_operation_ji" + locationNumber, (float)aiOnOff.getAi(), processStep) == 1) {
        	return new ResponseEntity<>("", HttpStatus.OK);
        }else {
            String strErrorBody = "{\"reason\":\"ai_filter_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
    }


    /**
     * AI 여과 운영 스케쥴 예측값 조회
     * @param processStep
     * @return
     */
    @RequestMapping(value = "/filter/schedule/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getScheduleFilter(@PathVariable int processStep) {
        log.debug("Recv getScheduleFilter");

        // get ai_filter_realtime
        AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue(processStep);
        log.debug("getLatestAiFilterRealtimeValue, result:[{}]", aiFilterRealtime != null ? 1 : 0);

        // get ai_gac_realtime
        // AiGacRealtimeDTO aiGacRealtime =
        // databaseService.getLatestAiGacRealtimeValue();
        // log.debug("getLatestAiGacRealtimeValue, result:[{}]", aiGacRealtime != null ?
        // 1 : 0);

        // if(aiFilterRealtime != null && aiGacRealtime != null)
        if (aiFilterRealtime != null) {
            try {
                // 전체 schedule을 저장할 scheduleMap, filterMap 선언
                LinkedHashMap<String, Object> scheduleMap = new LinkedHashMap<>();
                LinkedHashMap<String, Object> filterMap = new LinkedHashMap<>();

                // 여과 schedule
                ObjectMapper objectMapper = new ObjectMapper();
                LinkedHashMap<String, Object> mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_schedule(),
                        LinkedHashMap.class);
                List<String> keyList = new ArrayList<>(mapTemp.keySet());
                Object objectTemp = mapTemp.get(keyList.get(0));

                mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet());
                for (String key : keyList) {
                    if (key.indexOf("location") >= 0) {
                        filterMap.put(key, mapTemp.get(key));
                    }
                }

                scheduleMap.put("filter", filterMap);

                // Make Response Body
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("schedule", scheduleMap);

                // ObjectMapper를 통해 JSON 값을 String으로 변환
                String strBody = objectMapper.writeValueAsString(responseBody);
                return new ResponseEntity<>(strBody, HttpStatus.OK);

            } catch (JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_filter or ai_gac\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}