package co.irexnet.waio.WAIO_ServerAgent.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class InterfaceCoagulantAiDTO
{
    private float c_cf_apac_max;
    private float c_cf_polymax_max;
    private float c_cf_apac_min;
    private float c_cf_polymax_min;
    
    //보령 정수장 기준, 운영시에는 약품이 1종류
    private float c_cf_max;
    private float c_cf_min;
    private float c_user_correct;
    private float c_user_tb_e;
}
