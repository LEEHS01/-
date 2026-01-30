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
                @click="goRouter('/')"
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
            <!-- <div
                class="menu-item"
                @click="goSite('http://10.231.21.230:20102/index')"
                :class="{ selected: state.select === 4 }"
            >
                <img :src="state.select === 4 ? mainImgSelect4 : mainImg4" />
                <span :class="{ select: state.select === 4 }">지능형 영상</span>
            </div> -->
            <!-- <div
                class="menu-item"
                @click="pmsSubMenuOpen4"
                :class="{ selected: state.select === 5 }"
            >
                <img :src="state.select === 5 ? mainImgSelect5 : mainImg5" />
                <span :class="{ select: state.select === 5 }">운영 관리</span>
            </div> -->
        </div>
        <!-- 자율운영서브메뉴 -->
        <!-- <div class="pms-subMenu" v-if="state.pms1">
            <div class="sub-logo">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    자율 운영
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon1.svg"
                                    alt=""
                                />
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
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/receivingAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 0 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 0 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon2.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 1 }"
                                    >약품</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/cgAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 1 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 1 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon3.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 2 }"
                                    >혼화/응집</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/mtccAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 2 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 2 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon4.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 3 }"
                                    >침전</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/sedimentationAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 3 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 3 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon5.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 4 }"
                                    >여과</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/filterAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(5)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon6.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 5 }"
                                    >GAC여과</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/gacAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 5 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 5 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(6)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon7.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 6 }"
                                    >소독</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:18080/disinfectionAlgorithm'
                                    )
                                "
                                :class="{ showitem: state.subList === 6 }"
                            >
                                <div class="circle"></div>
                                세부현황
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="goSite('http://10.15.32.150:18080')"
                                :class="{ showitem: state.subList === 0 }"
                            >
                                <div class="circle"></div>
                                시뮬레이션
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(7)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section
                            @click="
                                goSite('http://10.15.32.150:28080/analysis')
                            "
                        >
                            <div class="submenu">
                                <img
                                    class="etc"
                                    src="@/assets/icon/icon-new.png"
                                    alt=""
                                    style="width : 28px; margin-right : 10px; margin-left : -2px;"
                                />
                                <span
                                    :class="{ selectFont: state.subList === 7 }"
                                    >송수</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
        </div> -->
        <!-- 스마트EMS 서브메뉴 -->
        <!-- <div class="pms-subMenu ems-subMenu" v-if="state.pms2">
            <div class="sub-logo">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    스마트EMS
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div
                                class="submenu"
                                @click="goSite('http://10.15.32.150:28080')"
                            >
                                <img
                                    src="@/assets/icon/ems-new-icon1.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 0 }"
                                    >대시보드</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <q-expansion-item
                    group="somegroup"
                    expand-icon="none"
                    :header-inset-level="1"
                    :header-style="{ paddingLeft: 8 }"
                >
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/ems-new-icon2.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 1 }"
                                    >AI분석</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <q-expansion-item
                            expand-icon="none"
                            :header-style="{ padding: 0 }"
                        >
                            <template v-slot:header>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        <div class="circle"></div>
                                        송수펌프 분석
                                    </div>
                                </div>
                            </template>
                            <q-card
                                class="bg-transparent"
                                style="padding-left : 27px;"
                            >
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/analysis'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        제어 분석
                                    </div>
                                </div>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/songsu'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        제어 세부 현황
                                    </div>
                                </div>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/sujiSelect'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        제어 트렌드
                                    </div>
                                </div>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/pumpPerform'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        가동이력
                                    </div>
                                </div>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/sujiSelect_2'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        배수지 수위 현황
                                    </div>
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-expansion-item
                            expand-icon="none"
                            :header-style="{ padding: 0 }"
                        >
                            <template v-slot:header>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        <div class="circle"></div>
                                        전력피크
                                    </div>
                                </div>
                            </template>
                            <q-card
                                class="bg-transparent"
                                style="padding-left : 27px;"
                            >
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/peakcontrol'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        분석
                                    </div>
                                </div>
                                <div class="sub-item-list showList">
                                    <div
                                        class="item"
                                        @click="
                                            goSite(
                                                'http://10.15.32.150:28080/peak'
                                            )
                                        "
                                        :class="{
                                            showitem: state.subList === 1,
                                        }"
                                    >
                                        세부현황
                                    </div>
                                </div>
                            </q-card>
                        </q-expansion-item>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(2)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/ems-new-icon3.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 2 }"
                                    >에너지 사용 현황</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite('http://10.15.32.150:28080/zoneUse')
                                "
                                :class="{ showitem: state.subList === 2 }"
                            >
                                <div class="circle"></div>
                                시설병 사용량
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite('http://10.15.32.150:28080/facUse')
                                "
                                :class="{ showitem: state.subList === 2 }"
                            >
                                <div class="circle"></div>
                                설비별 사용량
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite('http://10.15.32.150:28080/useTrand')
                                "
                                :class="{ showitem: state.subList === 2 }"
                            >
                                <div class="circle"></div>
                                사용량 트랜드
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(3)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/ems-new-icon4.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 3 }"
                                    >에너지 절감관리</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite('http://10.15.32.150:28080/cost')
                                "
                                :class="{ showitem: state.subList === 3 }"
                            >
                                <div class="circle"></div>
                                최적요금제 분석
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:28080/reduction'
                                    )
                                "
                                :class="{ showitem: state.subList === 3 }"
                            >
                                <div class="circle"></div>
                                절감목표 달성 현황
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(4)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/ems-new-icon5.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 4 }"
                                    >설정</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                    <q-card class="bg-transparent">
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:28080/tagSetting'
                                    )
                                "
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                태그 정보
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:28080/pumpOperation'
                                    )
                                "
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                송수펌프 운영
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:28080/costSetting'
                                    )
                                "
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                전력요금제
                            </div>
                        </div>
                        <div class="sub-item-list showList">
                            <div
                                class="item"
                                @click="
                                    goSite(
                                        'http://10.15.32.150:28080/goalSetting'
                                    )
                                "
                                :class="{ showitem: state.subList === 4 }"
                            >
                                <div class="circle"></div>
                                절감목표
                            </div>
                        </div>
                    </q-card>
                </q-expansion-item>
            </div>
        </div> -->
        <!-- 스마트PMS 서브메뉴 -->
        <div class="pms-subMenu" v-if="state.pms3">
            <div class="sub-logo">
                <img src="@/assets/icon/smartpms.png" alt="" />
                <span>
                    스마트 PMS
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('/')">
                            <div class="submenu">
                                <img src="@/assets/icon/ems-icon1.svg" alt="" />
                                <span>대시보드</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
                <!-- <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon1.svg"
                                    alt=""
                                />
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
                </q-expansion-item> -->
            </div>

            <!-- <div class="sub-item" @click="subMenu(1)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon2.svg"
                                    alt=""
                                />
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
                                약품펌프
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
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon3.svg"
                                    alt=""
                                />
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
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon4.svg"
                                    alt=""
                                />
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
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon5.svg"
                                    alt=""
                                />
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
            <div class="sub-item" @click="subMenu(5)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon6.svg"
                                    alt=""
                                />
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
            <div class="sub-item" @click="subMenu(6)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon6.svg"
                                    alt=""
                                />
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
            </div> -->
            <!-- <div class="sub-item" @click="subMenu(7)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/auto-icon7.svg"
                                    alt=""
                                />
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
            </div> -->
            <!-- <div class="sub-item" @click="subMenu(8)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section>
                            <div class="submenu">
                                <img
                                    class="etc"
                                    src="@/assets/icon/icon-new.png"
                                    alt=""
                                    style="width : 28px; margin-right : 10px; margin-left: -2px;"
                                />
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
            </div> -->
            <div class="sub-item">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('MotorView')">
                            <div class="submenu">
                                <img src="@/assets/icon/icon-new.png" alt="" />
                                <span>송수</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
            <div class="sub-item">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('DiagnosisView')">
                            <div class="submenu">
                                <img src="@/assets/icon/main.png" alt="" />
                                <span>정밀진단</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
            <div class="sub-item">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('StatisticsView')">
                            <div class="submenu">
                                <img src="@/assets/icon/main6.png" alt="" />
                                <span>통계</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
            <!-- <div class="sub-item">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('DiagnosisView')">
                            <div class="submenu">
                                <img src="@/assets/icon/main.png" alt="" />
                                <span>정밀진단</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
            <div class="sub-item">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section @click="goRouter('HistoryView')">
                            <div class="submenu">
                                <img src="@/assets/icon/ems-icon1.svg" alt="" />
                                <span>통계/이력</span>
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div> -->
        </div>
        <!-- 운영관리 서브메뉴 -->
        <!-- <div class="pms-subMenu" v-if="state.pms4">
            <div class="sub-logo">
                <span>
                    운영 관리
                </span>
            </div>
            <div class="sub-item" @click="subMenu(0)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section
                            @click="
                                goSite('http://10.15.32.150:18080/alarmHistory')
                            "
                        >
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/setting-icon1.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 0 }"
                                    >알람이력</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>

            <div class="sub-item" @click="subMenu(1)">
                <q-expansion-item group="somegroup" expand-icon="none">
                    <template v-slot:header>
                        <q-item-section
                            @click="
                                goSite(
                                    'http://10.15.32.150:18080/performanceMonitoring'
                                )
                            "
                        >
                            <div class="submenu">
                                <img
                                    src="@/assets/icon/setting-icon2.svg"
                                    alt=""
                                />
                                <span
                                    :class="{ selectFont: state.subList === 1 }"
                                    >성능 모니터링</span
                                >
                            </div>
                        </q-item-section>
                    </template>
                </q-expansion-item>
            </div>
        </div> -->
        <div
            class="arrow-box"
            :class="[
                { arrowEnter: state.menu },
                { selectPms: state.pms1 },
                { selectPms2: state.pms2 },
                { selectPms: state.pms3 },
                { selectPms: state.pms4 },
            ]"
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
            pms1: false,
            pms2: false,
            pms3: false,
            pms4: false,
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
            
            //ksw window.open(window.globalAioURL, '_self')

            const token = localStorage.getItem('authToken'); // localStorage에서 토큰 읽기
            if (token) {
                console.log('메뉴받은 토큰:', token);
                // const url = new URL(process.env.globalAioURL);
                const url = new URL(window.globalAioURL); // window 객체에서 접근
                url.searchParams.append('token', token); // 쿼리 파라미터 추가
                console.log('보낼URL: ', url)
                window.open(url.toString(), '_self'); // 최종 URL로 이동
            } else {
                console.error('메뉴토큰이 없습니다.');
            }
        }

        const pmsSubMenuOpen2 = () => {
            state.pms1 = false;
            state.pms2 = true;
            state.pms3 = false;
            state.pms4 = false;
            state.select = 2;

            //window.open(window.globalemsURL, '_self')
            const token = localStorage.getItem('authToken'); // localStorage에서 토큰 읽기
            if (token) {
                console.log('메뉴받은 토큰:', token);
                // const url = new URL(process.env.globalAioURL);
                const url = new URL(window.globalemsURL); // window 객체에서 접근
                url.searchParams.append('token', token); // 쿼리 파라미터 추가
                console.log('보낼URL: ', url)
                window.open(url.toString(), '_self'); // 최종 URL로 이동
            } else {
                console.error('메뉴토큰이 없습니다.');
            }
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
        color: white;

        .svgIcon {
            overflow: visible;
            display: flex;
            align-items: center;
            justify-content: center;
            fill: white;
        }

        span {
            white-space: nowrap;
        }
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
                width: 24px;
                margin-right: 12px;
            }
            img.ect {
                width: 28px !important;
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

            .expandCon {
                display: none;
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

    .ems-subMenu {
        width: 200px;
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
    .arrowEnter.selectPms2 {
        left: 305px;
    }
}

.menuEnter {
    width: 105px;
}
</style>
