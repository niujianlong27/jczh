import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {CommonService} from '../../../../common/services/common.service';
import {TRANS_PLAN_URLS} from '../../../../common/model/transPlan-urls';
import {MODEL_MANAGE} from '../../../../common/model/modelManage-urls';
import {Utils} from '../../../../common/util/utils';
import {contractUrl} from '../../../../common/model/contractUrl';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-model-manage',
  templateUrl: './model-manage.component.html',
  styleUrls: ['./model-manage.component.css']
})
export class ModelManageComponent implements OnInit {
  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;


  loginID: string; // 登录人id
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  flag:boolean=false;
  flag2:boolean=false;
  totalPages1: number;
  totalPages2: number;
  pageSize1: number = 30;
  pageSize2: number = 30;
  selectedList1: any = [];
  selectedList2: any = [];
  modalPageSize: any = 30;
  modalListLoading: boolean = false;
  implistLoading: boolean = false;
  modalDataSet: any = [];
  modalTotalPages: any = 0;
  modalUpdateData: any = [];
  modalBtnDis: any = {};
  modalTempSearchParam: any = {};
  loadTaskCode: number = 0;
  updateData: any = [];
  selectData1: any;
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: any = '库存监控 > 日期';
  deleteCon: string;
  deleteList = [];//需要删除的数据
  allocateGoods: any;
  tempSearchParam: any;
  rowid:any;
  currentTime:any;
  x: any;
  status: string;
  private buttonId: any;
  isVisible: boolean = false;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  modalValidateForm: FormGroup;

  constructor(private router: Router,
              private appInfo: UserinfoService,
              private nzMess: NzMessageService,
              private fb: FormBuilder,
              private http: HttpClient,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private cm: CommonService) {
  }
  ngOnInit() {
    this.listSearch({});
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {

    let url = MODEL_MANAGE.getModelList;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.tempSearchParam = data;
    this.http.get(url).subscribe((res:any) =>{
      console.log(res)
      if (res.code == 100) {
        console.log('请求成功')
        this.listLoading1 = false;
        this.dataSet1 = res.data  || [];
        this.totalPages1 = res.total  || 0;
        this.dataSet1.forEach((item) => {
          item.editstate = 0;
          item.startTime = item.startTime == '0000-00-00 00:00:00'? '无':item.startTime;


        });
      }

    });



  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
    console.log(data)
  }

  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }


  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  /**
   * 明细列表当前页数改变的方法
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2, loadTaskCode: this.loadTaskCode});
  }


  /**
   * 明细列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, loadTaskCode: this.loadTaskCode});
  }

  /**
   * 获取明细列表方法
   * @param data
   * @param
   */
  getList2(data: any) {
    this.listLoading2 = true;
    let url = MODEL_MANAGE.getModelItemList;
    let param: any = data;
    this.dataSet2 = [];
    this.http.get(url, param).subscribe((res: any) => {
      this.listLoading2 = false;
      if (res.code == 100) {
        this.dataSet2 = res.data|| [];
        this.totalPages2 = res.total || 0;

      }
    });
  };




  /**
   * 主列表点击触发的方法
   * @param data
   */
  listClick(data: any): void {
    this.selectedList1 = data;
    this.rowid = data.rowid;
    this.getList2({page: 1, length: this.pageSize2, rowid: this.rowid});

  }

  /**
   * 页面按钮点击触发方法
   * @param data
   */
  btnClick(data: any): void {
    // this.buttonId = data.buttonId;
    let list = this.dataSet1.filter((x: any) => x.checked);
    if (data.buttonId != 'Add') {
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal();
        return;
      }
    }



