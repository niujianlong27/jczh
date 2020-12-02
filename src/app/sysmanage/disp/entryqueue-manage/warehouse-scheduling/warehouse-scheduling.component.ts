import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';


@Component({
  selector: 'app-warehouse-scheduling',
  templateUrl: './warehouse-scheduling.component.html',
  styleUrls: ['./warehouse-scheduling.component.css']
})
export class WarehouseSchedulingComponent implements OnInit {
  index: number = 0;
  searchData: any;
  num: number = 0;
  // tabs = ['全部' + this.num, "中板厂完工库", "厚板厂完工库", "线材厂完工库", "炼钢厂完工库", "龙门吊库存"]
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;
  dataSet: any;
  para: any = {};
  truckNo: string;
  stowName: string;
  queueStartTime: Date;
  queueNo: string;
  bk6: string;
  param: any = {};
  transportType: string;
  breed: string;
  gateName: string;
  warehouseName: string;
  status: string;
  stowNameList: Array<any> = [];
  warehouseSchedulingParam: any = {};
  taskId: string;
  tabs: Array<any> = [];
  interval: any;
  isOkLoading: boolean = false;
  searchFormData: any = [];
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
    //this.getAllStow();
    this.getWarehouseList();
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }

  // 获取表头数据
  getWarehouseList(): void {
    const tab: any = {};
    tab.itemCname = "全部";
    tab.itemCode = "root";
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.http.post(DISPURL.GETWAREHOUSE, {kindName: 'WT02',status: 'ST01',enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            const item: any = {};
            item.itemCname = element.warehouseName;
            item.itemCode = element.warehouseCode;
            item.itemCount = 0;
            this.tabs.push(item)
          });
          this.listSearch({ page: 1, length: this.pageSize });
        }
      }
    )

  }

  //获取统计数据
  getTotalNum(data: any): void {
    let sum: number = 0;
    data.transportType = "TP01";
    data.status = "40";
    this.http.post(DISPURL.GETDATABYWAREHOUSECODE, data).then(
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
                if (this.tabs[reElement].itemCode === res.data.data[element].warehouseCode) {
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
            // res.data.data.forEach(element => {
            //   this.tabs.forEach(reElement => {
            //     if (reElement.itemCode === element.warehouseCode) {
            //       if (element.ct !== null) {
            //         reElement.itemCount = element.ct;
            //         sum += Number(element.ct);
            //       }
            //     }
            //   });
            // });
          }
          this.tabs[0].itemCount = sum;
        }
      }
    )



  }

  getAllStow(data:any): void {
    //console.log(data.data[0].warehouseCode)
    this.http.post(DISPURL.GETALLSTOW, {warehouseCode:data.data[0].warehouseCode, enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          this.stowNameList = res.data.data;
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
    data.transportType = "TP01";
    data.status = "40";

    if(this.index===0){
      this.getList(data);
      this.getTotalNum(data);
      return;
    }
    this.tabs.forEach((element,i) => {
      
      //this.index++;
      if(this.index===i){
        data.warehouseCode=element.itemCode;
        this.getList(data);
        this.getTotalNum(data);
      }
      
    });
  }


  getList(data: any): void { //获取列表
    this.listLoading = true;
    console.log(data);
    this.http.post(DISPURL.GETPICKTASKLIST, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    )
  }


  selectChange(data: any): void {
    this.searchFormData.map((x: any) => {
      x.value1 = '';
      x.value2 = '';
      x.checked = false;
    })
    console.log(data);
    this.relistSearch({ page: 1, length: this.pageSize })
  }

  relistSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.transportType = "TP01";
    data.status = "40";

    if(this.index===0){
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.warehouseCode = "";
      this.getList(data);
      this.getTotalNum(data);
      return;
    }
    this.tabs.forEach((element,i) => {
      //this.index++;
      if(this.index===i){
        if (this.searchData.queryParameterList) {
           data = this.searchData;
        }
        data.warehouseCode=element.itemCode;
        //console.log(element.itemCode);
        this.getList(data);
        this.getTotalNum(data);
      }
    });
  }
  
  searchDataFun(data: any) {
    console.log(data);
    this.searchFormData = data;
  }


  // 仓库调度
  btnAdd(data: any): void {
     
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行修改!'
      });
      this.destroyTplModal();
      return;
    }
    this.getAllStow(data)
    if (data.data[0].stowName && data.data[0].stowCode) {
      this.tplModal = this.modal.confirm({
        nzTitle: '提示信息',
        nzContent: '该装车位已存在，是否确定修改!',
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.tplTitle = '调度';
          this.tipModalCreat();
          this.param.taskId = data.data[0].taskId;
          this.param.transportType = "TP01";
          this.param.enterpriseId = this.info.APPINFO.USER.companyId;
          this.http.post(DISPURL.GETQUEUEDETAIL, this.param).then(
            (res: any) => {
              if (res.success) {
                this.truckNo = res.data.data.truckNo;
                this.gateName = res.data.data.gateName;
                this.warehouseName = res.data.data.warehouseName;
                this.queueNo = res.data.data.queueNo;
                this.queueStartTime = res.data.data.queueStartTime;
                this.bk6 = res.data.data.bk6;
                if (res.data.data.subKindName) {
                  this.breed = `${res.data.data.kindName}/${res.data.data.matName}/${res.data.data.subKindName}`;
                } else {
                  this.breed = `${res.data.data.kindName}/${res.data.data.matName}`;
                }
                this.stowName = res.data.data.stowCode;
              }
            }
          )
        }
      });
      // this.destroyTplModal();
    }else{
      this.tplTitle = '调度';
          this.tipModalCreat();
          this.param.taskId = data.data[0].taskId;
          this.param.enterpriseId = this.info.APPINFO.USER.companyId;
          this.param.transportType = "TP01";
          this.http.post(DISPURL.GETQUEUEDETAIL, this.param).then(
            (res: any) => {
              if (res.success) {
                this.truckNo = res.data.data.truckNo;
                this.gateName = res.data.data.gateName;
                this.warehouseName = res.data.data.warehouseName;
                this.queueNo = res.data.data.queueNo;
                this.queueStartTime = res.data.data.queueStartTime;
                this.bk6 = res.data.data.bk6;
                if (res.data.data.subKindName) {
                  this.breed = `${res.data.data.kindName}/${res.data.data.matName}/${res.data.data.subKindName}`;
                } else {
                  this.breed = `${res.data.data.kindName}/${res.data.data.matName}`;
                }
                this.stowName = res.data.data.stowCode;
              }
            }
          )
    }



  }

  selectFactoryGate(data: any): void {
    console.log(data);
  }

  //保存
  update_success(data: any): void {
    console.log(this.stowNameList)
    this.stowNameList.forEach(element => {
      if (element.stowCode == this.stowName) {
        this.warehouseSchedulingParam.stowName = element.stowName;
      }
    });
    this.warehouseSchedulingParam.userId = this.info.APPINFO.USER.userId;
    this.warehouseSchedulingParam.stowCode = this.stowName;
    this.warehouseSchedulingParam.taskId = data;
    this.warehouseSchedulingParam.transportType = "TP01";
    this.warehouseSchedulingParam.enterpriseId = this.info.APPINFO.USER.companyId;
    this.isOkLoading=true;
    this.http.post(DISPURL.STOWNOTICE, this.warehouseSchedulingParam).then(
      (res: any) => {
        if (res.success) {
          this.isOkLoading=false;
          this.tplModal.destroy();
          this.tplModal = this.modal.success({
            nzTitle: '提示信息',
            nzContent: '调度成功!',
          });
          this.destroyTplModal();
          this.listSearch(this.searchData);
        } else { //失败去掉loading
          this.isOkLoading = false;
        }
      }
    )
  }

  //返回
  update_return(): void {
    this.tplModal.destroy();//关闭弹框 
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
