package co.irexnet.waio.WAIO_ServerAgent.controller;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.*;
import co.irexnet.waio.WAIO_ServerAgent.dto.*;
import co.irexnet.waio.WAIO_ServerAgent.kafka.KafkaProducer;
import co.irexnet.waio.WAIO_ServerAgent.service.AlarmServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.service.MakeTagMapServiceImpl;
import co.irexnet.waio.WAIO_ServerAgent.util.*;
import co.irexnet.waio.WAIO_ServerAgent.vo.HadoopClusterInfoDTO;
import co.irexnet.waio.WAIO_ServerAgent.vo.HadoopClusterMetricsDTO;
import co.irexnet.waio.WAIO_ServerAgent.vo.HadoopJmxBeans;
import co.irexnet.waio.WAIO_ServerAgent.vo.SupervisorStateInfoDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@Slf4j
public class InternalController
{
    @Autowired
    PropertiesAuthentication propertiesAuthentication;

    @Autowired
    PropertiesControlCheck propertiesControlCheck;

    @Autowired
    PropertiesAlgorithmCheck propertiesAlgorithmCheck;

    @Autowired
    PropertiesStorage propertiesStorage;

    @Autowired
    PropertiesReceivingData propertiesReceivingData;

    @Autowired
    DatabaseServiceImpl databaseService;

    @Autowired
    AlarmServiceImpl alarmService;

    @Autowired
    AlarmInfoList alarmInfoList;

    @Autowired
    GlobalSystemConfig globalSystemConfig;

    @Autowired
    KafkaProducer kafkaProducer;
    
    @Autowired
    MakeTagMapServiceImpl tagMapService;

    @Autowired
    HttpSend httpSend;

    private Date sensorDate = null;
    private Date analysisDate = null;
    private Date daqDate = null;
    private Date controlDate = null;
    private Date alarmDate = null;
    private Date algorithmDate = null;
    private Date databaseDate = null;
    private Date realTimeDate = null;
    private Date aiOprRealTimeDate = null;

    private String lastCoagulants1 = "", lastCoagulants2 = "";

    private RequestConfig requestConfig = RequestConfig.custom()
            .setSocketTimeout(3 * CommonValue.ONE_SECOND)
            .setConnectTimeout(3 * CommonValue.ONE_SECOND)
            .setConnectionRequestTimeout(3 * CommonValue.ONE_SECOND)
            .build();

