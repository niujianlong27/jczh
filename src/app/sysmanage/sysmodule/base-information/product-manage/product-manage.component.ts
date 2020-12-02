/*
 * @Description: 产品管理的界面
 * @Author: 赵泽平
 * @Date: 2019-01-21 11:36:52
 * @LastEditTime: 2019-01-21 14:13:28
 * @LastEditors: Please set LastEditors
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {urls} from '../../../../common/model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-product-manage',
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css']
})
export class ProductManageComponent implements OnInit {
  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  // 数据弹出框
  modalFormVisible = false; // 数据弹窗
  modalValidateForm: FormGroup;
  private status: string;// add添加，update更新

  searchData: any;  //存储查询的数据

  selectedCompany: any;
  typeDataArr: Array<any> = [];
  private tplModal: NzModalRef; // 弹窗相关

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  constructor(private router: Router, private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private info: UserinfoService, private nn: NzNotificationService) {
  }

  ngOnInit(): void {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }

    this.getStatic(this.typeDataArr, 'YHLX');
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.selectedCompany && this.permissions) {
      data.companyId = this.selectedCompany;
    }
    this.searchData = data;
    this.listLoading = true;
    console.log(data);
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}product/getProduct`;
    params.data = data;
    this.httpUtilService.request(params).then(
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
    sessionStorage.removeItem('productData');
    this.router.navigate(['/system/baseInformation/productAdd']);
  }

  // 更新
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

    sessionStorage.removeItem('productData');
    sessionStorage.setItem('productData', JSON.stringify(data));
    this.router.navigate(['/system/baseInformation/productAdd']);

  }


  //删除
  btnDelete(data: any): void {
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
    this.selectedData = data.data;
    this.status = 'delete';
  }

// 删除数据
  deleteData() {
    const params = {url: '', data: {companyId: '', tProductModels: []}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}product/deleteProduct`;
    params.data.tProductModels=this.selectedData;
    if (this.selectedCompany) {
      params.data.companyId = this.selectedCompany;
    } else {
      delete params.data.companyId;
    }

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示消息', '删除成功');
          this.selectedData = [];
          this.listSearch(this.searchData);
        } else {
          this.nn.error('提示消息', '删除失败');
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

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }
}
