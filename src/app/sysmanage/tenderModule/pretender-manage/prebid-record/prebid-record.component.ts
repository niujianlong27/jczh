import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {NzModalService, NzModalRef, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {Utils} from '@util/utils';
import {format, getTime} from 'date-fns';
import {interval, Subscription} from 'rxjs';

import {CommonService} from '@service/common.service';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-prebid-record',
  templateUrl: './prebid-record.component.html',
  styleUrls: ['./prebid-record.component.css']
})
export class PrebidRecordComponent implements OnInit {
  recordTit: string;
  confirmCon: string;
  modalRef: NzModalRef;
  data1: any[] = [];
  data2: any[] = [];
  selectData1: any[] = [];
  loading: boolean = false;
  // 主列表页码数据
  totalpage: number = 0;
  pageSize: number = 30;
  // 子列表货盘明细页码数据
  totalpage2: number = 0;
  pageSize2: number = 30;
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  nextLoading: boolean = false;
  searchData: any = {};//存储查询条件
  modalResultShow: boolean = false;
  comfirmLoading: boolean = false;
  tplModal: NzModalRef;
  btnDis: any = {bid: true, result: true};
  status: any = '';//根据不同状态显示不同弹窗   10:显示船舶信息，投标价。  20：显示table,投标价
  buttonId: string;

