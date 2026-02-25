package co.irexnet.waio.WAIO_ServerAgent.controller;

import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
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

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiDisinfectionRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiProcessInitDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDateSearchDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDisinfectionPeriDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDisinfectionPostDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceDisinfectionPreDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.InterfaceOperationModeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.ProcessRealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageDTO;
import co.irexnet.waio.WAIO_ServerAgent.dto.TagManageRangeDTO;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.service.MakeTagMapServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class DisinfectionController
{
	@Autowired
	MakeTagMapServiceImpl tagMapService;
	
    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * 소독 공정 최근 데이터 조회
     * 
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @param processStep       공정단계
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/latest/{processStep}/{disinfectionStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestDisinfection(@PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("Recv getLatestDisinfection");

        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
//        strPartitionName = "20231201";	// FIXME 현재 날짜 수정
        
        AiProcessInitDTO aiPreDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE, processStep, disinfectionStep); // get ai_disinfection_init(g_pre_operation_mode)
        log.debug("getAiDisinfectionInit pre, result:[{}]", aiPreDisinfectionInit != null ? 1 : 0);

        AiProcessInitDTO aiPeriDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE, processStep, disinfectionStep); // get ai_disinfection_init(g_peri_operation_mode)
        log.debug("getAiDisinfectionInit peri, result:[{}]", aiPeriDisinfectionInit != null ? 1 : 0);

        AiProcessInitDTO aiPostDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE, processStep, disinfectionStep); // get ai_disinfection_init(g_post_operation_mode)
        log.debug("getAiDisinfectionInit post, result:[{}]", aiPostDisinfectionInit != null ? 1 : 0);

        List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep, disinfectionStep); // get ai_disinfection_init
        log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

        AiDisinfectionRealtimeDTO aiDisinfectionRealtime = databaseService.getLatestAiDisinfectionRealtimeValue(processStep, disinfectionStep); // get ai_disinfection_realtime
        log.debug("getLatestAiDisinfectionRealtimeValue, result:[{}]", aiDisinfectionRealtime != null ? 1 : 0);
        
        List<ProcessRealtimeDTO> disinfectionRealtime = databaseService.getLatestDisinfectionRealtimeValue(strPartitionName, processStep); // get disinfection_realtime
        log.debug("getLatestDisinfectionRealtimeValue, result:[{}]", disinfectionRealtime.size());

        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_DISINFECTION, processStep); // get tag_manage(disinfection)
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_DISINFECTION, tagManageList.size());
        
        // get location number(지 번호)
        TagManageRangeDTO filterRange = databaseService.getTagManageRange(CommonValue.PROCESS_FILTER, processStep);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_FILTER, filterRange != null ? 1 : 0);

        ObjectMapper objectMapper = new ObjectMapper();
        LinkedHashMap<String, Object> aiDisinfectionInfo = new LinkedHashMap<>();
        
        Map<String, Object> responseBody = new HashMap<>();
        String strBody = "";
        
        //---------------- SCADA 실시간 데이터 정보 Setting for Response Start ----------------
        if(disinfectionRealtime != null && disinfectionRealtime.size()>0) {
        	
            for(TagManageDTO tagManage : tagManageList) {
                for(ProcessRealtimeDTO dto : disinfectionRealtime) {
                    
                	/*
                	 * b_te : 원수 수온
                	 * */
                	if(tagManage.getItm().equalsIgnoreCase("b_te") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                	
                	/**
                	 * b_in_fr : 착수정 원수 유입유량
                	 */
                	else if(tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                		aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                	}
                	
                	/**
                	 * h_ph : 정수 pH
                	 */
                	else if(tagManage.getItm().equalsIgnoreCase("h_ph") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                		aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                	}
                	
                	/**
                	 * h_tb : 정수 탁도
                	 */
                	else if(tagManage.getItm().equalsIgnoreCase("h_tb") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                		aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                	}
                    
                    /*
                     * g_1_set_max : 전염소 주입률 상한
                     * g_1_set_min : 전염소 주입률 하한
                     * g_2_set_max : 중염소 주입률 상한
                     * g_2_set_min : 중염소 주입률 하한
                     * g_3_set_max : 후염소 주입률 상한
                     * g_3_set_min : 후염소 주입률 하한
                     * g_4_set_max : 예비염소 주입률 상한
                     * g_4_set_min : 예비염소 주입률 하한
                     * */
                    else if((  tagManage.getItm().equalsIgnoreCase("g_1_set_max") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_1_set_min") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_2_set_max") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_2_set_min") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_3_set_max") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_3_set_min") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_4_set_max") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_4_set_min") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) { 
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
                        break;
                    }
                	
                    /**
                     * g_1_chlorination : 전염소 현재 주입률
                     * g_2_chlorination : 중염소 현재 주입률
                     * g_3_chlorination : 후염소 현재 주입률
                     * g_4_chlorination : 예비염소 현재 주입률
                     */
                	// IN_VAL에서 가져오도록 변경
//                    else if((  tagManage.getItm().equalsIgnoreCase("g_1_chlorination") == true
//                    		|| tagManage.getItm().equalsIgnoreCase("g_2_chlorination") == true
//                    		|| tagManage.getItm().equalsIgnoreCase("g_3_chlorination") == true
//                    		|| tagManage.getItm().equalsIgnoreCase("g_4_chlorination") == true) 
//                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
//                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
//                        break;
//                    }
                	
                    /**
                     * g_1_mm_fr : 전염소 현재 주입량
                     * g_2_mm_fr : 중염소 현재 주입량
                     * g_3_mm_fr : 후염소 현재 주입량
                     * g_4_mm_fr : 예비염소 현재 주입량
                     */
                    else if((  tagManage.getItm().equalsIgnoreCase("g_1_mm_fr") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_2_mm_fr") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_3_mm_fr") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_4_mm_fr") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
                        break;
                    }
                	
                    /**
                     * g_1_goal_chlorination : 전염소 목표 주입률
                     * g_2_goal_chlorination : 중염소 목표 주입률
                     * g_3_goal_chlorination : 후염소 목표 주입률
                     * g_4_goal_chlorination : 예비염소 목표 주입률
                     */
                    else if((  tagManage.getItm().equalsIgnoreCase("g_1_goal_chlorination") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_2_goal_chlorination") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_3_goal_chlorination") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_4_goal_chlorination") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
                        break;
                    }
                	
                    /**
                     * g_pre_corrected 	: 전염소 보정값
                     * g_peri_corrected : 중염소 보정값
                     * g_post_corrected	: 후염소 보정값
                     * g_d_corrected	: 예비염소 보정값
                     */
                    else if((  tagManage.getItm().equalsIgnoreCase("g_pre_corrected") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_peri_corrected") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_post_corrected") == true
                    		|| tagManage.getItm().equalsIgnoreCase("g_d_corrected") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) { // 전염소,중염소,후염소(전차염,중차염,후차염) + 예비염소 보정값
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
                        break;
                    }
                    
                    /**
                     * d1_cl : 혼화수(혼화지) 잔류염소
                     * e1_cl : 침전수(침전지) 잔류염소
                     */
                    else if((  tagManage.getItm().equalsIgnoreCase("d1_cl") == true
                    		|| tagManage.getItm().equalsIgnoreCase("e1_cl") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val())); 
                        break;
                    }
                	
                	/**
                     * h_in_cl 	: 정수지 유입 잔류염소
                     * h_cl 	: 정수지 잔류염소
                     */
                    else if((  tagManage.getItm().equalsIgnoreCase("h_in_cl") == true
                    		|| tagManage.getItm().equalsIgnoreCase("h_cl") == true) 
                    		&& tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                    	aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                	
                	/**
                	 * f_out_fr : 여과지 유출 유량
                	 */
                	else if(tagManage.getItm().equalsIgnoreCase("f_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                		aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                	}
                }
                
            }
            	
        }else {
        	String strErrorBody = "{\"reason\":\"Empty disinfection\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        //---------------- SCADA 실시간 데이터 정보 Setting for Response End ----------------
        
        
        //---------------- AI 실시간 데이터 정보 Setting for Response Start ----------------
        if(aiDisinfectionRealtime != null) {
        	
        	aiDisinfectionInfo.put("upd_ti", aiDisinfectionRealtime.getUpd_ti()); 		// update_time
        	
        	if(disinfectionStep == 1) {
        		aiDisinfectionInfo.put("ai_g_pre_chol", aiDisinfectionRealtime.getAi_g_pre_chol()); // 전차염 염소 주입률 예측 값
        		aiDisinfectionInfo.put("ai_g_pre_evap", aiDisinfectionRealtime.getAi_g_pre_evap());	// 전차염 염소 증발량 예측 값
        		aiDisinfectionInfo.put("d1_in_fr", aiDisinfectionRealtime.getD1_in_fr()); 			// 혼화응집으로 넘어온 유입 유량 값
        		aiDisinfectionInfo.put("g_pre_chol_rate", aiDisinfectionRealtime.getG_pre_chol_rate()); 	// 전차염 주입률
        		aiDisinfectionInfo.put("d1_cl", aiDisinfectionRealtime.getD1_cl());							// 혼화지 잔류염소
        		
        		// SCADA에서 침전지 잔류염소 계측값을 받지 못했을 경우, AI테이블 IN_VAL에서 대체
        		if(!aiDisinfectionInfo.containsKey("e1_cl")) { 
        			aiDisinfectionInfo.put("e1_cl", aiDisinfectionRealtime.getE1_cl());
        		}
        		
        		// 현재 사용 차염설비
                aiDisinfectionInfo.put("g_inj_a_run", aiDisinfectionRealtime.getG_inj_a_run());
                aiDisinfectionInfo.put("g_inj_d_run", aiDisinfectionRealtime.getG_inj_d_run());
                
                aiDisinfectionInfo.put("g_tei", aiDisinfectionRealtime.getG_tei());		// 기온
                aiDisinfectionInfo.put("g_peri_chol_rate", aiDisinfectionRealtime.getG_peri_chol_rate());		// 중염소 주입률
        		
        	} else if(disinfectionStep == 2) {
        		aiDisinfectionInfo.put("ai_g_peri_chol", aiDisinfectionRealtime.getAi_g_peri_chol()); 	// 중차염 염소 주입률 예측 값
        		aiDisinfectionInfo.put("g_peri_chol_rate", aiDisinfectionRealtime.getG_peri_chol_rate()); 	// 중차염 주입률
        		
        		// SCADA에서 침전지 잔류염소 계측값을 받지 못했을 경우, AI테이블 IN_VAL에서 대체
        		if(!aiDisinfectionInfo.containsKey("e1_cl")) { 
        			aiDisinfectionInfo.put("e1_cl", aiDisinfectionRealtime.getE1_cl());
        		}
        		
        		// 현재 사용 차염설비
        		aiDisinfectionInfo.put("g_inj_b_run", aiDisinfectionRealtime.getG_inj_b_run());
                aiDisinfectionInfo.put("g_inj_d_run", aiDisinfectionRealtime.getG_inj_d_run());
                // 여과지 유출 잔류염소
                aiDisinfectionInfo.put("g_f_out_residual_cl", aiDisinfectionRealtime.getG_f_out_residual_cl());
        		
        	} else if(disinfectionStep == 3) {
        		aiDisinfectionInfo.put("ai_g_post_chol", aiDisinfectionRealtime.getAi_g_post_chol());				// 후차염 염소 주입률 예측 값
        		aiDisinfectionInfo.put("ai_g_correct_degree", aiDisinfectionRealtime.getAi_g_correct_degree());		// 후차염 이전 주입률 보정예측	
        		aiDisinfectionInfo.put("g_post_chol_rate", aiDisinfectionRealtime.getG_post_chol_rate()); 			// 후차염 주입률
        		
        		// 현재 사용 차염설비
        		aiDisinfectionInfo.put("g_inj_c_run", aiDisinfectionRealtime.getG_inj_c_run());
                aiDisinfectionInfo.put("g_inj_d_run", aiDisinfectionRealtime.getG_inj_d_run());
        	}
        	// 주입 후 경과시간
        	aiDisinfectionInfo.put("g_elapsed_time", aiDisinfectionRealtime.getG_elapsed_time());
        } else {
        	String strErrorBody = "{\"reason\":\"Empty ai_disinfection\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        //---------------- AI 실시간 데이터 정보 Setting for Response End ----------------
        
        
        //---------------- AI INIT 데이터 정보 Setting for Response Start ----------------
        if(aiDisinfectionInitList != null && aiDisinfectionInitList.size()>0) {
        	
//        	for(AiProcessInitDTO dto : aiDisinfectionInitList) {
//        		
//        		// 전차염 START ------------------------------------------------
//        		if(dto.getItm().equalsIgnoreCase("g_pre_set_max") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //전차염 주입률 상한
//        		}
//        		else if(dto.getItm().equalsIgnoreCase("g_pre_set_min") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //전차염 주입률 하한
//        		}
//        		else if(dto.getItm().equalsIgnoreCase("g_pre_calib_cycle") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //전차염 보정주기
//        		}
//        		else if(dto.getItm().equalsIgnoreCase("g_pre_chg_limit_for_onetime") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //전차염 1회 변경 주입률
//        		}
//        		else if(dto.getItm().equalsIgnoreCase("g_d_obj_residual_cl") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //전차염 목표 혼화지 잔류염소
//        		}
//        		// 전차염 END ------------------------------------------------
//        		
//        		// 중차염 START ------------------------------------------------
//        		else if(dto.getItm().equalsIgnoreCase("g_peri_set_max") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //중차염 주입률 상한
//        		}
//				else if(dto.getItm().equalsIgnoreCase("g_peri_set_min") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //중차염 주입률 하한 			
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_peri_calib_cycle") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //중차염 보정주기
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_peri_chg_limit_for_onetime") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //중차염 1회 변경 주입률
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_e_obj_residual_cl") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //중차염 목표 침전지 잔류염소
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_f_out_residual_cl_min") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //여과지 유출 잔류염소 하한값
//				}
//        		// 중차염 END ------------------------------------------------
//        		
//        		// 후차염 START ------------------------------------------------
//				else if(dto.getItm().equalsIgnoreCase("g_post_set_max") == true) {
//        			aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 주입률 상한
//        		}
//				else if(dto.getItm().equalsIgnoreCase("g_post_set_min") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 주입률 하한 			
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_post_calib_cycle") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 보정주기
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_post_chg_limit_for_onetime") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 1회 변경 주입률
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_h_obj_residual_cl") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 목표 정수지 잔류염소
//				}
//				else if(dto.getItm().equalsIgnoreCase("g_post_calib_num") == true) {
//					aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val()); //후차염 보정상수
//				}
//        		// 후차염 END ------------------------------------------------
//        		
//            }
        	
        	for (AiProcessInitDTO dto : aiDisinfectionInitList) {
            	aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
            }
        	
        }else {
        	String strErrorBody = "{\"reason\":\"Empty ai_disinfection_init_list\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        
        // 전차염(전염소) AI모드 설정
        if(aiPreDisinfectionInit != null) {
            aiDisinfectionInfo.put("pre_ai_opr", aiPreDisinfectionInit.getInit_val().intValue());
        } else {
        	aiDisinfectionInfo.put("pre_ai_opr",((AiDisinfectionRealtimeDTO)databaseService.getLatestAiDisinfectionRealtimeValue(processStep, 1)).getAi_opr());
        }
        
        // 중차염(중염소) AI모드 설정
        if(aiPeriDisinfectionInit != null) { 
            aiDisinfectionInfo.put("peri_ai_opr", aiPeriDisinfectionInit.getInit_val().intValue());
        } else {
        	aiDisinfectionInfo.put("peri_ai_opr",((AiDisinfectionRealtimeDTO)databaseService.getLatestAiDisinfectionRealtimeValue(processStep, 2)).getAi_opr());
        }
        
        // 후차염(후염소) AI모드 설정
        if(aiPostDisinfectionInit != null) {
            aiDisinfectionInfo.put("post_ai_opr", aiPostDisinfectionInit.getInit_val().intValue());
        } else {
        	aiDisinfectionInfo.put("post_ai_opr",((AiDisinfectionRealtimeDTO)databaseService.getLatestAiDisinfectionRealtimeValue(processStep, 3)).getAi_opr());
        }
        //---------------- AI INIT 데이터 정보 Setting for Response End ----------------
        
        
        //---------------- 조회 데이터 Response Body에 Setting ---------------- 
        try {
        	responseBody.put("latest", aiDisinfectionInfo);
            strBody = objectMapper.writeValueAsString(responseBody);
        } catch(JsonProcessingException e) {
            String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //---------------- 조회 데이터 Response Body에 Setting ---------------- 
        
        return new ResponseEntity<>(strBody, HttpStatus.OK);
    }

    // 전차염 주입률 측정 이력 조회 (미사용)
    /*@RequestMapping(value = "/disinfection/history/pre/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPreHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("getPreHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        if(aiDisinfectionRealtimeList.size() > 0)
        {
            // Make Response Body
            LinkedHashMap<String, Object> seriesPreInfo = new LinkedHashMap<>();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate;

            // aiDisinfectionRealtimeList에서 계열별 전염소 주입률을 조회하여 series1PreMap, series2PreMap에 등록
            LinkedHashMap<String, Float> series1PreMap = new LinkedHashMap<>();
            LinkedHashMap<String, Float> series2PreMap = new LinkedHashMap<>();
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList)
            {
                strDate = simpleDateFormat.format(dto.getUpd_ti());
                series1PreMap.put(strDate, dto.getG_pre1_chlorination());
                series2PreMap.put(strDate, dto.getG_pre2_chlorination());
            }

            // seriesPreInfo에 series1PreMap, series2PreMap 등록
            seriesPreInfo.put("series1", series1PreMap);
            seriesPreInfo.put("series2", series2PreMap);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("pre_chlorination", seriesPreInfo);

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
            String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }*/

    /**
     * 중차염 주입률 예측 트렌드 조회
     * 
     * @param dateSearchDTO Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep 공정단계
     * @param disinfectionStep 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/periCholRateTrend/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPeriCholRateTrend(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep){
    	log.debug("getPeriCholRateTrend, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
    	
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        
        if(aiDisinfectionRealtimeList.size() > 0) {
        	// Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> cholRateTrend = new LinkedHashMap<>();

            ObjectMapper objectMapper = new ObjectMapper();
            
            // 중차염 주입률 예측 데이터 조회
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                if(dto.getAi_g_peri_chol() != null) {
                	String strDate = simpleDateFormat.format(dto.getUpd_ti());
                	cholRateTrend.put(strDate, dto.getAi_g_peri_chol());
                }
            }
            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("ai_g_peri_chol_rate_trend", cholRateTrend);
            
            String strBody;
            try {
            	strBody = objectMapper.writeValueAsString(responseBody);
            } catch(JsonProcessingException e) {
            	String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            	return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        	return new ResponseEntity<>(strBody, HttpStatus.OK);
        }else {
        	String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
    }
    
    /**
     * 후차염 주입률 예측 트렌드 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/postCholRateTrend/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPostCholRateTrend(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep){
    	log.debug("getPostCholRateTrend, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
    	
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        
        if(aiDisinfectionRealtimeList.size() > 0) {        	
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> cholRateTrend = new LinkedHashMap<>();

            ObjectMapper objectMapper = new ObjectMapper();
            
            // 후차염 주입률 예측 데이터 조회
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                if(dto.getAi_g_post_chol() != null) {
                	String strDate = simpleDateFormat.format(dto.getUpd_ti());
                	cholRateTrend.put(strDate, dto.getAi_g_correct_degree());
                }
            }
            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("ai_g_post_chol_rate_trend", cholRateTrend);
            
            String strBody;
            try {
            	strBody = objectMapper.writeValueAsString(responseBody);
            } catch(JsonProcessingException e) {
            	String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            	return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        	return new ResponseEntity<>(strBody, HttpStatus.OK);
        }else {
        	String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 후차염 정수지 잔류염소 트렌드 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/postResidualCl/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPostResidualCl(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep) {
    	log.debug("getPostResidualCl, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());
    	
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        
        if(aiDisinfectionRealtimeList != null &&
        		aiDisinfectionRealtimeList.size() > 0) {
        	
        	// Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> hResidualClTrend = new LinkedHashMap<>();

            ObjectMapper objectMapper = new ObjectMapper();
        	
        	for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
        		if(dto.getG_h_in_residual_cl() != null) {
        			String strDate = simpleDateFormat.format(dto.getUpd_ti());
        			hResidualClTrend.put(strDate, dto.getG_h_in_residual_cl());
        		}
        	}
        	
        	Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("g_h_in_residual_cl_trend", hResidualClTrend);
        	
        	String strBody = "";
        	try {
        		strBody = objectMapper.writeValueAsString(responseBody);
        	} catch(JsonProcessingException e) {
        		String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
            	return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
        	}
        	
        	return new ResponseEntity<>(strBody, HttpStatus.OK);
        	
        }else {
        	String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 전차염 증발량 예측 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/evaporation/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getEvaporationHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("getEvaporationHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        if(aiDisinfectionRealtimeList.size() > 0)
        {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();

            ObjectMapper objectMapper = new ObjectMapper();

            // aiDisinfectionRealtimeList에서 전염소(전차염) 증발량을 조회
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                if(disinfectionStep == 1) {
                	series1.put(strDate, dto.getAi_g_pre_evap());
                }
            }

            // pre_evaporation에 series1 등록
            LinkedHashMap<String, Object> pre_evaporation = new LinkedHashMap<>();
            pre_evaporation.put("series1", series1);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("pre_evaporation", pre_evaporation);

            String strBody;
            try {
                strBody = objectMapper.writeValueAsString(responseBody);
            } catch(JsonProcessingException e) {
                String strErrorBody = "{\"reason\":\"JsonProcessing Error\"}";
                return new ResponseEntity<>(strErrorBody, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(strBody, HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    // 후차염 보정값 예측 이력 조회 (미사용)
    /*@RequestMapping(value = "/disinfection/history/corrected/post/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPostCorrectedHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("getPostCorrectedHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(), dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList =
                databaseService.getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionStep);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());

        if(aiDisinfectionRealtimeList.size() > 0)
        {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> corrected = new LinkedHashMap<>();

            // aiDisinfectionRealtimeList에서 후염소 보정값 예측을 조회하여 corrected에 등록
            for(AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList)
            {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                corrected.put(strDate, dto.getG_inr_crt());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("corrected", corrected);

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
            String strErrorBody = "{\"reason\":\"Empty ai_disinfection_realtime\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }*/

    /**
     * 소독(전) 공정 제어모드 변경
     * 
     * @param operationMode     제어모드
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/operation/pre/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPreDisinfection(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.info("putOperationControlPreDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO)
        {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
//        log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
//                databaseService.modAiDisinfectionOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE, processStep, disinfectionStep);
        log.info("getAiDisinfectionInit pre, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try{
        	if(aiDisinfectionInit != null) {
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiDisinfectionInit.getTag_sn(), nOperationMode, strDate));
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 소독(전) 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList) {
        			if(dto.getItm().equalsIgnoreCase("g_pre_operation_mode_a") == true) {
        				// ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, CommonValue.DISINFECTION_PRE_STEP);
        	} else {
                log.error("Does not exist aiDisinfectionInit:[{]]", CommonValue.G_PRE_OPERATION_MODE);
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/operation/pre API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(중) 공정 제어모드 변경
     * 
     * @param operationMode     제어모드
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/operation/peri/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPeriDisinfection(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.info("putOperationControlPeriDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO)
        {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
//        log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
//                databaseService.modAiDisinfectionOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE, processStep, disinfectionStep);
        log.info("getAiDisinfectionInit peri, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try{
        	if(aiDisinfectionInit != null) {
        		// ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiDisinfectionInit.getTag_sn(), nOperationMode, strDate));
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 소독(중) 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList) {
        			if(dto.getItm().equalsIgnoreCase("g_peri_operation_mode_a") == true) {
        				// ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, CommonValue.DISINFECTION_PERI_STEP);
        	} else {
                log.error("Does not exist aiDisinfectionInit:[{]]", CommonValue.G_PERI_OPERATION_MODE);
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/operation/peri API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(후) 공정 제어모드 변경
     * 
     * @param operationMode     제어모드
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/operation/post/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPostDisinfection(@RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.info("putOperationControlPostDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if(nOperationMode < CommonValue.OPERATION_MODE_MANUAL || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
//        log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
//                databaseService.modAiDisinfectionOperationMode(nOperationMode), nOperationMode);

        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE, processStep, disinfectionStep);
        log.info("getAiDisinfectionInit post, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiDisinfectionInit != null) {
        		// ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
        		ObjectMapper objectMapper = new ObjectMapper();
        		String strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiDisinfectionInit.getTag_sn(), nOperationMode, strDate));
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        		log.info("send to kafka:[{}]", strBody);
        		
        		// Kafka에 소독(후) 공정 제어모드 변경 알람 전송
        		List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        		for(TagManageDTO dto : tagManageList) {
        			if(dto.getItm().equalsIgnoreCase("g_post_operation_mode_a") == true) {
        				objectMapper = new ObjectMapper();
        				strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), nOperationMode == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
        				log.info("send to kafka:[{}]", strBody);
        				
        				break;
        			}
        		}
        		// DB UPDATE
        		databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, CommonValue.DISINFECTION_POST_STEP);
        	} else {
                log.error("Does not exist aiDisinfectionInit:[{]]", CommonValue.G_POST_OPERATION_MODE);
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/operation/post API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(전) 알고리즘 설정값 변경
     * 
     * @param disinfectionPre   Front-end 소독 전염소 알고리즘 설정값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/pre/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPreControlDisinfection(@RequestBody InterfaceDisinfectionPreDTO disinfectionPre, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("putPreControlDisinfection, pre:[{}]", disinfectionPre);

        boolean result = true;
        
        //update g_pre_set_max 
        result = (databaseService.modAiDisinfectionInit("g_pre_set_max", disinfectionPre.getG_pre_set_max(), processStep, disinfectionStep) == 1) && result;
        
        //update g_pre_set_min
        result = (databaseService.modAiDisinfectionInit("g_pre_set_min", disinfectionPre.getG_pre_set_min(), processStep, disinfectionStep) == 1) && result;
        
        //update g_pre_calib_cycle
        result = (databaseService.modAiDisinfectionInit("g_pre_calib_cycle", disinfectionPre.getG_pre_calib_cycle(), processStep, disinfectionStep) == 1) && result;
        
        //update g_pre_chg_limit_for_onetime
        result = (databaseService.modAiDisinfectionInit("g_pre_chg_limit_for_onetime", disinfectionPre.getG_pre_chg_limit_for_onetime(), processStep, disinfectionStep) == 1) && result;
        
        //update g_e_obj_residual_cl
        result = (databaseService.modAiDisinfectionInit("g_e_obj_residual_cl", disinfectionPre.getG_e_obj_residual_cl(), processStep, disinfectionStep) == 1) && result;
        
        // send control value to kafka ai_control
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        LinkedHashMap<String, Object> controlMap;
        ObjectMapper objectMapper = new ObjectMapper();

        //전차염 INIT 테이블 목록 조회
        List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep, disinfectionStep);
        log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

        try {
            
        	for(AiProcessInitDTO dto : aiDisinfectionInitList) {
        		
        		// 전차염 최대 주입률
                if(dto.getItm().equalsIgnoreCase("g_pre_set_max") == true) {
                    
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPre.getG_pre_set_max());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
                
                // 전차염 최소 주입률
                else if(dto.getItm().equalsIgnoreCase("g_pre_set_min") == true) {
                    
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPre.getG_pre_set_min());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
                
                // 전차염 보정주기
                else if(dto.getItm().equalsIgnoreCase("g_pre_calib_cycle") == true) {
                    
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPre.getG_pre_calib_cycle());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
                
                // 전차염 1회 변경 주입률
                else if(dto.getItm().equalsIgnoreCase("g_pre_chg_limit_for_onetime") == true) {
                    
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPre.getG_pre_chg_limit_for_onetime());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
                
            	// 전차염 침전지 목표 잔류염소 값을 설정하여 Kafka 전송
                else if(dto.getItm().equalsIgnoreCase("g_e_obj_residual_cl") == true) {

                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPre.getG_e_obj_residual_cl());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
                
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/pre API");
            String strErrorBody = "{\"reason\":\"ai_disinfection_init(pre) update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(중) 알고리즘 설정값 변경
     * 
     * @param disinfectionPeri  Front-end 소독 중염소 알고리즘 설정값을 저장하기 위한
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/peri/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPeriControlDisinfection(@RequestBody InterfaceDisinfectionPeriDTO disinfectionPeri, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("putPeriControlDisinfection, peri:[{}]", disinfectionPeri);
        
        boolean result = true;
        
        //update g_peri_set_max 
        result = (databaseService.modAiDisinfectionInit("g_peri_set_max", disinfectionPeri.getG_peri_set_max(), processStep, disinfectionStep) == 1) && result;
        
        //update g_peri_set_min
        result = (databaseService.modAiDisinfectionInit("g_peri_set_min", disinfectionPeri.getG_peri_set_min(), processStep, disinfectionStep) == 1) && result;
        
        //update g_peri_calib_cycle
        result = (databaseService.modAiDisinfectionInit("g_peri_calib_cycle", disinfectionPeri.getG_peri_calib_cycle(), processStep, disinfectionStep) == 1) && result;
        
        //update g_peri_chg_limit_for_onetime
        result = (databaseService.modAiDisinfectionInit("g_peri_chg_limit_for_onetime", disinfectionPeri.getG_peri_chg_limit_for_onetime(), processStep, disinfectionStep) == 1) && result;
        
        //update g_e_obj_residual_cl
        result = (databaseService.modAiDisinfectionInit("g_e_obj_residual_cl", disinfectionPeri.getG_e_obj_residual_cl(), processStep, disinfectionStep) == 1) && result;
        
        //update g_f_out_residual_cl_min
        result = (databaseService.modAiDisinfectionInit("g_f_out_residual_cl_min", disinfectionPeri.getG_f_out_residual_cl_min(), processStep, disinfectionStep) == 1) && result;
        
        //update g_e_residual_cl_holding
        result = (databaseService.modAiDisinfectionInit("g_e_residual_cl_holding", disinfectionPeri.getG_e_residual_cl_holding(), processStep, disinfectionStep) == 1) && result;
        
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        LinkedHashMap<String, Object> controlMap;
        ObjectMapper objectMapper = new ObjectMapper();

        List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep, disinfectionStep);
        log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());
        
        try {
            for(AiProcessInitDTO dto : aiDisinfectionInitList) {
            	
                if(dto.getItm().equalsIgnoreCase("g_peri_set_max") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_peri_set_max());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                
                } else if(dto.getItm().equalsIgnoreCase("g_peri_set_min") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_peri_set_min());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                
                } else if(dto.getItm().equalsIgnoreCase("g_peri_calib_cycle") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_peri_calib_cycle());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                
                } else if(dto.getItm().equalsIgnoreCase("g_peri_chg_limit_for_onetime") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_peri_chg_limit_for_onetime());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                
                } else if(dto.getItm().equalsIgnoreCase("g_e_obj_residual_cl") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_e_obj_residual_cl());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                } else if(dto.getItm().equalsIgnoreCase("g_f_out_residual_cl_min") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_f_out_residual_cl_min());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                } else if(dto.getItm().equalsIgnoreCase("g_e_residual_cl_holding") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPeri.getG_e_residual_cl_holding());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
            }
            
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/peri API");
            String strErrorBody = "{\"reason\":\"ai_disinfection_init(peri) update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(후) 알고리즘 설정값 변경
     * 
     * @param disinfectionPost  Front-end 소독 후염소 알고리즘 설정값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/post/{processStep}/{disinfectionStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPostControlDisinfection(@RequestBody InterfaceDisinfectionPostDTO disinfectionPost, @PathVariable int processStep, @PathVariable int disinfectionStep)
    {
        log.debug("putPostControlDisinfection, post:[{}]", disinfectionPost);
        
        boolean result = true;

        //update g_post_set_max 
        result = (databaseService.modAiDisinfectionInit("g_post_set_max", disinfectionPost.getG_post_set_max(), processStep, disinfectionStep) == 1) && result;

        //update g_post_set_min
        result = (databaseService.modAiDisinfectionInit("g_post_set_min", disinfectionPost.getG_post_set_min(), processStep, disinfectionStep) == 1) && result;

        //update g_post_calib_cycle
        result = (databaseService.modAiDisinfectionInit("g_post_calib_cycle", disinfectionPost.getG_post_calib_cycle(), processStep, disinfectionStep) == 1) && result;

        //update g_post_chg_limit_for_onetime
        result = (databaseService.modAiDisinfectionInit("g_post_chg_limit_for_onetime", disinfectionPost.getG_post_chg_limit_for_onetime(), processStep, disinfectionStep) == 1) && result;

        //update g_h_obj_residual_cl
        result = (databaseService.modAiDisinfectionInit("g_h_obj_residual_cl", disinfectionPost.getG_h_obj_residual_cl(), processStep, disinfectionStep) == 1) && result;
        
        //update g_post_calib_num
        result = (databaseService.modAiDisinfectionInit("g_post_calib_num", disinfectionPost.getG_post_calib_num(), processStep, disinfectionStep) == 1) && result;
        
        //update g_h_in_residual_cl_holding
        result = (databaseService.modAiDisinfectionInit("g_h_in_residual_cl_holding", disinfectionPost.getG_h_in_residual_cl_holding(), processStep, disinfectionStep) == 1) && result;
        
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        LinkedHashMap<String, Object> controlMap;
        ObjectMapper objectMapper = new ObjectMapper();

        List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep, disinfectionStep);
        log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());
        
        try {
        	
            for(AiProcessInitDTO dto : aiDisinfectionInitList) {
            	
                if(dto.getItm().equalsIgnoreCase("g_post_set_max") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_post_set_max());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    
                } else if(dto.getItm().equalsIgnoreCase("g_post_set_min") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_post_set_min());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    
                } else if(dto.getItm().equalsIgnoreCase("g_post_calib_cycle") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_post_calib_cycle());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    
                } else if(dto.getItm().equalsIgnoreCase("g_post_chg_limit_for_onetime") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_post_chg_limit_for_onetime());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    
                } else if(dto.getItm().equalsIgnoreCase("g_h_obj_residual_cl") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_h_obj_residual_cl());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                } else if(dto.getItm().equalsIgnoreCase("g_post_calib_num") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_post_calib_num());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                } else if(dto.getItm().equalsIgnoreCase("g_h_in_residual_cl_holding") == true) {
                    controlMap = new LinkedHashMap<>();
                    controlMap.put("tag", dto.getTag_sn());
                    controlMap.put("value", disinfectionPost.getG_h_in_residual_cl_holding());
                    controlMap.put("time", strDate);

                    String strBody = objectMapper.writeValueAsString(controlMap);
                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                }
            }
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/post API");
            String strErrorBody = "{\"reason\":\"ai_disinfection_init(post) update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
        
        return new ResponseEntity<>("", HttpStatus.OK);
    }
    
    /**
     * 2단계생활 전차염 시간대별 주입률 설정
     * 
     * @param disinfectionPre Front-end 시간대별 주입률 설정값을 저장하기 위한 DTO
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/cholrate", method = RequestMethod.PUT)
    public ResponseEntity<String> putDisinfectionCholrateControl(@RequestBody InterfaceDisinfectionPreDTO disinfectionPre) {
        log.debug("putDisinfectionCholrateControl, pre:[{}]", disinfectionPre);

        boolean result = true;
        
        // g_pre_max_limit_0 ~ g_pre_max_limit_23
        // g_pre_min_limit_0 ~ g_pre_min_limit_23 반복 처리
        for (int i = 0; i < 24; i++) {
            try {
                // g_pre_max_limit
                float maxLimit = (float) InterfaceDisinfectionPreDTO.class.getDeclaredMethod("getG_pre_max_limit_" + i).invoke(disinfectionPre);
                result = (databaseService.modAiDisinfectionInit("g_pre_max_limit_" + i, maxLimit, 1, 1) == 1) && result;
                
                // g_pre_min_limit
                float minLimit = (float) InterfaceDisinfectionPreDTO.class.getDeclaredMethod("getG_pre_min_limit_" + i).invoke(disinfectionPre);
                result = (databaseService.modAiDisinfectionInit("g_pre_min_limit_" + i, minLimit, 1, 1) == 1) && result;
            } catch (IllegalAccessException e) {
                log.error("Error during reflection", e);
                return new ResponseEntity<>("{\"reason\":\"ai_update_fail\"}", HttpStatus.BAD_REQUEST);
			} catch (IllegalArgumentException e) {
                log.error("Error during reflection", e);
                return new ResponseEntity<>("{\"reason\":\"ai_update_fail\"}", HttpStatus.BAD_REQUEST);
			} catch (InvocationTargetException e) {
                log.error("Error during reflection", e);
                return new ResponseEntity<>("{\"reason\":\"ai_update_fail\"}", HttpStatus.BAD_REQUEST);
			} catch (NoSuchMethodException e) {
                log.error("Error during reflection", e);
                return new ResponseEntity<>("{\"reason\":\"ai_update_fail\"}", HttpStatus.BAD_REQUEST);
			} catch (SecurityException e) {
                log.error("Error during reflection", e);
                return new ResponseEntity<>("{\"reason\":\"ai_update_fail\"}", HttpStatus.BAD_REQUEST);
			}
        }
        
        if (result == true) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_pre_g2_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }
}
