package co.irexnet.waio.WAIO_ServerAgent.controller;

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
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.CommonValue;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@RestController
@EnableSwagger2
@Slf4j
public class DisinfectionController {
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
    @RequestMapping(value = "/disinfection/latest/{disinfectionIndex}/{processStep}", method = RequestMethod.GET)
    public ResponseEntity<String> getLatestDisinfection(@PathVariable int disinfectionIndex,
            @PathVariable int processStep) {
        log.debug("Recv getLatestDisinfection");

        // 실시간 데이터 태이블에서 최근 값을 조회하기 위해 오늘 날짜의 PartitionName 설정
        Calendar calendarToday = Calendar.getInstance();
        calendarToday.set(Calendar.MINUTE, 0);
        calendarToday.set(Calendar.SECOND, 0);
        calendarToday.set(Calendar.HOUR_OF_DAY, 0);
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        String strPartitionName = partitionNameFormat.format(calendarToday.getTime());
        String oprMode = "";

        AiProcessInitDTO aiDisinfectionInit = null;
        if (disinfectionIndex == CommonValue.DISINFECTION_PRE_STEP) {
            oprMode = CommonValue.G_PRE_OPERATION_MODE; // 전차염
        } else if (disinfectionIndex == CommonValue.DISINFECTION_PERI_STEP) {
            oprMode = CommonValue.G_PERI_OPERATION_MODE; // 중차염
        } else if (disinfectionIndex == CommonValue.DISINFECTION_POST_STEP) {
            oprMode = CommonValue.G_POST_OPERATION_MODE; // 후차염
        }
        // 소독 상세조회 시, INIT 운영모드 조회
        aiDisinfectionInit = databaseService.getAiDisinfectionInit(oprMode, processStep, disinfectionIndex);
        if (disinfectionIndex == 1) {
            log.debug("getAiDisinfectionInit Step " + processStep + ". pre, result:[{}]",
                    aiDisinfectionInit != null ? 1 : 0);
        } else if (disinfectionIndex == 2) {
            log.debug("getAiDisinfectionInit Step " + processStep + ". peri, result:[{}]",
                    aiDisinfectionInit != null ? 1 : 0);
        } else if (disinfectionIndex == 3) {
            log.debug("getAiDisinfectionInit Step " + processStep + ". post, result:[{}]",
                    aiDisinfectionInit != null ? 1 : 0);
        }

        // get ai_disinfection_init : 소독 상세 화면 조회시 init 조회
        List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep,
                disinfectionIndex);
        log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

        // get ai_disinfection_realtime
        AiDisinfectionRealtimeDTO aiDisinfectionRealtime = databaseService
                .getLatestAiDisinfectionRealtimeValue(processStep, disinfectionIndex);
        log.debug("getLatestAiDisinfectionRealtimeValue, result:[{}]", aiDisinfectionRealtime != null ? 1 : 0);

        // get disinfection_realtime
        List<ProcessRealtimeDTO> disinfectionRealtime = databaseService
                .getLatestDisinfectionRealtimeValue(strPartitionName, processStep);
        log.debug("getLatestDisinfectionRealtimeValue, result:[{}]", disinfectionRealtime.size());

        // get tag_manage(disinfection)
        List<TagManageDTO> tagManageList = databaseService.getTagManageFromCode(CommonValue.PROCESS_DISINFECTION,
                processStep);
        log.debug("getTagManageFromCode:[{}], result:[{}]", CommonValue.PROCESS_DISINFECTION, tagManageList.size());

