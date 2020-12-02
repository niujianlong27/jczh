import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';
import { HttpUtilService } from 'src/app/common/services/http-util.service';

declare var  AMap: any;


@Component({
  selector: 'app-modal-map-line',
  templateUrl: './modal-map-line.component.html',
  styleUrls: ['./modal-map-line.component.css']
})
export class ModalMapLineComponent implements OnInit {

  marker:any;
  map:any;
  _vehicleIsVisible:boolean = false;
  truckNo:String;
  driverPhone:String;
  @Input() lineArr:any = [];

  // @Input() vehicleIsVisible:boolean = false;
  @Input() set vehicleIsVisible(val:boolean){
    this._vehicleIsVisible = val;
    if(this._vehicleIsVisible){
      this.getMap();
    }
   
    //console.log(val);
  }
  get vehicleIsVisible(){
    return this._vehicleIsVisible;

  }
   
  @Input() httpInfo:any ={};
  @Output() modalShow = new EventEmitter<any>();
  
  //   // 'url':DISPURL.GETVEHICLETRAJECTORY,
  //   // 'param':{enterpriseId: "C1806290001",recCreateTime: "2019-03-12 18:00:32"}
  // };

  constructor(
    private http:HttpUtilService
  ) { }

  ngOnInit() {

    // this.getMap();
  
  }

  getMap(){
    this.truckNo=this.httpInfo.param.truckNo;
    this.driverPhone=this.httpInfo.param.driverPhone;
      this.http.post(this.httpInfo.url, this.httpInfo.param).then((res: any) => {
        if (res.success) {
          //console.log(res.data);

           res.data.data.forEach(element => {
             let point=[element.longitude,element.latitude];
             this.lineArr.push(point);
             
           });
            
        }else{
          this.lineArr=[];
        }

        this.map = new AMap.Map('container', {
          resizeEnable: true,
          zoom:10,
          center: this.lineArr[0],
        });
    
        this.marker = new AMap.Marker({
          map: this.map,
          position: this.lineArr[0],
          icon: "https://webapi.amap.com/images/car.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle:-90,
        });
    
        
      // 绘制轨迹
      let polyline = new AMap.Polyline({
          map: this.map,
          path: this.lineArr,
          showDir:true,
          strokeColor: "#28F",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
      });
    
      let passedPolyline = new AMap.Polyline({
          map: this.map,
          // path: lineArr,
          strokeColor: "#AF5",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
      });
    
      this.marker.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
        });
    
        this.map.setFitView();
        //this.lineArr=[...this.lineArr];
        
      })
  }


  startAnimation () {
    this.marker.moveAlong(this.lineArr, 2000);
  }

  pauseAnimation () {
    this.marker.pauseMove();
  }

  resumeAnimation () {
    this.marker.resumeMove();
  }

  stopAnimation () {
    this.marker.stopMove();
  }

  vehicleHandleCancel(){
    this.lineArr=[];
    this.marker.stopMove();
    this._vehicleIsVisible=false;
    this.modalShow.emit({'modalShow':false});
  }
}
