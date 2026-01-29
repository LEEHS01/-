package co.irexnet.waio.WAIO_ServerAgent.controller;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.*;
import co.irexnet.waio.WAIO_ServerAgent.dto.*;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.service.MakeTagMapServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
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
public class FilterController
{
	@Autowired
	MakeTagMapServiceImpl tagMapService;
	
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
    public ResponseEntity<String> getLatestFilter(@PathVariable int processStep)
    {
        log.debug("Recv getLatestFilter");

        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
//        strPartitionName = "20231201"; // FIXME 현재날짜 수정

        // get ai_filter_init(f_operation_mode) TB_AI_F_INIT 조회
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, processStep);
        log.debug("getAiFilterInit(operation_mode), result:[{}]", aiFilterInit != null ? 1 : 0);

        // TB_AI_F_INIT 에서 최대 여과 지속시간 설정 값 조회
        AiProcessInitDTO aiFilterTi = databaseService.getAiFilterInit(CommonValue.F_LOCATION_TI_SET_MAX, processStep);
        log.debug("getAiFilterInit(f_location_ti_set_max), result:[{}]", aiFilterTi != null ? 1 : 0);
        
        // get all ai_filter_init
        List<AiProcessInitDTO> aiFilterInitList = databaseService.getAllAiFilterInit(processStep);
        log.debug("aiFilterInitList, result:[{}]", aiFilterInitList.size());

        // get ai_filter_realtime
        AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue();
        log.debug("getLatestAiFilterRealtimeValue, result: [{}]", aiFilterRealtime != null ? 1 : 0);

        // get filter_realtime
        List<ProcessRealtimeDTO> filterRealtime = databaseService.getLatestFilterRealtimeValue(strPartitionName, 1);
        log.debug("getLatestFilterRealtimeValue, result:[{}]", filterRealtime.size());

