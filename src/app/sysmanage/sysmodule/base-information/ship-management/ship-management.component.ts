import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {XlsxService} from "../../../../components/simple-page/xlsx/xlsx.service";
import {Utils} from "../../../../common/util/utils";

@Component({
  selector: 'app-ship-management',
  templateUrl: './ship-management.component.html',
  styleUrls: ['./ship-management.component.css']
})
export class ShipManagementComponent implements OnInit {

  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 10;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  status: string;
  columnsArr: any;
  implistLoading: boolean = false; //导入确定加载
  validateForm: FormGroup;
  importFile: any;
  importLoading: boolean;
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请选择文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请选择文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;


  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  private tplModal: NzModalRef; // 弹窗相关
  constructor(private router: Router,
              private fb: FormBuilder,
              private httpUtilService: HttpUtilService,
              private info: UserinfoService,
              private nm: NzModalService,
              private nn: NzNotificationService,
              private xlsx: XlsxService) {
  }

  ngOnInit(): void {
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
    params.url = `${environment.baseUrlSystem}boat/getBoat`;
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

  btnclick(data) {
    switch (data.type.buttonId) {
      case "Import":
        this.import();
        break;
    }

  }


  //添加
  btnAdd(): void {
    sessionStorage.removeItem('shipData');
    this.router.navigate(['/system/baseInformation/shipAdd']);
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


    sessionStorage.removeItem('shipData');
    this.router.navigate(['/system/baseInformation/shipAdd']);
    sessionStorage.setItem('shipData', JSON.stringify(data));

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
    const params = {url: '', data: {tBoatModels: []}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}boat/deleteBoat`;
    params.data.tBoatModels = this.selectedData;

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch({});
          this.nn.success('提示消息', '删除成功！');
        } else {
          // this.nn.error('提示消息', '删除失败！');
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

  import() {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;
    this.modalTitle = '船舶管理 > 导入';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '35%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  importConfirm() {   //导入确定按钮
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    let _data = [];
    this.implistLoading = true;
    let headTemplate = [];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      // _data.push(data[keys[i]]);
      let _data = data[keys[0]];
      if (!_data) {
        this.nn.remove();
        this.nn.error("提示信息", '未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      let headArr: any = _data && _data[0] || [];
      // if (!this.validateHead(headTemplate, headArr)) {
      //   return;
      // }
      this.excelFilter(_data);
    });

  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    if (head.length != receiptHead.length) {
      flag = false;
    }

    head.forEach(item => {
      if (typeof item != "string") {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        return;
      }
    });
    if (!flag) {
      this.nn.remove();
      this.nn.error("提示信息", "模板不匹配，请选择正确模板！");
      this.importLoading = false;
    }
    return flag;
  }


  excelFilter(data: any) {
    // let url = urls.importFleetRatio;
    let param: any = {tFleetRatioModels: []};
    let eNameHeader: any = [];

    data[0].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 1; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.tFleetRatioModels.push(temp);
    }

    param.tFleetRatioModels.forEach((item) => {
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });
    // this.httpUtilService.post(url, param).then((res: any) => {
    //   this.implistLoading = false;
    //   if (res.success) {
    //     this.tplModal.destroy();
    //     this.nn.create('success', '提示信息', res.data.data, {nzDuration: 3000});
    //     this.listSearch({page: 1, length: this.pageSize});
    //   }
    // })

  }

  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  };

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

}
