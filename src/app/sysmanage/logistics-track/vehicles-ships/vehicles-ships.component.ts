import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpUtilService} from '../../../common/services/http-util.service';//引入自定义封装的http,实现与后台服务器接口对接
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment'; //引入环境配置
import {NzModalRef,NzModalService, NzNotificationService} from 'ng-zorro-antd';//引入ngzorro库的相关组件，从而实现弹窗，信息提示和文件上传功能
import { GlobalService } from '../../../common/services/global-service.service';
import { urls } from '../../../common/model/url';

@Component({
  selector: 'app-vehicles-ships',
  templateUrl: './vehicles-ships.component.html',
  styleUrls: ['./vehicles-ships.component.css']
})
export class VehiclesShipsComponent implements OnInit {

  //表格数据
  dataSet1:Array<any>=[];
  dataSet2:Array<any>=[];
  

  pageSize: number = 30;//条数
   // 总条数
  totalPage1:number;
  totalPage2:number;
  
  gridId:string = 'grid1';//gridId默认1
  tabIndex:number = 0;//面板默认为第一个
  
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;

  // // 数据弹出框
  // modalFormVisible1 = false; // 表单弹窗
  // modalValidateForm1: FormGroup;
  //
  // modalFormVisible2 = false; // 表单弹窗
  // modalValidateForm2: FormGroup;

  // 确认框
  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  private tplModal: NzModalRef; // 弹窗相关

  //车辆信息框
  vehicleModalIsVisible = false;
  vehicleModalTitle = '车辆信息';
  choiceVehicle: any = {};
  choiceVehiclePosition: any = {};
  //船舶信息框
  boatModalIsVisible = false;
  boatModalTitle = false;
  choiceBoat: any = {};
  choiceBoatPosition: any = {};
  isConfirmLoading = false;
  // position = [116.397428,39.90923];
  // position2 = [109.397428,38.90923];
  positionList = [];
  pathPosition = [];    //轨迹
  vehicleNos: Array<String> = [];   //车牌号数组
  mmsiNos: Array<String> = [];    //mmsi号数组
  boatPoints: Array<any> = [];    //船舶路径数组
  carPointResult: Array<any> = [];    //车辆路径数组
  //途经点图标
  wayPositionIcon = {
    size: {
      width: 40,
      height: 50
    },
    image: 'http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',
    imageOffset: {
      x: 0,
      y: -60
    }
  };
  startPositionIcon = {
    size: {
      width: 40,
      height: 50
    },
    image: 'http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',
    imageOffset: {
      x: 0,
      y: -60
    }
  };
  endPositionIcon = {
    size: {
      width: 40,
      height: 50
    },
    image: 'http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',
    imageOffset: {
      x: 0,
      y: -60
    }
  };

  constructor(private http: HttpUtilService,private fb: FormBuilder, private nz: NzNotificationService, private gl: GlobalService) { }

  ngOnInit() {
    this.getListSearch(urls.getOnBusinessVehicleInfo,{page:1,length:30},'grid1');//默认查询车辆列表
  }
  // 列表查询数据获取
  getListSearch(url:string,param: any,type):void {
    this.listLoading = true;
     this.http.post(url,param).then( (res:any)=>{
       this.listLoading = false;
       if(res.success){
          if(type === 'grid1'){
            this.dataSet1 = res.data.data.data;
            this.totalPage1 = res.data.data.total;
            this.vehicleNos = [];
            for (let i = 0; i < this.dataSet1.length; i++) {
              this.vehicleNos.push(this.dataSet1[i].vehicleNo || '');
            }
            //[].join(',')
          }else if(type === 'grid2'){
            this.dataSet2 = res.data.data.data;
            this.totalPage2 = res.data.data.total;
            this.mmsiNos = [];
            for (let i = 0; i < this.dataSet2.length; i++) {
              this.mmsiNos.push(this.dataSet2[i].mmsi || '');
            }
            console.log(this.mmsiNos);
          }
         
       }
     })
  }
  //查询
  listSearch(data:any):void {
    this.tabIndex = 0;
    this.gridId = 'grid1';
    data.page = data.page || 1;
    data.length = data.length || 30;
    this.getListSearch(urls.getOnBusinessVehicleInfo,data,'grid1');
  }
  tabResultFun(flag:string){
    if(this.gridId === flag){
       return;
    }
    let settleNo = [];

    window.setTimeout(()=>{
     // this.gridId = flag.gridId;
    //  this.dataSet = [];
      if(flag === 'grid1'){
        this.tabIndex = 0;
        this.gridId = 'grid1';
        this.dataSet1 = [];
        this.getListSearch(urls.getOnBusinessVehicleInfo,{page:1,length:30},flag);
      }else if(flag === 'grid2'){
        this.tabIndex = 1;
        this.gridId = 'grid2';
        this.dataSet2 = [];
        this.getListSearch(urls.getOnBusinessBoatInfo,{page:1,length:30},flag);
      }
    })
  }

