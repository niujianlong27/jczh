import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-portal-chart',
  templateUrl: './portal-chart.component.html',
  styleUrls: ['./portal-chart.component.css']
})
export class PortalChartComponent implements OnInit {
  options: any;
  //public chartOption: EChartOption;//方法2
  constructor() {
  }
 
  ngOnInit() {
    
    //this.chartTest1();//方法2

    console.log("显示折线图")
    var colors = ['#5793f3', '#d14a61', ];
    this.options = {
        color: colors,
    
        tooltip: {
          trigger: 'axis'
        },

        title:[
          {
            left: 'center',
            top:'20px',
            text: '内贸运价走势',
          },
        ],

        grid: {
          top: 80,
          bottom:100
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['','3月','4月','5月','6月','7月','8月','9月','10月']
        },

        yAxis: {
          type: 'value',
          name: '单位:¥',
          min: 0,
          max: 70,
          interval: 10,
        },
        
        series: [
          {
            data: [,29.50, 31.00, 56.35, 37.22, 46.75, 35.12, 41.00,57.00],
            type: 'line'
          },
          {
            data: [,30.00, 27.66, 32.01, 35.63, 37.22, 33.75, 47.12, 32.11],
            type: 'line'
          },
        ],
      };
    }

    // chartTest1(){
    //     this.chartOption = {
    //       xAxis: {
    //           type: 'category',
    //           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //       },
    //       yAxis: {
    //           type: 'value'
    //       },
    //       series: [{
    //           data: [820, 932, 901, 934, 1290, 1330, 1320],
    //           type: 'line'
    //       }]
    //   };
    // }

}



 

