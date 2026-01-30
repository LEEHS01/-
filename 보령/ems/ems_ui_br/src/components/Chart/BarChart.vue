<template>
  <div>
    <!-- <plotly-plot :data="chartData" :layout="chartLayout"></plotly-plot> -->
    <div id="myChart"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly.js'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      chartData: [
        {
          x: [1, 2, 3, 4, 5],
          y: [1, 4, 2, 3, 7],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' }
        }
      ],
      chartLayout: {
        title: 'Plotly Chart Example',
        xaxis: { title: 'X-axis' },
        yaxis: { title: 'Y-axis' },
        //  width: 100, // 그래프의 가로 크기 설정
        height: 250 // 그래프의 세로 크기 설정
      }
    }
  },
	created() {
    this.getChart('송산')
	},
  mounted() {
    // Plotly.newPlot('myChart', this.chartData, this.chartLayout)
  },
	computed: {
		...mapState('mariadb', ['PumpchartData']),
	},
  methods: {
		...mapActions('mariadb', ['fetchChartData']),
		async chartAction() {
			await this.fetchChartData();
		},
    async getChart(param) {
      let plot_layout = {
				height: 250,
				legend: {font: {color: '#FFF'}, x: 0.2, y: 1.2, orientation: 'h'},
				showlegend: true,
				margin: { t: 20,l:120,r:120,b:80},
				modebar:{activecolor:'blue'},
				hovermode:'x',
				plot_bgcolor: 'transparent' ,
				paper_bgcolor: 'transparent' , 
				xaxis:{color:"#FFF",showline:true,showgrid:false,tickformat: "%m-%d"},
				yaxis:{color:"#FFF",showline:true,showgrid:false,exponentformat: 'none',fixedrange: true,title:"kWh"},
				yaxis2:{side: 'right',color:"#FFF",showline:true,showgrid:false,exponentformat: 'none',fixedrange: true,title:"kWh/m3"},
				font: { family:'KHNPHDRegular',},
			};
			let chartData = [];
			let data1 = [];
			let data2 = [];
			await this.chartAction();
			if( this.PumpchartData ) {
				data1 = JSON.parse(JSON.stringify(this.PumpchartData));
				let x = [];
				let y1 = [];
				let y2 = [];
				let y3 = [];
	
				if(data1.length != 0) {
					for(var i=0; i< data1.length; i++) {
						x[i] = data1[i].ts;
						// y1[i] = data1[i].val;
						y1[i] = 0.33;
						y2[i] = data1[i].unit;
						y3[i] = data1[i].savingKwh;
					}
					this.chartData = []; // 기존 값을 초기화 후 push
					// data1.val 이 database에서 값이 안나옴. query 문제인가
					this.chartData.push( { title:'',yaxis: 'y2',mode:'lines',name:"기준원단위(kWh/m3)",x: x, y:y1,visible:true,line: {dash:'dash',color:"#ffd77a"}, });
					this.chartData.push( { title:'',yaxis: 'y2',mode:'lines',name:"현재원단위(kWh/m3)",x: x, y:y2,visible:true,line: {dash:'dash',color:"#EF5656"}, });
					this.chartData.push( {fill: 'tozeroy',mode:'lines',name:"전력 절감량(kWh)",x: x, y:y3,visible:true,line: {shape: 'spline',color:"#485fa8"},opacity:0.1, });
				}
					Plotly.react('myChart', this.chartData, plot_layout)
			}

    }
  }
}
</script>
