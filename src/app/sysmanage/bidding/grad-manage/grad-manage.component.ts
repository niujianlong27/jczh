import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-grad-manage',
  templateUrl: './grad-manage.component.html',
  styleUrls: ['./grad-manage.component.css']
})
export class GradManageComponent implements OnInit {
  robberyTit: string;
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
  tempInfo: any = {};
  robInfo: any = {};
  private timer: any;
  @ViewChild('robberyTitle') robberyTitle: TemplateRef<any>;
  @ViewChild('robberyContent') robberyContent: TemplateRef<any>;
  @ViewChild('robberyFooter') robberyFooter: TemplateRef<any>;

  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(private nzModal: NzModalService,
              private http: HttpUtilService,
              private nm: NzModalService,
              private info: UserinfoService,
              private nz: NzNotificationService,
              private com: CommonService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data: any) {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.robberCompanyId = this.info.get('USER').companyId;
    this.getList(this.searchData);
  }

  getList(params = {}) {

    this.btnDis.bid = true; //重置
    this.btnDis.result = true;//重置
    this.loading = true;
    this.http.post(urls.getRobbedListForBidder, params).then((x: any) => {
      if (x.success) {
        console.log(x);
        this.data2 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
        //this.changeStatus(this.data1);
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            for (var y = 0; y < this.data1.length; y++) {
              this.data1[y].now = new Date(new Date(this.data1[y].now).getTime() + 1000);
              if (new Date(this.data1[y].robbedTimeEnd).getTime() > new Date(this.data1[y].now).getTime()) {
                var leftTime = (new Date(this.data1[y].robbedTimeEnd).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                var days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                var hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                var minutes = parseInt((leftTime / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                var seconds = parseInt((leftTime / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].endDown = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
              } else {
                this.data1[y].endDown = '已结束';
              }
              if (new Date(this.data1[y].robbedTimeStart).getTime() > new Date(this.data1[y].now).getTime()) {
                var leftTime1 = (new Date(this.data1[y].robbedTimeStart).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                var days1 = parseInt((leftTime1 / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                var hours1 = parseInt((leftTime1 / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                var minutes1 = parseInt((leftTime1 / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                var seconds1 = parseInt((leftTime1 / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].startDown = days1 + '天' + hours1 + '小时' + minutes1 + '分' + seconds1 + '秒';
              } else {
                this.data1[y].startDown = '已开始';
              }
            }
          },
          1000);
      }
      this.loading = false;
      console.log(this.loading);
    });
  }

  selectData(data: any) {
    console.log(data)
    this.selectData1 = data;
    /*if(this.selectData1.length == 1){
      this.btnDis.Robbery = false;
    }else {
      this.btnDis.Robbery = true;
    }*/


    if (this.selectData1.length !== 0) {
      let param: any = {robbedItemModels: []};
      //param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.robbedItemModels.push({robbedNo: res.robbedNo, companyId: this.selectData1[0].companyId});
          if (res.robbedStatusName != '抢单中') {
            this.btnDis.Robbery = true;
          } else {
            this.btnDis.Robbery = false;
          }
        }
      );
      this.getNextList(param);
    } else {
      this.data2 = [];
    }
  }

  getNextList(param: any) {
    param.page = 1; //最好有
    param.length = param.length || this.pageSize2; //最好有
    param.consignorCompanyId = this.selectData1[0].companyId;
    this.data2PageTmp = param;
    this.nextLoading = true;
    this.http.post(urls.getRobbedItemByRobbedNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
      }
    });
  }

  btnClick(data: any) {
    //console.log(data);
    if (this.selectData1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    // console.log(this.selectData1);
    /*this.status = this.selectData1[0].issueType;
    if(!this.status || this.status == ''){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '发布方式不存在，请重新选择'
      });
      this.destroyTplModal();
      return;
    }*/

    //this.tempInfo = {};
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Robbery':
        this.robberyModel(data.buttonName);
        break;
      default:
        break;
    }
  }

  robberyModel(name: string) {
    //this.robberyInfo();
    this.http.post(urls.getRobbery, {robbedNo: this.selectData1[0].robbedNo, companyId: this.selectData1[0].companyId}).then((x: any) => {
      console.log(x);
      if (x.success) {
        this.robInfo = x.data.data;
        this.robberyTit = `抢单管理  > ${name}`;
        let url = urls.getBidInfoByTenderNoAndCompany;
        this.modalRef = this.nzModal.create({
          nzTitle: this.robberyTitle,
          nzContent: this.robberyContent,
          nzFooter: this.robberyFooter,
          nzWidth: '35%'
        });
      } else {
        this.getList(this.searchData);
      }
    });
    /*this.robberyTit = `竞价管理  > ${name}`;
    let url = urls.getBidInfoByTenderNoAndCompany;
    this.modalRef = this.nzModal.create({
      nzTitle: this.robberyTitle,
      nzContent: this.robberyContent,
      nzFooter: this.robberyFooter,
      nzWidth: '35%'
    })*/
  }

  robberyInfo() {
    /*this.http.post(urls.getRobbery,{robbedNo:this.selectData1[0].robbedNo,companyId:this.selectData1[0].companyId}).then((x:any) => {
      console.log(x);
      if(x.success){
        this.robInfo = x.data.data;
      }
    });*/
  }

  gradConfirm() {
    this.modalConfirm();
  }

  modalConfirm() {
    let url = urls.updateRob;
    let param: any = {tBidModels: []};
    param.robberCompanyId = this.selectData1[0].robCompanyId;
    param.companyId = this.selectData1[0].companyId;
    param.robbedNo = this.selectData1[0].robbedNo;
    param.weight = this.selectData1[0].planTotalWeight
    this.comfirmLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.comfirmLoading = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '抢单成功', {nzDuration: 3000});
        this.modalRef.destroy();
        this.getList(this.searchData);
      }
    });


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

  /**
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

}
