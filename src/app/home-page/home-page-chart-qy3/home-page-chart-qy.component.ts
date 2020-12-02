import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page-chart-qy3',
  templateUrl: './home-page-chart-qy.component.html',
  styleUrls: ['./home-page-chart-qy.component.css']
})
export class HomePageChartQy3Component implements OnInit {

  options: any;
  constructor() {
  }

  ngOnInit() {
    console.log('显示折线图');
    const colors = ['#5793f3', '#d14a61', '#379090' ];
    this.options = {
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: '运价指数',
          textStyle: {
            fontSize: 18
          }
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, // 起点位置
          splitLine: {show: true},
          data: ['', '07-04', '07-10', '07-22', '08-21', '09-16'],
        },
        legend: {
          data: ['板材', '螺纹钢', '型钢'],
          bottom: '10%'
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [
          {
            name: '板材',
            data: [4.85, 4.8, 4.81, 4.83, 4.84, 4.8],
            type: 'line',
            smooth: true
          },
          {
            name: '螺纹钢',
            data: [4.82, 4.82, 4.84, 4.83, 4.84, 4.82],
            type: 'line',
            smooth: true
          },
          {
            name: '型钢',
            data: [4.87, 4.83, 4.85, 4.80, 4.81, 4.89],
            type: 'line',
            smooth: true
          },
        ],
    };
  }
}
