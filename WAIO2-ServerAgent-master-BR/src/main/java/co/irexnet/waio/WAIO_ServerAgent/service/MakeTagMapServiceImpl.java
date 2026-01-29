package co.irexnet.waio.WAIO_ServerAgent.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation1RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation2RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation3RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation4RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation5RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation6RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation7RealtimeDTO;
import co.irexnet.waio.WAIO_ServerAgent.ai_dto.AiSedimentationLocation8RealtimeDTO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MakeTagMapServiceImpl implements IMakeTagMapService{@Override
	
	public LinkedHashMap<String, Object> getControlMap(String tagSn, Object value, String time) {
		LinkedHashMap<String, Object> controlMap = new LinkedHashMap<>();
		controlMap.put("tag", tagSn);
		controlMap.put("value", value);
		controlMap.put("time", time);
		return controlMap;
	}

	private LinkedHashMap<String, Object> getLocationMap (String jsonMap){
		LinkedHashMap<String, Object> mapTemp = null;
		List<LinkedHashMap<String, Object>> locationMap = null;
		ObjectMapper objectMapper = null;
		List<String> keyList = null;
		Object objectTemp = null;
		
		try {
			objectMapper = new ObjectMapper();
			mapTemp = objectMapper.readValue(jsonMap, LinkedHashMap.class);
			keyList = new ArrayList<>(mapTemp.keySet());
			objectTemp = mapTemp.get(keyList.get(0));
			locationMap = objectMapper.convertValue(objectTemp, new TypeReference<List<LinkedHashMap<String, Object>>>(){});
			mapTemp.clear();
			for(Map<String, Object> map : locationMap) {
                mapTemp.putAll(map);
            }
			
		} catch (JsonMappingException e) {
			log.error("JsonMappingException Occurred in Sedimentation get Location1Dto Process");
		} catch (JsonProcessingException e) {
			log.error("JsonProcessingException Occurred in Sedimentation get Location1Dto Process");
		}
		
		return mapTemp;
	}

	@Override
	public AiSedimentationLocation1RealtimeDTO getLocation1Dto(String jsonMap) {		
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation1RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation2RealtimeDTO getLocation2Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation2RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation3RealtimeDTO getLocation3Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation3RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation4RealtimeDTO getLocation4Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation4RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation5RealtimeDTO getLocation5Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation5RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation6RealtimeDTO getLocation6Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation6RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation7RealtimeDTO getLocation7Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation7RealtimeDTO.class);
	}
	
	@Override
	public AiSedimentationLocation8RealtimeDTO getLocation8Dto(String jsonMap) {
		LinkedHashMap<String, Object> mapTemp = getLocationMap(jsonMap);
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.convertValue(mapTemp, AiSedimentationLocation8RealtimeDTO.class);
	}

}
