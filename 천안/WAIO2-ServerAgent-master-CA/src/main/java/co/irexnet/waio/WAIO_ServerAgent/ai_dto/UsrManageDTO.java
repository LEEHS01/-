package co.irexnet.waio.WAIO_ServerAgent.ai_dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// TB_USR_MNG
// 사용자 설정 제어값
public class UsrManageDTO
{
    private String itm;    // 항목명
    private String tag_sn;    // 태그명
    private String init_val;    // 값
}
