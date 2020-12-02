import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@service/common.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { WAREHOUSEURL } from '../../../../common/model/warehouseUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';



export interface TreeNodeInterface {
  matKindCode: any;
  matKindName: any;
  kindName: any;
  remark: any;
  status: any;
  revisor: any;
  reviseTime: any;
  level: number;
  expand: boolean;
  parent: any;
  check: boolean;
  children?: TreeNodeInterface[];



}

@Component({
  selector: 'app-matkind',
  templateUrl: './matkind.component.html',
  styleUrls: ['./matkind.component.css']
})

export class MatkindComponent implements OnInit {


  constructor(private fb: FormBuilder, private cm: CommonService,
    private nz: NzNotificationService,
    private http1: HttpClient,
    private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService, private nm: NzModalService, ) {

  }
  private tempUpdateParam: any;



  tabs: Array<any> = [];
  searchData: any;  // 存储查询的数据
  listLoading = false;
  dataSet: any;
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数
  tplModal: NzModalRef; // 操作成功后弹窗属性
  InsertFormVisible = false; // 新增弹窗
  matKindCode: string;
  matKindName: string;
  editCache: { [key: string]: any } = {}; // 保存取消按钮
  modalValidateForm: FormGroup; // 操作代码集弹窗
  remark: string;
  kindName: string;
  kindCode: string;
  modalType: number;
  subKindName: string;
  subKindCode: string;
  QueueArr: Array<any> = [];
  searchId: number;
  matkindcode: string; // 设置辅助分类时的编码
  auxiliaryNameArr: Array<any> = [];
  InsertFormVisibleFZ = false; // 新增辅助分类编码弹框
  modalTitleFZ: string; // 辅助分类新增标题
  isOkLoading = false; // 辅助分类loading
  Update = false;
  @ViewChild('expandTable') expandTable: ElementRef;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  ageInputTpl = false;
  updateDate: any = [];
  isLeaf: number;

  statusArr1: any = [];
  kindNameArr2: any = [];

  pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");


  statusName: string;

  k: string;

  public dataSetClone = [];


  listOfMapData: any = [];
  kindNameArr: any = [];
  matArr: any = [];
  subArr: any = [];
  kindNameArr1: any = [];    // 物料分类名称下拉选择框
  statusArr: any = [];

  tempSearchData: any = {};


  public saveflag = true;