        // get tag_manage(filter)
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_FILTER, tagManageList.size());

        // get location number(지 번호)
        TagManageRangeDTO filterRange = databaseService.getTagManageRange(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_FILTER, filterRange != null ? 1 : 0);

        int nLocationMin = 0, nLocationMax = 0;
        if(filterRange != null) {
            nLocationMin = filterRange.getMin(); //보령 MIN : 1
            nLocationMax = filterRange.getMax(); //보령 MAX : 22
        }

        if(aiFilterRealtime != null) {
        	
            ObjectMapper objectMapper = new ObjectMapper();
            LinkedHashMap<String, Object> aiFilterInfo = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp, locationTemp;

            // PUT update_time
            aiFilterInfo.put("upd_ti", aiFilterRealtime.getUpd_ti());
            
            if(aiFilterInitList != null) {
            	for(AiProcessInitDTO dto : aiFilterInitList) {
            		aiFilterInfo.put(dto.getItm(), dto.getInit_val());
            	}
            }
            
            // PUT operation_mode
            if(aiFilterInit != null) {
                aiFilterInfo.put("ai_opr", aiFilterInit.getInit_val().intValue());
            } else {
                aiFilterInfo.put("ai_opr", aiFilterRealtime.getAi_opr());
            }

            if(aiFilterTi != null){
                aiFilterInfo.put("f_location_ti_set_max", aiFilterTi.getInit_val().intValue());
            } else {
                aiFilterInfo.put("f_location_ti_set_max", null);
                
            }
            
            // 지별 각 상태 플래그 값
            LinkedHashMap<String, Object> filIng = null;
            LinkedHashMap<String, Object> bwWait = null;
            LinkedHashMap<String, Object> bwIng = null;
            LinkedHashMap<String, Object> filWait = null;
            LinkedHashMap<String, Object> drIng = null;
            LinkedHashMap<String, Object> rest = null;
            ArrayList<String> filIngKeyList = null;
            ArrayList<String> bwWaitKeyList = null;
            ArrayList<String> bwIngKeyList = null;
            ArrayList<String> filWaitKeyList = null;
            ArrayList<String> drIngKeyList = null;
            ArrayList<String> restKeyList = null;
            
            LinkedHashMap<String, Object> locationStateMap = new LinkedHashMap<>();
            int nOperationCount = 0;
            
            
            //지별 여과 운전 상태 조회
            try {
            	
            	filIng = objectMapper.readValue(aiFilterRealtime.getF_fil_ing(), LinkedHashMap.class);		// 여과중
            	bwWait = objectMapper.readValue(aiFilterRealtime.getF_bw_wait(), LinkedHashMap.class);		// 역세대기중
            	bwIng = objectMapper.readValue(aiFilterRealtime.getF_bw_ing(), LinkedHashMap.class);		// 역세중
            	filWait = objectMapper.readValue(aiFilterRealtime.getF_fil_wait(), LinkedHashMap.class);	// 여과대기중
            	drIng = objectMapper.readValue(aiFilterRealtime.getF_dr_ing(), LinkedHashMap.class);		// 시동방수중
				rest = objectMapper.readValue(aiFilterRealtime.getF_rest(), LinkedHashMap.class);			// 운휴중
				
				filIngKeyList = new ArrayList<>(filIng.keySet());
				bwWaitKeyList = new ArrayList<>(bwWait.keySet());
				bwIngKeyList = new ArrayList<>(bwIng.keySet());
				filWaitKeyList = new ArrayList<>(filWait.keySet());
				drIngKeyList = new ArrayList<>(drIng.keySet());
				restKeyList = new ArrayList<>(rest.keySet());
				
				// 여과중
				for(String key : filIngKeyList) {
					int status = (int) filIng.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_ING);
						nOperationCount++;
					}
				}
				// 역세대기중
				for(String key : bwWaitKeyList) {
					int status = (int) bwWait.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_BW_WAIT);
					}
				}
				// 역세중
				for(String key : bwIngKeyList) {
					int status = (int) bwIng.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_BW_ING);
					}
				}
				// 여과대기중
				for(String key : filWaitKeyList) {
					int status = (int) filWait.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_FIL_WAIT);
					}
				}
				// 시동방수중
				for(String key : drIngKeyList) {
					int status = (int) drIng.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_DR_ING);
					}
				}
				// 운휴중
				for(String key : restKeyList) {
					int status = (int) rest.get(key);
					
					if(status == 1) {
						locationStateMap.put(key, CommonValue.FILTER_STATE_REST);
					}
					
				}
				log.debug("f_opr_cnt : "+nOperationCount);
				log.debug("f_loc_stt : "+locationStateMap);
				
				aiFilterInfo.put("f_loc_stt", locationStateMap);
				aiFilterInfo.put("f_opr_cnt", nOperationCount);
				
			} catch (JsonMappingException e1) {
				log.error("JsonMappingException in Get location State of Ji");
			} catch (JsonProcessingException e1) {
				log.error("JsonProcessingException in Get location State of Ji");
			}
            
            
            // SCADA로부터 실시간 데이터 PUT
            for(TagManageDTO tagManage : tagManageList)
            {
                for(ProcessRealtimeDTO dto : filterRealtime) {
                    if(tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수유입유량
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                    
                    else if(tagManage.getItm().equalsIgnoreCase("e1_tb_b") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 침전지(침전수) 탁도
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                    else if(tagManage.getItm().equalsIgnoreCase("f_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 여과지 총 유출유량
                        aiFilterInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                }
            }

            
            LinkedHashMap<String, Object> locationLeMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationTbMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationTiMap = new LinkedHashMap<>();
            LinkedHashMap<String, Object> locationFriOutMap = new LinkedHashMap<>();
            
            float friOutTotal = 0;			// 지별 여과 유출유량 총합
            
            for(int i = nLocationMin; i <= nLocationMax; i++)
            {
                String strLeName = "f_loc_le" + i; 			//각 지별 수위
                String strTbName = "f_loc_tb" + i; 			//각 지별 탁도 값
                String strTiMName = "f_location_ti_m" + i;	//각 지별 여과시간 (분)
                String strFriOutName = "f_fri_out" + i; 	//각 지별 유출유량 값
                int nLocationTi = 0;            			// 지별 여과 지속 시간을 계산하기 위한 변수

                for(TagManageDTO tagManage : tagManageList) {
                	
                    for(ProcessRealtimeDTO dto : filterRealtime) {
                    	
                    	// 지별 수위 값
                        if(tagManage.getItm().equalsIgnoreCase(strLeName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            locationLeMap.put("location" + i, Float.parseFloat(dto.getTag_val()));
                            break;
                        }
                        
                        // 지별 탁도 값
                        else if(tagManage.getItm().equalsIgnoreCase(strTbName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            
                            locationTbMap.put("location" + i, Float.parseFloat(dto.getTag_val()));
                            break;
                        }
                        
                        // 지별 여과 지속 시간 계산(분)
                        else if(tagManage.getItm().equalsIgnoreCase(strTiMName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                           
                            nLocationTi += (int)Float.parseFloat(dto.getTag_val());
                            locationTiMap.put("location"+i, nLocationTi);
                            break;
                        }
                        
                        //각 지별 유출 유량 데이터
//                        else if(tagManage.getItm().equalsIgnoreCase(strFriOutName) == true &&
//                        		tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
//                        	
//                        	friOutTotal += Float.parseFloat(dto.getTag_val()); //유출유량 데이터 SUM
//                        	locationFriOutMap.put("location"+i, Float.parseFloat(dto.getTag_val()));
//                        	break;
//                        }
                    }
                }
            }
            
            try {
                
            	//---------------- 실시간 데이터 정보 Setting for Response Start ----------------
                aiFilterInfo.put("f_loc_le", locationLeMap);		//실시간 지별 수위
                aiFilterInfo.put("f_loc_tb", locationTbMap);		//실시간 지별 탁도
                aiFilterInfo.put("f_loc_ti", locationTiMap);		//실시간 지별 여과 지속시간
//                aiFilterInfo.put("f_out_fr", friOutTotal);			//실시간 여과 유출유량 합
                aiFilterInfo.put("f_loc_out_fr", locationFriOutMap);//실시간 지별 유출유량 
                //---------------- 실시간 데이터 정보 Setting for Response End ----------------
            	
                //---------------- AI 실시간 데이터 정보 Setting for Response Start ----------------
                LinkedHashMap<String, Object> locationMapTemp = null;
                ArrayList<String> locationMapTempKeyList = null;
                locationMapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_num_fil(), LinkedHashMap.class);
            	locationMapTempKeyList = new ArrayList<>(locationMapTemp.keySet());

                aiFilterInfo.put("ai_f_opr_cnt", locationMapTemp.get(locationMapTempKeyList.get(0)));
                aiFilterInfo.put("f_sp", aiFilterRealtime.getF_sp());
                aiFilterInfo.put("ai_f_loc_le", objectMapper.readValue(aiFilterRealtime.getAi_f_wl(), LinkedHashMap.class));
                aiFilterInfo.put("ai_f_loc_ti", objectMapper.readValue(aiFilterRealtime.getAi_f_time(), LinkedHashMap.class));
                aiFilterInfo.put("ai_f_loc_bw_ti", objectMapper.readValue(aiFilterRealtime.getAi_f_bw_start_time(), LinkedHashMap.class));
                aiFilterInfo.put("ai_f_location_schedule", objectMapper.readValue(aiFilterRealtime.getAi_f_location_operation(), LinkedHashMap.class));
                //---------------- AI 실시간 데이터 정보 Setting for Response End ----------------
                
            } catch(JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            } catch(NumberFormatException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error, Number Format Exception\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiFilterInfo);
            
            String strBody = "";
            try {
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch(JsonProcessingException e) {
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
    public ResponseEntity<String> getLocationFilter(@PathVariable int locationNumber, @PathVariable int processStep)
    {
        log.debug("getLocationFilter, locationNumber:[{}]", locationNumber);

        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_FILTER, tagManageList.size());
        
        if(tagManageList.size() > 0) {
            int nSeriesNumber = 0;
            for(TagManageDTO dto : tagManageList) {
                if(dto.getLoc() == locationNumber) {
                    nSeriesNumber = dto.getLoc();
                    break;
                }
            }

            // 등록되지 않은 지 번호는 에러처리
            if(nSeriesNumber == 0) {
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
//            strPartitionName = "20231127"; // FIXME 현재날짜 수정
            
            AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue();
            log.debug("getLatestAiFilterRealtimeValue, result:[{}]", aiFilterRealtime != null ? 1 : 0);

            List<ProcessRealtimeDTO> filterRealtime = databaseService.getLatestFilterRealtimeValue(strPartitionName, processStep);
            log.debug("getLatestFilterRealtimeValue, result:[{}]", filterRealtime.size());
            
            
            if(aiFilterRealtime != null) {
            	
                ObjectMapper objectMapper = new ObjectMapper();
                
                LinkedHashMap<String, Object> aiFilterLocationInfo = new LinkedHashMap<>();
                LinkedHashMap<String, Object> mapTemp;

                aiFilterLocationInfo.put("upd_ti", aiFilterRealtime.getUpd_ti());
                
                String strLeName = "f_loc_le" + locationNumber;
                String strTbName = "f_loc_tb" + locationNumber; 
                String strTiMName = "f_location_ti_m" + locationNumber;
                String strFoutFrName = "f_fri_out" + locationNumber;
                
                int nLocationTi = 0;

                
                for(TagManageDTO tagManage : tagManageList) {
                    for (ProcessRealtimeDTO dto : filterRealtime) {
                        
                    	// 원수유입유량
                    	if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            aiFilterLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                            break;
                            
                        } 
                    	// 침전지(침전수) 탁도
                    	else if(tagManage.getItm().equalsIgnoreCase("e1_tb_b") == true &&
        						tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        	aiFilterLocationInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
        					break;
        					
        				}
                    	// 여과지 유출 유량
                        else if(tagManage.getItm().equalsIgnoreCase(strFoutFrName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        	aiFilterLocationInfo.put("f_out_fr", Float.parseFloat(dto.getTag_val()));
                            break;
                            
                        }
                    	// 여과지 수위
                        else if(tagManage.getItm().equalsIgnoreCase(strLeName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            aiFilterLocationInfo.put("f_loc_le", Float.parseFloat(dto.getTag_val()));
                            break;
                            
                        }
                    	// 여과지 탁도
                        else if(tagManage.getItm().equalsIgnoreCase(strTbName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true){
                            aiFilterLocationInfo.put("f_loc_tb", Float.parseFloat(dto.getTag_val()));
                        	break;
                        }
                    	// 여과 지속 시간 계산(분)
                        else if(tagManage.getItm().equalsIgnoreCase(strTiMName) == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            nLocationTi += (int)Float.parseFloat(dto.getTag_val());
                            break;
                            
                        }
                    }
                }

                //여과 속도 값
            	aiFilterLocationInfo.put("f_sp", aiFilterRealtime.getF_sp());
                aiFilterLocationInfo.put("f_loc_ti", nLocationTi);

                try
                {
                    // AI 수위 예측
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_wl(), LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_loc_le", mapTemp.get("location" + locationNumber));

                    // AI 여과 지속 시간 예측
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_time(), LinkedHashMap.class);
                    Integer ai_f_loc_ti = Integer.parseInt(mapTemp.get("location" + locationNumber).toString());
                    aiFilterLocationInfo.put("ai_f_loc_ti", ai_f_loc_ti);
                    
                    // 역세 후 대기시간 예측
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_bw_wait_time(), LinkedHashMap.class);
                    Integer ai_f_bw_wait_time = Integer.parseInt(mapTemp.get("location"+locationNumber).toString());
                    aiFilterLocationInfo.put("ai_f_bw_wait_time", ai_f_bw_wait_time);

                    // AI 역세 시작 시간 예측
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_bw_start_time(), LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_loc_bw_ti", mapTemp.get("location" + locationNumber));

                    // AI 여과 종료 시간 예측(AI 여과 지속 시간 예측 - 현재 여과 지속 시간)
                    aiFilterLocationInfo.put("ai_f_location_end_ti", ai_f_loc_ti - nLocationTi);

                    // AI 운영 스케쥴 예측
                    mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_location_operation(), LinkedHashMap.class);
                    aiFilterLocationInfo.put("ai_f_location_schedule", mapTemp.get("location" + locationNumber));
                    
                } catch(JsonProcessingException e) {
                    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }
                
                

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("location", aiFilterLocationInfo);

                String strBody;
                
                try {
                    strBody = objectMapper.writeValueAsString(responseBody);
                } catch(JsonProcessingException e) {
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
    public ResponseEntity<String> putOperationControlFilter(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep)
    {
        log.info("putOperationControlFilter, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO)
        {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_filter_init's operation_mode
//        log.debug("update aiFilterOperationMode:[{}], mode:[{}]",
//                databaseService.modAiFilterOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(f_operation_mode)
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, processStep);
        log.info("getAiFilterInit, result:[{}]", aiFilterInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiFilterInit != null) {
        		// ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiFilterInit.getTag_sn(), nOperationMode, strDate));
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 여과 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList) {
        			if(dto.getItm().equalsIgnoreCase("f_operation_mode_a") == true) {
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiFilterOperationMode(nOperationMode, processStep);
        	} else {
                log.error("Does not exist aiFilterInit:[{]]", CommonValue.F_OPERATION_MODE);
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /filter/control/operation API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 여과 사용자 데이터 설정
     * @param filterDto
     * @param processStep
     * @return
     */
    @RequestMapping(value = "/filter/control/ti/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putTiControlFilter(@RequestBody InterfaceFilterTiDTO filterSet, @PathVariable int processStep)
    {
        int nTi = filterSet.getF_location_ti_set_max();
        log.debug("putTiControlFilter, ti:[{}]", nTi);

        // 잘못된 시간 값 검사
        if(nTi < 0) {
            log.error("Invalid ti:[{}]", nTi);

            String strErrorBody = "{\"reason\":\"Invalid ti\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        float wlMax = filterSet.getF_location_wl_max();
        
        boolean result = true;

        result = (databaseService.modAiFilterInit("f_location_ti_set_max", nTi, processStep) == 1) && result;
        
        result = (databaseService.modAiFilterInit("f_location_wl_max", wlMax, processStep) == 1) && result;
        
        result = (databaseService.modAiFilterInit("f_pw", filterSet.getF_pw(), processStep) == 1) && result;

        if(result == true)
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
     * AI 여과 운영 스케쥴 예측값 조회
     * @return
     */
    @RequestMapping(value = "/filter/schedule", method = RequestMethod.GET)
    public ResponseEntity<String> getScheduleFilter()
    {
        log.debug("Recv getScheduleFilter");

        AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue();
        log.debug("getLatestAiFilterRealtimeValue, result:[{}]", aiFilterRealtime != null ? 1 : 0);
        
        
        if(aiFilterRealtime != null)
        {
            try
            {
                // 전체 schedule을 저장할 scheduleMap, 여과 스케쥴을 저장할 filterMap 선언
                LinkedHashMap<String, Object> scheduleMap = new LinkedHashMap<>();
                LinkedHashMap<String, Object> filterMap = new LinkedHashMap<>();

                // 여과 schedule
                ObjectMapper objectMapper = new ObjectMapper();
                LinkedHashMap<String, Object> mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_schedule(), LinkedHashMap.class);
                
                List<String> keyList = new ArrayList<>(mapTemp.keySet());
                keyList = new ArrayList<>(mapTemp.keySet());
                
                // key : location1 ~ location22
                for(String key : keyList) {
                    if(key.indexOf("location") >= 0) {
                        filterMap.put(key, mapTemp.get(key));
                    }
                }

                scheduleMap.put("filter", filterMap);

                // Make Response Body
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("schedule", scheduleMap);
                
                String strBody = objectMapper.writeValueAsString(responseBody);
                return new ResponseEntity<>(strBody, HttpStatus.OK);

            } catch(JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_filter or ai_gac\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 여과 지별 공정 운영모드 변경
     * 
     * @param locationNumber 선택한 지
     * @param aiOnOff ON/OFF 여부
     * @param processStep 공정단계
     * @return
     */
    @RequestMapping(value = "/filter/control/location/{locationNumber}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putLocationControlFilter(@PathVariable int locationNumber, @RequestBody InterfaceAiOnOffDTO aiOnOff, @PathVariable int processStep)
    {
    	log.debug("putLocationControlFilter, location:[{}], AI:[{}]", locationNumber, aiOnOff.getAi());

        // get location number(지 번호)
        TagManageRangeDTO filterRange = databaseService.getTagManageRange(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_FILTER, filterRange != null ? 1 : 0);

        int nLocationMin = 0, nLocationMax = 0;
        if(filterRange != null)
        {
            nLocationMin = filterRange.getMin();
            nLocationMax = filterRange.getMax();
       }

        // 지 번호 검사
        if(locationNumber < nLocationMin || locationNumber > nLocationMax)
        {
            log.debug("invalid location number:[{}]", locationNumber);
            String strErrorBody = "{\"reason\":\"invalid location number\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // ON/OFF 값 검사
        if(aiOnOff.getAi() < CommonValue.AI_OFF || aiOnOff.getAi() > CommonValue.AI_ON)
        {
        log.debug("invalid AI on/off:[{}]", aiOnOff.getAi());
            String strErrorBody = "{\"reason\":\"invalid on/off value\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // 지별 AI 모드 업데이트
        if(databaseService.modAiFilterInit("f_operation_ji" + locationNumber, aiOnOff.getAi(), processStep) == 1)
        {
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else
        {
            String strErrorBody = "{\"reason\":\"ai_filter_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}
