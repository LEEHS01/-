package co.irexnet.waio.WAIO_ServerAgent.controller;

import java.text.ParseException;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiClearOperationBandDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiDisinfectionRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiMixingRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiReceivingRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonBSeriesInt;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonHLocationFloat;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceClearLeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDateSearchDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceOperationModeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.service.MakeTagMapServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class ReceivingController
{
	@Autowired
	MakeTagMapServiceImpl tagMapService;
	
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
    public ResponseEntity<String> getLatestReceiving(@PathVariable int processStep)
    {
        log.debug("Recv getLatestReceiving");

        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
//        strPartitionName = "20231201"; // FIXME 현재 날짜 수정
        
        String strBody = "";

        // get ai_receiving_init(b_operation_mode)
        AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, processStep);
        log.debug("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1 : 0);

        // get ai_receiving_init
        List<AiProcessInitDTO> aiReceivingInitList = databaseService.getAllAiReceivingInit(processStep);
        log.debug("getAllAiReceivingInit, result:[{}]", aiReceivingInitList.size());

        // get ai_receiving_realtime
        AiReceivingRealtimeDTO aiReceivingRealtime = databaseService.getLatestAiReceivingRealtimeValue(processStep);
        log.debug("getLatestAiReceivingValue, result:[{}]", aiReceivingRealtime != null ? 1 : 0);

        // get receiving_realtime
        List<ProcessRealtimeDTO> receivingRealtime = databaseService.getLatestReceivingRealtimeValue(strPartitionName, processStep);
        log.debug("getLatestReceivingRealtimeValue, result:[{}]", receivingRealtime.size());

        // get tag_manage
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_RECEIVING, processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_RECEIVING, tagManageList.size());
        
        ObjectMapper objectMapper = new ObjectMapper();
        LinkedHashMap<String, Object> aiReceivingInfo = new LinkedHashMap<>();
        LinkedHashMap<String, Object> mapTemp;
        
        try {
        	//---------------- 실시간 데이터 정보 Setting for Response Start ----------------
            if(receivingRealtime != null && receivingRealtime.size()>0) {
            	
            	for(TagManageDTO tagManage : tagManageList) {
                    for(ProcessRealtimeDTO dto : receivingRealtime) {
                        if(tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 원수 유입 유량 순시 (원수 유입유량 : 600-359-FRI-1011)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("h_location_le1") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #1 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("h_location_le2") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true){
                            // 정수지 #2 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("h_location_le3") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 #3 수위
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("h_out_fr") == true &&
                                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                            // 정수지 유출 유량 (600-359-FRI-4410)
                            aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("b_in_pr") == true &&
                        		tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        	// 원수 유입압력 (600-359-PRI-1001)
                        	aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("b1_vv_po") == true &&
                        		tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        	// 소수력 발전 바이패스 밸브 개도 (#2 소수력 바이패스 1 개도 설정 : 702-600-359-GE2-4103)
                        	aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                        else if(tagManage.getItm().equalsIgnoreCase("b1_gv_vv_po") == true &&
                        		tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        	// 가이드 배인 개도 (#2 소수력 가이드 배인 개도 : 702-600-359-GE2-4014)
                        	aiReceivingInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        }
                    }
                }
            }
            //---------------- 실시간 데이터 정보 Setting for Response End ----------------
            
            //---------------- AI 실시간 데이터 정보 Setting for Response Start ----------------
            if(aiReceivingRealtime != null) {
                aiReceivingInfo.put("upd_ti", aiReceivingRealtime.getUpd_ti());		// update_time
                aiReceivingInfo.put("ems_mode", aiReceivingRealtime.getEms_opr());	// ems_mode
//                aiReceivingInfo.put("ai_b_vv_po", aiReceivingRealtime.getAi_b_vv_po());	// AI 원수 조절 밸브 개도 예측     
                mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_vv_po(), LinkedHashMap.class);
            	ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
            	Object objectTemp = mapTemp.get(keyList.get(0));
            	aiReceivingInfo.put("ai_b_vv_po_guidevane", objectTemp);	// AI 가이드베인 밸브 개도
            	objectTemp = mapTemp.get(keyList.get(1));
            	aiReceivingInfo.put("ai_b_vv_po_bypass", objectTemp);		// AI 바이패스 밸브 개도
            	
                aiReceivingInfo.put("ai_b_in_fr", aiReceivingRealtime.getAi_b_in_fr());		// AI 원수 유입 유량 예측
                aiReceivingInfo.put("ai_b_in_fr_trd", objectMapper.readValue(aiReceivingRealtime.getAi_b_in_fr_rtd(), LinkedHashMap.class)); //AI 원수유입유량 예측 차트
                
                // 정수지 유출 유량 차트
            	mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_out_fri_trend(), LinkedHashMap.class);
            	keyList = new ArrayList<>(mapTemp.keySet());
            	objectTemp = mapTemp.get(keyList.get(0));
            	aiReceivingInfo.put("ai_b_out_fr_rtd", objectTemp);
            }
            //---------------- AI 실시간 데이터 정보 Setting for Response End ----------------
            
    	    //---------------- AI INIT 데이터 정보 Setting for Response Start ----------------
            if(aiReceivingInit != null) {
            	aiReceivingInfo.put("ai_opr", aiReceivingInit.getInit_val().intValue()); // operation_mode
            } else {
                aiReceivingInfo.put("ai_opr", aiReceivingRealtime.getAi_opr());
            }
            
            if(aiReceivingInitList != null && aiReceivingInitList.size()>0) {
            	for(AiProcessInitDTO dto : aiReceivingInitList) {
                    if(dto.getItm().equalsIgnoreCase("h_target_le_max") == true) {
                    	// 정수지 최대 목표 수위
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("h_target_le_min") == true) {
                    	// 정수지 최소 목표 수위
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_gv_max") == true)
                    {
                        // 가이드 베인 개도율 변화 최대
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_gv_min") == true)
                    {
                        // 가이드 베인 개도율 변화 최소
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_bypass_max") == true)
                    {
                        // 바이패스 개도율 변화 최대
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_bypass_min") == true)
                    {
                        // 바이패스 개도율 변화 최소
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_gv_pwr") == true)
                    {
                        // 가이드 베인 전력량
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_gv_uplmt") == true)
                    {
                        // 가이드 베인 제어 범위 최대
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_gv_lolmt") == true)
                    {
                        // 가이드 베인 제어 범위 최소
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_bypass_uplmt") == true)
                    {
                        // 바이패스 제어 범위 최대
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_valve_bypass_lolmt") == true)
                    {
                        // 바이패스 제어 범위 최소
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    
                    //20260225 이현수 : 착수공정 후처리 관련하여 시각화 부분 미리 작성 
                    //현재 실제 웹에 UI추가는 나중에 남부쪽 UI끝나면 이후 업데이트 현재는 디비에서만 수정하게 
                    else if(dto.getItm().equalsIgnoreCase("b_pred_friout_correction_ratio_factor") == true) {
                        // 유출유량 예측 보정 계수 (alpha값, 0~1)
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                    else if(dto.getItm().equalsIgnoreCase("b_process_period_sec") == true) {
                        // AI 착수 공정 실행 주기 (초)
                        aiReceivingInfo.put(dto.getItm(), dto.getInit_val());
                    }
                }
            }
    	    //---------------- AI INIT 데이터 정보 Setting for Response Start ----------------
            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiReceivingInfo);
            strBody = objectMapper.writeValueAsString(responseBody);
            
        } catch(JsonProcessingException e) {
        	 String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
             return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(strBody, HttpStatus.OK);
    }

    /**
     * 착수정 유출 유량 측정 이력 조회
     * @deprecated 사용 안함. latest에서 json 조회로 변경
     */
    @RequestMapping(value = "/receiving/history/fr/out/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getOutFrHistoryReceiving(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep)
    {
        log.debug("getOutFrHistoryReceiving, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
        
        String strBody = null;
        
        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList =
                databaseService.getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());
        if(aiReceivingRealtimeList.size() > 0) {
        	
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();
            ObjectMapper objectMapper = new ObjectMapper();
			for(AiReceivingRealtimeDTO dto : aiReceivingRealtimeList) {
				String strDate = simpleDateFormat.format(dto.getUpd_ti());
				series1.put(strDate, dto.getB_out_fri());
			}

			LinkedHashMap<String, Object> out_fr = new LinkedHashMap<>();
			out_fr.put("series1", series1);

			Map<String, Object> responseBody = new HashMap<>();
			responseBody.put("out_fr", out_fr);

			try {
			    strBody = objectMapper.writeValueAsString(responseBody);
			} catch(JsonProcessingException e) {
			    String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
			    return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
			}
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        return new ResponseEntity<>(strBody, HttpStatus.OK);
    }

    // 정수지 유출 유량 측정 이력 조회 (미사용)
    /*@RequestMapping(value = "/clear/history/fr/out/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getOutFrHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep)
    {
        log.debug("getOutFrHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList = databaseService.getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());
        
        String strBody = null;
        
        if(aiReceivingRealtimeList.size() > 0) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> h_out_fr = new LinkedHashMap<>();
            
            for(AiReceivingRealtimeDTO dto : aiReceivingRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                h_out_fr.put(strDate, dto.getH_out_fr());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("out_fr", h_out_fr);
            
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch(JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else
        {
            String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(strBody, HttpStatus.OK);
    }*/
  
    /**
     * 정수지 수위 밴드 차트 그래프 데이터 조회 (범위 및 수위 데이터)
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/clear/history/le/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getLeHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep) {
        
    	log.debug("getLeHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
        
        // 착수 공정 데이터 조회
        List<AiReceivingRealtimeDTO> aiReceivingRealtimeList = databaseService.getAiReceivingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiReceivingRealtimeValueFromUpdateTime, result:[{}]", aiReceivingRealtimeList.size());
        
        List<AiClearOperationBandDTO> aiClearOperationBandList = null;
        
        if(aiReceivingRealtimeList.size() > 0) {
        	aiClearOperationBandList = databaseService.getAiClearOperationBandFromTimeIndex(dateSearchDTO, processStep);
        	log.debug("getAiClearOperationBandFromTimeIndex, result:[{}]", aiClearOperationBandList.size());
        }else {
        	String strErrorBody = "{\"reason\":\"Empty ai_receiving_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        LinkedHashMap<String, Object> h_le = new LinkedHashMap<>();
        LinkedHashMap<String, Object> location1 = new LinkedHashMap<>();
        LinkedHashMap<String, Object> location2 = new LinkedHashMap<>();
        LinkedHashMap<String, Object> location3 = new LinkedHashMap<>();
        
        LinkedHashMap<String, Object> upBand = new LinkedHashMap<>();
        LinkedHashMap<String, Object> downBand = new LinkedHashMap<>();
        LinkedHashMap<String, Object> wideUpBand = new LinkedHashMap<>();
        LinkedHashMap<String, Object> wideDownBand = new LinkedHashMap<>();
        LinkedHashMap<String, Object> mapTemp;

        ObjectMapper objectMapper = new ObjectMapper();
        String strDate = "";
        String strBody = "";
        
        
        if(aiReceivingRealtimeList != null && aiReceivingRealtimeList.size() > 0) {
        	// EMS 모드에 따라 정수지 수위 밴드 값을 다르게 불러옴
			/*if(aiReceivingRealtimeList.get(0).getEms_opr() == CommonValue.EMS_MODE_ON) {
				aiClearOperationBandList = databaseService.getAiClearEmsOperationBandFromTimeIndex(dateSearchDTO);
				log.debug("getAiClearEmsOperationBandFromTimeIndex, result:[{}]", aiClearOperationBandList.size());
			} else {
				aiClearOperationBandList = databaseService.getAiClearOperationBandFromTimeIndex(dateSearchDTO);
				log.debug("getAiClearOperationBandFromTimeIndex, result:[{}]", aiClearOperationBandList.size());
			}*/
        	// Get Wide operation band
        	/*List<AiClearOperationBandDTO> aiClearWideOperationBand = databaseService.getAiClearWideOperationBandFromTimeIndex(dateSearchDTO);
        	log.debug("getAiClearWideOperationBandFromTimeIndex, result:[{}]", aiClearWideOperationBand.size());*/
        	
        	for(AiReceivingRealtimeDTO receivingDTO : aiReceivingRealtimeList) {
                strDate = simpleDateFormat.format(receivingDTO.getUpd_ti());
                JsonHLocationFloat h_location_le = null;
				try {
					h_location_le = objectMapper.convertValue(objectMapper.readValue(receivingDTO.getH_le(), LinkedHashMap.class), JsonHLocationFloat.class);
				} catch (JsonMappingException e) {
					 String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
		                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
				} catch (IllegalArgumentException e) {
					 String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
		                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
				} catch (JsonProcessingException e) {
					 String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
		                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
				}
                location1.put(strDate, h_location_le.getLocation1());
                location2.put(strDate, h_location_le.getLocation2());
                location3.put(strDate, h_location_le.getLocation3());
            }
            
            h_le.put("location1", location1);
            h_le.put("location2", location2);
            h_le.put("location3", location3);
        }
        
        // 정수지 수위 밴드 값 등록
        if(aiClearOperationBandList != null && aiClearOperationBandList.size()>0) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dateSearchDTO.getStart_time());
            for(AiClearOperationBandDTO operationBandDTO: aiClearOperationBandList) {
                
            	Calendar bandCalendar = Calendar.getInstance();
                bandCalendar.setTime(operationBandDTO.getTi_seq());

                calendar.set(Calendar.HOUR_OF_DAY, bandCalendar.get(Calendar.HOUR_OF_DAY));
                calendar.set(Calendar.MINUTE, bandCalendar.get(Calendar.MINUTE));
                calendar.set(Calendar.SECOND, bandCalendar.get(Calendar.SECOND));
                strDate = simpleDateFormat.format(calendar.getTime());
                upBand.put(strDate, operationBandDTO.getH_bnd_uplmt());
                downBand.put(strDate, operationBandDTO.getH_bnd_lolmt());
            }
            h_le.put("h_bnd_uplmt", upBand);
            h_le.put("h_bnd_lolmt", downBand);
        }
        
        try {
        	Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("le", h_le);
            strBody = objectMapper.writeValueAsString(responseBody);
            
        }catch(JsonProcessingException e) {
        	String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return new ResponseEntity<>(strBody, HttpStatus.OK);
        
    }

    /**
     * 정수지 잔류염소 측정 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/clear/history/cl/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getClHistoryClear(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("getClHistoryClear, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());

        if(aiDisinfectionRealtimeList.size() > 0)
        {
            // Make Response Body
            // 정수지 유입/유출 잔류염소를 별도로 저장하기 위한 변수 선언
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> h_cl = new LinkedHashMap<>();
            LinkedHashMap<String, Object> in = new LinkedHashMap<>();
            LinkedHashMap<String, Object> out = new LinkedHashMap<>();

            // aiDisinfectionRealtimeList에서 정수지 유입/유출 잔류염소 값을 조회 및 map에 등록
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList)
            {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                in.put(strDate, dto.getG_h_in_residual_cl());
                out.put(strDate, dto.getG_h_out_residual_cl());
            }
            h_cl.put("in", in);
            h_cl.put("out", out);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("h_cl", h_cl);

            ObjectMapper objectMapper = new ObjectMapper();
            String strBody;
            try
            {
                // ObjectMapper를 통해 JSON 값을 String으로 변환
                strBody = objectMapper.writeValueAsString(responseBody);
            }
            catch(JsonProcessingException e)
            {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        }
        else
        {
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
    public ResponseEntity<String> getTeHistoryRaw(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep)
    {
        log.debug("getTeHistoryRaw, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 혼화응집 공정 데이터 조회
        List<AiMixingRealtimeDTO> aiMixingRealtimeList = databaseService.getAiMixingRealtimeValueFromUpdateTime(dateSearchDTO, processStep);
        log.debug("getAiMixingRealtimeValueFromUpdateTime, result:[{}]", aiMixingRealtimeList.size());

        if(aiMixingRealtimeList.size() > 0)
        {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> d_te = new LinkedHashMap<>();

            // aiMixingRealtimeList에서 원수 수온 값을 조회하여 map에 등록
            for(AiMixingRealtimeDTO dto : aiMixingRealtimeList)
            {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                d_te.put(strDate, dto.getD_te());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("te", d_te);

            ObjectMapper objectMapper = new ObjectMapper();
            String strBody;
            try
            {
                // ObjectMapper를 통해 JSON 값을 String으로 변환
                strBody = objectMapper.writeValueAsString(responseBody);
            }
            catch(JsonProcessingException e)
            {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        }
        else
        {
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
    public ResponseEntity<String> putOperationControlReceiving(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep)
    {
        log.info("putOperationControlReceiving, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_receiving_init's operation_mode
//        log.debug("update aiReceivingOperationMode:[{}], mode:[{}]",
//                databaseService.modAiReceivingOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(b_operation_mode)
        AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, processStep);
        log.info("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try{
        	if(aiReceivingInit != null) {
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiReceivingInit.getTag_sn(), nOperationMode, strDate));
        		
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 착수 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList) {
        			if(dto.getItm().equalsIgnoreCase("b_operation_mode_a") == true){
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
        						nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiReceivingOperationMode(nOperationMode, processStep);
        	} else {
        		log.error("Does not exist aiReceivingInit:[{]]", CommonValue.B_OPERATION_MODE);
        	}
        }catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /receiving/control/operation API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 사용자 설정
     * 
     * @param clearLe     Front-end 착수 공정 정수지 목표 수위 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/receiving/control/le/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putLeControlReceiving(@RequestBody InterfaceClearLeDTO clearLe, @PathVariable int processStep)
    {
        log.debug("putLeControlReceiving, le:[{}]", clearLe);

        // 잘못된 수위 값 검사
        if(clearLe.getH_target_le_max() < 0 || clearLe.getH_target_le_min() < 0){
            log.error("Invalid le:[{}]", clearLe);

            String strErrorBody = "{\"reason\":\"Invalid le\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        boolean result = true;

        // 정수지 최대 목표 수위
        result = (databaseService.modAiReceivingInit("h_target_le_max", clearLe.getH_target_le_max(), processStep) == 1) && result;

        // 정수지 최저 목표 수위
        result = (databaseService.modAiReceivingInit("h_target_le_min", clearLe.getH_target_le_min(), processStep) == 1) && result;

        // 가이드 베인 개도율 변화 최대
        result = (databaseService.modAiReceivingInit("b_valve_gv_max", clearLe.getB_valve_gv_max(), processStep) == 1) && result;
        
        // 가이드 베인 개도율 변화 최소
        result = (databaseService.modAiReceivingInit("b_valve_gv_min", clearLe.getB_valve_gv_min(), processStep) == 1) && result;
        
    	// 바이패스 개도율 변화 최대
        result = (databaseService.modAiReceivingInit("b_valve_bypass_max", clearLe.getB_valve_bypass_max(), processStep) == 1) && result;
        
        // 바이패스 개도율 변화 최소
        result = (databaseService.modAiReceivingInit("b_valve_bypass_min", clearLe.getB_valve_bypass_min(), processStep) == 1) && result;
        
        // 가이드 베인 전력량
        result = (databaseService.modAiReceivingInit("b_valve_gv_pwr", clearLe.getB_valve_gv_pwr(), processStep) == 1) && result;
        
        // 가이드 베인 제어 범위 최대
        result = (databaseService.modAiReceivingInit("b_valve_gv_uplmt", clearLe.getB_valve_gv_uplmt(), processStep) == 1) && result;
        
        // 가이드 베인 제어 범위 최소
        result = (databaseService.modAiReceivingInit("b_valve_gv_lolmt", clearLe.getB_valve_gv_lolmt(), processStep) == 1) && result;
        
        // 바이패스 제어 범위 최대
        result = (databaseService.modAiReceivingInit("b_valve_bypass_uplmt", clearLe.getB_valve_bypass_uplmt(), processStep) == 1) && result;
        
        // 바이패스 제어 범위 최소
        result = (databaseService.modAiReceivingInit("b_valve_bypass_lolmt", clearLe.getB_valve_bypass_lolmt(), processStep) == 1) && result;
        
        //20260225 이현수 : 착수공정 후처리 관련하여 시각화 부분 미리 작성 
        //현재 실제 웹에 UI추가는 나중에 남부쪽 UI끝나면 이후 업데이트 현재는 디비에서만 수정하게 지금 미적용
        
        // 유출유량 예측 보정 계수 (alpha값, 0~1)
        result = (databaseService.modAiReceivingInit("b_pred_friout_correction_ratio_factor", clearLe.getB_pred_friout_correction_ratio_factor(), processStep) == 1) && result;

        // AI 착수 공정 실행 주기 (초)
        result = (databaseService.modAiReceivingInit("b_process_period_sec", clearLe.getB_process_period_sec(), processStep) == 1) && result;
        
        if(result == true){
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_receiving_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}