  modalTableHeader: any = [];
  loadStandardArr: Array<any> = [];
  modalTableHeader1: any = [
    {colCname: '装点', colEname: 'flowNameStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '卸点', colEname: 'flowNameEnd', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '品种', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '尺寸规格', colEname: 'specifications', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运量（吨）', colEname: 'refCapacity', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleType', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleTypeName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运价（元/吨）', colEname: 'referencePriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '150'},
    {colCname: '载重方式', colEname: 'loadStandard', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '载重方式', colEname: 'loadStandardName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '200'},
    {colCname: '车次', colEname: 'totalTrainNum', visible: 'XSBJ10', edit: 'BJBJ10', type: 'number', width: '120'},
    {colCname: '运力（吨）', colEname: 'capacity', visible: 'XSBJ10', edit: 'BJBJ10', format: 3, type: 'number', width: '120'},
    {colCname: '投标价（元/吨）', colEname: 'price', visible: 'XSBJ10', edit: 'BJBJ10', format: 3, type: 'number', width: '120'},
  ];

  modalTableHeader2: any = [
    {colCname: '装点', colEname: 'flowNameStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '卸点', colEname: 'flowNameEnd', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '品种', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运量（吨）', colEname: 'refCapacity', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleType', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleTypeName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运价（元/吨）', colEname: 'referencePriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '150'},
    {colCname: '载重方式', colEname: 'loadStandard', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '170'},
    {colCname: '载重方式', colEname: 'loadStandardName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '200'},
    {colCname: '车次', colEname: 'totalTrainNum', visible: 'XSBJ10', edit: 'BJBJ10', type: 'number', width: '120'},
    {colCname: '运力（吨）', colEname: 'capacity', visible: 'XSBJ10', edit: 'BJBJ10', format: 3, type: 'number', width: '120'},
    {colCname: '投标价（元/吨）', colEname: 'price', visible: 'XSBJ10', edit: 'BJBJ10', format: 3, type: 'number', width: '120'},

  ];

  modalTableData: any = [];
  //船舶信息，投标价
  tempInfo: any = {};

  @ViewChild('recordTitle') recordTitle: TemplateRef<any>;
  @ViewChild('recordContent') recordContent: TemplateRef<any>;
  @ViewChild('recordFooter') recordFooter: TemplateRef<any>;
  @ViewChild('confirmTitle') confirmTitle: TemplateRef<any>;
  @ViewChild('confirmContent') confirmContent: TemplateRef<any>;
  @ViewChild('confirmFooter') confirmFooter: TemplateRef<any>;
  timer: Subscription;

  constructor(private nzModal: NzModalService, private http: HttpUtilService, private nm: NzModalService, private info: UserinfoService, private nz: NzNotificationService, private com: CommonService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getStatic(this.loadStandardArr, 'LOADTYPE');

  }

  listSearch(data: any) {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.getList(this.searchData);
  }

  private changeStatus(data: any[]) { //状态变更
    let arr = Array.isArray(data) && data || [];
    let noStartData = arr.filter((x: any) => x.status !== 'ZTZT40');//投标未结束
    const nowTimes = this.com.dateNow().sysTime2;
    noStartData.map((x: any) => {
      x.restTime = Math.floor((getTime(x.bidTimeStart) - getTime(nowTimes)) / 1000); //开始时间的剩余时间
      x.restTimeEnd = Math.floor((getTime(x.bidTimeEnd) - getTime(nowTimes)) / 1000);//结束时间的剩余时间
    });
    this.timer && this.timer.unsubscribe();
    if (noStartData[0]) {
      this.timer = interval(1000).subscribe(x => {
        noStartData.map((d: any, i: number) => {
          if ((d.restTime <= 0) && (d.status === 'ZTZT10')) {
            d.status = 'ZTZT20';
            d.statusStr = '投标已开始';
          } else {
            d.restTime--;
          }

          if (d.restTimeEnd <= 0) {
            d.status = 'ZTZT40';
            d.statusStr = '已结束';
            noStartData.splice(i, 1);
          } else {
            d.restTimeEnd--;
          }
        });
        if (!noStartData[0]) {
          this.timer.unsubscribe();
        }
      });
    }
  }

  getList(params = {}) {
    this.btnDis.bid = true; //重置
    this.btnDis.result = true;//重置
    this.loading = true;
    this.http.post(urls.getTenderListForBidder, params).then((x: any) => {
      if (x.success) {
        console.log(x);
        this.data2 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
      }
      this.loading = false;
    });
  }

  btnClick(data: any) {
    if (this.selectData1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    this.status = this.selectData1[0].issueType;

    if (!this.status || this.status == '') {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '发布方式不存在，请重新选择'
      });
      this.destroyTplModal();
      return;
    }
    if (this.status !== 'FBFS30') {
      this.modalTableHeader = Utils.deepCopy(this.modalTableHeader1) ;//按流向
    }
    // else if (this.status == 'FBFS20' || this.status == 'FBFS50') {
    //   this.modalTableHeader = Utils.deepCopy(this.modalTableHeader2);//按品名
    // }
    this.tempInfo = {};
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'bid':
        this.modalResultShow = false;
        this.modalTableHeader.map((x: any) => {
          x.type === 'input' && (x.edit = 'BJBJ20');
          x.eName === 'priceEx' && (x.disabled = true);
        });
        this.bid(data.buttonName);
        break;
      case 'result':
        this.modalTableHeader.push({
            colCname: '吨公里单价',
            colEname: 'pricePerTonKilometre',
            visible: 'XSBJ10',
            edit: 'BJBJ20',
            type: 'string',
            width: '130'
          },
        );
        this.modalTableHeader.map((x: any) => {
          x.type === 'number' && (x.edit = 'BJBJ20');

        });
        this.modalResultShow = true;
        this.bid(data.buttonName);
        break;
      default:
        break;
    }
  }

  bid(name: string) {
    this.modalTableData = [];
    this.recordTit = `投标管理  > ${name}`;
    let url = urls.getBidInfoByTenderNoAndCompany;
    let param: any = {
      tenderNo: this.selectData1[0].tenderNo,
      bidderCompanyId: this.info.get('USER').companyId,
      consignorCompanyId: this.selectData1[0].consignorCompanyId
    };

    param.companyId = this.selectData1[0].consignorCompanyId;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        let deepData = Utils.deepCopy(res.data.data);
        this.modalTableData = res.data.data || [];
        if (this.modalTableData[0]) {
          if (this.status == 'FBFS30') {//均价
            let arr = [];

            res.data.data.forEach((item, index) => {
              item.tBidModelsThree.forEach(data => {
                this.loadStandardArr.forEach(load => {
                  data.loadStandard == load.value && (data.loadStandardName = load.remark);
                });
                arr.push({
                  ...item,
                  loadStandard: data.loadStandard,
                  price: data.offerPriceTaxNo,
                  capacity: data.capacity,
                  loadStandardName: data.loadStandardName,
                  totalTrainNum: data.totalTrainNum
                });
              });
            });

            this.tempInfo.loadStandardType = arr;

            this.tempInfo.settleType = deepData[0].settleType == 'JSFS10' ? '含税' : '不含税';
            this.tempInfo.specifications = deepData[0].specifications;

            if (deepData[0].referencePriceTaxNo) {
              this.tempInfo.carriage = isNaN(deepData[0].referencePriceTaxNo) ? deepData[0].referencePriceTaxNo :
                Number(deepData[0].referencePriceTaxNo).toFixed(2) + '（参考价）';
            } else {
              this.tempInfo.carriage = isNaN(deepData[0].markedPriceTaxNo) ? deepData[0].markedPriceTaxNo :
                Number(deepData[0].markedPriceTaxNo).toFixed(2) + '（拦标价）';
            }
          } else {
            let arr = [];
            res.data.data.forEach((item, index) => {
              item.tBidModelsThree.forEach(data => {

                this.loadStandardArr.forEach(load => {
                  data.loadStandard == load.value && (data.loadStandardName = load.remark);
                });
                item.settleTypeName = item.settleType == 'JSFS10' ? '含税' : '不含税';

                if ( deepData[index].referencePriceTaxNo) {
                  item.referencePriceTaxNo = isNaN(item.referencePriceTaxNo) ? deepData[index].referencePriceTaxNo :
                    Number(deepData[index].referencePriceTaxNo).toFixed(2) + '（参考价）';
                } else {
                  item.referencePriceTaxNo = isNaN(item.markedPriceTaxNo) ? deepData[index].markedPriceTaxNo :
                    Number(deepData[index].markedPriceTaxNo).toFixed(2) + '（拦标价）';

                }
                // item.referencePriceTaxNo = item.referencePriceTaxNo ? (isNaN(item.referencePriceTaxNo) ? deepData[index].referencePriceTaxNo :
                // Number(deepData[index].referencePriceTaxNo).toFixed(2) + '（参考价）') :  Number(deepData[index].markedPriceTaxNo).toFixed(2) + '（拦标价）';

                item.refCapacity = Number(item.refCapacity).toFixed(3);
                arr.push({
                  ...item,
                  loadStandard: data.loadStandard,
                  price: data.offerPriceTaxNo,
                  capacity: data.capacity,
                  loadStandardName: data.loadStandardName,
                  totalTrainNum: data.totalTrainNum
                });
              });
            });
            this.modalTableData = arr;
          }
        }

      }
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '70%'
      });
    });
    if (this.selectData1[0].hiredType == '10') {
      this.modalTableHeader1[9].name = '投标价（元）';
      this.modalTableHeader1[5].name = '参考运价（元）';
    } else {
      this.modalTableHeader1[9].name = '投标价（元/吨）';
      this.modalTableHeader1[5].name = '参考运价（元/吨）';
    }
  }

  bidConfirm() {
    this.modalConfirm();
  }

  modalConfirm() {
    let url = urls.insertBid;
    let params: any = {tBidModels: []};
    let copydata: any;
    params.consignorCompanyId = this.selectData1[0].consignorCompanyId;
    params.companyId = this.selectData1[0].consignorCompanyId;
    params.tenderNo = this.selectData1[0].tenderNo;
    // param.loadDateEnd = this.tempInfo.loadDateEnd && format(this.tempInfo.loadDateEnd,'YYYY-MM-DD HH:mm:ss')
    if (this.status == 'FBFS30') {
      copydata = Utils.deepCopy(this.tempInfo.loadStandardType);
      let a = this.dataLimit(this.tempInfo.loadStandardType);
      if (a == false) {
        return;
      }
    } else {
      copydata = Utils.deepCopy(this.modalTableData);
      let a = this.dataLimit(this.modalTableData);
      if (a == false) {
        return;
      }
    }
    let data = copydata.filter(item => {
      return item.price;
    });
    let obj: any = {};
    data.forEach(  // 相同的 aggregateNo 把 offerPriceTaxNo capacity totalTrainNum loadStandard 汇总存储 tBidModelsThree
      res => {
        if (!obj[res.aggregateNo]) {
          obj[res.aggregateNo] = [
            {
              offerPriceTaxNo: res.price,
              capacity: res.capacity,
              totalTrainNum: res.totalTrainNum,
              loadStandard: res.loadStandard
            }
          ];
        } else {
          obj[res.aggregateNo] = [
            ...obj[res.aggregateNo],
            {
              offerPriceTaxNo: res.price,
              capacity: res.capacity,
              totalTrainNum: res.totalTrainNum,
              loadStandard: res.loadStandard
            }
          ];
        }
      }
    );

    data.forEach((x: any) => {
      const p = {
        ...x,
        tBidModelsThree: obj[x.aggregateNo]
      };
      params.tBidModels.push(
        p
      );
    });

    for (let i = 1; i < params.tBidModels.length; i++) { // 根据aggregateNo 去重
      for (let j = 0; j < i; j++) {
        if (params.tBidModels[i].aggregateNo == params.tBidModels[j].aggregateNo) {
          params.tBidModels.splice(j, 1);
          i--;
          break;
        }
      }
    }
    this.comfirmLoading = true;
    this.http.post(url, params).then((res: any) => {
      this.comfirmLoading = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        this.modalRef.destroy();
        this.getList(this.searchData);
      }
    });

  }


  dataLimit(data: any) {  // 输入限制
    let isTrue = false;
    let num = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].totalTrainNum || data[i].capacity || data[i].price) {
        if (!data[i].price) {
          this.nz.warning('提示信息', '请录入投标价');
          isTrue = true;
          break;
        }
        //   if (!(/(^[1-9]\d*$)/.test(data[i].totalTrainNum))) {
        //     this.nz.warning('提示信息', '车次项请输入正整数');
        //     isTrue = true;
        //     break;
        //   }
        //   if (data[i].loadStandard == 10) {  //标准 < 35
        //     console.log(Number(data[i].capacity));
        //     let mul = Utils.mul(data[i].totalTrainNum, 35);
        //     console.log(mul = Utils.mul(data[i].totalTrainNum, 35));
        //     if (Number(data[i].capacity) >= mul) {
        //       this.nz.warning('提示信息', `标准载重输入的运力需小于${mul}`);
        //       isTrue = true;
        //       break;
        //     }
        //   }
        //   if (data[i].loadStandard == 20) {
        //
        //     let mul1 = Utils.mul(data[i].totalTrainNum, 35);
        //     let mul2 = Utils.mul(data[i].totalTrainNum, 50);
        //     if ((Number(data[i].capacity) <= mul1) || (Number(data[i].capacity) >= mul2)) {
        //       this.nz.warning('提示信息', `非标载重（大于35吨小于50吨）需大于${mul1}且小于${mul2}`);
        //       isTrue = true;
        //       break;
        //     }
        //   }
        //   if (data[i].loadStandard == 30) {
        //     let mul = Utils.mul(data[i].totalTrainNum, 50);
        //
        //     if (Number(data[i].capacity) <= mul) {
        //       this.nz.warning('提示信息', `非标载重（大于50吨）输入的运力需大于${mul}`);
        //       isTrue = true;
        //       break;
        //     }
        //   }
        //
      } else {
        num += 1;
      }
    }
    if (num == data.length) {
      this.nz.warning('提示信息', '至少填写一种投标方式');
      return false;
    }
    if (isTrue) {
      return false;
    }
  }

  getNextList(param: any) {

    param.page = param.page || 1;
    param.length = param.length || this.pageSize2;
    param.list[0].companyId = this.selectData1[0].consignorCompanyId;
    this.data2PageTmp = param;
    this.nextLoading = true;
    this.http.post(urls.getPalletItemAggregateByTenderNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
      }
    });
  }

  selectData(data: any) {
    this.selectData1 = data;
    if (this.selectData1.length == 1) {
      this.btnDis.bid = false;
      this.btnDis.result = false;
    } else {
      this.btnDis.bid = true;
      this.btnDis.result = true;
    }
    if (this.selectData1[0]) {
      if (this.selectData1[0].status == '5') {
        this.btnDis.bid = true;
        this.btnDis.result = true;
      } else if (this.selectData1[0].status == '10') {
        this.btnDis.result = true;
      } else if (this.selectData1[0].status == '20') {
        this.btnDis.result = true;
      } else if (this.selectData1[0].status == '30' || this.selectData1[0].status == '40' || this.selectData1[0].status == '50' || this.selectData1[0].status == '60') {
        this.btnDis.bid = true;
      }
    }

    if (this.selectData1.length !== 0) {
      let param: any = {list: []};
      param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.list.push({tenderNo: res.tenderNo});
        }
      );
      this.getNextList(param);
    } else {
      this.data2 = [];
    }
  }

  /**
   * 货盘明细条数点击事件
   * @param param
   */
  pageSizeEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.length = param;
    this.pageSize2 = param;
    this.selectData1.length !== 0 ? this.getNextList(tmp) : null;
  }

  /**
   * 货盘明细页码点击事件
   * @param param
   */
  pageIndexEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.page = param;
    this.getNextList(tmp);
  }

  cancel() {
    this.modalRef.destroy();
  }

  confirm() {
    this.modalRef.destroy();
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  ngOnDestroy() {
    this.timer && this.timer.unsubscribe();//清除
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

}
