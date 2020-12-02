import {Component, OnInit, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {et_EE, NzModalRef, NzModalService, NzNotificationService, TransferCanMove} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {format} from 'date-fns';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {of} from "rxjs/index";
import {Utils} from "../../../../common/util/utils";

@Component({
  selector: 'app-publish-entrust',
  templateUrl: './publish-entrust.component.html',
  styleUrls: ['./publish-entrust.component.css']
})
export class PublishEntrustComponent implements OnInit {

  @ViewChild('pubishTitle') pubishTitle;
  @ViewChild('pubishContent') pubishContent;
  @ViewChild('pubishFooter') pubishFooter;
  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;
  loading: boolean = false;
  modalTitle: string;
  bidPriceType: string = '10';
  buttonId: string;
  confimCon: string;
  data1: any[] = [];                //货盘数据列表
  data2: any[] = [];                //捆包明细列表
  data3: any[] = [];
  selectData1: any[] = [];
  selectlist: any = {};             //存储查询条件
  confirmRef: NzModalRef;
  modalRef: NzModalRef;
  pageSize: number = 30;            //每页显示条数
  totalPage: number;                //数据总条数
  dataSet: any;
  searchData: string;
  // parmas: any = {
  //   classification: 'flow'
  // };                                // 捆绑查询 默认初始按流向
  changeData: string = 'flow';       //流向、品名切换状态
  palletNo: string;                  //货盘号
  open: boolean;
  lists: any = [];                  //捆绑数据弹框缓存
  companyLists: any = [];           //承运人列表
  separatePublishInfo: any[] = [];  //分别发布弹窗列表信息
  flowList: any[] = [];             //按流向发布弹窗列表信息
  productList: any[] = [];          //按品名发布弹窗列表信息
  rightCompanyLists: any = [];      //左、右承运人数据保存
  leftCompanyLists: any = [];
  rightAllChecked = false;
  leftAllChecked = false;
  rightindeterminate = false;
  leftindeterminate = false;
  rightCompanyListsCopy: any = [];   //存储穿梭框右边数据
  leftCompanyListsCopy: any = []; //存储穿梭框左边数据
  settleTypeArr: any[] = [{name: '含税', value: 'JSFS10'}, {name: '不含税', value: 'JSFS20'}];
  timeTypeArr: any[] = [{name: '10', value: '10'}, {name: '20', value: '20'}, {name: '30', value: '30'}];
  calculationArr: any[] = [{name: '元/MT', value: 'JJJS10'}, {name: '美元/MT', value: 'JJJS20'}, {
    name: '元/箱',
    value: 'JJJS30'
  }, {name: '美元/箱', value: 'JJJS40'}];
  modalForm: any = {companyUserModelList: []};


  constructor(private nzModal: NzModalService, private router: Router, private http: HttpUtilService, private nzMess: NzNotificationService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }

  btnClick(data: any) {         //判断点击按钮的类型及对应的方法
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'LssuedSeparately':
        this.btnissue(data.buttonName);
        break;
      case 'Bundled':
        this.btnissue(data.buttonName);
        break;
      case 'Copy':
        this.copyUpdate(this.buttonId);
        break;
      case 'Update':
        this.copyUpdate(this.buttonId);
        break;
      case 'Delete':
        this.delete();
        break;
      default:
        break;
    }
  }

  listSearch(data: any) {    //列表查询
    this.selectlist = data;
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(this.selectlist);
  }

  getList(data: any) {      //获取数据列表接口
    this.loading = true;
    this.http.post(urls.entrustPublic, data).then((x: any) => {
      this.loading = false;
      if (x.success) {
        this.data2 = [];
        this.data3 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalPage = x.data.data && x.data.data.total;

      }
    });
  }

  listClick(data: any) {     //点击当前的列表项
    this.data2 = [];
    this.data3 = [];
    this.findList({palletNo: data.palletNo});
  }

  findList(param = {}) {        //查找明细列表
    this.loading = true;
    this.http.post(urls.palletFind, param).then((x: any) => {
      this.loading = false;
      if (x.success) {
        this.data2 = x.data.data && x.data.data.palletItemModelList;
        this.data3 = x.data.data && x.data.data.palletPackModelList;
      }
    })
  }

  selectData(data: any) {         // 主列表数据多选框选择
    this.selectData1 = data;
    // this.parmas.tOrderTenderItemAggregateModels = data;
  }

  copyUpdate(id: string) {        //复制或修改
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }

    this.router.navigate(['system/pretender/pretenderPalletAdd'], {
      queryParams: {
        palletNo: this.selectData1[0].palletNo,
        btnId: id,
        type: 2
      }
    });
    //   this.router.navigate(['system/trans/entrust-manage/addEntrust'], {
    //     queryParams: {
    //       palletNo: this.selectData1[0].palletNo,
    //       btnId: id
    //     }
    //   });
  }

  delete() {
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.confimCon = "确定删除该条记录？";
    this.confirmRef = this.nzModal.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    })

  }

  listDelete() {
    let params = {palletModelList: []};
    this.selectData1.map((x: any) => {
      let o: any = {};
      o.palletNo = x.palletNo;
      params.palletModelList.push(o);
    })
    this.http.post(urls.batchDelete, params).then((x: any) => {
      if (x.success) {
        this.getList(this.selectlist);
        this.nzMess.create('success', '提示信息', '删除成功！');
        this.confirmRef.destroy();
        this.selectData1 = [];
      }
    })
  }

  btnissue(name: string) {                      //发布
    this.selectCompanyUer();
    let params: any = {};
    this.separatePublishInfo = [];              //重置
    this.flowList = [];
    this.productList = [];
    this.modalForm = {};                        //重置
    this.modalForm.companyUserModelList = [];   //重置
    this.open = true;
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.buttonId === 'LssuedSeparately' && (params.palletModelList = []);
    this.buttonId === 'Bundled' && (params.tOrderTenderItemAggregateModels = []);
    this.selectData1.map((x: any) => {
      let o: any = {};
      o.palletNo = x.palletNo;
      this.buttonId === 'LssuedSeparately' ? params.palletModelList.push(o) : params.tOrderTenderItemAggregateModels.push(o);
    });
    this.buttonId === 'LssuedSeparately' && this.getSeparatePublishInfo(params, name); //分别发布弹窗列表
    this.buttonId === 'Bundled' && (params.classification = 'product', this.palletClassification(params, 'product', name), params.classification = 'flow', this.palletClassification(params, 'flow', name));

  };

  getSeparatePublishInfo(param = {}, name: string) {   //分别分布列表

    this.modalTitle = `发布委托  > ${name}`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.pubishTitle,
      nzContent: this.pubishContent,
      nzFooter: this.pubishFooter,
      nzMaskClosable: false,
      nzWidth: '70%'
    });
    this.http.post(urls.entrustIsses, param).then((x: any) => {
      if (x.success) {
        x.data.data.forEach(function (item) {
          item.calculation = "";
          item.settleType = "";
        });
        this.separatePublishInfo = x.data.data;
      }
    })
  }

  palletClassification(params: any = {}, type: string, name: string) { //捆绑发布列表

    this.http.post(urls.entrustBundled, params).then((res: any) => {
      if (res.success) {
        if (this.open) {
          this.modalTitle = `发布预招标  > ${name}`;
          this.modalRef = this.nzModal.create({
            nzTitle: this.pubishTitle,
            nzContent: this.pubishContent,
            nzFooter: this.pubishFooter,
            nzMaskClosable: false,
            nzWidth: '76%'
          });
          this.open = false;
        }
        type === 'flow' && (this.flowList = res.data.data);
        type === 'product' && (this.productList = res.data.data);
      }
    })
  }

  onKey(data: string, type: string) {   //按键搜索承运人
    let arr2 = [];
    if (data == '') {
      arr2 = type == 'left' ? this.leftCompanyListsCopy : this.rightCompanyListsCopy;
    } else {
      let lists = type == 'left' ? this.leftCompanyListsCopy : this.rightCompanyListsCopy;
      arr2 = lists.filter(function (item) {
        if (item.name) {
          return item.name.indexOf(data) > -1;
        }
      });
    }
    type == 'left' ? (this.leftCompanyLists = arr2) : (this.rightCompanyLists = arr2);
  }

  tab(data: string) {
    this.changeData = data;
  }

  selectCompanyUer(name: string = '') {                  //承运人查询
    this.http.post(urls.selectCompanyUserBid, {tenderFlag: 1, name: name}).then((x: any) => {
      if (x.success) {
        x.data.data.forEach(item => {
          item['checked'] = false
        });
        this.companyLists = Utils.deepCopy(x.data.data);
        this.leftCompanyLists = Utils.deepCopy(x.data.data);
        this.leftCompanyListsCopy = Utils.deepCopy(x.data.data);
      }
    });
  }

  dataFilter(inputValue: string, item: any): boolean {   //搜索判定条件
    return item.name.indexOf(inputValue) > -1;
  }

  change(data: any) {   //承运人穿梭框改变时触发
    if (data.to === 'right') {
      this.modalForm.companyUserModelList = [...this.modalForm.companyUserModelList, ...data.list];
    } else {
      data.list.map((x: any) => {
        this.modalForm.companyUserModelList = this.modalForm.companyUserModelList.filter((a: any) => a.userId != x.userId);
      });
    }
  }

  // canMove = (arg: TransferCanMove)=>{  // 穿梭框验证重复信息
  // let arr = Array.isArray(arg.list) && [...arg.list] || [];
  // if((arg.direction === 'right') && this.isExistCompany(arr)){
  //   this.nzMess.create('error','提示信息','选中的投标人存在相同的公司！');
  //   arr = [];
  // }
  // return of(arr);
  // };
  //
  // private  isExistCompany(data:any[]):boolean{
  //   for(let i = 0;i<data.length;i++){
  //     for(let j = i+1;j <= data.length - j;j++){
  //       if(data[i].companyId.trim() === data[j].companyId.trim()){
  //         return true;
  //       }
  //     }
  //   }
  //   for(let i = 0;i<data.length;i++){
  //     if(!Array.isArray(this.modalForm.companyUserModelList)) break;
  //     for(let j = 0;j<this.modalForm.companyUserModelList.length;j++){
  //       if(data[i].companyId.trim() === this.modalForm.companyUserModelList[j].companyId.trim()){
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  confirmissue(id: string) {  //点击确认发布
    this.confimCon = id === 'LssuedSeparately' ? '确定将选择的数据进行分别发布?' : '确定将选择的数据进行捆绑发布?';
    this.confirmRef = this.nzModal.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    });
  }

  confirm() {  // 确认按钮
    this.buttonId === 'Delete' && this.listDelete();
    this.buttonId === 'Bundled' && this.issuesResult();
    this.buttonId === 'LssuedSeparately' && this.issueResult();
  }

  issueResult() { //分别发布确认
    let data = this.getdata();
    let isTrue: boolean;
    this.selectData1.map((x: any) => {
      let i: any = {};
      i.tenderPalletNo = x.palletNo;
      data.palletModels.push(i);
    });
    data.offerPriceType = 'BJLX30';
    data.tenderType = 'CJLX10';
    this.separatePublishInfo.map((x: any) => {
      let s: any = {};
      x.tenderPalletNos = x.palletNo;
      x.tenderItemNos = x.palletItemNo;
      x.settleType && x.markedPriceTaxNo && x.calculation ? (
        // s.settleType = x.settleType ,
        //   s.markedPriceTaxNo = x.markedPriceTaxNo,
        //   s.calculation = x.calculation,
        isTrue = true) : isTrue = false;
      data.itemAggregates.push(x);
    });
    data.orderBids.length && isTrue ? this.req(data) : this.nzMess.create('error', '提示信息', '请完善信息');
  }

  issuesResult() {   //捆绑发布确认
    let data = this.getdata();
    let isTrue: boolean;
    data.remark = this.modalForm.remark;
    if (this.bidPriceType == '10') {   //按均价
      data.tenderType = 'CJLX10';
      data.offerPriceType = 'BJLX20';
      this.modalForm.remark && this.modalForm.settleType && this.modalForm.markedPriceTaxNo && this.modalForm.calculation ? (
        data.settleType = this.modalForm.settleType ,
          data.markedPriceTaxNo = this.modalForm.markedPriceTaxNo,
          data.calculation = this.modalForm.calculation,
          isTrue = true) : isTrue = false;
      this.selectData1.map((x: any) => {
        let i: any = {};
        i.palletNo = x.palletNo;
        data.palletModels.push(i);
      });

    } else if (this.bidPriceType == '20') { // 按分别报价
      data.itemAggregates = [];
      data.tenderType = this.changeData == 'flow' ? 'CJLX30' : 'CJLX20';
      this.lists = this.changeData == 'flow' ? this.flowList : this.productList;
      data.offerPriceType = 'BJLX10';
      this.selectData1.map((x: any) => {
        let i: any = {};
        i.tenderPalletNo = x.palletNo;
        data.palletModels.push(i);
      });

      this.lists.map((x: any) => {
        let s = Utils.deepCopy(x);
        s.tenderPalletNos = x.palletNo;
        s.tenderItemNos = x.palletItemNo;
        x.settleType && x.markedPriceTaxNo && x.calculation ? (
          // s.settleType = x.settleType ,
          // s.markedPriceTaxNo = x.markedPriceTaxNo,
          // s.calculation = x.calculation,
          isTrue = true) : isTrue = false;
        data.itemAggregates.push(s)
      });
    }
    data.remark && data.orderBids.length && isTrue ? this.req(data) : this.nzMess.create('error', '提示信息', '请完善信息');
  }

  getdata() {  //获取发布表单数据
    let params: any = {palletModels: [], orderBids: [], itemAggregates: []};
    params.bidTimeStart = format(this.modalForm.startTime, 'YYYY-MM-DD HH:mm:00');
    params.oneTime = this.modalForm.stageOne;
    params.twoTime = this.modalForm.stageSecond;
    params.delay = this.modalForm.delayTime;
    params.maxNo = this.modalForm.maxNo ? this.modalForm.maxNo + '' : '';
    params.bidder = 'CJRS20';
    if (this.buttonId == 'Bundled') {
      this.rightCompanyLists.map((x: any) => {
        let o: any = {};
        o.bidderCompanyId = x.companyId;
        o.bidderId = x.userId;
        o.name = x.name;
        o.tenderFlag = x.tenderFlag
        params.orderBids.push(o);
      });
    } else if (this.buttonId == "LssuedSeparately") {
      this.modalForm.companyUserModelList.map((x: any) => {
        let o: any = {};
        o.bidderCompanyId = x.companyId;
        o.bidderId = x.userId;
        o.name = x.name;
        params.orderBids.push(o);
      });
    }
    return params;

  }

  req(data) {   //确认发布接口请求
    let massage = data.offerPriceType == 'BJLX30' ? '分别发布成功!' : '捆绑发布成功!';
    this.http.post(urls.confirmIsses, data).then((res: any) => {
      if (res.success) {
        this.nzMess.create('success', '提示信息', massage);
        this.getList(this.selectlist);
        this.confirmRef.destroy();
        this.modalRef.destroy();
      }
    })
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return (current.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000);
  };

  cancel() {  //取消按钮
    this.confirmRef.destroy();
  }

  refreshStatus(even: string): void {   //选择承运人时触发
    let lists = even = 'left' ? this.leftCompanyLists : this.rightCompanyLists;
    let Checked = 'left' ? this.leftAllChecked : this.rightAllChecked;
    let indeterminate = 'left' ? this.leftindeterminate : this.rightindeterminate;
    const allChecked = this.lists.every(value => value.checked === true);
    const allUnChecked = this.lists.every(value => !value.checked);
    Checked = allChecked;
    indeterminate = (!allChecked) && (!allUnChecked);
  }

  leftcheckAll(value: boolean): void {   //左边全选
    this.leftCompanyLists.forEach(data => data.checked = value);
    this.refreshStatus('left');
  }

  rightcheckAll(value: boolean): void {   // 右边全选
    this.rightCompanyLists.forEach(data => data.checked = value);
    this.refreshStatus('right');
  }

  userAdd() {   //添加
    this.leftCompanyLists.map((item, index) => {
      if (item.checked === true) {
        this.leftCompanyListsCopy = this.leftCompanyListsCopy.filter(function (x) {
          if (x.name) {
            return x.name.indexOf(item.name) == -1;
          }
        });
        this.rightCompanyLists.unshift(item);
        this.rightCompanyLists[0].checked = false;
        this.leftCompanyLists = this.leftCompanyLists.filter(x => x !== item);
        // this.leftCompanyLists.splice(index, 1);
        // this.leftCompanyLists = [...this.leftCompanyLists];
        // this.rightCompanyLists = [...this.rightCompanyLists]
        this.rightCompanyListsCopy = [...this.rightCompanyLists];
      }
    })
  }

  userDelete() {   //删除
    this.rightCompanyLists.map((item, index) => {
      if (item.checked == true) {
        this.rightCompanyListsCopy = this.rightCompanyListsCopy.filter(function (x) {
          if (x.name) {
            return x.name.indexOf(item.name) == -1;
          }
        });
        this.leftCompanyLists.unshift(item);
        this.leftCompanyLists[0].checked = false;
        this.rightCompanyLists = this.rightCompanyLists.filter(x => x !== item);
        // this.leftCompanyLists = [...this.leftCompanyLists];
        // this.rightCompanyLists = [...this.rightCompanyLists];
      }
    })

  }


}