    /**
     * Kafka에 실시간 AI 예측값 전달
     * 
     * @param token
     */
    @RequestMapping(value = "/internal/sensors", method = RequestMethod.GET)
    public void getSensors(@RequestHeader("X-ACCESS-TOKEN") String token) {
    	
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false) {
            log.error("getSensors, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getSensor() initialization sensorDate before one hour
        if(sensorDate == null) {
            sensorDate = new Date();
            sensorDate.setTime(sensorDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.info("[internal] getSensors");
        
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - sensorDate.getTime() > CommonValue.ONE_MINUTE) {
            
        	sensorDate = new Date();
        	
        	/**
        	 * 태그 타입 2인 TAG MNG 목록 조회
        	 */
            List<TagManageDTO> tagManageList = databaseService.getTagManageFromType(CommonValue.TAG_MANAGE_TYPE_UI);
        	
        	//Receiving Process
            int receivingCnt = sendAiReceivingData(tagManageList);
            //Coagulant Process
            int coagulantCnt = sendAiCoagulantData(tagManageList);
            //Mixing Process
            int mixingCnt = sendAiMixingData(tagManageList);
            //Sedimentation Process
            int sedimentationCnt = sendAiSedimentationData(tagManageList);
            //Filter Process
            int filterCnt = sendAiFilterData(tagManageList);
            //Disinfection Process
            int disinfectionCnt = sendAiDisinfectionData(tagManageList);
            
            log.info("Send count, receiving:[{}], coagulant:[{}], mixing:[{}], sedimentation:[{}], filter:[{}], disinfection:[{}]",
                	receivingCnt,
                	coagulantCnt,
                	mixingCnt,
                	sedimentationCnt,
                	filterCnt,
                	disinfectionCnt
                );
        }
    }

    /**
     * 5분 이상 RT 테이블 미적재시 시스템 통신 연결 알람(팝업창) 발생
     * 
     * @param token
     */
    @RequestMapping(value = "/internal/realTime", method = RequestMethod.GET)
    public void getRealTime(@RequestHeader("X-ACCESS-TOKEN") String token) {
    	// Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false) {
            log.error("getRealTime, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }
        
        // If first call getRealTime() initialization realTimeDate before one hour
        if(realTimeDate == null) {
        	realTimeDate = new Date();
        	realTimeDate.setTime(realTimeDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.debug("[internal] getRealTime");
        
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - realTimeDate.getTime() > CommonValue.ONE_MINUTE) {
        	LocalDateTime today = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            // 실시간 RT테이블 조회
            List<InterfaceAlarmControlHistoryDTO> allRealTimeList = databaseService.getAllRealTime(today);

            String strBody;
            ObjectMapper objectMapper = new ObjectMapper();
            
            if (allRealTimeList.size() > 0) {
    	        InterfaceAlarmControlHistoryDTO dto = new InterfaceAlarmControlHistoryDTO();
    	        dto.setStart_time(Date.from(today.atZone(ZoneId.systemDefault()).toInstant()));
    	        dto.setAlm_id(129901);
    	
    	        // 최근 5분 알람 조회
    	        List<InterfaceAlarmControlHistoryDTO> alarmNotifyList = databaseService.getBeforeAlarmNotify(dto);
    	
    	        if (alarmNotifyList.size() == 0) {
    	            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
    	            String almCdNm = "system_"+CommonValue.ALARM_CODE_CONNECTION_ERROR;
    	            AlarmInfoDTO alarmInfo = alarmInfoList
    	                    .getAlarmInfoFromAlarmCode(almCdNm);
    	            if (alarmInfo != null) {
    	            	popupMap.put("alarm_id", alarmInfo.getAlm_id());
    	            	popupMap.put("message", alarmInfo.getDp_nm());
    	            	popupMap.put("url", alarmInfo.getUrl());
    	            	popupMap.put("time", today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    	            	try {
    	            		strBody = objectMapper.writeValueAsString(popupMap);
    	            		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);
    	            	} catch (JsonProcessingException e) {
    	            		log.error("JsonProcessingException");
    	            	}
    	            } else {
                        log.error("Does not exist alarmInfo:[{]]", almCdNm);
                    }
    	        }
    	    }
        }
    }
    
    /**
     * 1분에 한번씩 현재 운전모드를 체크하여 update
     * 
     * @param token
     */
    @RequestMapping(value = "/internal/aiOprRealTime", method = RequestMethod.GET)
    public void updateAiOprRealTime(@RequestHeader("X-ACCESS-TOKEN") String token) {
    	// Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false) {
            log.error("updateAiOprRealTime, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }
        
        // If first call updateAiOprRealTime() initialization aiOprRealTimeDate before one hour
        if(aiOprRealTimeDate == null) {
        	aiOprRealTimeDate = new Date();
        	aiOprRealTimeDate.setTime(aiOprRealTimeDate.getTime() - CommonValue.ONE_HOUR);
        }
        
        log.debug("[internal] updateAiOprRealTime");
        
        Date currentDate = new Date();
        if(currentDate.getTime() - aiOprRealTimeDate.getTime() > CommonValue.ONE_MINUTE) {
        	aiOprRealTimeDate = new Date();
        	
        	AiProcessInitDTO aiInit = new AiProcessInitDTO();
        
        	// 각 공정의 init 테이블 데이터 조회
        	for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
        		// 착수
	            aiInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, processStep);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_RECEIVING, CommonValue.NONE, aiInit.getInit_val().intValue());
	            // 약품
	            aiInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, processStep);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_COAGULANT, CommonValue.NONE, aiInit.getInit_val().intValue());
	            // 혼화응집
	            aiInit = databaseService.getAiMixingInit(CommonValue.D_OPERATION_MODE, processStep);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_MIXING, CommonValue.NONE, aiInit.getInit_val().intValue());
	            // 침전
	            aiInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE, processStep);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_SEDIMENTATION, CommonValue.NONE, aiInit.getInit_val().intValue());
	            // 여과
            	aiInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, processStep);
            	databaseService.modAiOprRealTime(CommonValue.PROCESS_FILTER, CommonValue.NONE, aiInit.getInit_val().intValue());
	            // 전차염
	            aiInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE, processStep, CommonValue.DISINFECTION_PRE_STEP);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_DISINFECTION, CommonValue.DISINFECTION_PRE, aiInit.getInit_val().intValue());
	            // 중차염
	            aiInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE, processStep, CommonValue.DISINFECTION_PERI_STEP);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_DISINFECTION, CommonValue.DISINFECTION_PERI, aiInit.getInit_val().intValue());
	            // 후차염
	            aiInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE, processStep, CommonValue.DISINFECTION_POST_STEP);
	            databaseService.modAiOprRealTime(CommonValue.PROCESS_DISINFECTION, CommonValue.DISINFECTION_POST, aiInit.getInit_val().intValue());
        	}
        }
    }
    
    /**
     * 오늘 누적된 운전모드 운영시간을 이력 테이블에 적재(매일 자정에 실행)
     * 
     * @param token
     */
    @RequestMapping(value = "/internal/aiOprHistory", method = RequestMethod.GET)
    public void insertAiOprHistory(@RequestHeader("X-ACCESS-TOKEN") String token) {
        // Token Check
        if (propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false) {
            log.error("insertAiOprHistory, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        log.debug("[internal] insertAiOprHistory");
        
        List<AiOprRealTimeDTO> aiOprRealTimeList = databaseService.getAllAiOprRealTime();
        List<AiOprHistoryDTO> aiOprHistoryList = new ArrayList<AiOprHistoryDTO>();
        
        Date todayDate = new Date();
        AiOprHistoryDTO aiOprHistoryDto = null;
        
        if (aiOprRealTimeList != null) {
        	for (AiOprRealTimeDTO aiOprRealTime : aiOprRealTimeList) {
        		aiOprHistoryDto = new AiOprHistoryDTO();
        		aiOprHistoryDto.setProc_cd(aiOprRealTime.getProc_cd());
        		aiOprHistoryDto.setDisinfection_index(aiOprRealTime.getDisinfection_index());
        		aiOprHistoryDto.setAi_opr(aiOprRealTime.getAi_opr());
        		aiOprHistoryDto.setHis_date(todayDate);
        		aiOprHistoryDto.setOpr_minutes(aiOprRealTime.getOpr_minutes());
        		aiOprHistoryList.add(aiOprHistoryDto);
        	}
        	// 이력 테이블에 적재
        	databaseService.addAiOprHistoryList(aiOprHistoryList);
        	
        	// TB_AI_OPR_RT테이블 리셋
        	databaseService.modAllAiOprRealTime();
        } else {
        	log.error("Does not exist aiOprRealTimeList");
        }
    }
    
    /**
     * 분석 서버 Check
     * @deprecated 미사용
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/analysis", method = RequestMethod.GET)
    public void getAnalysis(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("getAnalysis, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getAnalysis() initialization analysisDate before one hour
        if(analysisDate == null)
        {
            analysisDate = new Date();
            analysisDate.setTime(analysisDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.debug("[internal] getAnalysis");
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - analysisDate.getTime() > CommonValue.ONE_MINUTE)
        {
            analysisDate = new Date();

            // Resource Manager1 : [GET] cluster/info
            int nActiveState = CommonValue.ACTIVE_STATE_NONE;
            String strHaState, strActiveNodes;
            String strUri = "http://" + globalSystemConfig.getAnalysis1_ResourceManager() + "/ws/v1/cluster/info";
            HttpGet httpGet = new HttpGet(strUri);
            httpGet.setConfig(requestConfig);
            StringBuffer stringBuffer;
            ObjectMapper objectMapper = new ObjectMapper();

            HttpResponse response = httpSend.send(httpGet);
            if(response != null)
            {
                int nStatus = response.getStatusLine().getStatusCode();
                if(nStatus == HttpStatus.SC_OK)
                {
                    // 하둡 클러스터 정보 response에 대한 Parsing
                    stringBuffer = new StringBuffer();

                    BufferedReader bufferedReader = null;
                    InputStreamReader inputStreamReader = null;
                    try
                    {
                        inputStreamReader = new InputStreamReader(response.getEntity().getContent());
                        bufferedReader = new BufferedReader(inputStreamReader);

                        String strLine;
                        while((strLine = bufferedReader.readLine()) != null)
                        {
                            stringBuffer.append(strLine);
                        }

                        // ObjectMapper를 통해 하둡 클러스터 정보 저장
                        HadoopClusterInfoDTO clusterInfo = objectMapper.readValue(stringBuffer.toString(), HadoopClusterInfoDTO.class);
                        strHaState = clusterInfo.getClusterInfo().getHaState();
                        log.debug("clusterInfo1, haState:[{}]", strHaState);

                        if(strHaState.equalsIgnoreCase(CommonValue.HASTATE_ACTIVE) == true)
                        {
                            nActiveState = CommonValue.ACTIVE_STATE_FIRST;
                        }
                    }
                    catch(IOException e)
                    {
                        log.error("Invalid Body or BufferedReader...");
                        strHaState = CommonValue.HASTATE_ERROR;
                    }
                    finally
                    {
                        if(inputStreamReader != null)
                        {
                            try
                            {
                                inputStreamReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("inputStreamReader Close Exception occurred");
                            }
                        }
                        if(bufferedReader != null)
                        {
                            try
                            {
                                bufferedReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("bufferedReader Close Exception occurred");
                            }
                        }
                    }
                }
                else
                {
                    strHaState = CommonValue.HASTATE_ERROR;
                }
            }
            else
            {
                strHaState = CommonValue.HASTATE_ERROR;
            }

            // Insert system_monitoring(Hadoop Resource Manager)
            SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
            systemMonitoringDTO.setHost(CommonValue.ANALYSIS1_HOSTNAME);
            systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
            systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_RM);
            systemMonitoringDTO.setMntr_val(strHaState.toUpperCase());
            systemMonitoringDTO.setMntr_upd_ti(new Date());
            databaseService.addSystemMonitoring(systemMonitoringDTO);

            // Resource Manager2 : cluster/info
            strUri = "http://" + globalSystemConfig.getAnalysis2_ResourceManager() + "/ws/v1/cluster/info";
            httpGet = new HttpGet(strUri);
            httpGet.setConfig(requestConfig);

            response = httpSend.send(httpGet);
            if(response != null)
            {
                int nStatus = response.getStatusLine().getStatusCode();
                if(nStatus == HttpStatus.SC_OK)
                {
                    // 하둡 클러스터 정보 Response에 대한 Parsing
                    stringBuffer = new StringBuffer();

                    BufferedReader bufferedReader = null;
                    InputStreamReader inputStreamReader = null;
                    try
                    {
                        inputStreamReader = new InputStreamReader(response.getEntity().getContent());
                        bufferedReader = new BufferedReader(inputStreamReader);

                        String strLine;
                        while((strLine = bufferedReader.readLine()) != null)
                        {
                            stringBuffer.append(strLine);
                        }

                        // ObjectMapper를 통해 하둡 클러스터 정보 저장
                        HadoopClusterInfoDTO clusterInfo = objectMapper.readValue(stringBuffer.toString(), HadoopClusterInfoDTO.class);
                        strHaState = clusterInfo.getClusterInfo().getHaState();
                        log.debug("clusterInfo2, haState:[{}]", strHaState);

                        if(strHaState.equalsIgnoreCase(CommonValue.HASTATE_ACTIVE) == true)
                        {
                            nActiveState = CommonValue.ACTIVE_STATE_SECOND;
                        }
                    }
                    catch(IOException e)
                    {
                        log.error("Invalid Body or BufferedReader...");
                        strHaState = CommonValue.HASTATE_ERROR;
                    }
                    finally
                    {
                        if(inputStreamReader != null)
                        {
                            try
                            {
                                inputStreamReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("inputStreamReader Close Exception occurred");
                            }
                        }
                        if(bufferedReader != null)
                        {
                            try
                            {
                                bufferedReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("bufferedReader Close Exception occurred");
                            }
                        }
                    }
                }
                else
                {
                    strHaState = CommonValue.HASTATE_ERROR;
                }
            }
            else
            {
                strHaState = CommonValue.HASTATE_ERROR;
            }

            // Insert system_monitoring(Hadoop Resource Manager)
            systemMonitoringDTO = new SystemMonitoringDTO();
            systemMonitoringDTO.setHost(CommonValue.ANALYSIS2_HOSTNAME);
            systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
            systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_RM);
            systemMonitoringDTO.setMntr_val(strHaState.toUpperCase());
            systemMonitoringDTO.setMntr_upd_ti(new Date());
            databaseService.addSystemMonitoring(systemMonitoringDTO);

            // Resource Manager1 : cluster/metrics
            if(nActiveState > CommonValue.ACTIVE_STATE_NONE)
            {
                // ACTIVE Server의 주소로 요청
                String strHostname;
                if(nActiveState == CommonValue.ACTIVE_STATE_FIRST)
                {
                    strUri = "http://" + globalSystemConfig.getAnalysis1_ResourceManager() + "/ws/v1/cluster/metrics";
                    strHostname = CommonValue.ANALYSIS1_HOSTNAME;
                }
                else
                {
                    strUri = "http://" + globalSystemConfig.getAnalysis2_ResourceManager() + "/ws/v1/cluster/metrics";
                    strHostname = CommonValue.ANALYSIS2_HOSTNAME;
                }

                httpGet = new HttpGet(strUri);
                httpGet.setConfig(requestConfig);

                response = httpSend.send(httpGet);
                if(response != null)
                {
                    int nStatus = response.getStatusLine().getStatusCode();
                    if(nStatus == HttpStatus.SC_OK)
                    {
                        // Metric 정보 Response에 대한 Parsing
                        stringBuffer = new StringBuffer();

                        BufferedReader bufferedReader = null;
                        InputStreamReader inputStreamReader = null;
                        try
                        {
                            inputStreamReader = new InputStreamReader(response.getEntity().getContent());
                            bufferedReader = new BufferedReader(inputStreamReader);

                            String strLine;
                            while((strLine = bufferedReader.readLine()) != null)
                            {
                                stringBuffer.append(strLine);
                            }

                            // Cluster Metric 정보를 저장하여 active node 계산
                            HadoopClusterMetricsDTO clusterMetrics =
                                    objectMapper.readValue(stringBuffer.toString(), HadoopClusterMetricsDTO.class);

                            int nTemp = clusterMetrics.getClusterMetrics().getActiveNodes();
                            strActiveNodes = String.format("%d", nTemp);
                            log.debug("clusterMetrics, activeNodes:[{}]", clusterMetrics.getClusterMetrics().getActiveNodes());
                        }
                        catch(IOException e)
                        {
                            log.error("Invalid Body or BufferedReader...");
                            strActiveNodes = "-";
                        }
                        finally
                        {
                            if(inputStreamReader != null)
                            {
                                try
                                {
                                    inputStreamReader.close();
                                }
                                catch(IOException e)
                                {
                                    log.error("inputStreamReader Close Exception occurred");
                                }
                            }
                            if(bufferedReader != null)
                            {
                                try
                                {
                                    bufferedReader.close();
                                }
                                catch(IOException e)
                                {
                                    log.error("bufferedReader Close Exception occurred");
                                }
                            }
                        }
                    }
                    else
                    {
                        strActiveNodes = "-";
                    }
                }
                else
                {
                    strActiveNodes = "-";
                }

                // Insert system_monitoring(Node Manager)
                systemMonitoringDTO = new SystemMonitoringDTO();
                systemMonitoringDTO.setHost(strHostname);
                systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
                systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_NM);
                systemMonitoringDTO.setMntr_val(strActiveNodes);
                systemMonitoringDTO.setMntr_upd_ti(new Date());
                databaseService.addSystemMonitoring(systemMonitoringDTO);
            }
            else
            {
                // Insert alarm_notify & SCADA send
                alarmService.alarmNotify(
                        CommonValue.ALARM_CODE_ANALYSIS_OFF,
                        CommonValue.ANALYSIS1_HOSTNAME,
                        CommonValue.ALARM_VALUE_OFF,
                        true);
            }


            // NameNode, DataNode1 : jmx
            nActiveState = CommonValue.ACTIVE_STATE_NONE;
            strUri = "http://" + globalSystemConfig.getAnalysis1_NameNode() + "/jmx?qry=Hadoop:service=NameNode,name=FSNamesystem";
            httpGet = new HttpGet(strUri);
            httpGet.setConfig(requestConfig);

            response = httpSend.send(httpGet);
            if(response != null)
            {
                int nStatus = response.getStatusLine().getStatusCode();
                if(nStatus == HttpStatus.SC_OK)
                {
                    // JMX Response에 대한 Parsing
                    stringBuffer = new StringBuffer();
                    BufferedReader bufferedReader = null;
                    InputStreamReader inputStreamReader = null;
                    try
                    {
                        inputStreamReader = new InputStreamReader(response.getEntity().getContent());
                        bufferedReader = new BufferedReader(inputStreamReader);

                        String strLine;
                        while((strLine = bufferedReader.readLine()) != null)
                        {
                            stringBuffer.append(strLine);
                        }

                        // JMX 정보를 저장하고 data node 저장
                        HadoopJmxBeans jmxBeans = objectMapper.readValue(stringBuffer.toString(), HadoopJmxBeans.class);
                        strHaState = jmxBeans.getBeans().get(0).getTagHaSate();
                        int nTemp = jmxBeans.getBeans().get(0).getNumLiveDataNodes();
                        strActiveNodes = String.format("%d", nTemp);
                        log.debug("jmxBeans, HAState:[{}], NumLiveDataNodes:[{}]",
                                jmxBeans.getBeans().get(0).getTagHaSate(),
                                jmxBeans.getBeans().get(0).getNumLiveDataNodes());
                    }
                    catch(IOException e)
                    {
                        log.error("Invalid Body or BufferedReader...");
                        strHaState = CommonValue.HASTATE_ERROR;
                        strActiveNodes = "-";
                    }
                    finally
                    {
                        if(inputStreamReader != null)
                        {
                            try
                            {
                                inputStreamReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("inputStreamReader Close Exception occurred");
                            }
                        }
                        if(bufferedReader != null)
                        {
                            try
                            {
                                bufferedReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("bufferedReader Close Exception occurred");
                            }
                        }
                    }
                }
                else
                {
                    strHaState = CommonValue.HASTATE_ERROR;
                    strActiveNodes = "-";
                }
            }
            else
            {
                strHaState = CommonValue.HASTATE_ERROR;
                strActiveNodes = "-";
            }

            // Insert system_monitoring(Name Node)
            systemMonitoringDTO = new SystemMonitoringDTO();
            systemMonitoringDTO.setHost(CommonValue.ANALYSIS1_HOSTNAME);
            systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
            systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_NN);
            systemMonitoringDTO.setMntr_val(strHaState.toUpperCase());
            systemMonitoringDTO.setMntr_upd_ti(new Date());
            databaseService.addSystemMonitoring(systemMonitoringDTO);

            if(strHaState.equalsIgnoreCase(CommonValue.HASTATE_ACTIVE) == true)
            {
                nActiveState = CommonValue.ACTIVE_STATE_FIRST;

                // Insert system_monitoring
                systemMonitoringDTO = new SystemMonitoringDTO();
                systemMonitoringDTO.setHost(CommonValue.ANALYSIS1_HOSTNAME);
                systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
                systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_DN);
                systemMonitoringDTO.setMntr_val(strActiveNodes);
                systemMonitoringDTO.setMntr_upd_ti(new Date());
                databaseService.addSystemMonitoring(systemMonitoringDTO);
            }

            // NameNode, DataNode2 : jmx
            strUri = "http://" + globalSystemConfig.getAnalysis2_NameNode() + "/jmx?qry=Hadoop:service=NameNode,name=FSNamesystem";
            httpGet = new HttpGet(strUri);
            httpGet.setConfig(requestConfig);

            response = httpSend.send(httpGet);
            if(response != null)
            {
                int nStatus = response.getStatusLine().getStatusCode();
                if(nStatus == HttpStatus.SC_OK)
                {
                    // JMX Response에 대한 Parsing
                    stringBuffer = new StringBuffer();
                    BufferedReader bufferedReader = null;
                    InputStreamReader inputStreamReader = null;
                    try
                    {
                        inputStreamReader = new InputStreamReader(response.getEntity().getContent());
                        bufferedReader = new BufferedReader(inputStreamReader);

                        String strLine;
                        while((strLine = bufferedReader.readLine()) != null)
                        {
                            stringBuffer.append(strLine);
                        }

                        // JMX 정보를 저장하고 data node 저장
                        HadoopJmxBeans jmxBeans = objectMapper.readValue(stringBuffer.toString(), HadoopJmxBeans.class);
                        strHaState = jmxBeans.getBeans().get(0).getTagHaSate();
                        int nTemp = jmxBeans.getBeans().get(0).getNumLiveDataNodes();
                        strActiveNodes = String.format("%d", nTemp);
                        log.debug("jmxBeans, HAState:[{}], NumLiveDataNodes:[{}]",
                                jmxBeans.getBeans().get(0).getTagHaSate(),
                                jmxBeans.getBeans().get(0).getNumLiveDataNodes());
                    }
                    catch(IOException e)
                    {
                        log.error("Invalid Body or BufferedReader...");
                        strHaState = CommonValue.HASTATE_ERROR;
                        strActiveNodes = "-";
                    }
                    finally
                    {
                        if(inputStreamReader != null)
                        {
                            try
                            {
                                inputStreamReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("inputStreamReader Close Exception occurred");
                            }
                        }
                        if(bufferedReader != null)
                        {
                            try
                            {
                                bufferedReader.close();
                            }
                            catch(IOException e)
                            {
                                log.error("bufferedReader Close Exception occurred");
                            }
                        }
                    }
                }
                else
                {
                    strHaState = CommonValue.HASTATE_ERROR;
                    strActiveNodes = "-";
                }
            }
            else
            {
                strHaState = CommonValue.HASTATE_ERROR;
                strActiveNodes = "-";
            }

            // Insert system_monitoring(Name Node)
            systemMonitoringDTO = new SystemMonitoringDTO();
            systemMonitoringDTO.setHost(CommonValue.ANALYSIS2_HOSTNAME);
            systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
            systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_NN);
            systemMonitoringDTO.setMntr_val(strHaState.toUpperCase());
            systemMonitoringDTO.setMntr_upd_ti(new Date());
            databaseService.addSystemMonitoring(systemMonitoringDTO);

            if(strHaState.equalsIgnoreCase(CommonValue.HASTATE_ACTIVE) == true)
            {
                nActiveState = CommonValue.ACTIVE_STATE_SECOND;

                // Insert system_monitoring
                systemMonitoringDTO = new SystemMonitoringDTO();
                systemMonitoringDTO.setHost(CommonValue.ANALYSIS2_HOSTNAME);
                systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_ANALYSIS_DB);
                systemMonitoringDTO.setMntr_itm(CommonValue.HADOOP_DN);
                systemMonitoringDTO.setMntr_val(strActiveNodes);
                systemMonitoringDTO.setMntr_upd_ti(new Date());
                databaseService.addSystemMonitoring(systemMonitoringDTO);
            }

            // Name Node Active Check(Insert alarm_notify, same resource manager's alarm)
            if(nActiveState == CommonValue.ACTIVE_STATE_NONE)
            {
                // Insert alarm_notify & SCADA send
                alarmService.alarmNotify(
                        CommonValue.ALARM_CODE_ANALYSIS_OFF,
                        CommonValue.ANALYSIS1_HOSTNAME,
                        CommonValue.ALARM_VALUE_OFF,
                        true);
            }
        }
    }

    /**
     * 데이터 수집기 상태 확인
     * @deprecated 미사용
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/daq", method = RequestMethod.GET)
    public void getDaq(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("getDaq, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getDaq() initialization daqDate before one hour
        if(daqDate == null)
        {
            daqDate = new Date();
            daqDate.setTime(daqDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.debug("[internal] getDaq");
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - daqDate.getTime() > CommonValue.ONE_MINUTE)
        {
            daqDate = new Date();

            // 최근 5분 간 데이터 수집기 HealthCheck 이력을 조회하기 위한 Date 선언
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, -5);
            Date startTime = calendar.getTime();

            List<SystemMonitoringDTO> systemMonitoringList = databaseService.getLatestSystemMonitoring(startTime);
            log.debug("getLatestSystemMonitoring, result:[{}]", systemMonitoringList.size());

            String strDaq1Value = CommonValue.ALARM_VALUE_OFF;
            String strDaq2Value = CommonValue.ALARM_VALUE_OFF;

            // 최근 5분 간 데이터 수집기 측정 이력이 있다면 해당 값 저장
            for(SystemMonitoringDTO dto : systemMonitoringList)
            {
                if(dto.getMntr_ty() == CommonValue.MONITORING_TYPE_COLLECTOR)
                {
                    if(dto.getHost().equalsIgnoreCase(CommonValue.COLLECTOR1_HOSTNAME) == true)
                    {
                        strDaq1Value = dto.getMntr_val();
                    }
                    else if(dto.getHost().equalsIgnoreCase(CommonValue.COLLECTOR2_HOSTNAME) == true)
                    {
                        strDaq2Value = dto.getMntr_val();
                    }
                }
            }

            // If alarm value is 'OFF' then, insert alarm_notify and insert system_monitoring
            if(strDaq1Value.equalsIgnoreCase(CommonValue.ALARM_VALUE_OFF) == true)
            {
                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
                systemMonitoringDTO.setHost(CommonValue.COLLECTOR1_HOSTNAME);
                systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_COLLECTOR);
                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR1_HOSTNAME);
                systemMonitoringDTO.setMntr_val(CommonValue.ALARM_VALUE_OFF);
                systemMonitoringDTO.setMntr_upd_ti(new Date());
                databaseService.addSystemMonitoring(systemMonitoringDTO);

                // Insert alarm_notify & SCADA send
                alarmService.alarmNotify(
                        CommonValue.ALARM_CODE_COLLECTOR_OFF1,
                        CommonValue.COLLECTOR1_HOSTNAME,
                        CommonValue.ALARM_VALUE_OFF,
                        true);
            }

            // If alarm value is 'OFF' then, insert alarm_notify and insert system_monitoring
            if(strDaq2Value.equalsIgnoreCase(CommonValue.ALARM_VALUE_OFF) == true)
            {
                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
                systemMonitoringDTO.setHost(CommonValue.COLLECTOR2_HOSTNAME);
                systemMonitoringDTO.setMntr_ty(CommonValue.MONITORING_TYPE_COLLECTOR);
                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR2_HOSTNAME);
                systemMonitoringDTO.setMntr_val(CommonValue.ALARM_VALUE_OFF);
                systemMonitoringDTO.setMntr_upd_ti(new Date());
                databaseService.addSystemMonitoring(systemMonitoringDTO);

                // Insert alarm_notify & SCADA send
                alarmService.alarmNotify(
                        CommonValue.ALARM_CODE_COLLECTOR_OFF2,
                        CommonValue.COLLECTOR2_HOSTNAME,
                        CommonValue.ALARM_VALUE_OFF,
                        true);
            }
//            boolean bResponseOK = false;
//
//            // DAQ1 API Check
//            String strUri = "http://" + globalSystemConfig.getScada1_daq() + "/api/plugins.json";
//            HttpGet httpGet = new HttpGet(strUri);
//            httpGet.setConfig(requestConfig);
//
//            HttpResponse response = httpSend.send(httpGet);
//            if(response != null)
//            {
//                int nStatus = response.getStatusLine().getStatusCode();
//                log.debug("DAQ1 HealthCheck...Response:[{}]", nStatus);
//                if(nStatus == HttpStatus.SC_OK)
//                {
//                    bResponseOK = true;
//                }
//                else
//                {
//                    bResponseOK = false;
//                }
//            }
//            else
//            {
//                bResponseOK = false;
//                log.debug("DAQ1 HealthCheck...Response:[ERROR]");
//            }
//
//            // According to bResponseOK value, Insert system_monitoring
//            if(bResponseOK == true)
//            {
//                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
//                systemMonitoringDTO.setHostname(CommonValue.COLLECTOR1_HOSTNAME);
//                systemMonitoringDTO.setType(CommonValue.MONITORING_TYPE_COLLECTOR);
//                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR1_HOSTNAME);
//                systemMonitoringDTO.setValue(CommonValue.ALARM_VALUE_ON);
//                systemMonitoringDTO.setUpdate_time(new Date());
//                databaseService.addSystemMonitoring(systemMonitoringDTO);
//            }
//            else
//            {
//                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
//                systemMonitoringDTO.setHostname(CommonValue.COLLECTOR1_HOSTNAME);
//                systemMonitoringDTO.setType(CommonValue.MONITORING_TYPE_COLLECTOR);
//                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR1_HOSTNAME);
//                systemMonitoringDTO.setValue(CommonValue.ALARM_VALUE_OFF);
//                systemMonitoringDTO.setUpdate_time(new Date());
//                databaseService.addSystemMonitoring(systemMonitoringDTO);
//
//                // Insert alarm_notify & SCADA send
//                alarmService.alarmNotify(
//                        CommonValue.ALARM_CODE_DAQ_OFF1,
//                        CommonValue.COLLECTOR1_HOSTNAME,
//                        CommonValue.ALARM_VALUE_OFF,
//                        true);
//            }
//
//            // DAQ2 API Check
//            bResponseOK = false;
//            strUri = "http://" + globalSystemConfig.getScada2_daq() + "/api/plugins.json";
//            httpGet = new HttpGet(strUri);
//            httpGet.setConfig(requestConfig);
//
//            response = httpSend.send(httpGet);
//            if(response != null)
//            {
//                int nStatus = response.getStatusLine().getStatusCode();
//                log.debug("DAQ2 HealthCheck...Response:[{}]", nStatus);
//                if(nStatus == HttpStatus.SC_OK)
//                {
//                    bResponseOK = true;
//                }
//                else
//                {
//                    bResponseOK = false;
//                }
//            }
//            else
//            {
//                bResponseOK = false;
//                log.debug("DAQ2 HealthCheck...Response:[ERROR]");
//            }
//
//            // According to bResponseOK value, Insert system_monitoring
//            if(bResponseOK == true)
//            {
//                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
//                systemMonitoringDTO.setHostname(CommonValue.COLLECTOR2_HOSTNAME);
//                systemMonitoringDTO.setType(CommonValue.MONITORING_TYPE_COLLECTOR);
//                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR2_HOSTNAME);
//                systemMonitoringDTO.setValue(CommonValue.ALARM_VALUE_ON);
//                systemMonitoringDTO.setUpdate_time(new Date());
//                databaseService.addSystemMonitoring(systemMonitoringDTO);
//            }
//            else
//            {
//                SystemMonitoringDTO systemMonitoringDTO = new SystemMonitoringDTO();
//                systemMonitoringDTO.setHostname(CommonValue.COLLECTOR2_HOSTNAME);
//                systemMonitoringDTO.setType(CommonValue.MONITORING_TYPE_COLLECTOR);
//                systemMonitoringDTO.setMntr_itm(CommonValue.COLLECTOR2_HOSTNAME);
//                systemMonitoringDTO.setValue(CommonValue.ALARM_VALUE_OFF);
//                systemMonitoringDTO.setUpdate_time(new Date());
//                databaseService.addSystemMonitoring(systemMonitoringDTO);
//
//                // Insert alarm_notify & SCADA send
//                alarmService.alarmNotify(
//                        CommonValue.ALARM_CODE_DAQ_OFF2,
//                        CommonValue.COLLECTOR2_HOSTNAME,
//                        CommonValue.ALARM_VALUE_OFF,
//                        true);
//            }
        }
    }

    /**
     * 공정별 AI 제어값을 Kafka로 전송
     * 
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/control", method = RequestMethod.GET)
    public void getControl(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("getControl, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getControl() initialization controlDate before one hour
        if(controlDate == null)
        {
            controlDate = new Date();
            controlDate.setTime(controlDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.info("[internal] getControl");

        // Check ten seconds after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - controlDate.getTime() > propertiesControlCheck.getPeriod())
        {
            controlDate = new Date();
            // Receiving Process
            getReceivingControl();
            // Coagulant Process
            getCoagulantControl();
            // Mixing Process
            getMixingControl();
            // Sedimentation Process
            getSedimentationControl();
            // Filter Process
            getFilterControl();
            // Disinfection Process
            getDisinfectionControl();
        }
    }

    /**
     * 통합 운영 시스템 알람을 Kafka로 전송
     * 
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/alarm", method = RequestMethod.GET)
    public void getAlarm(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("getAlarm, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getAlarm() initialization alarmDate before one hour
        if(alarmDate == null)
        {
            alarmDate = new Date();
            alarmDate.setTime(alarmDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.info("[internal] getAlarm");
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - alarmDate.getTime() > CommonValue.THIRTY_SECOND)
        {
            alarmDate = new Date();

            // 1. get latest(1minute) control value(kafka_flag = 0)
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, -1);
            Date alarmTime = calendar.getTime();

            getAllAlarm(CommonValue.PROCESS_RECEIVING, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_COAGULANT, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_MIXING, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_SEDIMENTATION, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_FILTER, alarmTime, CommonValue.KAFKA_FLAG_INIT);
        	getAllAlarm(CommonValue.PROCESS_DISINFECTION_PRE, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_DISINFECTION_PERI, alarmTime, CommonValue.KAFKA_FLAG_INIT);
            getAllAlarm(CommonValue.PROCESS_DISINFECTION_POST, alarmTime, CommonValue.KAFKA_FLAG_INIT);
        }
    }
    
    /**
     * 공정별 알람정보 목록조회
     * 
     * @param processType 공정타입
     * @param alarmTime   현재시간
     * @param kafkaFlag   카프카플래그
     * @return List<AiProcessAlarmDTO> 공정 알람정보 목록
     */
    private List<AiProcessAlarmDTO> getAllAlarm(String processType, Date alarmTime, int kafkaFlag) {
        List<AiProcessAlarmDTO> aiAlarmList = new ArrayList<AiProcessAlarmDTO>();

        switch (processType) {
            case CommonValue.PROCESS_RECEIVING:           // 착수
                // 2. Receiving Process get ai_receiving_alarm
                aiAlarmList = databaseService.getAllAiReceivingAlarm(alarmTime, kafkaFlag);
                break;
            case CommonValue.PROCESS_COAGULANT:           // 약품
                // 2. Coagulant Process get ai_coagulant_alarm
                aiAlarmList = databaseService.getAllAiCoagulantAlarm(alarmTime, kafkaFlag);
                break;
            case CommonValue.PROCESS_MIXING:              // 혼화응집
                // 2. Mixing Process get ai_mixing_alarm
                aiAlarmList = databaseService.getAllAiMixingAlarm(alarmTime, kafkaFlag);
                break;
            case CommonValue.PROCESS_SEDIMENTATION:       // 침전
                // 2. Sedimentation Process get ai_sedimentation_alarm
                aiAlarmList = databaseService.getAllAiSedimentationAlarm(alarmTime, kafkaFlag);
                break;
            case CommonValue.PROCESS_FILTER:              // 여과
                // 2. Filter Process get ai_filter_alarm
                aiAlarmList = databaseService.getAllAiFilterAlarm(alarmTime, kafkaFlag);
                break;
            case CommonValue.PROCESS_DISINFECTION_PRE:       // 전차염
                // 2. Disinfection Process get ai_disinfection_alarm
                aiAlarmList = databaseService.getAllAiDisinfectionAlarm(alarmTime, kafkaFlag, CommonValue.DISINFECTION_PRE_STEP);
                break;
            case CommonValue.PROCESS_DISINFECTION_PERI:       // 중차염
                // 2. Disinfection Process get ai_disinfection_alarm
                aiAlarmList = databaseService.getAllAiDisinfectionAlarm(alarmTime, kafkaFlag, CommonValue.DISINFECTION_PERI_STEP);
                break;
            case CommonValue.PROCESS_DISINFECTION_POST:		  // 후차염
                aiAlarmList = databaseService.getAllAiDisinfectionAlarm(alarmTime, kafkaFlag, CommonValue.DISINFECTION_POST_STEP);
                break;
        }
        modifyAlarmKafkaFlag(aiAlarmList, processType);
        
        return aiAlarmList;
    }
    
    /**
     * 카프카 플래그 수정
     * 
     * @param alarmList 알람정보 목록
     * @param process   공정
     */
    private void modifyAlarmKafkaFlag(List<AiProcessAlarmDTO> alarmList, String process) {
        if(alarmList.size() > 0) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strBody;
            ObjectMapper objectMapper = new ObjectMapper();

            for(AiProcessAlarmDTO dto : alarmList) {
                AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmId(dto.getAlm_id());
                if(alarmInfo != null) {
                    if(alarmInfo.getAlm_ty() == 3) {
                        LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                        popupMap.put("alarm_id", alarmInfo.getAlm_id());
                        popupMap.put("message", alarmInfo.getDp_nm());
                        popupMap.put("url", alarmInfo.getUrl());
                        popupMap.put("time", simpleDateFormat.format(dto.getAlm_ti()));

                        // 3. Send Kafka ai_popup
                        try {
                            strBody = objectMapper.writeValueAsString(popupMap);
                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);
                        } catch(JsonProcessingException e) {
                            log.error("JsonProcessingException Occurred in PROCESS_CODE :" + process + " Alarm Process");
                        }
                    }

                    // 4. Update kafka_flag=1
                    AiProcessAlarmDTO updateDto = dto;
                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                    
                    if(CommonValue.PROCESS_RECEIVING.equals(process)) {             // 착수
                        databaseService.modAiReceivingAlarmKafkaFlag(updateDto);
                    } else if(CommonValue.PROCESS_COAGULANT.equals(process)) {      // 약품
                        databaseService.modAiCoagulantAlarmKafkaFlag(updateDto);
                    } else if(CommonValue.PROCESS_MIXING.equals(process)) {         // 혼화응집
                        databaseService.modAiMixingAlarmKafkaFlag(updateDto);
                    } else if(CommonValue.PROCESS_SEDIMENTATION.equals(process)) {  // 침전
                        databaseService.modAiSedimentationAlarmKafkaFlag(updateDto);
                    } else if(CommonValue.PROCESS_FILTER.equals(process)) {         // 여과
                        databaseService.modAiFilterAlarmKafkaFlag(updateDto);
                    } else if(CommonValue.PROCESS_DISINFECTION_PRE.equals(process)) {   // 소독 전차염
                        databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_PRE_STEP);
                    } else if(CommonValue.PROCESS_DISINFECTION_PERI.equals(process)) {   // 소독 중차염
                        databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_PERI_STEP);
                    } else if(CommonValue.PROCESS_DISINFECTION_POST.equals(process)) {   // 소독 후차염
                        databaseService.modAiDisinfectionAlarmKafkaFlag(updateDto, CommonValue.DISINFECTION_POST_STEP);
                    }
                }
            }
        }
    }

    /**
     * 데이터베이스 정리
     * 
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/database", method = RequestMethod.GET)
    public void getDatabase(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
        // Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("[Collector]getDatabase, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        // If first call getDatabase() initialization databaseDate before one hour
        if(databaseDate == null)
        {
            databaseDate = new Date();
            databaseDate.setTime(databaseDate.getTime() - CommonValue.ONE_HOUR);
        }

        log.info("[Collector][internal] getDatabase");
        // Check one minute after previous transfer
        Date currentDate = new Date();
        if(currentDate.getTime() - databaseDate.getTime() > CommonValue.ONE_MINUTE) {
            databaseDate = new Date();

            // Database check
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MONTH, -propertiesStorage.getStorage());
            Date deleteTime = calendar.getTime();

            //log.info("Delete Login History:[{}]", databaseService.delLoginHistory(deleteTime));
//            log.info("[Collector]Delete System Monitoring:[{}]", databaseService.delSystemMonitoring(deleteTime));
//            log.info("[Collector]Delete Sensor:[{}]", databaseService.delSensor(deleteTime));

            for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
            	log.info("[Collector]Delete TB_AI_B_RT:[{}]", databaseService.delAiReceivingRealtimeValue(deleteTime, processStep));
            	log.info("[Collector]Delete TB_AI_B_CTR:[{}]", databaseService.delAiReceivingControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_C_RT:[{}]", databaseService.delAiCoagulantRealtimeValue(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_C_CTR:[{}]", databaseService.delAiCoagulantControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_D_RT:[{}]", databaseService.delAiMixingRealtimeValue(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_D_CTR:[{}]", databaseService.delAiMixingControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_E_RT:[{}]", databaseService.delAiSedimentationRealtimeValue(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_E_CTR:[{}]", databaseService.delAiSedimentationControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_F_RT:[{}]", databaseService.delAiFilterRealtimeValue(deleteTime));
                log.info("[Collector]Delete TB_AI_F_CTR:[{}]", databaseService.delAiFilterControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_F_ALM:[{}]", databaseService.delAiFilterAlarm(deleteTime));
                log.info("[Collector]Delete TB_AI_G_PRE_RT:[{}]", databaseService.delAiDisinfectionRealtimeValue(deleteTime, processStep, CommonValue.DISINFECTION_PRE_STEP));
                log.info("[Collector]Delete TB_AI_G_PERI_RT:[{}]", databaseService.delAiDisinfectionRealtimeValue(deleteTime, processStep, CommonValue.DISINFECTION_PERI_STEP));
                log.info("[Collector]Delete TB_AI_G_POST_RT:[{}]", databaseService.delAiDisinfectionRealtimeValue(deleteTime, processStep, CommonValue.DISINFECTION_POST_STEP));
                log.info("[Collector]Delete TB_AI_G_PRE_CTR:[{}]", databaseService.delAiPreDisinfectionControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_G_PERI_CTR:[{}]", databaseService.delAiPeriDisinfectionControl(deleteTime, processStep));
                log.info("[Collector]Delete TB_AI_G_POST_CTR:[{}]", databaseService.delAiPostDisinfectionControl(deleteTime, processStep));
            }
        }
    }

    // 알고리즘 상태 확인
//    @RequestMapping(value = "/internal/algorithm", method = RequestMethod.GET)
//    public void getAlgorithm(@RequestHeader("X-ACCESS-TOKEN") String token)
//    {
//        // Token Check
//        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
//        {
//            log.error("getDatabase, Invalid X-ACCESS-TOKEN:[{}]", token);
//            return;
//        }
//
//        // If first call getAlgorithm() initialization algorithmDate before one hour
//        if(algorithmDate == null)
//        {
//            algorithmDate = new Date();
//            algorithmDate.setTime(algorithmDate.getTime() - CommonValue.ONE_HOUR);
//        }
//
//        log.debug("[internal] getAlgorithm");
//
//        // Check one minute after previous transfer
//        Date currentDate = new Date();
//        if(currentDate.getTime() - algorithmDate.getTime() > CommonValue.ONE_MINUTE)
//        {
//            algorithmDate = new Date();
//
//            // get algorithm health check URL
//            List<String> strUri = propertiesAlgorithmCheck.getAlgorithmHealth();
//
//            StringBuffer stringBuffer = new StringBuffer();
//            ObjectMapper objectMapper = new ObjectMapper();
//            BufferedReader bufferedReader = null;
//            InputStreamReader inputStreamReader = null;
//            AlgorithmHealthStatus algorithmHealthStatus = new AlgorithmHealthStatus();
//
//            try
//            {
//                for(String uri : strUri)
//                {
//                    HttpGet httpGet = new HttpGet(uri);
//                    httpGet.setConfig(requestConfig);
//
//                    HttpResponse response = httpSend.send(httpGet);
//                    if(response == null)
//                    {
//                        continue;
//                    }
//
//                    if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK)
//                    {
//                        inputStreamReader = new InputStreamReader(response.getEntity().getContent());
//                        bufferedReader = new BufferedReader(inputStreamReader);
//
//                        String strLine;
//                        while((strLine = bufferedReader.readLine()) != null)
//                        {
//                            stringBuffer.append(strLine);
//                        }
//
//                        // Algorithm Healthcheck Response에 대한 Parsing
//                        ArrayList<SupervisorStateInfoDTO> algorithmList =
//                                objectMapper.readValue(stringBuffer.toString(), new TypeReference<ArrayList<SupervisorStateInfoDTO>>(){});
//                        for(SupervisorStateInfoDTO processState : algorithmList)
//                        {
//                            if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_RECEIVING_NAME) == true)
//                            {
//                                // 착수 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getReceiving() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setReceiving(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_COAGULANT_NAME) == true)
//                            {
//                                // 약품 공장 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getCoagulant() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setCoagulant(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_MIXING_NAME) == true)
//                            {
//                                // 혼화응집 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getMixing() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setMixing(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_SEDIMENTATION_NAME) == true)
//                            {
//                                // 침전 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getSedimentation() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setSedimentation(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_FILTER_NAME) == true)
//                            {
//                                // 여과 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getFilter() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setFilter(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_GAC_NAME) == true)
//                            {
//                                // GAC 여과 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getGac() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setGac(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_DISINFECTION_NAME) == true)
//                            {
//                                // 소독 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getDisinfection() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setDisinfection(processState.getState());
//                            }
//                            else if(processState.getName().equalsIgnoreCase(CommonValue.PROCESS_OZONE_NAME) == true)
//                            {
//                                // 오존 공정 알고리즘 프로세스 상태 저장
//                                if(algorithmHealthStatus.getOzone() == CommonValue.PROCESS_STATE_RUNNING)
//                                {
//                                    continue;
//                                }
//                                algorithmHealthStatus.setOzone(processState.getState());
//                            }
//                        }
//                    }
//                }
//
//                // Receiving Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getReceiving() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_RECEIVING_AI_MODULE_ERROR);
//                    log.debug("insert receiving algorithm module error alarm:[{}]",
//                            databaseService.addAiReceivingAlarm(aiProcessAlarm));
//                }
//
//                // Coagulant Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getCoagulant() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_COAGULANT_AI_MODULE_ERROR);
//                    log.debug("insert coagulant algorithm module error alarm:[{}]",
//                            databaseService.addAiCoagulantAlarm(aiProcessAlarm));
//                }
//
//                // Mixing Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getMixing() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_MIXING_AI_MODULE_ERROR);
//                    log.debug("insert mixing algorithm module error alarm:[{}]",
//                            databaseService.addAiMixingAlarm(aiProcessAlarm));
//                }
//
//                // Sedimentation Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getSedimentation() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_SEDIMENTATION_AI_MODULE_ERROR);
//                    log.debug("insert sedimentation algorithm module error alarm:[{}]",
//                            databaseService.addAiSedimentationAlarm(aiProcessAlarm));
//                }
//
//                // Filter Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getFilter() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_FILTER_AI_MODULE_ERROR);
//                    log.debug("insert filter algorithm module error alarm:[{}]",
//                            databaseService.addAiFilterAlarm(aiProcessAlarm));
//                }
//
//                // GAC Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getGac() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_GAC_AI_MODULE_ERROR);
//                    log.debug("insert gac algorithm module error alarm:[{]]",
//                            databaseService.addAiGacAlarm(aiProcessAlarm));
//                }
//
//                // Disinfection Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getDisinfection() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_DISINFECTION_AI_MODULE_ERROR);
//                    log.debug("insert disinfection algorithm module error alarm:[{}]",
//                            databaseService.addAiDisinfectionAlarm(aiProcessAlarm));
//                }
//
//                // Ozone Algorithm Health Check & Send Alarm
//                if(algorithmHealthStatus.getOzone() != CommonValue.PROCESS_STATE_RUNNING)
//                {
//                    AiProcessAlarmDTO aiProcessAlarm = new AiProcessAlarmDTO();
//                    aiProcessAlarm.setAlm_ti(new Date());
//                    aiProcessAlarm.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
//                    aiProcessAlarm.setAlm_id(CommonValue.ALARM_OZONE_AI_MODULE_ERROR);
//                    log.debug("insert ozone algorithm module error alarm:[{}]",
//                            databaseService.addAiOzoneAlarm(aiProcessAlarm));
//                }
//            }
//            catch(IOException e)
//            {
//                log.error("Invalid Body or BufferedReader...");
//            }
//            finally
//            {
//                if(inputStreamReader != null)
//                {
//                    try
//                    {
//                        inputStreamReader.close();
//                    }
//                    catch(IOException e)
//                    {
//                        log.error("inputStreamReader Close Exception occurred");
//                    }
//                }
//                if(bufferedReader != null)
//                {
//                    try
//                    {
//                        bufferedReader.close();
//                    }
//                    catch(IOException e)
//                    {
//                        log.error("bufferedReader Close Exception occurred");
//                    }
//                }
//            }
//        }
//    }

    /**
     * 데이터베이스 정리 (실시간 데이터)
     * 
     * @param token 토큰
     */
    @RequestMapping(value = "/internal/manageRtTable", method = RequestMethod.GET)
    public void manageRtTable(@RequestHeader("X-ACCESS-TOKEN") String token)
    {
		// Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false)
        {
            log.error("[Collector]getDatabase, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }
		
		log.info("[Collector]Check Database Partition...Thread[{}]", Thread.currentThread().getName());

        // Set default calendar(tomorrow)
        Calendar calendarAdd = Calendar.getInstance();
        calendarAdd.set(Calendar.MINUTE, 0);
        calendarAdd.set(Calendar.SECOND, 0);
        calendarAdd.set(Calendar.HOUR_OF_DAY, 0);
        calendarAdd.add(Calendar.HOUR_OF_DAY, 24);

        // Set partition name
        SimpleDateFormat partitionNameFormat = new SimpleDateFormat("yyyyMMdd");
        List<String> strAddPartitionNameList = new ArrayList<>();
        strAddPartitionNameList.add("p_" + partitionNameFormat.format(calendarAdd.getTime()));

        List<String> procCdList = databaseService.selectProcCd();
        for(String procCd : procCdList)
        {
            try{
                databaseService.addProcessRealtimePartition(procCd, strAddPartitionNameList);
                log.info("[Collector]Success Add Table[TB_{}_RT]...Partition Name:{}", procCd, strAddPartitionNameList.toString());
            } catch (DataAccessException e) {
                log.error("[Collector]Failed Add Table[TB_{}_RT]...Partition Name:{}", procCd, strAddPartitionNameList.toString());
                log.error(e.toString());
            }
        }

        // Delete Realtime table partition(7 days)
        Calendar calendarDel = Calendar.getInstance();
        calendarDel.set(Calendar.MINUTE, 0);
        calendarDel.set(Calendar.SECOND, 0);
        calendarDel.set(Calendar.HOUR_OF_DAY, 0);
        calendarDel.add(Calendar.DAY_OF_MONTH, -7);
        String strDelStartPartitionName = "p_" + partitionNameFormat.format(calendarDel.getTime());

        for(String procCd : procCdList)
        {
            List<String> dropPartitionList = new ArrayList<>();
            try{
				// Get drop partition list
				dropPartitionList = databaseService.getDropPartitionList(procCd, strDelStartPartitionName);
				databaseService.delProcessRealtimePartition(procCd, dropPartitionList);
                log.info("[Collector]Success Del Table[TB_{}_RT]... Partition Name:[{}]", procCd, dropPartitionList.toString());
            } catch (DataAccessException e) {
                log.info("[Collector]Failed Del Table[TB_{}_RT]... Partition Name:[{}]", procCd, dropPartitionList.toString());
                log.error(e.toString());
            }
        }
	}
    
    /**
     * 착수 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
    public int sendAiReceivingData(List<TagManageDTO> tagManageList) {
    	int sendCnt = 0;
    	for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
        	
        	AiReceivingRealtimeDTO aiReceivingRealtime = databaseService.getLatestAiReceivingRealtimeValue(processStep);
        	log.debug("getLatestAiReceivingRealtimeValue, result:[{}]", aiReceivingRealtime != null ? 1: 0);
        	
        	AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, processStep);
        	log.debug("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1: 0);
        	
        	if(aiReceivingRealtime != null) {
        		try {
        			
        			LinkedHashMap<String, Object> controlMap, mapTemp;
        			ObjectMapper objectMapper = new ObjectMapper();
        			
        			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        			String strDate = simpleDateFormat.format(aiReceivingRealtime.getUpd_ti());
        			String strBody = "";
        			
        			
        			/**
        			 * 착수 AI 모드 경보 KAFKA 전송
        			 */
        			if(aiReceivingInit != null) {
        				for(TagManageDTO dto : tagManageList) {
        					if(dto.getItm().equalsIgnoreCase("b_operation_mode_a") == true) {
        						strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
        								aiReceivingInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
        						kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
        						sendCnt++;
        						break;
        					}
        				}
        			}
        			
        			/**
        			 * ai_b_upd_ti 	: 착수 공정 분석 결과 시간 KAFKA 전송
        			 * ai_b_in_fr	: 착수 공정 원수 유입 유량 예측값 KAFKA 전송
        			 * ai_b_vv_po	: 착수 공정 원수 조절 밸브 계도 예측값 KAFKA 전송
        			 */
        			for(TagManageDTO dto : tagManageList) {
        				
        				// 착수 공정이 아닌 TAG MNG는 continue
        				if(dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_RECEIVING) != true) {
        					continue;
        				}
        				
        				if(dto.getItm().equalsIgnoreCase("ai_b_upd_ti") == true) {
        					strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
        					kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
        					sendCnt++;
        				} else if(dto.getItm().equalsIgnoreCase("ai_b_in_fr") == true) {
        					strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiReceivingRealtime.getAi_b_in_fr(), strDate));
        					kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
        					sendCnt++;
        				} else if(dto.getItm().equalsIgnoreCase("ai_b_vv_po_bypass") == true) {
        					// 바이패스 밸브 개도 예측
        					mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_vv_po(), LinkedHashMap.class);
        	            	ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
        	            	Object objectTemp = mapTemp.get(keyList.get(0));
        					strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), objectTemp, strDate));
        					kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
        					sendCnt++;
        				} else if(dto.getItm().equalsIgnoreCase("ai_b_vv_po_guidevane") == true) {
        					// 가이드베인 벨브 개도 예측
        					mapTemp = objectMapper.readValue(aiReceivingRealtime.getAi_b_vv_po(), LinkedHashMap.class);
        	            	ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
        	            	Object objectTemp = mapTemp.get(keyList.get(1));
        					strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), objectTemp, strDate));
        					kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
        					sendCnt++;
        				}
        			}
        			
        			
        		} catch(JsonProcessingException e) {
        			log.error("JsonProcessingException Occurred in Receiving Process");
        		}
        	}
        }
    	return sendCnt;
    }
    
    /**
     * 약품 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
    public int sendAiCoagulantData(List<TagManageDTO> tagManageList) {
    	int sendCnt = 0;
    	for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
            
        	AiCoagulantRealtimeDTO aiCoagulantRealtime = databaseService.getLatestAiCoagulantRealtimeValue(processStep);
        	log.debug("getLatestAiCoagulantRealtimeValue, result:[{}]", aiCoagulantRealtime != null ? 1 : 0);
        	
        	AiProcessInitDTO aiCoagulantInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, processStep);
            log.debug("getAiCoagulantInit, result:[{}]", aiCoagulantInit != null ? 1 : 0);
            
            
            if(aiCoagulantRealtime != null) {
                
            	try {
                    
            		LinkedHashMap<String, Object> controlMap, mapTemp;
                    ObjectMapper objectMapper = new ObjectMapper();

                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String strDate = simpleDateFormat.format(aiCoagulantRealtime.getUpd_ti());
                    String strBody = "";

                    
                    /**
        			 * 약품 AI 모드 경보 KAFKA 전송
        			 */
                    if(aiCoagulantInit != null) {
                        
                        for(TagManageDTO dto : tagManageList) {
                            if(dto.getItm().equalsIgnoreCase("c_operation_mode_a") == true) {                                    
                                strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
                                		aiCoagulantInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                break;
                            }
                        }
                    }
                    
                    /**
                     * 응집제 종류 정송
                     */
                    
                    UsrManageDTO usrManageCoagulant = databaseService.getUsrMngFromItm("c_cf_coagulant");
    				controlMap = new LinkedHashMap<>();
            		controlMap.put("tag", usrManageCoagulant.getTag_sn());
            		controlMap.put("value", usrManageCoagulant.getInit_val());
            		controlMap.put("time", strDate);
            		strBody = objectMapper.writeValueAsString(controlMap);
            		kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
            		sendCnt++;
                    
                    /**
                     * ai_c_upd_ti	: 약품 공정 분석 결과 시간 KAFKA 전송
                     * ai_c_cf		: 약품 공정 약품 주입률 예측값 KAFKA 전송
                     * c_tb_e			: 약품 공정 침전지 탁도 예측값 KAFKA 전송
                     */
                    for(TagManageDTO dto : tagManageList) {
                    	
                    	// 약품 공정이 아닌 TAG MNG는 continue
                        if(dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_COAGULANT) != true) {
                            continue;
                        }
                        
                        if(dto.getItm().equalsIgnoreCase("ai_c_upd_ti") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        }
                        else if(dto.getItm().equalsIgnoreCase("ai_c_cf") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiCoagulantRealtime.getAi_c_cf(), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        }
                    }
                } catch(JsonProcessingException e) {
                    log.error("JsonProcessingException Occurred in Coagulant Process");
                }
            }
        }
    	return sendCnt;
    }
    
    /**
     * 혼화응집 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
    public int sendAiMixingData(List<TagManageDTO> tagManageList) {
    	int sendCnt = 0;
    	for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
            
        	
            AiMixingRealtimeDTO aiMixingRealtime = databaseService.getLatestAiMixingRealtimeValue(processStep);
            log.debug("getLatestAiMixingRealtimeValue, result:[{}]", aiMixingRealtime != null ? 1 : 0);

            TagManageRangeDTO mixingRange = databaseService.getTagManageRange(CommonValue.PROCESS_MIXING, processStep);
            log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_MIXING, mixingRange != null ? 1 : 0);
            
            AiProcessInitDTO aiMixingInit = databaseService.getAiMixingInit(CommonValue.D_OPERATION_MODE, processStep);
            log.debug("getAiMixingInit, result:[{}]", aiMixingInit != null ? 1 : 0);
            
            
            if(aiMixingRealtime != null && mixingRange != null) {
            	int nLocationMin = mixingRange.getMin(); 
                int nLocationMax = mixingRange.getMax();
                
                try {
                	LinkedHashMap<String, Object> controlMap, mapTemp;
                    ObjectMapper objectMapper = new ObjectMapper();

                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String strDate = simpleDateFormat.format(aiMixingRealtime.getUpd_ti());
                    String strBody = "";

                    /**
                     * 혼화응집 AI 모드 경보 KAFKA 전송
                     */
                    if(aiMixingInit != null) {
                        for(TagManageDTO dto : tagManageList) {
                            if(dto.getItm().equalsIgnoreCase("d_operation_mode_a") == true) {
                            	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
                                		aiMixingInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                break;
                            }
                        }
                    }

                    /**
                     * ai_d_upd_ti	: 혼화응집 공정 분석 결과 시간 KAFKA 전송
                     * d_ki_dv		: 혼화응집 공정 동점성 계수
                     * d_anr		: 혼화응집 공정 패들면적
                     * d_v			: 혼화응집 공정 조 체적
                     */
                    for(TagManageDTO dto : tagManageList) {
                        
                    	//혼화응집 공정이 아닌 TAG MNG는 continue
                    	if (dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_MIXING) != true) {
                            continue;
                        }

                        if (dto.getItm().equalsIgnoreCase("ai_d_upd_ti") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        } else if(dto.getItm().equalsIgnoreCase("d_ki_dv") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiMixingRealtime.getD_ki_dv(), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        } else if(dto.getItm().equalsIgnoreCase("d_anr") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiMixingRealtime.getD_anr(), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        } else if(dto.getItm().equalsIgnoreCase("d_v") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiMixingRealtime.getD_v(), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        }
                    }

                    
                    /**
                     * ai_d_fc_sp1_1 : 응집 1지 1열 설정 속도 예측 값 KAFKA 전송
                     * ai_d_fc_sp1_2 : 응집 1지 2열 설정 속도 예측 값 KAFKA 전송
                     * ai_d_fc_sp1_3 : 응집 1지 3열 설정 속도 예측 값 KAFKA 전송
                     * ai_d_fc_sp2_1 : 응집 2지 1열 설정 속도 예측 값 KAFKA 전송
                     * ai_d_fc_sp2_2 : 응집 2지 2열 설정 속도 예측 값 KAFKA 전송
                     * ...
                     * ai_d_fc_sp8_3 : 응집 8지 3열 설정 속도 예측 값 KAFKA 전송
                     */
                    mapTemp = objectMapper.readValue(aiMixingRealtime.getAi_d_loc_fc_sp(), LinkedHashMap.class);
                    List<String> keyList = new ArrayList<>(mapTemp.keySet());
                    Object objectTemp = mapTemp.get(keyList.get(0));

                    mapTemp = objectMapper.convertValue(objectTemp, LinkedHashMap.class);
                    keyList = new ArrayList<>(mapTemp.keySet());

                    for(String key : keyList) {
                        LinkedHashMap<String, Object> locationMapTemp = objectMapper.convertValue(mapTemp.get(key), LinkedHashMap.class);
                        List<String> locationKeyList = new ArrayList<>(locationMapTemp.keySet());

                        for(String locationKey : locationKeyList) {
                            LinkedHashMap<String, Object> stepMapTemp = objectMapper.convertValue(locationMapTemp.get(locationKey), LinkedHashMap.class);
                            List<String> stepKeyList = new ArrayList<>(stepMapTemp.keySet()); 

                            for(int i = nLocationMin; i <= nLocationMax; i++) {
                                for(int j = 1; j <= 3; j++) {
                                    
                                	String strItemName = "ai_d_fc_sp"+i+"_"+j;
                                    if(key.equalsIgnoreCase("location"+i) == true && locationKey.equalsIgnoreCase("step"+j) == true) {

                                        TagManageDTO dto = tagManageList.stream()
                                                .filter(tagManage -> strItemName.equalsIgnoreCase(tagManage.getItm()))
                                                .findAny()
                                                .orElse(null);

                                        if(dto == null) {
                                            continue;
                                        }

                                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), stepMapTemp.get(stepKeyList.get(0)), strDate));
                                        kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                        sendCnt++;
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                } catch(JsonProcessingException e) {
                    log.error("JsonProcessingException Occurred in Mixing Process");
                }
            }
        }
    	return sendCnt;
    }

    /**
     * 침전 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
	public int sendAiSedimentationData(List<TagManageDTO> tagManageList) {
		int sendCnt = 0;
		for (int processStep : CommonValue.PROCESS_STEP_ARRAY) {
        	
        	
            AiSedimentationRealtimeDTO aiSedimentationRealtime = databaseService.getLatestAiSedimentationRealtimeValue(processStep);
            log.debug("getLatestAiSedimentationRealtimeValue, result:[{}]", aiSedimentationRealtime != null ? 1 : 0);
            
            AiProcessInitDTO aiSedimentationInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE, processStep);
            log.debug("getAiSedimentationInit, result:[{}]", aiSedimentationInit != null ? 1 : 0);
            
            if(aiSedimentationRealtime != null) {
                try {
                    LinkedHashMap<String, Object> controlMap, mapTemp;
                    List<LinkedHashMap<String, Object>> locationMap;
                    ObjectMapper objectMapper = new ObjectMapper();
                    Date dateTemp;

                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    SimpleDateFormat valueDateFormat = new SimpleDateFormat("MM-dd HH:mm");
                    SimpleDateFormat resultDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                    String strDate = simpleDateFormat.format(aiSedimentationRealtime.getUpd_ti());
                    String strBody = "";

                    /**
                     * 침전 AI 모드 경보 KAFKA 전송
                     */
                    if(aiSedimentationInit != null){
                        for(TagManageDTO dto : tagManageList){
                            if(dto.getItm().equalsIgnoreCase("e_operation_mode_a") == true) {
                            	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiSedimentationInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                break;
                            }
                        }
                    }

                    /**
                     * ai_e_upd_ti	: 침전 공정 분석 결과 시간 KAFKA 전송
                     * ai_e_sludge  : 침전지 슬러지 발생량 예측
                     */
                    for(TagManageDTO dto : tagManageList){
                    	
                    	// 침전 공정이 아닌 TAG MNG는 continue
                        if (dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_SEDIMENTATION) != true){
                            continue;
                        }

                        if (dto.getItm().equalsIgnoreCase("ai_e_upd_ti") == true) { 
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        } else if (dto.getItm().equalsIgnoreCase("ai_e_sludge") == true) {
                        	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiSedimentationRealtime.getAIE_5300(), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                        }
                        
                    }
                    
                    /**
                     * 침전 공정 각 지별 (1지 ~ 8지)
                     * 1) AI 수집기 대차 시작 시간 예측 값 KAFKA 전송
                     * 2) AI 수집기 대차 종료 시간 예측 값 KAFKA 전송
                     * 3) AI 다음 수집기 시작 시간 예측 값 KAFKA 전송
                     * 4) AI 인발 시간 예측 값 KAFKA 전송
                     */
                    AiSedimentationLocation1RealtimeDTO location1Dto = tagMapService.getLocation1Dto(aiSedimentationRealtime.getAIE_9001());
                    AiSedimentationLocation2RealtimeDTO location2Dto = tagMapService.getLocation2Dto(aiSedimentationRealtime.getAIE_9002());
                    AiSedimentationLocation3RealtimeDTO location3Dto = tagMapService.getLocation3Dto(aiSedimentationRealtime.getAIE_9003());
                    AiSedimentationLocation4RealtimeDTO location4Dto = tagMapService.getLocation4Dto(aiSedimentationRealtime.getAIE_9004());
                    AiSedimentationLocation5RealtimeDTO location5Dto = tagMapService.getLocation5Dto(aiSedimentationRealtime.getAIE_9005());
                    AiSedimentationLocation6RealtimeDTO location6Dto = tagMapService.getLocation6Dto(aiSedimentationRealtime.getAIE_9006());
                    AiSedimentationLocation7RealtimeDTO location7Dto = tagMapService.getLocation7Dto(aiSedimentationRealtime.getAIE_9007());
                    AiSedimentationLocation8RealtimeDTO location8Dto = tagMapService.getLocation8Dto(aiSedimentationRealtime.getAIE_9008());
                    

                    // 침전지 1지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location1Dto.getAIE_6001().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4002", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location1Dto.getAIE_6001().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4002", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location1Dto.getAIE_6001().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4003", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location1Dto.getAIE_6001().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4003", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    // 침전지 #2 AI 다음 수집기 시작 시간 예측
                    if(location1Dto.getAIE_6001().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4004", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location1Dto.getAIE_6001().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4004", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    // 침전지 #2 AI 인발 시간 예측
                    if(location1Dto.getAIE_6001().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4005", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location1Dto.getAIE_6001().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4005", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 1지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 2지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location2Dto.getAIE_6002().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4006", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location2Dto.getAIE_6002().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4006", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location2Dto.getAIE_6002().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4007", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location2Dto.getAIE_6002().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4007", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location2Dto.getAIE_6002().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4008", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location2Dto.getAIE_6002().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4008", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location2Dto.getAIE_6002().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4009", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location2Dto.getAIE_6002().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4009", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 2지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 3지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location3Dto.getAIE_6003().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4010", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location3Dto.getAIE_6003().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4010", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location3Dto.getAIE_6003().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4011", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location3Dto.getAIE_6003().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4011", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location3Dto.getAIE_6003().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4012", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location3Dto.getAIE_6003().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4012", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location3Dto.getAIE_6003().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4013", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location3Dto.getAIE_6003().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4013", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 3지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    // 침전지 4지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location4Dto.getAIE_6004().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4014", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location4Dto.getAIE_6004().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4014", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location4Dto.getAIE_6004().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4015", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location4Dto.getAIE_6004().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4015", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location4Dto.getAIE_6004().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4016", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location4Dto.getAIE_6004().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4016", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location4Dto.getAIE_6004().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4017", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location4Dto.getAIE_6004().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4017", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 4지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 5지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location5Dto.getAIE_6005().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4018", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location5Dto.getAIE_6005().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4018", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location5Dto.getAIE_6005().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4019", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location5Dto.getAIE_6005().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4019", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location5Dto.getAIE_6005().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4020", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location5Dto.getAIE_6005().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4020", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location5Dto.getAIE_6005().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4021", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location5Dto.getAIE_6005().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4021", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 5지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 6지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location6Dto.getAIE_6006().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4022", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location6Dto.getAIE_6006().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4022", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location6Dto.getAIE_6006().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4023", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location6Dto.getAIE_6006().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4023", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location6Dto.getAIE_6006().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4024", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location6Dto.getAIE_6006().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4024", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location6Dto.getAIE_6006().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4025", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location6Dto.getAIE_6006().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4025", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 6지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 7지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location7Dto.getAIE_6007().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4026", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location7Dto.getAIE_6007().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4026", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location7Dto.getAIE_6007().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4027", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location7Dto.getAIE_6007().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4027", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location7Dto.getAIE_6007().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4028", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location7Dto.getAIE_6007().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4028", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location7Dto.getAIE_6007().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4029", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location7Dto.getAIE_6007().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4029", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 7지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                    
                    
                    // 침전지 8지 전송 Start ----------------------------------------------------------------------------------------------------------------------
                    
                    //AI 수집기 대차 시작 시간 예측
                    if(location8Dto.getAIE_6008().getStart().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4030", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location8Dto.getAIE_6008().getStart());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4030", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    //AI 수집기 대차 종료 시간 예측
                    if(location8Dto.getAIE_6008().getStop().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4031", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location8Dto.getAIE_6008().getStop());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4031", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 다음 수집기 시작 시간 예측
                    if(location8Dto.getAIE_6008().getNext_start().equalsIgnoreCase("") == true) {
                    	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4032", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location8Dto.getAIE_6008().getNext_start());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4032", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    
                    //AI 인발 시간 예측
                    if(location8Dto.getAIE_6008().getInbal().equalsIgnoreCase("") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4033", "--", strDate));
                    } else {
                        dateTemp = resultDateFormat.parse(location8Dto.getAIE_6008().getInbal());
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap("600-359-SWI-4033", valueDateFormat.format(dateTemp), strDate));
                    }
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                    // 침전지 8지 전송 End ----------------------------------------------------------------------------------------------------------------------
                    
                    
                    
                } catch(JsonProcessingException e) {
                    log.error("JsonProcessingException Occurred in Sedimentation Process");
                } catch(ParseException e) {
                    log.error("TimeParsingException Occurred in Sedimentation Process");
                }
            }
        }
		return sendCnt;
	}

	/**
     * 여과 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
	public int sendAiFilterData(List<TagManageDTO> tagManageList) {
		int sendCnt = 0;
		AiFilterRealtimeDTO aiFilterRealtime = databaseService.getLatestAiFilterRealtimeValue();
        log.debug("getLatestAiFilterRealtimeValue, result:[{}]", aiFilterRealtime != null ? 1 : 0);

        // get location number(지 번호)
        TagManageRangeDTO filterRange = databaseService.getTagManageRange(CommonValue.PROCESS_FILTER, 1);
        log.debug("getTagManageRange:[{}], result:[{}]", CommonValue.PROCESS_FILTER, filterRange != null ? 1: 0);
        
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, 1);
        log.debug("getAiFilterInit:[{}], result:[{}]", aiFilterInit != null ? 1: 0);
        
        
        if(aiFilterRealtime != null) {
            
        	int nLocationMin = 0;
            int nLocationMax = 0;
            
            if(filterRange != null) {
                nLocationMin = filterRange.getMin();
                nLocationMax = filterRange.getMax();
            }

            try {
                LinkedHashMap<String, Object> mapTemp;
                ObjectMapper objectMapper = new ObjectMapper();

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String strDate = simpleDateFormat.format(aiFilterRealtime.getUpd_ti());
                String strBody = "";
                
                /**
                 * 여과 AI 모드 경보 KAFKA 전송
                 */
                if(aiFilterInit != null) {
                    for(TagManageDTO dto : tagManageList) {
                        if(dto.getItm().equalsIgnoreCase("f_operation_mode_a") == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
                            		aiFilterInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                            break;
                        }
                    }
                }
                
                /**
                 * ai_f_upd_ti : 여과 공정 분석 결과 시간 KAFKA 전송
                 */
                for(TagManageDTO dto : tagManageList) {
                    
                	// 여과 공정이 아닌 TAG MNG는 continue
                	if (dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_FILTER) != true) {
                        continue;
                    }

                    if (dto.getItm().equalsIgnoreCase("ai_f_upd_ti") == true) {
                        strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                        kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                        sendCnt++;
                        break;
                    }
                }

                
                
                /**
                 * AI 지별 여과 지속 시간 예측
                 * f_location_ti_m1  : 1지 AI 지별 여과 지속 시간 예측 값 KAFKA 전송
                 * f_location_ti_m2  : 2지 AI 지별 여과 지속 시간 예측 값 KAFKA 전송
                 * f_location_ti_m3  : 3지 AI 지별 여과 지속 시간 예측 값 KAFKA 전송
                 * ...
                 * f_location_ti_m22 : 22지 AI 지별 여과 지속 시간 예측 값 KAFKA 전송
                 */
                mapTemp = objectMapper.readValue(aiFilterRealtime.getF_time(), LinkedHashMap.class);
                ArrayList<String> keyList = new ArrayList<>(mapTemp.keySet());
                for(String key : keyList) {
                    for(int i = nLocationMin; i <= nLocationMax; i++) {
                    	String strItemName = "f_location_ti_m" + i;
                    	
                        if(key.equalsIgnoreCase("location" + i) == true) {
                            TagManageDTO dto = tagManageList.stream()
                                    .filter(tagManage -> strItemName.equalsIgnoreCase(tagManage.getItm()))
                                    .findAny()
                                    .orElse(null);

                            if(dto == null) {
                                continue;
                            }

                            int value = (int)mapTemp.get(key);
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), Math.round((float)value / 60), strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                            continue;
                        }
                    }
                }

                
                
                /**
                 * AI 지별 수위 예측
                 * ai_f_loc_le1  : 1지 AI 수위 예측 값 (0시 0분 예측값 데이터) KAFKA 전송
                 * ai_f_loc_le2  : 2지 AI 수위 예측 값 (0시 0분 예측값 데이터) KAFKA 전송
                 * ai_f_loc_le3  : 3지 AI 수위 예측 값 (0시 0분 예측값 데이터) KAFKA 전송
                 * ...
                 * ai_f_loc_le22 : 22지 AI 수위 예측 값 (0시 0분 예측값 데이터) KAFKA 전송
                 */
                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_wl(), LinkedHashMap.class); //location 별 10분간격 수위 데이터 집합
                keyList = new ArrayList<>(mapTemp.keySet()); //location1 ~ location22
                
                LinkedHashMap<String, Object> locationMapTemp = null;
                ArrayList<String> locationMapTempKeyList = null;
                
                int idx = nLocationMin;
                for(String key : keyList) {

                	String itmNm = "ai_f_loc_le"+idx;
                	
                	if(key.equalsIgnoreCase("location"+idx) == true) {
                		TagManageDTO dto = tagManageList.stream()
                                .filter(tagManage -> itmNm.equalsIgnoreCase(tagManage.getItm()))
                                .findAny()
                                .orElse(null);
                		
                		if(dto == null) {
                            continue;
                        }
                		
                		locationMapTemp = (LinkedHashMap<String, Object>) mapTemp.get(key);
                		locationMapTempKeyList = new ArrayList<>(locationMapTemp.keySet());
                		
                		strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), locationMapTemp.get(locationMapTempKeyList.get(0)), strDate));
                		kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                		sendCnt++;
                		idx++;
                		continue;
                	}
                }

                // AI 운영지 수 예측
                TagManageDTO aiFOperationCount = tagManageList.stream()
                        .filter(tagManage -> "ai_f_opr_cnt".equalsIgnoreCase(tagManage.getItm()))
                        .findAny()
                        .orElse(null);
                if(aiFOperationCount != null){
                    
                	locationMapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_num_fil(), LinkedHashMap.class);
                	locationMapTempKeyList = new ArrayList<>(locationMapTemp.keySet());
                	
                	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(aiFOperationCount.getTag_sn(), locationMapTemp.get(locationMapTempKeyList.get(0)), strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                }

                
                
                // AI 지별 운영 스케쥴 예측
                // TODO 지별 운영 스케줄 분석 개발 완료 이후 추가 수정 예정
                mapTemp = objectMapper.readValue(aiFilterRealtime.getAi_f_location_operation(), LinkedHashMap.class);
                keyList = new ArrayList<>(mapTemp.keySet()); //location1 ~ location22
                
    			SimpleDateFormat aiDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
    			SimpleDateFormat valueDateFormat = new SimpleDateFormat("MM-dd HH:mm");
                String strValueDate = "";
                Date valueDate = null;
                
                idx = nLocationMin;

                for(String key : keyList) {
                	
                	locationMapTemp = (LinkedHashMap<String, Object>) mapTemp.get(key);
                    ArrayList<String> locationKeyList = new ArrayList<>(locationMapTemp.keySet());
                    
                    for(String locationKey : locationKeyList) {
                    	
                        for(int i = nLocationMin; i <= nLocationMax; i++) {
                            
                        	String strStartTiName = "ai_f_start_ti" + i;
                            String strEndTiName = "ai_f_end_ti" + i;
                            String strBwStartTiName = "ai_f_bw_start_ti" + i;
                            
                            // AI 여과 시작 시간 예측
                            if(key.equalsIgnoreCase("location" + i) == true &&
                                    locationKey.equalsIgnoreCase("start") == true) {
                                TagManageDTO dto = tagManageList.stream()
                                        .filter(tagManage -> strStartTiName.equalsIgnoreCase(tagManage.getItm()))
                                        .findAny()
                                        .orElse(null);

                                if(dto == null){
                                    continue;
                                }

                                String strValue = locationMapTemp.get(locationKey).toString();
                                
                                if(strValue.equalsIgnoreCase("0") == true){
                                    strValueDate = "--";
                                } else {
                                    valueDate = aiDateFormat.parse(strValue);
                                    strValueDate = valueDateFormat.format(valueDate);
                                }
                                
                                
                                strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strValueDate, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                continue;
                                
                            } 
                            
                            // AI 여과 종료 시간 예측
                            else if(key.equalsIgnoreCase("location" + i) == true &&
                                    locationKey.equalsIgnoreCase("end") == true) {
                                TagManageDTO dto = tagManageList.stream()
                                        .filter(tagManage -> strEndTiName.equalsIgnoreCase(tagManage.getItm()))
                                        .findAny()
                                        .orElse(null);

                                if(dto == null) {
                                    continue;
                                }

                                String strValue = locationMapTemp.get(locationKey).toString();
                                if(strValue.equalsIgnoreCase("0") == true) {
                                    strValueDate = "--";
                                } else {
                                    valueDate = aiDateFormat.parse(strValue);
                                    strValueDate = valueDateFormat.format(valueDate);
                                }
                                
                                strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strValueDate, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                continue;
                                
                            }
                            
                            // AI 역세 시작 시간 예측
                            else if(key.equalsIgnoreCase("location" + i) == true &&
                                    locationKey.equalsIgnoreCase("bw_start") == true) {
                                TagManageDTO dto = tagManageList.stream()
                                        .filter(tagManage -> strBwStartTiName.equalsIgnoreCase(tagManage.getItm()))
                                        .findAny()
                                        .orElse(null);

                                if(dto == null) {
                                    continue;
                                }

                                String strValue = locationMapTemp.get(locationKey).toString();
                                if(strValue.equalsIgnoreCase("0") == true) {
                                    strValueDate = "--";
                                } else {
                                    valueDate = aiDateFormat.parse(strValue);
                                    strValueDate = valueDateFormat.format(valueDate);
                                }
                                
                                
                                strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strValueDate, strDate));
                                kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                                sendCnt++;
                                continue;
                                
                            }
                            
                            
                        }
                    }
                }
                
            } catch(JsonProcessingException e){
                log.error("JsonProcessingException Occurred in Filter Process");
            } catch(ParseException e) {
    			log.error("TextParse Exception Occurred in Filter Process");
    		}
        }
        return sendCnt;
	}
	
	/**
     * 소독 실시간 AI 예측값 전달
     * 
     * @param tagManageList
     */
	public int sendAiDisinfectionData(List<TagManageDTO> tagManageList) {
		int sendCnt = 0;
		AiDisinfectionRealtimeDTO aiDisinfectionPreRealtime = databaseService.getLatestAiDisinfectionRealtimeValue(1, 1); 
        log.debug("getLatestAiDisinfectionRealtimeValue PRE, result:[{}]", aiDisinfectionPreRealtime != null ? 1 : 0);

        AiDisinfectionRealtimeDTO aiDisinfectionPeriRealtime = databaseService.getLatestAiDisinfectionRealtimeValue(1, 2);
        log.debug("getLatestAiDisinfectionRealtimeValue PERI, result:[{}]", aiDisinfectionPeriRealtime != null ? 1 : 0);
        
        AiDisinfectionRealtimeDTO aiDisinfectionPostRealtime = databaseService.getLatestAiDisinfectionRealtimeValue(1, 3);
        log.debug("getLatestAiDisinfectionRealtimeValue POST, result:[{}]", aiDisinfectionPostRealtime != null ? 1 : 0);
        
        
        try {
        	
            LinkedHashMap<String, Object> controlMap;
            ObjectMapper objectMapper = new ObjectMapper();

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String strDate = simpleDateFormat.format(aiDisinfectionPreRealtime.getUpd_ti());
            String strBody;

            
            String[] oprAry = {"g_pre_operation_mode_a","g_peri_operation_mode_a","g_post_operation_mode_a"};
            int oprAryLength = oprAry.length;
            AiProcessInitDTO aiDisinfectionInit = null;
            

            /**
        	 * 소독 전차염 AI 모드 경보 KAFKA 전송
        	 * 소독 중차염 AI 모드 경보 KAFKA 전송
        	 * 소독 후차염 AI 모드 경보 KAFKA 전송
        	 */
            for(int i=0; i<oprAryLength; i++) {

            	if(oprAry[i].equalsIgnoreCase("g_pre_operation_mode_a")) {
            		aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE,1, i+1);
            	}else if(oprAry[i].equalsIgnoreCase("g_peri_operation_mode_a")) {
            		aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE,1, i+1);
            	}else if(oprAry[i].equalsIgnoreCase("g_post_operation_mode_a")) {
            		aiDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE,1, i+1);
            	}
            	
            	if(aiDisinfectionInit != null) {
            		
            		for(TagManageDTO dto : tagManageList) {
        				if(dto.getItm().equalsIgnoreCase(oprAry[i]) == true) {
                            strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), 
                            		aiDisinfectionInit.getInit_val().intValue() == CommonValue.OPERATION_MODE_MANUAL ? false : true, strDate));
                            kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                            sendCnt++;
                            break;
                        }
            		}
            		
            	}
            		
            }
            
            /**
             * ai_g_pre_upd_ti		 	: 소독 전차염 공정 분석 결과 시간 KAFKA 전송
             * ai_g_pre_evap		 	: 전차염 AI 침전지 증발량 예측 값 KAFKA 전송
             * ai_g_pre_chlorination	: 전차염 AI 주입률 예측 값 KAFKA 전송
             * ai_g_peri_upd_ti		 	: 소독 중차염 공정 분석 결과 시간 KAFKA 전송
             * ai_g_peri_chlorination	: 중차염 AI 주입률 예측 값 KAFKA 전송
             * ai_g_post_upd_ti			: 소독 후차염 공정 분석 결과 시간 KAFKA 전송
             * 
             */
            for(TagManageDTO dto : tagManageList) {
            	
            	// 소독 공정이 아닌 TAG MNG는 continue
                if(dto.getProc_cd().equalsIgnoreCase(CommonValue.PROCESS_DISINFECTION) != true) {
                    continue;
                }

                // 소독 전차염 KAFKA 전송 START -------------------------------------------------
                if(dto.getItm().equalsIgnoreCase("ai_g_pre_upd_ti") == true) {
                    strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                } else if(dto.getItm().equalsIgnoreCase("ai_g_pre_evap") == true) {
                    strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiDisinfectionPreRealtime.getAi_g_pre_evap(), strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                } else if(dto.getItm().equalsIgnoreCase("ai_g_pre_chlorination") == true) {
                    strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiDisinfectionPreRealtime.getAi_g_pre_chol(), strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                }
                // 소독 전차염 KAFKA 전송 END -------------------------------------------------
                
                
                // 소독 중차염 KAFKA 전송 START -------------------------------------------------
                if(dto.getItm().equalsIgnoreCase("ai_g_peri_upd_ti") == true) {
                    strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                } else if(dto.getItm().equalsIgnoreCase("ai_g_peri_chlorination") == true) {
                	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiDisinfectionPeriRealtime.getAi_g_peri_chol(), strDate));
                	kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                	sendCnt++;
                }
                // 소독 중차염 KAFKA 전송 END -------------------------------------------------

                
                // 소독 후차염 KAFKA 전송 START -------------------------------------------------
                if(dto.getItm().equalsIgnoreCase("ai_g_post_upd_ti") == true) {
                    strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), strDate, strDate));
                    kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                    sendCnt++;
                } else if(dto.getItm().equalsIgnoreCase("ai_g_post_chlorination") == true) {
                	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiDisinfectionPostRealtime.getAi_g_post_chol(), strDate));
                	kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                	sendCnt++;
                } else if(dto.getItm().equalsIgnoreCase("ai_g_correct_degree") == true) {
                	strBody = objectMapper.writeValueAsString(tagMapService.getControlMap(dto.getTag_sn(), aiDisinfectionPostRealtime.getAi_g_correct_degree(), strDate));
                	kafkaProducer.sendMessageToLocal(CommonValue.KAFKA_TOPIC_RESULT, strBody);
                	sendCnt++;
                }
                // 소독 후차염 KAFKA 전송 END -------------------------------------------------
            }
            
            
        } catch(JsonProcessingException e) {
            log.error("JsonProcessingException Occurred in Disinfection Process");
        }
        return sendCnt;
	}
	
	/**
     * 착수 CTR조회
     */
	public void getReceivingControl() {
		// 1. get operation mode
        AiProcessInitDTO aiReceivingInit = databaseService.getAiReceivingInit(CommonValue.B_OPERATION_MODE, 1);
        log.debug("getAiReceivingInit, result:[{}]", aiReceivingInit != null ? 1 : 0);

        if(aiReceivingInit != null)
        {
            int nOperationMode = aiReceivingInit.getInit_val().intValue();

         // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                // 2. get latest(10minutes) control value(kafka_flag = 0)
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();
                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);
                
                List<AiProcessControlDTO> aiReceivingControlList = databaseService.getListAiReceivingControl(queryDto);
                
                // CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiReceivingControlList.size() > 0)
                {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    
                    // 자동모드 history insert시 TB_ALM_NTF 반환 변수
                    int almSeq = 0;
                    try
                    {
                        for(AiProcessControlDTO dto : aiReceivingControlList)
                        {
                        	InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_RECEIVING);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());
                            
                            // CTR에 있는 태그가 ALM에 존재하는지 확인
                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            
                            // 존재한다면 4번 알람 노출
                            if(alarmExceededInfo != null) {	// 임계치 제어에 해당
                                if(bFirst == true) {
                                	rnti = dto.getRnti();
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiReceivingControlKafkaFlag(updateDto);
                                }
                            } else {
                            	// 존재하지 않다면 반자동/자동 구분하여 2번 알람 노출
                            	if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO)
                            	{
                        			// 3. if operation_mode==1 (semi_auto)
                        			// 3-1. send control value to kafka ai_popup
                            		AlarmInfoDTO alarmInfo =
                        					alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_RECEIVING_AI_CONTROL);
                        			if(alarmInfo != null)
                        			{
                        				// KAFKA topic is called only once.
                        				if(bFirst == true)
                        				{
                        					rnti = dto.getRnti();
                        					LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                        					popupMap.put("alarm_id", alarmInfo.getAlm_id());
                        					popupMap.put("message", alarmInfo.getDp_nm());
                        					popupMap.put("url", alarmInfo.getUrl());
                        					popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                        					strBody = objectMapper.writeValueAsString(popupMap);
                        					kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);
                        					
                        					bFirst = false;
                        				}
                        				
                        				if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                        					// 3-2. update kafka_flag=1 (kafka_popup)
                        					AiProcessControlDTO updateDto = dto;
                        					updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                        					updateDto.setProcessStep(1);
                        					databaseService.modAiReceivingControlKafkaFlag(updateDto);
                        				}
                        			}
                        			else
                        			{
                        				log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_RECEIVING_AI_CONTROL);
                        			}
                            	}
                            	else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO)
                            	{
                            		AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_RECEIVING_AI_CONTROL);
                            		Date currentDate = new Date();
                            		// rnti를 최초 1번만 세팅하고 이후 동일한 시간을 비교하기 위한 처리
                            		if(alarmInfo != null) {
                            			if(bFirst == true) {
                            				rnti = dto.getRnti();
                            				// rnti가 동일할 경우 TB_ALM_NTF 에서 반환되는 almSeq는 동일한 값으로 세팅 필요
                            				almSeq = alarmService.alarmNotify(
                            						alarmInfo.getAlm_id(),
                            						alarmInfo.getDp_nm(),
                            						alarmInfo.getUrl(),
                            						simpleDateFormat.format(currentDate)
                            						);
                            				bFirst = false;
                            			}
                            			
                            			// 동일한 시간일 경우에만 이번 스케줄에 수행. 시간이 다를 경우 다음 스케줄에 수행
                            			if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                            				// 4-1. send control value to kafka ai_control
                            				LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                            				controlMap.put("tag", dto.getTag_sn());
                            				if(dto.getTag_val().equalsIgnoreCase(CommonValue.CONTROL_TRUE) == true)
                            				{
                            					controlMap.put("value", true);
                            				}
                            				else
                            				{
                            					controlMap.put("value", Float.parseFloat(dto.getTag_val()));
                            				}
                            				controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                            				strBody = objectMapper.writeValueAsString(controlMap);
                            				kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);
                            				
                            				// 4-2. update kafka_flag=3 (kafka_send)
                            				AiProcessControlDTO updateDto = dto;
                            				updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                            				updateDto.setProcessStep(1);
                            				databaseService.modAiReceivingControlKafkaFlag(updateDto);
                            				
                            				// 4-3. insert TB_ALM_CTR_HIS 
                            				if(almSeq !=0) {
                            					//ctrHisList insert 
                            					AlmCtrHisDTO his = new AlmCtrHisDTO();
                            					his.setAlm_id(alarmInfo.getAlm_id());
                            					his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            					his.setAlm_ty(alarmInfo.getAlm_ty());
                            					his.setCtr_ti(currentDate);	// 현재시간
                            					his.setCtr_yn("A");
                            					his.setTag_sn(dto.getTag_sn());
                            					his.setUpd_ti(dto.getUpd_ti());
                            					databaseService.insertAlarmControlHistory(his);
                            				}
                            			}
                            		} else {
                        				log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_RECEIVING_AI_CONTROL);
                        			}
                            	}
                            }
                        } // for문 끝
                        // 착수는 자동모드일 경우에도 RNTI별로 별도 제어로 변경
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
//                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
//                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_RECEIVING_AI_CONTROL);
//                            Date currentDate = new Date();
//                            
//                            // insert alarm_notify & get almSeq
//                            int almSeq = alarmService.alarmNotify(
//                            		alarmInfo.getAlm_id(),
//                            		alarmInfo.getDp_nm(),
//                                    alarmInfo.getUrl(),
//                                    simpleDateFormat.format(currentDate)
//                            );
//                            if(almSeq !=0) {
//                            	//ctrHisList insert 
//                            	for(AiProcessControlDTO ctr : aiReceivingControlList) {
//                            		AlmCtrHisDTO his = new AlmCtrHisDTO();
//                            		his.setAlm_id(alarmInfo.getAlm_id());
//                            		his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
//                            		his.setAlm_ty(alarmInfo.getAlm_ty());
//                            		his.setCtr_ti(currentDate);	// 현재시간
//                            		his.setCtr_yn("A");
//                            		his.setTag_sn(ctr.getTag_sn());
//                            		his.setUpd_ti(ctr.getUpd_ti());
//                            		databaseService.insertAlarmControlHistory(his);
//                            	}
//                            }
//                        }
                    }
                    catch(JsonProcessingException e)
                    {
                        log.error("JsonProcessingException Occurred in Receiving Control Process");
                    }
                    catch(NumberFormatException e)
                    {
                        log.error("NumberException Occurred in Receiving Control Process");
                    }
                }
            }
        }
	}
	
	/**
     * 약품 CTR조회
     */
	public void getCoagulantControl() {
		// 1. get operation mode
        AiProcessInitDTO aiCoagulantInit = databaseService.getAiCoagulantInit(CommonValue.C_OPERATION_MODE, 1);
        log.debug("getAiCoagulantInit, result:[{}]", aiCoagulantInit != null ? 1 : 0);

        if(aiCoagulantInit != null) {
            int nOperationMode = aiCoagulantInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                // 2. get latest(10minutes) control value(kafka_flag = 0)
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();

                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);

                List<AiProcessControlDTO> aiCoagulantControlList = databaseService.getListAiCoagulantControl(queryDto);
                
                // CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiCoagulantControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    boolean alarmExceededFlag = false; //임계치 알람 해당 여부
                    try {
                        for(AiProcessControlDTO dto : aiCoagulantControlList) {
                            InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_COAGULANT);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());

                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            if(alarmExceededInfo != null) { //임계치 제어에 해당
                            	alarmExceededFlag = true;
                                if(bFirst == true) {
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    rnti = dto.getRnti();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiCoagulantControlKafkaFlag(updateDto);
                                }
                            } else {
                                if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                
                                    // 3. if operation_mode==1 (semi_auto)
                                    // 3-1. send control value to kafka ai_popup
                                    AlarmInfoDTO alarmInfo =
                                            alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_COAGULANT_AI_CONTROL);
                                    if(alarmInfo != null) {
                                        // KAFKA topic is called only once.
                                        if(bFirst == true) {
                                            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                            rnti = dto.getRnti();
                                            popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                            popupMap.put("message", alarmInfo.getDp_nm());
                                            popupMap.put("url", alarmInfo.getUrl());
                                            popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                            strBody = objectMapper.writeValueAsString(popupMap);
                                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                            bFirst = false;
                                        }
                                        if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                        	// 3-2. update kafka_flag=1 (kafka_popup)
                                        	AiProcessControlDTO updateDto = dto;
                                        	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                        	updateDto.setProcessStep(1);
                                        	databaseService.modAiCoagulantControlKafkaFlag(updateDto);
                                        }
                                    } else {
                                        log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_COAGULANT_AI_CONTROL);
                                    }         
                                } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                    // 4. if operation_mode==2 (full_auto)

                                    // 4-1. send control value to kafka ai_control
                                    LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                    controlMap.put("tag", dto.getTag_sn());
                                    controlMap.put("value", dto.getTag_val().equalsIgnoreCase(CommonValue.CONTROL_TRUE) ? true : Float.parseFloat(dto.getTag_val()));
                                    controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(controlMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                    // 4-2. update kafka_flag=3 (kafka_send)
                                    AiProcessControlDTO updateDto = dto;
                                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                    updateDto.setProcessStep(1);
                                    databaseService.modAiCoagulantControlKafkaFlag(updateDto);
                                }     
                            }
                        } // for문 끝
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_COAGULANT_AI_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiCoagulantControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_COAGULANT_AI_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Receiving Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Receiving Control Process");
                    }
                }
            }
        }
	}

	/**
     * 혼화응집 CTR조회
     */
	public void getMixingControl() {
		// 1. get operation mode
        AiProcessInitDTO aiMixingInit = databaseService.getAiMixingInit(CommonValue.D_OPERATION_MODE, 1);
        log.debug("getAiMixingInit, result:[{}]", aiMixingInit != null ? 1 : 0);

        if(aiMixingInit != null) {
            int nOperationMode = aiMixingInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();

                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);

                // 2. get latest(10 minutes) control value(kafka_flag = 0)
                List<AiProcessControlDTO> aiMixingControlList = databaseService.getListAiMixingControl(queryDto);
                
                // CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiMixingControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    boolean alarmExceededFlag = false; //임계치 알람 해당 여부
                    try {
                        for(AiProcessControlDTO dto : aiMixingControlList) {
                            InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_MIXING);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());
                            
                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            if(alarmExceededInfo != null) { //임계치 제어에 해당
                            	alarmExceededFlag = true;
                                if(bFirst == true) {
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    rnti = dto.getRnti();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiMixingControlKafkaFlag(updateDto);
                                }
                            } else {
                                if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                    // 3. if operation_mode==1 (semi_auto)
                                    // 3-1. send control value to kafka ai_popup
                                    AlarmInfoDTO alarmInfo =
                                            alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_MIXING_AI_CONTROL);
                                    if(alarmInfo != null) {
                                        // KAFKA topic is called only once.
                                        if(bFirst == true) {
                                            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                            rnti = dto.getRnti();
                                            popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                            popupMap.put("message", alarmInfo.getDp_nm());
                                            popupMap.put("url", alarmInfo.getUrl());
                                            popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                            strBody = objectMapper.writeValueAsString(popupMap);
                                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                            bFirst = false;
                                        }
                                        if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                        	// 3-2. update kafka_flag=1 (kafka_popup)
                                        	AiProcessControlDTO updateDto = dto;
                                        	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                        	updateDto.setProcessStep(1);
                                        	databaseService.modAiMixingControlKafkaFlag(updateDto);
                                        }
                                    } else {
                                        log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_MIXING_AI_CONTROL);
                                    }
                                }  else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                    // 4. if operation_mode==2 (full_auto)

                                    // 4-1. send control value to kafka ai_control
                                    LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                    controlMap.put("tag", dto.getTag_sn());
                                    controlMap.put("value", Float.parseFloat(dto.getTag_val()));
                                    controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(controlMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                    // 4-2. update kafka_flag=3 (kafka_send)
                                    AiProcessControlDTO updateDto = dto;
                                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                    updateDto.setProcessStep(1);
                                    databaseService.modAiMixingControlKafkaFlag(updateDto);
                                }
                            }
                        } // for문 끝
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_MIXING_AI_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiMixingControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_MIXING_AI_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Mixing Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Mixing Control Process");
                    }
                }
            }
        }
	}

	/**
     * 침전 CTR조회
     */
	public void getSedimentationControl() {
		// 1. get operation mode
        AiProcessInitDTO aiSedimentationInit = databaseService.getAiSedimentationInit(CommonValue.E_OPERATION_MODE, 1);
        log.debug("getAiSedimentationInit, result:[{}]", aiSedimentationInit != null ? 1 : 0);

        if(aiSedimentationInit != null)
        {
            int nOperationMode = aiSedimentationInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();

                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);

                // 2. get latest(10minutes) control value(kafka_flag = 0)
                List<AiProcessControlDTO> aiSedimentationControlList = databaseService.getListAiSedimentationControl(queryDto);
                
                // 침전은 임계치 알람 존재하지 않음. 기존 로직 그대로
                if(aiSedimentationControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    try {
                        for(AiProcessControlDTO dto : aiSedimentationControlList) {
                            if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                // 3. if operation_mode==1 (semi_auto)
                                // 3-1. send control value to kafka ai_popup
                                AlarmInfoDTO alarmInfo =
                                        alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_SEDIMENTATION_AI_CONTROL);
                                if(alarmInfo != null) {
                                    // KAFKA topic is called only once.
                                    if(bFirst == true) {
                                        LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                        rnti = dto.getRnti();
                                        popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                        popupMap.put("message", alarmInfo.getDp_nm());
                                        popupMap.put("url", alarmInfo.getUrl());
                                        popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                        strBody = objectMapper.writeValueAsString(popupMap);
                                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                        bFirst = false;
                                    }
                                    if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                    	// 3-2. update kafka_flag=1 (kafka_popup)
                                    	AiProcessControlDTO updateDto = dto;
                                    	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                    	updateDto.setProcessStep(1);
                                    	databaseService.modAiSedimentationControlKafkaFlag(updateDto);
                                    }
                                } else {
                                    log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_SEDIMENTATION_AI_CONTROL);
                                }
                            } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                // 4. if operation_mode==2 (full_auto)

                                // 4-1. send control value to kafka ai_control
                                LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                controlMap.put("tag", dto.getTag_sn());
                                controlMap.put("value", dto.getTag_val().equalsIgnoreCase(CommonValue.CONTROL_TRUE) ? true : Float.parseFloat(dto.getTag_val()));
                                controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                strBody = objectMapper.writeValueAsString(controlMap);
                                kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                // 4-2.update kafka_flag=3 (kafka_send)
                                AiProcessControlDTO updateDto = dto;
                                updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                updateDto.setProcessStep(1);
                                databaseService.modAiSedimentationControlKafkaFlag(updateDto);
                            }
                        } // for문 끝
                        //자동모드인 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_SEDIMENTATION_AI_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiSedimentationControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_SEDIMENTATION_AI_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Sedimentation Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Sedimentation Control Process");
                    }
                }
            }
        }
	}

	/**
     * 여과 CTR조회
     */
	public void getFilterControl() {
		// 1. get operation mode
        AiProcessInitDTO aiFilterInit = databaseService.getAiFilterInit(CommonValue.F_OPERATION_MODE, 1);
        log.debug("getAiFilterInit, result:[{}]", aiFilterInit != null ? 1 : 0);

        if(aiFilterInit != null)
        {
            int nOperationMode = aiFilterInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();

                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);

                // 2. get latest(10 minutes) control value(kafka_flag = 0)
                List<AiProcessControlDTO> aiFilterControlList = databaseService.getListAiFilterControl(queryDto);
                
                // 여과는 임계치 알람 존재하지 않음. 기존 로직 그대로
                if(aiFilterControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    try {
                        for(AiProcessControlDTO dto : aiFilterControlList) {
                            if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                // 3. if operation_mode==1 (semi_auto)
                                // 3-1. send control value to kafka ai_popup
                                AlarmInfoDTO alarmInfo =
                                        alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_FILTER_AI_CONTROL);
                                if(alarmInfo != null) {
                                    // KAFKA topic is called only once.
                                    if(bFirst == true) {
                                        LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                        rnti = dto.getRnti();
                                        popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                        popupMap.put("message", alarmInfo.getDp_nm());
                                        popupMap.put("url", alarmInfo.getUrl());
                                        popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                        strBody = objectMapper.writeValueAsString(popupMap);
                                        kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                        bFirst = false;
                                    }
                                    if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                    	// 3-2. update kafka_flag=1 (kafka_popup)
                                    	AiProcessControlDTO updateDto = dto;
                                    	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                    	updateDto.setProcessStep(1);
                                    	databaseService.modAiFilterControlKafkaFlag(updateDto);
                                    }
                                } else {
                                    log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_FILTER_AI_CONTROL);
                                }
                            } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                // 4. if operation_mode==2 (full_auto)
                                // 4-1. send control value to kafka ai_control
                                LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                controlMap.put("tag", dto.getTag_sn());
                                controlMap.put("value", dto.getTag_val().equalsIgnoreCase(CommonValue.CONTROL_TRUE) ? true : Float.parseFloat(dto.getTag_val()));
                                controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                strBody = objectMapper.writeValueAsString(controlMap);
                                kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                // 4-2. update kafka_flag=3 (kafka_send)
                                AiProcessControlDTO updateDto = dto;
                                updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                updateDto.setProcessStep(1);
                                databaseService.modAiFilterControlKafkaFlag(updateDto);
                            }
                        } // for문 끝
                        //자동모드인 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_FILTER_AI_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiFilterControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            }  else {
                                log.error("Does not exist alarmInfo:[{}]", CommonValue.ALARM_CODE_FILTER_AI_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Filter Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Filter Control Process");
                    }
                }
            }
        }
	}

	/**
     * 소독 CTR조회
     */
	public void getDisinfectionControl() {
		// 1. get operation mode - pre disinfection
        AiProcessInitDTO aiPreDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PRE_OPERATION_MODE, 1, CommonValue.DISINFECTION_PRE_STEP);
        log.debug("getAiDisinfectionInit, result:[{}]", aiPreDisinfectionInit != null ? 1 : 0);

        if(aiPreDisinfectionInit != null)
        {
            int nOperationMode = aiPreDisinfectionInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
            {
                // 2. get latest(10minutes) control value(kafka_flag = 0)
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.MINUTE, -10);
                Date runTime = calendar.getTime();

                AiProcessControlDTO queryDto = new AiProcessControlDTO();
                queryDto.setRnti(runTime);
                queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
                queryDto.setProcessStep(1);

                List<AiProcessControlDTO> aiDisinfectionControlList = databaseService.getListAiPreDisinfectionControl(queryDto);
                
                // CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiDisinfectionControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    boolean alarmExceededFlag = false; //임계치 알람 해당 여부
                    try {
                        for(AiProcessControlDTO dto : aiDisinfectionControlList) {
                            InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_DISINFECTION);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setDisinfectionIndex(CommonValue.DISINFECTION_PRE_STEP);
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());

                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            if(alarmExceededInfo != null) { //임계치 제어에 해당
                            	alarmExceededFlag = true;
                                if(bFirst == true) {
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    rnti = dto.getRnti();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiPreDisinfectionControlKafkaFlag(updateDto);
                                }
                            } else {
                                if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                    // 3. if operation_mode==1 (semi_auto)
                                    // 3-1. send control value to kafka ai_popup
                                    AlarmInfoDTO alarmInfo =
                                            alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_PRE_CONTROL);
                                    if(alarmInfo != null) {
                                        // KAFKA topic is called only once.
                                        if(bFirst == true) {
                                            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                            rnti = dto.getRnti();
                                            popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                            popupMap.put("message", alarmInfo.getDp_nm());
                                            popupMap.put("url", alarmInfo.getUrl());
                                            popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                            strBody = objectMapper.writeValueAsString(popupMap);
                                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                            bFirst = false;
                                        }
                                        if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                        	// 3-2. update kafka_flag=1 (kafka_popup)
                                        	AiProcessControlDTO updateDto = dto;
                                        	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                        	updateDto.setProcessStep(1);
                                        	databaseService.modAiPreDisinfectionControlKafkaFlag(updateDto);
                                        }
                                    } else {
                                        log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_PRE_CONTROL);
                                    }
                                } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                    // 4. if operation_mode==2 (full_auto)

                                    // 4-1. send control value to kafka ai_control
                                    LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                    controlMap.put("tag", dto.getTag_sn());
                                    controlMap.put("value", Float.parseFloat(dto.getTag_val()));
                                    controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(controlMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                    // 4-2. update kafka_flag=3 (kafka_send)
                                    AiProcessControlDTO updateDto = dto;
                                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                    updateDto.setProcessStep(1);
                                    databaseService.modAiPreDisinfectionControlKafkaFlag(updateDto);
                                }
                            }
                        } // for문 끝
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_PRE_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiDisinfectionControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_PRE_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Pre Disinfection Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Pre Disinfection Control Process");
                    }
                }
            }
        }

        // 1. get operation mode - peri disinfection
        AiProcessInitDTO aiPeriDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_PERI_OPERATION_MODE, 1, CommonValue.DISINFECTION_PERI_STEP);
        log.debug("getAiDisinfectionInit, result:[{}]", aiPeriDisinfectionInit != null ? 1 : 0);

        if(aiPeriDisinfectionInit != null)
        {
            int nOperationMode = aiPeriDisinfectionInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
    		{
    			// 2. get latest(10minutes) control value(kafka_flag = 0)
    			Calendar calendar = Calendar.getInstance();
    			calendar.add(Calendar.MINUTE, -10);
    			Date runTime = calendar.getTime();
    			
    			AiProcessControlDTO queryDto = new AiProcessControlDTO();
    			queryDto.setRnti(runTime);
    			queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
    			queryDto.setProcessStep(1);
    			
    			List<AiProcessControlDTO> aiDisinfectionControlList = databaseService.getListAiPeriDisinfectionControl(queryDto);
    			
    			// CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiDisinfectionControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    boolean alarmExceededFlag = false; //임계치 알람 해당 여부
                    try {
                        for(AiProcessControlDTO dto : aiDisinfectionControlList) {
                            InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_DISINFECTION);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setDisinfectionIndex(CommonValue.DISINFECTION_PERI_STEP);
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());

                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            if(alarmExceededInfo != null) { //임계치 제어에 해당
                            	alarmExceededFlag = true;
                                if(bFirst == true) {
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    rnti = dto.getRnti();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiPeriDisinfectionControlKafkaFlag(updateDto);
                                }
                            } else {
                                if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                    // 3. if operation_mode==1 (semi_auto)
                                    // 3-1. send control value to kafka ai_popup
                                    AlarmInfoDTO alarmInfo =
                                            alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_PERI_CONTROL);
                                    if(alarmInfo != null) {
                                        // KAFKA topic is called only once.
                                        if(bFirst == true) {
                                            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                            rnti = dto.getRnti();
                                            popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                            popupMap.put("message", alarmInfo.getDp_nm());
                                            popupMap.put("url", alarmInfo.getUrl());
                                            popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                            strBody = objectMapper.writeValueAsString(popupMap);
                                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                            bFirst = false;
                                        }
                                        if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                        	// 3-2. update kafka_flag=1 (kafka_popup)
                                        	AiProcessControlDTO updateDto = dto;
                                        	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                        	updateDto.setProcessStep(1);
                                        	databaseService.modAiPeriDisinfectionControlKafkaFlag(updateDto);
                                        }
                                    } else {
                                        log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_PERI_CONTROL);
                                    }
                                } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                    // 4. if operation_mode==2 (full_auto)

                                    // 4-1. send control value to kafka ai_control
                                    LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                    controlMap.put("tag", dto.getTag_sn());
                                    controlMap.put("value", Float.parseFloat(dto.getTag_val()));
                                    controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(controlMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                    // 4-2. update kafka_flag=3 (kafka_send)
                                    AiProcessControlDTO updateDto = dto;
                                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                    updateDto.setProcessStep(1);
                                    databaseService.modAiPeriDisinfectionControlKafkaFlag(updateDto);
                                }
                            }
                        } // for문 끝
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_PERI_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiDisinfectionControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_PERI_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Peri Disinfection Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Peri Disinfection Control Process");
                    }
                }
    		}
        }

        // 1. get operation mode - post disinfection
        AiProcessInitDTO aiPostDisinfectionInit = databaseService.getAiDisinfectionInit(CommonValue.G_POST_OPERATION_MODE, 1, CommonValue.DISINFECTION_POST_STEP);
        log.debug("getAiDisinfectionInit, result:[{}]", aiPostDisinfectionInit != null ? 1 : 0);

        if(aiPostDisinfectionInit != null)
        {
            int nOperationMode = aiPostDisinfectionInit.getInit_val().intValue();

            // 수동 모드일 경우 전송하지 않음
            if(nOperationMode > CommonValue.OPERATION_MODE_MANUAL)
    		{
    			// 2. get latest(10minutes) control value(kafka_flag = 0)
    			Calendar calendar = Calendar.getInstance();
    			calendar.add(Calendar.MINUTE, -10);
    			Date runTime = calendar.getTime();
    			
    			AiProcessControlDTO queryDto = new AiProcessControlDTO();
    			queryDto.setRnti(runTime);
    			queryDto.setKfk_flg(CommonValue.KAFKA_FLAG_INIT);
    			queryDto.setProcessStep(1);
    			
    			List<AiProcessControlDTO> aiDisinfectionControlList = databaseService.getListAiPostDisinfectionControl(queryDto);
    			
    			// CTR 테이블에 데이터가 존재할때,
                // ALM 테이블에 해당 태그가 존재하면 -> 4번 알람 노출
                // ALM 테이블에 해당 태그가 존재하지 않으면 -> 반자동/자동 구분하여 2번 알람 노출 (기존 로직)
                if(aiDisinfectionControlList.size() > 0) {
                    String strBody;
                    boolean bFirst = true;
                    ObjectMapper objectMapper = new ObjectMapper();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date rnti = new Date();
                    boolean alarmExceededFlag = false; //임계치 알람 해당 여부
                    try {
                        for(AiProcessControlDTO dto : aiDisinfectionControlList) {
                            InterfaceAlarmControlHistoryDTO paramAlarm = new InterfaceAlarmControlHistoryDTO();
                            paramAlarm.setAlm_ntf_ti(dto.getRnti());
                            paramAlarm.setProcess(CommonValue.PROCESS_DISINFECTION);
                            paramAlarm.setProcessStep(String.valueOf(1));
                            paramAlarm.setDisinfectionIndex(CommonValue.DISINFECTION_POST_STEP);
                            paramAlarm.setAlmTy(CommonValue.ALARM_TYPE_THRESHOLD_EXCEEDED);
                            paramAlarm.setUpdTi(dto.getUpd_ti());
                            paramAlarm.setTagSn(dto.getTag_sn());

                            InterfaceAlarmControlHistoryDTO alarmExceededInfo = databaseService.getAlarmExceeded(paramAlarm);
                            if(alarmExceededInfo != null) { //임계치 제어에 해당
                            	alarmExceededFlag = true;
                                if(bFirst == true) {
                                    LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                    rnti = dto.getRnti();
                                    popupMap.put("alarm_id", alarmExceededInfo.getAlm_id());
                                    popupMap.put("message", alarmExceededInfo.getDp_nm());
                                    popupMap.put("url", alarmExceededInfo.getUrl());
                                    popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(popupMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                    bFirst = false;
                                }
                                if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                	// 3-2. update kafka_flag=1 (kafka_popup)
                                	AiProcessControlDTO updateDto = dto;
                                	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                	updateDto.setProcessStep(1);
                                	databaseService.modAiPostDisinfectionControlKafkaFlag(updateDto);
                                }
                            } else {
                                if(nOperationMode == CommonValue.OPERATION_MODE_SEMI_AUTO) {
                                    // 3. if operation_mode==1 (semi_auto)
                                    // 3-1. send control value to kafka ai_popup
                                    AlarmInfoDTO alarmInfo =
                                            alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_POST_CONTROL);
                                    if(alarmInfo != null) {
                                        // KAFKA topic is called only once.
                                        if(bFirst == true) {
                                            LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
                                            rnti = dto.getRnti();
                                            popupMap.put("alarm_id", alarmInfo.getAlm_id());
                                            popupMap.put("message", alarmInfo.getDp_nm());
                                            popupMap.put("url", alarmInfo.getUrl());
                                            popupMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                            strBody = objectMapper.writeValueAsString(popupMap);
                                            kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);

                                            bFirst = false;
                                        }
                                        if(!bFirst && dto.getRnti().compareTo(rnti) == 0) {
                                        	// 3-2. update kafka_flag=1 (kafka_popup)
                                        	AiProcessControlDTO updateDto = dto;
                                        	updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_POPUP);
                                        	updateDto.setProcessStep(1);
                                        	databaseService.modAiPostDisinfectionControlKafkaFlag(updateDto);
                                        }
                                    } else {
                                        log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_POST_CONTROL);
                                    }
                                } else if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO) {
                                    // 4. if operation_mode==2 (full_auto)

                                    // 4-1. send control value to kafka ai_control
                                    LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
                                    controlMap.put("tag", dto.getTag_sn());
                                    controlMap.put("value", Float.parseFloat(dto.getTag_val()));
                                    controlMap.put("time", simpleDateFormat.format(dto.getRnti()));
                                    strBody = objectMapper.writeValueAsString(controlMap);
                                    kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_CONTROL, strBody);

                                    // 4-2. update kafka_flag=3 (kafka_send)
                                    AiProcessControlDTO updateDto = dto;
                                    updateDto.setKfk_flg(CommonValue.KAFKA_FLAG_SEND);
                                    updateDto.setProcessStep(1);
                                    databaseService.modAiPostDisinfectionControlKafkaFlag(updateDto);
                                }
                            }
                        } // for문 끝
                        //자동모드이면서 && 임계치 알람이 아닌 경우( = AI제어 알람인 경우) -- 이력 업데이트.
                        if(nOperationMode == CommonValue.OPERATION_MODE_FULL_AUTO && !alarmExceededFlag) {
                            AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(CommonValue.ALARM_CODE_DISINFECTION_AI_POST_CONTROL);
                            Date currentDate = new Date();
                            
                            // insert alarm_notify & get almSeq
                            if(alarmInfo != null) {
                            	int almSeq = alarmService.alarmNotify(
                            			alarmInfo.getAlm_id(),
                            			alarmInfo.getDp_nm(),
                            			alarmInfo.getUrl(),
                            			simpleDateFormat.format(currentDate)
                            			);
                            	if(almSeq !=0) {
                            		//ctrHisList insert 
                            		for(AiProcessControlDTO ctr : aiDisinfectionControlList) {
                            			AlmCtrHisDTO his = new AlmCtrHisDTO();
                            			his.setAlm_id(alarmInfo.getAlm_id());
                            			his.setSeq(almSeq); // alarmNotify에 넣을때 사용한 seq를 반환받아서 넣어야함.
                            			his.setAlm_ty(alarmInfo.getAlm_ty());
                            			his.setCtr_ti(currentDate);	// 현재시간
                            			his.setCtr_yn("A");
                            			his.setTag_sn(ctr.getTag_sn());
                            			his.setUpd_ti(ctr.getUpd_ti());
                            			databaseService.insertAlarmControlHistory(his);
                            		}
                            	}
                            } else {
                                log.error("Does not exist alarmInfo:[{]]", CommonValue.ALARM_CODE_DISINFECTION_AI_POST_CONTROL);
                            }
                        }
                    } catch(JsonProcessingException e) {
                        log.error("JsonProcessingException Occurred in Post Disinfection Control Process");
                    } catch(NumberFormatException e) {
                        log.error("NumberException Occurred in Post Disinfection Control Process");
                    }
                }
    		}
        }
	}

    /**
     * 각 서비스의 컨테이너 연결 이상 시 서비스 통신 연결 알람(팝업창) 발생
     * @param token
     */
    @RequestMapping(value = "/internal/serviceStatus", method = RequestMethod.GET)
    public void getServiceStatus(@RequestHeader("X-ACCESS-TOKEN") String token, @RequestHeader("SERVER") String server, @RequestHeader("SERVICE") String service) {
    	// Token Check
        if(propertiesAuthentication.getInternalToken().equalsIgnoreCase(token) == false) {
            log.error("getServiceStatus, Invalid X-ACCESS-TOKEN:[{}]", token);
            return;
        }

        LocalDateTime today = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        String strBody;
        ObjectMapper objectMapper = new ObjectMapper();

        LinkedHashMap<String, Object> popupMap = new LinkedHashMap<>();
        String alarmCdNm = server + "_" + service + "_connection_error";
        AlarmInfoDTO alarmInfo = alarmInfoList.getAlarmInfoFromAlarmCode(alarmCdNm);
        if (alarmInfo != null) {
        	popupMap.put("alarm_id", alarmInfo.getAlm_id());
        	popupMap.put("message", alarmInfo.getDp_nm());
        	popupMap.put("url", alarmInfo.getUrl());
        	popupMap.put("time", today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        	try {
        		strBody = objectMapper.writeValueAsString(popupMap);
        		kafkaProducer.sendMessageToVip(CommonValue.KAFKA_TOPIC_POPUP, strBody);
        		log.error("[Collector] " + server + "-" + service + " is dead");
        	} catch (JsonProcessingException e) {
        		log.error("JsonProcessingException");
        	}
        } else {
			log.error("Does not exist alarmInfo:[{}]", alarmCdNm);
		}
    }
}
