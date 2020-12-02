/**
 * 非标准地址管理界面
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { forkJoin } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import {urls} from '@model/url';
@Component({
  selector: 'app-unstand-point-manage',
  templateUrl: './unstand-point-manage.component.html',
  styleUrls: ['./unstand-point-manage.component.css']
})
export class UnstandPointManageComponent implements OnInit {

  constructor(private info: UserinfoService, private http: HttpClient, private mess: NzMessageService) { }
  private searchData: any = {};
  modalFormVisible: boolean;
  status: string;
  rowid:string;
  params: any = {};
  loading: boolean = false;
  listData: any[] = [];
  total: number = 0;
  selectedCompany: any;
  selectedDataList: any[] = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  btnDisabled: any = {
    updateStand: true,
    relateStand: true,
    upate: true,
    delete: true
  }
  btnLoading: any = {
    updateStand: false
  }
  modal: any = {
    searchData: {},
    selectData: []
  }
  private ismodalUrl: boolean;
  private recommendLocation: any[] = [];//存储推荐地址
  private permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  ngOnInit() {
  }
  /**
   *
   * @param data
   * 查询触发
   */
  search(data:any){
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.searchData = data;
    this.getList(this.searchData);
  }
  /**
   * 获取列表
   */
  private getList(param = {}){
    this.loading = true;
    this.http.post(`${environment.baseUrl}point/getUnstandPoint`,param).subscribe((res:any) => {
      this.loading = false;
      if(res.code === 100){
         this.listData = res.data.data || [];
         this.total = res.data.total;
         this.btnDisabled.updateStand = true;
         this.btnDisabled.relateStand = true;
         this.btnDisabled.update = true;
         this.btnDisabled.delete = true;
         this.selectedDataList = [];
      }
    })
  }
  companyChange(): void {
    this.searchData.page = 1;
    this.getList(this.searchData);
  }
  /**
   *
   * @param data
   * button事件
   */
  btnclick(data:any){
      switch (data.type.buttonId){
        case 'updateStand':
          this.updateStand();
          break;
        case 'relateStand': //单选
          this.modal.title = data.type.buttonName;
          this.modal.visible = true;
          this.ismodalUrl = true;
          const param = data.data && data.data[0] || {};
          const params = { locationId: param.locationId,
                           locationName:param.locationName,
                           provinceName: param.provinceName,
                           cityName: param.cityName,
                           districtName: param.districtName,
                           townName: param.townName,
                           longitude: param.longitude,
                           latitude: param.latitude,
                           address: param.address,
                           page: 1,
                           length: 100 };
          this.getStandList(params);
          break;
        case 'Add':
          this.btnAdd();
          break;
        case 'Delete':
          this.btnDelete();
          break;
        case 'Update':
          this.btnUpdate(data);
          break;

      }
  }
  //添加
 private btnAdd(): void {
    this.modalFormVisible = true;
    this.status = 'add';
    this.params = {companyId: this.info.get('USER').companyId};
  }
  //更新
  private btnUpdate(data: any): void {
    this.rowid = data.data[0].rowid;
    this.modalFormVisible = true;
    this.status = 'update';
    this.params = {...data.data[0]};

  }
  updateList(data:string){
    this.searchData.page = 1;
    this.getList(this.searchData);
  }
  //删除
 private btnDelete(): void {

    const param = {tPoints: []};
    this.selectedDataList.map(
      res => {
        param.tPoints.push({locationId: res.locationId});
      }
    );
    this.http.post(urls.getPointOnly, param).subscribe(
      (res:any) => {
        if (res.code === 100) {
          this.modalTitle = '提示信息';
          this.deleteVisible = true;
          this.deleteCon = '确定要删除此条记录?';
          this.status = 'delete';
        }
      }
    );
  }
    //删除框确认
    modalConfirmResult(data: any): void {
      if ('ok' === data.type) {
        if ('delete' === this.status) {
          this.deleteData();
          this.status = '';
        }
      }
      this.deleteVisible = false;
    }
    deleteData() {
      const params = {url: '', data: {tPoints: []}};
      params.url = `${environment.baseUrl}point/deletePoint`;
      params.data.tPoints = this.selectedDataList;

      this.http.post(params.url,params.data).subscribe(
        (res: any) => {
          if (res.code === 100) {
            this.searchData.page = 1;
            this.getList(this.searchData);
          }
        }
      );
    }
  /**
   * 转换为标准地址
   */
  private updateStand(){
    this.btnLoading.updateStand = true;
    this.http.post(`${environment.baseUrl}point/updateStand`,{rowid: this.selectedDataList[0].rowid, locationId:  this.selectedDataList[0].locationId,
      locationName: this.selectedDataList[0].locationName}).subscribe((res:any) => {
      this.btnLoading.updateStand = false;
       if(res.code === 100){
          this.mess.success(res.msg)
          this.searchData.page = 1;
          this.getList(this.searchData)
       }
    })
  }
  /**
   * modal相关处理
  */
  getStandList(param:any,flag = null){
  this.modal.loading = true;
  this.modal.searchData = {...param};
  if (flag === 1) {
    this.ismodalUrl = false;
    this.recommendLocation.map(x => x.checked = false)
  }
  const url = this.ismodalUrl ? `${environment.baseUrl}point/getRecommendLocation` : `${environment.baseUrl}point/getStandPoint`;
  this.http.post(url,param).subscribe((res:any) => {
    this.modal.loading = false;
    if(res.code === 100){
       this.modal.listData = res.data.data || [];
       this.modal.selectData = [];
       this.modal.total = res.data.total;
       if(this.ismodalUrl){
         this.recommendLocation = res.data.data || [];
       }
    }
  })
}
pageIndex(data: number){
   this.modal.searchData.page = data;
   this.getStandList(this.modal.searchData);
}
pageSize(data: number){
  this.modal.searchData.page = 1;
  this.modal.searchData.length = data;
  this.getStandList(this.modal.searchData)
}
modalOk(){
  this.modal.okloading = true;
  const param = {rowid: this.selectedDataList[0].rowid,locationId: this.selectedDataList[0].locationId, standLocationId: this.modal.selectData[0].locationId,
    longitude: this.modal.selectData[0].longitude, latitude: this.modal.selectData[0].latitude,standKilo: this.modal.selectData[0].standKilo};
  this.http.post(`${environment.baseUrl}point/relateStand`,param).subscribe((res:any) => {
     this.modal.okloading = false;
     if(res.code === 100){
       this.mess.success(res.data);
       this.getList(this.searchData);
       this.modal.visible = false;
     }
   })
   const checkedData = this.recommendLocation.filter(x => x.checked)
   const params = {
      companyId:  this.info.get('USER').companyId,
      locationId: this.selectedDataList[0].locationId,
      createId: this.info.get('USER').userId,
      useLocation: checkedData && checkedData[0] && checkedData[0].locationId,
      recommendLocation: JSON.stringify(this.recommendLocation)
   }
 this.http.post(`${environment.baseUrl}point/logRecommendLocation`,params).subscribe()
/* forkJoin(http1,http2).subscribe(
   (res:any) => {
     this.modal.okloading = false;
     if(res[0].code == 100 && res[1].code ==100){
      this.mess.success('关联地址成功!');
      this.getList(this.searchData);
      this.modal.visible = false;
     }
   }
 )*/
}
modalTableSelect(data:any[]){
   this.modal.selectData = data;
}
  /**
   * 点击选择获取数据
   */
  selectedData(data:any){
    this.btnDisabled.updateStand = true;
    this.btnDisabled.relateStand = true;
    this.btnDisabled.update = true;
    this.btnDisabled.delete = true;
    this.selectedDataList = data;
    if(data.length){
       this.btnDisabled.delete = false;
    }
    if(data.length === 1){
      this.btnDisabled.updateStand = false;
      this.btnDisabled.relateStand = false;
      this.btnDisabled.update = false;
    }
  }
}
