import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, UploadFile} from 'ng-zorro-antd';
import {TRANS_URLS} from '@model/trans-urls';
import {WaybillImportComponent} from '../waybill-import/waybill-import.component';
import {ImgViewerService} from '@component/img-viewer/img-viewer';
import {UploadFiles} from '@service/upload-files';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-waybill-transport',
  templateUrl: './waybill-transport.component.html',
  styleUrls: ['./waybill-transport.component.css']
})
export class WaybillTransportComponent implements OnInit {
  gridOneHeight: string;
  gridTwoHeight: string;
  totalWeight: number = 0; // 总重量
  totalSheet: number = 0; // 总件数

  // 运单相关信息
  waybillData: Array<any> = []; // 运单数据
  loading: boolean = false; // 加载状态
  pageSize: number = 30; // 页码条数
  total: number = 0;
  selectedWaybillData: Array<any> = []; // 选中的数据
  searchdata: any = {};                 // 查询条件
  childIndex = 0;

  // 运单司机/捆包相关信息
  childGridId = 'waybillPack';   // 子表gridid
  childData: Array<any> = [];    // 子表数据
  childLoading: boolean = false; // 加载状态
  childPageSize: number = 100;   // 子表页码
  childTotal: number = 0;
  tabArr: Array<any> = [         // tab切换
    {name: '运单捆包', gridId: 'waybillPack'},
    {name: '运单司机', gridId: 'driver'}
  ];

  public returnPicList: any[] = [];
  @ViewChild('urlImg') urlImg: TemplateRef<any>;
  private tplModal: NzModalRef;

  constructor(private http: HttpUtilService,
              public router: Router,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private imgService: ImgViewerService,
              public upload: UploadFiles,
              public info: UserinfoService,) {
              upload.setUpload();
  }


  ngOnInit() {
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }
  /**
   * 查询运单
   * @param pageParam
   */
  getList(pageParam?: any) {
    this.loading = true;
    this.totalWeight = 0;
    this.totalSheet = 0;
    this.selectedWaybillData = [];
    this.waybillData = [];
    this.childData = [];
    pageParam.formId = 'form_waybill_transport';
    this.searchdata = {...pageParam};
    this.http.post(TRANS_URLS.getWaybillBycomAndSettle, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData = res.data.data ? res.data.data.data : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => item.rowIndex = index + 1);
      }
      this.loading = false;
    });
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'Accept':
        this.Accept();
        break;

      default:
        this.msg.error('按钮未绑定方法');
    }
  }


  Accept(){
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否对选择数据进行接受操作?',
      nzOnOk: () => {
        let params = {tWaybillModels:[]};
        params.tWaybillModels = this.selectedWaybillData.map(item => {
          return {
            waybillNo:item.waybillNo,
          }
        });
        this.http.post(TRANS_URLS.copyWaybill, params).then(
          (res: any) => {
            if (res.success) {
              this.msg.success(res.data.data);
              this.listSearch(this.searchdata);

            }
          });
      }

    })

  }

  columns(data: any) {
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg;
  }

  rowCilcked(data: any) { // 行点击事件
    this.waybillData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        item.checked = !item.checked;
      }
    });
    this.selectedWaybill(this.waybillData.filter(item => item.checked));
  }

  selectedWaybill(data: any) { // 选中数据
    this.selectedWaybillData = data;
    this.tabChange({gridId: this.childGridId});
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);
  }

  queryPack(tWaybills: Array<any>) { // 根据运单查询运单捆包信息
    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  queryDriver(tWaybills: Array<any>) { // 根据运单查询运单司机信息
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  tabChange(tabInfo: any) { // 运单司机/捆包tab页切换
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

  handlePreview = (file: UploadFile) => { //图片查看
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  getView(e: MouseEvent, data: string, item: any) {
    e.preventDefault();
    e.stopPropagation();
    this.waybillData.forEach((x: any) => x._bgColor = '');
    item._bgColor = '#a8b6ba';
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

}
