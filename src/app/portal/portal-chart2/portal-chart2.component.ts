import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portal-chart2',
  templateUrl: './portal-chart2.component.html',
  styleUrls: ['./portal-chart2.component.css']
})
export class PortalChart2Component implements OnInit {
  options: any;

  constructor() { }

  ngOnInit() {
    console.log("显示折线图2")
    var colors = ['#5793f3', '#d14a61','#e15e12' ];
    this.options = {
        color: colors,
    
        tooltip: {
          trigger: 'axis'
        },

        title:[
          {
            left: 'center',
            top:'20px',
            text: '内河运价走势',
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
          {
            data: [,27.00, 33.47, 34.22, 39.00, 42.31, 39.28, 40.58, 59.91],
            type: 'line'
          },
        ],
      };
  }

}
