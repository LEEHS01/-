package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
// 제어 알람 노출시 필요한 정보를 담을 DTO
public class AlmCtrNtfDTO
{
    private String tag_sn;			// 태그값
    private String tag_dp;			// 태그 설명
    private String tag_val;			// 제어 값
    private String tag_cmp_val;		// 현재 값
    private Date upd_ti;			// CTR 테이블 각 태그의 UPD_TI
}
