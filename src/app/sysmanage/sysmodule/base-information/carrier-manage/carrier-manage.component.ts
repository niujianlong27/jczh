import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {GlobalService} from '@service/global-service.service';
import {HttpUtilService} from '@service/http-util.service';
import {ImgViewerService} from '@component/img-viewer/img-viewer';

@Component({
  selector: 'app-carrier-manage',
  templateUrl: './carrier-manage.component.html',
  styleUrls: ['./carrier-manage.component.css']
})
export class CarrierManageComponent implements OnInit {


  dataSet: any;
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;
  deleteList = [];//需要删除的数据
  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测
  private tplModal: NzModalRef; // 弹窗相关
  searchData: any = {};  //存储查询的数据
  selectData: Array<any> = [];
  @ViewChild('urlImg1') urlImg1: TemplateRef<any>;
  @ViewChild('urlImg2') urlImg2: TemplateRef<any>;

  constructor(private router: Router, private http: HttpUtilService,
              private info: UserinfoService, private nm: NzModalService,
              private nn: NzNotificationService,
              private imgService: ImgViewerService,
              private msg: NzMessageService,
              private global: GlobalService) {
  }

  ngOnInit(): void {

    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.global.searchReload.subscribe((x: any) => {
      if (x.target === 'carrierList') {
        this.listSearch({page: 1, length: this.pageSize});
      }
    });
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.selectedCompany) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.getCustomerList(data);
  }

  getCustomerList(data: any): void { //获取列表
    this.listLoading = true;
    this.searchData = data;
    this.http.post(urls.selectCompanyListV1, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  //添加
  btnAdd(): void {
    sessionStorage.removeItem('carrierListData');
    this.router.navigate(['/system/baseInformation/carrierManageAdd']);
  }

  btnUpdate(data: any): void {

    if (!data || data.data.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    // if (data.data[0].status == 'GSZT40' || data.data[0].status == 'GSZT10') {
    //   this.nn.warning('提示消息', '当前数据状态为待审核或有效，不能修改！');
    //   return
    // }
    sessionStorage.removeItem('carrierListData');
    this.router.navigate(['/system/baseInformation/carrierManageAdd']);
    sessionStorage.setItem('carrierListData', JSON.stringify(data));

  }

  delete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.deleteList = data.data;
  }

  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let deleteUrl = urls.deleteListV1;
      let deleteParam = {tCompanyModels: []};
      this.deleteList.forEach(elem => {
        deleteParam.tCompanyModels.push({rowid: elem['rowid']});
      });
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.selectData = [];
            this.nn.success('提示消息', res.data.data);
            this.listSearch(this.searchData);
          }
        }
      );
    } else {
      this.deleteVisible = false;
    }
  }

  companyChange(): void {
    this.listSearch(this.searchData);
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    switch (data.type.buttonId) {
      case 'Insert':
        this.insert();
        break;
      case 'Submit': // 提交
        this.buttonClick(urls.submitUpdate, data.type.buttonName);
        break;
      case 'Auth': // 审核
        this.buttonClick(urls.authUpdate, data.type.buttonName);
        break;
      case 'Back':  // 驳回
        this.buttonClick(urls.backUpdate, data.type.buttonName);
        break;
      case 'End': // 终止
        this.buttonClick(urls.endUpdate, data.type.buttonName);
        break;
    }

  }

  insert() {
    if (this.selectData.length < 1) {
      this.nn.warning('提示消息', '请选择后操作');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认批量生成助记码？',
      nzOnOk: () => this.generateMnemonicCode()
    });
  }

  /**
   * 生成助记码
   */
  generateMnemonicCode(): Promise<any> {
    return this.http.post(urls.generateMnemonicCode, {tCompanyModels: this.selectData}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', res.data.msg);
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 选择数据
   * @param {Array} data
   */
  updateDataResult(data: Array<any>) {
    this.selectData = data;
  }

  buttonClick(url, buttonName) { //终止
    if (!this.selectData || this.selectData.length < 1) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择数据后操作！',
        });
      return;
    }
    this.nm.confirm({
      nzTitle: `承运商管理 > ${buttonName}`,
      nzContent: `<p class="m-re">是否将选中的数据进行${buttonName}操作?</p>`,
      nzOnOk: () => new Promise((resolve, reject) => {
        let params = {tCompanyModels: []};
        params.tCompanyModels = this.selectData.map(item => {
          return {
            companyId: item.companyId,
            rowid: item.rowid
          };
        });
        this.http.post(url, params).then((res: any) => {
          if (res.success) {
            resolve();
            this.nn.success('提示消息', res.data.data);
            this.listSearch(this.searchData);
          } else {
            reject();
          }
        });
      })
    });
  }


  columns(data: any) { // 获取列
    const url = data.filter((x: any) => x.type === 'url');
    url.forEach(item => {
      item.colEname == 'busiLicense' && (item.tdTemplate = this.urlImg1);
      item.colEname == 'transRoadPermit' && (item.tdTemplate = this.urlImg2);
    });
  }

  //预览图片
  getView(e: MouseEvent, data: string) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


}
