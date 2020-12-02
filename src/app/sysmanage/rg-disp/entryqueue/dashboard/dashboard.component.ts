import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {urls} from '../../../../common/model/url';
import {HttpUtilService} from '@service/http-util.service';

declare var jQuery: any;
declare var SVG: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  androidAddress:any
  IOSAddress:any
  constructor(private router: Router,private http: HttpUtilService,) {
    this.init()
  }

  ngOnInit() {
    // this.getAppDownload()
  }
  init() {
    const loadPaper = function () {
      jQuery.ajax({
        type: 'GET',
        url: './assets/flow.txt',
        success: function (svgXML) {
          const paper = SVG('paper').size(800, 400);
          paper.svg(svgXML);
          setTimeout('SVG._callbindEvents()', 50);
        }
      });
    }

    loadPaper();

    const self = this;
    SVG._callbindEvents = function () {
      self.bindSvgEvents('dispatch', '/system/rg-disp/entryqueue/vehiclequeue');
      self.bindSvgEvents('dispatch2', '/system/rg-disp/entryqueue/vehiclequeue');
      self.bindSvgEvents('dealNo', '/system/rg-disp/entryqueue/dealquery');
    };
  }

  bindSvgEvents(id, path) {
    const self = this;
    SVG.get(id).click(function () {
      self.gotoPage(path);
    });
    SVG.get(id).mouseover(function () {
      this.attr({ 'opacity': 0.5 });
    });
    SVG.get(id).mouseout(function () {
      this.attr({ 'opacity': 1 });
    });
  }
  /**
   * 跳转页面
   * @param path 带反斜杠路径
   */
  gotoPage(path) {
    //window.location.href = '#' + path;
     this.router.navigateByUrl(path);
  }
  // getAppDownload(){
  //   this.http.post(urls.getNewAppVersion,{appOs:'CZXT20'}).then(res=>{
  //     if(res.success){
  //       this.androidAddress = res.data.data;
  //     }
  //   })
  // }
}