        if (aiDisinfectionRealtime != null) {
            // JSON 처리를 위한 ObjectMapper 선언
            ObjectMapper objectMapper = new ObjectMapper();

            // Make Response Body
            LinkedHashMap<String, Object> aiDisinfectionInfo = new LinkedHashMap<>();

            // update_time
            aiDisinfectionInfo.put("upd_ti", aiDisinfectionRealtime.getUpd_ti());
            aiDisinfectionInfo.put("g_tei", aiDisinfectionRealtime.getG_tei());

            switch (disinfectionIndex) {
                case 1:
                    aiDisinfectionInfo.put("pre_ai_opr", aiDisinfectionInit.getInit_val().intValue());
                    break;
                case 2:
                    aiDisinfectionInfo.put("peri_ai_opr", aiDisinfectionInit.getInit_val().intValue());
                    break;
                case 3:
                    aiDisinfectionInfo.put("post_ai_opr", aiDisinfectionInit.getInit_val().intValue());
                    break;
            }

            for (TagManageDTO tagManage : tagManageList) {
                for (ProcessRealtimeDTO dto : disinfectionRealtime) {
                    if (tagManage.getItm().equalsIgnoreCase("b_te") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 수온
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("b_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 원수 유입 유량
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("h_in_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수지 유입 유량
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("f1_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 여과지 1계열 유출 유량
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("f2_out_fr") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 여과지 2계열 유출 유량
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("h_ph") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수 탁도
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    } else if (tagManage.getItm().equalsIgnoreCase("h_tb") == true &&
                            tagManage.getTag_sn().equalsIgnoreCase(dto.getTag_sn()) == true) {
                        // 정수 pH
                        aiDisinfectionInfo.put(tagManage.getItm(), Float.parseFloat(dto.getTag_val()));
                        break;
                    }
                }
            }

            for (AiProcessInitDTO dto : aiDisinfectionInitList) {
                if (dto.getItm().equalsIgnoreCase("g_e_obj_residual_cl") == true) {
                    // 1계열 혼화지 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("d2_target_cl") == true) {
                    // 2계열 혼화지 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                }
                if (dto.getItm().equalsIgnoreCase("e1_target_cl") == true) {
                    // 1계열 침전지 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("e2_target_cl") == true) {
                    // 2계열 침전지 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_ser_trg_cl") == true) {
                    // 정수지 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre_set_max") == true) {
                    // 1계열 전염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre_set_min") == true) {
                    // 1계열 전염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre_chg_limit_for_onetime") == true) {
                    // 1계열 전염소 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre2_set_max") == true) {
                    // 2계열 전염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre2_set_min") == true) {
                    // 2계열 전염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre2_chg_limit_for_onetime") == true) {
                    // 2계열 전염소 주입률 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_pre_calib_cycle") == true) {
                    // 전염소 보정주기
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_e_residual_cl_holding") == true) {
                    // 침전지 잔류염소 홀딩 범위
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri_set_max") == true) {
                    // 1계열 중염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri_set_min") == true) {
                    // 1계열 중염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri_chg_limit_for_onetime") == true) {
                    // 1계열 중염소 주입률 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_f_out_obj_residual_cl") == true) {
                    // 여과지 유출 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri2_set_max") == true) {
                    // 2계열 중염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri2_set_min") == true) {
                    // 2계열 중염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri2_chg_limit_for_onetime") == true) {
                    // 2계열 중염소 주입률 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_1_set_max") == true) {
                    // 후염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_1_set_min") == true) {
                    // 후염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_2_set_max") == true) {
                    // 후염소 최대 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_2_set_min") == true) {
                    // 후염소 최소 주입률 설정
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_1_chg_limit_for_onetime") == true) {
                    // 후염소 주입률 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_2_chg_limit_for_onetime") == true) {
                    // 후염소 주입률 변경 한계치
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_1_calib_cycle") == true) {
                    // 후차염 1계열 보정 주기
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_2_calib_cycle") == true) {
                    // 후차염 2계열 보정 주기
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_h_in_1_obj_residual_cl") == true) {
                    // 후차염 1계열 정수지 유입 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_h_in_2_obj_residual_cl") == true) {
                    // 후차염 2계열 정수지 유입 목표 잔류염소
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_peri_calib_cycle") == true) {
                    // 중차염 보정주기
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if(dto.getItm().equalsIgnoreCase("g_f_out_residual_cl_holding") == true) {
                    // 여과지 유출 잔류염소 홀딩 범위
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_1_calib_num") == true) {
                    // 후차염 1계열 보정 상수
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_post_2_calib_num") == true) {
                    // 후차염 2계열 보정 주기
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                }  else if (dto.getItm().equalsIgnoreCase("g_h_in_1_residual_cl_holding") == true) {
                    // 후차염 1계열 정수지 유입 잔류염소 홀딩 범위
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                } else if (dto.getItm().equalsIgnoreCase("g_h_in_2_residual_cl_holding") == true) {
                    // 후차염 2계열 정수지 유입 잔류염소 홀딩 범위
                    aiDisinfectionInfo.put(dto.getItm(), dto.getInit_val());
                }

            }

            // 계열별 혼화지 잔류염소
            aiDisinfectionInfo.put("d1_cl", aiDisinfectionRealtime.getD1_cl());
            aiDisinfectionInfo.put("e_ser_cl", aiDisinfectionRealtime.getE_ser_cl());
            // 혼화지 잔류염소
            aiDisinfectionInfo.put("g_d_residual_cl", aiDisinfectionRealtime.getG_d_residual_cl());

            // 계열별 혼화지 유입 유량
            aiDisinfectionInfo.put("d1_in_fr", aiDisinfectionRealtime.getD1_in_fr());
            aiDisinfectionInfo.put("d_ser_in_fr", aiDisinfectionRealtime.getD_ser_in_fr());

            // 계열별 침전지 잔류염소
            aiDisinfectionInfo.put("e1_cl", aiDisinfectionRealtime.getE1_cl());
            aiDisinfectionInfo.put("d_ser_cl", aiDisinfectionRealtime.getD_ser_cl());

            // 정수지 유입 잔류염소
            aiDisinfectionInfo.put("h_in_cl", aiDisinfectionRealtime.getH_in_cl());

            // 정수지 유출 잔류염소
            aiDisinfectionInfo.put("h_out_cl", aiDisinfectionRealtime.getH_out_cl());

            // 계열별 전염소 주입률
            aiDisinfectionInfo.put("g_pre1_chlorination", aiDisinfectionRealtime.getG_pre1_chlorination());

            aiDisinfectionInfo.put("g_pre2_chlorination", aiDisinfectionRealtime.getG_pre2_chlorination());

            // 계열별 중염소 주입률
            aiDisinfectionInfo.put("g_peri_chol_rate", aiDisinfectionRealtime.getG_peri_chol_rate());

            // 중차염 여과지 계열별 유출 잔류염소
            aiDisinfectionInfo.put("g_f_out_1_residual_cl", aiDisinfectionRealtime.getG_f_out_1_residual_cl());

            aiDisinfectionInfo.put("g_f_out_2_residual_cl", aiDisinfectionRealtime.getG_f_out_2_residual_cl());

            // 후염소 주입률
            aiDisinfectionInfo.put("g_ser_inr", aiDisinfectionRealtime.getG_ser_inr());

            // 계열별 AI 전염소 보정값 예측
            aiDisinfectionInfo.put("ai_g_pre1_corrected", aiDisinfectionRealtime.getAi_g_pre1_corrected());

            aiDisinfectionInfo.put("ai_g_pre2_corrected", aiDisinfectionRealtime.getAi_g_pre2_corrected());

            // 계열별 AI 중염소 보정값 예측
            aiDisinfectionInfo.put("ai_g_peri1_corrected", aiDisinfectionRealtime.getAi_g_peri1_corrected());

            aiDisinfectionInfo.put("ai_g_peri2_corrected", aiDisinfectionRealtime.getAi_g_peri2_corrected());

            // AI 후염소 보정값 예측
            aiDisinfectionInfo.put("g_inr_crt", aiDisinfectionRealtime.getG_inr_crt());

            // 계열별 AI 전염소 증발량 예측
            aiDisinfectionInfo.put("ai_g_pre1_evaporation", aiDisinfectionRealtime.getAi_g_pre1_evaporation());

            aiDisinfectionInfo.put("g_ser_cl_eva", aiDisinfectionRealtime.getG_ser_cl_eva());

            // 계열별 AI 전염소 주입률 예측
            aiDisinfectionInfo.put("ai_g_chol_rate", aiDisinfectionRealtime.getAi_g_chol_rate());

            aiDisinfectionInfo.put("ai_g_pre2_chlorination", aiDisinfectionRealtime.getAi_g_pre2_chlorination());

            // 계열별 AI 중염소 주입률 예측
            aiDisinfectionInfo.put("ai_g_peri1_chlorination", aiDisinfectionRealtime.getAi_g_peri1_chlorination());

            aiDisinfectionInfo.put("ai_g_peri2_chlorination", aiDisinfectionRealtime.getAi_g_peri2_chlorination());

            // 계열별 AI 후염소 주입률 예측
            aiDisinfectionInfo.put("ai_g_post1_chlorination", aiDisinfectionRealtime.getAi_g_post1_chlorination());

            aiDisinfectionInfo.put("ai_g_post2_chlorination", aiDisinfectionRealtime.getAi_g_post2_chlorination());

            // 정수지 유입잔류염소
            aiDisinfectionInfo.put("g_h_in_1_residual_cl", aiDisinfectionRealtime.getG_h_in_1_residual_cl());

            aiDisinfectionInfo.put("g_h_in_2_residual_cl", aiDisinfectionRealtime.getG_h_in_2_residual_cl());

            // 후차염 1계열 주입률
            aiDisinfectionInfo.put("g_post_1_chol_rate", aiDisinfectionRealtime.getG_post_1_chol_rate());

            // 후차염 2계열 주입률
            aiDisinfectionInfo.put("g_post_2_chol_rate", aiDisinfectionRealtime.getG_post_2_chol_rate());

            // 계열별 AI 후염소 주입률 예측
            aiDisinfectionInfo.put("ai_g_1_chol_rate", aiDisinfectionRealtime.getAi_g_1_chol_rate());
            aiDisinfectionInfo.put("ai_g_2_chol_rate", aiDisinfectionRealtime.getAi_g_2_chol_rate());
            // AI 후염소 주입률 예측
            aiDisinfectionInfo.put("ai_g_ser_inr", aiDisinfectionRealtime.getAi_g_ser_inr());

            aiDisinfectionInfo.put("ai_g_1_correct_degree", aiDisinfectionRealtime.getAi_g_1_correct_degree()); // 후차염
                                                                                                                // 1계열
                                                                                                                // 이전
                                                                                                                // 주입률
                                                                                                                // 보정예측
            // if(processStep == 2 && disinfectionIndex ==
            // CommonValue.DISINFECTION_POST_STEP) {
            // aiDisinfectionInfo.put("g1_pump_run",
            // aiDisinfectionRealtime.getG_1_pump_1_run() == 1 ? "1호기" : "2호기");
            // aiDisinfectionInfo.put("g2_pump_run",
            // aiDisinfectionRealtime.getG_2_pump_1_run() == 1 ? "1호기" : "2호기");
            // } else {
            // aiDisinfectionInfo.put("g_pump_run", aiDisinfectionRealtime.getG_pump_1_run()
            // == 1 ? "1호기" : "2호기");
            // }

            aiDisinfectionInfo.put("g_pump_1_run", aiDisinfectionRealtime.getG_pump_1_run());
            aiDisinfectionInfo.put("g_pump_2_run", aiDisinfectionRealtime.getG_pump_2_run());
            aiDisinfectionInfo.put("g_1_pump_1_run", aiDisinfectionRealtime.getG_1_pump_1_run());
            aiDisinfectionInfo.put("g_1_pump_2_run", aiDisinfectionRealtime.getG_1_pump_2_run());
            aiDisinfectionInfo.put("g_2_pump_1_run", aiDisinfectionRealtime.getG_2_pump_1_run());
            aiDisinfectionInfo.put("g_2_pump_2_run", aiDisinfectionRealtime.getG_2_pump_2_run());

            aiDisinfectionInfo.put("g_e_1_residual_cl", aiDisinfectionRealtime.getG_e_1_residual_cl());
            aiDisinfectionInfo.put("g_e_2_residual_cl", aiDisinfectionRealtime.getG_e_2_residual_cl());
            
            //주입 후 경과시간
            aiDisinfectionInfo.put("g_elapsed_time", aiDisinfectionRealtime.getG_elapsed_time());    
            //후차염 1계열 주입 후 경과시간
            aiDisinfectionInfo.put("g_1_elapsed_time", aiDisinfectionRealtime.getG_1_elapsed_time());    
            //후차염 2계열 주입 후 경과시간
            aiDisinfectionInfo.put("g_2_elapsed_time", aiDisinfectionRealtime.getG_2_elapsed_time());    

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("latest", aiDisinfectionInfo);

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
            String strErrorBody = "{\"reason\":\"Empty ai_disinfection\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 전염소 주입률 측정 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/pre/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPreHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getPreHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList = databaseService
                .getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionIndex);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());
        if (aiDisinfectionRealtimeList.size() > 0) {
            // Make Response Body
            LinkedHashMap<String, Object> seriesPreInfo = new LinkedHashMap<>();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate;

            // aiDisinfectionRealtimeList에서 계열별 전염소 주입률을 조회하여 series1PreMap, series2PreMap에
            // 등록
            LinkedHashMap<String, Float> series1PreMap = new LinkedHashMap<>();
            LinkedHashMap<String, Float> series2PreMap = new LinkedHashMap<>();
            for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
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
            try {
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
     * 전염소 증발량 예측 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/evaporation/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getEvaporationHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getEvaporationHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
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

            ObjectMapper objectMapper = new ObjectMapper();

            // aiDisinfectionRealtimeList에서 계열별 전염소 증발량을 조회하여 series1, series2에 등록
            for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());
                series1.put(strDate, dto.getAi_g_pre1_evaporation());
                series2.put(strDate, dto.getG_ser_cl_eva());
            }

            // pre_evaporation에 series1, series2 등록
            LinkedHashMap<String, Object> pre_evaporation = new LinkedHashMap<>();
            pre_evaporation.put("series1", series1);
            pre_evaporation.put("series2", series2);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("pre_evaporation", pre_evaporation);

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
    //

    /**
     * 여과지 유출 잔류염소 트렌드 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/residual/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getResidualHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getResidualHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
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

            ObjectMapper objectMapper = new ObjectMapper();

            // aiDisinfectionRealtimeList에서 계열별 여과지 유출 잔류염소 조회하여 series1, series2에 등록
            if(disinfectionIndex == 2) { //중차염 - 여과지 유출 잔류염소
                for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                    String strDate = simpleDateFormat.format(dto.getUpd_ti());
                    series1.put(strDate, dto.getG_f_out_1_residual_cl());
                    series2.put(strDate, dto.getG_f_out_2_residual_cl());
                }
            }else { //후차염 - 정수지 유입 잔류염소
                for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                    String strDate = simpleDateFormat.format(dto.getUpd_ti());
                    series1.put(strDate, dto.getG_h_in_1_residual_cl());
                    series2.put(strDate, dto.getG_h_in_2_residual_cl());
                }
            }


            // pre_evaporation에 series1, series2 등록
            LinkedHashMap<String, Object> pre_evaporation = new LinkedHashMap<>();
            pre_evaporation.put("series1", series1);
            pre_evaporation.put("series2", series2);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("residual", pre_evaporation);

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
     * 주입률 예측 이력 조회
     * 
     * @param dateSearchDTO     Front-end 시간 검색 값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/history/cholrate/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> getPostCorrectedHistoryDisinfection(@RequestBody InterfaceDateSearchDTO dateSearchDTO,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("getPostCorrectedHistoryDisinfection, start:[{}], end:[{}]", dateSearchDTO.getStart_time(),
                dateSearchDTO.getEnd_time());

        // 소독 공정 데이터 조회
        List<AiDisinfectionRealtimeDTO> aiDisinfectionRealtimeList = databaseService
                .getAiDisinfectionRealtimeValueFromUpdateTime(dateSearchDTO, processStep, disinfectionIndex);
        log.debug("getAiDisinfectionRealtimeValueFromUpdateTime, result:[{}]", aiDisinfectionRealtimeList.size());

        if (aiDisinfectionRealtimeList.size() > 0) {
            // Make Response Body
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            LinkedHashMap<String, Object> cholrate = new LinkedHashMap<>();
            LinkedHashMap<String, Object> series1 = new LinkedHashMap<>();
            LinkedHashMap<String, Object> series2 = new LinkedHashMap<>();

            // aiDisinfectionRealtimeList에서 주입률 예측을 조회하여 corrected에 등록
            for (AiDisinfectionRealtimeDTO dto : aiDisinfectionRealtimeList) {
                String strDate = simpleDateFormat.format(dto.getUpd_ti());

                if (disinfectionIndex == 3) {
                    series1.put(strDate, dto.getAi_g_1_correct_degree()); // 후차염 1계열 이전 주입률 보정예측
                    series2.put(strDate, dto.getAi_g_2_correct_degree()); // 후차염 2계열 이전 주입률 보정예측

                    cholrate.put("series1", series1);
                    cholrate.put("series2", series2);
                } else {
                    cholrate.put(strDate, dto.getAi_g_chol_rate());
                }
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("cholrate", cholrate);

            // ObjectMapper를 통해 JSON 값을 String으로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String strBody;
            try {
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
     * 소독(전) 공정 제어모드 변경
     * 
     * @param operationMode     제어모드
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/operation/pre/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPreDisinfection(
            @RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep,
            @PathVariable int disinfectionIndex) {
        log.info("putOperationControlPreDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
        // log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
        // databaseService.modAiDisinfectionOperationMode(nOperationMode),
        // nOperationMode);

        // update operation mode
        databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, disinfectionIndex);
        
        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE,
                processStep, disinfectionIndex);
        log.debug("getAiDisinfectionInit pre, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiDisinfectionInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiDisinfectionInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 소독(전) 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("g_pre_operation_mode_a") == true && CommonValue.PROCESS_DISINFECTION
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
        		log.error("Does not exist aiDisinfectionInit:[{}]", CommonValue.G_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
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
    @RequestMapping(value = "/disinfection/control/operation/peri/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPeriDisinfection(
            @RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep,
            @PathVariable int disinfectionIndex) {
        log.info("putOperationControlPeriDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
        // log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
        // databaseService.modAiDisinfectionOperationMode(nOperationMode),
        // nOperationMode);

        // update operation mode
        databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, disinfectionIndex);
        
        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE,
                processStep, disinfectionIndex);
        log.debug("getAiDisinfectionInit peri, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiDisinfectionInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiDisinfectionInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 소독(중) 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("g_peri_operation_mode_a") == true && CommonValue.PROCESS_DISINFECTION
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
        		log.error("Does not exist aiDisinfectionInit:[{}]", CommonValue.G_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in /disinfection/control/operation/peri API");
        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    /**
     * 소독(후) 공정 제어모드 변경
     * 
     * @param operationMode     공정모드
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/operation/post/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putOperationControlPostDisinfection(
            @RequestBody InterfaceOperationModeDTO operationMode, @PathVariable int processStep,
            @PathVariable int disinfectionIndex) {
        log.info("putOperationControlPostDisinfection, mode:[{}]", operationMode.getOperation());

        // 잘못된 제어모드 값 검사
        int nOperationMode = operationMode.getOperation();
        if (nOperationMode < CommonValue.OPERATION_MODE_MANUAL
                || nOperationMode > CommonValue.OPERATION_MODE_FULL_AUTO) {
            log.error("Invalid operation mode:[{}]", nOperationMode);

            String strErrorBody = "{\"reason\":\"Invalid operation mode\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }

        // Update ai_disinfection_init's operation_mode
        // log.debug("update aiDisinfectionOperationMode:[{}], mode:[{}]",
        // databaseService.modAiDisinfectionOperationMode(nOperationMode),
        // nOperationMode);
        
        // update operation mode
        databaseService.modAiDisinfectionOperationMode(nOperationMode, processStep, disinfectionIndex);

        // send control value to kafka ai_control(g_operation_mode)
        AiProcessInitDTO aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE,
                processStep, disinfectionIndex);
        log.debug("getAiDisinfectionInit post, result:[{}]", aiDisinfectionInit != null ? 1 : 0);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String strDate = simpleDateFormat.format(new Date().getTime());

        try {
        	if(aiDisinfectionInit != null) {
	            // Kafka에 전송할 값 정의
	            LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
	            controlMap.put("tag", aiDisinfectionInit.getTag_sn());
	            controlMap.put("value", nOperationMode);
	            controlMap.put("time", strDate);
	
	            // ObjectMapper를 통해 JSON 값을 String으로 변환하여 Kafka 전송
	            ObjectMapper objectMapper = new ObjectMapper();
	            String strBody = objectMapper.writeValueAsString(controlMap);
	            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
	            log.info("send to kafka:[{}]", strBody);
	
	            // Kafka에 소독(후) 공정 제어모드 변경 알람 전송
	            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
	            for (TagManageDTO dto : tagManageList) {
	                if (dto.getItm().equalsIgnoreCase("g_post_operation_mode_a") == true && CommonValue.PROCESS_DISINFECTION
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
        		log.error("Does not exist aiDisinfectionInit:[{}]", CommonValue.G_OPERATION_MODE);
        	}
        } catch (JsonProcessingException e) {
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
    @RequestMapping(value = "/disinfection/control/pre/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPreControlDisinfection(@RequestBody InterfaceDisinfectionPreDTO disinfectionPre,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("putPreControlDisinfection, pre:[{}]", disinfectionPre);

        boolean result = true;
        // update 전염소 최대 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_pre_set_max", disinfectionPre.getG_pre_set_max(),
                processStep, disinfectionIndex) == 1) && result;
        // update 전염소 최소 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_pre_set_min", disinfectionPre.getG_pre_set_min(),
                processStep, disinfectionIndex) == 1) && result;
        // update 보정주기
        result = (databaseService.modAiDisinfectionInit("g_pre_calib_cycle", disinfectionPre.getG_pre_calib_cycle(),
                processStep, disinfectionIndex) == 1) && result;
        // update 전염소 변경 한계치
        result = (databaseService.modAiDisinfectionInit("g_pre_chg_limit_for_onetime",
                disinfectionPre.getG_pre_chg_limit_for_onetime(), processStep, disinfectionIndex) == 1) && result;
        // update 혼화지 목표 잔류염소
        result = (databaseService.modAiDisinfectionInit("g_e_obj_residual_cl", disinfectionPre.getG_e_obj_residual_cl(),
                processStep, disinfectionIndex) == 1) && result;
        // update 침전지 잔류염소 홀딩 범위 
    	result = (databaseService.modAiDisinfectionInit("g_e_residual_cl_holding", disinfectionPre.getG_e_residual_cl_holding(),
    			processStep, disinfectionIndex) == 1) && result;        	


        // 업데이트가 성공하면 Kafka를 통해 설정값 전달
        if (result == true) {
            // send control value to kafka ai_control
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate = simpleDateFormat.format(new Date().getTime());

            LinkedHashMap<String, Object> controlMap;
            ObjectMapper objectMapper = new ObjectMapper();

            List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep,
                    disinfectionIndex);
            log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

            try {
                for (AiProcessInitDTO dto : aiDisinfectionInitList) {
                    if (dto.getItm().equalsIgnoreCase("g_e_obj_residual_cl") == true) {
                        // 1계열 혼화지 목표 잔류염소 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_e_obj_residual_cl());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_pre_calib_cycle") == true) {
                        // 보정주기 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_pre_calib_cycle());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_pre_chg_limit_for_onetime") == true) {
                        // 1계열 전염소 변경 한계치 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_pre_chg_limit_for_onetime());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_pre_set_max") == true) {
                        // 1계열 전염소 최대 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_pre_set_max());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_pre_set_min") == true) {
                        // 1계열 전염소 최소 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_pre_set_min());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_e_residual_cl_holding") == true) {
                        // 침전지 잔류염소 홀딩 범위 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPre.getG_e_residual_cl_holding());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    }
                    // else if(dto.getItm().equalsIgnoreCase("g_pre2_chg_limit_for_onetime") ==
                    // true)
                    // {
                    // // 2계열 전염소 변경 한계치 값을 설정하여 Kafka 전송
                    // controlMap = new LinkedHashMap<>();
                    // controlMap.put("tag", dto.getTag_sn());
                    // controlMap.put("value", disinfectionPre.getG_pre2_chg_limit_for_onetime());
                    // controlMap.put("time", strDate);

                    // String strBody = objectMapper.writeValueAsString(controlMap);
                    // kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    // }
                    // else if(dto.getItm().equalsIgnoreCase("g_pre2_set_max") == true)
                    // {
                    // // 2계열 전염소 최대 주입률 설정 값을 설정하여 Kafka 전송
                    // controlMap = new LinkedHashMap<>();
                    // controlMap.put("tag", dto.getTag_sn());
                    // controlMap.put("value", disinfectionPre.getG_pre2_set_max());
                    // controlMap.put("time", strDate);

                    // String strBody = objectMapper.writeValueAsString(controlMap);
                    // kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    // }
                    // else if(dto.getItm().equalsIgnoreCase("g_pre2_set_min") == true)
                    // {
                    // // 2계열 전염소 최소 주입률 설정 값을 설정하여 Kafka 전송
                    // controlMap = new LinkedHashMap<>();
                    // controlMap.put("tag", dto.getTag_sn());
                    // controlMap.put("value", disinfectionPre.getG_pre2_set_min());
                    // controlMap.put("time", strDate);

                    // String strBody = objectMapper.writeValueAsString(controlMap);
                    // kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    // }
                }
            } catch (JsonProcessingException e) {
                log.error("JsonProcessingException Occurred in /disinfection/control/pre API");
            }

            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_disinfection_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 소독(중) 알고리즘 설정값 변경
     * 
     * @param disinfectionPeri  Front-end 소독 중염소 알고리즘 설정값을 저장하기 위한
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/peri/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPeriControlDisinfection(@RequestBody InterfaceDisinfectionPeriDTO disinfectionPeri,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("putPeriControlDisinfection, peri:[{}]", disinfectionPeri);

        boolean result = true;

        // update 중염소 최대 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_peri_set_max", disinfectionPeri.getG_peri_set_max(),
                processStep, disinfectionIndex) == 1) && result;

        // update 중염소 최소 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_peri_set_min", disinfectionPeri.getG_peri_set_min(),
                processStep, disinfectionIndex) == 1) && result;

        // update 중염소 변경 한계치
        result = (databaseService.modAiDisinfectionInit("g_peri_chg_limit_for_onetime",
                disinfectionPeri.getG_peri_chg_limit_for_onetime(), processStep, disinfectionIndex) == 1) && result;

        // update 여과지 유출 목표 잔류염소
        result = (databaseService.modAiDisinfectionInit("g_f_out_obj_residual_cl",
                disinfectionPeri.getG_f_out_obj_residual_cl(), processStep, disinfectionIndex) == 1) && result;

        // update 중염소 보정주기 설정
        result = (databaseService.modAiDisinfectionInit("g_peri_calib_cycle", disinfectionPeri.getG_peri_calib_cycle(),
                processStep, disinfectionIndex) == 1) && result;

        // update 여과지 유출 잔류염소 홀딩 범위
        result = (databaseService.modAiDisinfectionInit("g_f_out_residual_cl_holding", disinfectionPeri.getG_f_out_residual_cl_holding(), processStep, disinfectionIndex) == 1) && result;

        // 업데이트가 성공하면 Kafka를 통해 설정값 전달
        if (result == true) {
            // send control value to kafka ai_control
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate = simpleDateFormat.format(new Date().getTime());

            LinkedHashMap<String, Object> controlMap;
            ObjectMapper objectMapper = new ObjectMapper();

            List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep,
                    disinfectionIndex);
            log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

            try {
                for (AiProcessInitDTO dto : aiDisinfectionInitList) {
                    if (dto.getItm().equalsIgnoreCase("g_f_out_obj_residual_cl") == true) {
                        // 1계열 혼화지 목표 잔류염소 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_f_out_obj_residual_cl());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_peri_chg_limit_for_onetime") == true) {
                        // 1계열 중염소 변경 한계치 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_peri_chg_limit_for_onetime());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_peri_set_max") == true) {
                        // 1계열 중염소 최대 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_peri_set_max());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_peri_calib_cycle") == true) {
                        // 1계열 중염소 보정주기 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_peri_calib_cycle());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_peri_set_min") == true) {
                        // 1계열 중염소 최소 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_peri_set_min());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if(dto.getItm().equalsIgnoreCase("g_f_out_residual_cl_holding") == true)
                    {
                        // 여과지 유출 잔류염소 홀딩 범위 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPeri.getG_f_out_residual_cl_holding());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    }
                }
            } catch (JsonProcessingException e) {
                log.error("JsonProcessingException Occurred in /disinfection/control/peri API");
            }

            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_disinfection_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 소독(후) 알고리즘 설정값 변경
     * 
     * @param disinfectionPost  Front-end 소독 후염소 알고리즘 설정값을 저장하기 위한 DTO
     * @param processStep       공정단계
     * @param disinfectionIndex 전차염: 1, 중차염: 2, 후차염: 3
     * @return ResponseEntity<String> 메시지
     */
    @RequestMapping(value = "/disinfection/control/post/{disinfectionIndex}/{processStep}", method = RequestMethod.PUT)
    public ResponseEntity<String> putPostControlDisinfection(@RequestBody InterfaceDisinfectionPostDTO disinfectionPost,
            @PathVariable int processStep, @PathVariable int disinfectionIndex) {
        log.debug("putPostControlDisinfection, post:[{}]", disinfectionPost);

        boolean result = true;

        // update 후염소 최대 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_post_1_set_max", disinfectionPost.getG_post_1_set_max(),
                processStep, disinfectionIndex) == 1) && result;
        // update 후염소 최소 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_post_1_set_min", disinfectionPost.getG_post_1_set_min(),
                processStep, disinfectionIndex) == 1) && result;
        // update 후염소 변경 한계치
        result = (databaseService.modAiDisinfectionInit("g_post_1_chg_limit_for_onetime",
                disinfectionPost.getG_post_1_chg_limit_for_onetime(), processStep, disinfectionIndex) == 1) && result;
        // update 정수지 유입 목표 잔류염소
        result = (databaseService.modAiDisinfectionInit("g_h_in_1_obj_residual_cl",
                disinfectionPost.getG_h_in_1_obj_residual_cl(), processStep, disinfectionIndex) == 1) && result;
        // update 보정주기
        result = (databaseService.modAiDisinfectionInit("g_post_1_calib_cycle",
                disinfectionPost.getG_post_1_calib_cycle(), processStep, disinfectionIndex) == 1) && result;
        // update 보정상수
        result = (databaseService.modAiDisinfectionInit("g_post_1_calib_num",
                disinfectionPost.getG_post_1_calib_num(), processStep, disinfectionIndex) == 1) && result;
        // update 정수지 유입 잔류염소 홀딩 범위
        result = (databaseService.modAiDisinfectionInit("g_h_in_1_residual_cl_holding",
                disinfectionPost.getG_h_in_1_residual_cl_holding(), processStep, disinfectionIndex) == 1) && result;

        // 2계열
        // update 후염소 최대 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_post_2_set_max", disinfectionPost.getG_post_2_set_max(),
                processStep, disinfectionIndex) == 1) && result;
        // update 후염소 최소 주입률 설정
        result = (databaseService.modAiDisinfectionInit("g_post_2_set_min", disinfectionPost.getG_post_2_set_min(),
                processStep, disinfectionIndex) == 1) && result;
        // update 후염소 변경 한계치
        result = (databaseService.modAiDisinfectionInit("g_post_2_chg_limit_for_onetime",
                disinfectionPost.getG_post_2_chg_limit_for_onetime(), processStep, disinfectionIndex) == 1) && result;
        // update 정수지 유입 목표 잔류염소
        result = (databaseService.modAiDisinfectionInit("g_h_in_2_obj_residual_cl",
                disinfectionPost.getG_h_in_2_obj_residual_cl(), processStep, disinfectionIndex) == 1) && result;
        // update 보정주기
        result = (databaseService.modAiDisinfectionInit("g_post_2_calib_cycle",
                disinfectionPost.getG_post_2_calib_cycle(), processStep, disinfectionIndex) == 1) && result;
        // update 보정상수
        result = (databaseService.modAiDisinfectionInit("g_post_2_calib_num",
                disinfectionPost.getG_post_2_calib_num(), processStep, disinfectionIndex) == 1) && result;
        // update 정수지 유입 잔류염소 홀딩 범위
        result = (databaseService.modAiDisinfectionInit("g_h_in_2_residual_cl_holding",
                disinfectionPost.getG_h_in_2_residual_cl_holding(), processStep, disinfectionIndex) == 1) && result;

        // 업데이트가 성공하면 Kafka를 통해 설정값 전달
        if (result == true) {
            // send control value to kafka ai_control
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate = simpleDateFormat.format(new Date().getTime());

            LinkedHashMap<String, Object> controlMap;
            ObjectMapper objectMapper = new ObjectMapper();

            List<AiProcessInitDTO> aiDisinfectionInitList = databaseService.getAllAiDisinfectionInit(processStep,
                    disinfectionIndex);
            log.debug("getAllAiDisinfectionInit, result:[{}]", aiDisinfectionInitList.size());

            try {
                for (AiProcessInitDTO dto : aiDisinfectionInitList) {
                    if (dto.getItm().equalsIgnoreCase("g_h_in_1_obj_residual_cl") == true) {
                        // 정수지 목표 잔류염소 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_h_in_1_obj_residual_cl());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    }
                    if (dto.getItm().equalsIgnoreCase("g_h_in_2_obj_residual_cl") == true) {
                        // 정수지 목표 잔류염소 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_h_in_2_obj_residual_cl());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_1_chg_limit_for_onetime") == true) {
                        // 후염소 변경 한계치 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_1_chg_limit_for_onetime());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_2_chg_limit_for_onetime") == true) {
                        // 후염소 변경 한계치 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_2_chg_limit_for_onetime());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_1_set_max") == true) {
                        // 후염소 최대 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_1_set_max());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_1_set_min") == true) {
                        // 후염소 최소 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_1_set_min());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_2_set_max") == true) {
                        // 후염소 최대 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_2_set_max());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_2_set_min") == true) {
                        // 후염소 최소 주입률 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_2_set_min());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_1_calib_cycle") == true) {
                        // 후염소 1계열 보정주기 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_1_calib_cycle());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_2_calib_cycle") == true) {
                        // 후염소 2계열 보정주기 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_2_calib_cycle());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_1_calib_num") == true) {
                        // 후염소 1계열 보정상수 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_1_calib_num());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_post_2_calib_num") == true) {
                        // 후염소 2계열 보정상수 설정 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_post_2_calib_num());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_h_in_1_residual_cl_holding") == true) {
                        // 후염소 1계열 정수지 유입 잔류염소 홀딩 범위 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_h_in_1_residual_cl_holding());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    } else if (dto.getItm().equalsIgnoreCase("g_h_in_2_residual_cl_holding") == true) {
                        // 후염소 2계열 정수지 유입 잔류염소 홀딩 범위 값을 설정하여 Kafka 전송
                        controlMap = new LinkedHashMap<>();
                        controlMap.put("tag", dto.getTag_sn());
                        controlMap.put("value", disinfectionPost.getG_h_in_2_residual_cl_holding());
                        controlMap.put("time", strDate);

                        String strBody = objectMapper.writeValueAsString(controlMap);
                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                    }
                }
            } catch (JsonProcessingException e) {
                log.error("JsonProcessingException Occurred in /disinfection/control/post API");
            }

            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            String strErrorBody = "{\"reason\":\"ai_disinfection_init update_fail\"}";
            return new ResponseEntity<>(strErrorBody, HttpStatus.BAD_REQUEST);
        }
    }

}
