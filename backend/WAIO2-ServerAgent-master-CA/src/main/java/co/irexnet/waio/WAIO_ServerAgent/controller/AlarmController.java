package co.irexnet.waio.WAIO_ServerAgent.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessAlarmDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessControlDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.AccessTokenDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.AlarmInfoDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.AlarmNotifyDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.AlmCtrHisDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.AlmCtrNtfDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceAlarmControlDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceAlarmControlHistoryDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.AlarmInfoList;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class AlarmController
{
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    AlarmInfoList alarmInfoList;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 최근 알람 이력 조회
     * 
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/notify", method = RequestMethod.GET)
    public ResponseEntity<String> getNotifyAlarm()
    {
        log.debug("Recv getNotifyAlarm");

        // 최근 5분간의 알람을 조회하기 위한 Date 정의
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -5);
        Date startTime = calendar.getTime();

        // 최근 5분 알람 조회
        List<AlarmNotifyDTO> alarmNotifyList = databaseService.getAlarmNotify(startTime);
        log.debug("getAlarmNotify, result:[{}]", alarmNotifyList.size());
        if(alarmNotifyList.size() > 0)
        {
            // Make Response Body
            List<LinkedHashMap<String, Object>> resultArray = new ArrayList<>();

            for(AlarmNotifyDTO alarmNotify : alarmNotifyList) {
                // 최근 1분간 발보된 알람 중 타 시스템 발보 및 반자동 제어를 위한 알람 추출
                AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(alarmNotify.getAlm_id());
                
                if(alarmInfo == null) {
                    continue;
                }
                
                if(!alarmInfo.getAlm_dp_yn().equals("Y")) {
                	continue;
                }
                
                // alarmNotify , alarmInfo 내부 변수 추출
                int processStep = alarmInfo.getProcessStep();//공정 단계
                Date almNtfTi = alarmNotify.getAlm_ntf_ti(); //알람 시간
                
                if(alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_OFF ||
                        alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_THRESHOLD) {
                    // update alarm_notify ack_state
//                    databaseService.modAlarmNotifyAckState(alarmNotify.getAlarm_notify_index(), true);
                	if (alarmInfo.getCd_nm().endsWith(CommonValue.ALARM_CODE_CONNECTION_ERROR)) {
                        // add resultArray
                        LinkedHashMap<String, Object> singleBody = new LinkedHashMap<>();
                        singleBody.put("seq", alarmNotify.getSeq());
                        singleBody.put("alm_id", alarmNotify.getAlm_id());
                        singleBody.put("alm_ty", alarmInfo.getAlm_ty());
                        singleBody.put("message", alarmInfo.getDp_nm());
                        singleBody.put("url", alarmInfo.getUrl());
                        singleBody.put("alm_ntf_ti", almNtfTi);

                        resultArray.add(singleBody);
                    }
                } else if(alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_ANOTHER_SYSTEM) {
                    // update alarm_notify ack_state
//                    databaseService.modAlarmNotifyAckState(alarmNotify.getAlarm_notify_index(), true);
                	
                	String almId = String.valueOf(alarmInfo.getAlm_id());
            		if(almId.charAt(0) == '1' && almId.charAt(1) == '3') { // ' 자율운영 - AI 알람 '의 경우
	                	// 팝업으로 노출할 알람 조회
	                	AiProcessAlarmDTO queryDto = new AiProcessAlarmDTO();
	                    queryDto.setAlm_ti(almNtfTi);
	                    queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
	                    queryDto.setProcessStep(processStep);
	                	
	                	List<AiProcessAlarmDTO> aiAlarmList = new ArrayList<>();
	                	aiAlarmList = getAiAlarmList(queryDto, alarmInfo);
	                	
	                	//조회된 aiAlarmList가 없다면 팝업을 보내지않음.
	                    if(aiAlarmList.size() == 0) {
	                        continue;
	                    }
	                	
	                    //조회된 aiAlarmList 중  almId, almTi이 해당하는 알람으로 필터링 후 재확인.
                    	AiProcessAlarmDTO targetAlarm;
                    	targetAlarm = (AiProcessAlarmDTO) aiAlarmList
									 .stream()
									 .filter(target -> alarmNotify.getAlm_ntf_ti().compareTo(target.getAlm_ti()) == 0 
									 && alarmNotify.getAlm_id() == target.getAlm_id())
									 .findFirst()
									 .orElse(null);
                    	
                    	//조회된 알람이 없다면 팝업을 보내지않음.
                        if(targetAlarm == null) {
                            continue;
                        }
            		}
                	// add resultArray
            		LinkedHashMap<String, Object> singleBody = new LinkedHashMap<>();
            		singleBody.put("seq", alarmNotify.getSeq());
            		singleBody.put("alm_id", alarmNotify.getAlm_id());
            		singleBody.put("alm_ty", alarmInfo.getAlm_ty());
            		singleBody.put("message", alarmInfo.getDp_nm());
            		singleBody.put("url", alarmInfo.getUrl());
            		singleBody.put("alm_ntf_ti", alarmNotify.getAlm_ntf_ti());
            		
            		resultArray.add(singleBody);
            		
                } else if(alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_SEMI_AUTO || alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED) {
                	
                	int nOperationMode = 0; // 반자동 제어 모드임을 확인하는 변수
                	AiProcessInitDTO aiProcessInit = new AiProcessInitDTO();
                	
                	String processName = alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"));//공정 명칭
                    //cdNm, processStep에 해당하는 운전모드 조회
                    aiProcessInit = getAiProcessInitDTO(alarmInfo);
                    log.debug("getAi"+processName+"Init, result:[{}]", aiProcessInit != null ? 1 : 0);
                    if(aiProcessInit == null){
                        continue;
                    }
                    nOperationMode = aiProcessInit.getInit_val().intValue();
                    // 제어 -- 현재 운전모드가 반자동 제어 모드가 아니라면 resultArray에 포함시키지 않음
                    if(nOperationMode != CommonValue.OPERATION_MODE_SEMI_AUTO && alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_SEMI_AUTO){
                        continue;
                    }
                    // 임계치 초과 -- 현재 운전모드가 수동모드라면 resultArray에 포함시키지 않음
                    if(nOperationMode == CommonValue.OPERATION_MODE_MANUAL && alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED){
                        continue;
                    }
                    
                   // 팝업에 노출할 CTR 리스트 조회 -- 추후 알람 '제어'버튼 클릭시 조회하는 조건과 동일.
                    AiProcessControlDTO queryDto = new AiProcessControlDTO();
                    queryDto.setRnti(almNtfTi);
                    queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                    queryDto.setProcessStep(processStep);
                    
                    List<AiProcessControlDTO> aiControlList = new ArrayList<>();
                    aiControlList = getAiControlList(queryDto, alarmInfo);
                    
                    //조회된 aiControlList가 없다면 팝업을 보내지않음.
                    if(aiControlList.size() == 0) {
                        continue;
                    }
                    
                    List<AiProcessControlDTO> aiControlList2 = new ArrayList<AiProcessControlDTO>();
                    aiControlList2 = aiControlList.stream().filter(target -> alarmNotify.getAlm_ntf_ti().compareTo(target.getRnti()) == 0).collect(Collectors.toList());
                    
                    // aiControlList2에 해당하는 DP데이터 추가
                    aiControlList2.forEach(aiControl -> aiControl.setTag_dp(databaseService.selectTagDp(aiControl.getTag_sn())));
                   
                    if(aiControlList2.size() > 0) {
	                    // add resultArray
	                    LinkedHashMap<String, Object> singleBody = new LinkedHashMap<>();
	                    singleBody.put("seq", alarmNotify.getSeq());
	                    singleBody.put("alm_id", alarmNotify.getAlm_id());
	                    singleBody.put("alm_ty", alarmInfo.getAlm_ty());
	                    singleBody.put("message", alarmInfo.getDp_nm());
	                    singleBody.put("url", alarmInfo.getUrl());
	                    singleBody.put("alm_ntf_ti", almNtfTi);
	                    singleBody.put("ctr_list", aiControlList2); //controlList
	                    resultArray.add(singleBody);
                    }
                }
            }

            // Make Response Body
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("alarm", resultArray);

            // ObjectMapper를 통해 JSON 값을 String으로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String strBody;
            try
            {
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
            String strErrorBody = "{\"reason\":\"Empty alarm_notify\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.OK);
        }
    }

    /**
     *     반자동 제어 팝업에서 제어버튼을 눌렀을 때 SCADA로 제어메시지를 전송
     * 
     * @param alarmControl Front-end 팝업을 통한 제어 명령을 저장하기 위한 DTO
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/control", method = RequestMethod.PUT)
    public ResponseEntity<String> putControlAlarm(@RequestBody InterfaceAlarmControlDTO alarmControl) {
        log.debug("putControlAlarm, alm_id:[{}]", alarmControl.getAlm_id());
        String strErrorBody = "";
        // 등록된 알람ID인지 검사
        AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(alarmControl.getAlm_id());
        log.debug("getAlarmInfoFromAlarmId, result:[{}]", alarmInfo != null ? 1 : 0);
        if(alarmInfo == null){
            log.error("Does not exist Alarm:[{}]", alarmControl.getAlm_id());
            strErrorBody = "{\"reason\":\"Invalid alm_id\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

    	int processStep = alarmInfo.getProcessStep();//공정 단계
    	String processName = alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"));//공정 명칭
        AiProcessInitDTO aiProcessInit = null;

        //cdNm, processStep에 해당하는 운전모드 조회
        aiProcessInit = getAiProcessInitDTO(alarmInfo);
        
        //조회된 Init이 없는경우
        if(aiProcessInit == null) {
        	strErrorBody = "{\"reason\":\"Empty ai_"+processName.toLowerCase()+"_init\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        int nOperationMode = aiProcessInit.getInit_val().intValue();
        //현재 운전모드가 반자동 제어가 아니라면 SCADA로 제어명령을 전송하지 않음 (제어)
        if(nOperationMode != CommonValue.OPERATION_MODE_SEMI_AUTO && alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_SEMI_AUTO) {
            strErrorBody = "{\"reason\":\"Invalid ai operation state\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        //현재 운전모드가 수동이라면 SCADA로 제어명령을 전송하지 않음 (임계치 초과)
        if(nOperationMode == CommonValue.OPERATION_MODE_MANUAL && alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED) {
            strErrorBody = "{\"reason\":\"Invalid ai operation state\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        //최근 공정에 등록된 제어 명령을 조회 및 전송
        AiProcessControlDTO queryDto = new AiProcessControlDTO();
        queryDto.setRnti(alarmControl.getAlm_ntf_ti());
        queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
        queryDto.setProcessStep(processStep);
        
        List<AiProcessControlDTO> aiControlList = new ArrayList<>();
        aiControlList = getAiControlList(queryDto, alarmInfo);
        
        List<AiProcessControlDTO> aiControlList2 = new ArrayList<AiProcessControlDTO>();
        aiControlList2 = aiControlList.stream().filter(target -> alarmControl.getAlm_ntf_ti().compareTo(target.getRnti()) == 0).collect(Collectors.toList());
        
        
        if(!aiControlList2.isEmpty()){
            return sendAiProcessControl(aiControlList2, alarmInfo);
        }else{
        	// 이미 제어가 완료되어 kfk_flg가 변경된 경우
        	strErrorBody = "{\"reason\":\"already controlled\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.CONFLICT);
        }
    }
    
    /**
     * 알람 팝업에서 취소버튼을 눌렀을 때 KFK_FLG를 KAFKA_FLAG_CANCEL로 UPDATE
     * 
     * @param alarmControl Front-end 팝업을 통한 제어 명령을 저장하기 위한 DTO
     * @param noActionFlag 알람 무반응 플래그
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/cancel", method = RequestMethod.PUT)
    public ResponseEntity<String> putCancelAlarm(@RequestBody InterfaceAlarmControlDTO alarmControl) {
        log.debug("putCancelAlarm, alm_id:[{}]", alarmControl.getAlm_id());
        String strErrorBody = "";
        // 등록된 알람ID인지 검사
        AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(alarmControl.getAlm_id());
        log.debug("getAlarmInfoFromAlarmId, result:[{}]", alarmInfo != null ? 1 : 0);
        if(alarmInfo == null){
            log.error("Does not exist Alarm:[{}]", alarmControl.getAlm_id());
            strErrorBody = "{\"reason\":\"Invalid alm_id\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

    	int processStep = alarmInfo.getProcessStep();//공정 단계
    	String processName = alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"));//공정 명칭

        // 알람타입이 제어알람/임계치알람일 경우
        if (alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_SEMI_AUTO || alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED) {
        	// 해당하는 제어 태그 대상 조회
            AiProcessControlDTO queryDto = new AiProcessControlDTO();
            queryDto.setRnti(alarmControl.getAlm_ntf_ti());
            queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
            queryDto.setProcessStep(processStep);
            
        	List<AiProcessControlDTO> aiControlList = new ArrayList<>();
            aiControlList = getAiControlList(queryDto, alarmInfo);
            
            List<AiProcessControlDTO> aiControlList2 = new ArrayList<AiProcessControlDTO>();
            aiControlList2 = aiControlList.stream().filter(target -> alarmControl.getAlm_ntf_ti().compareTo(target.getRnti()) == 0).collect(Collectors.toList());
            
            if(!aiControlList2.isEmpty()){
            	for(AiProcessControlDTO dto : aiControlList2) {
            		AiProcessControlDTO updateDto = dto;
            		updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_CANCEL);
            		updateDto.setProcessStep(alarmInfo.getProcessStep());
            		updateControlKafkaFlag(updateDto, alarmInfo);
            	}
                return new ResponseEntity<>("", HttpStatus.OK);
            } else{
            	if (alarmControl.getNo_action_flg() != null) {
            		// 무반응일 경우에는 만료 알람 미노출
            		strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"control\"}";
                    return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            	} else {
            		// 이미 제어가 완료되어 kfk_flg가 변경된 경우
            		strErrorBody = "{\"reason\":\"already controlled\"}";
            		return new ResponseEntity<>(strErrorBody, HttpStatus.CONFLICT);   
            	}
            }
        } else if (alarmInfo.getAlm_ty() == CommonValue.ALARM_TYPE_ANOTHER_SYSTEM) {
        	// 알람타입이 안내알람일 경우
        	
        	String almId = String.valueOf(alarmInfo.getAlm_id());
    		if(almId.charAt(0) != '1' || almId.charAt(1) != '3') { // ' 자율운영 - AI 알람 코드 '의 경우만 카프카 플래그 업데이트 진행
    	        strErrorBody = "{\"reason\":\"Not AI alarm_info\"}";
    	        return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
    		}
    		
    		// 최근 공정에 등록된 알람 데이터 조회
        	AiProcessAlarmDTO queryDto = new AiProcessAlarmDTO();
            queryDto.setAlm_ti(alarmControl.getAlm_ntf_ti());
            queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
            queryDto.setProcessStep(processStep);
        	
            // 해당하는 알람 조회
        	List<AiProcessAlarmDTO> aiAlarmList = new ArrayList<>();
        	aiAlarmList = getAiAlarmList(queryDto, alarmInfo);
        	
        	//조회된 aiAlarmList가 없다면 에러 발생
            if(aiAlarmList.size() == 0) {
                strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"alarm\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            }
            
            //조회된 aiAlarmList 중  almId, almTi이 해당하는 알람으로 필터링.
        	AiProcessAlarmDTO targetAlarm;
        	targetAlarm = (AiProcessAlarmDTO) aiAlarmList
						 .stream()
						 .filter(target -> alarmControl.getAlm_ntf_ti().compareTo(target.getAlm_ti()) == 0 
						 && alarmControl.getAlm_id() == target.getAlm_id())
						 .findFirst()
						 .orElse(null);
            
        	// KFK_FLG를 KAFKA_FLAG_CANCEL로 UPDATE
        	if(targetAlarm != null){
        		AiProcessAlarmDTO updateDto = targetAlarm;
        		updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_CANCEL);
        		updateDto.setProcessStep(alarmInfo.getProcessStep());
        		updateAlarmKafkaFlag(updateDto, alarmInfo);
                return new ResponseEntity<>("", HttpStatus.OK);
            } else{
                strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"alarm\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
            }         
        	
        } else{
            strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"control alarm\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }  
    }
    
    /**
     * 안내알람 팝업에서 이동버튼을 눌렀을 때 KFK_FLG를 KAFKA_FLAG_CONFIRM으로 UPDATE
     * 
     * @param alarmControl Front-end 팝업을 통한 제어 명령을 저장하기 위한 DTO
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/confirm", method = RequestMethod.PUT)
    public ResponseEntity<String> putConfirmAlarm(@RequestBody InterfaceAlarmControlDTO alarmControl) {
    	log.debug("putConfirmAlarm, alm_id:[{}]", alarmControl.getAlm_id());
        String strErrorBody = "";
        // 등록된 알람ID인지 검사
        AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(alarmControl.getAlm_id());
        log.debug("getAlarmInfoFromAlarmId, result:[{}]", alarmInfo != null ? 1 : 0);
        if(alarmInfo == null){
            log.error("Does not exist Alarm:[{}]", alarmControl.getAlm_id());
            strErrorBody = "{\"reason\":\"Invalid alm_id\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

    	int processStep = alarmInfo.getProcessStep();//공정 단계
    	String processName = alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"));//공정 명칭
        
        String almId = String.valueOf(alarmInfo.getAlm_id());
		if(almId.charAt(0) != '1' || almId.charAt(1) != '3') { // ' 자율운영 - AI 알람 코드 '의 경우만 카프카 플래그 업데이트 진행
	        strErrorBody = "{\"reason\":\"Not AI alarm_info\"}";
	        return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
		}
		
		// 최근 공정에 등록된 알람 데이터 조회
    	AiProcessAlarmDTO queryDto = new AiProcessAlarmDTO();
        queryDto.setAlm_ti(alarmControl.getAlm_ntf_ti());
        queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
        queryDto.setProcessStep(processStep);
    	
        // 해당하는 알람 조회
    	List<AiProcessAlarmDTO> aiAlarmList = new ArrayList<>();
    	aiAlarmList = getAiAlarmList(queryDto, alarmInfo);
    	
    	//조회된 aiAlarmList가 없다면 에러 발생
        if(aiAlarmList.size() == 0) {
            strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"alarm\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        //조회된 aiAlarmList 중  almId, almTi이 해당하는 알람으로 필터링.
    	AiProcessAlarmDTO targetAlarm;
    	targetAlarm = (AiProcessAlarmDTO) aiAlarmList
					 .stream()
					 .filter(target -> alarmControl.getAlm_ntf_ti().compareTo(target.getAlm_ti()) == 0 
					 && alarmControl.getAlm_id() == target.getAlm_id())
					 .findFirst()
					 .orElse(null);
        
    	// KFK_FLG를 KAFKA_FLAG_CONFIRM으로 UPDATE
    	if(targetAlarm != null){
    		AiProcessAlarmDTO updateDto = targetAlarm;
    		updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_CONFIRM);
    		updateDto.setProcessStep(alarmInfo.getProcessStep());
    		updateAlarmKafkaFlag(updateDto, alarmInfo);
            return new ResponseEntity<>("", HttpStatus.OK);
        } else{
            strErrorBody = "{\"reason\":\"Empty"+processName.toLowerCase()+"alarm\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 등록된 알람 정보 조회
     * 
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/info", method = RequestMethod.GET)
    public ResponseEntity<String> getAlarmInfo()
    {
        log.debug("getAlarmInfo");

        // 전체 알람 정보 조회
        List<AlarmInfoDTO> alarmInfoDTOList = databaseService.getAlarmInfo();
        log.debug("getAlarmInfo, result:[{}]", alarmInfoDTOList.size());
        if(alarmInfoDTOList.size() > 0)
        {
            // Make Response Body
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("alarm_info", alarmInfoDTOList);

            // ObjectMapper를 통해 JSON 값을 String으로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String strBody = "";
            try
            {
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
            String strErrorBody = "{\"reason\":\"Empty alarm_info\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 알람 이력 등록
     * 
     * @param alarmControl 알람 리스트
     * @param token 로그인 정보
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/alarm/controlHistory", method = RequestMethod.PUT)
    public ResponseEntity<String> putAlarmControlHistory(@RequestBody AlmCtrHisDTO alarmControl, @RequestHeader("X-ACCESS-TOKEN") String token) { 

        // 등록된 알람ID인지 검사
        AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(alarmControl.getAlm_id());
        log.debug("getAlarmInfoFromAlarmId, result:[{}]", alarmInfo != null ? 1 : 0);
        
        // 해당 알람에 해당하는 제어태그 리스트
        List<AlmCtrNtfDTO> ctrList = alarmControl.getCtr_list();
        Date currentDate = new Date();
        
        // 실제 이력을 추가할 list
        List<AlmCtrNtfDTO> targetList = new ArrayList<>();

        for (AlmCtrNtfDTO ctr : ctrList) {
        	// 동일한 alm_seq와 tag_sn으로 TB_ALM_CTR_HIS에 적재된 이력이 없으면 add
            if (databaseService.getControlHistoryBySeqAndTag(alarmControl.getSeq(), ctr.getTag_sn()).size() == 0) {
            	targetList.add(ctr);
            }
        }
        
        if(targetList.size() > 0) {
            // 로그인세션이 있을경우
            if(!"".equals(token)) {
                AccessTokenDTO accessTokenDTO = databaseService.getToken(token); 
                alarmControl.setUsr_id(accessTokenDTO.getUsr_id());
                alarmControl.setUsr_nm(accessTokenDTO.getUsr_nm());
            }

            for(AlmCtrNtfDTO dto : targetList) {
            	if(dto.getTag_sn() != null) {
            		alarmControl.setUpd_ti(dto.getUpd_ti());
            		alarmControl.setTag_sn(dto.getTag_sn());
            		alarmControl.setCtr_ti(currentDate);
            		databaseService.insertAlarmControlHistory(alarmControl);
            	}
            }
            
            String strBody = "Successfully inserted into alarm control history";
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        } else {
        	String strErrorBody = "{\"reason\":\"No Alarm Control History to insert\"}";
	        return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * almId, processStep에 해당하는 운전모드 조회
     * @param alarmInfo
     * @return
     */
    public AiProcessInitDTO getAiProcessInitDTO(AlarmInfoDTO alarmInfo) {
    	AiProcessInitDTO aiProcessInit = new AiProcessInitDTO();
    	switch (alarmInfo.getProcess()) {
        case CommonValue.PROCESS_RECEIVING:           // 착수
            aiProcessInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, alarmInfo.getProcessStep());
            break;
        case CommonValue.PROCESS_COAGULANT:           // 약품
            aiProcessInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, alarmInfo.getProcessStep());
            break;
        case CommonValue.PROCESS_MIXING:              // 혼화응집
            aiProcessInit = databaseService.getAiMixingInit(CommonValue.D_OPERATION_MODE, alarmInfo.getProcessStep());
            break;
        case CommonValue.PROCESS_SEDIMENTATION:       // 침전
            aiProcessInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE, alarmInfo.getProcessStep());
            break;
        case CommonValue.PROCESS_FILTER:              // 여과
            aiProcessInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, alarmInfo.getProcessStep());
            break;
        case CommonValue.PROCESS_DISINFECTION:        // 소독
            if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP) {
            	aiProcessInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE, alarmInfo.getProcessStep(), CommonValue.DISINFECTION_PRE_STEP);
            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP) {
            	aiProcessInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE, alarmInfo.getProcessStep(), CommonValue.DISINFECTION_PERI_STEP);
            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_POST_STEP) {
            	aiProcessInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE, alarmInfo.getProcessStep(), CommonValue.DISINFECTION_POST_STEP);
            }
            break;
    	}
    	return aiProcessInit;
    }
    
    /**
     * 최근 공정에 등록된 제어 명령을 조회
     * @param queryDto
     * @param alarmInfo
     * @return
     */
    public List<AiProcessControlDTO> getAiControlList(AiProcessControlDTO queryDto, AlarmInfoDTO alarmInfo) {
        List<AiProcessControlDTO> aiControlList = new ArrayList<>();
        switch (alarmInfo.getProcess()) {
	        case CommonValue.PROCESS_RECEIVING:           // 착수
	            aiControlList = databaseService.getListAiReceivingControl(queryDto);
	            break;
	        case CommonValue.PROCESS_COAGULANT:           // 약품
	            aiControlList = databaseService.getListAiCoagulantControl(queryDto);
	            break;
	        case CommonValue.PROCESS_MIXING:              // 혼화응집
	            aiControlList = databaseService.getListAiMixingControl(queryDto);
	            break;
	        case CommonValue.PROCESS_SEDIMENTATION:       // 침전
	            aiControlList = databaseService.getListAiSedimentationControl(queryDto);
	            break;
	        case CommonValue.PROCESS_FILTER:              // 여과
	            aiControlList = databaseService.getListAiFilterControl(queryDto);
	            break;
	        case CommonValue.PROCESS_DISINFECTION:        // 소독
	            if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP) {
	                aiControlList = databaseService.getListAiPreDisinfectionControl(queryDto);
	            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP) {
	                aiControlList = databaseService.getListAiPeriDisinfectionControl(queryDto);
	            }else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_POST_STEP) {
	                aiControlList = databaseService.getListAiPostDisinfectionControl(queryDto);
	            }
	            break;
        }
        return aiControlList;
    }
    
    /**
     * 최근 공정에 등록된 안내알람을 조회
     * @param queryDto
     * @param alarmInfo
     * @return
     */
    public List<AiProcessAlarmDTO> getAiAlarmList(AiProcessAlarmDTO queryDto, AlarmInfoDTO alarmInfo) {
        List<AiProcessAlarmDTO> aiAlarmList = new ArrayList<>();
        switch (alarmInfo.getProcess()) {
	        case CommonValue.PROCESS_RECEIVING:           // 착수
	        	aiAlarmList = databaseService.getAllAiReceivingAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep());
	            break;
	        case CommonValue.PROCESS_COAGULANT:           // 약품
	        	aiAlarmList = databaseService.getAllAiCoagulantAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep());
	            break;
	        case CommonValue.PROCESS_MIXING:              // 혼화응집
	        	aiAlarmList = databaseService.getAllAiMixingAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep());
	            break;
	        case CommonValue.PROCESS_SEDIMENTATION:       // 침전
	        	aiAlarmList = databaseService.getAllAiSedimentationAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep());
	            break;
	        case CommonValue.PROCESS_FILTER:              // 여과
	        	aiAlarmList = databaseService.getAllAiFilterAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep());
	            break;
	        case CommonValue.PROCESS_DISINFECTION:        // 소독
	            if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP) {
	            	aiAlarmList = databaseService.getAllAiDisinfectionAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep(), CommonValue.DISINFECTION_PRE_STEP);
	            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP) {
	            	aiAlarmList = databaseService.getAllAiDisinfectionAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep(), CommonValue.DISINFECTION_PERI_STEP);
	            }else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_POST_STEP) {
	            	aiAlarmList = databaseService.getAllAiDisinfectionAlarm(queryDto.getAlm_ti(), queryDto.getKfk_flg(), queryDto.getProcessStep(), CommonValue.DISINFECTION_POST_STEP);
	            }
	            break;
        }
        return aiAlarmList;
    }

    /**
     * 제어태그 kafka 전송 & kafka flag send 업데이트
     * @param aiControlList
     * @param alarmInfo
     * @return
     */
    public ResponseEntity<String> sendAiProcessControl(List<AiProcessControlDTO> aiControlList, AlarmInfoDTO alarmInfo) {
        String strBody;
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strErrorBody = "";
        try {
            for(AiProcessControlDTO dto : aiControlList) {
                // send control value to kafka ai_control
                LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                controlMap.put("tag", dto.getTag_sn());
                // Pulse / Value 값 구분하여 설정
                controlMap.put("value", dto.getTag_val().equalsIgnoreCase(CommonValue.CONTROL_TRUE) ? true : Float.parseFloat(dto.getTag_val()));
                controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                strBody = objectMapper.writeValueAsString(controlMap);
                kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                // update kafka_flag=3 (kafka_send)
                AiProcessControlDTO updateDto = dto;
                updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                updateDto.setProcessStep(alarmInfo.getProcessStep());
                
                updateControlKafkaFlag(updateDto, alarmInfo);
            }
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in Alarm "+alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"))+" Control Process");
            strErrorBody = "{\"reason\":\"JsonProcessing Exception\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        } catch(NumberFormatException e) {
            log.error("NumberException Occurred in Alarm "+alarmInfo.getCd_nm().substring(0, alarmInfo.getCd_nm().indexOf("_"))+" Control Process");
            strErrorBody = "{\"reason\":\"NumberFormatException Exception\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 각 공정별 제어테이블의 KFK_FLG 값 UPDATE
     * 
     * @param updateDto
     * @param alarmInfo
     */
    public void updateControlKafkaFlag(AiProcessControlDTO updateDto, AlarmInfoDTO alarmInfo) {
    	switch(alarmInfo.getProcess()){
	    	case CommonValue.PROCESS_RECEIVING:
	            databaseService.modAiReceivingControlKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_COAGULANT:
	            databaseService.modAiCoagulantControlKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_MIXING:
	            databaseService.modAiMixingControlKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_SEDIMENTATION:
	            databaseService.modAiSedimentationControlKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_FILTER:
	            databaseService.modAiFilterControlKafkaFlag(updateDto);
	            break;
	        case CommonValue.PROCESS_DISINFECTION:        // 소독
	            if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP) {
	            	databaseService.modAiPreDisinfectionControlKafkaFlag(updateDto);
	            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP) {
	            	databaseService.modAiPeriDisinfectionControlKafkaFlag(updateDto);
	            }else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_POST_STEP) {
	            	databaseService.modAiPostDisinfectionControlKafkaFlag(updateDto);
	            }
	            break;
    	}
    }
    
    /**
     * 각 공정별 알람테이블의 KFK_FLG 값 UPDATE
     * 
     * @param updateDto
     * @param alarmInfo
     */
    public void updateAlarmKafkaFlag(AiProcessAlarmDTO updateDto, AlarmInfoDTO alarmInfo) {
    	switch(alarmInfo.getProcess()){
	    	case CommonValue.PROCESS_RECEIVING:
	            databaseService.modAiReceivingAlarmKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_COAGULANT:
	            databaseService.modAiCoagulantAlarmKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_MIXING:
	            databaseService.modAiMixingAlarmKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_SEDIMENTATION:
	            databaseService.modAiSedimentationAlarmKafkaFlag(updateDto);
	            break;
	    	case CommonValue.PROCESS_FILTER:
	            databaseService.modAiFilterAlarmKafkaFlag(updateDto);
	            break;
	        case CommonValue.PROCESS_DISINFECTION:        // 소독
	            if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PRE_STEP) {
	            	databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_PRE_STEP);
	            } else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_PERI_STEP) {
	            	databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_PERI_STEP);
	            }else if(alarmInfo.getDisinfectionIndex() == CommonValue.DISINFECTION_POST_STEP) {
	            	databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_POST_STEP);
	            }
	            break;
    	}
    }
}
