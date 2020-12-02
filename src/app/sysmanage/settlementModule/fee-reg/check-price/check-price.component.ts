import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';

import {localUrls} from '../../../../common/model/localUrls';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {isPosNum} from '../../../../common/validators/validator';
import {urls} from '../../../../common/model/url';


@Component({
  selector: 'app-check-price',
  templateUrl: './check-price.component.html',
  styleUrls: ['./check-price.component.css']
})
export class CheckPriceComponent implements OnInit {

  @ViewChild('confirmTitle') confirmTitle: TemplateRef<any>;
  @ViewChild('confirmContent') confirmContent: TemplateRef<any>;
  @ViewChild('confirmFooter') confirmFooter: TemplateRef<any>;
  confirmCon: string;

  isVisible = false;

  payReceiveType: string = 'JJFS10';  //应付计价方式 0：吨/元
  receiveType: string = 'JJFS10';    //	应收计价方式 0:吨/元
  payPrice: any;   //应付运费单价
  unitPrice: any;  //应收运费单价
  payableFlag: any;     //应付勾选框
  agentFlag: boolean;   //应收勾选框

  tplModal: NzModalRef;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = false;
  dataSet: any;
  modalTitle = '应收运费核价 > 复制单价';
  radioValue = '10';
  ownPrice = '';
  selectedData: any = [];
  searchTmp:any;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  buttonId: string;
  caculateEnameArr: any = [
    {field: 'totalSheet', tipInfo: '已选件数', tipInfoType: '件', demLength: 3},
    {field: 'totalWeight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalPrice', tipInfo: '应收金额', tipInfoType: '元', demLength: 2},
    {field: 'payTotalPrice', tipInfo: '应付金额', tipInfoType: '元', demLength: 2},
  ];

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {

  }

  ngOnInit(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchTmp = data;
    this.getList(data);
  }

  getList(data: any): void {
    let listUrl = localUrls.checkPriceUrl;
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(listUrl, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data;
        this.totalPage = res.data.data && res.data.data.total;
      }
    });
  }

  btnClick(data: any): void {
    this.buttonId = data.buttonId;
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    if (data.type.buttonId == 'copyPrice') {
      //复制核价
      this.unitPrice = '';
      this.payPrice = '';
      this.agentFlag = false;
      this.payableFlag = false;
      this.isVisible = true;
      this.selectedData = data;
    } else if (data.type.buttonId == 'checkPrice') {

      //核价
      let checkUrl = localUrls.checkPriceCheckUrl;
      let param = {waybillList: []};

      console.log(data.data);
      for (let element of data.data) {
        console.log(element.hasChecked);
        if ((!element.unitPrice || element.unitPrice == '') && (!element.payPrice || element.payPrice == '')) {
          element.hasChecked = false;
        } else {
          element.hasChecked = true;
          if (element.unitPrice && element.unitPrice != '') {
            element.agentFlag = true;
          }
          if (element.payPrice && element.payPrice != '') {
            element.payableFlag = true;
          }
        }
        if (!element.hasChecked) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请复制单价后操作！'
          });
          this.destroyTplModal();
          return;
        }
        if (!element.consignorCompanyId || element.consignorCompanyId == '') {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '委托单位不存在，不能进行核价！'
          });
          this.destroyTplModal();
          return;
        }
        param.waybillList.push({
          unitPrice: element.unitPrice || '',
          payPrice: element.payPrice || '',
          waybillNo: element.waybillNo,
          agentFlag: element.agentFlag ? 'YSBJ20' : 'YSBJ10',
          payableFlag: element.payableFlag ? 'YFBJ20' : 'YFBJ10',
          payReceiveType: 'JJFS10',
          receiveType: 'JJFS10'
        });
      }
      // console.log(param);
      this.http.post(checkUrl, param).then(
        (res: any) => {
          if (res.success) {
            this.listSearch({page: 1, length: this.pageSize});
            this.nz.create('success', '提示信息', '核价成功', {nzDuration: 3000});
          }
        }
      );

    } else if (data.type.buttonId == 'delete') {
      this.selectedData = data.data;
      this.confirmCon = '确定要取消核价么?';
      this.tplModal = this.nm.create(
        {
          nzTitle: this.confirmTitle,
          nzContent: this.confirmContent,
          nzFooter: this.confirmFooter
        }
      );

    }
  }

  btnAdd(data: any): void {

  }

  btnUpdate(data: any): void {

  }

  // 作废
  delete(): void {
    this.http.post(urls.deleteSettleWaybill, {tSettleModels: this.selectedData}
    ).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '作废成功', {nzDuration: 3000});
          this.listSearch(this.searchTmp);
        }
        this.selectedData = null;
        this.tplModal.destroy();
      }
    );
  }

  confirm(): void {
    this.buttonId === 'delete' || this.delete();
  }

  cancel(): void {
    this.tplModal.destroy();
  }

  handleOk(): void {
    if (this.radioValue == '10') {
      console.log(this.selectedData.data);

      for (let element of this.selectedData.data) {
        if (this.agentFlag) {
          //应收选中
          if (!this.unitPrice || this.unitPrice == '') {
            this.tplModal = this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '请填写应收单价'
            });
            return;
          }
          element.unitPrice = this.unitPrice;
          element.agentFlag = this.agentFlag;
          element.hasChecked = true;
        }
        if (this.payableFlag) {
          if (!this.payPrice || this.payPrice == '') {
            this.tplModal = this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '请填写应付单价'
            });
            return;
          }
          element.payPrice = this.payPrice;
          element.payableFlag = this.payableFlag;
          element.hasChecked = true;
        }
      }
      ;

    }

    this.isVisible = false;

  }

  handleCancel(): void {
    this.isVisible = false;
  }


  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


  modalChange(data: any) {
    console.log(data);
    switch (data.header.colEname) {
      case 'unitPrice':
      case 'payPrice':
        if (!isPosNum(data.val)) {
          data.input.value = '';
          data.data[data.header.colEname] = '';
        }
    }
  }
}
