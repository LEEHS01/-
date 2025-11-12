// 혼화응집 store
import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const URL = {
  MIXING_LATEST: 'mixing/latest',
  MIXING_HISTORY_FC_SP: 'mixing/history/fc/sp',
  MIXING_CONTROL_OPERATION: 'mixing/control/operation',
  MIXING_CONTROL_AI: 'mixing/control/ai',
  MIXING_G_LIMIT_CONTROL_AI: 'mixing/glimit/control/ai',
  MIXING_G_CRT_CONTROL_AI: 'mixing/gcrt/control/ai',
}
export const GET_INDMIXING_LATEST = 'indMixing/latest/get'
export const PUT_MIXING_HISTORY_FC_SP = 'indMixing/history/fc/sp/put'
export const PUT_INDMIXING_CONTROL_OPERATION = 'indMixing/control/operation/put'
export const PUT_INDMIXING_CONTROL_AI = 'indMixing/control/ai/put'
export const PUT_INDMIXING_G_LIMIT_CONTROL_AI = 'indMixing/glimit/control/ai' + '/put'
export const PUT_INDMIXING_G_CRT_CONTROL_AI = 'indMixing/gcrt/control/ai' + '/put'
const GET_LATEST = GET_INDMIXING_LATEST.substr(GET_INDMIXING_LATEST.indexOf('/') + 1)
const PUT_HISTORY_FC_SP = PUT_MIXING_HISTORY_FC_SP.substr(PUT_MIXING_HISTORY_FC_SP.indexOf('/') + 1)
const PUT_CONTROL_OPERATION = PUT_INDMIXING_CONTROL_OPERATION.substr(PUT_INDMIXING_CONTROL_OPERATION.indexOf('/') + 1)
const PUT_CONTROL_AI = PUT_INDMIXING_CONTROL_AI.substr(PUT_INDMIXING_CONTROL_AI.indexOf('/') + 1)
const PUT_G_LIMIT_CONTROL_AI = PUT_INDMIXING_G_LIMIT_CONTROL_AI.substr(PUT_INDMIXING_G_LIMIT_CONTROL_AI.indexOf('/') + 1)
const PUT_G_CRT_CONTROL_AI = PUT_INDMIXING_G_CRT_CONTROL_AI.substr(PUT_INDMIXING_G_CRT_CONTROL_AI.indexOf('/') + 1)

const SET_MODIFYED_FROM_LATEST = "setModifyedFromLatest"
const PROCESS_STEP = 1

