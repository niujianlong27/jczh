import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {XlsxService} from '../../../../components/simple-page/simple-page-form.module';
import {NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {urls} from '../../../../common/model/url';
import {format} from 'date-fns';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {logging, utils} from 'protractor';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-entrust',
  templateUrl: './add-entrust.component.html',
  styleUrls: ['./add-entrust.component.css'],
  providers: [
    XlsxService
  ]
})
export class AddEntrustComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  addenForm: FormGroup;
  data1: any[] = [];                        //货盘明细
  columns1: any = {};
  data2: any[] = [];                        //捆包明细
  data3: any[] = [];                        //主列表
  columns2: any = {};
  tabIndex: number = 0;
  exportLoading:boolean;
  flowLoading:boolean;
  consignorCompany: any;                    //委托人公司
  pierList: any[] = [];                     // 港口列表
  AddressList: any[] = [];                  //码头列表
  pierPage: number = 1;
  pierText: string = '';
  AddressText: string = '';
  pierLoading: boolean = false;
  addressLoading: boolean = false;
  isCopyUpdate: boolean = false;
  formId: string = 'add_pending_resources'; //默认
  palletNo: string = '';                    //要修改的货盘号
  btn: any = {};
  pid: string = "";
  startPid: string = "";
  endPid: string = "";

  constructor(private xlsx: XlsxService, private nzMess: NzNotificationService, private fb: FormBuilder, private http: HttpUtilService, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.addenForm = this.fb.group({
      consignorCompanyId: [null, [Validators.required]],
      transType: [null, [Validators.required]],
      startPoint: [null, [Validators.required]],
      startAddress: [null, [Validators.required]],
      endPoint: [null, [Validators.required]],
      endAddress: [null, [Validators.required]],
      loadDateStart: [null, [Validators.required]],
      loadDateEnd: [null, [Validators.required]],
      shipSociety: [null, [Validators.required]],
      targetDate: [null, [Validators.required]],
      settleNode: [null, [Validators.required]],
      loadDays: [null, [Validators.required]],
      shipAge: [null, [Validators.required]],
      shipmentTerm: [null, [Validators.required]],
      demurrageFee: [null, [Validators.required]],
      demurrageFeeType: [null, [Validators.required]],
      demurrageFeePoing: [null, [Validators.required]],
    });
    this.route.queryParams.subscribe(x => {
      this.btn = x;
      if (x.palletNo) {
        this.isCopyUpdate = true;
        this.formId = 'add_pending_resources';
        this.http.post(urls.palletFind, {palletNo: x.palletNo}).then((res: any) => {
          if (res.success) {
            this.data3 = [];
            this.data3.push(res.data.data || {});
            this.btn.btnId === "Update" && (this.palletNo = res.data.data.palletNo);
            // x.btnId === 'Update' && this.data3.push(res.data.data || {});
            // x.btnId === 'Update' && (this.palletNo = res.data.data.palletNo);
            this.data1 = res.data.data.palletItemModelList || [];
            this.data2 = res.data.data.palletPackModelList || [];
            this.addenForm.patchValue(res.data.data || {});
            this.endPid = res.data.data.endPoint;
            this.startPid = res.data.data.startPoint;
            this.consignorCompany = res.data.data.companyName
            this.pierList = [{
              pierId: res.data.data.startPoint,
              address: res.data.data.startPointStr
            }, {
              pierId: res.data.data.endPoint,
              address: res.data.data.endPointStr
            }];
            this.AddressList = [{
              pierId: res.data.data.startAddress,
              address: res.data.data.startAddressStr2
            }, {
              pierId: res.data.data.endAddress,
              address: res.data.data.endAddressStr2
            }];
            this.addenForm.get('startPoint').setValue(this.pierList[0]);
            this.addenForm.get('endPoint').setValue(this.pierList[1]);
            this.addenForm.get('startAddress').setValue(this.AddressList[0]);
            this.addenForm.get('endAddress').setValue(this.AddressList[1]);
          }
        })

      } else {
        this.isCopyUpdate = false;
        this.data3 = [];
        this.data1 = [];
        this.data2 = [];
      }
    });
  }

  getCompanyId(data: any) {
    this.addenForm.get('consignorCompanyId').setValue(data.inpValue);
  }

  add() {
    this.palletNo = '';
    this.addenForm.reset();
    this.consignorCompany = '';
    this.data1 = [];
    this.data2 = [];
  }
  save() {        //保存按钮方法
    let boolone: boolean = true;
    let booltwo: boolean = true;
    for (const i in this.addenForm.controls) {
      this.addenForm.controls[i].markAsDirty();
      this.addenForm.controls[i].updateValueAndValidity();
      this.addenForm.controls[i].value === null && (boolone = false);
      if (this.addenForm.controls["loadDays"].value != null && Number(this.addenForm.controls["loadDays"].value) % 1 != 0) {
        return this.nzMess.create('error', '提示信息', '装载天数必须是整数');
      }
    }
    if (boolone) {
      let data = Utils.deepCopy(this.data1);   //货盘明细数据
      data.length == 0 && this.nzMess.create('error', '提示信息', '请添加货盘明细');
      data.forEach((item: any) => {
        if (booltwo) {
          for (let ins in item) {
            if (item['productName'] === "") {
              this.nzMess.create('error', '提示信息', '品名信息不能为空');
              booltwo = false;
              break;
            }
          }
        }
      });
      if (booltwo) {
        data.map((x: any) => {   // orderTenderPacks 通过捆包汇成的明细有这个属性
          x.pretenderItemModelList = x.orderTenderPacks;
        });
        let url = urls.pretenderpalletAdd;
        let params = Utils.deepCopy(this.addenForm.value);
        params.endPoint = this.addenForm.value.endPoint && this.addenForm.value.endPoint.pierId;
        params.startPoint = this.addenForm.value.endPoint && this.addenForm.value.startPoint.pierId;
        params.endAddress = this.addenForm.value.endAddress && this.addenForm.value.endAddress.pierId;
        params.startAddress = this.addenForm.value.startAddress && this.addenForm.value.startAddress.pierId;

        params.loadDateEnd = format(this.addenForm.value.loadDateEnd, 'YYYY-MM-DD HH:mm:ss');
        params.loadDateStart = format(this.addenForm.value.loadDateStart, 'YYYY-MM-DD HH:mm:ss');
        params.targetDate = format(this.addenForm.value.targetDate, 'YYYY-MM-DD HH:mm:ss');
        params.palletItemModelList = data;//货盘明细
        params.palletNo = this.palletNo;
        if (this.palletNo) {    //修改接口
          url = urls.batchUpdate;
        }
        this.http.post(url, params).then((res: any) => {
          if (res.success) {
            this.nzMess.remove();
            this.palletNo ? this.nzMess.create('success', '提示信息', '修改成功！') : this.nzMess.create('success', '提示信息', '保存成功！');
            let palletNo = res.data.data && res.data.data.palletNo;
            let data3 = this.data3.filter((x: any) => x.palletNo != palletNo);
            this.palletNo = palletNo;
            res.data.data && data3.unshift(res.data.data);
            this.data3 = data3;
            this.data1 = [];
            this.data1 = Utils.deepCopy(res.data.data && res.data.data.palletItemModelList || []);
            this.isCopyUpdate && this.router.navigate(['system/trans/entrust-manage/publishEntrust']);
            //发布修改和复制成功后返回页面
          }
        });
      }
    }
  }

  data3Click(data: any) {//列表点击
    this.data1 = data.palletItemModelList;
    this.data2 = data.palletPackModelList;
    this.palletNo = data.palletNo;      //要修改的货盘号
    this.addenForm.patchValue(data);
    this.packAdd(this.data1);
    this.consignorCompany = data.companyName;
    this.pierList = [{
      pierId: data.startPoint,
      address: data.startPointStr
    }, {
      pierId: data.endPoint,
      address: data.endPointStr
    }];
    this.AddressList = [{
      pierId: data.startAddress,
      address: data.startAddressStr2
    }, {
      pierId: data.endAddress,
      address: data.endAddressStr2
    }];
    this.addenForm.get('startPoint').setValue(this.pierList[0]);
    this.addenForm.get('endPoint').setValue(this.pierList[1]);
    this.addenForm.get('startAddress').setValue(this.AddressList[0]);
    this.addenForm.get('endAddress').setValue(this.AddressList[1]);

  }

  getColums(data: any, type: number) {
    let col = Array.isArray(data) ? data : [];
    if (type == 1) {
      this.columns1 = {};
      col.map((x: any) => {
        this.columns1[x.colEname] = null;
        x.colEname === 'productName' && (x.required = true); //品名必填
      });
    } else {
      this.columns2 = {};
      col.map((x: any) => {
        this.columns2[x.colEname] = '';
      });
    }
  }

  addData(type: number) {
    //增加明细
    type == 1 ? this.data1.unshift(Object.assign({}, this.columns1)) : this.data2.unshift(Object.assign({}, this.columns2));
    type == 1 ? this.data1 = [...this.data1] : this.data2 = [...this.data2];
  }

  deleteData(type: number) {
    //删除货盘明细
    if (type == 1) {
      this.data1.forEach((item: any) => {
        if (item.checked && item.collectType) {
          this.data2 = this.data2.filter((x: any) => !x.checked)
        }
      })
      this.data1 = this.data1.filter((x: any) => !x.checked);
    } else {
      this.data2 = this.data2.filter((x: any) => !x.checked);
    }
  }

  openFile() {                //打开文件

    this.inputFile.nativeElement.click();
  };


  importExcel(file: any) {
    /**
     * 导入表格字段顺序不变，按照下列顺序
     * 品名 productName ，外径 outerDiameter，壁厚 thickness，米重density，长度lengthSpec，捆数bundleNo，支数/捆bundleCount，总支数bundleTotal，重量goodsWeight，打包方式packType，备注remark
     */
    let xls = file.target.files[0];
    this.xlsx.import(xls).then((x: any) => {
      let key = Object.keys(x);
      let data = x[key[0]];
      if (!data) {
        this.nzMess.remove();
        this.nzMess.create('error', '提示信息', '读取Excel数据失败！未读取到sheet页!');
        this.inputFile.nativeElement.value = '';
        return;
      }
      if (!this.validateData(data)) {
        this.nzMess.create('error', '提示信息', '读取Excel数据失败！未读取到sheet页!');
        this.inputFile.nativeElement.value = '';
        return;
      }
      this.excelFilter(data);
      this.inputFile.nativeElement.value = '';
    });
  }

  validateData(data: string[]) {
    data.some((x) => {
      if (!x[0]) { //品名不能为空 ，默认第一个就是品名
        return false;
      }
    });
    return true;
  }

  excelFilter(x: string[]) {
    for (let i = 1; i < x.length; i++) {
      let temp: any = Utils.deepCopy(this.columns2);
      temp.productName = x[i][0];
      temp.outerDiameter = x[i][1];
      temp.thickness = x[i][2];
      temp.density = x[i][3];
      temp.lengthSpec = x[i][4];
      temp.bundleNo = x[i][5];
      temp.bundleCount = x[i][6];
      temp.bundleTotal = x[i][7];
      temp.goodsWeight = x[i][8];
      temp.packType = x[i][9];
      temp.remark = x[i][10];
      this.data2.unshift(temp);
    }
    this.data2 = [...this.data2];
    this.exportLoading = false;
  }

  flowData1() { //汇成
    this.flowLoading = true;
    let arr = Utils.deepCopy(this.data2);
    let obj: any = {}, store: any = {}, result = [];
    arr.map((x: any) => {
      let id = x.productName.trim() + x.specDesc.trim();
      let copy = Utils.deepCopy(x);
      if (!obj[id]) {
        store[id] = [];
        store[id].push(copy);
        obj[id] = true;
      } else {
        store[id].push(copy);
      }
    });

    for (let i in store) {
      let col1: any = Utils.deepCopy(this.columns1);
      col1.productName = store[i][0].productName;
      col1.specDesc = store[i][0].specDesc;
      let remark = [], productType = [], containerType = [], containerNo = [];
      store[i].map((s: any) => {
        remark.push(s.remark);
        productType.push(s.productType);
        containerType.push(s.containerType);
        containerNo.push(s.containerNo);
        col1.goodsWeight = Utils.add(col1.goodsWeight, s.goodsWeight);
        col1.goodsNo = Utils.add(col1.goodsNo || 0, s.goodsNo  || 0);
      });
      // col1.remark = remark.join(','); 备注不汇总
      //   col1.productType = productType.join(',');
      //   col1.containerType = containerType.join(',');
      //  col1.containerNo = containerNo.join(',');
      // col1.orderTenderPacks = store[i];
      // col1.collectType = true;//true表示汇总形成的
      col1.orderTenderPacks = store[i];
      col1.packFlag = 1;//1表示汇总形成的
      col1.inputDisabled = { //货盘不可更改
        'productName':true,
        'specDesc':true,
        'productType':true,
        'containerType' : true,
        'containerNo':true,
        'goodsWeight' : true,
        'goodsNo':true
      };
      result.push(col1);


    }
    //加入data1
    this.data1 = this.data1.filter(x => !x.collectType); //清除之前汇总的
    this.data1 = [...result, ...this.data1];
    this.tabIndex = 0;
    window.setTimeout(()=>{
      this.flowLoading = false;
    })
  }

  openAddress(open: boolean, type: number) { //获取码头
    this.pid = type == 1 ? this.startPid : this.endPid;
    this.AddressText = '';
    this.pierPage = 0;
    open && this.getAddress();
  }

  searchAddress(address: string) {   // 输入框查找码头
    this.AddressText = address;
    this.pierPage = 0;
    this.getAddress();
  }

  getAddress() {// 码头加载
    this.pierPage++;
    this.AddressList = [];
    this.pid ? this.addressLoading = true : this.addressLoading = false;
    if (this.pid) {
      this.addressLoading = true;
      this.http.post(urls.getPierBytwo, {
        address: this.AddressText,
        pId: this.pid,
        page: this.pierPage,
        length: 30
      }).then((res: any) => {
        if (res.success) {
          this.addressLoading = false;
          let list = Utils.deepCopy(res.data.data && res.data.data.data || []);
          this.AddressList = [...this.AddressList, ...list];
        }
      });
    }
  }

  openPier(open: boolean, type: number) {         //获取港口
    this.pierText = '';
    type == 1 ? this.addenForm.get('startAddress').setValue('') :
      this.addenForm.get('endAddress').setValue("");
    this.pierPage = 0;
    open && this.getPier();
  }

  getPier() {  //港口加载更多
    this.pierPage++;
    this.pierLoading = true;
    this.pierList = [];
    this.http.post(urls.getPierBy, {
      address: this.pierText,
      page: this.pierPage,
      length: 30
    }).then((res: any) => {
      ;
      if (res.success) {
        this.pierLoading = false;
        let list = Utils.deepCopy(res.data.data && res.data.data.data || []);
        this.pierList = [...this.pierList, ...list];
      }
    });
  }

  searchPier(address: string) {   // 输入框查找港口
    this.pierText = address;
    this.pierPage = 0;
    this.getPier();
  }

  getdata(data: any, type: number) {   //选择框选择港口触发
    if (data) {
      type == 1 ? this.startPid = data.pierId : this.endPid = data.pierId;
    }
  }

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.addenForm.value.loadDateEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.addenForm.value.loadDateEnd === "string") {
      let data = new Date(Date.parse(this.addenForm.value.loadDateEnd));
      this.addenForm.value.loadDateEnd = data
    }
    return (startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000)) || (startValue.getTime() > this.addenForm.value.loadDateEnd.getTime());

  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.addenForm.value.loadDateStart) {
      return false;
    }
    if (typeof this.addenForm.value.loadDateStart === "string") {
      let data = new Date(Date.parse(this.addenForm.value.loadDateStart));
      ;
      this.addenForm.value.loadDateStart = data;
    }
    return endValue.getTime() <= this.addenForm.value.loadDateStart.getTime();
  }

  private packAdd(data:any){
    // console.log(data)
    data.map((y:any)=>{
      y.palletPackModelList ? y.orderTenderPacks = y.palletPackModelList : null;//捆包明细
      if(y.packFlag == 1){ //货盘不可更改
        y.inputDisabled = {
          'productName':true,
          'specDesc':true,
          'productType':true,
          'containerType' : true,
          'containerNo':true,
          'goodsWeight' : true,
          'goodsNo':true
        };
      }
    })
  }

}



