import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-pick-queue',
  templateUrl: './pick-queue.component.html',
  styleUrls: ['./pick-queue.component.css']
})
export class PickQueueComponent implements OnInit {
  index: number = 0;
  searchData: any;
  transportType: string;
  num: number = 0;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;
  dataSet: any;
  para: any = {};
  data: null;
  isShow: boolean;
  isButton: boolean;
  updateVisible = false;//删除弹窗显示控制
  vehicleIsVisible = false;//车辆轨迹弹框
  modalTitle: string;
  updateCon: string;
  truckNo: string;
  param: any = {};
  taskId: string;
  breed: string;
  queueClassName: string;
  queueNo: string;
  gateName: string;
  warehouseName: string;
  updateParam: any = {};
  queueStartTime: Date;
  bk6: any;
  directEntryParam: any = {};
  greenChannelParam: any = {};
  factoryGateList: Array<any> = [];
  warehouseList: Array<any> = [];
  statusFlag: boolean;
  tabs: Array<any> = [];
  interval: any;
  isOkLoading: boolean = false;
  isLoading: boolean = false;
  status: string;
  searchFormData: any = [];
  httpInfo:any;

  // 弹框
  tplModal: NzModalRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  constructor(private http: HttpUtilService, private modal: NzModalService, private nz: NzNotificationService, private info: UserinfoService) {
    this.interval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }) }, 1000 * 60);
  }

  ngOnInit() {
    //this.listSearch({ page: 1, length: this.pageSize });
    this.getallCodest();
    this.getWarehouse({ kindName: 'WT02', status: 'ST01' });
    this.getTittleName();
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }

  //获取表头字段
  getTittleName(): void {
    const tab: any = {};
    tab.itemCname = "全部";
    tab.itemCode = "root";
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            if (element.codesetCode == 'PZKRCDM') {
              // this.factoryGateList.push(element.itemCname);
              // console.log(this.factoryGateList)
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              item.itemCount = 0;
              this.tabs.push(item)
            }
          });
          this.listSearch({ page: 1, length: this.pageSize });
          //this.getStataByGate({});
        }
      }
    )

  }

  //获取全部老区新区数据
  getStataByGate(data: any): void {
    let sum: number = 0;
    data.transportType = 'TP01';
    data.statusFlag = true;
    this.http.post(DISPURL.GETSTATABYGATE, data).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          if (res.data.data.length == 0) {
            this.tabs.forEach(element => {
              element.itemCount = 0;
            });
          } else if (res.data.data.length > 0) {
            for (const reElement in this.tabs) {
              for (const element in res.data.data) {
                if (this.tabs[reElement].itemCode === res.data.data[element].gateCode) {
                  if (res.data.data[element].ct !== null) {
                    this.tabs[reElement].itemCount = res.data.data[element].ct;
                    sum += Number(res.data.data[element].ct);
                  }
                  break;
                } else {
                  this.tabs[reElement].itemCount = 0;
                }
              }
            }
          }
          this.tabs[0].itemCount = sum;
        }
      }
    )
  }

  //进场大门
  getallCodest(): void {
    //下拉框
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            if (element.codesetCode == 'PZKRCDM') {
              this.factoryGateList.push(element)
              console.log(this.factoryGateList)
            }
          });

        }
      }
    )
  }
  //仓库
  getWarehouse(data: any): void {
    this.http.post(DISPURL.GETWAREHOUSE, { kindName: 'WT02', status: 'ST01', enterpriseId:this.info.APPINFO.USER.companyId }).then(
      (res: any) => {
        if (res.success) {
          this.warehouseList = res.data.data;
        }
      }
    )
  }
  // 查询
  listSearch(data: any) {
    console.log(data);
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    this.searchData = data;
    data.transportType = 'TP01';
    data.statusFlag = true;
    if (this.index == 0) {
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index == 1) {
      data.gateCode = 'OF';
      this.getList(data);
      this.getStataByGate(data);
      // if (data.queryParameterList) {
      //   this.getStataByGate(data);
      // }
    } else if (this.index === 2) {
      data.gateCode = 'NF';
      this.getList(data);
      this.getStataByGate(data);
      // if (data.queryParameterList) {
      //   this.getStataByGate(data);
      // }
    }
  }


  selectChange(data: any): void {
    this.searchFormData.map((x: any) => {
      x.value1 = '';
      x.value2 = '';
      x.checked = false;
    })
    console.log(1111)
    console.log(data);
    this.relistSearch({ page: 1, length: this.pageSize })
  }

  relistSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.transportType = "TP01";
    data.statusFlag = true;
    if (this.index === 0) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = "";
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index === 1) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = 'OF';
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index === 2) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = 'NF';
      this.getList(data);
      this.getStataByGate(data);
    }
  }

  getList(data: any): void { //获取列表
    this.listLoading = true;
    console.log(data);
    this.http.post(DISPURL.QueueScheduling, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;

        }
      }
    )
  }

  updateDataResult(data:any){
    this.httpInfo={url:DISPURL.GETVEHICLETRAJECTORY,param:data[0]};
  };

  modalShow(data:any){
    if(data){
      this.vehicleIsVisible = false;
    }
  }