import { CLOSE_AI_MODE_DIALOG } from '@/store/modules/dialog'
export default {
  namespaced: true,
  state: {
    isModifyMode: false,
    isGLimitModifyMode: false,
    selectedFCLocation: 1,
    processStep: PROCESS_STEP,
    isPopupVisible: false,
    latest: {
      upd_ti: null,
      ai_opr: null,
      b_te: null,
      b_de: null,
      b_dv: null,
      d_fc_lt: null,
      d_rq: null,
      d_pn: null,
      d_g_value1_1: null,
      d_g_value1_2: null,
      d_g_value1_3: null,
      d_g_value2_1: null,
      d_g_value2_2: null,
      d_g_value2_3: null,
      d_g_value3_1: null,
      d_g_value3_2: null,
      d_g_value3_3: null,
      d_g_value4_1: null,
      d_g_value4_2: null,
      d_g_value4_3: null,
      d_g_value5_1: null,
      d_g_value5_2: null,
      d_g_value5_3: null,
      d_g_value6_1: null,
      d_g_value6_2: null,
      d_g_value6_3: null,
      d_g_value7_1: null,
      d_g_value7_2: null,
      d_g_value7_3: null,
      d_g_value8_1: null,
      d_g_value8_2: null,
      d_g_value8_3: null,
      d_g_value_ctr_flag: null,
      d_ki_dv: null,
      d_anr: null,
      d_v: null,
      d_tb_e: null,
      d_loc_fc_stt1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
      step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_g_step1_max:null,
      d_g_step1_min:null,
      d_g_step2_max:null,
      d_g_step2_min:null,
      d_g_step3_max:null,
      d_g_step3_min:null,
      d_g_step1_crt:null,
      d_g_step2_crt:null,
      d_g_step3_crt:null,
    },
    latestModify: {
      UPD_TI: null,
      ai_opr: null,
      b_te: null,
      b_de: null,
      b_dv: null,
      d_fc_lt: null,
      d_rq: null,
      d_pn: null,
      d_g_value1_1: null,
      d_g_value1_2: null,
      d_g_value1_3: null,
      d_g_value2_1: null,
      d_g_value2_2: null,
      d_g_value2_3: null,
      d_g_value3_1: null,
      d_g_value3_2: null,
      d_g_value3_3: null,
      d_g_value4_1: null,
      d_g_value4_2: null,
      d_g_value4_3: null,
      d_g_value5_1: null,
      d_g_value5_2: null,
      d_g_value5_3: null,
      d_g_value6_1: null,
      d_g_value6_2: null,
      d_g_value6_3: null,
      d_g_value7_1: null,
      d_g_value7_2: null,
      d_g_value7_3: null,
      d_g_value8_1: null,
      d_g_value8_2: null,
      d_g_value8_3: null,
      d_g_value_ctr_flag: null,
      d_loc_fc_stt1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_stt12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_loc_fc_sp12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp1: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp2: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp10: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp11: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc_sp12: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc3: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc4: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc5: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc6: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc7: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc8: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      ai_d_loc_fc9: {
        step1: {
          1: null,
          2: null,
          3: null
        },
        step2: {
          1: null,
          2: null,
          3: null
        },
        step3: {
          1: null,
          2: null,
          3: null
        }
      },
      d_g_step1_max:null,
      d_g_step1_min:null,
      d_g_step2_max:null,
      d_g_step2_min:null,
      d_g_step3_max:null,
      d_g_step3_min:null,
      d_g_step1_crt:null,
      d_g_step2_crt:null,
      d_g_step3_crt:null,
    },
    fc_sp: {
      location1: {
        step1: null,
        step2: null,
        step3: null
      },
      location2: {
        step1: null,
        step2: null,
        step3: null
      },
      location3: {
        step1: null,
        step2: null,
        step3: null
      },
      location4: {
        step1: null,
        step2: null,
        step3: null
      },
      location5: {
        step1: null,
        step2: null,
        step3: null
      },
      location6: {
        step1: null,
        step2: null,
        step3: null
      },
      location7: {
        step1: null,
        step2: null,
        step3: null
      },
      location8: {
        step1: null,
        step2: null,
        step3: null
      },
      location9: {
        step1: null,
        step2: null,
        step3: null
      },
      location10: {
        step1: null,
        step2: null,
        step3: null
      },
      location11: {
        step1: null,
        step2: null,
        step3: null
      },
      location12: {
        step1: null,
        step2: null,
        step3: null
      }
    }
  },
  getters: {
  },
  mutations: {
    [GET_LATEST]: function (state, data) {
      state.latest = data.latest
      state.latest.d_value = data.d_value
      if (state.isModifyMode === false) {
        state.latestModify = Object.assign({}, data.latest)
      }
    },
    [SET_MODIFYED_FROM_LATEST]: function (state) {
      state.latestModify = Object.assign({}, state.latest)
    },
    [PUT_HISTORY_FC_SP]: function (state, data) {
      state.fc_sp = data
    },
    [PUT_CONTROL_OPERATION]: function (state, data) {
      state.latest.ai_opr = data
    },
    [PUT_CONTROL_AI]: function(state, obj) {
      if(obj.d_g_value_ctr_flag == 0) {
        state.latest[`d_g_value${state.selectedFCLocation}_1`] = obj.d_g_value_step1
        state.latest[`d_g_value${state.selectedFCLocation}_2`] = obj.d_g_value_step2
        state.latest[`d_g_value${state.selectedFCLocation}_3`] = obj.d_g_value_step3
        state.latest.d_g_value_ctr_flag = obj.d_g_value_ctr_flag
      }
    },
    [PUT_G_LIMIT_CONTROL_AI]: function(state,obj){
      state.latest.d_g_step1_max = obj.d_g_step1_max
      state.latest.d_g_step1_min = obj.d_g_step1_min
      state.latest.d_g_step2_max = obj.d_g_step2_max
      state.latest.d_g_step2_min = obj.d_g_step2_min
      state.latest.d_g_step3_max = obj.d_g_step3_max
      state.latest.d_g_step3_min = obj.d_g_step3_min
    },
    [PUT_G_CRT_CONTROL_AI]: function(state,obj){
      state.latest.d_g_step1_crt = obj.d_g_step1_crt
      state.latest.d_g_step2_crt = obj.d_g_step2_crt
      state.latest.d_g_step3_crt = obj.d_g_step3_crt
    }
  },
  actions: {
    [GET_LATEST]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.MIXING_LATEST}` + '/'+ PROCESS_STEP) // processStep 1 : 공업, 2 : 생활
        .then(({ data }) => {
          commit(GET_LATEST, data)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_HISTORY_FC_SP]: async function ({ commit }) {
      let nowTimestamp = Date.now()
      let oneDayTimestamp = 1000 * 60 * 60 * 24
      await axios.put(`${DEV_SERVER}/${URL.MIXING_HISTORY_FC_SP}/` + PROCESS_STEP, { 'start_time': new Date(nowTimestamp - oneDayTimestamp).toISOString(), 'end_time': new Date(nowTimestamp).toISOString() })
        .then(({ data }) => {
          commit(PUT_HISTORY_FC_SP, data.fc_sp)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [PUT_CONTROL_OPERATION]: async function ({ commit }, { operation }) {
      await axios.put(`${DEV_SERVER}/${URL.MIXING_CONTROL_OPERATION}/` + PROCESS_STEP, { 'operation': operation })
      .then(() => {
        commit('dialog/' +CLOSE_AI_MODE_DIALOG, null, { root: true })
        let _data = {
          visible: true,
          title: '제어 성공',
          text1: '운전모드 변경요청 완료'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '제어 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
    },
    [PUT_CONTROL_AI]: async function ({ commit }, obj) {
      // console.log(obj)
      await axios.put(`${DEV_SERVER}/${URL.MIXING_CONTROL_AI}/` + PROCESS_STEP, obj)
      .then(() => {
        commit(PUT_CONTROL_AI, obj)
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '설정 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        commit(SET_MODIFYED_FROM_LATEST)
      })
    },
    [PUT_G_LIMIT_CONTROL_AI]: async function ({ commit }, obj) {
      await axios.put(`${DEV_SERVER}/${URL.MIXING_G_LIMIT_CONTROL_AI}/` + PROCESS_STEP, obj)
      .then(() => {
        commit(PUT_G_LIMIT_CONTROL_AI, obj)
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '설정 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        commit(SET_MODIFYED_FROM_LATEST)
      })
    },
    [PUT_G_CRT_CONTROL_AI]: async function ({ commit }, obj) {
      await axios.put(`${DEV_SERVER}/${URL.MIXING_G_CRT_CONTROL_AI}/` + PROCESS_STEP, obj)
      .then(() => {
        commit(PUT_G_CRT_CONTROL_AI, obj)
        let _data = {
          visible: true,
          title: '설정 성공',
          text1: '설정값이 변경되었습니다'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
      })
      .catch(error => {
        util.printError(error)
        let _data = {
          visible: true,
          title: '설정 실패',
          text1: '관리자에게 문의해주세요'
        }
        commit('alertDialog/OPEN_DIALOG', _data, { root: true })
        commit(SET_MODIFYED_FROM_LATEST)
      })
    },
  }
}