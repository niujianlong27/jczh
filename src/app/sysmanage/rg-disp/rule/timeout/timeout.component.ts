import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Utils } from '../../../../common/util/utils';
import { GlobalService } from 'src/app/common/services/global-service.service';
@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css']
})
export class TimeoutComponent implements OnInit {
  themeArrZ = [];
  listLoading: boolean = false;
  inqu: any = {};
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tplModal: NzModalRef;//操作成功后弹窗属性
  pageNUm: number;//当前页面序号
  //hidden:{[key:number]:any} = {};
  //private columnsArr: any[] = [];
  InsertFormVisible: boolean = false;

  deleteVisible: boolean = false;//删除弹框
  deletemodaltitle: string;//弹框的标题
  finishCon: string;//弹窗文字内容
  deleteId:string;

  @ViewChild('timeout1') timeout1:ElementRef;
  @ViewChild('dealValue1') dealValue1:ElementRef;
  @ViewChild('dealCount1') dealCount1:ElementRef;

  UpdateArr:Array<any>=[];
  saveFlag:boolean=true;


  kindCode: String;
  kindName: String;
  gateName: String;
  gateCode: String;
  timeout: String;
  dealType: String;
  modalTitle: String;
  isOkLoading: String;
  dealValue: number;
  dealCount: number;
  QueueArr: Array<any> = [];
  statusArr: Array<any> = [];
  expandKeys = ['100', '1001'];
  nodes = [

  ];//一级品种
  matArr = [];//二级品种
  subArr = [];//三级品种
  modalValidateForm: FormGroup;//新增代码集弹窗
  GateArr: Array<any> = [];

