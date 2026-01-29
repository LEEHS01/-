package co.irexnet.waio.WAIO_ServerAgent.service;

import java.util.LinkedHashMap;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation1RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation2RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation3RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation4RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation5RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation6RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation7RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation8RealtimeDTO;

public interface IMakeTagMapService {
	LinkedHashMap<String, Object> getControlMap(String tagSn, Object value , String time);
	
	//침전 공정 각 지별 DTO GET 기능
	AiSedimentationLocation1RealtimeDTO getLocation1Dto (String jsonMap);
	AiSedimentationLocation2RealtimeDTO getLocation2Dto (String jsonMap);
	AiSedimentationLocation3RealtimeDTO getLocation3Dto (String jsonMap);
	AiSedimentationLocation4RealtimeDTO getLocation4Dto (String jsonMap);
	AiSedimentationLocation5RealtimeDTO getLocation5Dto (String jsonMap);
	AiSedimentationLocation6RealtimeDTO getLocation6Dto (String jsonMap);
	AiSedimentationLocation7RealtimeDTO getLocation7Dto (String jsonMap);
	AiSedimentationLocation8RealtimeDTO getLocation8Dto (String jsonMap);
	
	
}