    switch (data.buttonId) {
      case 'Set':
        this.userSet();
        break;

      case 'Add':
        this.flag2 = true;
        this.add();
        break;

      case 'Update':
        this.flag2 = true;
        this.update();
        break;

      case 'Delete':
        this.delete();
        break;


      case 'Save':
        this.save();
        break;

      default:
        break;
    }
  }


  /**
   * 删除
   */
    delete(): void {

    let url = MODEL_MANAGE.deleteModel;

    let configList: any = {'data':this.updateData};

    this.http.post(url, configList).subscribe((res: any) => {
      if (res.code == 100) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.getList1(this.tempSearchParam);
        this.updateData = [];
      }
    });

  }

  /**
   * 新增
   */
    add(): void {
      this.dataSet1.unshift({checked: true});
      this.dataSet1 = [...this.dataSet1];
      this.dataSet1.filter(item=> item.checked)[0].baseUrl = 'http://172.16.10.146:'
      this.updateData = this.dataSet1.filter(item => item.checked);
    }
  /**
   * 修改
   */
        update(): void {
        this.updateData.forEach(item => {
          if (item.editstate == 0) {
            item.editstate = 1;
          }
        });
    }

  /**
   * 保存
   */
    save(): void {
    if (!this.flag2) {
      this.nzMess.error('请新增或者修改一条记录！');
      return;
    }

      if(this.updateData[0].modelName == ''||this.updateData[0].modelName == undefined || this.updateData[0].baseUrl == '' ||this.updateData[0].baseUrl == undefined) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请将数据填写完整后保存！'
        });
        this.destroyTplModal();
        return;
      }

    let url = MODEL_MANAGE.addModel;


    let configpParam: any = {'data':this.updateData};



    this.http.post(url, configpParam).subscribe((res: any) => {
      console.log(res);
      if (res.code == 100) {
        this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.updateData = [];

      }
    });

    this.flag = false;
  }

  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    this.modalValidateForm.reset();
  }

  /**
   * 弹窗取消
   */
  nzOnCancel() {
    this.isVisible = false;
    this.modalDataSet = [];
  }






  /**
   * 创建弹窗
   */
  tipModalCreat(): void {
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '400px',
      nzMaskClosable: true,
      nzClosable: true
    });
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


  /**
   * 查询
   * @param data
   */
  modalListSearch(data: any) {
    // data.page = data.page || 1;
    // data.length = data.length || this.modalPageSize;
    data = this.updateData
    this.getModalList(data[0]);
  }

  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data: any): void {
    let url = MODEL_MANAGE.getModelParamList;
    this.modalTempSearchParam = data;
    this.modalDataSet = [];
    this.modalListLoading = true;
    this.http.post(url, data).subscribe((res: any) => {
      this.modalListLoading = false;
      if (res.code == 100) {
        this.modalDataSet = res.data || [];
        this.modalTotalPages = res.total;
        this.modalDataSet.forEach((item) => {
          item.editstate = 0;
        });
      }
    })
  }


  /**
   * 弹窗按钮点击
   * @param data
   */
  modalBtnClick(data: any) {
    if (data.buttonId != 'Add') {
      if (this.modalUpdateData.length < 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal();
        return;
      }
    }
    switch (data.buttonId) {
      case 'Add':
        this.flag=true;
        this.btnAdd();
        break;
      case 'Update':
        this.flag=true;
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Save':
        this.btnSave()
      default:
        break;
    }
  }


  /**
   * 弹窗选中数据发生变化
   * @param data
   */
  modalUpdateDatafun(data: any) {
    this.modalUpdateData = data;

  }

  /**
   * 修改
   */
  btnUpdate(): void {
    this.modalUpdateData.forEach(item => {
      if (item.editstate == 0) {
        item.editstate = 1;
      }
    });
  }


  /**
   * 删除
   */
  btnDelete(): void {

    let url = MODEL_MANAGE.deleteParam;
    this.modalUpdateData.forEach((item) => {
      item.modelCode=this.updateData[0].modelCode;
    })
    let configList: any = {'data':this.modalUpdateData};

    this.http.post(url, configList).subscribe((res: any) => {
      if (res.code == 100) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.modalListSearch(this.updateData[0]);
        this.modalUpdateData = [];
      }
    });

  }


  /**
   * 保存
   */
  btnSave(): void {
    if (!this.flag) {
      this.nzMess.error('请新增或者修改一条记录！');
      return;
    }

    let url = MODEL_MANAGE.addModelParam;
    this.modalUpdateData.forEach((item) => {
      item.modelCode=this.updateData[0].modelCode;
    })

    console.log(this.modalUpdateData)
    let configpParam: any = {'data':this.modalUpdateData};



    this.http.post(url, configpParam).subscribe((res: any) => {
      console.log(res);
      if (res.code == 100) {
        this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        // this.listSearch(this.tempSearchParam);
        this.modalUpdateData = [];
        this.modalListSearch(this.updateData[0]);
      }
    });

    this.flag = false;
  }

  /**
   * 配置
   */
  userSet() {
    if(this.updateData.length>1){
      this.nzMess.error('请选择一个模型进行配置！');
      return;
    }
    console.log(this.updateData[0]+'111')
    if(this.updateData[0].rowid == undefined){
      this.nzMess.error('模型未保存，无法配置！');
      return;
    }
    if(this.updateData[0].modelCode =='2' ){
      this.currentTime = Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.stockSet();
      return;
    }
    this.isVisible = true;
    console.log(this.updateData[0])
    this.modalListSearch(this.updateData);
  }

  /**
   * 新增
   */
  btnAdd(): void {
    this.modalDataSet.unshift({checked: true});
    this.modalDataSet = [...this.modalDataSet];
    this.modalUpdateData = this.modalDataSet.filter(item => item.checked);
  }

  /**
   * 库存监控配置
   */

  stockSet(){
    this.implistLoading = false;
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }



  /**
   *
   * 获取日期方法
   * @param data
   */
  getSetTime(data: any) {
    console.log(data);

    data = data ==null? new Date():data;
    this.currentTime = Utils.dateFormat(data, 'yyyy-MM-dd HH:mm:ss');
    console.log(this.currentTime);
  }

  setParam(){
   this.implistLoading = false;
  // let url = 'http://192.168.21.195:9230/adjustNoticeStockDate';
    let url = MODEL_MANAGE.updateStockParam;
    let data: any = {'noticeStockDate':this.currentTime};
    this.http.post(url, data).subscribe((res: any) => {
      if (res.code == 100) {
        this.nz.create('success', '提示信息', '配置成功', {nzDuration: 3000});
        this.tplModal.destroy();
      }
    });

  }
}
