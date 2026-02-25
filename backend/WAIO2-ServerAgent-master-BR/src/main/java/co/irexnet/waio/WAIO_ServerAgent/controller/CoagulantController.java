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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiCoagulantRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiCoagulantSimulationDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonCSeriesFloat;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.JsonCSeriesString;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.UsrManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceAiCoagulantSimulationDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceCoagulantAiDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceCoagulantDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDateSearchDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceOperationModeDTO;
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
public class CoagulantController
{
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 약품 공정 최근 데이터 조회
     * 
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/coagulant/latest/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestCoagulant(@PathVariable int processStep) {
        log.debug("Recv getLatestCoagulant");
        
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
//        strPartitionName = "20231201";	// FIXME 현재 날짜 수정

        // get ai_coagulant_init(c_operation_mode)
        AiProcessInitDTO aiCoagulantInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, processStep);
        log.debug("getAiCoagulantInit, result:[{}]", aiCoagulantInit != null ? 1 : 0);

        // get ai_coagulant_init
        List<AiProcessInitDTO> aiCoagulantInitList = databaseService.getAllAiCoagulantInit(processStep);
        log.debug("getAllAiCoagulantInit, result:[{}]", aiCoagulantInitList.size());

        // get ai_coagulant_realtime
        AiCoagulantRealtimeDTO aiCoagulantRealtime = databaseService.getLatestAiCoagulantRealtimeValue(processStep);
        log.debug("getLatestAiCoagulantRealtimeValue, result:[{}]", aiCoagulantRealtime != null ? 1 : 0);

        // get coagulant_realtime
        List<ProcessRealtimeDTO> coagulantRealtime = databaseService.getLatestCoagulantRealtimeValue(strPartitionName, processStep);
        log.debug("getLatestCoagulantRealtimeValue, result:[{}]", coagulantRealtime.size());

