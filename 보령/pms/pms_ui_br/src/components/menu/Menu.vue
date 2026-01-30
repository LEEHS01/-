<template>
    <div
        class="menu-bar"
        @mouseenter="menuEnter"
        @mouseleave="menuLeave"
        :class="{ menuEnter: state.menu }"
    >
        <div class="menu" v-if="state.menu">
            <div class="logo-box">
                <img src="@/assets/icon/logo.png" alt="" />
            </div>
            <div
                class="menu-item"
                @click="goSite(state.menu1, 0)"
                :class="{ selected: state.select === 0 }"
            >
                <img :src="state.select === 0 ? mainImgSelect : mainImg" />
                <span :class="{ select: state.select === 0 }">메인</span>
            </div>
            <div
                class="menu-item"
                @click="pmsSubMenuOpen1"
                :class="{ selected: state.select === 1 }"
            >
                <img :src="state.select === 1 ? mainImgSelect1 : mainImg1" />
                <span :class="{ select: state.select === 1 }">자율운영</span>
            </div>
            <div
                class="menu-item"
                @click="pmsSubMenuOpen2"
                :class="{ selected: state.select === 2 }"
            >
                <img :src="state.select === 2 ? mainImgSelect2 : mainImg2" />
                <span :class="{ select: state.select === 2 }">스마트 EMS</span>
            </div>
            <div
                class="menu-item"
                @click="pmsSubMenuOpen3"
                :class="{ selected: state.select === 3 }"
            >
                <img :src="state.select === 3 ? mainImgSelect3 : mainImg3" />
                <span :class="{ select: state.select === 3 }">스마트 PMS</span>
            </div>
            <div
                class="menu-item"
                @click="goSite(state.menu2, 4)"
                :class="{ selected: state.select === 4 }"
            >
                <img :src="state.select === 4 ? mainImgSelect4 : mainImg4" />
                <span :class="{ select: state.select === 4 }">지능형 영상</span>
            </div>
            <div
                class="menu-item"
                @click="pmsSubMenuOpen4"
                :class="{ selected: state.select === 5 }"
            >
                <img :src="state.select === 5 ? mainImgSelect5 : mainImg5" />
                <span :class="{ select: state.select === 5 }">운영 관리</span>
            </div>
        </div>
        <div class="pms-subMenu" v-if="state.pms1">
            <div class="sub-logo" @click="goSite('/', 3)">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    자율 운영
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <span class="icon">
                    <svg data-v-7ec7ae8b="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 16.413 15.033" class="v-icon__component theme--light"><g data-v-7ec7ae8b="" id="그룹_2716"><g data-v-7ec7ae8b="" id="그룹_590" transform="translate(6.812)"><g data-v-7ec7ae8b="" id="그룹_587"><g data-v-7ec7ae8b="" id="그룹_586" transform="translate(0 5.991)"><path data-v-7ec7ae8b="" id="패스_1693" d="M1415.092 166v3.223a2.56 2.56 0 0 1-2.412 2.667h-.05a2.745 2.745 0 0 1-2.63-2.667V166" transform="translate(-1409.7 -166)" class="cls-1"></path><path data-v-7ec7ae8b="" id="패스_1694" d="M1409.98 172.19h-.05a2.99 2.99 0 0 1-2.93-2.967V166h.7v3.223a2.311 2.311 0 0 0 2.231 2.268h.05a2.219 2.219 0 0 0 2.112-2.268V166h.7v3.223a2.891 2.891 0 0 1-2.813 2.967z" transform="translate(-1407 -166)" class="cls-1"></path></g><path data-v-7ec7ae8b="" id="패스_1695" d="M1412.791 112.091h-.7v-3.267a2.094 2.094 0 0 0-2.112-2.125h-.05a2.187 2.187 0 0 0-2.231 2.125v3.267h-.7v-3.267a2.886 2.886 0 0 1 2.93-2.824h.05a2.786 2.786 0 0 1 2.811 2.824z" transform="translate(-1407 -106)" class="cls-1"></path></g></g><g data-v-7ec7ae8b="" id="그룹_591" transform="rotate(180 2.895 6.09)"><g data-v-7ec7ae8b="" id="그룹_587-2"><g data-v-7ec7ae8b="" id="그룹_586-2" transform="translate(0 5.991)"><path data-v-7ec7ae8b="" id="패스_1693-2" d="M5.092 0v3.223A2.56 2.56 0 0 1 2.68 5.891h-.05A2.745 2.745 0 0 1 0 3.223V0" transform="translate(.299)" class="cls-1"></path><path data-v-7ec7ae8b="" id="패스_1694-2" d="M2.98 6.19h-.05A2.99 2.99 0 0 1 0 3.223V0h.7v3.223a2.311 2.311 0 0 0 2.23 2.269h.05a2.219 2.219 0 0 0 2.112-2.269V0h.7v3.223A2.891 2.891 0 0 1 2.98 6.19z" class="cls-1"></path></g><path data-v-7ec7ae8b="" id="패스_1695-2" d="M5.791 6.091h-.7V2.824A2.094 2.094 0 0 0 2.98.7h-.05A2.187 2.187 0 0 0 .7 2.824v3.267H0V2.824A2.886 2.886 0 0 1 2.93 0h.05a2.786 2.786 0 0 1 2.811 2.824z" class="cls-1"></path></g></g></g></svg>
                </span>
                <span :class="{ selectFont: state.subList1 === 0 }">착수</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList1 === 0 }"
                >
                    <div
                        class="item"
                        @click="goRouter('WaterControlView')"
                        :class="{ showitem: state.subList1 === 0 }"
                    >
                        <div class="circle"></div>
                        세부현황
                    </div>
                    <div
                        class="item"
                        @click="goRouter('WaterControlView')"
                        :class="{ showitem: state.subList1 === 0 }"
                    >
                        <div class="circle"></div>
                        시뮬레이션
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <span class="icon">
                    <svg data-v-644d852a="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 10.211 13.903" class="v-icon__component theme--light"><g data-v-644d852a="" id="그룹_2714"><path data-v-644d852a="" id="패스_1677" d="M917.574 1207l2.037 3.946s.158.276.11.432-.2.138-.382.138h-6.36c-.18 0-.339.012-.382-.133s.11-.441.11-.441l2.037-3.941z" transform="translate(-910.998 -1198.741)" class="cls-1"></path><path data-v-644d852a="" id="패스_1678" d="M905.017 1146.689h-8.45a.873.873 0 0 1-.858-.5.835.835 0 0 1 .138-.692l3.247-6.264v-1.957a.326.326 0 0 1 .343-.275h2.728a.3.3 0 0 1 .316.275v1.957l3.241 6.273a.831.831 0 0 1 .135.68.844.844 0 0 1-.84.503zm-5.265-9.167v1.773a.213.213 0 0 1-.029.119l-3.289 6.328s0 .007-.006.011a.409.409 0 0 0-.088.29.218.218 0 0 0 .227.125h8.45a.2.2 0 0 0 .211-.129.441.441 0 0 0-.083-.3l-3.281-6.333a.222.222 0 0 1-.042-.116v-1.773z" transform="translate(-895.676 -1132.786)" class="cls-2"></path><path data-v-644d852a="" id="패스_1679" d="M926.036 1136.129h-4.327a.564.564 0 0 1 0-1.129h4.327a.564.564 0 0 1 0 1.129z" transform="translate(-918.748 -1131.35)" class="cls-2"></path><path data-v-644d852a="" id="패스_1683" d="M943.687 1105.461a.794.794 0 1 1-.794-.794.794.794 0 0 1 .794.794z" transform="translate(-937.733 -1103.024)" class="cls-1"></path><path data-v-644d852a="" id="패스_1684" d="M930.166 1087.734a.533.533 0 1 1-.533-.533.533.533 0 0 1 .533.533z" transform="translate(-926.144 -1086.166)" class="cls-1"></path><path data-v-644d852a="" id="패스_1685" d="M957.981 1076.642a.441.441 0 1 1-.441-.441.441.441 0 0 1 .441.441z" transform="translate(-951.51 -1076.201)" class="cls-1"></path></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 1 }">약품</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 1 }"
                >
                    <div class="item" @click="goRouter('PacTubeView')">
                        <div class="circle"></div>
                        PAC 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('Monitor5')">
                        <div class="circle"></div>
                        PAHCS 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('AutoWaterView')">
                        <div class="circle"></div>
                        자동급수펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <span class="icon">
                    <svg data-v-c27a6fe6="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 12.756 15.029" class="v-icon__component theme--light"><g data-v-c27a6fe6="" id="그룹_2744" data-name="그룹 2744" transform="matrix(-0.174, -0.985, 0.985, -0.174, 0.518, 15.029)"><path data-v-c27a6fe6="" id="패스_1686" data-name="패스 1686" d="M1.629,3.007A.259.259,0,0,1,1.4,2.873L.032.384A.259.259,0,0,1,.487.134L1.856,2.623a.259.259,0,0,1-.227.384Z" transform="translate(1.928 2.244)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1687" data-name="패스 1687" d="M.26,2.409a.259.259,0,0,1-.249-.333L.574.185a.259.259,0,0,1,.5.148L.508,2.224A.259.259,0,0,1,.26,2.409Z" transform="translate(2.613 7.739)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1688" data-name="패스 1688" d="M4.906,1.374a.251.251,0,0,1-.047,0L.212.514A.259.259,0,0,1,.306,0L4.953.86a.259.259,0,0,1-.047.514Z" transform="translate(5.958 6.8)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1689" data-name="패스 1689" d="M2.251,4.537h0a2.307,2.307,0,0,1-.308-.044A2.258,2.258,0,0,1,2.247,0a2.281,2.281,0,0,1,.308.018,2.271,2.271,0,0,1-.3,4.519Zm0-3.654A1.36,1.36,0,0,0,2.064,3.59a1.386,1.386,0,0,0,.187.013A1.36,1.36,0,0,0,2.434.9,1.387,1.387,0,0,0,2.247.883Z" transform="translate(2.242 4.292)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1690" data-name="패스 1690" d="M1.492,2.98h0a1.5,1.5,0,0,1-.2-.014A1.49,1.49,0,0,1,.014,1.287,1.488,1.488,0,0,1,1.693.014,1.49,1.49,0,0,1,2.966,1.693,1.5,1.5,0,0,1,1.492,2.98Zm0-2.462a.971.971,0,0,0-.131,1.934.989.989,0,0,0,.134.009A.971.971,0,0,0,1.622.528,1.007,1.007,0,0,0,1.489.518Z" transform="translate(0)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1691" data-name="패스 1691" d="M1.492,2.98h0A1.49,1.49,0,1,1,2.966,1.693,1.488,1.488,0,0,1,1.492,2.98Zm0-2.461a.971.971,0,0,0-.131,1.934.992.992,0,0,0,.134.009.971.971,0,0,0,0-1.943Z" transform="translate(1.037 9.63)" fill="#fff"></path><path data-v-c27a6fe6="" id="패스_1692" data-name="패스 1692" d="M1.492,2.98h0a1.5,1.5,0,0,1-.2-.014A1.49,1.49,0,0,1,.014,1.287,1.488,1.488,0,0,1,1.693.014,1.49,1.49,0,0,1,2.966,1.693,1.5,1.5,0,0,1,1.492,2.98Zm0-2.462a.971.971,0,0,0-.131,1.934.991.991,0,0,0,.134.009.974.974,0,0,0,.961-.839A.971.971,0,0,0,1.622.528.99.99,0,0,0,1.489.519Z" transform="translate(10.593 6.593)" fill="#fff"></path></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 2 }"
                    >혼화/응집</span
                >
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 2 }"
                >
                    <div class="item" @click="goRouter('RapidAgitatorView')">
                        <div class="circle"></div>
                        급속분사교반기
                    </div>
                    <div class="item" @click="goRouter('AgglomerateView')">
                        <div class="circle"></div>
                        응집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <span class="icon">
                    <svg data-v-7f549995="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 11.823 9.859" class="v-icon__component theme--light"><g data-v-7f549995="" id="그룹_2745" data-name="그룹 2745" transform="translate(1240.523 69.33)"><path data-v-7f549995="" id="패스_22725" data-name="패스 22725" d="M-1228.95-69.08h-11.323v6.908l4.473,1v1.453h2.377v-1.453l4.473-1Z" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="0.5"></path><circle data-v-7f549995="" id="타원_4256" data-name="타원 4256" cx="0.802" cy="0.802" r="0.802" transform="translate(-1239.038 -64.401)" fill="#fff"></circle><circle data-v-7f549995="" id="타원_4260" data-name="타원 4260" cx="0.802" cy="0.802" r="0.802" transform="translate(-1234.911 -63.599)" fill="#fff"></circle><circle data-v-7f549995="" id="타원_4261" data-name="타원 4261" cx="0.802" cy="0.802" r="0.802" transform="translate(-1231.911 -65.203)" fill="#fff"></circle><ellipse data-v-7f549995="" id="타원_4259" data-name="타원 4259" cx="0.586" cy="0.586" rx="0.586" ry="0.586" transform="translate(-1236.648 -65.572)" fill="#fff"></ellipse><ellipse data-v-7f549995="" id="타원_4266" data-name="타원 4266" cx="0.586" cy="0.586" rx="0.586" ry="0.586" transform="translate(-1233.894 -65.572)" fill="#fff"></ellipse><circle data-v-7f549995="" id="타원_4263" data-name="타원 4263" cx="0.284" cy="0.284" r="0.284" transform="translate(-1231.677 -67.564)" fill="#fff"></circle><circle data-v-7f549995="" id="타원_4265" data-name="타원 4265" cx="0.284" cy="0.284" r="0.284" transform="translate(-1238.003 -66.997)" fill="#fff"></circle><circle data-v-7f549995="" id="타원_4264" data-name="타원 4264" cx="0.284" cy="0.284" r="0.284" transform="translate(-1234.911 -67.564)" fill="#fff"></circle></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 3 }">침전</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 3 }"
                >
                    <div class="item" @click="goRouter('SludgeCollectorView')">
                        <div class="circle"></div>
                        슬라지수집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <span class="icon">
                    <svg data-v-69259982="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 13.944 12" class="v-icon__component theme--light"><path data-v-69259982="" id="패스_1696" data-name="패스 1696" d="M157.685,130.46a.206.206,0,0,0,.351-.217c-.056-.091-.111-.177-.162-.255a.206.206,0,1,0-.346.225C157.578,130.289,157.631,130.372,157.685,130.46Z" transform="translate(-150.527 -128.035)" fill="#fff"></path><path data-v-69259982="" id="패스_1697" data-name="패스 1697" d="M159.94,134.267a5.439,5.439,0,0,1,.6,1.56.206.206,0,0,0,.2.171.211.211,0,0,0,.036,0,.206.206,0,0,0,.168-.239,5.835,5.835,0,0,0-.638-1.684.206.206,0,0,0-.364.195Z" transform="translate(-152.442 -131.255)" fill="#fff"></path><path data-v-69259982="" id="패스_1698" data-name="패스 1698" d="M135.539,124.774a.206.206,0,0,0-.155-.071h-2a13.524,13.524,0,0,0-2.3-3.644.206.206,0,0,0-.306,0,12.468,12.468,0,0,0-2.319,3.646h-1.985a.206.206,0,0,0-.164.082l-2.145,2.833a.206.206,0,0,0,.165.331h1.9l-1.848,2.274a.206.206,0,0,0,.16.336h2.07l-1.619,2.1a.206.206,0,0,0,.163.332H136.7a.206.206,0,0,0,.163-.332l-1.619-2.1h2.07a.206.206,0,0,0,.16-.336l-1.848-2.274h2.234a.206.206,0,0,0,.155-.342Zm-4.613-3.262c.525.629,2.238,2.8,2.3,4.371a4.376,4.376,0,0,1-2.725.561,3.043,3.043,0,0,1-1.869-.549C128.682,124.243,130.4,122.127,130.926,121.511Zm5.353,11.066h-10.7l1.557-2.019h7.588Zm.6-2.431h-11.9l1.786-2.2h1.468a2.8,2.8,0,0,0,5.4,0h1.468Zm-5.951-1.631a1.269,1.269,0,0,1-1.146-.567H133.2a2.394,2.394,0,0,1-4.536,0h.656a1.655,1.655,0,0,0,1.612.98.206.206,0,0,0,0-.413Zm-6.186-.98,1.833-2.42h1.758a3.483,3.483,0,0,0-.116.852.207.207,0,0,0,.041.123c.455.608,1.7.737,2.22.765.126.006.255.01.385.01a4.074,4.074,0,0,0,2.721-.758.206.206,0,0,0,.055-.14,3.33,3.33,0,0,0-.124-.852h1.775l2.115,2.42Z" transform="translate(-124.122 -120.99)" fill="#fff"></path></svg>
                </span>
                <span :class="{ selectFont: state.subList === 4 }">여과</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 4 }"
                >
                    <div class="item" @click="goRouter('FilterBackWashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                    <div class="item" @click="goRouter('BackWashBlowerView')">
                        <div class="circle"></div>
                        역세송풍기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(5)">
                <span class="icon">
                    <svg data-v-0bf973e6="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 12.371 12.371" class="v-icon__component theme--light"><g data-v-0bf973e6="" id="그룹_2747" data-name="그룹 2747" opacity="0.998"><path data-v-0bf973e6="" id="패스_1699" data-name="패스 1699" d="M324.835,137.857a6.186,6.186,0,1,0-6.186-6.186A6.193,6.193,0,0,0,324.835,137.857Zm0-11.954a5.768,5.768,0,1,1-5.768,5.768A5.775,5.775,0,0,1,324.835,125.9Z" transform="translate(-318.649 -125.486)" fill="#fff"></path><path data-v-0bf973e6="" id="패스_1700" data-name="패스 1700" d="M331.381,144.982a4.434,4.434,0,0,0,2.321-8.211.209.209,0,0,0-.219.355,4.018,4.018,0,1,1-4.689.353v.719a.209.209,0,0,0,.417,0v-1.075a.207.207,0,0,0-.192-.286h-.007l-.009,0-.009,0h-1.284a.209.209,0,0,0,0,.417h.7a4.433,4.433,0,0,0,2.967,7.727Z" transform="translate(-325.195 -134.364)" fill="#fff"></path><path data-v-0bf973e6="" id="패스_1701" data-name="패스 1701" d="M337.7,139.192a2.709,2.709,0,0,0,2.742-2.894c0-2.033-2.48-4.845-2.586-4.964a.208.208,0,0,0-.309,0c-.106.115-2.588,2.831-2.588,4.966A2.709,2.709,0,0,0,337.7,139.192Zm0-7.4c.541.648,2.327,2.908,2.327,4.507a2.329,2.329,0,1,1-4.649,0C335.375,134.618,337.153,132.424,337.7,131.791Z" transform="translate(-331.514 -130.044)" fill="#fff"></path><path data-v-0bf973e6="" id="패스_1702" data-name="패스 1702" d="M348.905,140.74a.209.209,0,1,0,.355-.22c-.057-.092-.112-.179-.164-.258a.209.209,0,1,0-.349.228C348.8,140.567,348.85,140.65,348.905,140.74Z" transform="translate(-342.364 -137.067)" fill="#fff"></path><path data-v-0bf973e6="" id="패스_1703" data-name="패스 1703" d="M351.157,144.545a4.523,4.523,0,0,1,.638,1.954.209.209,0,1,0,.417,0,4.841,4.841,0,0,0-.687-2.151.209.209,0,0,0-.368.2Z" transform="translate(-344.273 -140.278)" fill="#fff"></path><path data-v-0bf973e6="" id="패스_1704" data-name="패스 1704" d="M341.977,159.21a.209.209,0,1,0,0-.417,1.2,1.2,0,0,1-1.2-.724.209.209,0,0,0-.383.165A1.609,1.609,0,0,0,341.977,159.21Z" transform="translate(-335.792 -151.089)" fill="#fff"></path></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 5 }">GAC</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 5 }"
                >
                    <div class="item" @click="goRouter('GacBackwashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(7)">
                <span class="icon">
                    <svg data-v-66ab77d5="" preserveAspectRatio="xMinYMin meet" viewBox="0 0 11.5 12.534" class="v-icon__component theme--light"><g data-v-66ab77d5="" id="그룹_2719" data-name="그룹 2719" opacity="0.998"><path data-v-66ab77d5="" id="패스_1705" data-name="패스 1705" d="M505.51,71.555l-.894-.516V69.545a.239.239,0,1,0-.478,0v1.494l-2.258,1.3-2.258-1.3V68.432L502,67.059a.247.247,0,0,0,.024-.021.255.255,0,0,0,.034-.03.247.247,0,0,0,.026-.038.244.244,0,0,0,.02-.041c0-.006.006-.01.007-.015a.24.24,0,0,0,0-.032.2.2,0,0,0,.006-.03v-1.17a.239.239,0,1,0-.478,0v1.032l-2.258,1.3-.895-.516a.239.239,0,0,0-.35.269.237.237,0,0,0,.111.145l.894.516v2.607l-.894.516a.239.239,0,0,0-.088.326.239.239,0,0,0,.327.088l.894-.516,2.258,1.3v1.032a.239.239,0,1,0,.478,0V72.757l2.258-1.3.894.516a.242.242,0,0,0,.119.032.239.239,0,0,0,.207-.12.239.239,0,0,0-.088-.327Zm-7.1.317h0v0Zm3.474,2.037Z" transform="translate(-498.13 -61.495)" fill="#fff"></path><path data-v-66ab77d5="" id="패스_1706" data-name="패스 1706" d="M520.787,54.469V52.245a.744.744,0,1,0-.713-1.276l-1.964-1.134a.736.736,0,0,0,.015-.146.747.747,0,1,0-1.493,0,.738.738,0,0,0,.015.146l-1.964,1.134a.739.739,0,0,0-.473-.174.745.745,0,0,0-.239,1.45v2.224a.744.744,0,1,0,.725,1.266l1.952,1.127a.747.747,0,1,0,1.463,0l1.952-1.127a.739.739,0,0,0,.486.184.745.745,0,0,0,.239-1.45Zm-5.847.855a.737.737,0,0,0,.016-.151.745.745,0,0,0-.507-.7V52.245a.735.735,0,0,0,.487-.87l1.953-1.128a.733.733,0,0,0,.979,0l1.954,1.128a.735.735,0,0,0,.487.87v2.224a.745.745,0,0,0-.507.7.734.734,0,0,0,.016.151l-1.949,1.125a.733.733,0,0,0-.979,0Zm2.438-5.368a.268.268,0,1,1,.268-.268A.268.268,0,0,1,517.378,49.957Zm-2.9,1.585a.265.265,0,0,1-.225.259.112.112,0,0,0-.086,0,.265.265,0,0,1-.225-.259.268.268,0,1,1,.536,0Zm-.268,3.364a.268.268,0,1,1-.268.268A.268.268,0,0,1,514.209,54.905Zm6.339.536a.268.268,0,1,1,.268-.268A.268.268,0,0,1,520.548,55.441Zm-3.17,1.3a.268.268,0,1,1-.268.268A.269.269,0,0,1,517.378,56.74Zm3.17-4.931a.268.268,0,1,1,.268-.268A.268.268,0,0,1,520.548,51.809Z" transform="translate(-509.794 -48.942)" fill="#fff"></path></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 7 }">소독</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 7 }"
                >
                    <div class="item" @click="goRouter('Monitor16')">
                        <div class="circle"></div>
                        차염발생기
                    </div>
                </div>
            </div>
            <div class="sub-item" @click="subMenu(8)">
                <span class="icon">
                    <svg data-v-435b0584="" xmlns="http://www.w3.org/2000/svg" width="13.776" height="10.596" viewBox="0 0 13.776 10.596" class="v-icon__component theme--light"><defs data-v-435b0584=""><clipPath data-v-435b0584="" id="clip-path"><path data-v-435b0584="" id="사각형_9335" data-name="사각형 9335" d="M0 0h13.776v10.596H0z" style="fill: none;"></path></clipPath></defs><g data-v-435b0584="" id="그룹_89025" data-name="그룹 89025" transform="translate(1 -1)"><g data-v-435b0584="" id="그룹_89024" data-name="그룹 89024" transform="translate(-1 1)" style="clip-path: url(&quot;#clip-path&quot;);"><path data-v-435b0584="" id="패스_67965" data-name="패스 67965" d="M135.028 121.518h7.587a.018.018 0 0 0 .018-.018v-6.607a.018.018 0 0 0-.018-.018h-7.587a.958.958 0 0 0-.958.958v4.726a.958.958 0 0 0 .958.959z" transform="translate(-129.771 -112.876)" class="cls-3"></path><path data-v-435b0584="" id="패스_67966" data-name="패스 67966" d="M22.6 152.663h1.337a.021.021 0 0 0 .021-.021V147.7a.021.021 0 0 0-.021-.021H22.6a.8.8 0 0 0-.795.795v3.394a.8.8 0 0 0 .795.795z" transform="translate(-20.347 -144.851)" class="cls-3"></path><path data-v-435b0584="" id="사각형_9332" data-name="사각형 9332" transform="translate(3.611 3.752)" d="M0 0h.692v3.169H0z" class="cls-3"></path><path data-v-435b0584="" id="사각형_9333" data-name="사각형 9333" transform="translate(6.725 8.643)" d="M0 0h4.045v.693H0z" class="cls-3"></path><path data-v-435b0584="" id="패스_67967" data-name="패스 67967" d="M256.285 72.919v-.681a.408.408 0 0 0-.408-.408h-2.041a.408.408 0 0 0-.408.408v.681z" transform="translate(-246.109 -70.92)" class="cls-3"></path><path data-v-435b0584="" id="패스_67968" data-name="패스 67968" d="M.795 218.535h0a.545.545 0 0 0-.545.545v.34a.545.545 0 0 0 .545.545z" transform="translate(.663 -213.913)" class="cls-3"></path><path data-v-435b0584="" id="선_209" data-name="선 209" transform="translate(5.752 3.66)" d="M5.851 0H0" class="cls-3"></path><path data-v-435b0584="" id="선_210" data-name="선 210" transform="translate(5.752 4.767)" d="M5.851 0H0" class="cls-3"></path><path data-v-435b0584="" id="선_211" data-name="선 211" transform="translate(5.752 5.874)" d="M5.851 0H0" class="cls-3"></path><path data-v-435b0584="" id="선_212" data-name="선 212" transform="translate(5.752 6.982)" d="M5.851 0H0" class="cls-3"></path><path data-v-435b0584="" id="패스_67969" data-name="패스 67969" d="M5.342 11.293h5.808" transform="translate(.501 -1.957)" style="stroke: rgb(255, 255, 255); stroke-width: 0.5px; fill: none;"></path></g></g></svg>
                </span>
                <span :class="{ selectFont: state.subList === 8 }">송수</span>
            </div>
        </div>

        <div class="pms-subMenu" v-if="state.pms2">
            <div class="sub-logo" @click="goSite('/', 3)">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    스마트 PMS
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <img src="@/assets/icon/sub2.png" alt="" />
                <span :class="{ selectFont: state.subList === 0 }">착수</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 0 }"
                >
                    <div
                        class="item"
                        @click="goRouter('WaterControlView')"
                        :class="{ showitem: state.subList === 0 }"
                    >
                        <div class="circle"></div>
                        유입밸브
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <img src="@/assets/icon/sub3.png" alt="" />
                <span :class="{ selectFont: state.subList === 1 }">약품</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 1 }"
                >
                    <div class="item" @click="goRouter('PacTubeView')">
                        <div class="circle"></div>
                        PAC 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('Monitor5')">
                        <div class="circle"></div>
                        PAHCS 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('AutoWaterView')">
                        <div class="circle"></div>
                        자동급수펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <img src="@/assets/icon/sub4.png" alt="" />
                <span :class="{ selectFont: state.subList === 2 }"
                    >혼화/응집</span
                >
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 2 }"
                >
                    <div class="item" @click="goRouter('RapidAgitatorView')">
                        <div class="circle"></div>
                        급속분사교반기
                    </div>
                    <div class="item" @click="goRouter('AgglomerateView')">
                        <div class="circle"></div>
                        응집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <img src="@/assets/icon/sub5.png" alt="" />
                <span :class="{ selectFont: state.subList === 3 }">침전</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 3 }"
                >
                    <div class="item" @click="goRouter('SludgeCollectorView')">
                        <div class="circle"></div>
                        슬라지수집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <img src="@/assets/icon/sub6.png" alt="" />
                <span :class="{ selectFont: state.subList === 4 }">여과</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 4 }"
                >
                    <div class="item" @click="goRouter('FilterBackWashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                    <div class="item" @click="goRouter('BackWashBlowerView')">
                        <div class="circle"></div>
                        역세송풍기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(5)">
                <img src="@/assets/icon/sub7.png" alt="" />
                <span :class="{ selectFont: state.subList === 5 }">GAC</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 5 }"
                >
                    <div class="item" @click="goRouter('GacBackwashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                </div>
            </div>
            <div class="sub-item" @click="subMenu(6)">
                <img src="@/assets/icon/sub7.png" alt="" />
                <span :class="{ selectFont: state.subList === 6 }">오존</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 6 }"
                >
                    <div class="item" @click="goRouter('Monitor15')">
                        <div class="circle"></div>
                        오존발생기
                    </div>
                    <div class="item" @click="goRouter('MotifPumpView')">
                        <div class="circle"></div>
                        모티브펌프
                    </div>
                    <div class="item" @click="goRouter('CoolingPumpView')">
                        <div class="circle"></div>
                        냉각수펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(7)">
                <img src="@/assets/icon/sub8.png" alt="" />
                <span :class="{ selectFont: state.subList === 7 }">소독</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 7 }"
                >
                    <div class="item" @click="goRouter('Monitor16')">
                        <div class="circle"></div>
                        차염발생기
                    </div>
                </div>
            </div>
            <div class="sub-item" @click="subMenu(8)">
                <img src="@/assets/icon/sub9.png" alt="" />
                <span :class="{ selectFont: state.subList === 8 }">송수</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 8 }"
                >
                    <div class="item" @click="goRouter('MotorView')">
                        <div class="circle"></div>
                        송수펌프모터
                    </div>
                    <div class="item" @click="goRouter('PumpBoardView')">
                        <div class="circle"></div>
                        펌프기동반
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="goRouter('TransformersView')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>변압기반</span>
            </div>
            <div class="sub-item" @click="goRouter('VcbView')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>VCB반</span>
            </div>
            <div class="sub-item" @click="goRouter('Monitor19')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>통계/이력</span>
            </div>
        </div>

        <div class="pms-subMenu" v-if="state.pms3">
            <div class="sub-logo" @click="goSite('/', 3)">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    스마트 PMS
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <img src="@/assets/icon/sub2.png" alt="" />
                <span :class="{ selectFont: state.subList === 0 }">착수</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 0 }"
                >
                    <div
                        class="item"
                        @click="goRouter('WaterControlView')"
                        :class="{ showitem: state.subList === 0 }"
                    >
                        <div class="circle"></div>
                        유입밸브
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <img src="@/assets/icon/sub3.png" alt="" />
                <span :class="{ selectFont: state.subList === 1 }">약품</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 1 }"
                >
                    <div class="item" @click="goRouter('PacTubeView')">
                        <div class="circle"></div>
                        PAC 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('Monitor5')">
                        <div class="circle"></div>
                        PAHCS 튜브펌프
                    </div>
                    <div class="item" @click="goRouter('AutoWaterView')">
                        <div class="circle"></div>
                        자동급수펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <img src="@/assets/icon/sub4.png" alt="" />
                <span :class="{ selectFont: state.subList === 2 }"
                    >혼화/응집</span
                >
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 2 }"
                >
                    <div class="item" @click="goRouter('RapidAgitatorView')">
                        <div class="circle"></div>
                        급속분사교반기
                    </div>
                    <div class="item" @click="goRouter('AgglomerateView')">
                        <div class="circle"></div>
                        응집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <img src="@/assets/icon/sub5.png" alt="" />
                <span :class="{ selectFont: state.subList === 3 }">침전</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 3 }"
                >
                    <div class="item" @click="goRouter('SludgeCollectorView')">
                        <div class="circle"></div>
                        슬라지수집기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <img src="@/assets/icon/sub6.png" alt="" />
                <span :class="{ selectFont: state.subList === 4 }">여과</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 4 }"
                >
                    <div class="item" @click="goRouter('FilterBackWashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                    <div class="item" @click="goRouter('BackWashBlowerView')">
                        <div class="circle"></div>
                        역세송풍기
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(5)">
                <img src="@/assets/icon/sub7.png" alt="" />
                <span :class="{ selectFont: state.subList === 5 }">GAC</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 5 }"
                >
                    <div class="item" @click="goRouter('GacBackwashView')">
                        <div class="circle"></div>
                        역세펌프
                    </div>
                </div>
            </div>
            <div class="sub-item" @click="subMenu(6)">
                <img src="@/assets/icon/sub7.png" alt="" />
                <span :class="{ selectFont: state.subList === 6 }">오존</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 6 }"
                >
                    <div class="item" @click="goRouter('Monitor15')">
                        <div class="circle"></div>
                        오존발생기
                    </div>
                    <div class="item" @click="goRouter('MotifPumpView')">
                        <div class="circle"></div>
                        모티브펌프
                    </div>
                    <div class="item" @click="goRouter('CoolingPumpView')">
                        <div class="circle"></div>
                        냉각수펌프
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="subMenu(7)">
                <img src="@/assets/icon/sub8.png" alt="" />
                <span :class="{ selectFont: state.subList === 7 }">소독</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 7 }"
                >
                    <div class="item" @click="goRouter('Monitor16')">
                        <div class="circle"></div>
                        차염발생기
                    </div>
                </div>
            </div>
            <div class="sub-item" @click="subMenu(8)">
                <img src="@/assets/icon/sub9.png" alt="" />
                <span :class="{ selectFont: state.subList === 8 }">송수</span>
                <div
                    class="sub-item-list"
                    :class="{ showList: state.subList === 8 }"
                >
                    <div class="item" @click="goRouter('MotorView')">
                        <div class="circle"></div>
                        송수펌프모터
                    </div>
                    <div class="item" @click="goRouter('PumpBoardView')">
                        <div class="circle"></div>
                        펌프기동반
                    </div>
                </div>
            </div>

            <div class="sub-item" @click="goRouter('TransformersView')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>변압기반</span>
            </div>
            <div class="sub-item" @click="goRouter('VcbView')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>VCB반</span>
            </div>
            <div class="sub-item" @click="goRouter('Monitor19')">
                <img src="@/assets/icon/sub1.png" alt="" />
                <span>통계/이력</span>
            </div>
        </div>

        <div class="pms-subMenu" v-if="state.pms4">
            <div class="sub-logo" @click="goSite('/', 3)">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    스마트 PMS
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub2.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 0 }"
                                    >착수</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goRouter('WaterControlView')"
                                :class="{ showitem: state.subList === 0 }"
                            >
                                <div class="circle"></div>
                                유입밸브
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub3.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 1 }"
                                    >약품</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div
                            class="sub-item-list showList"
                            :class="{ showList: state.subList === 1 }"
                        >
                            <div class="item" @click="goRouter('PacTubeView')">
                                <div class="circle"></div>
                                PAC 튜브펌프
                            </div>
                            <div class="item" @click="goRouter('AutoWaterView')">
                                <div class="circle"></div>
                                자동급수펌프
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub4.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 2 }"
                                    >혼화/응집</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div
                            class="sub-item-list showList"
                            :class="{ showList: state.subList === 2 }"
                        >
                            <div class="item" @click="goRouter('RapidAgitatorView')">
                                <div class="circle"></div>
                                급속분사교반기
                            </div>
                            <div class="item" @click="goRouter('AgglomerateView')">
                                <div class="circle"></div>
                                응집기
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub5.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 3 }"
                                    >침전</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div
                            class="sub-item-list showList"
                            :class="{ showList: state.subList === 3 }"
                        >
                            <div class="item" @click="goRouter('SludgeCollectorView')">
                                <div class="circle"></div>
                                슬라지수집기
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub6.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 4 }"
                                    >여과</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div class="item" @click="goRouter('FilterBackWashView')">
                                <div class="circle"></div>
                                역세펌프
                            </div>
                            <div class="item" @click="goRouter('BackWashBlowerView')">
                                <div class="circle"></div>
                                역세송풍기
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
            <div class="sub-item" @click="subMenu(6)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub7.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 6 }"
                                    >오존</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div class="item" @click="goRouter('Monitor15')">
                                <div class="circle"></div>
                                오존발생기
                            </div>
                            <div class="item" @click="goRouter('MotifPumpView')">
                                <div class="circle"></div>
                                모티브펌프
                            </div>
                            <div class="item" @click="goRouter('CoolingPumpView')">
                                <div class="circle"></div>
                                냉각수펌프
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
            <div class="sub-item" @click="subMenu(5)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub7.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 5 }"
                                    >GAC</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div class="item" @click="goRouter('GacBackwashView')">
                                <div class="circle"></div>
                                역세펌프
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
            <div class="sub-item" @click="subMenu(7)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub8.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 7 }"
                                    >소독</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div class="item" @click="goRouter('Monitor16')">
                                <div class="circle"></div>
                                차염발생기
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
            <div class="sub-item" @click="subMenu(8)">
                <q-expansion-item group="somegroup">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img src="@/assets/icon/sub9.png" alt="" />
                                <span
                                    :class="{ selectFont: state.subList === 8 }"
                                    >송수</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div class="item" @click="goRouter('MotorView')">
                                <div class="circle"></div>
                                송수펌프모터
                            </div>
                            <div class="item" @click="goRouter('PumpBoardView')">
                                <div class="circle"></div>
                                펌프기동반
                            </div>
                            <div class="item" @click="goRouter('TransformersView')">
                                <div class="circle"></div>
                                변압기반
                            </div>
                            <div class="item" @click="goRouter('VcbView')">
                                <div class="circle"></div>
                                VCB반
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
            <div
                class="sub-item"
                @click="goRouter('Monitor19')"
                style="padding : 8px 16px;"
            >
                <div class="submenu">
                    <img src="@/assets/icon/sub1.png" alt="" />
                    <span>통계/이력</span>
                </div>
            </div>
        </div>
        <div
            class="arrow-box"
            :class="[{ arrowEnter: state.menu }, { selectPms: state.pms1 }, { selectPms: state.pms2 }, { selectPms: state.pms3 }, { selectPms: state.pms4 }]"
        >
            <div class="arrow"></div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import mainImg from '@/assets/icon/main_s.png';
