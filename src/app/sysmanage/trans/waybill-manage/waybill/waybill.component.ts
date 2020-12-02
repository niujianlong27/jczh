import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {WaybillImportComponent} from '../waybill-import/waybill-import.component';
import {urls} from '../../../../common/model/url';
import {HttpClient} from '@angular/common/http';

declare var JSONH: any;

@Component({
  selector: 'app-waybill',
  templateUrl: './waybill.component.html',
  styleUrls: ['./waybill.component.css']
})
export class WaybillComponent implements OnInit {

  // 运单相关信息
  waybillData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedWaybillData: Array<any> = [];
  data: any = {};


  // 运单司机/捆包相关信息
  childGridId = 'waybillPack';
  childData: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 100;
  childTotal: number = 0;
  tabArr: Array<any> = [
    {name: '运单捆包', gridId: 'waybillPack'},
    {name: '运单司机', gridId: 'driver'}
  ];
  childIndex = 0;

  // 导入弹框是否显示
  isVisible: boolean = false;

  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  //businessModuleArr: Array<any> = [];

  constructor(private http: HttpUtilService,
              public router: Router,
              private msg: NzMessageService,
              private anhttp: HttpClient) {
  }

  ngOnInit() {
   // this.query({});
  }

  /**
   * 查询运单
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    this.selectedWaybillData = [];
    this.waybillData = [];
    this.childData = [];
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.data = {...pageParam};
    this.http.post(TRANS_URLS.SELECT_WAYBILL, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData = (res.data.data && res.data.data.data) || []; //? JSONH.unpack(JSON.parse(res.data.data.packData)) : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => item.rowIndex = index + 1);
      }
      this.loading = false;
    });
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }
  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'print':
        this.print();
        break;
      case 'update':
        this.update();
        break;
      case 'delete':
        this.delete();
        break;
      case 'importWaybill':
        this.importWaybill();
        break;
      case 'Export' :
        this.export();
        break;
      case 'DetailExport':
        this.detailExport();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 打印
   */
  print() {
    this.msg.warning('功能待开发');
  }

  //导出
  export() {
    let url: any = urls.waybillExport;

    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单查询.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

  /**
   * 修改
   */
  update() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length !== 1) {
      this.msg.error('请选择选择一条运单记录！');
    }

    if (this.selectedWaybillData[0].settleFlag === 'FYDJ20' || this.selectedWaybillData[0].priceFlag === 'HJBJ20') {
      this.msg.error('该运单已登记运费或已核价不能修改');
      return;
    }
    this.router.navigate(['/system/trans/waybill-manage/waybill-add'], {
      queryParams: {
        'operateType': 'update',
        'waybillNo': this.selectedWaybillData[0].waybillNo
      }
    });
  }

  /**
   * 作废
   */
  delete() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length === 0) {
      this.msg.error('请选择至少选择一条运单记录！');
    }
    let invalidate = this.selectedWaybillData.filter((item, index) => {
      item.rowIndex = index + 1;
      return item.settleFlag === 'FYDJ20';
    });
    if (invalidate.length > 0) {
      this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单已登记运费不能作废`);
      return;
    }

    invalidate = this.selectedWaybillData.filter((item, index) => {
      item.rowIndex = index + 1;
      return item.priceFlag === 'HJBJ20';
    });
    if (invalidate.length > 0) {
      this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单运费已核价不能作废`);
      return;
    }

    this.http.post(TRANS_URLS.DELETE_WAYBILL, {tWaybills: this.selectedWaybillData}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`作废成功！作废运单${this.selectedWaybillData.length}条`);
          this.selectedWaybillData = [];
          this.query(this.data);
          // this.driverData = res.data.data;
        }
      }
    );

  }

  /**
   * 导入按钮响应事件
   */
  @ViewChild(WaybillImportComponent) waybillImport: WaybillImportComponent;

  importWaybill() {
    this.isVisible = true;
    this.waybillImport.showModal().subscribe(x=>{
     if(x === 'success')  this.query(this.data);
    });
  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.waybillData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        item.checked = !item.checked;
      }
    });
    this.selectedWaybill(this.waybillData.filter(item => item.checked));
  }

  totalWeight: number = 0;
  totalSheet: number = 0;

  /**
   * 选中数据
   * @param data
   */
  selectedWaybill(data: any) {
    this.selectedWaybillData = data;
    this.tabChange({gridId: this.childGridId});
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);
  }


  /**
   * // 运单司机/捆包tab页切换
   * @param tabInfo
   */
  tabChange(tabInfo: any) {
    setTimeout(() => {

      const tWaybills = [];
      for (let i = 0, len = this.selectedWaybillData.length; i < len; i++) {
        tWaybills.push(
          {
            companyId: this.selectedWaybillData[i].companyId,
            waybillNo: this.selectedWaybillData[i].waybillNo
          }
        );
      }

      if (tabInfo.gridId === 'waybillPack') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryPack(tWaybills);
        } else {
          this.childData = [];
        }
      } else if (tabInfo.gridId === 'driver') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryDriver(tWaybills);
        } else {
          this.childData = [];
        }
      } else {
        this.msg.error(`未知Tab页信息！${JSON.stringify(tabInfo)}`);
      }
    }, 0);
  }

  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(tWaybills: Array<any>) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据运单查询运单司机信息
   */
  queryDriver(tWaybills: Array<any>) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  /**
   * 明细导出
   */
  detailExport(): void {
    if (!this.selectedWaybillData || this.selectedWaybillData.length === 0) {
      this.msg.error('请选择至少选择一条运单记录！');
      return;
    }
    const url: any = urls.waybillDetailExport;
    this.anhttp.post(url, {tWaybills: this.selectedWaybillData}, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单明细.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });

  }

}
