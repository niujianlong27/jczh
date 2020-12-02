import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpUtilService} from '../../../../../common/services/http-util.service';
import {urls} from '../../../../../common/model/url';
import {Router} from '@angular/router';
import {CacheService} from '../../../../../common/services/cache.service';

@Component({
  selector: 'app-pay-channel-list',
  templateUrl: './pay-channel-list.component.html',
  styleUrls: ['./pay-channel-list.component.css']
})
export class PayChannelListComponent implements OnInit {

  private tplModal: NzModalRef; // 弹窗相关

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗

  constructor(private router: Router, private http: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService,private cache:CacheService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getPayChannel;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 添加
  btnAdd() {
    this.cache.clearSession('payChannelData');
    this.router.navigate(['/system/baseInformation/payChannelAdd']).then();
  }

  // 修改
  btnUpdate(data: any) {

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

    this.cache.setSession('payChannelData',data.data[0]);
    this.router.navigate(['/system/baseInformation/payChannelAdd']).then();
  }

  // 删除
  btnDelete(data: any) {
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
    this.deleteCon = '确定要删除当前记录?';
    this.selectedData = data.data;
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  // 确认框结果
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      // if ('delete' === this.status) {
      this.deleteData();
      //   this.status = '';
      // }
    }
    this.deleteVisible = false;

  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tPayChannelModels: []}, method: 'POST'};
    params.url = urls.deletePayChannel;
    params.data.tPayChannelModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        } else {
          this.nn.error('提示消息', '删除失败！');
        }
      }
    );
  }

}
