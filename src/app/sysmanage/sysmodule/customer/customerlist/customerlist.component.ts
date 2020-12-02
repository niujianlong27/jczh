import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import { GlobalService } from '@service/global-service.service';
import {ImgViewerService} from '@component/img-viewer/img-viewer';
import {HttpClient} from '@angular/common/http';
import {TRANS_URLS} from '@model/trans-urls';

@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.css']
})
export class CustomerlistComponent implements OnInit {
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
  constructor(private router: Router,
              private http: HttpUtilService,
              private info: UserinfoService,
              private nm: NzModalService,
              private nn: NzNotificationService,
              private imgService: ImgViewerService,
              private global: GlobalService,
              private angularHttp: HttpClient,
              ) {
  }

  ngOnInit(): void {

    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.global.searchReload.subscribe((x: any) => {
      if (x.target === 'customerList') {
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
    this.http.post(urls.selectCompanyList, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          //设置disabled
          /*  this.dataSet.map( (res:any,index:number) => {
              if(index === 0){
               res.disabled = true; //设置某条数据不能选择
              }

            })*/
        }
      }
    );
  }

  //添加
  btnAdd(): void {
    sessionStorage.removeItem('customerListData');
    this.router.navigate(['/system/customer/add']);
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
    sessionStorage.removeItem('customerListData');
    this.router.navigate(['/system/customer/add']);
    sessionStorage.setItem('customerListData', JSON.stringify(data));

  }

  delete(data: any): void {
    if (data.data.length < 1) {
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
      let deleteUrl = urls.companydeleteList;
      let deleteParam = {tCompanyModels: []};
      this.deleteList.forEach(elem => {
        deleteParam.tCompanyModels.push({rowid: elem['rowid']});
      });
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
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
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {


    switch (data.type.buttonId) {
      case 'Insert': {
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
        break;
      case 'Export':{
        this.btnExport();
      }
      break;

    }
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

  columns(data: any) { // 获取列
    const url = data.filter((x: any) => x.type === 'url');
    url.forEach(item => {
      item.colEname == 'busiLicense' && (item.tdTemplate = this.urlImg1);
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

  /**
   * 选择数据
   * @param {Array} data
   */
  updateDataResult(data: Array<any>) {
    this.selectData = data;
  }

  /**
   * 客户基本信息导出
   */
  btnExport(): void {
    let url: string =urls.companyExportExcel;

    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `客户基本信息.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

}

