<template>
  <!--
		알림 팝업 창 modal로 만들어 놓고
		정해진 페이지에서 true/false 값을 받게되면
		해당 Popup_peak components를 보여줌.
		todo list
		1. peak.vue 페이지에서 값을 받아야함.
		
		-->
	<div id="pop2" v-if="openModal">
		<div class="popup__title">
			<!-- popup__icon -->
			<div class="popup__icon"></div>
			<span id="pop2_title">알림</span>
		</div>
		 
		<!-- popoup__body -->
		<div class="popoup__body" >
			<span style="font-size: 20px;" id ="pop2_msg" ></span>
		</div>
		
		<!-- popup_button -->
		<div	class="popup_button">
			<!-- btn__cancel -->
			<!-- btn__chagne -->		
			<div class="popup__btn popup__btn__change">확인</div>
		</div>
	</div>
</template>

<script>
// proxy array => popinfo == object.
// 
export default {
	props: ['popInfo'],
	data() {
		return {
			openModal: false
		}
	},
	// watch: {
	// 	popInfo(val) {
	// 		console.log(' ????? : ', val);
	// 	}
	// },
	mounted() {
		// console.log('openModal : ', this.popInfo);
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/component/title.scss';
@import '~@/style/layout.scss';

.peak_right_box {
	height: calc(80% - 40px);
	width: 100%;
	background: url('@/assets/img/analysis/table_bg_02.png') no-repeat;
	background-position: center;
	background-size: 100% 100%;
	color: #fff;
	font-family: 'KHNPHDRegular';
	font-size: 18px;
}


.cost_spring_area {
	background: url('@/assets/img/cost_spring.png') no-repeat; 
	background-position: bottom;
}


.contents-body {
	left: 18px;
	float: left;
	width: calc(100% - 38px);
	height: calc(100% - 105px);
	/* margin: 10px; */
	margin-top: 10px;
	margin-left: 25px;
	display: flex;
	flex-direction: column;
}

/** peak css */
.itemsWrap1 {
	width: 100%;
	float: left;
	margin: 5px 0 0 0;
}
.itemsWrap2 {
	height: 300px;
	width: 50%;
	float: left;
	margin: 5px 0 0 0;
}
.EitemsName2{
	height: 50px;
	margin: 0 20px 0 20px;
}
.items4 {
	width: calc(100% - 10px);
	height: 100%;
	margin-right: 10px;
	background-color: #0068e822;
	border-radius: 10px;
	/* box-shadow: 1px 1px 5px #d3d3d5; */
	border-style: inset;
	border-width: 1px;
	border-color: #33a2ff;
}
.tui-grid-cell-header {
	background-color: #15284e;
	border-color: #33a2ff;
	border-left-width: 1px;
	border-right-width: 1px;
	border-top-width: 1px;
	border-bottom-width: 1px;
	color: #fff;
}
.tui-grid-scrollbar-right-top {
	background-color: #15284e;
	border-color: transparent;
}
.sub_bottom_left {
	width: 100%;
	height: 99%;
}
.margin-left3 {
	margin-left: 3%;
}.sub_bottom_title {
	display: flex;
	flex-direction: row;
}.sub_bottom_title-font {
	text-shadow: 0 0 9px #5cafff;
	font-size: 17px;
	font-family: KHNPHDRegular;
	letter-spacing: normal;
	color: #c3eaff;
	padding: 2% 0 0 0;
	width: 100%;
	text-align: center;
}
.sub_content_icon {
	width: 100%;
	height: 100%;
	background: url('@/assets/img/dr/texttitle_based.png') no-repeat;
	background-size: 70% 100%;
	background-position: center;
}.sub_content {
	height: 58%;
	display: flex;
	align-items: center;
	padding: 0 0 0 26%;
	margin-top: -0.5%;
}.sub_content_title-font {
	text-shadow: 0 0 9px #5cafff;
	font-size: 19px;
	font-family: KHNPHDRegular;
	letter-spacing: normal;
	color: #c3eaff;
	align-self: center;
	padding: 2% 0 0 26%;
}.sub_content_font {
	text-shadow: 0 0 9px #5cafff;
	font-size: 14px;
	font-family: KHNPHDRegular;
	letter-spacing: normal;
	color: #c3eaff;
	align-self: center;
	padding: 0 2% 0 0;
}.sub_input_box {
	width: 23%;
	height: 35%;
	border: 2px solid #489cf2;
	background-color: #15284e;
	color: #fff;
}
.subbox-cont {
	height: 13%;
	margin-top: 10px;
}

.spend_text_wrap{
	width: 100%;
	height: 15%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.spend_tagname{
	width: 55%;
}
.spend_text{
	width: 15%;
	text-shadow: 0 0 9px #5cafff;
	color: #c3eaff;
	text-align: right;
}
.spend_value{
	width: 15%;
	font-family: 'LAB디지털';
	font-size: 20px;
	text-align: right;
}
.spend_unit{
	width: 10%;
	margin-left: 10px;
	text-align: left;
	text-shadow: 0 0 9px #5cafff;
	color: #c3eaff;
}

.spend_co1{
	text-shadow: 0 0 9px #5cafff;
	font-size: 18px;
	font-family: KHNPHDRegular;
	letter-spacing: normal;
	color: #c3eaff;
	align-self: center;}
    
.refresh_img{
	background: url('@/assets/img/refresh.png') no-repeat;
	background-size: 100% 100%;
	background-position: center;
	width: 55px;
	height: 55px;
	margin-left: 52%;
}

.font_timer{
	font-family: LABDigital !important;
	font-size: 25px;
	color: #c3eaff;
	letter-spacing: 1px;
	line-height: 111px;
}


</style>
