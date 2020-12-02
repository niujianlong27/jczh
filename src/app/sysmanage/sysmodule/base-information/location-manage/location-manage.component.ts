import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';


@Component({
  selector: 'app-location-manage',
  templateUrl: './location-manage.component.html',
  styleUrls: ['./location-manage.component.css']
})
export class LocationManageComponent implements OnInit {
  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  status: string;
  params: any = {};


  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  private tplModal: NzModalRef; // 弹窗相关
  @ViewChild('content') content;
  rowid: number;
  modalFormVisible = false;

 
   private searchData:any = {};
  constructor( private httpUtilService: HttpUtilService, private info: UserinfoService, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit(): void {
    // if (!this.permissions) {
    //   this.listSearch({page: 1, length: this.pageSize});
    // }

    

  }

  // formatterStand = (value: number) => value ? `${value}` : '';

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.searchData = data;
    this.getListSearch(this.searchData);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}point/getPoint`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        console.log(res);
        this.listLoading = false;
        if (res.success) {
          this.selectedData = [];
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }
  
  btnClick(data:any){
    switch(data.type.buttonId){
      case 'updateCheck':
          this.modalTitle = '提示信息';
          this.deleteVisible = true;
          this.deleteCon = '确定要审核选中的数据?';
          this.status = data.type.buttonId;
        break;
    }
  }
  //地址审核
  private updateCheck(){
     const tPointModels = this.selectedData.map(x => ({locationId: x.locationId}));
     this.httpUtilService.post(`${environment.baseUrl}point/updateCheck`,{tPointModels: tPointModels}).then(
       (res:any) => {
         if(res.success){
          this.getListSearch(this.searchData);
          this.nn.success('提示消息', res.data.msg);
         }
       }
     )
  }
  //添加
  btnAdd(): void {
    console.log(104)
    this.modalFormVisible = true;
    //this.nzMaskClosable = false;
      //  this.modalTitle = '地点管理 > 新增';
    this.status = 'add';
  //  this.validateForm.get('companyId').setValue(this.info.get('USER').companyId);
    this.params = {companyId: this.info.get('USER').companyId}
  }



  //更新
  btnUpdate(data: any): void {

    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }


 //   this.validateForm.patchValue(data.data[0]);
    this.rowid = data.data[0].rowid;
    this.modalFormVisible = true;
   // this.modalTitle = '地点管理 > 修改';
    this.status = 'update';
    this.params = {...data.data[0]};

  }
  updateList(data:string){
    this.searchData.page = 1;
    this.getListSearch(this.searchData);
  }
  //删除
  btnDelete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    const param = {tPoints: []};
    this.selectedData.map(
      res => {
        param.tPoints.push({locationId: res.locationId});
      }
    );
    this.httpUtilService.post(urls.getPointOnly, param).then(
      (res) => {
        if (res.success) {
          this.modalTitle = '提示信息';
          this.deleteVisible = true;
          this.deleteCon = '确定要删除此条记录?';
          this.status = 'delete';
        }
      }
    );


  }

  deleteData() {
    const params = {url: '', data: {tPoints: []}, method: 'POST'};
    params.url = `${environment.baseUrl}point/deletePoint`;
    params.data.tPoints = this.selectedData;

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
         // this.listSearch({});
          this.getListSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
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
      } else if('updateCheck' === this.status){
        this.updateCheck();
        this.status = null;
      }
    }
    this.deleteVisible = false;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 选择数据
   * @param data
   */
  updateDataResult(data: any): void {
    this.selectedData = data;


  }

}

