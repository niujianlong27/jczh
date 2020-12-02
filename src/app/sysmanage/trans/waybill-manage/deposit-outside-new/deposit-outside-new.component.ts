import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '@model/url';

@Component({
  selector: 'app-deposit-outside-new',
  templateUrl: './deposit-outside-new.component.html',
  styleUrls: ['./deposit-outside-new.component.css']
})
export class DepositOutsideNewComponent implements OnInit {

  deleteCon: string;
  status: string;
  inputModalModel: string;
  borderRed: boolean = false;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  private rowid: any;
  data:any = {};
  buttonId: string;
  confimCon: string;
  totalNumber:number = 0;
  totalWeight:number = 0;
  gridOneHeight:string
  gridTwoHeight:string
  dataSet2:any=[]

  constructor(private http: HttpUtilService,private anhttp: HttpClient,
              private router: Router,private fb: FormBuilder, private nzModal: NzModalService,
              private nzMess: NzNotificationService,) {

  }

  ngOnInit() {
    this.listSearch({page:1,length:30})
  }
  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }
  // 列表查询数据获取
  getListSearch(data: any): void {
    this.totalWeight = 0;
    this.totalNumber = 0;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getBclpStackingInfoMainSW;
    params.data = data;
    this.data = {...params.data};
    this.dataSet2 =[]
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }
  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case "Update":
        this.update();
        break;
      case "Build":
        this.bulid();
        break;
      case "Use":
        this.use();
        break;
      case "NotUse":
        this.notuse();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }


  update() {
    if (!this.selectedData[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if (this.selectedData.length > 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }
    this.router.navigate(['system/trans/waybill-manage/depositUpkeep'], {
      queryParams: {...this.selectedData[0]}
    });
  }

  out(){  //导出
    let url: any = urls.exportExcelSW;
    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `出库信息.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    })
  }

  bulid() {  //生成运单
    let canUser: boolean = true;
    if (this.selectedData.length!==1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }


      let param:any = {};
      let arr = [];
      // this.selectedData.forEach(item => {
      //   let obj = {};
      //   obj['lmsNo'] = item.mainProductListNo
      //   arr.push(obj);
      // })
      // param['tBclpStackingInfoMainListl'] = [...arr];
      param.lmsNo = this.selectedData[0].mainProductListNo
      this.http.post(urls.createwayBill, param).then((res: any) => {
        if (res.success) {
          this.nzMess.success('提示消息', '生成运单成功！');
          // this.listSearch({page: 1, length: this.pageSize});
          this.listSearch(this.data);
        }
      })


  }

  use() {  //使用
    if (!this.selectedData[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if(this.selectedData.filter(x=>x.isUse==='20').length>0){
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择未使用数据'
      });
      return;
    }
    let param :any = {lmsBclpOutBillMainModels:[]}
    param.lmsBclpOutBillMainModels = this.selectedData

    this.http.post(urls.useStackingInfoMain, param).then((res: any) => {

      if (res.success) {
        this.nzMess.success('提示消息', '更改为使用！');
        // this.listSearch({page: 1, length: this.pageSize});
        this.listSearch(this.data);
      }
    })
  };

  notuse() {  //未使用

    if (!this.selectedData[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if(this.selectedData.filter(x=>x.isUse==='10').length>0){
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择已使用数据'
      });
      return;
    }
    let param :any = {lmsBclpOutBillMainModels:[]}
    param.lmsBclpOutBillMainModels = this.selectedData

    this.http.post(urls.nouseStackingInfoMain, param).then((res: any) => {

      if (res.success) {
        this.nzMess.success('提示消息', '更改为未使用！');
        //this.listSearch({page: 1, length: this.pageSize});
        this.listSearch(this.data);
      }
    })
  }

  selectData(data: any) { // 主列表数据多选框选择
    this.selectedData = data;
    this.totalWeight = data.map((x:any)=>x.weight).reduce((x:string,y:string)=>Number(x)+Number(y),0);
    this.totalNumber = data.map((x:any)=>x.count).reduce((x:string,y:string)=>Number(x)+Number(y),0);
    if(data.length>0){
      this.getList2(data);
    }
    // console.log(data)
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  getList2(data:any){
    let param:any={lmsBclpOutBillMainModels:[]}
    param.lmsBclpOutBillMainModels = data
      this.http.post(urls.getBclpStackingInfoMainSWItem,param).then(res=>{
        this.dataSet2 = res.data.data
      })
  }
}
