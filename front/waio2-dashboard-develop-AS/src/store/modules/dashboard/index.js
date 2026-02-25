import axios from 'axios'
import { DEV_SERVER } from '@/store'
import { util } from '@/service/utils'

const URL = {
  AI_OPR: 'dashboard/process/aiopr',
  CURRENT_DATE: 'dashboard/process/currentDate'
}
export const GET_AI_OPR = URL.AI_OPR + '/get'
export const GET_CURRENT_DATE = URL.CURRENT_DATE + '/get'
const AI_OPR = GET_AI_OPR.substr(GET_AI_OPR.indexOf('/') + 1)
const CURRENT_DATE = GET_CURRENT_DATE.substr(GET_CURRENT_DATE.indexOf('/') + 1)

export default {
  namespaced: true,
  state: {
    currentDate: null,
    processStep1: {
      receivingLatest: {},
      coagulantLatest: {},
      sedimentationLatest: {},
      filterLatest:{},
      disinfectionPreLatest:{},
      mixingLatest: {
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
        }
      }
    },
    processStep2: {
      receivingLatest:{},
      coagulantLatest: {},
      sedimentationLatest: {},
      filterLatest:{},
      disinfectionPreLatest:{},
      disinfectionPostLatest:{},
      mixingLatest: {
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
        }
      }
    },
    processStep3: {
      receivingLatest:{},
      coagulantLatest: {},
      sedimentationLatest: {},
      filterLatest:{},
      disinfectionPreLatest:{},
      mixingLatest: {
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
        }
      }
    },
    processStep: null,
    selectedFCLocation: 1
  },
  getters: {
  },
  mutations: {
    [AI_OPR]: function (state, data) {
      state.processStep1 = data.processStep1
      state.processStep2 = data.processStep2
      state.processStep3 = data.processStep3
    },
    [CURRENT_DATE]: function (state, data) {
      state.currentDate = new Date(data).getTime()
    }
  },
  actions: {
    [AI_OPR]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.AI_OPR}`)
        .then(({ data }) => {
          commit(AI_OPR, data.aiopr)
        })
        .catch(error => {
          util.printError(error)
        })
    },
    [CURRENT_DATE]: async function ({ commit }) {
      await axios.get(`${DEV_SERVER}/${URL.CURRENT_DATE}`)
        .then(({ data }) => {
          commit(CURRENT_DATE, data)
        })
        .catch(error => {
          util.printError(error)
        })
    }
  }
}