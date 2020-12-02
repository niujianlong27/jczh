/*
 * @Description: 钢种管理页面
 * @Author: 李春辉
 * @Date: 2019-01-21 10:03:16
 * @LastEditTime: 2019-01-21 14:33:00
 * @LastEditors: Please set LastEditors
 */

import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';


@Component({
  selector: 'app-productkind-manage',
  templateUrl: './productkind-manage.component.html',
  styleUrls: ['./productkind-manage.component.css']
})
export class ProductkindManageComponent implements OnInit {


  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 10;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  status: string;
  private tplModal: NzModalRef; // 弹窗相关
  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  constructor(private router: Router, private httpUtilService: HttpUtilService, private info: UserinfoService, private nm: NzModalService, private nn: NzNotificationService) { }

  ngOnInit() {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.getListSearch(data);
  }


  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}productkind/getProductkind`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        console.log(res);
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  //新增
  btnAdd(): void {
    sessionStorage.removeItem('productkindData');
    this.router.navigate(['/system/baseInformation/productkindAdd']);
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

    sessionStorage.removeItem('productkindData');
    this.router.navigate(['/system/baseInformation/productkindAdd']);
    sessionStorage.setItem('productkindData', JSON.stringify(data));

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
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.selectedData = data.data;
    this.status = 'delete';
  }

  deleteData() {
    const params = {url: '', data: {tProductkindModels: []}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}productkind/deleteProductkind`;
    params.data.tProductkindModels = this.selectedData;

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];

          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        } else {
          this.nn.error('提示消息', '删除失败！');
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

}