import mainImg1 from '@/assets/icon/main2_s.png';
import mainImg2 from '@/assets/icon/main3_s.png';
import mainImg3 from '@/assets/icon/main4_s.png';
import mainImg4 from '@/assets/icon/main5_s.png';
import mainImg5 from '@/assets/icon/main6_s.png';
import mainImgSelect from '@/assets/icon/main.png';
import mainImgSelect1 from '@/assets/icon/main2.png';
import mainImgSelect2 from '@/assets/icon/main3.png';
import mainImgSelect3 from '@/assets/icon/main4.png';
import mainImgSelect4 from '@/assets/icon/main5.png';
import mainImgSelect5 from '@/assets/icon/main6.png';

export default {
    setup() {
        const router = useRouter();
        const state = reactive({
            menu: false,
            pms1:false,
            pms2:false,
            pms3:false,
            pms4:false,
            // menu1: 'http://10.15.32.150:18080',
            // menu2: 'http://10.15.32.150:28080',
            select: 0,
            subList1: '',
            subList2: '',
            subList3: '',
            subList4: '',
        });

        const menuEnter = () => {
            state.menu = true;
        };

        const menuLeave = () => {
            state.menu = false;
            state.pms1 = false;
            state.pms2 = false;
            state.pms3 = false;
            state.pms4 = false;
            state.subList = '';
        };
        const pmsSubMenuOpen1 = () => {
            state.pms1 = true;
            state.pms2 = false;
            state.pms3 = false;
            state.pms4 = false;
            state.select = 1;
        };
        const pmsSubMenuOpen2 = () => {
            state.pms1 = false;
            state.pms2 = false;
            state.pms3 = true;
            state.pms4 = false;
            state.select = 2;
        };
        const pmsSubMenuOpen3 = () => {
            state.pms1 = false;
            state.pms2 = false;
            state.pms3 = true;
            state.pms4 = false;
            state.select = 3;
        };
        const pmsSubMenuOpen4 = () => {
            state.pms1 = false;
            state.pms2 = false;
            state.pms3 = false;
            state.pms4 = true;
            state.select = 5;
        };
        
        const goRouter = (value, idx) => {
            router.push(value);
            state.select = idx;
        };

        const goSite = (value) => {
            window.location.href = value;
        };

        const subMenu = (idx) => {
            if (state.subList === idx) {
                state.subList = '';
            } else {
                state.subList = idx;
            }
        };

        return {
            state,
            menuEnter,
            menuLeave,
            pmsSubMenuOpen1,
            pmsSubMenuOpen2,
            pmsSubMenuOpen3,
            pmsSubMenuOpen4,
            goRouter,
            goSite,
            mainImg,
            mainImg2,
            mainImg3,
            mainImg1,
            mainImg4,
            mainImg5,
            mainImgSelect,
            mainImgSelect2,
            mainImgSelect3,
            mainImgSelect1,
            mainImgSelect4,
            mainImgSelect5,
            subMenu,
        };
    },
};
</script>

