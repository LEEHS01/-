const USER_ROLE = {
  USER: 1,
  ADMIN: 0,
  GUEST: 2
}
export default {
  namespaced: true,
  state: {
    selectedMainMenuIndex: 0,
    drawer: {
      parmanet: true,
      expandOnHover: false,
      handler: true,
      items: [
        {
          icon: '$vuetify.icons.AoRw',
          text: '착수',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          // active: false,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계공업',
              route: '/fstReceivingAlgorithm',
              usr_auth: USER_ROLE.GUEST,
              model: false,
              processStep: 1
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/sndReceivingAlgorithm',
              usr_auth: USER_ROLE.GUEST,
              model: false,
              processStep: 2
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/trdReceivingAlgorithm',
              usr_auth: USER_ROLE.GUEST,
              model: false,
              processStep: 3
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '펌프제어',
              route: '/pumpReceivingAlgorithm',
              usr_auth: USER_ROLE.GUEST,
              model: false,
              processStep: 4
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoCg',
          text: '약품',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계공업',
              route: '/indCgAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/cgAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/trtIndCgAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoMtcc',
          text: '혼화/응집',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계공업',
              route: '/indMtccAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/mtccAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/trtIndMtccAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
          ]
        },
        {
          icon: '$vuetify.icons.AoSb',
          text: '침전',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계공업',
              route: '/indSedimentationAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/sedimentationAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/trtIndSedimentationAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoFb',
          text: '여과',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/filterAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/trdFilterAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoDs',
          text: '소독 전차염',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          disinfectionStep: 1,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계공업',
              route: '/preFstDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'fstDisinfection'
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/preSndDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'sndDisinfection'
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/preTrdDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'trdDisinfection'
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoDs',
          text: '소독 중차염',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          disinfectionStep: 2,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/periSndDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'sndDisinfection'
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/periTrdDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'trdDisinfection'
            }
          ]
        },
        {
          icon: '$vuetify.icons.AoDs',
          text: '소독 후차염',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          disinfectionStep: 3,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '2단계생활',
              route: '/postSndDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'sndDisinfection'
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '3단계',
              route: '/postTrdDisinfectionAlgorithm',
              model: false,
              usr_auth: USER_ROLE.GUEST,
              processStep: 'trdDisinfection'
            }
          ]
        }
      ],
      itemsEMS: [
        {
          icon: '$vuetify.icons.EMSDashboard',
          text: '대시보드',
          model: false,
          route: '/',
          usr_auth: USER_ROLE.GUEST,
        },
        {
          icon: '$vuetify.icons.EMSAI',
          text: 'AI분석',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '송수펌프 제어',
              // route: '/analysis',
              usr_auth: USER_ROLE.GUEST,
              children: [
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '제어 분석',
                  route: '/analysis',
                  usr_auth: USER_ROLE.GUEST,
                },
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '제어 세부 현황',
                  route: '/songsu',
                  usr_auth: USER_ROLE.GUEST,
                },
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '제어 트렌드',
                  route: '/sujiSelect',
                  usr_auth: USER_ROLE.GUEST,
                },
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '가동이력',
                  route: '/pumpPerform',
                  usr_auth: USER_ROLE.GUEST,
                },
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '주요 배수지 수위 현황',
                  route: '/sujiSelect_2',
                  usr_auth: USER_ROLE.GUEST,
                }
              ]
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '전력피크',
              // route: '/analysis',
              usr_auth: USER_ROLE.GUEST,
              children: [
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '분석',
                  route: '/peakcontrol',
                  usr_auth: USER_ROLE.GUEST,
                },
                {
                  icon: '$vuetify.icons.WhiteCircle',
                  text: '세부 현황',
                  route: '/peak',
                  usr_auth: USER_ROLE.GUEST,
                }
              ]
            },
          ]
        },
        {
          icon: '$vuetify.icons.EMSSpend',
          text: '에너지 사용 현황',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '시설별 사용량',
              route: '/zoneUse',
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '설비별 사용량',
              route: '/facUse',
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '사용량 트렌드',
              route: '/useTrand',
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        {
          icon: '$vuetify.icons.EMSReduce',
          text: '에너지 절감 관리',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '최적요금제 분석',
              route: '/cost',
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '절감목표 달성 현황',
              route: '/reduction',
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        {
          icon: '$vuetify.icons.EMSSetting',
          text: '설정',
          model: false,
          usr_auth: USER_ROLE.GUEST,
          children: [
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '태그 정보',
              route: '/setting',
              usr_auth: USER_ROLE.GUEST,
            },
            // {
            //   icon: '$vuetify.icons.WhiteCircle',
            //   text: '송수펌프 운영',
            //   route: '/pumpOperation',
            //   usr_auth: USER_ROLE.GUEST,
            // },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '전력요금제',
              route: '/costSetting',
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '절감목표',
              route: '/goalSetting',
              usr_auth: USER_ROLE.GUEST,
            },
            {
              icon: '$vuetify.icons.WhiteCircle',
              text: '목표 전력피크',
              route: '/peakSet',
              usr_auth: USER_ROLE.GUEST,
            }
          ]
        },
        // {
        //   icon: '$vuetify.icons.EMSReport',
        //   text: '보고서',
        //   model: false,
        //   usr_auth: USER_ROLE.GUEST,
        //   children: [
        //     {
        //       icon: '$vuetify.icons.WhiteCircle',
        //       text: '일일 보고서',
        //       route: '/report',
        //       usr_auth: USER_ROLE.GUEST,
        //     }
        //   ]
        // }
      ],
      itemsPMS: [
        {
          icon: '$vuetify.icons.AoDashboard',
          text: '대시보드',
          model: false,
          route: '/',
          usr_auth: USER_ROLE.GUEST,
        },
        {
          icon: '$vuetify.icons.AoSending',
          text: '송수',
          model: false,
          route: '/MotorView',
          usr_auth: USER_ROLE.GUEST,
        },
        {
          icon: '$vuetify.icons.EMSReport',
          text: '정밀진단',
          model: false,
          route: '/DiagnosisView',
          usr_auth: USER_ROLE.GUEST,
        },
        {
          icon: '$vuetify.icons.EMSSetting',
          text: '통계',
          model: false,
          route: '/StatisticsView',
          usr_auth: USER_ROLE.GUEST,
        }
      ]
    },
    drawerSystem: {
      parmanet: true,
      expandOnHover: false,
      handler: true,
      items: [
        {
          icon: '$vuetify.icons.SysAlarmHistory',
          text: '제어이력',
          model: false,
          route: '/alarmHistory',
          usr_auth: USER_ROLE.GUEST,
        },
        // {
          //   icon: '$vuetify.icons.SysPerformance',
          //   text: '성능 모니터링',
          //   model: false,
          //   route: '/performanceMonitoring',
          //   usr_auth: USER_ROLE.GUEST,
        // },
        // {
        //   icon: '$vuetify.icons.SysDashboardManagement',
        //   text: '대시보드 관리',
        //   model: false,
        //   route: '/dashboardManagement',
        //   usr_auth: USER_ROLE.ADMIN,
        // },
        {
          icon: '$vuetify.icons.SysAlarmManagement',
          text: '알람 관리',
          model: false,
          route: '/alarmManagement',
          usr_auth: USER_ROLE.USER,
        },
        {
          icon: '$vuetify.icons.SysUserManagement',
          text: '사용자 관리',
          model: false,
          route: '/userManagement',
          usr_auth: USER_ROLE.ADMIN,
        },
        {
          icon: '$vuetify.icons.SysLoginHistory',
          text: '로그인 이력',
          model: false,
          route: '/loginHistory',
          usr_auth: USER_ROLE.USER,
        },
        {
          icon: '$vuetify.icons.EMSDashboard',
          text: 'AI 운영 이력',
          model: false,
          route: '/aiOprHistoryRecord',
          usr_auth: USER_ROLE.GUEST,
        },
          // ,
          // {
          //   icon: '$vuetify.icons.SysConfig',
          //   text: '네트워크 설정',
          //   model: false,
          //   route: '/configNetwork',
          //   usr_auth: USER_ROLE.ADMIN,
        // }
      ]
    },
    mainLeftMenuWidth: '15px',
    mainRightMenuWidth: '0px'
  }
}