  kindNameArr: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '分类名称', eName: 'kindCode', type: 'select', validateCon: '请输入分类名称', require: true,
      validators: {
        require: true,
        pattern: false,

      }
    },

    {
      name: '进厂大门', eName: 'gateName', type: 'select', validateCon: '请输入进厂大门', require: true,
      validators: {
        require: true,
        pattern: false,

      }
    },

    {
      name: '超时时长(分)', eName: 'timeout', type: 'num', validateCon: '请输入超时处理方式', require: true,
      validators: {
        require: true,
        pattern: false,

      }
    },

    {
      name: '超时处理方式', eName: 'dealType', type: 'select', validateCon: '请输入超时处理方式', require: true,
      validators: {
        require: true,
        pattern: false,

      }
    },

    {
      name: '顺延时长(分)', eName: 'dealValue', type: 'num', validateCon: '请输入顺延时长', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '顺延次数', eName: 'dealCount', type: 'num', validateCon: '顺延次数', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },


  ];

  modalFormData1: Array<any> = Utils.deepCopy(this.modalFormData);//把modalFormData复制给modalFormData1


  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService, private nm: NzModalService,private globalSer: GlobalService ) {
    // this.listSearch({ page: 1, length: this.pageSize });
    this.getallCodest();
    this.query();
  }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));

    }

  }


  //下拉选择,"顺延时长"多弹出俩个字段;"取消排队"不弹
  modelChange(val: any) {
    console.log(val + '113')
    this.dealType = val;
    var arrayObj = new Array();
    arrayObj = Utils.deepCopy(this.modalFormData1);
    if (val == 'disp_dealType_addMinutes') {
      this.modalFormData = Utils.deepCopy(arrayObj);

      // this.modalFormData=this.modalFormData.slice(0,7);
      this.modalFormData = this.modalFormData.slice(0, 6);

    } else if (val == 'disp_dealType_cancel') {
      this.modalFormData = arrayObj;

      // let deleArr = [...arrayObj.slice(5,7)]
      let deleArr = [...arrayObj.slice(4, 6)]

      // this.modalFormData=this.modalFormData.slice(0,5);
      this.modalFormData = this.modalFormData.slice(0, 4);
      deleArr.map((data: any) => {
        this.modalValidateForm.setControl(data.eName, null);
      })
    }

    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

  }

  columns(data: any[]) {
      let timeout = data.filter(x => x.colEname === 'timeout')
      timeout[0].tdTemplate = this.timeout1;
      let dealValue = data.filter(x => x.colEname === 'dealValue')
      dealValue[0].tdTemplate = this.dealValue1;
      let dealCount = data.filter(x => x.colEname === 'dealCount')
      dealCount[0].tdTemplate = this.dealCount1;
    //this.columnsArr = data;
  }
  query() {
    this.saveFlag=true;
    this.UpdateArr=[];
    // data=this.inqu;
    // data.page = data.page || 1; //最好有
    // data.length = data.length || this.pageSize; //最好有
    //this.getListSearch(data);
    // this.inqu.page = this.pageNUm || 1; //最好有
    // this.inqu.length = this.pageSize //最好有
    // this.getListSearch();
    this.inqu.page = 1; //最好有
     this.pageNUm=1;
     this.inqu.length = this.pageSize || 30;//最好有

     this.globalSer.pageNumEmitter.emit({
      formId: 'form_rgDisp_warehouseRequired',
      gridId: 'grid1',
      length: this.inqu.length,
      page: 1,
      search: true
    });
     this.getListSearch();
  }

  // pageSizeEmit(data: number) {
  //   console.log(data);
  //   this.pageSize = data;
  // }
  // pageIndexEmit(data: number) {
  //   console.log(data);
  //   this.pageNUm = data;
  //   this.query();
  // }
  pageSizeEmit(data:number){
    console.log(data);
    this.pageSize=data;
 }
 pageIndexEmit(data:number){
   console.log(data);
   this.pageNUm=data;
   this.inqu.page=this.pageNUm;
   this.inqu.length = this.pageSize;
   //this.inqu.page=this.
   this.getListSearch();
 }


  getListSearch() {
    this.listLoading = true;
    this.http.post(RGDISPURL.TIMEOUTGETRECORDS, this.inqu).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.dataSet.map(x => x.editstate = 0);
          this.dataSet.map(x => x.dealType == 'disp_dealType_cancel' ? x.dealType = '取消排队' : x.dealType = '顺延时长');
          this.dataSet.map(x => x.status == 'CSCL10' ? x.status = '启用' : x.status = '作废');
          this.dataSet.forEach(item=>{
            item.selectShow = false;
          })
        }
      }
    )
  }


  btnClick(data) {
    console.log(data)
    switch (data.buttonId) {
      case 'Add':
        this.addData();
       break;
        case 'Update':
          this.update(this.UpdateArr[0]);
          break;
          case 'Save':
            this.saveData(this.dataSet.filter(x=>x.editstate==1)[0])
            break;
            case 'Delete':
              this.deleteBtn(this.UpdateArr[0]);
              break;
    }
  }

  addData() {
    console.log('123');
    this.InsertFormVisible = true;
  }


  //修改方法
  update(data, flag = null) {
    // this.hidden[flag] = true;
    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'          
      });
      return;
    }
    this.saveFlag=false;

    data.editstate = 1;
    data.selectShow = true
    //    const dealValue = this.columnsArr.filter(x => x.colEname === 'dealValue');
    //    const dealCount = this.columnsArr.filter(x => x.colEname === 'dealCount');
    //  if(data.dealType == '取消排队'){

    //   dealCount[0].edit = 'BJBJ20';
    //   dealValue[0].edit = 'BJBJ20';
    //  }else{
    //   dealCount[0].edit = 'BJBJ10';
    //   dealValue[0].edit = 'BJBJ10';
    //  }

    data.gateName = data.gateCode;
    if (data.dealType == '取消排队') {
      data.dealType = 'disp_dealType_cancel';
    }else if(data.dealType == '顺延时长'){
      data.dealType = 'disp_dealType_addMinutes';
    }
    if (data.status == '启用') {
      data.status = 'CSCL10'
    } else {
      data.status = 'CSCL20'
    }

    console.log(data.dealType)

  }
  cancle(data, flag = null) {
    //this.hidden[flag] = false;
    data.editstate = 0;
    data.selectShow = false;
    // this.listSearch({ page: 1, length: this.pageSize });
    this.query();
  }
  saveData(data, flag = null) {
    console.log(data)
    //debugger
    //this.dataSet.map(x => x.status == '启用' ? x.dealType='CSCL10': x.dealType='CSCL20');
    //this.hidden[flag] = false;
    console.log(data.gateName)
    if(data.gateName==''||data.gateName==undefined||data.dealType==undefined||data.dealType==''||data.status==''||data.status==undefined){
      this.tplModal = this.nm.warning({
        nzTitle: '警告信息',
        nzContent: '请把信息填写完整'
      });
      return;
    }
    data.editstate = 0;
    if(data.dealType == 'disp_dealType_cancel') {
      data.dealCount = null;
      data.dealValue = null;
    }
    console.log(data.dealType)
    console.log(data);
    data.gateCode = data.gateName;
    data.recRevisor = this.info.APPINFO.USER.name;
    data.recReviseTime = new Date();
    this.http.post(RGDISPURL.TIMEOUTUPDATE, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;1  
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
          // this.listSearch({ page: 1, length: this.pageSize });
        }
        this.query();
      }
    )
  }


  //新增方法
  saveData1() {
    let param= this.modalValidateForm.getRawValue();
    console.log(param)
    if (param.kindCode == '' || param.kindCode == undefined || this.gateCode == ''||this.gateCode == undefined || this.gateName == undefined||this.gateName == '' || param.timeout == '' || param.timeout == undefined || param.dealType == '' || param.dealType == undefined) {
      this.tplModal = this.nm.warning({
        nzTitle: '警告信息',
        nzContent: '请把信息填写完整!'
      });
      console.log(this.kindCode+'kindCode')
      console.log(this.gateCode+'gateCode')
      console.log(this.gateName+'gateName')
      console.log(this.timeout+'timeout')
      console.log(this.dealType+'dealType')
      console.log(this.dealValue+'dealValue')
      console.log(this.dealCount+'dealCount')
      return;
    }
    if (param.dealType == 'disp_dealType_addMinutes') {
      if (param.dealValue == undefined || param.dealCount == undefined || param.dealValue == '' || param.dealCount == '') {
        this.tplModal = this.nm.warning({
          nzTitle: '警告信息',
          nzContent: '请把信息填写完整!'
        });
        return;
      }
    }
    const data1: any = {
      kindCode: this.kindCode,
      kindName: this.kindName,
      gateName: this.gateName,
      gateCode: this.gateCode,
      timeout: param.timeout,
      dealType: param.dealType,
      dealValue: param.dealValue,
      dealCount: param.dealCount,
      status: 'CSCL10',
      recRevisor: this.info.APPINFO.USER.name,
    }
    this.listLoading = true;
    const url = RGDISPURL.TIMEOUTINSERT;
    const params = { url: url, data: data1, method: 'POST' };
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });

          this.listLoading = false;
          this.kindCode = "";
          this.gateName = "";
          this.timeout = "";
          this.dealType = "";
          this.destroyTplModal();
          console.log("0000000")
          //查询
          this.InsertFormVisible = false;
          // this.listSearch();
        } else {
          this.listLoading = false;
        }
        // this.listSearch({ page: 1, length: this.pageSize });
        this.query();
      }
    )

  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  onChange(data): void {
    console.log(data);
    this.kindCode = data;
    this.kindNameArr.forEach(element => {
      if (this.kindCode == element.itemCode) {
        this.kindName = element.itemCname
      }
    });
  }


  getallCodest(): void {
    //下拉框
    this.http.post(RGDISPURL.MATKINDGETALL, {}).then(
      (res: any) => {
        if (res.success) {

          console.log(res.data.data)
          res.data.data.forEach(element => {
            const ite: any = {};
            ite.itemCname = element.matKindName;
            ite.itemCode = element.matKindCode;
            this.kindNameArr.push(ite);
            //排队大类名称
            if (element.matKindCode.length == 3) {
              this.nodes.push({
                title: element.matKindName,
                key: element.matKindCode,
                children: []
              });
            } else if (element.matKindCode.length == 5) {
              this.matArr.push(element);
              // console.log(element+'二级');
            } else {
              this.subArr.push(element);
            }
            //console.log(this.matArr)



          });
          this.nodes.forEach(element => {
            this.matArr.forEach(secondElement => {
              if (secondElement.matKindCode.slice(0, 3) === element.key) {
                element.children.push(
                  {
                    title: secondElement.matKindName,
                    key: secondElement.matKindCode,
                    children: []
                  }
                );
              }
            })
          })
          // console.log(this.matArr);
          // console.log(this.subArr);
          //  this.subArr.forEach(ele =>{
          //    console.log(ele.matKindCode.slice(0,5))
          //  })
          //  this.matArr.forEach(ele =>{
          //    console.log(ele.key)
          //  })

          console.log(this.nodes)
          this.nodes.forEach(element => {
            element.children.forEach(ele => {
              this.subArr.forEach(secondElement => {
                if (secondElement.matKindCode.slice(0, 5) == ele.key) {
                  ele.children.push(
                    {
                      title: secondElement.matKindName,
                      key: secondElement.matKindCode,
                      isLeaf: true
                    }
                  );
                }
              })

            })

          })




        }
      }
    )


    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.gate' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.GateArr.push(item);
            console.log(this.GateArr)
          });
        }
      }
    )

    // this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.CSCL'}).then(
    //   (res: any) => {
    //     if (res.success) {
    //       console.log(res.data.data)
    //       res.data.data.forEach(element => {
    //         //排队大类名称
    //           const item: any = {};
    //           item.itemCname = element.itemCname;
    //           item.itemCode = element.itemCode;
    //           this.statusArr.push(item);
    //           console.log( this.statusArr)
    //       });
    //     }
    //   }   
    // )


  }



  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 数据弹出框取消
  handleCancel(): void {
    this.InsertFormVisible = false;
  }

  // 数据弹出框相关
  handleOk(): void {

    this.saveData1();
  }


  gateChange(data) {
    console.log(data)
    this.gateCode = data;
    this.GateArr.forEach(element => {
      if (this.gateCode == element.itemCode) {
        this.gateName = element.itemCname
      }
    });
    console.log(this.gateName + '' + this.gateCode)
  }


    //删除按钮
    deleteBtn(data) {

      if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后删除'          
      });
      return;
    }
    if(this.UpdateArr[0].status!='作废'){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '只能删除作废的数据'          
      });
      return;
    }
    
      this.deletemodaltitle = '提示信息';
      this.finishCon = '是否删除此数据';
      this.deleteId=data.id;
      this.deleteVisible = true;
    }
    //删除方法
    deleteData(data) {
      //console.log(data)
      if ('ok' == data.type) {
        this.http.post(RGDISPURL.TIMEOUTDELETE, {id:this.deleteId}).then(
          (res: any) => {
            if (res.success) {
              this.tplModal = this.nm.info({
                nzTitle: '提示信息',
                nzContent: '操作成功'
              });
              this.deleteVisible = false;
             this.query();
            }
          }
        )
      }else if('cancel' == data.type){
        console.log('取消')
        this.deleteVisible = false;
      }
    }

    updateDataResult(data:any){
      this.UpdateArr=data;
    }
   
}