<style lang="scss" scoped>
.menu-bar {
    width: 15px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: linear-gradient(
        to right,
        rgba(19, 46, 69, 0.5) 2%,
        rgba(10, 80, 124, 0.7) 48%,
        #08214a 95%
    );
    .q-expansion-item {
        width: 100%;
        align-items: center;
    }
    .submenu {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        // margin-left: -15px;
    }
    .menu {
        .logo-box {
            width: 100%;
            height: 63px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 55px;
                height: 25px;
            }
        }
        .menu-item {
            width: 100%;
            height: 68px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #828eb6;
            font-size: 11px;
            font-weight: lighter;
            cursor: pointer;

            img {
                width: 33px;
                margin-bottom: 12px;
                margin-top: 10px;
            }
        }

        .selected {
            background: rgba(255, 255, 255, 0.1);

            .select {
                color: white;
            }
        }
    }

    .pms-subMenu {
        width: 165px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 105px;
        background: linear-gradient(
            91deg,
            rgba(11, 50, 95, 0.8) 1%,
            #021f3b 95%
        );
        .sub-logo {
            cursor: pointer;
            padding-top: 20px;
            width: 100%;
            height: 63px;
            display: inline-flex;
            align-items: center;

            img {
                width: 17px;
                margin-right: 5px;
                margin-left: 13px;
            }
            span {
                font-size: 15px;
                color: white;
            }
        }

        .sub-item {
            width: 100%;
            display: inline-flex;
            align-items: center;
            flex-wrap: wrap;
            cursor: pointer;
            img {
                margin: 14px 16px 14px 0;
                width: 22px;
                margin-right: 12px;
            }
            span {
                color: white;
                font-size: 0.8125rem;
                font-weight: 500;
                line-height: 1rem;
            }

            .selectFont {
                color: #10a4df;
            }

            .sub-item-list {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                height: 0px;
                visibility: hidden;

                .item {
                    display: flex;
                    padding: 20px 22px;
                    width: 100%;
                    align-items: center;
                    font-size: 0.8125rem;
                    color: white;
                    white-space: nowrap;

                    .circle {
                        width: 4px;
                        height: 4px;
                        background: white;
                        border-radius: 6px;
                        margin-right: 22px;
                    }
                }

                .item:hover {
                    background: rgba(0, 0, 0, 0.1);
                    transition: 0.2s;
                }
            }
            .showList {
                visibility: visible;
                height: auto;
            }
        }
    }
    .arrow-box {
        background: rgb(8, 33, 74);
        width: 13px;
        height: 30px;
        position: absolute;
        top: 65px;
        left: 15px;
        display: flex;
        justify-content: center;
        align-items: center;

        .arrow {
            width: 0px;
            height: 0px;
            border-top: 5px solid transparent;
            border-left: 5px solid white;
            border-bottom: 5px solid transparent;
        }
    }

    .arrowEnter {
        left: 105px;
    }
    .arrowEnter.selectPms {
        left: 270px;
    }
}

.menuEnter {
    width: 105px;
}
</style>
