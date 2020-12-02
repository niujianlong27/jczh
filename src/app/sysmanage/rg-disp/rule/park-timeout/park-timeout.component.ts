import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../../../../common/services/common.service';
@Component({
  selector: 'app-park-timeout',
  templateUrl: './park-timeout.component.html',
  styleUrls: ['./park-timeout.component.css']
})
export class ParkTimeoutComponent implements OnInit {

  nodes: Array<any> = [];
  matArr: Array<any> = [];
  subArr: Array<any> = [];
  kindNameArr: Array<any> = [];
  listLoading: boolean = false
  dataSet: any = []
  tempSearchParam: any
  totalPage: any

  updateData:Object={};

  UpdateArr:Array<any>=[];
  saveFlag:boolean=true;

  deleteVisible: boolean = false;//删除弹框
  deletemodaltitle: string;//弹框的标题
  finishCon: string;//弹窗文字内容
  deleteId:string;

  // hidden:{[key:number]:any} = {};//保存取消按钮
  pageSize: any = 30;
  InsertFormVisible: boolean = false;//新增弹框
  subKindArr: Array<any> = [];
  parkArr: Array<any> = [];
  truckArr: Array<any> = [];
  kindCode: String;
  kindName: String;
  queueArr: Array<any> = [];
  gateArr: Array<any> = [];
  subKindCode: String;
  subKindName: String;
  truckKind: String;
  truckKindName: String;
  isOkLoading: boolean = false;
  modalTitle: String;
  parkCode: String;
  parkName: String;
  tplModal: NzModalRef;//操作成功后弹窗属性
  expandKeys = ['100', '1001'];
  modalValidateForm: FormGroup;//新增弹窗
  modalFormData: Array<any> = [
    {
      name: '分类名称', eName: 'kindCode', type: 'select', validateCon: '请选择分类名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    // {
    //   name: '辅助分类', eName: 'subKindCode', type: 'select', validateCon: '请选择辅助分类名称', require: true,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    {
      name: '可用停车场', eName: 'parkCode', type: 'select', validateCon: '请选择可入厂大门', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '是否取消排队', eName: 'unconfirmedRequeue', type: 'select', validateCon: '请选择处理类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '超时时长', eName: 'timeout', type: 'number', validateCon: '请填写超时时长', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    }
  ];
  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService, private nm: NzModalService, private nz: NzNotificationService,private cm: CommonService, ) {

  }