  modalFormData: Array<any> = [
    {
      name: '物料分类名称', eName: 'matKindName', type: 'input', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '排队大类', eName: 'kindName', type: 'input', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '辅助分类名称', eName: 'auxiliary', type: 'select', validateCon: '请输入辅助分类名称', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];

  @ViewChild('kind') kind: ElementRef;
  @ViewChild('mark') mark: ElementRef;
  @ViewChild('statuss') statuss: ElementRef;


  mapOfExpandedData: { [matKindCode: string]: TreeNodeInterface[] } = {};
  updateDate1: any;


  public staticData = (code: string) => new Observable((observe) => {
    this.getStatic(code, observe);
  })
  private getStatic(code: string, ob?: any) {
    const url = WAREHOUSEURL.GETALLCODESETS;
    const param: any = {codesetCode: code};
    const key = 'itemCname';
    const value = 'itemCode';
    this.http1.post(url, param).subscribe((res: any) => {
        if (res.code === 100) {
          const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
          if (code === 'product_disp.WLFL') { // 状态
            this.statusArr1 = [...data];
          } else if (code === 'product_disp.matkind') { // 排队大类
            this.kindNameArr2 = [...data];
          }
          ob && ob.next(data);
        } else {
          // tslint:disable-next-line: no-unused-expression
          ob && ob.error();
        }
      }
    );
  }
  ngOnInit() {
    this.listSearch(this.tempSearchData);
    // this.getStatic(this.kindNameArr1,'disp.matKind');
    // this.getStatic(this.statusArr, 'status');
    this.http.post(WAREHOUSEURL.GETALLCODESETS, { codesetCode: 'product_disp.WLFL' }).then(res => {
      // debugger;
      console.log(res);
      if (res.success) {
        res.data.data.forEach((item: { itemCname: string; itemCode: string; }) => {
          const data = { name: '', value: '' };
          data.name = item.itemCname;
          data.value = item.itemCode;
          this.statusArr.push(data);
        });
      }
    });
    // this.getStatic(this.QueueArr, 'disp.matKind');
    this.getArr(); // 获取辅助分类数组
    this.modalValidateForm = this.fb.group({});
    // this.modalFormData = this.modalFormData1;//初始化第一个tab页
    for (let i = 0; i < this.modalFormData.length; i++) {
      const validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require) {
        validatorOrOpts.push(Validators.required);
      }
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
    this.http.post(WAREHOUSEURL.GETALLCODESETS, { codesetCode: 'product_disp.matkind' }).then(res => {
      console.log(res);
      if (res.success) {
        res.data.data.forEach((item: { itemCname: string; itemCode: string; }) => {
          const data = { name: '', value: '' };
          data.name = item.itemCname;
          data.value = item.itemCode;
          this.kindNameArr1.push(data);
        });
      }
    });
  }






  listSearch(data) {
    data.page = data.page || 1; // 最好有
    data.length = data.length || this.pageSize; // 最好有
    this.tempSearchData = data;
    // console.log(this.auxiliaryNameArr);
    this.getListSearch(data);

  }
  getListSearch(data) {
    // debugger;
    this.updateDate = [];
    this.Update = false;
    const url = WAREHOUSEURL.GETFINISHPRODUCT;
    // this.is = true;
    this.dataSet = [];
    // this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.listLoading = false;
        this.dataSetClone = [];
        const dataSet =  res.data.data && res.data.data.data || [];
        // this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        dataSet.forEach((x: any) => {
          this.dataSetClone = [...this.dataSetClone, {...x}];
          x.editstate = 0;
        });
        this.dataSet = [...dataSet];
        this.dataSet.map(x => {x.selectShow = false ; x.editstate = 0 ; }); }
    });

  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          // tslint:disable-next-line:no-non-null-assertion
          const target = array.find(a => a.matKindCode === d.matKindCode)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    } else {
      if (data.matKindCode.length === 5) {
        this.listOfMapData.forEach(ele => {
          this.mapOfExpandedData[ele.matKindCode].forEach(item => {
            if (item.matKindCode.length === 5) {
              if (item.matKindCode !== data.matKindCode) {
                item.expand = false;
              }
            }
          });
        });

      }
    }
  }

  updateDataResult(data: any) {
    this.updateDate = data;
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false, check: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node, check: false });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.matKindCode]) {
      hashMap[node.matKindCode] = true;
      array.push(node);
    }
  }

  // 修改方法
  update(data: any, flag: number) {

    this.tempUpdateParam = { ...data };
    console.log(this.dataSetClone);
    const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
    console.log(d);
    console.log(data);
    if (flag === 1) {
      data.editstate = 1;
      data.saveflag = true;
      data.kindName = data.kindCode;
      data.statusName = data.status;

    } else {
      data.editstate = 0;
      let test: any;
      this.kindNameArr1.forEach(item => {
        if (item.value === d[0].kindCode) {
          test = item .name;
        }
      });
      data.kindName = test;
      data.remark = d[0].remark;
      // console.log(data);
      let ttest: any;
      this.statusArr1.forEach(item => {
        if (item.value === d[0].status) {
          ttest = item .name;
        }
      });
      data.statusName = ttest;
      // data.warehouseCode = this.tempUpdateParam.warehouseCode;
      data.saveflag = false;
      console.log(data);
   /*   data.kindName = this.tempUpdateParam.kindName;
      data.remark = this.tempUpdateParam.remark;
      data.status = this.tempUpdateParam.status;*/

    }


    // data.kindName=data.kindCode;
    // this.k = data.kindCode;
    // data.selectShow = true;
  }
  // 新增子项
  addData(data) {
    this.modalType = 2;
    this.kindName = data.kindName;
    this.kindCode = data.kindCode;

    this.InsertFormVisible = true;
  }
  btnClick(data: any) {
    console.log(data.buttonId);
    switch (data.buttonId) {
      case 'Add':
        this.adddata();
        break;
      case 'Update':
        this.addUpdate();
        break;
      case 'Save':
        this.addSave();
        break;
      case 'Set':
        this.addSet();
        break;
      case 'Delete':
        this.addDelete();
        break;
      case 'Cancel':
        this.doCancel(this.updateDate[0]);
    }
  }
  addUpdate() {
    // tslint:disable-next-line:triple-equals
    if (this.updateDate.length != 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    this.updateDate1 = this.updateDate[0];
    this.Update = true;
    this.update(this.updateDate[0], 1);
  }
  addSave() {
    // tslint:disable-next-line:triple-equals
    if (this.updateDate.length != 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    this.Update = false;
    this.saveData1(this.updateDate[0]);
  }


  //  设置辅助分类方法

  addSet() {
    if (this.updateDate.length !== 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    if (this.updateDate[0].matKindCode.length !== 14) {
      this.nz.error('提示信息', '请勾选一条第三级数据');
      return;
    }
    this.addFz(this.updateDate[0]);
  }

  // 删除方法

  addDelete() {

    // tslint:disable-next-line:triple-equals
    if (this.updateDate.length != 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }

    //   在这里更正
    const d = this.dataSetClone.filter((x: any) => x.rowid === this.updateDate[0].rowid);
    console.log(d);
    // debugger;
    if(d[0].statusName === '成品启用'){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '该数据未作废，不能进行删除！'
      });
    }

    // if (this.cm.canOperate(this.updateDate, 'statusName', ['成品启用'], '该数据未作废，不能进行删除！')) {
    //   return;
    // }


     if (d[0].status === 'product_disp_WLFL10' || d[0].statusName === '成品启用') {
       return;
     }
    this.deleteData(this.updateDate[0]);
  }

  // 新增物料
  adddata() {
    // console.log('123456')
    this.modalType = 1;
    this.InsertFormVisible = true;
  }
  // 新增弹框时取消把数据清空
  quitData(): void {
    this.matKindCode = '';
    this.matKindName = '';
    this.remark = '';
    this.kindName = '';
    this.kindCode = '';
    this.InsertFormVisible = false;
  }




  // 新增弹框时点击保存
  saveData() {
    if (this.matKindName !== undefined && this.matKindName !== '' && this.matKindName.length > 64) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的成品分类名称请不要超过64位!'
      });
      return;
    }
    if ((this.matKindCode !== undefined && this.matKindCode !== '') && ((this.matKindCode.length > 10))) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的成品编码请不要超过10位!'
      });
      return;
    }
    if(this.pattern.test(this.matKindCode)){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的成品编码不能含有特殊字符,请重新输入!'
      });
      return;
    }

    if (this.matKindName === undefined || this.matKindName === '') {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '成品名称不能为空,请重新输入!'
      });
      return;
    }
    if (this.matKindCode === undefined || this.matKindCode === '') {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '成品编码不能为空,请重新输入!'
      });
      return;
    }

    if (this.remark.length > 90){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的备注超长,请重新输入!',
      });
      return;
    }


    if (this.matKindCode.length > 3) {
      this.isLeaf = 1;
    } else {
      this.isLeaf = 0;
    }

    const data1: any = {
      matKindName: this.matKindName,
      matKindCode: this.matKindCode,
      remark: this.remark,
      kindCode: this.kindCode,
      enterpriseId: this.info.APPINFO.USER.companyId,

    };



    let test: any;
    this.kindNameArr1.forEach(item => {
      if (item.value === this.kindCode) {
        test = item .name;
      }
    });
    data1.kindName = test;

    if ((data1.kindName === undefined) || (data1.kindName === null) || (data1.kindName === '')) {
      data1.kindName = ' ';
    }
    if ((this.kindCode === undefined) || (this.kindCode === null) || (this.kindCode === '')) {
      data1.kindCode = ' ';
    }


    if (typeof data1.remark === 'undefined') {
      data1.remark = ' ';
    }

    data1.subKindCode = ' ';
    data1.subKindName = ' ';

    data1.enterpriseId = this.info.APPINFO.USER.companyId;
    data1.revisor = this.info.APPINFO.USER.name;
    data1.isLeaf = this.isLeaf;


    data1.bk1 = ' ';
    data1.bk2 = ' ';
    data1.bk3 = ' ';
    data1.parent = ' ';

    console.log(this.kindCode + 'this is kindCode');
    console.log('11111' + data1.revisor);
    this.listLoading = true;
    const url = WAREHOUSEURL.ADDFINISHPRODUCT;
    const params = { url: url, data: data1, method: 'POST' };
    this.http.request(params).then(
      (res: any) => {
        console.log(data1);
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          this.listSearch(this.tempSearchData);
          this.listLoading = false;
          this.matKindName = '';
          this.matKindCode = '';
          this.kindName = '';
          this.remark = '';
          this.kindCode = '';
          this.destroyTplModal();
          console.log('0000000');
          // 查询
          this.InsertFormVisible = false;
        } else {
          this.listLoading = false;
        }
      }
    );

  }

  destroyTplModal(): void {// 提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }



  // 取消保存
  cancle(data: any) {
    if (this.editCache[data].data.status === 'productDispWLFL10') {
      this.editCache[data].data.status = '成品启用';
    } else {
      this.editCache[data].data.status = '成品作废';
    }
    this.kindNameArr1.forEach(item => {
      if (this.editCache[data].data.kindName === item.value) {
        this.editCache[data].data.kindName = item.name;
      }
    });
    this.editCache[data].edit = false;
  }

  saveData1(data) {
    // debugger;
    // console.log(this.editCache[data].data);
    // this.editCache[data].edit = true;
    // data.kindCode = this.k;
    const param: any = data;
    const rowid: any = data.rowid;
    // param.kindCode = this.k;
    // param.kindName = this.kindNameArr1.filter(function (item) {
    //    item.itemCode = param.kindCode;
    //    return item.name;
    // })
    if (param.kindName !== '') {
      if (data.kindName === null) {
        param.revisor = this.info.APPINFO.USER.name;
        param.rowid = rowid;
        param.kindCode = ' ';
        param.kindName = ' ';
        this.http.post(WAREHOUSEURL.UPDATEFINISHPRODUCT, param).then(
          (res: any) => {
            // console.log(this.rowid);
            if (res.success) {

              this.tplModal = this.nm.info({
                nzTitle: '提示信息',
                nzContent: '修改成功'
              });
              this.listSearch(this.tempSearchData);
            }
          }
        );
        this.listSearch(this.tempSearchData);
        return;
      }

      const reg =  /[a-zA-Z0-9_]{1,10}$/;
      console.log(data);

      param.kindName = this.kindNameArr1.filter(x => x.value === data.kindName)[0].name;
/*        if (reg.test(data.kindName)) {

        }*/
        console.log(param.kindCode + param.kindName);

  } else {
      param.kindCode = ' ';
      param.kindName = ' ';
    }
    // if ()
    param.revisor = this.info.APPINFO.USER.name;
    param.rowid = rowid;
    // console.log(data);return;
    // data.kindCode=data.kindName;
    this.http.post(WAREHOUSEURL.UPDATEFINISHPRODUCT, param).then(
      (res: any) => {
        // console.log(this.rowid);
        if (res.success) {

          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
          this.listSearch(this.tempSearchData);
        }
      }
    );
  }

  columns(data: any[]) {
    /*let kind = data.filter(x => x.colEname === 'kindName')
    kind[0].tdTemplate = this.kind;
   /!* let mark = data.filter(x => x.colEname === 'remark')
    mark[0].tdTemplate = this.mark;*!/
    let statuss = data.filter(x => x.colEname === 'status')
    statuss[0].tdTemplate = this.statuss;
    //this.columnsArr = data;*/
  }


  updateEditCache(data: any): void {
    data.forEach(item => {
      this.editCache[item.matKindCode] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  // 获取静态数据
/*  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, { valueSetCode: valueSetCode }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }*/


  getArr() {
    // this.http.post(WAREHOUSEURL.SETFZSORTFINISHPRODUCT, {}).then(
    //   (res: any) => {
    //     if (res.success) {
    //       console.log(res.data.data)
    //       res.data.data.forEach(item => {
    //         this.auxiliaryNameArr.push(item)
    //       })
    //     }
    //   }
    // );
  }

  deleteData(data: any) {
    console.log(data);
    const param: any = { id: data.id };
    param.rowid = data.rowid;
    this.http.post(WAREHOUSEURL.DELETEFINISHPRODUCT, param).then(res => {
      if (res.success) {
        this.nz.success('提示信息', res.data.data);
        this.listSearch(this.tempSearchData);
      }
    });
  }

  // 设置辅助分类弹框
  addFz(data: any) {
    console.log(data);
    this.searchId = data.id;
    this.matkindcode = data.matKindCode;
    this.modalValidateForm.patchValue(data);
    this.InsertFormVisibleFZ = true;
  }
  closeResult(): void {
    this.modalValidateForm.reset();
  }
  // 数据弹出框取消
  handleCancel(): void {
    this.InsertFormVisibleFZ = false;
  }
  fzChange(data: any) {
    this.subKindCode = data;
    this.subKindName = null;
    this.auxiliaryNameArr.forEach(element => {
      if (this.subKindCode === element.codesetCode) {
        this.subKindName = element.codesetDesc;
      }
    });
    console.log(this.subKindName + '' + this.subKindCode);
  }
  handleOk() {

    // tslint:disable-next-line:forin
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status === 'INVALID') {
      return;
    }


    this.isOkLoading = true;
    const data: any = {};
    data.id = this.searchId;
    data.matKindCode = this.matkindcode;
    data.auxiliary = this.subKindCode;
    data.auxiliaryName = this.subKindName;
    data.revisor = this.info.APPINFO.USER.name;
    this.http.post(WAREHOUSEURL.MATKINDUPDATEFZ, data).then(res => {
      if (res.success) {
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '设置辅助分类成功'
        });
        this.InsertFormVisibleFZ = false;
        this.listSearch(this.tempSearchData);
        this.destroyTplModal();
      }
      this.isOkLoading = false;
    });
  }
  checkAll(value: boolean) {
    this.listOfMapData.forEach(data => {
      this.mapOfExpandedData[data.matKindCode].forEach(item => {
        item.check = value;
      });
    });
    this.refreshStatus();
  }
  refreshStatus() {
    let count = 0;
    let sumCount = 0;
    const arr: any = [];
    this.listOfMapData.forEach(data => {
      this.mapOfExpandedData[data.matKindCode].forEach(item => {
        if (item.check) {
          count++;
          arr.push(item);
        }
      });
      sumCount += this.mapOfExpandedData[data.matKindCode].length;
    });
    this.updateDate = arr;
    if (count === 0) {
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = false;
      return;
    }
    if (count < sumCount) {
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = true;
    } else {
      this.isAllDisplayDataChecked = true;
      this.isIndeterminate = false;
    }

  }

  private doCancel(data: any) {
    data.editstate = 0;
    this.Update = true;
    this.listSearch(this.tempSearchData);
  }

  save(data: any) {
    // debugger;
    const param = {...data};
    param.status = data.statusName;
    param.kindCode = data.kindName;
    this.kindNameArr1.map(x => {
      if (x.value === param.kindCode) {
        param.kindName = x.name;
      }
    });
    this.statusArr1.map(x => {
      if (x.value === param.status) {
        param.statusName = x.name;
      }
    });
    if (param.status === null) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请填写成品状态'
      });
      return;
    }
    if (param.remark.length > 90) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的备注超长，请重新输入'
      });
      return;
    }
    if (param.kindCode === null || param.kindName === null){
      param.kindName = ' ';
      param.kindCode = ' ';
    }
    this.http1.post(WAREHOUSEURL.UPDATEFINISHPRODUCT, {...param}).subscribe(
      (res: any) => {
        data.btnloading = false;
        if (res.code === 100) {
          this.modal.success({
            nzTitle: '提示信息',
            nzContent: res.msg
          });
          data.saveflag = false;
          data.selectShow = false;
          data.editstate = 0;
          this.listSearch(this.tempSearchData);
        }
      });
  }
}