//车辆轨迹按钮
Trajectory(data: any): void{

  if(data.type.buttonId==='Trajectory'){
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作!'
      });
      this.destroyTplModal();
      return;
    } else if(data.data.length>1){
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作!'
      });
      this.destroyTplModal();
      return;
    }else{
      this.modalTitle='车辆轨迹';
      this.vehicleIsVisible=true;
      //this.getMap(data.data[0]);
    }
  }
  
}



  //修改
  btnUpdate(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行修改!'
      });
      this.destroyTplModal();
      return;
    }
    if (data.data[0].status == '30') {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '待入厂的不能进行修改'
      });
      this.destroyTplModal();
      return;
    }
    this.isShow = false;
    this.isButton = true;
    this.tplTitle = '修改';
    this.tipModalCreat();
    console.log(data.data[0].taskId);
    this.param.taskId = data.data[0].taskId;
    this.param.transportType = 'TP01';
    this.param.enterpriseId = this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.GETQUEUEDETAIL, this.param).then(
      (res: any) => {
        if (res.success) {
          this.truckNo = res.data.data.truckNo;
          if (res.data.data.subKindName) {
            this.breed = `${res.data.data.kindName}/${res.data.data.matName}/${res.data.data.subKindName}`;
          } else {
            this.breed = `${res.data.data.kindName}/${res.data.data.matName}`;
          }
          this.queueClassName = res.data.data.queueClassName;
          this.queueNo = res.data.data.queueNo;
          this.gateName = res.data.data.gateCode;
          this.warehouseName = res.data.data.warehouseCode;
        }
      }

    )

  }

  //修改弹框确认
  update_success(para: any): void {
    if (this.gateName == undefined) {
      this.nz.create('error', '提示信息', '请填写进厂大门', { nzDuration: 3000 });
      return;
    }
    if (this.warehouseName == undefined) {
      this.nz.create('error', '提示信息', '请填写仓库名称', { nzDuration: 3000 });
      return;
    }
    this.factoryGateList.forEach(element => {
      if (element.itemCode == this.gateName) {
        this.updateParam.gateName = element.itemCname;
      }
    });
    this.warehouseList.forEach(element => {
      if (element.warehouseCode == this.warehouseName) {
        this.updateParam.warehouseName = element.warehouseName;
      }
    });
    this.updateParam.gateCode = this.gateName;
    this.updateParam.warehouseCode = this.warehouseName;
    this.updateParam.taskId = para;
    this.updateParam.userId = this.info.APPINFO.USER.userId;
    this.updateParam.enterpriseId = this.info.APPINFO.USER.companyId;
    this.updateParam.transportType = 'TP01';
    this.isOkLoading = true;
    this.http.post(DISPURL.UPDATEDETAIL, this.updateParam).then(
      (res: any) => {
        if (res.success) {
          this.isOkLoading = false;
          this.tplModal.destroy();
          this.tplModal = this.modal.success({
            nzTitle: '提示信息',
            nzContent: '修改成功!',
          });
          this.destroyTplModal();
          this.listSearch(this.searchData);
        } else { //失败去掉loading
          this.isOkLoading = false;
        }
      }
    )

  }
  // 修改弹框返回
  update_return(): void {
    this.tplModal.destroy();//关闭弹框 
  }


  searchDataFun(data: any) {
    console.log(data);
    this.searchFormData = data;
  }

  //车辆调度
  btnAdd(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行车辆调度!'
      });
      this.destroyTplModal();
      return;
    }
    if (data.data[0].status == '30') {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '待入厂的不能进行修改'
      });
      this.destroyTplModal();
      return;
    }
    this.isShow = true;
    this.isButton = false;
    this.tplTitle = '调度';
    this.tipModalCreat();
    this.param.taskId = data.data[0].taskId;
    this.param.transportType = 'TP01';
    this.status = data.data[0].status;
    this.param.enterpriseId = this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.GETQUEUEDETAIL, this.param).then(
      (res: any) => {
        if (res.success) {
          this.truckNo = res.data.data.truckNo;
          if (res.data.data.subKindName) {
            this.breed = `${res.data.data.kindName}/${res.data.data.matName}/${res.data.data.subKindName}`;
          } else {
            this.breed = `${res.data.data.kindName}/${res.data.data.matName}`;
          }
          this.queueClassName = res.data.data.queueClassName;
          this.queueNo = res.data.data.queueNo;
          this.queueStartTime = res.data.data.queueStartTime;
          this.gateName = res.data.data.gateCode;
          this.warehouseName = res.data.data.warehouseCode;
        }
      }
    )

  }

  // 直接入厂
  directEntry(para: any): void {
    if (this.status == '30') {
      this.nz.create('error', '提示信息', '这条数据不能加入不能直接入场', { nzDuration: 3000 });
      return;
    }
    if (this.gateName == undefined) {
      this.nz.create('error', '提示信息', '请填写进厂大门', { nzDuration: 3000 });
      return;
    }
    if (this.warehouseName == undefined) {
      this.nz.create('error', '提示信息', '请填写仓库名称', { nzDuration: 3000 });
      return;
    }
    this.factoryGateList.forEach(element => {
      if (element.itemCode == this.gateName) {
        this.directEntryParam.gateName = element.itemCname;
      }
    });
    this.warehouseList.forEach(element => {
      if (element.warehouseCode == this.warehouseName) {
        this.directEntryParam.warehouseName = element.warehouseName;
      }
    });
    this.directEntryParam.gateCode = this.gateName;
    this.directEntryParam.warehouseCode = this.warehouseName;
    this.directEntryParam.bk6 = this.bk6;
    this.directEntryParam.taskId = para;
    this.directEntryParam.revisor =this.info.APPINFO.USER.name;//传入操作用户
    this.directEntryParam.userId = this.info.APPINFO.USER.userId;
    this.directEntryParam.enterpriseId = this.info.APPINFO.USER.companyId;
    this.directEntryParam.transportType = 'TP01';
    this.isOkLoading = true;
    this.http.post(DISPURL.ENTRYNOTICE, this.directEntryParam).then(
      (res: any) => {
        if (res.success) {
          this.isOkLoading = false;
          this.tplModal.destroy();
          this.tplModal = this.modal.success({
            nzTitle: '提示信息',
            nzContent: '直接入厂成功!',
          });
          this.destroyTplModal();
          this.listSearch(this.searchData);
        } else { //失败去掉loading
          this.isOkLoading = false;
        }
      }
    )

  }


  //绿色通道
  greenChannel(para: any): void {
    if (this.status == '27' || this.status == '30') {
      this.nz.create('error', '提示信息', '这条数据不能加入绿色通道', { nzDuration: 3000 });
      return;
    }
    if (this.gateName == undefined) {
      this.nz.create('error', '提示信息', '请填写进厂大门', { nzDuration: 3000 });
      return;
    }
    if (this.warehouseName == undefined) {
      this.nz.create('error', '提示信息', '请填写仓库名称', { nzDuration: 3000 });
      return;
    }
    this.factoryGateList.forEach(element => {
      if (element.itemCode == this.gateName) {
        this.greenChannelParam.gateName = element.itemCname;
      }
    });
    this.warehouseList.forEach(element => {
      if (element.warehouseCode == this.warehouseName) {
        this.greenChannelParam.warehouseName = element.warehouseName;
      }
    });

    this.greenChannelParam.gateCode = this.gateName;
    this.greenChannelParam.warehouseCode = this.warehouseName;
    this.greenChannelParam.bk6 = this.bk6;
    this.greenChannelParam.taskId = para;
    this.greenChannelParam.revisor =this.info.APPINFO.USER.name;//传入操作用户
    this.greenChannelParam.userId = this.info.APPINFO.USER.userId;
    this.greenChannelParam.enterpriseId = this.info.APPINFO.USER.companyId;
    this.greenChannelParam.transportType = 'TP01';
    this.isLoading = true;
    this.http.post(DISPURL.FASTTRACK, this.greenChannelParam).then(
      (res: any) => {
        if (res.success) {
          this.isLoading = false;
          this.tplModal.destroy();
          this.tplModal = this.modal.success({
            nzTitle: '提示信息',
            nzContent: '加入绿色通道成功!',
          });
          this.destroyTplModal();
          this.listSearch(this.searchData);
        } else { //失败去掉loading
          this.isOkLoading = false;
        }
      }
    )

  }

  selectFactoryGate(): void {

  }

  selectwarehouse(): void {

  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  // 创建模态框
  tipModalCreat(): void {
    this.tplModal = this.modal.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '600px',
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


}
