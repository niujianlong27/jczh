import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-allocate-funds-settle',
  templateUrl: './allocate-funds-settle.component.html',
  styleUrls: ['./allocate-funds-settle.component.css']
})
export class AllocateFundsSettleComponent implements OnInit {

  @ViewChild('detail') detail;

  tplModal: NzModalRef; // 错误弹窗

  // 主表单
  totalPages: Number = 1; // 总共页数
  pageSize: number = 30; // 条数
  listLoading: boolean = false; // 加载装态
  listLoading2: boolean = false;
  dataSet: Array<any> = []; // 数据
  selectData: Array<any> = []; // 选中数据
  isMulti: boolean = false; // 是否多选
  clickData: any; // 点击时数据
  searchData: any; // 搜索时数据
  settleData: any = {
    payPrice: '',
    settleWeight: '',
    transTotWeight: ''
  };

  // 附列表
  ApposeDataSet: Array<any> = [];
  listLoading3: boolean = false;

  // 子表单
  tempRowid: any;
  childrenDataSet: Array<any> = []; // 数据
  selectDataChild: Array<any> = []; // 选中数据
  isMultiChild: boolean = false; // 是否多选

  // 表单公共部分
  showChildrenList: boolean = false; // 是否展示子列表
  trSelectedShow: boolean = false;
  private tempOrderNo: string;

  // 页面grid
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

  // 列表点击 查看子列表

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private  angularHttp: HttpClient, private info: UserinfoService) {
  }

  ngOnInit() {
 //   this.listSearch({page: 1, length: this.pageSize});
  }

  // 主列表刷新数据
  listSearch(data: any): void {
    data.page = data.page || 1; // 最好有
    data.length = data.length || this.pageSize; // 最好有
    this.searchData = data;
    this.getList(data);
  }

  // 主列表数据获取
  getList(data: any): void {
    const url = urls.getListSettle;
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(url, data).then((res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPages = res.data.data && res.data.data.total || 0;
          this.ApposeDataSet = [];
          this.childrenDataSet = [];
        }
      }
    );
  }

  // 子列表数据获取
  getListChild(): void {
    const url = urls.getListByOrderNo;
    this.listLoading2 = true;
    this.childrenDataSet = [];
    if (this.selectData[0]) {
      this.http.post(url, this.selectData[0]).then((res: any) => {
          this.listLoading2 = false;
          if (res.success) {
            this.childrenDataSet = res.data.data || [];
          }
        }
      );
    } else {
      this.listLoading2 = false;
    }


  }

  getAppose(): void {
    if (!this.selectData[0]) {
      this.ApposeDataSet = [];
      return;
    }
    const url = urls.selectAllocateFundsDetail;
    this.listLoading3 = true;
    this.ApposeDataSet = [];
    this.http.post(url, this.selectData[0]).then((res: any) => {
        this.listLoading3 = false;
        if (res.success) {
          this.ApposeDataSet = res.data.data || [];
        }
      }
    );

  }

  // 按钮点击
  btnClick(data: any): void {
    const buttonId = data.buttonId;
    console.log(data);
    switch (buttonId) {
      case 'settle': {
        if (this.selectData.length === 0) {
          this.nz.warning('提示消息', '请选择数据！');
          return;
        }

        if (this.selectData[0].settleStatus === 'WTJS40') {
          this.nz.warning('提示消息', '结算已完成，无法再次结算！');
          return;
        }

        this.settle();
      }
        break;
      case 'print': {
        if (this.selectData.length === 0) {
          this.nz.warning('提示消息', '请选择数据！');
          return;
        }
        this.print();
      }
        break;
      default: {
        this.nz.warning('提示消息', '该按钮功能为定义！');
      }
    }


  }

  // 主列表选中数据
  updateData(data: any): void {
    this.selectData = data;
    this.getAppose();
    this.getListChild();
  }

  // 错误弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  listClick(data: any) {
    this.dataSet.forEach(item => {
      if (item.orderNo === data.orderNo) {
        item.checked = !item.checked;
      } else {
        item.checked = false;
      }
    });
    this.updateData(this.dataSet.filter(item => item.checked));
    // this.clickData = data;
    // if (data.orderNo === this.tempOrderNo) {
    //   data.showChildren = !data.showChildren;
    // } else {
    //   this.dataSet.forEach(element => {
    //     element.showChildren = false;
    //   });
    //   data.showChildren = true;
    // }
    // if (data.showChildren) {
    //   this.showChildrenList = true;  //控制子列表是否显示
    //   this.trSelectedShow = true;
    //   this.getListChild();
    // } else {
    //   this.childrenDataSet=[];
    //   this.showChildrenList = false;
    //   this.trSelectedShow = false;
    // }
    // this.tempOrderNo = data.orderNo;
  }

  settle(): void {
    this.settleData = {
      payPrice: '',
      settleWeight: '',
      transTotWeight: ''
    };
    this.http.post(urls.checkout, {orderNo: this.selectData[0].orderNo}).then(
      res => {

        if (res.success) {
          this.settleData.payPrice = res.data.data.payPrice;
          this.settleData.settleWeight = res.data.data.settleWeight;
          this.settleData.transTotWeight = res.data.data.transTotWeight;
        }
      }
    );
    this.nm.create(
      {
        nzTitle: '合同结算管理 > 结算',
        nzContent: this.detail,
        nzOnOk: () => {
          return this.http.post(urls.settle, this.selectData[0]).then(
            res => {
              if (res.success) {
               
                const tip = ( Number(this.selectData[0].allocationAmount) === Number(this.settleData.payPrice) ) ? '结算成功!' : `已收金额（${this.selectData[0].allocationAmount}）和应付金额(${this.settleData.payPrice})不一致,需要到合同配款重新进行分配！`;
                //this.nz.success('提示消息', tip);
                  this.nm.info({
                    nzTitle:'提示信息',
                    nzContent: tip,
                  })
                this.listSearch(this.searchData);
              }
            }
          );
        }
      }
    );


  }

  print(): void {
    if (this.selectData[0].settleStatus === 'WTJS20') {
      this.nz.warning('提示消息', '配款确认状态无法打印委托单！');
      return;
    }
    this.angularHttp.get(urls.orderStatements,
      {
        responseType: 'blob',
        params: {
          orderNo: this.selectData[0].orderNo,
          requestCompanyId: this.info.get('USER').companyId,
          requestUserId: this.info.get('USER').userId
        }
      }
    ).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/pdf'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      res => {
        // this.nz.warning('提示消息', '生成委托结算单失败!');
      }
    );
  }

  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
  }

}
