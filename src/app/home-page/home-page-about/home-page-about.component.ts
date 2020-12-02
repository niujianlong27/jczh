import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var AMap: any;

@Component({
  selector: 'app-home-page-about',
  templateUrl: './home-page-about.component.html',
  styleUrls: ['./home-page-about.component.css']
})
export class HomePageAboutComponent implements OnInit {

  constructor(
    private router: Router,
    private titleEmit: Title
  ) { }

  ngOnInit() {
    this.initAMap();
    this.titleEmit.setTitle('汇好运-关于我们');
  }

  initAMap(): void {
    // var map = new AMap.Map('container', {
    const map = new AMap.Map('container', {
      resizeEnable: true,
      center: [121.504857, 31.341762],
      zoom: 10
    });

    // var marker = new AMap.Marker({
    const marker = new AMap.Marker({
      position: [121.504857, 31.341762]
    });
    marker.setMap(map);

    // var circle = new AMap.Circle({
    const circle = new AMap.Circle({
      center: [121.504857, 31.341762],
      radius: 100,
      fillOpacity: 0.2,
      strokeWeight: 1
    });
    circle.setMap(map);
    map.setFitView();

    // var info = new AMap.InfoWindow({
    const info = new AMap.InfoWindow({
      content: '这里是上海杨浦区国权北路1688弄19号湾谷科技园A3座 京创智汇（上海）物流科技有限公司',
      offset: new AMap.Pixel(0, -28)
    });
    info.open(map, marker.getPosition());
  }


  //   setTimeout(function(){
  //     $(function() {
  //         var map = new AMap.Map('container', {
  //             center: [121.490446, 31.294155],
  //             zoom: 15
  //         });
  //         var marker = new AMap.Marker({
  //             position: [121.490446, 31.294155]
  //         });
  //         marker.setMap(map);
  //         var circle = new AMap.Circle({
  //             center: [121.490446, 31.294155],
  //             radius: 100,
  //             fillOpacity: 0.2,
  //             strokeWeight: 1
  //         })
  //         circle.setMap(map);
  //         map.setFitView();
  //         var info = new AMap.InfoWindow({
  //             content: "这里是上海杨浦区逸仙路25号同济晶度21楼川洋信息科技有限公司",
  //             offset: new AMap.Pixel(0, -28)
  //         })
  //         info.open(map, marker.getPosition())
  //     })
  // },300)

  /*点击“下载”，跳转下载页面*/
  downLoad() {
    this.router.navigate(['home-page-app']);
  }
  /*点击首页，跳转*/
  homePage() {
    this.router.navigate(['/']);
  }

}
