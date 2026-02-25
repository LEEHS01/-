package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@ToString
// Alarm Control History DTO
public class AlmCtrHisDTO
{
    private String usr_id; 		// 사용자 아이디
    private String usr_nm; 		// 사용자 이름
    private Date ctr_ti; 		// 제어 시간
    private String ctr_yn; 		// 제어 여부(N:취소, Y:제어)
//    private int alm_seq; 		
    private int seq; 			// TB_ALM_NTF seq외래키
    private Date upd_ti; 		// 각 공정 CTR의 upd_ti
    private int alm_id; 		//알람 ID
    private int alm_ty; 		//알람 타입
    private String tag_sn;
    private List<AlmCtrNtfDTO> ctr_list;	// 태그 list
}