  getallCodeset() {
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
            } else {
              this.subArr.push(element);
            }

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

    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.feigang' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.subKindArr.push(item);
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.park' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.parkArr.push(item);
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.truckKind' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.truckArr.push(item);
          });
        }
      }
    )
  }

  ngOnInit() {
    this.getallCodeset();
    this.listSearch({ page: 1, length: this.pageSize });
    this.modalValidateForm = this.fb.group({});
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }

  listSearch(data: any) {
    this.saveFlag=true;
    this.UpdateArr=[];
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getListSearch(data);
  }

  getListSearch(data: any) {
    this.listLoading = true;
    this.http.post(RGDISPURL.PARKGETRECORDS, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.dataSet.map(x => x.editstate = 0);
          for (var i = 0; i < this.dataSet.length; i++) {
            if (this.dataSet[i].status == 'CSCL10') {
              this.dataSet[i].status = '启用'
            } else if (this.dataSet[i].status == 'CSCL20') {
              this.dataSet[i].status = '作废'
            }
            if (this.dataSet[i].unconfirmedRequeue == 'true') {
              this.dataSet[i].unconfirmedRequeue = '是'
            } else if (this.dataSet[i].unconfirmedRequeue == 'false') {
              this.dataSet[i].unconfirmedRequeue = '否'
            }

          }
        } else {
          this.listLoading = false;
        }
      }
    )
  }

  //修改按钮
    update(data){
    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    this.saveFlag=false;
    // let data=this.updateData;
    //this.hidden[flag] = true;
    data.editstate = 1;
    if (data.status == '启用') {
      data.status = 'CSCL10'
    } else if (data.status == '作废') {
      data.status = 'CSCL20'
    }
    if (data.unconfirmedRequeue == '是') {
      data.unconfirmedRequeue = 'true'
    } else if (data.unconfirmedRequeue == '否') (
      data.unconfirmedRequeue = 'false'
    )
  }

  //取消保存
  cancle(data, flag = null) {
    // this.hidden[flag] = false;
    data.editstate = 0;
    this.listSearch({ page: 1, length: this.pageSize });
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
              this.deleteBtn();
              break;
    }
  }
  addData() {
    this.InsertFormVisible = true;
    console.log('xinzeng');
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 数据弹出框取消
  handleCancel(): void {
    this.InsertFormVisible = false;
  }

  onChange(data): void {
    console.log(data);
    this.kindCode = data;
    this.kindNameArr.forEach(element => {
      if (this.kindCode == element.itemCode) {
        this.kindName = element.itemCname
      }
    });
  }

  // subChange(data) {
  //   console.log(data)
  //   this.subKindCode = data;
  //   this.subArr.forEach(element => {
  //     if (this.subKindCode == element.itemCode) {
  //       this.subKindName = element.itemCname
  //     }
  //   });
  // }

  parkChange(data) {
    console.log(data)
    this.parkCode = data;
    this.parkArr.forEach(element => {
      if (this.parkCode == element.itemCode) {
        this.parkName = element.itemCname
      }
    });
    console.log(this.parkName)
  }

  truckChange(data) {
    console.log(data)
    this.truckKind = data;
    this.truckArr.forEach(element => {
      if (this.truckKind == element.itemCode) {
        this.truckKindName = element.itemCname
      }
    });

  }

  handleOk() {
    const data = { ...this.modalValidateForm.getRawValue() };
    if (data.kindCode == '' || data.kindCode == undefined || data.parkCode == '' || data.parkCode == undefined || data.unconfirmedRequeue == '' || data.unconfirmedRequeue == undefined || data.timeout == '' || data.timeout == undefined) {
      this.tplModal = this.nm.warning({
        nzTitle: '警告信息',
        nzContent: '请把信息填写完整!'
      });
      return;
    }
    data.kindName = this.kindName;
    data.parkName = this.parkName;
    data.truckKindName = this.truckKindName;
    data.recRevisor = this.info.APPINFO.USER.name;
    this.listLoading = true;
    const url = RGDISPURL.PARKINSERT;
    const params = { url: url, data: data, method: 'POST' };
    console.log(this.modalValidateForm.getRawValue())
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          this.listLoading = false;
          this.kindCode = "";
          this.kindName = '';
          this.destroyTplModal();
          console.log("0000000")
          this.InsertFormVisible = false;
        } else {
          this.listLoading = false;
        }
        this.listSearch({ page: 1, length: this.pageSize });
      }
    )
  }

  destroyTplModal() {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  saveData(data) {
    //let data=this.UpdateArr[0];
    this.UpdateArr=[];
    data.recRevisor = this.info.APPINFO.USER.name;
    if (this.cm.canOperate([ data ], 'unconfirmedRequeue', [ '', undefined, null ], '请确认是否取消排队')) {
      return;
    }
    if (this.cm.canOperate([ data ], 'status', [ '', undefined, null ], '状态不能为空，请重新填写')) {
      return;
    }
    if (this.cm.canOperate([ data ], 'timeout', [ '', undefined, null ], '超时时长不能为空，请重新填写')) {
      return;
    }
    data.editstate = 0;
    console.log(data + "00000000000000000000000000000000000")
    this.http.post(RGDISPURL.PARKUPDATE, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
          this.saveFlag=true;
          this.listSearch({ page: 1, length: this.pageSize });
        }
      }
    )
  }

  //删除按钮
  deleteBtn() {
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
    let data=this.UpdateArr[0];
    this.deletemodaltitle = '提示信息';
    this.finishCon = '是否删除此数据';
    this.deleteId=data.id;
    this.deleteVisible = true;
  }
  //删除方法
  deleteData(data) {
    //console.log(data)
    if ('ok' == data.type) {
      this.http.post(RGDISPURL.PARKDELETE, {id:this.deleteId}).then(
        (res: any) => {
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.deleteVisible = false;
            this.listSearch({ page: 1, length: this.pageSize });
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