  //选择船舶
  boatChoiceClick(data:any):void{
    this.boatModalIsVisible = true;
    this.choiceBoat = data;
    //获取选择船舶位置信息
    // this.http.post(urls.getSingleShipPosition,{shipId:data.mmsi}).then( (res:any)=>{
    //   console.log(res);
    //   this.choiceBoatPosition = {lon:res.data.data.data[0].lon/1000000,lat:res.data.data.data[0].lat/1000000}
    //   console.log(this.choiceBoatPosition);
    // })
  }

  //选择车辆
  vehicleChoiceClick(data:any):void{
    this.vehicleModalIsVisible = true;
    this.choiceVehicle = data;
    this.choiceVehiclePosition = {};
    //获取当前车辆位置
    this.http.post(urls.getSingleCar,{vclN:data.vehicleNo,timeNearby:"24"}).then( (res:any)=>{
      console.log(res);
      if (res.data.data.status == '1001'){
        this.choiceVehiclePosition = {lon:(Number(res.data.data.result.lon)/600000).toFixed(6) || '',lat:(Number(res.data.data.result.lat)/600000).toFixed(6) || ''};
        console.log(this.choiceVehiclePosition);
      }else {
        this.nz.create('error', '提示信息', '没有获取到位置信息', { nzDuration: 3000 });
      }
    })
  }

  handleCancel(): void {
    this.vehicleModalIsVisible = false;
    this.boatModalIsVisible = false;
  }

  //获取船舶路径
  getBoatPathPosition(): void{
    this.isConfirmLoading = true;
    window.setTimeout(() => {
      this.http.post(urls.getShipTrack,{shipId: this.choiceBoat.mmsi,btm: '2019-01-10 23:12:00', etm: '2019-01-11 23:12:00'}).then( (res:any)=>{
        console.log(res);
        this.boatPoints = res.data.data.boatPoints;
        console.log(this.boatPoints);
        this.positionList = [];
        for (let i = 0; i < this.boatPoints.length; i++) {
          this.positionList.push([Number(this.boatPoints[i].lon)/1000000,Number(this.boatPoints[i].lat)/1000000])
        }
        this.pathPosition = this.positionList;
        //this.positionList = [[res.data.data.data[0].lon/1000000,res.data.data.data[0].lat/1000000]];
      });

      this.boatModalIsVisible = false;
      this.isConfirmLoading = false;
    });
  }

  //获取车辆路径
  getVehiclePathPosition(): void{
    this.isConfirmLoading = true;
    window.setTimeout(() => {
      this.http.post(urls.getCarTrack,{vclN: this.choiceVehicle.vehicleNo,qryBtm: '2019-01-10 00:00:01', qryEtm: '2019-01-10 01:00:01'}).then( (res:any)=>{
        console.log(res);
        this.carPointResult = res.data.data.result;
        console.log(this.carPointResult);
        this.positionList = [];
        for (let i = 0; i < this.carPointResult.length; i++) {
          this.positionList.push([Number(this.carPointResult[i].lon)/600000,Number(this.carPointResult[i].lat)/600000])
        }
        this.pathPosition = this.positionList;
      });

      this.vehicleModalIsVisible = false;
      this.isConfirmLoading = false;
    });
  }



}
