import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {toDemical} from '../../../../common/validators/validator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-stock-location-set',
  templateUrl: './stock-location-set.component.html',
  styleUrls: ['./stock-location-set.component.css']
})
export class StockLocationSetComponent implements OnInit {
  modalFormData: Array<any> = [
    {
      name: '仓库名称', eName: 'stockName', type: 'text', validateCon: '请输入仓库名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '库区名称', eName: 'areaName', type: 'text', validateCon: '请输入仓库名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '储位名称', eName: 'locationName', type: 'text', validateCon: '请输入储位名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输备注', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];
  stockNameArr: any[] = [];
  selectData: any[] = [];
  modalFormVisible: boolean = false;//表单弹窗
  modalValidateForm: FormGroup;
  deleteVisible: boolean = false; //确认弹窗
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  dataSet1: Array<any>;
  pageSize1: number = 30;//条数
  totalPages1: number;//数据总条数
  listLoading1: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  searchData: any;  //存储查询的数据
  stockAreaNameArr: any[] = [];
  private status: string;// add添加，update更新
  private rowid: number;
  private tplModal: NzModalRef;

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private fb: FormBuilder,
              private info: UserinfoService) {
  }

  ngOnInit() {
    this.getList1({page: 1, length: this.pageSize1});
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
    this.http.post(stockUrl.selectStockSetName, {}).then((res: any) => {
      if (res.success) {

        this.stockNameArr = res.data.data;
      }
    })
  }

  updateDataResult(data: any) {
    this.selectData = data;
  }

  stockNameChange(data: number) {

    this.http.post(stockUrl.selectStockAreaSetName, {stockName: data}).then((res: any) => {
      if (res.success) {

        this.stockAreaNameArr = res.data.data;
      }
    })
  }

  btnClick(data: any) {

    if (data.buttonId === 'Add') {
      this.modalTitle = '添加';

      this.modalValidateForm.reset();
      this.modalFormVisible = true;
      this.status = 'Add';
    } else if (data.buttonId === 'Update') {

      if (!this.selectData[0] || this.selectData[1]) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择一条进行修改'
        })
        return;
      }
      this.modalValidateForm.get('stockName').setValue(this.selectData[0] && this.selectData[0].stockName);
      this.modalValidateForm.get('areaName').setValue(this.selectData[0] && this.selectData[0].areaName);
      this.modalValidateForm.get('locationName').setValue(this.selectData[0] && this.selectData[0].locationName);
      this.modalValidateForm.get('remark').setValue(this.selectData[0] && this.selectData[0].remark);
      this.modalTitle = '修改';
      this.modalFormVisible = true;
      this.status = 'Update';
    } else if (data.buttonId === 'Delete') {

      if (!this.selectData[0]) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请进行选择'
        });
        return;
      }
      this.deleteVisible = true;
      this.modalTitle = '提示信息';
      this.deleteCon = "是否确定删除？";
    }

  }

  handleCancel() {
    this.modalFormVisible = false;
  }

  handleOk() {

    if (this.status === 'Add') {
      let param = this.modalValidateForm.value || {};
      for (const i in this.modalValidateForm.controls) {
        this.modalValidateForm.controls[i].markAsDirty();
        this.modalValidateForm.controls[i].updateValueAndValidity();
      }

      if (this.modalValidateForm.status === 'INVALID') { //不合格式
        return;
      }
      param.createCode = this.info.APPINFO.USER.userId;
      param.createName = this.info.APPINFO.USER.name;
      param.companyId = this.info.APPINFO.USER.companyId;
      param.locationName = param.locationName.trim();
      //获取库位编号
      if (this.stockAreaNameArr.length > 0) {
        param.areaCode = this.stockAreaNameArr.find(t => t.areaName == param.areaName).areaCode;
      }
      // this.http.post(stockUrl.selectStockLocationSetName, {}).then((x: any) => {
      //   if (x.success) {
      //     let temp = x.data.data || [];
          let strTemp = [];
          this.dataSet1.forEach(item => {
            strTemp.push(`${item.stockName}-${item.areaName}-${item.locationName}`)
          });
          let sti = `${param.stockName}-${param.areaName}-${param.locationName}`;
          let istrue: boolean = false;
          for (var i=0;i<strTemp.length;i++){
            if (strTemp[i] === sti) {
              istrue = true;
              break;
            }
          }
          if (!istrue) {
            this.http.post(stockUrl.insertStockLocationSet, param).then((res: any) => {
              if (res.success) {
                this.modalFormVisible = false;
                this.getList1({page: 1, length: this.pageSize1});
                this.nm.info({
                  nzTitle: '提示信息',
                  nzContent: '新增成功'
                })
              }
            })
          } else {
            this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '已存在仓库名称-库区名称-储位名称的储位！'
            })
          }
        // }
      // })
    } else if (this.status === 'Update') {
      let param = this.modalValidateForm.value || {};
      param.updateName = this.info.APPINFO.USER.name;
      param.companyId = this.info.APPINFO.USER.companyId;
      param.rowid = this.selectData[0].rowid;
      param.createDate = this.selectData[0].createDate;
      param.createCode = this.selectData[0].createCode;
      param.updateCode = this.info.APPINFO.USER.userId;
      this.http.post(stockUrl.updateStockLocationSet, param).then((res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.getList1({page: 1, length: this.pageSize1});
          this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          })
        }
      })
    }

  }

  modalConfirmResult(data: any) {

    if (data.type === 'ok') {
      let params = {stockLocationSetModels: []};
      params.stockLocationSetModels = [...this.selectData];
      this.http.post(stockUrl.deleteStockLocationSet, params).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.getList1({page: 1, length: this.pageSize1});
          this.nm.info({
            nzTitle: '提示信息',
            nzContent: '删除成功'
          })
        }
      })
    } else {
      this.deleteVisible = false;
    }
  }

  getList1(data: any): void {
    let url = stockUrl.selectStockLocationSet;
    this.listLoading1 = true;

    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }


}
