import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { DISPURL } from '../../../../common/model/dispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';

declare var  AMap: any;

@Component({
  selector: 'app-queue-scheduling',
  templateUrl: './queue-scheduling.component.html',
  styleUrls: ['./queue-scheduling.component.css']
})
export class QueueSchedulingComponent implements OnInit {
  index = 0;
  searchData: any;
  num = 0;
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数
  listLoading = true;
  dataSet: any;
  inqu: any = {};
  statusFlag: boolean;
  oldDistrictNum: number;
  newDistrictNum: number;
  tabs: Array<any> = [];
  factoryGateList: Array<any> = [];
  interval: any;
  searchFormData: any = [];
  isVisible = false; // 车辆轨迹弹框显示控制
  modalTitle: string; // 弹框的标题
  tplModal: NzModalRef;  // 提示弹框
  httpInfo: any;
  buttonId: any;
  updateData: any[];
  taskIds: any[];


  constructor(private http: HttpUtilService, private httpp: HttpClient, private route: ActivatedRoute, private modal: NzModalService, private info: UserinfoService) {
    this.interval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); }, 1000 * 60);

  }
  ngOnInit() {
    this.getallCodest();

  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }
  // 查询
  listSearch(data: any) {
    // console.log(data);
    data.page = data.page || 1; // 最好有
    data.length = data.length || this.pageSize; // 最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    this.searchData = data;
    data.statusFlag = true;
    if (this.index === 0) {
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index === 1) {
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
      // }else{
      //   this.getStataByGate(data);
      // }
    }
    // this.getList(data);
    // this.getStataByGate(data);
  }
  // 获取表头
  getallCodest(): void {
    const tab: any = {};
    tab.itemCname = '全部';
    tab.itemCode = 'root';
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId: this.info.APPINFO.USER.companyId}).then(
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
              this.tabs.push(item);
            }
          });
          this.listSearch({ page: 1, length: this.pageSize });
          // this.getStataByGate({});
        }
      }
    );
  }

  // 获取全部老区新区数据
  getStataByGate(data: any): void {
    let sum = 0;
    data.statusFlag = true;
    this.http.post(DISPURL.GETSTATABYGATE, data).then(
      (res: any) => {
        if (res.success) {
          // console.log(res.data.data)
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
            // this.tabs.forEach(reElement => {
            //   res.data.data.forEach(element => {
            //     if (reElement.itemCode === element.gateCode) {
            //       if (element.ct !== null) {
            //         reElement.itemCount = element.ct;
            //         sum += Number(element.ct);
            //       }
            //       return;
            //     }else {
            //       reElement.itemCount = 0;
            //     }
            //   });
            // });
          }
          this.tabs[0].itemCount = sum;
        }
      }
    );

  }

  getList(data: any): void { // 获取列表
    this.listLoading = true;
    // console.log(data);
    // data = {};
    this.http.post(DISPURL.QueueScheduling, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          // res.data.data.data.forEach(element => {
          //   console.log(element)
          // });
        }
      }
    );
  }

  selectChange(data: any): void {
    this.searchFormData.map((x: any) => {
      x.value1 = '';
      x.value2 = '';
      x.checked = false;
    });
    this.relistSearch({ page: 1, length: this.pageSize });
  }

  relistSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.statusFlag = true;
    if (this.index === 0) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = '';
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

  searchDataFun(data: any) {
    // console.log(data);
    this.searchFormData = data;
  }


  updateDataResult(data: any) {
    this.httpInfo = {url: DISPURL.GETVEHICLETRAJECTORY, param: data[0]};
    this.updateData = data;

  }

  modalShow(data: any) {
    if (data) {
      this.isVisible = false;
    }
  }

  btnUpdate(data: any): void {
    this.buttonId = data.buttonId;
    console.log(this.buttonId);
    console.log(this.isVisible);
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作!'
      });
      this.destroyTplModal();
      return;
    } else if (data.data.length > 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作!'
      });
      this.destroyTplModal();
      return;
    } else {
      this.modalTitle = '车辆轨迹';

      this.isVisible = true;

      // this.getMap(data.data[0]);
    }

  }

  destroyTplModal(): void {// 提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }




  exportExcel(data: any[]) {

    const url = DISPURL.EXPORTEXCEL;    // 接口的地址
    // let param = {...this.inqu};
    const currentTime = new Date();
    const month = currentTime.getMonth() + 1;
    // tslint:disable-next-line:max-line-length
    const formatDateTime = currentTime.getFullYear() + '-' + month + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    console.log(formatDateTime);
    let param;
    const tempArr: Array<any> = [];
    for (let i = 0; i <data.length ; i++) {

      const obj = {'taskId': data[i].taskId};
      tempArr.push(obj);
      // @ts-ignore

    }
    param = tempArr;
     // data = [{taskId: data[0].taskId}]  //  设定格式
    //  发送http请求
    this.httpp.post(url, param, {
      responseType: 'blob', headers: {'Content-type': 'application/json'}
    }).subscribe((response: any) => {
      // 调用html5 中的api来接收后台回传的文件
      const blob = new Blob([response], {type: 'application/vnd.ms-excel'});
      //  定义文件的url
      const fileUrl = window.URL.createObjectURL(blob);
      // dom操作 定义a节点 然后 通过 a href download 来下载文件
      const a = window.document.createElement('a');
      a.href = fileUrl;
      // 定义存储的文件名为   车辆调度信息+“yyyy-mm-dd hh:mm:ss”
      a.download = '车辆调度信息' + formatDateTime + '.xlsx';
      // dom操作  在body中添加节点 然后触发点击事件 并移除该节点
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }


  btnclick(data: any) {
    console.log(data);

    if (data.type.buttonId === 'ExportExcel') {
      if (data.data.length < 1) {
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '请至少选中一条数据后进行操作!'
        });
        this.destroyTplModal();
        return;
      }
      this.exportExcel(this.updateData);

    }
  }



}