        // get tag_manage(coagulant)
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_COAGULANT, processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_COAGULANT, tagManageList.size());

        if(aiCoagulantRealtime != null) {
        	log.debug("do aiCoagulantRealtime");
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiCoagulantInfo = new LinkedHashMap<>();
            LinkedHashMap<String, Object> mapTemp;
            
            // update_time
            aiCoagulantInfo.put("upd_ti", aiCoagulantRealtime.getUpd_ti());
            
            // operation_mode
			if(aiCoagulantInit != null) {
			    aiCoagulantInfo.put("ai_opr", aiCoagulantInit.getInit_val().intValue());
			} else {
			    aiCoagulantInfo.put("ai_opr", aiCoagulantRealtime.getAi_opr());
			}
			
			for(AiProcessInitDTO dto : aiCoagulantInitList) {
				if(dto.getItm().equalsIgnoreCase("c_cf_max")) { //약품 주입률 상한
					aiCoagulantInfo.put(dto.getItm(), dto.getInit_val());
				} else if(dto.getItm().equalsIgnoreCase("c_cf_min")) { //약품 주입률 하한
					aiCoagulantInfo.put(dto.getItm(), dto.getInit_val());
				} else if (dto.getItm().equalsIgnoreCase("c_user_correct")) { // 사용자 보정 값
                    aiCoagulantInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("c_user_tb_e")) { // 목표 침전지 탁도
                    aiCoagulantInfo.put(dto.getItm(), dto.getInit_val());
                }
			}

			// Realtime data from SCADA
			Float d1_mm_fr = 0.0f, c1_cf = 0.0f;
			Float d2_mm_fr = 0.0f, c2_cf = 0.0f;
			Float d3_mm_fr = 0.0f, c3_cf = 0.0f;
			
			Float b_in_fr = 0.0f;
			// tag_manage에 정의한 태그명을 통해 실시간 데이터를 가져와 aiCoagulantInfo에 등록
			for(TagManageDTO tagManage: tagManageList) {
			    for(ProcessRealtimeDTO dto : coagulantRealtime) {
			        if(tagManage.getItm().equalsIgnoreCase("b_tb") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			            // 원수 탁도
			            aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("e1_tb_b") == true &&
			        		tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 침전지 탁도
			        	aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("b_ph") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true){
			            // 원수 pH
			            aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("b_te") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			            // 원수 수온
			            aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("b_cu") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			            // 원수 전기전도도
			            aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			            // 원수 유입 유량
			            aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			        	b_in_fr = Float.parseFloat(dto.getTag_val());
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("d1_mm_fr") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 1호(기) 응집제 주입량
			        	d1_mm_fr = Float.parseFloat(dto.getTag_val());
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("d2_mm_fr") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 2호(기) 응집제 주입량
			            d2_mm_fr = Float.parseFloat(dto.getTag_val());
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("d3_mm_fr") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 3호(기) 응집제 주입량
			        	d3_mm_fr = Float.parseFloat(dto.getTag_val());
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("c1_cf") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 1호(기) 응집제 주입률
			        	aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("c2_cf") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 2호(기) 응집제 주입률
			        	aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			        else if(tagManage.getItm().equalsIgnoreCase("c3_cf") == true &&
			                tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
			        	// 3호(기) 응집제 주입률
			        	aiCoagulantInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
			            break;
			        }
			    }
			}
			
			// 1호기/2호기/3호기 응집제 주입량
			aiCoagulantInfo.put("c1_mm_fr", d1_mm_fr);
			aiCoagulantInfo.put("c2_mm_fr", d2_mm_fr);
			aiCoagulantInfo.put("c3_mm_fr",d3_mm_fr);

			// PACS 1호기/2호기, PLOYMAX 3호기 응집제 주입률 (응집제 주입량 / 원수유입양 * 1000)
			// 주입률 태그 추가로 주석처리
//			aiCoagulantInfo.put("c1_cf", d1_mm_fr/b_in_fr * 1000);
//			aiCoagulantInfo.put("c2_cf", d2_mm_fr/b_in_fr * 1000);
//			aiCoagulantInfo.put("c3_cf", d3_mm_fr/b_in_fr * 1000);
			
			// ai_cluster_id
			aiCoagulantInfo.put("ai_clst_id", aiCoagulantRealtime.getAi_clst_id());
			
			// 약품 종류
//			aiCoagulantInfo.put("c_mm_coagulant","APAC-1050");
			UsrManageDTO usrManageCoagulant = databaseService.getUsrMngFromItm("c_cf_coagulant");
			aiCoagulantInfo.put("c_cf_coagulant", usrManageCoagulant.getInit_val());

			// AI 주입률 예측 최종값
			aiCoagulantInfo.put("ai_c_cf", aiCoagulantRealtime.getAi_c_cf());
			
			// 사용자보정 처리 이전 주입률
            aiCoagulantInfo.put("ai_c_cf_norm_co", aiCoagulantRealtime.getAi_c_cf_norm_co());
			
			// 현재 투입기
			aiCoagulantInfo.put("c_injector1", aiCoagulantRealtime.getC_injector1());
			aiCoagulantInfo.put("c_injector2", aiCoagulantRealtime.getC_injector2());
			aiCoagulantInfo.put("c_injector3", aiCoagulantRealtime.getC_injector3());
			
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiCoagulantInfo);
            
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
        
        String strErrorBody = "{\"reason\":\"Empty ai_coagulant\"}";
        return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
    }

    /**
     * 약품 공정 제어모드 변경
     * 
     * @param operationMode 제어모드
     * @param processStep   공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/coagulant/control/operation/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlCoagulant(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep)
    {
        log.info("putOperationControlCoagulant, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO)
        {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_coagulant_init's operation_mode
//        log.debug("update aiCoagulantOperationMode:[{}], mode:[{}]",
//                databaseService.modAiCoagulantOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(c_operation_mode)
        AiProcessInitDTO aiCoagulantInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, processStep);
        log.info("getAiCoagulantInit, result:[{}]", aiCoagulantInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try
        {
        	if(aiCoagulantInit != null) {
        		// Kafka에 전송할 값 정의
        		LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
        		controlMap.put("tag", aiCoagulantInit.getTag_sn());
        		controlMap.put("value", nOperationMode);
        		controlMap.put("time", strDate);
        		
        		// ObjectMapper를 통해 JSON 값을 String으로 변환하여 kafka 전송
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(controlMap);
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 약품 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList)
        		{
        			if(dto.getItm().equalsIgnoreCase("c_operation_mode_a") == true) // TODO 추후에 수정
        			{
        				// Kafka에 전송할 값 정의
        				controlMap = new LinkedHashMap<>();
        				controlMap.put("tag", dto.getTag_sn());
        				controlMap.put("value", nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true);
        				controlMap.put("time", strDate);
        				
        				// ObjectMapper를 통해 JSON 값을 String으로 변환하여 kafka 전송
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(controlMap);
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiCoagulantOperationMode(nOperationMode, processStep);
        	} else {
                log.error("Does not exist aiCoagulantInit:[{]]", CommonValue.C_OPERATION_MODE);
            }
        }
        catch(JsonProcessingException e)
        {
            log.error("JsonProcessingException Occurred in /coagulant/control/operation API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 약품 주입률 상/하한 수정
     * 
     * @param coagulantAi Front-end 주입률 상/하한 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/coagulant/control/ai/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putAiControlCoagulant(@RequestBody InterfaceCoagulantAiDTO coagulantAi, @PathVariable int processStep) {
        log.debug("putAiControlCoagulant, ai:[{}]", coagulantAi);

        boolean result = true;
        
        // update 주입률 상한
        result = (databaseService.modAiCoagulantInit("c_cf_max", coagulantAi.getC_cf_max(), processStep) == 1) && result;
        
        // update 주입률 하한
        result = (databaseService.modAiCoagulantInit("c_cf_min", coagulantAi.getC_cf_min(), processStep) == 1) && result;
        
        // update 목표 침전지 탁도
        result = (databaseService.modAiCoagulantInit("c_user_tb_e", coagulantAi.getC_user_tb_e(), processStep) == 1) && result;

        if(result == true) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_coagulant_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @deprecated 미사용
     */
    @RequestMapping(value = "/coagulant/simulation", method = RequestMethod.POST)
    public ResponseEntity<String> postSimulationCoagulant(@RequestBody InterfaceAiCoagulantSimulationDTO simulation)
    {
        log.debug("Recv postSimulationCoagulant, [{}]", simulation);

        // Make simulation data
        AiCoagulantSimulationDTO aiCoagulantSimulation = new AiCoagulantSimulationDTO();
        aiCoagulantSimulation.setReg_time(new Date());
        aiCoagulantSimulation.setState(CommonValue.STATE_STANDBY);
        aiCoagulantSimulation.setB_tb(simulation.getB_tb());
        aiCoagulantSimulation.setB_ph(simulation.getB_ph());
        aiCoagulantSimulation.setB_te(simulation.getB_te());
        aiCoagulantSimulation.setB_cu(simulation.getB_cu());
        aiCoagulantSimulation.setB_in_fr(simulation.getB_in_fr());
        aiCoagulantSimulation.setE1_tb(simulation.getE1_tb());
        aiCoagulantSimulation.setE2_tb(simulation.getE2_tb());

        // Insert simulation data
        int nResult = databaseService.addAiCoagulantSimulation(aiCoagulantSimulation);
        log.debug("addCoagulantSimulation, result:[{}]", nResult);
        if(nResult > 0)
        {
            return new ResponseEntity<>("", HttpStatus.CREATED);
        }
        else
        {
            String strErrorBody = "{\"reason\":\"" + HttpStatus.CONFLICT.getReasonPhrase() + "\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.CONFLICT);
        }
    }

    /**
     * @deprecated 미사용
     */
    @RequestMapping(value = "/coagulant/simulation", method = RequestMethod.PUT)
    public ResponseEntity<String> getSimulationCoagulant(@RequestBody InterfaceDateSearchDTO dateSearch)
    {
        log.debug("getSimulationCoagulant, start:[{}], end:[{}]", dateSearch.getStart_time(), dateSearch.getEnd_time());

        // Get simulation data
        List<AiCoagulantSimulationDTO> aiCoagulantSimulationList = databaseService.getAiCoagulantSimulation(dateSearch);
        log.debug("getAiCoagulantSimulation, result:[{}]", aiCoagulantSimulationList.size());

        if(aiCoagulantSimulationList.size() > 0)
        {
            // Make Response Body
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("simulation", aiCoagulantSimulationList);

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
            String strErrorBody = "{\"reason\":\"Empty ai_coagulant_simulation\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 응집제 종류 변경
     * 
     * @param coagulant coagulantAi Front-end 응집제 종류 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/coagulants/control/coagulant/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putControlCoagulant(@RequestBody InterfaceCoagulantDTO coagulant, @PathVariable int processStep)
    {
        log.debug("putAiControlCoagulant, ai:[{}]", coagulant);

        boolean result = true;

        // update 응집제 종류
        result = (databaseService.modUsrMngFromItm("c_cf_coagulant", coagulant.getC_cf_coagulant()) == 1) && result;

        if(result == true)
        {
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else
        {
            String strErrorBody = "{\"reason\":\"ai_coagulant_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 사용자 보정 값 설정
     * 
     * @param coagulant coagulantAi Front-end 사용자 보정 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/coagulants/control/userCorrect/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putAiControlUserCorrect(@RequestBody InterfaceCoagulantAiDTO coagulantAi,
            @PathVariable int processStep) {
        log.debug("putAiControlUserCorrect, user_correct:[{}]", coagulantAi);

        boolean result = true;

        // update 사용자 보정 값
        result = (databaseService.modAiCoagulantInit("c_user_correct", coagulantAi.getC_user_correct(), processStep) == 1)
                && result;

        if (result == true) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_coagulant_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}
